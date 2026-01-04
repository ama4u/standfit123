import postgres from 'postgres';

async function checkConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  console.log('🔍 Database URL prefix:', databaseUrl.substring(0, 50) + '...');
  
  // Create connection with SSL
  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    console.log('🐘 Testing PostgreSQL connection...');
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('📋 Tables found:', tables.map(t => t.table_name));
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found - migration needed');
    } else {
      console.log('✅ Database has tables');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await sql.end();
  }
}

checkConnection();