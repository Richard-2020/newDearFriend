#!/bin/bash

# DearFriend App Build Script for Liquid Web Deployment
echo "🚀 Starting DearFriend App Build Process..."

# Set environment to production
export NODE_ENV=production

# Install dependencies for all parts
echo "📦 Installing dependencies..."
npm run install-all

# Build the React client
echo "🔨 Building React client..."
npm run build:client

# Install production dependencies for server
echo "🔧 Installing production server dependencies..."
npm run build:server

echo "✅ Build completed successfully!"
echo "📁 Build files are ready in:"
echo "   - Client build: ./client/build/"
echo "   - Server: ./server/"
echo ""
echo "🚀 To start the application:"
echo "   npm start"
echo ""
echo "🌐 The app will be available at: http://localhost:5000" 