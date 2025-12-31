import { db } from './server/db.ts';
import { categories, products } from './shared/schema.ts';

console.log('🔍 Checking database contents...');

try {
  const allCategories = await db.select().from(categories);
  console.log(`📂 Categories (${allCategories.length}):`);
  allCategories.forEach(cat => {
    console.log(`  - ${cat.name} (${cat.slug})`);
  });

  const allProducts = await db.select().from(products);
  console.log(`\n📦 Products (${allProducts.length}):`);
  allProducts.forEach(prod => {
    console.log(`  - ${prod.name} - ₦${prod.price?.toLocaleString() || 'N/A'}`);
  });

} catch (error) {
  console.error('❌ Error checking data:', error);
}

process.exit(0);