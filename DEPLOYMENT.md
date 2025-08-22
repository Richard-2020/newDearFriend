# DearFriend App Deployment Guide for Liquid Web

## Prerequisites

- Node.js 16+ installed on your Liquid Web server
- MongoDB database (can be local or cloud-based)
- PM2 for process management (recommended)

## Quick Deployment Steps

### 1. Upload Your Code
Upload your project files to your Liquid Web server using FTP, SCP, or Git.

### 2. Install Dependencies
```bash
# Navigate to your project directory
cd /path/to/your/dearfriend-app

# Install all dependencies
npm run install-all
```

### 3. Set Environment Variables
Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Edit the `.env` file with your production values:
```env
MONGODB_URI=mongodb://your-mongodb-connection-string
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-secret-key
CORS_ORIGIN=https://yourdomain.com
```

### 4. Build the Application
```bash
# Run the build script
chmod +x build.sh
./build.sh

# Or manually:
npm run build
```

### 5. Start the Application

#### Option A: Using PM2 (Recommended)
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

#### Option B: Using Node directly
```bash
npm start
```

#### Option C: Using the build script
```bash
npm run deploy
```

## Configuration Options

### Port Configuration
The application runs on port 5000 by default. You can change this by:
1. Setting the `PORT` environment variable
2. Updating the `ecosystem.config.js` file
3. Configuring your web server (Apache/Nginx) to proxy to this port

### Database Setup
- **Local MongoDB**: Install MongoDB on your server
- **Cloud MongoDB**: Use MongoDB Atlas or similar service
- Update the `MONGODB_URI` in your `.env` file

### Web Server Configuration (Apache/Nginx)

#### Apache Configuration
Create a virtual host configuration:
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:5000/
    ProxyPassReverse / http://localhost:5000/
    
    ErrorLog ${APACHE_LOG_DIR}/dearfriend_error.log
    CustomLog ${APACHE_LOG_DIR}/dearfriend_access.log combined
</VirtualHost>
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm run install-all

# Build the application
npm run build

# Restart with PM2
pm2 restart dearfriend-app
```

### Monitoring
```bash
# View PM2 status
pm2 status

# View logs
pm2 logs dearfriend-app

# Monitor resources
pm2 monit
```

### Troubleshooting

#### Common Issues:
1. **Port already in use**: Change the PORT in .env file
2. **MongoDB connection failed**: Check your MONGODB_URI
3. **Build fails**: Ensure Node.js version is 16+
4. **Static files not loading**: Check if NODE_ENV is set to 'production'

#### Logs Location:
- PM2 logs: `~/.pm2/logs/`
- Application logs: `./logs/` (if using ecosystem.config.js)

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **HTTPS**: Configure SSL certificates for production
3. **Firewall**: Ensure only necessary ports are open
4. **Database**: Use strong passwords and restrict access
5. **Updates**: Keep Node.js and dependencies updated

## Performance Optimization

1. **PM2 Clustering**: Use multiple instances for better performance
2. **Caching**: Implement Redis for session storage
3. **CDN**: Use a CDN for static assets
4. **Compression**: Enable gzip compression in your web server

## Support

For issues specific to Liquid Web hosting, contact Liquid Web support.
For application-specific issues, check the logs and ensure all environment variables are properly set. 