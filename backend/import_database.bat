@echo off
echo ========================================
echo IMPORT DATABASE CHUYENDEJAVA (LARAGON)
echo ========================================
echo.

REM Set MySQL path for Laragon
set MYSQL_PATH=C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin
set PATH=%MYSQL_PATH%;%PATH%

REM Check if MySQL is accessible
echo [1/4] Checking MySQL installation...
"%MYSQL_PATH%\mysql.exe" --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot find MySQL at %MYSQL_PATH%
    echo Please check your Laragon installation
    pause
    exit /b 1
)
echo MySQL found!
echo.

REM Test MySQL connection
echo [2/4] Testing MySQL connection...
"%MYSQL_PATH%\mysql.exe" -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL!
    echo Please make sure:
    echo   1. Laragon is running
    echo   2. MySQL service is started
    echo   3. Password is empty (default for Laragon)
    pause
    exit /b 1
)
echo Connection successful!
echo.

REM Import database
echo [3/4] Importing database from sieuthimini.sql...
echo This may take 1-2 minutes...
"%MYSQL_PATH%\mysql.exe" -u root < "%~dp0sieuthimini.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to import database!
    pause
    exit /b 1
)
echo Database imported successfully!
echo.

REM Verify database
echo [4/4] Verifying database...
"%MYSQL_PATH%\mysql.exe" -u root -e "USE chuyendejava; SELECT COUNT(*) as 'Total Tables' FROM information_schema.tables WHERE table_schema='chuyendejava';"
echo.

echo ========================================
echo DATABASE IMPORT COMPLETED!
echo ========================================
echo.
echo Database 'chuyendejava' is ready!
echo.
echo Next steps:
echo   1. Start the backend server:
echo      cd backend
echo      mvnw spring-boot:run
echo.
echo   2. Backend will run on: http://localhost:8080
echo.
pause
