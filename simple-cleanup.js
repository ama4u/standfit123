// Simple cleanup of sample orders
import postgres from 'postgres';

async function simpleCleanup() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    console.log('🧹 Cleaning sample orders...');
    
    // Delete order items for sample orders first
    await sql`
      DELETE FROM order_items 
      WHERE order_id IN (
        SELECT id FROM orders 
        WHERE customer_name IN ('John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown')
           OR customer_name LIKE '%Test%' 
           OR customer_email LIKE '%test%' 
           OR customer_email LIKE '%example.com'
      )
    `;
    
    // Then delete the orders
    const deleted = await sql`
      DELETE FROM orders 
      WHERE customer_name IN ('John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown')
         OR customer_name LIKE '%Test%' 
         OR customer_email LIKE '%test%' 
         OR customer_email LIKE '%example.com'
      RETURNING customer_name, total_amount
    `;
    
    console.log(`✅ Deleted ${deleted.length} sample/test orders`);
    
    // Show remaining orders
    const remaining = await sql`SELECT customer_name, total_amount, status FROM orders ORDER BY created_at DESC`;
    
    console.log(`📊 Remaining orders: ${remaining.length}`);
    remaining.forEach((order, i) => {
      console.log(`${i+1}. ${order.customer_name} - ₦${order.total_amount} (${order.status})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

simpleCleanup();