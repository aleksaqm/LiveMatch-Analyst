@echo off
cd /d "%~dp0"

echo Building model
cd model
call mvn clean install -B
cd ..

echo Building kjar
cd kjar
call mvn clean install -B
if errorlevel 1 exit /b %errorlevel%
cd ..

echo Starting Spring Boot service...
cd service
mvn spring-boot:run