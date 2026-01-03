# Deployment Guide for standfitpremium.com.ng

## Prerequisites
- TrueHost VPS with CyberPanel installed
- Domain: standfitpremium.com.ng pointed to your VPS IP
- Node.js 18+ installed on the server
- PM2 for process management

## Step 1: Server Setup

### 1.1 Install Node.js and PM2
```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 1.2 Create Website in CyberPanel
1. Login to CyberPanel
2. Go to "Websites" → "Create Website"
3. Domain: standfitpremium.com.ng
4. Email: your-email@domain.com
5. Package: Default or create custom
6. Click "Create Website"

## Step 2: Upload and Configure Project

### 2.1 Upload Project Files
Upload your project to: `/home/standfitpremium.com.ng/public_html/`

### 2.2 Install Dependencies
```bash
cd /home/standfitpremium.com.ng/public_html/
npm install --production
```

### 2.3 Build the Project
```bash
npm run build
```

## Step 3: Environment Configuration

Create production `.env` file with your actual values:
```bash
# Copy and edit the environment file
cp .env.example .env
nano .env
```

## Step 4: Database Setup

### 4.1 Initialize Database
```bash
npm run db:push
```

### 4.2 Create Admin User (Optional)
```bash
npm run admin:manage
```

## Step 5: PM2 Configuration

Start the application with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Nginx Configuration

CyberPanel will create basic Nginx config. You need to modify it for Node.js proxy.

## Step 7: SSL Certificate

1. In CyberPanel, go to "SSL" → "Issue SSL"
2. Select your domain: standfitpremium.com.ng
3. Choose "Let's Encrypt"
4. Click "Issue Now"

## Step 8: Final Verification

1. Check PM2 status: `pm2 status`
2. Check logs: `pm2 logs standfit-app`
3. Visit: https://standfitpremium.com.ng

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure port 5000 is available
2. **Permission issues**: Check file ownership
3. **Database errors**: Verify SQLite file permissions
4. **Environment variables**: Double-check .env file

### Useful Commands:
```bash
# Check application status
pm2 status

# View logs
pm2 logs standfit-app

# Restart application
pm2 restart standfit-app

# Check Nginx status
systemctl status nginx
```