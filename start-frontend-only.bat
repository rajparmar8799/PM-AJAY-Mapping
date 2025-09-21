@echo off
echo =========================================
echo  PM-AJAY Portal - Frontend Only Mode
echo =========================================
echo.
echo Starting frontend in demo mode...
echo No backend required - using mock data
echo.

cd frontend
echo Installing frontend dependencies...
call npm install

echo.
echo Starting React development server...
echo This will open your browser automatically.
echo.
echo =========================================
echo  DEMO LOGIN INSTRUCTIONS:
echo =========================================
echo.
echo 1. Click on any role card to login instantly
echo 2. No username/password required
echo 3. Full dashboard functionality with sample data
echo.
echo Available Roles:
echo - Central Ministry (Dr. Rajesh Kumar)
echo - State Admin (Shri Anil Deshmukh - Maharashtra)  
echo - Village Committee (Sarpanch Sunita Devi - Haryana)
echo - Implementing Agency (Bharat Infrastructure Pvt Ltd)
echo.
echo =========================================

call npm start