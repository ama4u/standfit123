# PowerShell Deployment script for Standfit Premium
$SERVER_IP = "102.212.246.164"
$SERVER_USER = "root"
$DEPLOY_PATH = "/home/Standfitpremium.com.ng/nodeapp/standfit123"

Write-Host "Starting deployment to $SERVER_IP..." -ForegroundColor Green

# Check if we have the required tools
if (!(Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "SSH is not available. Please install OpenSSH or use Git Bash." -ForegroundColor Red
    exit 1
}

if (!(Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Host "SCP is not available. Please install OpenSSH or use Git Bash." -ForegroundColor Red
    exit 1
}

# Create deployment directory structure on server
Write-Host "Creating deployment directory..." -ForegroundColor Yellow
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no $SERVER_USER@$SERVER_IP "cd $DEPLOY_PATH && mkdir -p logs && echo 'Deployment directory ready'"

# Copy essential files
Write-Host "Copying project files..." -ForegroundColor Yellow
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no package.json "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no package-lock.json "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no ecosystem.config.js "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no .env "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no drizzle.config.ts "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"

# Copy built files
Write-Host "Copying built application..." -ForegroundColor Yellow
scp -r -o PreferredAuthentications=password -o PubkeyAuthentication=no dist/ "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
scp -r -o PreferredAuthentications=password -o PubkeyAuthentication=no shared/ "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"

# Install dependencies and start application
Write-Host "Installing dependencies and starting application..." -ForegroundColor Yellow
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no $SERVER_USER@$SERVER_IP "cd $DEPLOY_PATH && npm install --production && npm run db:push && pm2 start ecosystem.config.js && pm2 save && pm2 startup && echo 'Deployment completed!'"

Write-Host "Deployment finished. Check status with: pm2 status" -ForegroundColor Green