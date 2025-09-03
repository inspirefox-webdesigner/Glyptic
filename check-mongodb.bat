@echo off
echo Checking MongoDB installation...
echo.

:: Check if MongoDB service exists
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB service found
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% == 0 (
        echo ✅ MongoDB started successfully
    ) else (
        echo ⚠️  MongoDB service exists but failed to start
        echo Try running as administrator
    )
) else (
    echo ❌ MongoDB service not found
    echo.
    echo 📋 MongoDB Installation Required:
    echo 1. Download MongoDB Community Server from:
    echo    https://www.mongodb.com/try/download/community
    echo 2. Install with default settings
    echo 3. Make sure to install as Windows Service
    echo 4. Run this script again after installation
)

echo.
echo Testing MongoDB connection...
cd backend
npm run test-mongo

echo.
pause