#!/usr/bin/env bash
# Pre-merge gate. Run from the repository root; must exit non-zero if anything fails.
set -euo pipefail

dotnet format backend/Docket.sln --verify-no-changes
dotnet build backend/Docket.sln --configuration Release
dotnet test backend/Docket.Tests/Docket.Tests.csproj --configuration Release --no-build
