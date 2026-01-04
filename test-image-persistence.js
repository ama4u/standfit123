// Comprehensive test for image persistence issues
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const HEROKU_URL = 'https://standfit-e816d09b795a.herokuapp.com';

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

async function testImageUpload(cookies) {
  console.log('\n📤 Testing image upload...');
  
  if (!cookies) {
    console.log('❌ No authentication cookies');
    return null;
  }
  
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x5D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    const response = await fetch(`${HEROKU_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Cookie': cookies
      },
      body: formData,
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log(`📤 Upload Response: ${response.status}`);
    console.log('Upload Result:', result);
    
    if (response.ok && result.url) {
      console.log('✅ Image upload successful');
      return result;
    } else {
      console.log('❌ Image upload failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Image upload error:', error.message);
    return null;
  }
}

async function testProductCreation(cookies, imageUrl) {
  console.log('\n📦 Testing product creation with image...');
  
  if (!cookies) {
    console.log('❌ No authentication cookies');
    return null;
  }
  
  try {
    const productData = {
      name: 'Test Product with Image',
      description: 'This is a test product to verify image persistence',
      price: 1000,
      unit: 'per piece',
      categoryId: null,
      featured: false,
      inStock: true,
      imageUrl: imageUrl
    };
    
    const response = await fetch(`${HEROKU_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify(productData),
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log(`📦 Product Creation Response: ${response.status}`);
    console.log('Product Result:', result);
    
    if (response.ok) {
      console.log('✅ Product creation successful');
      return result;
    } else {
      console.log('❌ Product creation failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Product creation error:', error.message);
    return null;
  }
}

async function testNewsFlashCreation(cookies, imageUrl) {
  console.log('\n📰 Testing news flash creation with media...');
  
  if (!cookies) {
    console.log('❌ No authentication cookies');
    return null;
  }
  
  try {
    const newsData = {
      title: 'Test News Flash with Image',
      url: imageUrl,
      mediaType: 'image',
      publicId: 'test-news-image'
    };
    
    const response = await fetch(`${HEROKU_URL}/api/admin/newsflash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify(newsData),
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log(`📰 News Flash Creation Response: ${response.status}`);
    console.log('News Flash Result:', result);
    
    if (response.ok) {
      console.log('✅ News flash creation successful');
      return result;
    } else {
      console.log('❌ News flash creation failed');
      return null;
    }
  } catch (error) {
    console.error('❌ News flash creation error:', error.message);
    return null;
  }
}

async function verifyImagePersistence(productId, newsFlashId) {
  console.log('\n🔍 Verifying image persistence...');
  
  // Wait a bit to simulate time passing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Check product image
    if (productId) {
      const productResponse = await fetch(`${HEROKU_URL}/api/products/${productId}`);
      if (productResponse.ok) {
        const product = await productResponse.json();
        console.log(`📦 Product image still exists: ${product.imageUrl ? '✅' : '❌'}`);
        if (product.imageUrl) {
          console.log(`   Image URL: ${product.imageUrl}`);
        }
      }
    }
    
    // Check news flash image
    if (newsFlashId) {
      const newsResponse = await fetch(`${HEROKU_URL}/api/newsflash`);
      if (newsResponse.ok) {
        const newsItems = await newsResponse.json();
        const newsItem = newsItems.find(item => item.id === newsFlashId);
        if (newsItem) {
          console.log(`📰 News flash image still exists: ${newsItem.url ? '✅' : '❌'}`);
          if (newsItem.url) {
            console.log(`   Image URL: ${newsItem.url}`);
          }
        }
      }
    }
    
    // Test all products
    const allProductsResponse = await fetch(`${HEROKU_URL}/api/products`);
    if (allProductsResponse.ok) {
      const allProducts = await allProductsResponse.json();
      const productsWithImages = allProducts.filter(p => p.imageUrl);
      console.log(`📊 Total products with images: ${productsWithImages.length}/${allProducts.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error verifying persistence:', error.message);
  }
}

async function runImagePersistenceTest() {
  console.log('🚀 Starting Comprehensive Image Persistence Test...\n');
  
  // Step 1: Login
  const cookies = await loginAdmin();
  if (!cookies) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Test image upload
  const uploadResult = await testImageUpload(cookies);
  if (!uploadResult) {
    console.log('❌ Cannot proceed without successful image upload');
    return;
  }
  
  // Step 3: Test product creation with image
  const product = await testProductCreation(cookies, uploadResult.url);
  
  // Step 4: Test news flash creation with image
  const newsFlash = await testNewsFlashCreation(cookies, uploadResult.url);
  
  // Step 5: Verify persistence
  await verifyImagePersistence(product?.id, newsFlash?.id);
  
  console.log('\n🎯 Image Persistence Test Summary:');
  console.log('==================================');
  console.log(`✅ Admin Login: Working`);
  console.log(`${uploadResult ? '✅' : '❌'} Image Upload: ${uploadResult ? 'Working' : 'Failed'}`);
  console.log(`${product ? '✅' : '❌'} Product Creation: ${product ? 'Working' : 'Failed'}`);
  console.log(`${newsFlash ? '✅' : '❌'} News Flash Creation: ${newsFlash ? 'Working' : 'Failed'}`);
  
  console.log('\n🔄 Test completed!');
}

// Run the comprehensive test
runImagePersistenceTest().catch(console.error);