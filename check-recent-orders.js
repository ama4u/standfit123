import postgres from 'postgres';

async function checkRecentOrders() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  console.log('🐘 Connecting to PostgreSQL...');
  
  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    console.log('🔍 Checking recent orders and analytics...');
    
    // Get all orders with details
    const orders = await sql`
      SELECT id, customer_name, customer_email, total_amount, status, payment_status, created_at
      FROM orders 
      ORDER BY created_at DESC
    `;
    
    console.log(`📋 Total Orders Found: ${orders.length}`);
    console.log('');
    
    if (orders.length > 0) {
      console.log('📊 Recent Orders:');
      orders.forEach((order, index) => {
        const date = new Date(order.created_at).toLocaleString();
        console.log(`${index + 1}. ${order.customer_name || 'Unknown'} - ₦${order.total_amount} (${order.status}) - ${date}`);
      });
    }
    
    console.log('');
    
    // Check analytics calculation
    const analytics = await sql`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as completed_sales,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders
      FROM orders
    `;
    
    const stats = analytics[0];
    
    console.log('📈 Current Analytics:');
    console.log(`   - Total Orders: ${stats.total_orders}`);
    console.log(`   - Total Sales (All): ₦${(stats.total_sales || 0).toLocaleString()}`);
    console.log(`   - Completed Sales: ₦${(stats.completed_sales || 0).toLocaleString()}`);
    console.log(`   - Completed Orders: ${stats.completed_orders}`);
    console.log(`   - Pending Orders: ${stats.pending_orders}`);
    console.log(`   - Processing Orders: ${stats.processing_orders}`);
    
    console.log('');
    
    // Check for the ₦500 order specifically
    const recentOrder = await sql`
      SELECT * FROM orders 
      WHERE total_amount = 500 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (recentOrder.length > 0) {
      const order = recentOrder[0];
      console.log('🎯 Found ₦500 Order:');
      console.log(`   - Customer: ${order.customer_name || 'Unknown'}`);
      console.log(`   - Email: ${order.customer_email || 'Unknown'}`);
      console.log(`   - Status: ${order.status}`);
      console.log(`   - Payment Status: ${order.payment_status}`);
      console.log(`   - Created: ${new Date(order.created_at).toLocaleString()}`);
      console.log(`   - Total: ₦${order.total_amount}`);
      
      // Check order items
      const orderItems = await sql`
        SELECT oi.*, p.name as product_name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${order.id}
      `;
      
      console.log(`   - Items: ${orderItems.length}`);
      orderItems.forEach(item => {
        console.log(`     * ${item.product_name || 'Unknown Product'} x${item.quantity} @ ₦${item.price_at_order}`);
      });
      
      if (order.status !== 'completed') {
        console.log('');
        console.log('💡 Note: Order is not "completed" status, so it won\'t count toward sales analytics');
        console.log('   Only completed orders are included in sales totals');
      }
    } else {
      console.log('❌ No ₦500 order found in database');
      console.log('');
      console.log('🔍 Possible reasons:');
      console.log('   1. Order failed to save to database');
      console.log('   2. Order was saved with different amount');
      console.log('   3. Order was only sent via WhatsApp');
    }
    
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if you were logged in when placing order');
    console.log('   2. Verify "Place Order" button was clicked (not just WhatsApp)');
    console.log('   3. Check browser console for any errors');
    console.log('   4. Try placing another test order');
    
  } catch (error) {
    console.error('❌ Failed to check orders:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

checkRecentOrders();