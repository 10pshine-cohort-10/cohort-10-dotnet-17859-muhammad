using Docket.Application.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Docket.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    /// <summary>
    /// Applies migrations and seeds the two roles. Used in Development and Testing only;
    /// production runs migrations as a separate deploy step.
    /// </summary>
    public static async Task InitializeDatabaseAsync(
        this IServiceProvider services,
        CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();

        var database = scope.ServiceProvider.GetRequiredService<DocketDbContext>();
        await database.Database.MigrateAsync(cancellationToken);

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        foreach (var role in Roles.All)
        {
            if (await roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            var result = await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(
                    $"Could not create the '{role}' role: {string.Join("; ", result.Errors.Select(error => error.Description))}");
            }
        }
    }
}
