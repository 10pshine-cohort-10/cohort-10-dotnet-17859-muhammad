using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Docket.Tests.Smoke;

public sealed class HealthEndpointTests : IClassFixture<HealthEndpointTests.HealthApiFactory>
{
    private readonly HttpClient _client;

    public HealthEndpointTests(HealthApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_endpoint_should_report_healthy()
    {
        var response = await _client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        (await response.Content.ReadAsStringAsync()).Should().Be("Healthy");
    }

    /// <summary>Hosts the API without a database, so it runs on every OS in CI.</summary>
    public sealed class HealthApiFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.UseSetting("Database:InitializeOnStartup", "false");
            builder.UseSetting(
                "ConnectionStrings:Default",
                "Server=127.0.0.1,1;Database=Docket;User Id=sa;Password=unused;TrustServerCertificate=True");
            builder.UseSetting("Jwt:Issuer", "Docket.Tests");
            builder.UseSetting("Jwt:Audience", "Docket.Tests");
            builder.UseSetting("Jwt:SigningKey", "smoke-test-signing-key-0123456789abcdef");
        }
    }
}
