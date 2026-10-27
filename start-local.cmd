@echo off
setlocal
cd /d "%~dp0"
if exist "..\runtime\node-v22.15.0-win-x64\node.exe" set "PATH=%~dp0..\runtime\node-v22.15.0-win-x64;%PATH%"
node scripts\serve.mjs
