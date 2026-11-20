namespace Docket.Application.Auth;

/// <summary>Role names used across the application. Exactly two roles exist.</summary>
public static class Roles
{
    public const string Admin = "Admin";
    public const string User = "User";

    public static IReadOnlyList<string> All { get; } = [Admin, User];
}
