param(
    [Parameter(Mandatory=$true)]
    [string]$Deployment
)

Write-Host "=== Build / deploy logs ==="
vercel inspect $Deployment --logs --wait

Write-Host ""
Write-Host "=== Live runtime logs (Ctrl+C to stop) ==="
vercel logs --follow --deployment $Deployment