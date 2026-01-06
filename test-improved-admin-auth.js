import fetch from 'node-fetch';

async function testImprovedAdminAuth() {
  const baseUrl = 'https://standfit-e816d09b795a.herokuapp.com';
  
  console.log('🧪 Testing improved admin authentication system...\n');
  
  try {
    // 1. Test admin session status endpoint
    console.log('1. Testing admin session status endpoint...');
    const statusResponse = await fetch(`${baseUrl}/api/auth/admin/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    
    console.log(`Status check: ${statusResponse.status}`);
    const statusData = await statusResponse.json();
    console.log('Response:', statusData);
    
    if (statusResponse.status === 401) {
      console.log('✅ Session expired correctly detected\n');
      
      // 2. Test order status update with better error response
      console.log('2. Testing order status update with expired session...');
      const orderUpdateResponse = await fetch(`${baseUrl}/api/admin/orders/2da77fe8-b25c-41d1-b81f-cf67ce779a4b/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'processing' }),
        credentials: 'include'
      });
      
      console.log(`Order update status: ${orderUpdateResponse.status}`);
      const orderUpdateData = await orderUpdateResponse.json();
      console.log('Response:', orderUpdateData);
      
      if (orderUpdateData.code === 'ADMIN_SESSION_EXPIRED' && orderUpdateData.redirectTo === '/admin') {
        console.log('✅ Improved error response with redirect info\n');
      }
      
      console.log('📋 Next steps:');
      console.log('1. Go to: https://standfit-e816d09b795a.herokuapp.com/admin');
      console.log('2. Log in with your admin credentials');
      console.log('3. Try updating the order status again');
      console.log('4. The system should now provide better logging and error handling');
      
    } else if (statusResponse.ok) {
      console.log('✅ Admin session is active');
      console.log(`Logged in as: ${statusData.admin.email}`);
      
      // Test order status update with active session
      console.log('\n3. Testing order status update with active session...');
      const orderUpdateResponse = await fetch(`${baseUrl}/api/admin/orders/2da77fe8-b25c-41d1-b81f-cf67ce779a4b/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'processing' }),
        credentials: 'include'
      });
      
      console.log(`Order update status: ${orderUpdateResponse.status}`);
      const orderUpdateData = await orderUpdateResponse.json();
      console.log('Response:', orderUpdateData);
      
      if (orderUpdateResponse.ok) {
        console.log('✅ Order status updated successfully!');
      } else {
        console.log('❌ Order update failed:', orderUpdateData.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testImprovedAdminAuth();