using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Docket.Application.Auth;
using Docket.Infrastructure.Identity;
using Docket.Infrastructure.Persistence;

namespace Docket.Infrastructure.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    DocketDbContext database,
    JwtTokenService tokenService,
    IOptions<JwtOptions> jwtOptions,
    TimeProvider clock) : IAuthService
{
    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<AuthResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim();
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = email,
            UserName = email,
            DisplayName = request.DisplayName.Trim(),
            CreatedAtUtc = clock.GetUtcNow()
        };

        var created = await userManager.CreateAsync(user, request.Password);
        if (!created.Succeeded)
        {
            if (created.Errors.Any(error => error.Code is "DuplicateEmail" or "DuplicateUserName"))
            {
                return AuthResult.Failure(409, "email_taken", "An account with this email already exists.");
            }

            return AuthResult.Failure(
                400,
                "validation_error",
                string.Join(" ", created.Errors.Select(error => error.Description)));
        }

        var assigned = await userManager.AddToRoleAsync(user, Roles.User);
        if (!assigned.Succeeded)
        {
            throw new InvalidOperationException(
                $"Could not assign the '{Roles.User}' role: {string.Join("; ", assigned.Errors.Select(error => error.Description))}");
        }

        return await IssueAsync(user, [Roles.User], cancellationToken);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email.Trim());
        if (user is null)
        {
            return InvalidCredentials();
        }

        if (await userManager.IsLockedOutAsync(user))
        {
            return InvalidCredentials();
        }

        if (!await userManager.CheckPasswordAsync(user, request.Password))
        {
            await userManager.AccessFailedAsync(user);
            return InvalidCredentials();
        }

        await userManager.ResetAccessFailedCountAsync(user);

        var roles = await userManager.GetRolesAsync(user);
        return await IssueAsync(user, roles, cancellationToken);
    }

    public async Task<AuthResult> RefreshAsync(string? refreshToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return InvalidRefreshToken();
        }

        var now = clock.GetUtcNow();
        var hash = Hash(refreshToken);
        var stored = await database.RefreshTokens
            .Include(token => token.User)
            .SingleOrDefaultAsync(token => token.TokenHash == hash, cancellationToken);

        if (stored is null)
        {
            return InvalidRefreshToken();
        }

        if (!stored.IsActive(now))
        {
            // A revoked or expired token was presented: assume reuse and revoke the family.
            await RevokeActiveTokensAsync(stored.UserId, now, cancellationToken);
            return InvalidRefreshToken();
        }

        stored.RevokedAtUtc = now;
        var (rawToken, replacement) = CreateRefreshToken(stored.UserId, now);
        stored.ReplacedByTokenHash = replacement.TokenHash;
        database.RefreshTokens.Add(replacement);

        var roles = await userManager.GetRolesAsync(stored.User);
        var access = tokenService.Create(stored.User, roles);

        await database.SaveChangesAsync(cancellationToken);

        return AuthResult.Success(
            new AuthResponse(access.Value, access.ExpiresAtUtc, Map(stored.User, roles)),
            rawToken);
    }

    public async Task<bool> LogoutAsync(string? refreshToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return false;
        }

        var hash = Hash(refreshToken);
        var stored = await database.RefreshTokens
            .SingleOrDefaultAsync(token => token.TokenHash == hash, cancellationToken);

        if (stored is null)
        {
            return false;
        }

        stored.RevokedAtUtc ??= clock.GetUtcNow();
        await database.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<UserProfile?> GetProfileAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);
        return Map(user, roles);
    }

    private async Task<AuthResult> IssueAsync(
        ApplicationUser user,
        IList<string> roles,
        CancellationToken cancellationToken)
    {
        var now = clock.GetUtcNow();
        var access = tokenService.Create(user, roles);
        var (rawToken, entity) = CreateRefreshToken(user.Id, now);

        database.RefreshTokens.Add(entity);
        await database.SaveChangesAsync(cancellationToken);

        return AuthResult.Success(
            new AuthResponse(access.Value, access.ExpiresAtUtc, Map(user, roles)),
            rawToken);
    }

    private (string RawToken, RefreshToken Entity) CreateRefreshToken(Guid userId, DateTimeOffset now)
    {
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var entity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = Hash(rawToken),
            CreatedAtUtc = now,
            ExpiresAtUtc = now.AddDays(_jwt.RefreshTokenDays)
        };

        return (rawToken, entity);
    }

    private async Task RevokeActiveTokensAsync(Guid userId, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var active = await database.RefreshTokens
            .Where(token => token.UserId == userId && token.RevokedAtUtc == null)
            .ToListAsync(cancellationToken);

        foreach (var token in active)
        {
            token.RevokedAtUtc = now;
        }

        await database.SaveChangesAsync(cancellationToken);
    }

    private static AuthResult InvalidCredentials()
        => AuthResult.Failure(401, "invalid_credentials", "The email or password is incorrect.");

    private static AuthResult InvalidRefreshToken()
        => AuthResult.Failure(401, "invalid_refresh_token", "The refresh token is invalid or expired.");

    private static string Hash(string token)
        => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private static UserProfile Map(ApplicationUser user, IEnumerable<string> roles)
        => new(
            user.Id,
            user.Email ?? string.Empty,
            user.DisplayName,
            roles.OrderBy(role => role, StringComparer.Ordinal).ToArray());
}
