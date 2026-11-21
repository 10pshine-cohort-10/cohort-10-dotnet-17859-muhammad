namespace Docket.Application.Auth;

public sealed record UserProfile(Guid Id, string Email, string DisplayName, string[] Roles);

public sealed record AuthResponse(string AccessToken, DateTimeOffset ExpiresAtUtc, UserProfile User);
