const Database = require('better-sqlite3');
const db = new Database('./sqlite.db');

console.log('🔧 Fixing database schema...');

try {
  // Add missing columns to products table if they don't exist
  const columns = [
    'min_order_quantity INTEGER DEFAULT 1',
    'package_size INTEGER DEFAULT 1', 
    'package_unit TEXT',
    'wholesale_price REAL',
    'is_locally_made INTEGER DEFAULT 0',
    'featured INTEGER DEFAULT 0',
    'updated_at INTEGER'
  ];

  columns.forEach(column => {
    try {
      const [columnName] = column.split(' ');
      db.prepare(`ALTER TABLE products ADD COLUMN ${column}`).run();
      console.log(`✅ Added column: ${columnName}`);
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log(`⚠️  Column already exists: ${column.split(' ')[0]}`);
      } else {
        console.log(`❌ Error adding column ${column.split(' ')[0]}:`, error.message);
      }
    }
  });

  // Ensure news_flash_items table exists
  try {
    db.prepare(`CREATE TABLE IF NOT EXISTS news_flash_items (
      id TEXT PRIMARY KEY,
      title TEXT,
      url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at INTEGER
    )`).run();
    console.log('✅ News flash table ensured');
  } catch (error) {
    console.log('❌ Error creating news_flash_items table:', error.message);
  }

  // Update any existing products to have default values
  try {
    db.prepare(`UPDATE products SET 
      min_order_quantity = COALESCE(min_order_quantity, 1),
      package_size = COALESCE(package_size, 1),
      is_locally_made = COALESCE(is_locally_made, 0),
      featured = COALESCE(featured, 0),
      updated_at = COALESCE(updated_at, created_at)
      WHERE min_order_quantity IS NULL OR package_size IS NULL`).run();
    console.log('✅ Updated existing products with default values');
  } catch (error) {
    console.log('⚠️  Could not update existing products:', error.message);
  }

  console.log('🎉 Database schema fixed successfully!');
  
} catch (error) {
  console.error('❌ Error fixing database:', error);
} finally {
  db.close();
}