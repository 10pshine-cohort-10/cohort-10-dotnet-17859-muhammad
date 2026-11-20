# Docket — Task Management System

A full-stack task manager: ASP.NET Core 10 API, React 19 SPA, EF Core on SQL Server,
Serilog logging, and a test suite built with xUnit, Vitest, and Playwright.

> Status: Week 1 — foundation. Authentication is the next slice.

## Stack

| Layer | Technology |
| --- | --- |
| API | ASP.NET Core 10, controllers, OpenAPI + Scalar |
| Data | EF Core 10, SQL Server 2022 |
| Auth | ASP.NET Core Identity, JWT + refresh tokens |
| Logging | Serilog → console + Seq |
| Backend tests | xUnit, FluentAssertions, NSubstitute, Testcontainers, Respawn |
| Frontend | React 19, TypeScript, Vite, Tailwind, TanStack Query |
| Frontend tests | Vitest, Testing Library, Playwright |
| Quality | SonarQube, coverage gates, Impeccable detector |

## Prerequisites

- .NET 10 SDK (`global.json` pins the feature band)
- Node.js 22 or newer
- Docker with Compose v2
- Linux only: `libicu` (Ubuntu: `libicu78`)

## Getting started

```bash
cp .env.example .env          # local values; .env is git-ignored
docker compose up -d          # SQL Server, Seq, Mailpit, SonarQube
dotnet run --project backend/Docket.Api
```

| Service | URL |
| --- | --- |
| API | http://localhost:5003 |
| OpenAPI UI | http://localhost:5003/scalar (Development) |
| Health | http://localhost:5003/health |
| Seq | http://localhost:5341 |
| Mailpit | http://localhost:8025 |
| SonarQube | http://localhost:9000 (admin/admin on first run) |

The API runs on the host; SQL Server, Seq, Mailpit, and SonarQube run in containers.

## Build and test

```bash
dotnet build backend/Docket.sln
dotnet test backend/Docket.Tests/Docket.Tests.csproj
./scripts/verify.sh          # what must pass before merging into main
```

Windows: `./scripts/verify.ps1`.

## Repository layout

```
backend/
  Docket.Domain/          entities, enums, invariants — no dependencies
  Docket.Application/     use cases, DTOs, validators, abstractions
  Docket.Infrastructure/  EF Core, Identity, JWT, email, jobs
  Docket.Api/             controllers, middleware, DI, OpenAPI
  Docket.Tests/           unit, integration, architecture, E2E-facing tests
frontend/                React SPA (added in the next slice)
deploy/                  containers and deployment assets
docs/                    ADRs and design notes
compose.yaml             local SQL Server, Seq, Mailpit, SonarQube
```

## Roles

Exactly two roles: `Admin` and `User`.

- `User` sees and manages only their own tasks.
- `Admin` sees and manages every task and every user.

## Authentication

| Method | Route | Notes |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Creates a `User`, returns tokens, sets refresh cookie |
| `POST` | `/api/v1/auth/login` | Returns an access token, sets refresh cookie |
| `POST` | `/api/v1/auth/refresh` | Rotates the refresh token; reuse revokes the family |
| `POST` | `/api/v1/auth/logout` | Revokes the refresh token and clears the cookie |
| `GET` | `/api/v1/auth/me` | Requires `Authorization: Bearer <access token>` |
| `GET` | `/api/v1/admin/ping` | Requires the `Admin` role |

Access tokens live 15 minutes and are signed with HS256. Refresh tokens live 7 days, are
stored as SHA-256 hashes, and travel in an `HttpOnly`, `SameSite=Lax` cookie scoped to
`/api/v1/auth`. The development signing key in `appsettings.Development.json` is for local
use only; production must supply `Jwt__SigningKey` (32+ characters) through the environment.

## Testing notes

Unit tests and the health smoke test need no Docker. Auth integration tests start a real
SQL Server container with Testcontainers; on a machine without Docker run:

```bash
dotnet test backend/Docket.Tests/Docket.Tests.csproj --filter "Category!=Integration"
```

CI runs the full suite on Linux and unit tests on macOS and Windows.

## Logging

Serilog writes structured logs to the console and to Seq at `http://localhost:5342`
(ingestion). Request logging includes method, path, status, and elapsed time; unhandled
exceptions are logged with a trace id and returned as RFC 7807 `ProblemDetails` without
internal details.

## License

Assignment project — not licensed for redistribution.
