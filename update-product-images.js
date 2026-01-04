// Script to update existing products with images
import fetch from 'node-fetch';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

// Image mappings for existing products
const productImageMap = {
  'Premium Thai Rice': 'https://res.cloudinary.com/dih456opf/image/upload/v1767524997/standfit-images/standfit-images/rice-premium-thai.png',
  'Nigerian Ofada Rice': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525000/standfit-images/standfit-images/rice-ofada-nigerian.png',
  'Basmati Rice': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525002/standfit-images/standfit-images/rice-basmati.png',
  'Brown Beans': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525005/standfit-images/standfit-images/beans-brown.png',
  'White Beans': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525007/standfit-images/standfit-images/beans-white.png',
  'Palm Oil (25 Liters)': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525010/standfit-images/standfit-images/oil-palm.png',
  'Groundnut Oil (25 Liters)': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525013/standfit-images/standfit-images/oil-groundnut.png',
  'Vegetable Oil (25 Liters)': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525015/standfit-images/standfit-images/oil-vegetable.png',
  'Curry Powder (1kg)': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525018/standfit-images/standfit-images/spice-curry.png',
  'Ground Pepper (1kg)': 'https://res.cloudinary.com/dih456opf/image/upload/v1767525020/standfit-images/standfit-images/spice-pepper.png'
};

async function loginAdmin() {
  console.log('🔐 Logging in as admin...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'standfit2025@standfit.com',
        password: 'Standfit@1447'
      }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    
    const cookies = response.headers.get('set-cookie');
    console.log('✅ Admin login successful');
    return cookies;
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    return null;
  }
}

async function updateProductImages(cookies) {
  console.log('\n📦 Updating product images...');
  
  if (!cookies) {
    console.log('❌ No authentication cookies');
    return;
  }
  
  try {
    // Get all products
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    console.log(`📊 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      const imageUrl = productImageMap[product.name];
      
      if (imageUrl && !product.imageUrl) {
        console.log(`🖼️  Updating "${product.name}" with image...`);
        
        try {
          const updateResponse = await fetch(`${HEROKU_URL}/api/admin/products/${product.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': cookies
            },
            body: JSON.stringify({
              name: product.name,
              description: product.description,
              price: product.price,
              unit: product.unit,
              categoryId: product.categoryId,
              featured: product.featured,
              inStock: product.inStock,
              imageUrl: imageUrl
            }),
            credentials: 'include'
          });
          
          if (updateResponse.ok) {
            console.log(`   ✅ Updated "${product.name}"`);
            updatedCount++;
          } else {
            const errorText = await updateResponse.text();
            console.log(`   ❌ Failed to update "${product.name}": ${updateResponse.status} - ${errorText}`);
          }
        } catch (error) {
          console.log(`   ❌ Error updating "${product.name}": ${error.message}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (product.imageUrl) {
        console.log(`✅ "${product.name}" already has an image`);
      } else {
        console.log(`⚠️  No image mapping found for "${product.name}"`);
      }
    }
    
    console.log(`\n🎯 Updated ${updatedCount}/${products.length} products with images`);
    
  } catch (error) {
    console.error('❌ Error updating products:', error.message);
  }
}

async function verifyUpdates() {
  console.log('\n🔍 Verifying image updates...');
  
  try {
    const response = await fetch(`${HEROKU_URL}/api/products`);
    const products = await response.json();
    
    const productsWithImages = products.filter(p => p.imageUrl && p.imageUrl.trim() !== '');
    
    console.log(`📊 Products with images: ${productsWithImages.length}/${products.length}`);
    
    productsWithImages.forEach(product => {
      console.log(`✅ ${product.name}: ${product.imageUrl.substring(0, 60)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error verifying updates:', error.message);
  }
}

async function runImageUpdate() {
  console.log('🚀 Starting Product Image Update...\n');
  
  const cookies = await loginAdmin();
  if (!cookies) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  await updateProductImages(cookies);
  await verifyUpdates();
  
  console.log('\n🔄 Image update completed!');
}

// Run the update
runImageUpdate().catch(console.error);