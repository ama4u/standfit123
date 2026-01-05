// Fix admin authentication and product deletion issues
import postgres from 'postgres';

async function fixAdminIssues() {
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
    console.log('🔧 Diagnosing admin authentication and product deletion issues...');
    console.log('');
    
    // Issue 1: Check admin users
    console.log('1️⃣ Checking admin users...');
    
    const adminUsers = await sql`
      SELECT id, email, first_name, last_name, created_at
      FROM admin_users
      ORDER BY created_at DESC
    `;
    
    console.log(`📋 Admin users found: ${adminUsers.length}`);
    adminUsers.forEach((admin, i) => {
      console.log(`   ${i+1}. ${admin.email} (${admin.first_name} ${admin.last_name}) - ID: ${admin.id}`);
    });
    
    // Issue 2: Check products and their references
    console.log('\n2️⃣ Checking products and foreign key references...');
    
    const products = await sql`
      SELECT id, name, price, created_at
      FROM products
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    console.log(`📋 Recent products: ${products.length}`);
    
    for (const product of products) {
      console.log(`\n🔍 Product: ${product.name} (ID: ${product.id.slice(0, 8)}...)`);
      
      // Check if product is referenced in order_items
      const orderItems = await sql`
        SELECT COUNT(*) as count
        FROM order_items
        WHERE product_id = ${product.id}
      `;
      
      const orderCount = orderItems[0].count;
      console.log(`   - Referenced in ${orderCount} order items`);
      
      if (orderCount > 0) {
        console.log(`   ⚠️ Cannot delete - has order references`);
      } else {
        console.log(`   ✅ Can be safely deleted`);
      }
    }
    
    // Issue 3: Check session store
    console.log('\n3️⃣ Checking session store...');
    
    try {
      const sessions = await sql`
        SELECT COUNT(*) as count
        FROM sessions
      `;
      console.log(`📋 Active sessions: ${sessions[0].count}`);
    } catch (error) {
      console.log('❌ Session table not found or accessible');
    }
    
    console.log('\n🔧 Recommended fixes:');
    console.log('');
    console.log('For Admin Authentication (401 errors):');
    console.log('   1. Clear browser cookies and login again');
    console.log('   2. Check if session store is working properly');
    console.log('   3. Verify admin credentials are correct');
    console.log('');
    console.log('For Product Deletion (500 errors):');
    console.log('   1. Products with order references cannot be deleted');
    console.log('   2. Need to implement cascade delete or prevent deletion');
    console.log('   3. Consider soft delete (marking as inactive) instead');
    
    // Issue 4: Find products that can be safely deleted
    console.log('\n4️⃣ Products that can be safely deleted:');
    
    const deletableProducts = await sql`
      SELECT p.id, p.name, p.price
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      WHERE oi.product_id IS NULL
      ORDER BY p.created_at DESC
    `;
    
    if (deletableProducts.length > 0) {
      console.log(`✅ Found ${deletableProducts.length} products without order references:`);
      deletableProducts.forEach((product, i) => {
        console.log(`   ${i+1}. ${product.name} - ₦${product.price} (ID: ${product.id.slice(0, 8)}...)`);
      });
    } else {
      console.log('❌ No products can be safely deleted - all have order references');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

fixAdminIssues();