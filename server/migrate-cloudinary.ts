// Migration script to add publicId column to news_flash_items table
import Database from 'better-sqlite3';

const db = new Database('./sqlite.db');

try {
  // Add publicId column to news_flash_items table
  db.prepare(`ALTER TABLE news_flash_items ADD COLUMN public_id TEXT`).run();
  console.log('✅ Successfully added public_id column to news_flash_items table');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('✅ public_id column already exists in news_flash_items table');
  } else {
    console.error('❌ Error adding public_id column:', error.message);
  }
}

db.close();
console.log('Migration completed!');