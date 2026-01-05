// Clean up auto-generated sample orders to show only real customer orders
import postgres from 'postgres';

async function cleanSampleOrders() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  console.log('🧹 Cleaning up auto-generated sample orders...');
  
  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    // First, show current orders
    const currentOrders = await sql`
      SELECT id, customer_name, customer_email, total_amount, status, created_at
      FROM orders 
      ORDER BY created_at DESC
    `;
    
    console.log(`📋 Current Orders (${currentOrders.length}):`);
    currentOrders.forEach((order, index) => {
      const date = new Date(order.created_at).toLocaleString();
      console.log(`${index + 1}. ${order.customer_name || 'Unknown'} - ₦${order.total_amount} (${order.status}) - ${date}`);
    });
    
    console.log('');
    
    // Delete sample orders (the ones with generic names like "John Doe", "Jane Smith", etc.)
    const sampleNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    
    console.log('🗑️ Deleting sample orders and their items...');
    
    for (const name of sampleNames) {
      // First get the order IDs
      const ordersToDelete = await sql`
        SELECT id, customer_name, total_amount
        FROM orders 
        WHERE customer_name = ${name}
      `;
      
      for (const order of ordersToDelete) {
        // Delete order items first
        await sql`DELETE FROM order_items WHERE order_id = ${order.id}`;
        
        // Then delete the order
        await sql`DELETE FROM orders WHERE id = ${order.id}`;
        
        console.log(`   ✅ Deleted: ${order.customer_name} - ₦${order.total_amount} (ID: ${order.id.slice(0, 8)})`);
      }
    }
    
    // Also delete the test orders I created
    const testOrders = await sql`
      SELECT id, customer_name, total_amount
      FROM orders 
      WHERE customer_name LIKE '%Test%' OR customer_email LIKE '%test%' OR customer_email LIKE '%example.com'
    `;
    
    if (testOrders.length > 0) {
      console.log('🧪 Deleting test orders:');
      for (const order of testOrders) {
        // Delete order items first
        await sql`DELETE FROM order_items WHERE order_id = ${order.id}`;
        
        // Then delete the order
        await sql`DELETE FROM orders WHERE id = ${order.id}`;
        
        console.log(`   ✅ Deleted: ${order.customer_name} - ₦${order.total_amount} (ID: ${order.id.slice(0, 8)})`);
      }
    }
    
    console.log('');
    
    // Show remaining orders
    const remainingOrders = await sql`
      SELECT id, customer_name, customer_email, total_amount, status, created_at
      FROM orders 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Remaining Orders (${remainingOrders.length}):`);
    if (remainingOrders.length > 0) {
      remainingOrders.forEach((order, index) => {
        const date = new Date(order.created_at).toLocaleString();
        console.log(`${index + 1}. ${order.customer_name || 'Unknown'} - ₦${order.total_amount} (${order.status}) - ${date}`);
      });
    } else {
      console.log('   No orders remaining - ready for real customer orders!');
    }
    
    // Update analytics
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
    
    console.log('');
    console.log('📈 Updated Analytics:');
    console.log(`   - Total Orders: ${stats.total_orders}`);
    console.log(`   - Total Sales: ₦${(stats.total_sales || 0).toLocaleString()}`);
    console.log(`   - Completed Sales: ₦${(stats.completed_sales || 0).toLocaleString()}`);
    console.log(`   - Completed Orders: ${stats.completed_orders}`);
    console.log(`   - Pending Orders: ${stats.pending_orders}`);
    console.log(`   - Processing Orders: ${stats.processing_orders}`);
    
    console.log('');
    console.log('✅ Cleanup complete!');
    console.log('🎯 Now when customers place real orders, they will appear in the admin dashboard');
    console.log('📊 Analytics will show real customer data only');
    
  } catch (error) {
    console.error('❌ Failed to clean orders:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

cleanSampleOrders();