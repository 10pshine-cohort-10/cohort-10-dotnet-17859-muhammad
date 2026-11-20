namespace Docket.Application.Auth;

public sealed record AuthError(int StatusCode, string Code, string Message);

public sealed record AuthResult(AuthResponse? Response, string? RefreshToken, AuthError? Error)
{
    public bool Succeeded => Error is null;

    public static AuthResult Success(AuthResponse response, string refreshToken)
        => new(response, refreshToken, null);

    public static AuthResult Failure(int statusCode, string code, string message)
        => new(null, null, new AuthError(statusCode, code, message));
}
