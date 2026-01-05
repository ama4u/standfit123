// Test the order fix by placing a test order with correct product IDs
import fetch from 'node-fetch';

async function testOrderFix() {
  console.log('🧪 Testing order analytics fix...');
  
  // First, let's get available products
  console.log('📋 Fetching available products...');
  
  try {
    const productsResponse = await fetch('https://standfit-e816d09b795a.herokuapp.com/api/products');
    if (!productsResponse.ok) {
      console.error('❌ Failed to fetch products:', productsResponse.status);
      return;
    }
    
    const products = await productsResponse.json();
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length === 0) {
      console.error('❌ No products available for testing');
      return;
    }
    
    // Use the first available product
    const testProduct = products[0];
    console.log(`🎯 Using product: ${testProduct.name} (ID: ${testProduct.id}) - ₦${testProduct.price}`);
    
    // Create test order
    const orderData = {
      items: [
        { productId: testProduct.id, quantity: 2 }
      ],
      customerName: 'Test Customer Analytics',
      customerEmail: 'analytics-test@example.com',
      customerPhone: '+2348123456789',
      fulfillmentMethod: 'delivery',
      shippingAddress: '123 Analytics Test Street, Lagos, Nigeria',
      paymentMethod: 'bank_transfer',
      notes: 'Test order to verify analytics fix - should appear in admin dashboard'
    };

    console.log('📤 Placing test order...');
    
    const orderResponse = await fetch('https://standfit-e816d09b795a.herokuapp.com/api/guest/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('❌ Order failed:', orderResponse.status, error);
      return;
    }

    const result = await orderResponse.json();
    const expectedTotal = testProduct.price * 2;
    
    console.log('✅ Order placed successfully!');
    console.log('📋 Order Details:');
    console.log(`   - Order ID: ${result.id}`);
    console.log(`   - Customer: ${result.customerName}`);
    console.log(`   - Email: ${result.customerEmail}`);
    console.log(`   - Phone: ${result.customerPhone}`);
    console.log(`   - Total: ₦${result.totalAmount} (Expected: ₦${expectedTotal})`);
    console.log(`   - Status: ${result.status}`);
    console.log(`   - Payment: ${result.paymentMethod}`);
    console.log(`   - Address: ${result.shippingAddress}`);
    console.log(`   - Created: ${new Date(result.createdAt).toLocaleString()}`);
    
    console.log('');
    console.log('🎯 SUCCESS! This order should now appear in the admin analytics dashboard!');
    console.log('📊 Expected analytics impact:');
    console.log(`   - Total orders should increase by 1`);
    console.log(`   - Total sales should increase by ₦${result.totalAmount}`);
    console.log(`   - Pending orders should increase by 1`);
    console.log('');
    console.log('🔗 Check the admin dashboard at: https://standfit-e816d09b795a.herokuapp.com/admin');
    console.log('🔑 Login with: standfit2025@standfit.com / Standfit@1447');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrderFix();