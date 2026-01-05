// Test admin authentication and product deletion
import fetch from 'node-fetch';

async function testAdminSession() {
  console.log('🔐 Testing admin authentication and product deletion...');
  
  try {
    // Step 1: Try to login as admin
    console.log('1️⃣ Attempting admin login...');
    
    const loginResponse = await fetch('https://standfit-e816d09b795a.herokuapp.com/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'standfit2025@standfit.com',
        password: 'Standfit@1447'
      }),
    });
    
    console.log(`Login response: ${loginResponse.status}`);
    
    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Admin login failed:', error);
      return;
    }
    
    const loginResult = await loginResponse.json();
    console.log('✅ Admin login successful:', loginResult.user?.email);
    
    // Get cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies received:', cookies ? 'Yes' : 'No');
    
    // Step 2: Try to get products
    console.log('\n2️⃣ Fetching products...');
    
    const productsResponse = await fetch('https://standfit-e816d09b795a.herokuapp.com/api/products');
    if (!productsResponse.ok) {
      console.log('❌ Failed to fetch products');
      return;
    }
    
    const products = await productsResponse.json();
    console.log(`✅ Found ${products.length} products`);
    
    // Find a test product to delete
    const testProduct = products.find(p => p.name.includes('logo') || p.name.includes('test'));
    if (!testProduct) {
      console.log('❌ No test product found');
      return;
    }
    
    console.log(`🎯 Test product: ${testProduct.name} (ID: ${testProduct.id})`);
    
    // Step 3: Try to delete product (this will likely fail without proper session)
    console.log('\n3️⃣ Attempting to delete product...');
    
    const deleteResponse = await fetch(`https://standfit-e816d09b795a.herokuapp.com/api/admin/products/${testProduct.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || '', // Try to include cookies
      },
    });
    
    console.log(`Delete response: ${deleteResponse.status}`);
    
    if (!deleteResponse.ok) {
      const error = await deleteResponse.text();
      console.log('❌ Product deletion failed:', error);
      console.log('\n💡 This is likely because:');
      console.log('   1. Session cookies are not being maintained across requests');
      console.log('   2. Admin authentication is not persisting');
      console.log('   3. CSRF protection or other security measures');
      console.log('\n🔧 Solution: Product deletion should work from the admin dashboard');
      console.log('   when logged in through the browser (maintains session)');
    } else {
      const result = await deleteResponse.json();
      console.log('✅ Product deletion successful:', result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminSession();