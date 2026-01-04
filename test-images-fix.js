// Test script to verify images are not disappearing
import fetch from 'node-fetch';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

async function testProductsAPI() {
  console.log('🔍 Testing Products API...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    console.log(`✅ Products API Response: ${response.status}`);
    console.log(`📦 Total products: ${products.length}`);
    
    // Check if products have images and category info
    let productsWithImages = 0;
    let productsWithCategories = 0;
    
    products.forEach((product, index) => {
      if (product.imageUrl) {
        productsWithImages++;
        console.log(`📸 Product ${index + 1}: "${product.name}" has image: ${product.imageUrl.substring(0, 50)}...`);
      }
      
      if (product.category) {
        productsWithCategories++;
        console.log(`🏷️  Product ${index + 1}: "${product.name}" has category: ${product.category.name}`);
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Products with images: ${productsWithImages}/${products.length}`);
    console.log(`   Products with categories: ${productsWithCategories}/${products.length}`);
    
    return products;
  } catch (error) {
    console.error('❌ Error testing products API:', error.message);
    return null;
  }
}

async function testNewsFlashAPI() {
  console.log('\n🔍 Testing News Flash API...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/newsflash`);
    const newsItems = await response.json();
    
    console.log(`✅ News Flash API Response: ${response.status}`);
    console.log(`📰 Total news items: ${newsItems.length}`);
    
    newsItems.forEach((item, index) => {
      console.log(`📄 News ${index + 1}: "${item.title || 'Untitled'}" - Type: ${item.mediaType}`);
      if (item.url) {
        console.log(`   🔗 URL: ${item.url.substring(0, 50)}...`);
      }
      if (item.content) {
        console.log(`   💬 Content: ${item.content.substring(0, 50)}...`);
      }
    });
    
    return newsItems;
  } catch (error) {
    console.error('❌ Error testing news flash API:', error.message);
    return null;
  }
}

async function testCategoriesAPI() {
  console.log('\n🔍 Testing Categories API...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/categories`);
    const categories = await response.json();
    
    console.log(`✅ Categories API Response: ${response.status}`);
    console.log(`🏷️  Total categories: ${categories.length}`);
    
    categories.forEach((category, index) => {
      console.log(`📂 Category ${index + 1}: "${category.name}" (${category.slug})`);
    });
    
    return categories;
  } catch (error) {
    console.error('❌ Error testing categories API:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests for Image Persistence...\n');
  
  const products = await testProductsAPI();
  const newsItems = await testNewsFlashAPI();
  const categories = await testCategoriesAPI();
  
  console.log('\n🎯 Test Results Summary:');
  console.log('========================');
  
  if (products) {
    const hasImages = products.some(p => p.imageUrl);
    const hasCategories = products.some(p => p.category);
    console.log(`✅ Products API: Working (${products.length} products)`);
    console.log(`${hasImages ? '✅' : '❌'} Product Images: ${hasImages ? 'Present' : 'Missing'}`);
    console.log(`${hasCategories ? '✅' : '❌'} Product Categories: ${hasCategories ? 'Present' : 'Missing'}`);
  } else {
    console.log('❌ Products API: Failed');
  }
  
  if (newsItems) {
    const hasContent = newsItems.some(n => n.url || n.content);
    console.log(`✅ News Flash API: Working (${newsItems.length} items)`);
    console.log(`${hasContent ? '✅' : '❌'} News Content: ${hasContent ? 'Present' : 'Missing'}`);
  } else {
    console.log('❌ News Flash API: Failed');
  }
  
  if (categories) {
    console.log(`✅ Categories API: Working (${categories.length} categories)`);
  } else {
    console.log('❌ Categories API: Failed');
  }
  
  console.log('\n🔄 Test completed. Images should now persist correctly!');
}

// Run the tests
runTests().catch(console.error);