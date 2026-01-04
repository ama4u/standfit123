// Check admin users in the database
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { adminUsers } from "./shared/schema.js";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

async function checkAdminUsers() {
  console.log('🔍 Checking admin users in database...');
  
  try {
    const admins = await db.select().from(adminUsers);
    
    console.log(`📊 Found ${admins.length} admin users:`);
    
    admins.forEach((admin, index) => {
      console.log(`\n👤 Admin ${index + 1}:`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log(`   Password Hash: ${admin.passwordHash ? 'Set' : 'Not Set'}`);
    });
    
    if (admins.length === 0) {
      console.log('\n⚠️  No admin users found! You need to create an admin user.');
      console.log('Run: npm run admin:manage');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
  } finally {
    sqlite.close();
  }
}

checkAdminUsers();