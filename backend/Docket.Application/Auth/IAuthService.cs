namespace Docket.Application.Auth;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);

    Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken);

    Task<AuthResult> RefreshAsync(string? refreshToken, CancellationToken cancellationToken);

    Task<bool> LogoutAsync(string? refreshToken, CancellationToken cancellationToken);

    Task<UserProfile?> GetProfileAsync(Guid userId, CancellationToken cancellationToken);
}
