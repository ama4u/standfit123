// Test session store functionality
import postgres from 'postgres';

async function testSessionStore() {
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
    console.log('🔍 Testing session store...');
    
    // Check if user_sessions table exists
    try {
      const sessions = await sql`
        SELECT COUNT(*) as count
        FROM user_sessions
      `;
      console.log(`✅ Session table exists with ${sessions[0].count} sessions`);
    } catch (error) {
      console.log('❌ Session table (user_sessions) not found:', error.message);
    }
    
    // Check if sessions table exists (alternative name)
    try {
      const sessions = await sql`
        SELECT COUNT(*) as count
        FROM sessions
      `;
      console.log(`✅ Alternative session table exists with ${sessions[0].count} sessions`);
    } catch (error) {
      console.log('❌ Alternative session table (sessions) not found:', error.message);
    }
    
    // List all tables to see what exists
    console.log('\n📋 Available tables:');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

testSessionStore();