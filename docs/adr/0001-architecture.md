# ADR 0001 — Layered API plus React SPA

- Status: Accepted
- Date: 2026-11-20

## Context

The assignment requires ASP.NET Core, React, EF Core with SQL Server, Serilog, xUnit, and
SonarQube. The product is an authenticated dashboard: search engines do not need to index
it, and all data access goes through a .NET API.

## Decision

1. Backend is a four-project layered solution: `Domain`, `Application`, `Infrastructure`,
   `Api`, with dependencies pointing inward. Tests live in a fifth project.
2. Data access uses EF Core code-first migrations against SQL Server, running in a Linux
   container (`linux/amd64`) so development is identical on Linux, macOS, and Windows.
3. The frontend is a React single-page app built with Vite, served as static files. No
   server-side rendering and no second runtime to deploy.
4. Authentication uses ASP.NET Core Identity with short-lived JWT access tokens and rotating
   refresh tokens.
5. Errors use RFC 7807 `ProblemDetails`; Serilog handles structured logging to console and
   Seq.

## Consequences

- The API is stateless and can scale horizontally; SignalR later needs a Redis backplane.
- Layer boundaries are enforceable with architecture tests.
- The SPA can be hosted on any static host/CDN; the API and SQL Server deploy separately.
- Running SQL Server on Apple Silicon requires `linux/amd64` emulation, which is slower but
  functionally identical.
- No SSR means no SEO, which is irrelevant for an authenticated application.
