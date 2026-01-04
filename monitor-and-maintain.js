// Automated monitoring and maintenance script
import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dih456opf',
  api_key: '815796146159497',
  api_secret: 'Ng87W5wXUkfJByI4JFPYlJ9sa1s'
});

async function loginAdmin() {
  try {
    const response = await fetch(`${HEROKU_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'standfit2025@standfit.com',
        password: 'Standfit@1447'
      }),
      credentials: 'include'
    });
    
    if (response.ok) {
      return response.headers.get('set-cookie');
    }
    return null;
  } catch (error) {
    console.error('Login failed:', error.message);
    return null;
  }
}

async function checkAndFixMissingImages(cookies) {
  console.log('🔍 Checking for products with missing images...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    const productsWithoutImages = products.filter(p => !p.imageUrl || p.imageUrl.trim() === '');
    
    if (productsWithoutImages.length > 0) {
      console.log(`⚠️  Found ${productsWithoutImages.length} products without images`);
      
      // You could implement auto-fixing logic here
      productsWithoutImages.forEach(product => {
        console.log(`   - ${product.name} (ID: ${product.id})`);
      });
      
      return false; // Images need fixing
    } else {
      console.log('✅ All products have images');
      return true; // All good
    }
  } catch (error) {
    console.error('Error checking images:', error.message);
    return false;
  }
}

async function validateCloudinaryImages() {
  console.log('☁️  Validating Cloudinary image accessibility...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    let validImages = 0;
    let invalidImages = 0;
    
    for (const product of products.slice(0, 5)) { // Check first 5 products
      if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
        try {
          const imgResponse = await fetch(product.imageUrl);
          if (imgResponse.ok) {
            validImages++;
          } else {
            invalidImages++;
            console.log(`❌ Invalid image for ${product.name}: ${imgResponse.status}`);
          }
        } catch (error) {
          invalidImages++;
          console.log(`❌ Error accessing image for ${product.name}: ${error.message}`);
        }
      }
    }
    
    console.log(`📊 Image validation: ${validImages} valid, ${invalidImages} invalid`);
    return invalidImages === 0;
  } catch (error) {
    console.error('Error validating images:', error.message);
    return false;
  }
}

async function checkDatabaseHealth() {
  console.log('🗄️  Checking database health...');
  
  try {
    const endpoints = [
      { name: 'Products', url: '/api/products' },
      { name: 'Categories', url: '/api/categories' },
      { name: 'News Flash', url: '/api/newsflash' }
    ];
    
    let healthyEndpoints = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${HEROKU_URL}${endpoint.url}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${endpoint.name}: ${Array.isArray(data) ? data.length : 'OK'} records`);
          healthyEndpoints++;
        } else {
          console.log(`❌ ${endpoint.name}: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
    
    return healthyEndpoints === endpoints.length;
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return false;
  }
}

async function performMaintenance() {
  console.log('🔧 Performing maintenance tasks...');
  
  const cookies = await loginAdmin();
  if (!cookies) {
    console.log('❌ Cannot perform maintenance without admin access');
    return false;
  }
  
  // Check and fix missing images
  const imagesOk = await checkAndFixMissingImages(cookies);
  
  // Validate Cloudinary images
  const cloudinaryOk = await validateCloudinaryImages();
  
  // Check database health
  const dbOk = await checkDatabaseHealth();
  
  return imagesOk && cloudinaryOk && dbOk;
}

async function generateMaintenanceReport() {
  console.log('📋 Generating Maintenance Report...');
  console.log('=====================================');
  
  const timestamp = new Date().toISOString();
  console.log(`🕐 Report Time: ${timestamp}`);
  console.log(`🌐 Application: ${HEROKU_URL}`);
  
  const maintenanceResult = await performMaintenance();
  
  console.log('\n📊 Maintenance Summary:');
  console.log(`${maintenanceResult ? '✅' : '❌'} Overall Status: ${maintenanceResult ? 'HEALTHY' : 'NEEDS ATTENTION'}`);
  
  if (!maintenanceResult) {
    console.log('\n⚠️  Recommended Actions:');
    console.log('1. Check server logs for errors');
    console.log('2. Verify Cloudinary configuration');
    console.log('3. Test image upload functionality');
    console.log('4. Monitor database performance');
  }
  
  console.log('\n🔄 Maintenance completed!');
  return maintenanceResult;
}

// Run maintenance
generateMaintenanceReport().catch(console.error);