// Test product deletion functionality
import fetch from 'node-fetch';

async function testProductDelete() {
  console.log('🧪 Testing product deletion...');
  
  try {
    // First, get all products to find one to delete
    console.log('📋 Fetching products...');
    const productsResponse = await fetch('https://standfit-e816d09b795a.herokuapp.com/api/products');
    if (!productsResponse.ok) {
      console.error('❌ Failed to fetch products');
      return;
    }
    
    const products = await productsResponse.json();
    console.log(`✅ Found ${products.length} products`);
    
    // Find a test product (avoid deleting real products)
    const testProduct = products.find(p => p.name.includes('Test') || p.name.includes('logo'));
    if (!testProduct) {
      console.log('❌ No test product found to delete');
      return;
    }
    
    console.log(`🎯 Attempting to delete: ${testProduct.name} (ID: ${testProduct.id})`);
    
    // Try to delete the product (this will fail without admin auth)
    const deleteResponse = await fetch(`https://standfit-e816d09b795a.herokuapp.com/api/admin/products/${testProduct.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📤 Delete response status: ${deleteResponse.status}`);
    
    if (!deleteResponse.ok) {
      const error = await deleteResponse.text();
      console.log('❌ Delete failed (expected - no admin auth):', error);
      console.log('');
      console.log('💡 This is expected behavior - product deletion requires admin authentication');
      console.log('🔑 The issue might be that admin session is not being maintained properly');
      console.log('');
      console.log('🔧 Possible solutions:');
      console.log('   1. Check if admin login session is working');
      console.log('   2. Verify admin authentication middleware');
      console.log('   3. Check browser cookies/session storage');
    } else {
      const result = await deleteResponse.json();
      console.log('✅ Delete successful:', result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductDelete();