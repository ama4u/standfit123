import postgres from 'postgres';

async function checkProductsSchema() {
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
    console.log('📋 Checking products table schema...');
    
    const columns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `;
    
    console.log('Products table columns:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    const hasSlug = columns.some(col => col.column_name === 'slug');
    console.log(`\n🔍 Has slug column: ${hasSlug}`);
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  } finally {
    await sql.end();
  }
}

checkProductsSchema();