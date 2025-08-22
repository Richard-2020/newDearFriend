@echo off
echo 🚀 Starting DearFriend App Build Process for Windows...

REM Set environment to production
set NODE_ENV=production

REM Install dependencies for all parts
echo 📦 Installing dependencies...
call npm run install-all

REM Build the React client
echo 🔨 Building React client...
call npm run build:client

REM Install production dependencies for server
echo 🔧 Installing production server dependencies...
call npm run build:server

echo ✅ Build completed successfully!
echo 📁 Build files are ready in:
echo    - Client build: ./client/build/
echo    - Server: ./server/
echo.
echo 🚀 To start the application:
echo    npm start
echo.
echo 🌐 The app will be available at: http://localhost:5000
pause 