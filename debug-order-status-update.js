import fetch from 'node-fetch';

async function testOrderStatusUpdate() {
  const baseUrl = 'https://standfit-e816d09b795a.herokuapp.com';
  const orderId = '2da77fe8-b25c-41d1-b81f-cf67ce779a4b';
  
  console.log('Testing order status update...');
  console.log('Order ID:', orderId);
  
  try {
    // First, let's check if the order exists
    console.log('\n1. Checking if order exists...');
    const checkResponse = await fetch(`${baseUrl}/api/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Orders list status:', checkResponse.status);
    if (checkResponse.ok) {
      const orders = await checkResponse.json();
      const targetOrder = orders.find(order => order.id === orderId);
      if (targetOrder) {
        console.log('Found order:', {
          id: targetOrder.id,
          status: targetOrder.status,
          customerName: targetOrder.customerName,
          totalAmount: targetOrder.totalAmount
        });
      } else {
        console.log('Order not found in orders list');
      }
    } else {
      console.log('Failed to fetch orders:', await checkResponse.text());
    }
    
    // Now test the status update
    console.log('\n2. Testing status update...');
    const updateResponse = await fetch(`${baseUrl}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'processing' }),
      credentials: 'include'
    });
    
    console.log('Update response status:', updateResponse.status);
    console.log('Update response headers:', Object.fromEntries(updateResponse.headers.entries()));
    
    const responseText = await updateResponse.text();
    console.log('Update response body:', responseText);
    
    if (!updateResponse.ok) {
      console.log('\nError details:');
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error message:', errorData.message);
      } catch (e) {
        console.log('Raw error response:', responseText);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testOrderStatusUpdate();