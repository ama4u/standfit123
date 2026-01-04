// Production health check and monitoring script
import fetch from 'node-fetch';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

async function healthCheck() {
  console.log('🏥 Starting Production Health Check...\n');
  
  const checks = [
    { name: 'API Health', endpoint: '/api/products', expectedStatus: 200 },
    { name: 'Categories API', endpoint: '/api/categories', expectedStatus: 200 },
    { name: 'News Flash API', endpoint: '/api/newsflash', expectedStatus: 200 },
    { name: 'Home Page', endpoint: '/', expectedStatus: 200 },
    { name: 'Admin Login Page', endpoint: '/admin', expectedStatus: 200 }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${HEROKU_URL}${check.endpoint}`);
      const responseTime = Date.now() - startTime;
      
      const status = response.status === check.expectedStatus ? '✅' : '❌';
      const result = {
        name: check.name,
        status: response.status,
        expected: check.expectedStatus,
        responseTime,
        success: response.status === check.expectedStatus
      };
      
      results.push(result);
      console.log(`${status} ${check.name}: ${response.status} (${responseTime}ms)`);
      
    } catch (error) {
      const result = {
        name: check.name,
        status: 'ERROR',
        expected: check.expectedStatus,
        responseTime: 0,
        success: false,
        error: error.message
      };
      
      results.push(result);
      console.log(`❌ ${check.name}: ERROR - ${error.message}`);
    }
  }
  
  // Summary
  const successCount = results.filter(r => r.success).length;
  const avgResponseTime = results
    .filter(r => r.responseTime > 0)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  console.log('\n📊 Health Check Summary:');
  console.log('========================');
  console.log(`✅ Successful checks: ${successCount}/${results.length}`);
  console.log(`⏱️  Average response time: ${Math.round(avgResponseTime)}ms`);
  console.log(`🌐 Application URL: ${HEROKU_URL}`);
  
  if (successCount === results.length) {
    console.log('🎉 All systems operational!');
  } else {
    console.log('⚠️  Some issues detected - check logs above');
  }
  
  return results;
}

async function checkImageAvailability() {
  console.log('\n🖼️  Checking Image Availability...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    const imageChecks = [];
    
    for (const product of products.slice(0, 3)) { // Check first 3 products
      if (product.imageUrl) {
        try {
          const imgResponse = await fetch(product.imageUrl);
          const success = imgResponse.ok;
          imageChecks.push({ product: product.name, success });
          console.log(`${success ? '✅' : '❌'} ${product.name}: ${imgResponse.status}`);
        } catch (error) {
          imageChecks.push({ product: product.name, success: false });
          console.log(`❌ ${product.name}: ${error.message}`);
        }
      }
    }
    
    const successfulImages = imageChecks.filter(c => c.success).length;
    console.log(`📊 Image availability: ${successfulImages}/${imageChecks.length}`);
    
  } catch (error) {
    console.log(`❌ Error checking images: ${error.message}`);
  }
}

async function runHealthCheck() {
  const results = await healthCheck();
  await checkImageAvailability();
  
  console.log('\n🔄 Health check completed!');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  return results;
}

// Run health check
runHealthCheck().catch(console.error);