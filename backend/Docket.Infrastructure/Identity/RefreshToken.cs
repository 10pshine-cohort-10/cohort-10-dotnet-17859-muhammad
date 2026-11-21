namespace Docket.Infrastructure.Identity;

public sealed class RefreshToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public ApplicationUser User { get; set; } = null!;

    /// <summary>All tokens issued from one login share a family so reuse revokes only that session.</summary>
    public Guid FamilyId { get; set; }

    /// <summary>SHA-256 hash of the raw token. The raw value is never stored.</summary>
    public string TokenHash { get; set; } = string.Empty;

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset ExpiresAtUtc { get; set; }

    public DateTimeOffset? RevokedAtUtc { get; set; }

    public string? ReplacedByTokenHash { get; set; }

    /// <summary>Concurrency token used to claim a refresh token atomically.</summary>
    public byte[] RowVersion { get; set; } = [];

    public bool IsActive(DateTimeOffset now) => RevokedAtUtc is null && now < ExpiresAtUtc;
}
