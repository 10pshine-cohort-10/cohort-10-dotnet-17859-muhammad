using System.Net;
using System.Net.Http.Json;
using Docket.Tests.Infrastructure;
using FluentAssertions;

namespace Docket.Tests.Auth;

[Collection(ApiCollection.Name)]
[Trait("Category", "Integration")]
public sealed class AuthEndpointTests
{
    private readonly ApiFixture _fixture;
    private readonly HttpClient _client;

    public AuthEndpointTests(ApiFixture fixture)
    {
        _fixture = fixture;
        _client = ApiTestClient.CreateClient(fixture.Factory);
    }

    [Fact]
    public async Task Register_should_create_user_and_issue_tokens()
    {
        var email = ApiTestClient.UniqueEmail();

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email,
            password = ApiTestClient.ValidPassword,
            displayName = "Ada Lovelace"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var payload = await ApiTestClient.ReadAuthAsync(response);
        payload.User.Email.Should().Be(email);
        payload.User.DisplayName.Should().Be("Ada Lovelace");
        payload.User.Roles.Should().ContainSingle().Which.Should().Be("User");
        ApiTestClient.ReadRefreshCookie(response).Should().NotBeNull();
    }

    [Fact]
    public async Task Register_should_reject_duplicate_email()
    {
        var payload = await _client.RegisterAsync();
        var email = payload.User.Email;

        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email,
            password = ApiTestClient.ValidPassword,
            displayName = "Duplicate"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
        (await ApiTestClient.ReadProblemCodeAsync(response)).Should().Be("email_taken");
    }

    [Fact]
    public async Task Register_should_reject_weak_password()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = ApiTestClient.UniqueEmail(),
            password = "weak",
            displayName = "Weak"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var body = await response.Content.ReadAsStringAsync();
        body.Should().Contain("password");
    }

    [Fact]
    public async Task Login_should_reject_invalid_password()
    {
        var payload = await _client.RegisterAsync();

        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            email = payload.User.Email,
            password = "Wrong!Passw0rd"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        (await ApiTestClient.ReadProblemCodeAsync(response)).Should().Be("invalid_credentials");
    }

    [Fact]
    public async Task Me_should_return_profile_for_authenticated_user()
    {
        var payload = await _client.RegisterAsync();
        var client = ApiTestClient.CreateClient(_fixture.Factory).WithBearer(payload.AccessToken);

        var response = await client.GetAsync("/api/v1/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var profile = await response.Content.ReadFromJsonAsync<ApiTestClient.UserPayload>();
        profile.Should().NotBeNull();
        profile!.Email.Should().Be(payload.User.Email);
        profile.Roles.Should().Contain("User");
    }

    [Fact]
    public async Task Me_should_reject_missing_token()
    {
        var response = await _client.GetAsync("/api/v1/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Refresh_should_rotate_token_and_reject_reuse()
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = ApiTestClient.UniqueEmail(),
            password = ApiTestClient.ValidPassword,
            displayName = "Refresh User"
        });
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var firstCookie = ApiTestClient.ReadRefreshCookie(registerResponse);
        firstCookie.Should().NotBeNull();

        var refreshResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(firstCookie!));

        refreshResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var rotated = await ApiTestClient.ReadAuthAsync(refreshResponse);
        rotated.AccessToken.Should().NotBeNullOrWhiteSpace();
        var secondCookie = ApiTestClient.ReadRefreshCookie(refreshResponse);
        secondCookie.Should().NotBeNull().And.NotBe(firstCookie);

        var reuseResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(firstCookie!));

        reuseResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Logout_should_revoke_refresh_token()
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = ApiTestClient.UniqueEmail(),
            password = ApiTestClient.ValidPassword,
            displayName = "Logout User"
        });
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var cookie = ApiTestClient.ReadRefreshCookie(registerResponse);
        cookie.Should().NotBeNull();

        var logoutResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/logout").WithCookie(cookie!));
        logoutResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var refreshResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(cookie!));
        refreshResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Register_should_reject_a_name_that_is_too_short_after_trimming()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = ApiTestClient.UniqueEmail(),
            password = ApiTestClient.ValidPassword,
            displayName = " A "
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        (await response.Content.ReadAsStringAsync()).Should().Contain("displayName");
    }

    [Fact]
    public async Task Refresh_reuse_should_revoke_only_the_presented_family()
    {
        var email = ApiTestClient.UniqueEmail();
        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email,
            password = ApiTestClient.ValidPassword,
            displayName = "Family User"
        });
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var firstCookie = ApiTestClient.ReadRefreshCookie(registerResponse);
        firstCookie.Should().NotBeNull();

        var firstRefresh = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(firstCookie!));
        firstRefresh.StatusCode.Should().Be(HttpStatusCode.OK);
        var rotatedCookie = ApiTestClient.ReadRefreshCookie(firstRefresh);
        rotatedCookie.Should().NotBeNull();

        var loginResponse = await _client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            email,
            password = ApiTestClient.ValidPassword
        });
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var otherSessionCookie = ApiTestClient.ReadRefreshCookie(loginResponse);
        otherSessionCookie.Should().NotBeNull();

        var reuseResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(firstCookie!));
        reuseResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var revokedFamilyResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(rotatedCookie!));
        revokedFamilyResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var otherSessionResponse = await _client.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh").WithCookie(otherSessionCookie!));
        otherSessionResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Concurrent_refresh_should_allow_exactly_one_rotation()
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = ApiTestClient.UniqueEmail(),
            password = ApiTestClient.ValidPassword,
            displayName = "Concurrent User"
        });
        registerResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var cookie = ApiTestClient.ReadRefreshCookie(registerResponse);
        cookie.Should().NotBeNull();

        using var firstRequest = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh")
            .WithCookie(cookie!);
        using var secondRequest = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh")
            .WithCookie(cookie!);

        var responses = await Task.WhenAll(
            _client.SendAsync(firstRequest),
            _client.SendAsync(secondRequest));

        responses.Count(response => response.StatusCode == HttpStatusCode.OK).Should().Be(1);
        responses.Count(response => response.StatusCode == HttpStatusCode.Unauthorized).Should().Be(1);

        foreach (var response in responses)
        {
            response.Dispose();
        }
    }

    [Fact]
    public async Task Admin_endpoint_should_be_forbidden_for_regular_user()
    {
        var payload = await _client.RegisterAsync();
        var client = ApiTestClient.CreateClient(_fixture.Factory).WithBearer(payload.AccessToken);

        var response = await client.GetAsync("/api/v1/admin/ping");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
