@echo off
:: Inicia el backend (FastAPI) y el frontend (Vite) en ventanas separadas

echo Iniciando Backend (FastAPI + Uvicorn)...
start "Backend - FastAPI" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --port 8000"

echo Iniciando Frontend (React + Vite)...
start "Frontend - Vite" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Ambos servicios iniciados.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo.
