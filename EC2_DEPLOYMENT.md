# EC2 Deployment Guide for DearFriend

This guide will help you deploy the DearFriend application on an AWS EC2 instance running Linux.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. SSH key pair for EC2 access

## Step 1: Launch EC2 Instance

1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Choose Amazon Linux 2023 or your preferred Linux distribution
4. Select t2.micro (free tier eligible)
5. Configure instance details:
   - VPC: Default
   - Auto-assign Public IP: Enable
6. Add storage (8GB is sufficient for free tier)
7. Add tags (optional)
8. Configure security group:
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
9. Review and launch
10. Select your key pair or create a new one

## Step 2: Connect to EC2 Instance

```bash
# Make your key file secure
chmod 400 your-key-pair.pem

# Connect to the instance
ssh -i your-key-pair.pem ec2-user@your-ec2-public-ip
```

## Step 3: Initial Server Setup

1. Update system packages:
```bash
sudo yum update -y
```

2. Install essential tools:
```bash
sudo yum install -y git
```

3. Install Node.js:
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

4. Install PM2 globally:
```bash
sudo npm install -g pm2
```

## Step 4: Install and Configure MongoDB

1. Create MongoDB repository file:
```bash
sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
```

2. Install MongoDB:
```bash
sudo yum install -y mongodb-org
```

3. Start and enable MongoDB:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

4. Create MongoDB user and database:
```bash
mongosh << EOF
use dearfriend
db.createUser({
  user: "dearfriend_user",
  pwd: "your_secure_password",
  roles: [{ role: "readWrite", db: "dearfriend" }]
})
EOF
```

## Step 5: Deploy Application

1. Create project directory:
```bash
mkdir -p ~/dearfriend
cd ~/dearfriend
```

2. Upload your application files (from your local machine):
```bash
scp -r -i your-key-pair.pem ./dearfriend ec2-user@your-ec2-public-ip:/home/ec2-user/
```

3. Install dependencies:
```bash
cd server
npm install --production
cd ../client
npm install --production
```

4. Build the React application:
```bash
npm run build
```

5. Create environment file:
```bash
cd ../server
cat > .env << EOF
MONGODB_URI=mongodb://dearfriend_user:your_secure_password@localhost:27017/dearfriend
PORT=5000
NODE_ENV=production
EOF
```

6. Start the server:
```bash
NODE_ENV=production pm2 start index.js --name "dearfriend-server" --time
pm2 startup
pm2 save
```

## Step 6: Install and Configure Nginx

1. Install Nginx:
```bash
sudo amazon-linux-extras install nginx1
```

2. Create Nginx configuration:
```bash
sudo tee /etc/nginx/conf.d/dearfriend.conf << EOF
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Frontend
    location / {
        root /home/ec2-user/dearfriend/client/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level 6;
    gzip_min_length 1000;
}
EOF
```

3. Start and enable Nginx:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 7: Set Up SSL (Optional)

1. Install Certbot:
```bash
sudo yum install -y certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

## Step 8: Configure Firewall

```bash
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

## Maintenance

1. To update the application:
```bash
cd ~/dearfriend
git pull
cd client
npm run build
cd ../server
pm2 restart dearfriend-server
```

2. To view logs:
```bash
# Server logs
pm2 logs dearfriend-server

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Security Considerations

1. Keep your system updated:
```bash
sudo yum update -y
```

2. Configure firewall:
```bash
sudo firewall-cmd --list-all
```

3. Monitor server resources:
```bash
htop
```

## Troubleshooting

1. Check PM2 status:
```bash
pm2 status
```

2. Check Nginx configuration:
```bash
sudo nginx -t
```

3. Check MongoDB status:
```bash
sudo systemctl status mongod
```

4. View error logs:
```bash
pm2 logs
sudo journalctl -u nginx
```

## Backup Strategy

1. Regular database backups:
```bash
# Create backup
mongodump --out /path/to/backup

# Restore from backup
mongorestore /path/to/backup
```

2. Backup application files:
```bash
tar -czf backup.tar.gz /home/ec2-user/dearfriend
```

## Cost Optimization

1. Use t2.micro instance (free tier eligible)
2. Monitor instance usage
3. Use spot instances for non-critical workloads
4. Implement auto-scaling if needed

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/index.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [MongoDB Documentation](https://docs.mongodb.com/) 