@echo off
setlocal
cd /d "%~dp0"

echo === openeam.it - build produzione ===

where node >nul 2>nul
if errorlevel 1 (
    echo ERRORE: Node.js non trovato nel PATH.
    goto :fail
)

if not exist node_modules (
    echo [1/3] Installazione dipendenze ^(npm ci^)...
    call npm ci
    if errorlevel 1 goto :fail
) else (
    echo [1/3] node_modules presente, salto install.
)

echo [2/3] Pulizia dist...
if exist dist rmdir /s /q dist
if exist dist (
    echo ERRORE: impossibile cancellare dist ^(file in uso?^).
    goto :fail
)

echo [3/3] Build ^(astro build^)...
call npm run build
if errorlevel 1 goto :fail

if not exist dist\index.html (
    echo ERRORE: build terminata ma dist\index.html mancante.
    goto :fail
)

echo.
echo === BUILD OK ===
echo Output: %~dp0dist
echo Copia il CONTENUTO di dist\ nella root del sito IIS.
echo.
pause
exit /b 0

:fail
echo.
echo === BUILD FALLITA ===
pause
exit /b 1
