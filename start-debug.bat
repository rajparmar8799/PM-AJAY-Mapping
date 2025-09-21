@echo off
echo =========================================
echo  PM-AJAY Portal - Debug Startup
echo =========================================
echo.

echo Starting backend server first...
cd backend
start cmd /k "echo Starting Backend Server && npm start"
echo Backend starting in new window...
echo.

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting frontend server...
cd ..\frontend  
start cmd /k "echo Starting Frontend Server && npm start"
echo Frontend starting in new window...

echo.
echo =========================================
echo  Both servers are starting!
echo =========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo.
echo Wait for both windows to show "compiled successfully"
echo Then try logging in with these credentials:
echo.
echo Central Ministry: ministry_admin / central123
echo State Admin: maharashtra_admin / state123  
echo Village Committee: village_head1 / village123
echo Implementing Agency: infra_agency1 / agency123
echo.
pause