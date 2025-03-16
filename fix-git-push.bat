@echo off
echo ===== Git Push Issue Fixer =====
echo.
echo The error you're seeing is because your local branch is behind the remote branch.
echo Here are options to fix this issue:
echo.
echo 1. Pull and merge (Recommended for beginners)
echo 2. Pull with rebase
echo 3. Force push (Use with caution!)
echo 4. Exit without doing anything
echo.

set /p option=Enter your choice (1-4): 

if "%option%"=="1" (
    echo.
    echo Running: git pull origin main
    git pull origin main
    if %errorlevel% neq 0 (
        echo.
        echo There was an error pulling from the remote repository.
        echo You may need to resolve merge conflicts manually.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Running: git push origin main
    git push origin main
    if %errorlevel% neq 0 (
        echo.
        echo There was an error pushing to the remote repository.
        echo.
        pause
        exit /b 1
    )
) else if "%option%"=="2" (
    echo.
    echo Running: git pull --rebase origin main
    git pull --rebase origin main
    if %errorlevel% neq 0 (
        echo.
        echo There was an error rebasing with the remote repository.
        echo You may need to resolve merge conflicts manually.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Running: git push origin main
    git push origin main
    if %errorlevel% neq 0 (
        echo.
        echo There was an error pushing to the remote repository.
        echo.
        pause
        exit /b 1
    )
) else if "%option%"=="3" (
    echo.
    echo WARNING: Force pushing will overwrite the remote branch with your local branch.
    echo This may cause data loss if there are important changes in the remote branch.
    echo.
    set /p confirm=Are you sure you want to continue? (y/n): 
    if /i "%confirm%"=="y" (
        echo.
        echo Running: git push -f origin main
        git push -f origin main
        if %errorlevel% neq 0 (
            echo.
            echo There was an error force pushing to the remote repository.
            echo.
            pause
            exit /b 1
        )
    ) else (
        echo.
        echo Force push cancelled.
        echo.
    )
) else if "%option%"=="4" (
    echo.
    echo Exiting without making any changes.
    echo.
) else (
    echo.
    echo Invalid option. Please run the script again and select a valid option.
    echo.
)

echo.
echo If you need more help, run: npm run fix-git-push
echo.
pause 