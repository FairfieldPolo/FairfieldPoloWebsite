$latest = (vercel ls | Select-String "https://.*vercel\.app" | Select-Object -First 1).Matches.Value

if (-not $latest) {
    Write-Error "No deployment URL found."
    exit 1
}

Write-Host "Using latest deployment: $latest"
vercel inspect $latest --logs --wait