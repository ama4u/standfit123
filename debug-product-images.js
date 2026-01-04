// Debug script to investigate product image retrieval issues
import fetch from 'node-fetch';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

async function debugProductImages() {
  console.log('🔍 Debugging Product Image Retrieval...\n');
  
  try {
    // Get all products
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    console.log(`📦 Total products: ${products.length}`);
    console.log('🔍 Detailed product analysis:\n');
    
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}: ${product.name}`);
      console.log(`  ID: ${product.id}`);
      console.log(`  Image URL: ${product.imageUrl || 'NULL/EMPTY'}`);
      console.log(`  Category: ${product.category ? product.category.name : 'No category'}`);
      console.log(`  Created: ${product.createdAt}`);
      console.log(`  Updated: ${product.updatedAt}`);
      console.log('  ---');
    });
    
    // Check if any products have images
    const productsWithImages = products.filter(p => p.imageUrl && p.imageUrl.trim() !== '');
    console.log(`\n📊 Products with images: ${productsWithImages.length}/${products.length}`);
    
    if (productsWithImages.length > 0) {
      console.log('\n✅ Products with images:');
      productsWithImages.forEach(product => {
        console.log(`  - ${product.name}: ${product.imageUrl}`);
      });
    } else {
      console.log('\n❌ No products have images stored');
    }
    
    // Test individual product retrieval
    if (products.length > 0) {
      console.log('\n🔍 Testing individual product retrieval...');
      const firstProduct = products[0];
      const individualResponse = await fetch(`${HEROKU_URL}/api/products/${firstProduct.id}`);
      
      if (individualResponse.ok) {
        const individualProduct = await individualResponse.json();
        console.log(`Individual product "${individualProduct.name}":`);
        console.log(`  Image URL: ${individualProduct.imageUrl || 'NULL/EMPTY'}`);
        console.log(`  Category: ${individualProduct.category ? individualProduct.category.name : 'No category'}`);
      } else {
        console.log('❌ Failed to retrieve individual product');
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging products:', error.message);
  }
}

// Run the debug
debugProductImages();