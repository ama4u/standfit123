// Test script to verify authentication and news flash creation
import fetch from 'node-fetch';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

async function testAdminLogin() {
  console.log('🔐 Testing Admin Login...');
  
  // Try multiple admin credentials
  const credentials = [
    { email: 'admin@standfitpremium.com.ng', password: 'Standfit@1441' },
    { email: 'standfit2025@standfit.com', password: 'Standfit@1447' },
    { email: 'standfit@admin.com', password: 'admin123' },
    { email: 'admin@standfit.com', password: 'admin123' }
  ];
  
  for (const cred of credentials) {
    console.log(`\n🔑 Trying: ${cred.email}`);
    
    try {
      const response = await fetch(`${HEROKU_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cred),
        credentials: 'include'
      });
      
      const result = await response.json();
      console.log(`   Response: ${response.status} - ${result.message || 'Success'}`);
      
      if (response.ok) {
        const cookies = response.headers.get('set-cookie');
        console.log('   ✅ Login successful!');
        return { success: true, cookies, result };
      }
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }
  
  return { success: false, cookies: null, result: null };
}

async function testNewsFlashCreation(cookies) {
  console.log('\n📰 Testing News Flash Creation...');
  
  if (!cookies) {
    console.log('❌ No cookies available for authentication');
    return false;
  }
  
  try {
    // Test text news flash creation
    const response = await fetch(`${HEROKU_URL}/api/admin/newsflash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        title: 'Test News Flash',
        mediaType: 'text',
        message: 'This is a test news flash message to verify the fix is working.' // Use 'message' for backward compatibility
      }),
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log(`✅ News Flash Creation Response: ${response.status}`);
    console.log('Response:', result);
    
    return response.ok;
  } catch (error) {
    console.error('❌ Error testing news flash creation:', error.message);
    return false;
  }
}

async function testAuthenticatedEndpoints(cookies) {
  console.log('\n🔍 Testing Authenticated Endpoints...');
  
  if (!cookies) {
    console.log('❌ No cookies available for authentication');
    return;
  }
  
  const endpoints = [
    '/api/auth/admin/me',
    '/api/admin/reports',
    '/api/admin/newsflash'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${HEROKU_URL}${endpoint}`, {
        headers: {
          'Cookie': cookies
        },
        credentials: 'include'
      });
      
      console.log(`${response.ok ? '✅' : '❌'} ${endpoint}: ${response.status}`);
      
      if (!response.ok) {
        const error = await response.text();
        console.log(`   Error: ${error}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

async function runAuthTests() {
  console.log('🚀 Starting Authentication Tests...\n');
  
  // Test admin login
  const loginResult = await testAdminLogin();
  
  if (loginResult.success) {
    console.log('✅ Admin login successful');
    
    // Test authenticated endpoints
    await testAuthenticatedEndpoints(loginResult.cookies);
    
    // Test news flash creation
    const newsFlashSuccess = await testNewsFlashCreation(loginResult.cookies);
    
    console.log('\n🎯 Test Results Summary:');
    console.log('========================');
    console.log(`✅ Admin Login: ${loginResult.success ? 'Working' : 'Failed'}`);
    console.log(`${newsFlashSuccess ? '✅' : '❌'} News Flash Creation: ${newsFlashSuccess ? 'Working' : 'Failed'}`);
    
  } else {
    console.log('❌ Admin login failed - cannot test authenticated endpoints');
  }
  
  console.log('\n🔄 Authentication test completed!');
}

// Run the tests
runAuthTests().catch(console.error);