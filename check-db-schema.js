import postgres from 'postgres';

async function checkSchema() {
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
    console.log('📋 Checking contact_messages table schema...');
    
    const columns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages'
      ORDER BY ordinal_position;
    `;
    
    console.log('Contact messages columns:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n📋 Checking products table...');
    const productColumns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `;
    
    console.log('Products columns:');
    productColumns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n📋 Checking if products exist...');
    const productCount = await sql`SELECT COUNT(*) as count FROM products`;
    console.log(`Products in database: ${productCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

checkSchema();