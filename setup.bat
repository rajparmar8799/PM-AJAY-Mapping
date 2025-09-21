@echo off
echo =========================================
echo  PM-AJAY Portal - Setup Script
echo  Government of India Style Demo
echo =========================================
echo.

echo [1/3] Installing root dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo =========================================
echo  🎉 Setup Complete!
echo =========================================
echo.
echo To start the application, run:
echo   npm start
echo.
echo Then visit: http://localhost:3000
echo.
echo Sample login credentials are in README.md
echo =========================================
pause