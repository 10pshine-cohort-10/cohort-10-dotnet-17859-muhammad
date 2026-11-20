using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Docket.Application.Auth;
using Docket.Infrastructure.Auth;

namespace Docket.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController(
    IAuthService authService,
    IValidator<RegisterRequest> registerValidator,
    IValidator<LoginRequest> loginValidator,
    IWebHostEnvironment environment,
    IOptions<JwtOptions> jwtOptions) : ControllerBase
{
    private const string RefreshCookieName = "docket_refresh";
    private const string RefreshCookiePath = "/api/v1/auth";

    [HttpPost("register")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await registerValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return ValidationProblem(ToValidationProblem(validation));
        }

        var result = await authService.RegisterAsync(request, cancellationToken);
        if (!result.Succeeded)
        {
            return ToErrorResult(result.Error!);
        }

        SetRefreshCookie(result.RefreshToken!);
        return StatusCode(StatusCodes.Status201Created, result.Response);
    }

    [HttpPost("login")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var validation = await loginValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return ValidationProblem(ToValidationProblem(validation));
        }

        var result = await authService.LoginAsync(request, cancellationToken);
        if (!result.Succeeded)
        {
            return ToErrorResult(result.Error!);
        }

        SetRefreshCookie(result.RefreshToken!);
        return Ok(result.Response);
    }

    [HttpPost("refresh")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Refresh(CancellationToken cancellationToken)
    {
        var result = await authService.RefreshAsync(Request.Cookies[RefreshCookieName], cancellationToken);
        if (!result.Succeeded)
        {
            DeleteRefreshCookie();
            return ToErrorResult(result.Error!);
        }

        SetRefreshCookie(result.RefreshToken!);
        return Ok(result.Response);
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await authService.LogoutAsync(Request.Cookies[RefreshCookieName], cancellationToken);
        DeleteRefreshCookie();
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType<UserProfile>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserProfile>> Me(CancellationToken cancellationToken)
    {
        var subject = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(subject, out var userId))
        {
            return Unauthorized();
        }

        var profile = await authService.GetProfileAsync(userId, cancellationToken);
        return profile is null ? NotFound() : Ok(profile);
    }

    private void SetRefreshCookie(string token)
    {
        Response.Cookies.Append(RefreshCookieName, token, BuildCookieOptions(DateTimeOffset.UtcNow.AddDays(jwtOptions.Value.RefreshTokenDays)));
    }

    private void DeleteRefreshCookie()
    {
        Response.Cookies.Delete(RefreshCookieName, BuildCookieOptions(expires: null));
    }

    private CookieOptions BuildCookieOptions(DateTimeOffset? expires) => new()
    {
        HttpOnly = true,
        Secure = !environment.IsDevelopment() && !environment.IsEnvironment("Testing"),
        SameSite = SameSiteMode.Lax,
        Path = RefreshCookiePath,
        Expires = expires
    };

    private static ValidationProblemDetails ToValidationProblem(ValidationResult validation)
    {
        var errors = validation.Errors
            .GroupBy(error => JsonNamingPolicy.CamelCase.ConvertName(error.PropertyName))
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.ErrorMessage).ToArray());

        return new ValidationProblemDetails(errors);
    }

    private static ObjectResult ToErrorResult(AuthError error)
    {
        var problem = new ProblemDetails
        {
            Status = error.StatusCode,
            Title = error.Message,
            Type = $"https://httpstatuses.com/{error.StatusCode}"
        };
        problem.Extensions["code"] = error.Code;

        return new ObjectResult(problem) { StatusCode = error.StatusCode };
    }
}
