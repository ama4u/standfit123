import { db } from './server/db.ts';
import { categories, products } from './shared/schema.ts';

console.log('🌱 Adding sample categories and products...');

try {
  // Add categories
  const categoryData = [
    {
      name: 'Rice & Grains',
      slug: 'rice-grains',
      description: 'Premium quality rice and grain products'
    },
    {
      name: 'Cooking Oil',
      slug: 'cooking-oil',
      description: 'Pure and refined cooking oils'
    },
    {
      name: 'Seasonings',
      slug: 'seasonings',
      description: 'Spices and seasoning cubes'
    },
    {
      name: 'Beverages',
      slug: 'beverages',
      description: 'Coffee, tea and drink mixes'
    },
    {
      name: 'Sugar & Sweeteners',
      slug: 'sugar-sweeteners',
      description: 'Sugar and natural sweeteners'
    }
  ];

  console.log('Adding categories...');
  const insertedCategories = [];
  for (const cat of categoryData) {
    const [inserted] = await db.insert(categories).values(cat).returning();
    insertedCategories.push(inserted);
    console.log(`✓ Added category: ${cat.name}`);
  }

  // Add products
  const productData = [
    {
      name: 'Premium Basmati Rice',
      description: 'High-quality imported basmati rice, perfect for special occasions',
      price: 15000,
      categoryId: insertedCategories[0].id,
      imageUrl: '/attached_assets/IMG-20231023-WA0011_1756830496568.jpg',
      isLocallyMade: false,
      inStock: true
    },
    {
      name: 'Golden Penny Semovita',
      description: 'Premium semolina flour for making delicious swallow',
      price: 8500,
      categoryId: insertedCategories[0].id,
      imageUrl: '/attached_assets/sugar_1756848497888.jpg',
      isLocallyMade: true,
      inStock: true
    },
    {
      name: 'Devon King Cooking Oil',
      description: 'Pure vegetable cooking oil for all your cooking needs',
      price: 12000,
      categoryId: insertedCategories[1].id,
      imageUrl: '/attached_assets/IMG-20231023-WA0025_1756830496570.jpg',
      isLocallyMade: true,
      inStock: true
    },
    {
      name: 'Maggi Seasoning Cubes',
      description: 'Classic seasoning cubes for enhanced flavor',
      price: 3500,
      categoryId: insertedCategories[2].id,
      imageUrl: '/attached_assets/IMG-20231023-WA0025_1756830496570.jpg',
      isLocallyMade: true,
      inStock: true
    },
    {
      name: 'TopCafe Coffee Mix',
      description: 'Premium instant coffee mix with rich flavor',
      price: 5500,
      categoryId: insertedCategories[3].id,
      imageUrl: '/attached_assets/topcafe_1756850008908.webp',
      isLocallyMade: true,
      inStock: true
    },
    {
      name: 'Dangote Sugar',
      description: 'Pure refined white sugar from Dangote',
      price: 7500,
      categoryId: insertedCategories[4].id,
      imageUrl: '/attached_assets/sugar_1756848882044.jpg',
      isLocallyMade: true,
      inStock: true
    }
  ];

  console.log('Adding products...');
  for (const prod of productData) {
    const [inserted] = await db.insert(products).values(prod).returning();
    console.log(`✓ Added product: ${prod.name} - ₦${prod.price.toLocaleString()}`);
  }

  console.log('🎉 Sample data added successfully!');
  console.log(`📦 Added ${categoryData.length} categories and ${productData.length} products`);

} catch (error) {
  console.error('❌ Error adding sample data:', error);
}

process.exit(0);