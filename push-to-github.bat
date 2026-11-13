@echo off
set "PATH=C:\Users\Syman\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;C:\Users\Syman\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\ucrt64\bin;%PATH%"

echo =======================================================
echo Pushing AgroAI to https://github.com/symanr8-afk/vinayakasblessing.git
echo =======================================================

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo Successfully pushed to GitHub!
    echo You can now deploy on Vercel at https://vercel.com
    echo =======================================================
) else (
    echo.
    echo =======================================================
    echo If prompted to authenticate, please complete sign-in.
    echo =======================================================
)

pause

