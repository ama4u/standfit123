import fetch from 'node-fetch';

async function testAdminLogin() {
  const baseUrl = 'https://standfit-e816d09b795a.herokuapp.com';
  
  console.log('🔐 Testing admin login process...');
  
  try {
    // Step 1: Try to login
    console.log('1️⃣ Attempting admin login...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'standfit2025@standfit.com',
        password: 'Standfit@1447'
      }),
      credentials: 'include'
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Extract cookies for next request
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Cookies received:', cookies);
      
      // Step 2: Try to access admin endpoint
      console.log('2️⃣ Testing admin endpoint access...');
      
      const adminResponse = await fetch(`${baseUrl}/api/admin/categories`, {
        method: 'GET',
        headers: {
          'Cookie': cookies || ''
        },
        credentials: 'include'
      });
      
      console.log('Admin endpoint status:', adminResponse.status);
      
      if (adminResponse.ok) {
        const categories = await adminResponse.json();
        console.log('✅ Admin access successful, categories:', categories.length);
      } else {
        const error = await adminResponse.text();
        console.log('❌ Admin access failed:', error);
      }
      
    } else {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminLogin();