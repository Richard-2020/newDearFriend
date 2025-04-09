#!/bin/bash

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MongoDB
sudo apt-get install -y mongodb

# Clone your repository (replace with your actual repository URL)
# git clone <your-repository-url>
# cd <your-repository-name>

# Install dependencies
cd server
npm install
cd ../client
npm install

# Build the React application
npm run build

# Create environment file for the server
cd ../server
cat > .env << EOF
MONGODB_URI=mongodb://dearfriend_user:your_secure_password@localhost:27017/dearfriend
PORT=5000
EOF

# Start the server using PM2
pm2 start index.js --name "dearfriend-server"

# Configure PM2 to start on system boot
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/dearfriend << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /home/ubuntu/dearfriend/client/build;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/dearfriend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Install Certbot for SSL
sudo apt-get install -y certbot python3-certbot-nginx

# Set up firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow ssh
sudo ufw enable

echo "Deployment completed successfully!" 