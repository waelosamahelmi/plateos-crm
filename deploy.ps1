# PlateOS Demo Deployment Script
# This script deploys to Fly.io with environment variables as build arguments

Write-Host "🚀 PlateOS Demo Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with the required variables." -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env
Write-Host "`n📁 Loading environment variables from .env..." -ForegroundColor Yellow
$envContent = Get-Content ".env"
$envVars = @{}

foreach ($line in $envContent) {
    if ($line -match '^\s*#' -or $line -match '^\s*$') {
        continue
    }
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        # Remove quotes if present
        $value = $value -replace '^["`'']', ''
        $value = $value -replace '["`'']$', ''
        $envVars[$key] = $value
    }
}

# Required variables
$requiredVars = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_OPENROUTER_API_KEY"
)

# Check for required variables
$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not $envVars.ContainsKey($var) -or [string]::IsNullOrWhiteSpace($envVars[$var])) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ Error: Missing required environment variables:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    exit 1
}

Write-Host "✅ All required environment variables found!" -ForegroundColor Green

# Build the fly deploy command with build args
$buildArgs = @()
foreach ($key in $envVars.Keys) {
    if ($key -like "VITE_*") {
        $buildArgs += "--build-arg"
        $buildArgs += "$key=$($envVars[$key])"
    }
}

Write-Host "`n🔨 Building and deploying to Fly.io..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray

# Execute fly deploy with build args
$flyCommand = "fly deploy $($buildArgs -join ' ')"
Write-Host "`nExecuting: fly deploy [with build args]" -ForegroundColor Gray

# Run the command
& fly deploy @buildArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your app is live at: https://plateos-landing-page.fly.dev" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
