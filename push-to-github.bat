@echo off
title Pushing AgroAI to GitHub...
cd /d "%~dp0"

set "PATH=C:\Users\Syman\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;C:\Users\Syman\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\ucrt64\bin;%PATH%"

echo ======================================================================
echo   AgroAI - Pushing Project to GitHub
echo   Target: https://github.com/symanr-hub/vinayakasblessing.git
echo ======================================================================
echo.
echo If a GitHub sign-in window or browser opens, please click 'Authorize'
echo or enter your GitHub credentials.
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo   [SUCCESS] Code pushed successfully to GitHub!
    echo.
    echo   Now go to Vercel (https://vercel.com) and click 'Deploy'!
    echo   The 'repository is empty' error will be gone!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo   [NOTICE] If you need to use a Personal Access Token:
    echo   You can run:
    echo   git push https://<YOUR_GITHUB_TOKEN>@github.com/symanr8-afk/vinayakasblessing.git main
    echo ======================================================================
)

echo.
pause
