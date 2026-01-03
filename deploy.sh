#!/bin/bash

# Deployment script for Standfit Premium
SERVER_IP="102.212.246.164"
SERVER_USER="root"
DEPLOY_PATH="/home/Standfitpremium.com.ng/nodeapp/standfit123"

echo "Starting deployment to $SERVER_IP..."

# Create deployment directory structure on server
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no $SERVER_USER@$SERVER_IP "
    cd $DEPLOY_PATH &&
    mkdir -p logs &&
    echo 'Deployment directory ready'
"

# Copy essential files
echo "Copying project files..."
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no package.json $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no package-lock.json $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no ecosystem.config.js $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no .env $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no drizzle.config.ts $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

# Copy built files
echo "Copying built application..."
scp -r -o PreferredAuthentications=password -o PubkeyAuthentication=no dist/ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
scp -r -o PreferredAuthentications=password -o PubkeyAuthentication=no shared/ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

# Install dependencies and start application
echo "Installing dependencies and starting application..."
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no $SERVER_USER@$SERVER_IP "
    cd $DEPLOY_PATH &&
    npm install --production &&
    npm run db:push &&
    pm2 start ecosystem.config.js &&
    pm2 save &&
    pm2 startup &&
    echo 'Deployment completed!'
"

echo "Deployment finished. Check status with: pm2 status"