import postgres from 'postgres';

async function addNotificationsTable() {
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
    console.log('📋 Creating notifications table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES users(id) NOT NULL,
        title text NOT NULL,
        message text NOT NULL,
        type text DEFAULT 'info',
        is_read boolean DEFAULT false,
        created_at timestamp DEFAULT now()
      );
    `;
    
    console.log('✅ Notifications table created successfully!');
    
  } catch (error) {
    console.error('❌ Failed to create notifications table:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

addNotificationsTable();