import postgres from 'postgres';

async function testSimpleQuery() {
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
    console.log('📋 Testing simple products query...');
    
    // Test the exact query that the simplified getProducts method would run
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    
    console.log(`✅ Query successful! Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('First product fields:', Object.keys(products[0]));
      console.log('First product:', {
        id: products[0].id,
        name: products[0].name,
        slug: products[0].slug,
        price: products[0].price,
        category_id: products[0].category_id
      });
    }
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sql.end();
  }
}

testSimpleQuery();