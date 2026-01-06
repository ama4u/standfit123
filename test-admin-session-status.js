import fetch from 'node-fetch';

async function testAdminSession() {
  const baseUrl = 'https://standfit-e816d09b795a.herokuapp.com';
  
  console.log('Testing admin session status...');
  
  try {
    // Test admin session by trying to access admin orders
    console.log('\n1. Testing admin session with orders endpoint...');
    const ordersResponse = await fetch(`${baseUrl}/api/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Orders response status:', ordersResponse.status);
    
    if (ordersResponse.status === 401) {
      console.log('❌ Admin session expired or not authenticated');
      console.log('Response:', await ordersResponse.text());
      
      console.log('\n2. You need to log in to the admin panel again');
      console.log('Go to: https://standfit-e816d09b795a.herokuapp.com/admin');
      console.log('And log in with your admin credentials');
      
    } else if (ordersResponse.ok) {
      console.log('✅ Admin session is valid');
      const orders = await ordersResponse.json();
      console.log(`Found ${orders.length} orders`);
      
      // Find the specific order
      const targetOrder = orders.find(order => order.id === '2da77fe8-b25c-41d1-b81f-cf67ce779a4b');
      if (targetOrder) {
        console.log('\n3. Target order found:');
        console.log('- ID:', targetOrder.id);
        console.log('- Current Status:', targetOrder.status);
        console.log('- Customer:', targetOrder.customerName);
        console.log('- Total:', targetOrder.totalAmount);
      } else {
        console.log('\n3. Target order not found in current orders');
      }
    } else {
      console.log('❌ Unexpected response:', ordersResponse.status);
      console.log('Response:', await ordersResponse.text());
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAdminSession();