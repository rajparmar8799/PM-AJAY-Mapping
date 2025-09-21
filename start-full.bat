@echo off
echo ============================================
echo PM-AJAY Portal - Database Version Startup
echo ============================================
echo.
echo Starting PM-AJAY Portal with SQLite Database...
echo.
echo Backend: SQLite Database + Express API Server
echo Frontend: React Application
echo.

REM Check if database exists, if not initialize it
if not exist "backend\database\pm_ajay_portal.db" (
    echo Database not found. Initializing database...
    cd backend
    npm run init-db
    cd ..
    echo.
)

echo Starting servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.

REM Start backend and frontend concurrently
npm start

echo.
echo ============================================
echo PM-AJAY Portal stopped
echo ============================================
pause