using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Docket.Tests.Infrastructure;

public static class ApiTestClient
{
    public const string ValidPassword = "Str0ng!Passw0rd";

    public static HttpClient CreateClient(WebApplicationFactory<Program> factory)
        => factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = false });

    public static async Task<AuthPayload> RegisterAsync(
        this HttpClient client,
        string? email = null,
        string displayName = "Test User")
    {
        var response = await client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = email ?? UniqueEmail(),
            password = ValidPassword,
            displayName
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        return await ReadAuthAsync(response);
    }

    public static async Task<AuthPayload> LoginAsync(this HttpClient client, string email)
    {
        var response = await client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            email,
            password = ValidPassword
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        return await ReadAuthAsync(response);
    }

    public static async Task<AuthPayload> ReadAuthAsync(HttpResponseMessage response)
    {
        var payload = await response.Content.ReadFromJsonAsync<AuthPayload>();
        payload.Should().NotBeNull();
        payload!.AccessToken.Should().NotBeNullOrWhiteSpace();
        payload.User.Roles.Should().Contain("User");
        return payload;
    }

    public static string? ReadRefreshCookie(HttpResponseMessage response)
        => response.Headers.TryGetValues("Set-Cookie", out var values)
            ? values.Select(v => v.Split(';')[0])
                .FirstOrDefault(v => v.StartsWith("docket_refresh=", StringComparison.Ordinal))
            : null;

    public static HttpClient WithBearer(this HttpClient client, string accessToken)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return client;
    }

    public static HttpRequestMessage WithCookie(this HttpRequestMessage request, string cookie)
    {
        request.Headers.Add("Cookie", cookie);
        return request;
    }

    public static string UniqueEmail() => $"user-{Guid.NewGuid():N}@example.com";

    public static async Task<string> ReadProblemCodeAsync(HttpResponseMessage response)
    {
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return document.RootElement.TryGetProperty("code", out var code)
            ? code.GetString() ?? string.Empty
            : string.Empty;
    }

    public sealed record AuthPayload(string AccessToken, DateTimeOffset ExpiresAtUtc, UserPayload User);

    public sealed record UserPayload(Guid Id, string Email, string DisplayName, string[] Roles);
}
