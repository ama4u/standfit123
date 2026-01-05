// Test the exact delete error
import postgres from 'postgres';

async function testDeleteError() {
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
    console.log('🧪 Testing product deletion logic...');
    
    const productId = 'e5f0b9d2-cd53-4b02-a342-2227ae80857d';
    console.log(`🎯 Testing product: ${productId}`);
    
    // Test the exact query that should be running
    console.log('1️⃣ Checking order items for this product...');
    
    const orderItemsCount = await sql`
      SELECT COUNT(*) as count
      FROM order_items
      WHERE product_id = ${productId}
    `;
    
    console.log(`📊 Order items found: ${orderItemsCount[0].count}`);
    
    if (orderItemsCount[0].count > 0) {
      console.log(`❌ Cannot delete: Product is referenced in ${orderItemsCount[0].count} order(s)`);
      console.log('✅ This should throw an error with helpful message');
    } else {
      console.log('✅ Product can be safely deleted');
    }
    
    // Test if the product exists
    console.log('\n2️⃣ Checking if product exists...');
    
    const product = await sql`
      SELECT id, name
      FROM products
      WHERE id = ${productId}
    `;
    
    if (product.length > 0) {
      console.log(`✅ Product exists: ${product[0].name}`);
    } else {
      console.log('❌ Product not found');
    }
    
    console.log('\n🔧 The error might be:');
    console.log('   1. Syntax error in the deleteProduct method');
    console.log('   2. Database connection issue');
    console.log('   3. Import/export issue with orderItems');
    console.log('   4. Drizzle ORM query syntax error');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sql.end();
  }
}

testDeleteError();