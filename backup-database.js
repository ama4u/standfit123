// Script to backup SQLite database to Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dih456opf',
  api_key: '815796146159497',
  api_secret: 'Ng87W5wXUkfJByI4JFPYlJ9sa1s'
});

async function backupDatabase() {
  console.log('💾 Starting database backup...');
  
  const dbPath = './sqlite.db';
  
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Database file not found');
    return;
  }
  
  try {
    // Upload database file to Cloudinary
    const result = await cloudinary.uploader.upload(dbPath, {
      public_id: `standfit-backups/sqlite-${Date.now()}`,
      resource_type: 'raw',
      folder: 'standfit-backups'
    });
    
    console.log('✅ Database backed up successfully');
    console.log(`📁 Backup URL: ${result.secure_url}`);
    console.log(`🆔 Public ID: ${result.public_id}`);
    
    return result;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    return null;
  }
}

async function restoreDatabase(publicId) {
  console.log(`🔄 Restoring database from ${publicId}...`);
  
  try {
    // Download the backup from Cloudinary
    const url = cloudinary.url(publicId, { resource_type: 'raw' });
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download backup: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync('./sqlite.db', Buffer.from(buffer));
    
    console.log('✅ Database restored successfully');
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
  }
}

// Check command line arguments
const command = process.argv[2];
const publicId = process.argv[3];

if (command === 'backup') {
  backupDatabase();
} else if (command === 'restore' && publicId) {
  restoreDatabase(publicId);
} else {
  console.log('Usage:');
  console.log('  node backup-database.js backup');
  console.log('  node backup-database.js restore <public_id>');
}