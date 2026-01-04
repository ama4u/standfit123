import postgres from 'postgres';
import bcrypt from 'bcryptjs';

async function fixAdminAuth() {
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
    console.log('🔍 Checking admin users...');
    
    const admins = await sql`SELECT id, email, first_name, last_name, role, created_at FROM admin_users`;
    
    console.log('👥 Admin users found:', admins.length);
    admins.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.role}) - Created: ${admin.created_at}`);
    });
    
    if (admins.length === 0) {
      console.log('⚠️  No admin users found! Creating default admin...');
      
      const hashedPassword = await bcrypt.hash('Standfit@1447', 10);
      
      await sql`
        INSERT INTO admin_users (email, password, first_name, last_name, role)
        VALUES ('standfit2025@standfit.com', ${hashedPassword}, 'Admin', 'User', 'admin')
      `;
      
      console.log('✅ Default admin created: standfit2025@standfit.com / Standfit@1447');
    }
    
    // Test password verification
    console.log('🔐 Testing password verification...');
    const [testAdmin] = await sql`SELECT * FROM admin_users WHERE email = 'standfit2025@standfit.com'`;
    
    if (testAdmin) {
      const isValid = await bcrypt.compare('Standfit@1447', testAdmin.password);
      console.log(`   Password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    // Update products with working images
    console.log('🖼️  Updating product images...');
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Premium Basmati Rice'
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Local Brown Rice'
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Black Beans'
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Red Kidney Beans'
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Turmeric Powder'
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&crop=center'
      WHERE name IN ('Palm Oil', 'Vegetable Oil')
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Instant Noodles'
    `;
    
    await sql`
      UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop&crop=center'
      WHERE name = 'Plantain Chips'
    `;
    
    console.log('✅ Product images updated with working URLs');
    
    console.log('🎉 Admin authentication and images fixed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Go to: https://standfit-e816d09b795a.herokuapp.com/admin-login');
    console.log('   2. Login with: standfit2025@standfit.com / Standfit@1447');
    console.log('   3. You should now be able to add categories and manage products');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fixAdminAuth();