// Test script to place a guest order and verify it gets saved to database
import fetch from 'node-fetch';

async function testGuestOrder() {
  console.log('🧪 Testing guest order placement...');
  
  const orderData = {
    items: [
      { productId: '1', quantity: 1 }, // Assuming product ID 1 exists
    ],
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '+2348123456789',
    fulfillmentMethod: 'delivery',
    shippingAddress: '123 Test Street, Lagos, Nigeria',
    paymentMethod: 'bank_transfer',
    notes: 'Test order for analytics verification'
  };

  try {
    console.log('📤 Sending order to /api/guest/orders...');
    
    const response = await fetch('https://standfit-e816d09b795a.herokuapp.com/api/guest/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Order failed:', response.status, error);
      return;
    }

    const result = await response.json();
    console.log('✅ Order placed successfully!');
    console.log('📋 Order Details:');
    console.log(`   - Order ID: ${result.id}`);
    console.log(`   - Customer: ${result.customerName}`);
    console.log(`   - Total: ₦${result.totalAmount}`);
    console.log(`   - Status: ${result.status}`);
    console.log(`   - Created: ${new Date(result.createdAt).toLocaleString()}`);
    
    console.log('');
    console.log('🎯 This order should now appear in the admin analytics!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGuestOrder();