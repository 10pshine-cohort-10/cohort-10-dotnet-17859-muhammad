using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Docket.Api.Errors;

/// <summary>
/// Converts unhandled exceptions into an RFC 7807 response without leaking internals.
/// </summary>
internal sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var traceId = httpContext.TraceIdentifier;

        logger.LogError(
            exception,
            "Unhandled exception for {Method} {Path}. TraceId {TraceId}",
            httpContext.Request.Method,
            httpContext.Request.Path,
            traceId);

        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An unexpected error occurred.",
            Type = "https://httpstatuses.com/500",
            Instance = httpContext.Request.Path
        };

        problem.Extensions["traceId"] = traceId;

        httpContext.Response.StatusCode = problem.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
    }
}
