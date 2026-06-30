# Inicia el backend (FastAPI) y el frontend (Vite) en paralelo

$root    = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"

Write-Host "Iniciando Backend (FastAPI + Uvicorn)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; python -m uvicorn main:app --port 8000" -WindowStyle Normal

Write-Host "Iniciando Frontend (React + Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Ambos servicios iniciados." -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
