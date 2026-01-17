import postgres from 'postgres';

async function debugProducts() {
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
    console.log('📋 Checking if products table exists...');
    
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `;
    
    console.log('Products table exists:', tableExists[0].exists);
    
    if (tableExists[0].exists) {
      console.log('📊 Counting products...');
      const count = await sql`SELECT COUNT(*) as count FROM products`;
      console.log(`Products count: ${count[0].count}`);
      
      if (count[0].count > 0) {
        console.log('📝 Getting first product...');
        const firstProduct = await sql`SELECT * FROM products LIMIT 1`;
        console.log('First product:', firstProduct[0]);
      }
    }
    
    console.log('📋 Checking weekly_deals table...');
    const weeklyDealsExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'weekly_deals'
      );
    `;
    
    console.log('Weekly deals table exists:', weeklyDealsExists[0].exists);
    
    if (weeklyDealsExists[0].exists) {
      const weeklyCount = await sql`SELECT COUNT(*) as count FROM weekly_deals`;
      console.log(`Weekly deals count: ${weeklyCount[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sql.end();
  }
}

debugProducts();