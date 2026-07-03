@echo off
setlocal
cd /d "%~dp0"

if not exist "paper.jar" (
  echo Coloque o arquivo do Paper nesta pasta com o nome paper.jar
  pause
  exit /b 1
)

java -Xms2G -Xmx4G -jar paper.jar --nogui
pause
