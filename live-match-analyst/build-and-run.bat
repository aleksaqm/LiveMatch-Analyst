@echo off
cd /d "%~dp0"

set JAVA_HOME=C:\Users\Vladimir\.jdks\corretto-11.0.28
set PATH=%JAVA_HOME%\bin;%PATH%

echo Building model
cd model
call .\mvnw.cmd clean install -B
cd ..

echo Building kjar
cd kjar
call .\mvnw.cmd clean install -B
if errorlevel 1 exit /b %errorlevel%
cd ..

echo Starting Spring Boot service...
cd service
.\mvnw.cmd spring-boot:run