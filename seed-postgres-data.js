import postgres from 'postgres';
import bcrypt from 'bcryptjs';

async function seedData() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  console.log('🐘 Connecting to PostgreSQL...');
  
  // Create connection with SSL
  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    console.log('👤 Creating admin user...');
    
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('Standfit@1447', 10);
    
    // Insert admin user
    await sql`
      INSERT INTO admin_users (email, password, first_name, last_name, role)
      VALUES ('standfit2025@standfit.com', ${hashedPassword}, 'Admin', 'User', 'admin')
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        updated_at = NOW()
    `;
    
    console.log('✅ Admin user created: standfit2025@standfit.com / Standfit@1447');
    
    console.log('📦 Creating categories...');
    
    // Insert categories
    const categories = [
      { name: 'Grains & Cereals', slug: 'grains-cereals', description: 'Rice, wheat, oats, and other grains' },
      { name: 'Legumes & Pulses', slug: 'legumes-pulses', description: 'Beans, lentils, chickpeas, and peas' },
      { name: 'Spices & Seasonings', slug: 'spices-seasonings', description: 'Local and international spices' },
      { name: 'Oils & Fats', slug: 'oils-fats', description: 'Cooking oils, palm oil, and other fats' },
      { name: 'Processed Foods', slug: 'processed-foods', description: 'Packaged and processed food items' }
    ];
    
    for (const category of categories) {
      await sql`
        INSERT INTO categories (name, slug, description)
        VALUES (${category.name}, ${category.slug}, ${category.description})
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = NOW()
      `;
    }
    
    console.log('✅ Categories created');
    
    console.log('🛍️ Creating products with Cloudinary images...');
    
    // Get category IDs
    const grainsCat = await sql`SELECT id FROM categories WHERE slug = 'grains-cereals'`;
    const legumesCat = await sql`SELECT id FROM categories WHERE slug = 'legumes-pulses'`;
    const spicesCat = await sql`SELECT id FROM categories WHERE slug = 'spices-seasonings'`;
    const oilsCat = await sql`SELECT id FROM categories WHERE slug = 'oils-fats'`;
    const processedCat = await sql`SELECT id FROM categories WHERE slug = 'processed-foods'`;
    
    // Products with Cloudinary URLs
    const products = [
      {
        name: 'Premium Basmati Rice',
        description: 'Long grain aromatic basmati rice, perfect for special occasions',
        price: 2500,
        wholesalePrice: 2200,
        unit: 'kg',
        categoryId: grainsCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/premium-basmati-rice.svg',
        featured: true
      },
      {
        name: 'Local Brown Rice',
        description: 'Nutritious locally grown brown rice',
        price: 1800,
        wholesalePrice: 1600,
        unit: 'kg',
        categoryId: grainsCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/local-brown-rice.svg',
        isLocallyMade: true
      },
      {
        name: 'Black Beans',
        description: 'Premium quality black beans, rich in protein',
        price: 1200,
        wholesalePrice: 1000,
        unit: 'kg',
        categoryId: legumesCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/black-beans.svg'
      },
      {
        name: 'Red Kidney Beans',
        description: 'Fresh red kidney beans for soups and stews',
        price: 1400,
        wholesalePrice: 1200,
        unit: 'kg',
        categoryId: legumesCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/red-kidney-beans.svg',
        featured: true
      },
      {
        name: 'Curry Powder',
        description: 'Authentic Nigerian curry powder blend',
        price: 800,
        wholesalePrice: 650,
        unit: 'g',
        packageSize: 500,
        categoryId: spicesCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/curry-powder.svg',
        isLocallyMade: true
      },
      {
        name: 'Turmeric Powder',
        description: 'Pure turmeric powder for cooking and health',
        price: 600,
        wholesalePrice: 500,
        unit: 'g',
        packageSize: 250,
        categoryId: spicesCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/turmeric-powder.svg'
      },
      {
        name: 'Palm Oil',
        description: 'Fresh red palm oil from local farms',
        price: 3000,
        wholesalePrice: 2700,
        unit: 'liters',
        categoryId: oilsCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/palm-oil.svg',
        isLocallyMade: true,
        featured: true
      },
      {
        name: 'Vegetable Oil',
        description: 'Pure vegetable cooking oil',
        price: 2200,
        wholesalePrice: 2000,
        unit: 'liters',
        categoryId: oilsCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/vegetable-oil.svg'
      },
      {
        name: 'Instant Noodles',
        description: 'Quick cooking instant noodles',
        price: 150,
        wholesalePrice: 120,
        unit: 'pack',
        minOrderQuantity: 12,
        categoryId: processedCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/instant-noodles.svg'
      },
      {
        name: 'Plantain Chips',
        description: 'Crispy locally made plantain chips',
        price: 500,
        wholesalePrice: 400,
        unit: 'g',
        packageSize: 200,
        categoryId: processedCat[0].id,
        imageUrl: 'https://res.cloudinary.com/dih456opf/image/upload/v1735995600/standfit-products/plantain-chips.svg',
        isLocallyMade: true
      }
    ];
    
    for (const product of products) {
      await sql`
        INSERT INTO products (
          name, description, price, wholesale_price, unit, min_order_quantity,
          package_size, package_unit, category_id, image_url, is_locally_made,
          in_stock, featured
        )
        VALUES (
          ${product.name}, ${product.description}, ${product.price}, 
          ${product.wholesalePrice}, ${product.unit}, ${product.minOrderQuantity || 1},
          ${product.packageSize || 1}, ${product.packageUnit || product.unit}, 
          ${product.categoryId}, ${product.imageUrl}, ${product.isLocallyMade || false},
          true, ${product.featured || false}
        )
      `;
    }
    
    console.log('✅ Products created with persistent Cloudinary images');
    
    // Check final counts
    const adminCount = await sql`SELECT COUNT(*) as count FROM admin_users`;
    const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`;
    const productCount = await sql`SELECT COUNT(*) as count FROM products`;
    
    console.log('📊 Database seeded successfully:');
    console.log(`   - Admin users: ${adminCount[0].count}`);
    console.log(`   - Categories: ${categoryCount[0].count}`);
    console.log(`   - Products: ${productCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedData();