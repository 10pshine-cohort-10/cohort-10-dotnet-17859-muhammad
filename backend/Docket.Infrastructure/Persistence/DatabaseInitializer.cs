using Docket.Application.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Docket.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    /// <summary>
    /// Applies migrations when asked, then ensures both roles exist. Role seeding runs in
    /// every environment so a fresh production database can register its first user.
    /// </summary>
    public static async Task InitializeDatabaseAsync(
        this IServiceProvider services,
        bool migrate,
        CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();

        if (migrate)
        {
            var database = scope.ServiceProvider.GetRequiredService<DocketDbContext>();
            await database.Database.MigrateAsync(cancellationToken);
        }

        await EnsureRolesAsync(scope.ServiceProvider, cancellationToken);
    }

    private static async Task EnsureRolesAsync(
        IServiceProvider services,
        CancellationToken cancellationToken)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        foreach (var role in Roles.All)
        {
            if (await roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            var result = await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            if (result.Succeeded || await roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            throw new InvalidOperationException(
                $"Could not create the '{role}' role: {string.Join("; ", result.Errors.Select(error => error.Description))}");
        }
    }
}
