@echo off
echo ========================================
echo  Pushing JM Placemats to GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

echo Checking git status...
git status --short
echo.

echo Adding all files...
git add .
echo.

echo Creating commit...
git commit -m "Initial commit: JM Placemats e-commerce site with Stripe integration"
echo.

echo ========================================
echo  Next Steps:
echo ========================================
echo.
echo 1. Create a new repository on GitHub:
echo    https://github.com/new
echo.
echo 2. Copy your repository URL
echo.
echo 3. Run these commands (replace YOUR_USERNAME and REPO_NAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
echo.
pause
