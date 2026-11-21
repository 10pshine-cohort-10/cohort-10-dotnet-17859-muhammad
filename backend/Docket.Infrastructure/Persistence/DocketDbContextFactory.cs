using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Docket.Infrastructure.Persistence;

/// <summary>Used only by <c>dotnet ef</c>; runtime configuration comes from the host.</summary>
public sealed class DocketDbContextFactory : IDesignTimeDbContextFactory<DocketDbContext>
{
    public DocketDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Default")
            ?? "Server=localhost,1433;Database=Docket;User Id=sa;Password=Docket_Local_Dev_123!;TrustServerCertificate=True;Encrypt=True";

        var options = new DbContextOptionsBuilder<DocketDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new DocketDbContext(options);
    }
}
