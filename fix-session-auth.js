import postgres from 'postgres';
import bcrypt from 'bcryptjs';

async function fixSessionAuth() {
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
    console.log('🔍 Checking admin users and session setup...');
    
    // Check admin users
    const admins = await sql`SELECT id, email, first_name, last_name, role, created_at FROM admin_users`;
    console.log('👥 Admin users found:', admins.length);
    
    if (admins.length === 0) {
      console.log('⚠️  No admin users found! Creating default admin...');
      
      const hashedPassword = await bcrypt.hash('Standfit@1447', 10);
      
      const [newAdmin] = await sql`
        INSERT INTO admin_users (email, password, first_name, last_name, role)
        VALUES ('standfit2025@standfit.com', ${hashedPassword}, 'Admin', 'User', 'admin')
        RETURNING id, email, first_name, last_name, role
      `;
      
      console.log('✅ Default admin created:', newAdmin);
    } else {
      console.log('✅ Admin users exist:');
      admins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.role}) - ID: ${admin.id}`);
      });
    }
    
    // Test password verification for the main admin
    const [testAdmin] = await sql`SELECT * FROM admin_users WHERE email = 'standfit2025@standfit.com'`;
    
    if (testAdmin) {
      const isValid = await bcrypt.compare('Standfit@1447', testAdmin.password);
      console.log(`🔐 Password verification for ${testAdmin.email}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (!isValid) {
        console.log('🔧 Fixing password...');
        const newHashedPassword = await bcrypt.hash('Standfit@1447', 10);
        await sql`
          UPDATE admin_users 
          SET password = ${newHashedPassword}, updated_at = NOW()
          WHERE email = 'standfit2025@standfit.com'
        `;
        console.log('✅ Password updated');
      }
    }
    
    // Check if we have any orders in the system
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders`;
    console.log(`📊 Current orders in database: ${orderCount[0].count}`);
    
    // Check if we have any products
    const productCount = await sql`SELECT COUNT(*) as count FROM products`;
    console.log(`🛍️  Current products in database: ${productCount[0].count}`);
    
    console.log('');
    console.log('🎯 Next steps to fix admin authentication:');
    console.log('   1. Go to: https://standfit-e816d09b795a.herokuapp.com/admin-login');
    console.log('   2. Clear browser cookies/cache');
    console.log('   3. Login with: standfit2025@standfit.com / Standfit@1447');
    console.log('   4. Try to add a category or manage products');
    console.log('');
    console.log('💡 If still getting 401 errors, the issue is with session storage in production');
    console.log('   This might require switching to a database-backed session store');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fixSessionAuth();