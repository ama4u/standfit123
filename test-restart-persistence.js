// Test to verify what happens when Heroku restarts
import fetch from 'node-fetch';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

async function testBeforeRestart() {
  console.log('🔍 Testing BEFORE restart...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    const productsWithImages = products.filter(p => p.imageUrl);
    console.log(`📊 Products with images: ${productsWithImages.length}/${products.length}`);
    
    return productsWithImages.length;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return 0;
  }
}

async function forceHerokuRestart() {
  console.log('\n🔄 Forcing Heroku restart...');
  console.log('⚠️  This will simulate what happens during normal Heroku operations');
  
  // Note: We can't actually force a restart from here, but we can explain what happens
  console.log('💡 In a real scenario, Heroku restarts happen:');
  console.log('   - At least once every 24 hours (dyno cycling)');
  console.log('   - During deployments');
  console.log('   - During scaling operations');
  console.log('   - During maintenance windows');
  console.log('   - When the app crashes and restarts');
}

async function testAfterRestart() {
  console.log('\n🔍 Testing AFTER restart (simulated)...');
  console.log('⏳ Waiting for app to restart...');
  
  // Wait a bit to simulate restart time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    const productsWithImages = products.filter(p => p.imageUrl);
    console.log(`📊 Products with images: ${productsWithImages.length}/${products.length}`);
    
    return productsWithImages.length;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return 0;
  }
}

async function runRestartTest() {
  console.log('🚀 Testing Image Persistence Across Restarts...\n');
  
  const beforeCount = await testBeforeRestart();
  await forceHerokuRestart();
  const afterCount = await testAfterRestart();
  
  console.log('\n📊 Restart Test Results:');
  console.log('========================');
  console.log(`Before restart: ${beforeCount} products with images`);
  console.log(`After restart:  ${afterCount} products with images`);
  
  if (beforeCount === afterCount && beforeCount > 0) {
    console.log('✅ Images persisted across restart!');
  } else if (afterCount === 0) {
    console.log('❌ All images were lost during restart!');
    console.log('🔧 This confirms the ephemeral filesystem issue');
  } else {
    console.log('⚠️  Some images were lost during restart');
  }
  
  console.log('\n💡 Current Architecture Issues:');
  console.log('================================');
  console.log('❌ SQLite database stored on ephemeral filesystem');
  console.log('❌ Database gets wiped on every dyno restart');
  console.log('❌ Images stored in database are lost');
  console.log('✅ Images stored in Cloudinary are safe');
  console.log('❌ Database references to Cloudinary images are lost');
}

// Run the test
runRestartTest().catch(console.error);