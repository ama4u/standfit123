// Setup script for PostgreSQL migration
import { execSync } from 'child_process';
import fs from 'fs';

async function setupPostgreSQL() {
  console.log('🚀 Setting up PostgreSQL for Standfit...\n');

  try {
    // 1. Get Heroku database URL
    console.log('📡 Getting Heroku database URL...');
    const configOutput = execSync('heroku config:get DATABASE_URL --app standfit', { encoding: 'utf8' });
    const databaseUrl = configOutput.trim();
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found in Heroku config');
    }
    
    console.log('✅ Database URL retrieved');
    console.log(`🔗 URL: ${databaseUrl.substring(0, 50)}...`);

    // 2. Set environment variable for this session
    process.env.DATABASE_URL = databaseUrl;
    
    // 3. Create PostgreSQL schema
    console.log('\n📋 Creating PostgreSQL schema...');
    execSync('npx drizzle-kit push --config=drizzle.config.postgres.ts', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    });
    
    console.log('✅ PostgreSQL schema created successfully');

    // 4. Run migration from SQLite to PostgreSQL
    console.log('\n🔄 Migrating data from SQLite to PostgreSQL...');
    
    // Check if SQLite database exists
    if (fs.existsSync('./sqlite.db')) {
      execSync('node migrate-to-postgres.js', { 
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: databaseUrl }
      });
      console.log('✅ Data migration completed');
    } else {
      console.log('⚠️  No SQLite database found, skipping data migration');
    }

    console.log('\n🎉 PostgreSQL setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy the updated application to Heroku');
    console.log('2. The app will automatically use PostgreSQL in production');
    console.log('3. Images and data will now persist across restarts');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupPostgreSQL();