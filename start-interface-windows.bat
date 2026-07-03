@echo off
setlocal
cd /d "%~dp0bot"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale o Node.js LTS em https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm nao encontrado. Reinstale o Node.js LTS marcando a opcao npm.
  pause
  exit /b 1
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
)

if not exist "node_modules" (
  echo Instalando dependencias do bot...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)

echo Abrindo interface local...
call npm run ui
pause
