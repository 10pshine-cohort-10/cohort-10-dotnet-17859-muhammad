# Pre-merge gate for Windows. Run from the repository root.
$ErrorActionPreference = "Stop"

dotnet format backend/Docket.sln --verify-no-changes
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

dotnet build backend/Docket.sln --configuration Release
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

dotnet test backend/Docket.Tests/Docket.Tests.csproj --configuration Release --no-build
exit $LASTEXITCODE
