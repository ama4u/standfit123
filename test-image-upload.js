// Test script to verify image upload and persistence
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
        email: 'admin@standfitpremium.com.ng',
        password: 'Standfit@1441'
      }),
      credentials: 'include'
    });
    
    if (response.ok) {
      const cookies = response.headers.get('set-cookie');
      console.log('✅ Admin login successful');
      return cookies;
    } else {
      console.log('❌ Admin login failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function createTestImage() {
  // Create a simple test image (1x1 pixel PNG)
  const testImageBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x01, 0x21, 0x18, 0xE6, 0x27, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync('test-image.png', testImageBuffer);
  return 'test-image.png';
}

async function testImageUpload(cookies) {
  console.log('\n📤 Testing image upload...');
  
  if (!cookies) {
    console.log('❌ No authentication cookies');
    return null;
  }
  
  try {
    // Create test image
    const imagePath = await createTestImage();
    
    // Create form data
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    const response = await fetch(`${HEROKU_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Cookie': cookies,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    const result = await response.json();
    console.log(`Upload Response: ${response.status}`);
    console.log('Upload Result:', result);
    
    // Clean up test file
    fs.unlinkSync(imagePath);
    
    if (response.ok && result.url) {
      console.log('✅ Image upload successful');
      return result;
    } else {
      console.log('❌ Image upload failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    return null;
  }
}

async function testProductCreation(cookies, imageUrl) {
  console.log('\n📦 Testing product creation with image...');
  
  if (!cookies || !imageUrl) {
    console.log('❌ Missing authentication or image URL');
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
      body: JSON.stringify(productData)
    });
    
    const result = await response.json();
    console.log(`Product Creation Response: ${response.status}`);
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

async function verifyProductPersistence(productId) {
  console.log('\n🔍 Verifying product persistence...');
  
  if (!productId) {
    console.log('❌ No product ID to verify');
    return false;
  }
  
  try {
    // Wait a moment for database to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // First try to get all products and find our test product
    console.log('Checking products list...');
    const listResponse = await fetch(`${HEROKU_URL}/api/products`);
    const products = await listResponse.json();
    
    console.log(`Products List Response: ${listResponse.status}`);
    console.log(`Total products: ${products.length}`);
    
    const testProduct = products.find(p => p.id === productId);
    if (testProduct) {
      console.log('✅ Product found in products list');
      console.log('Product data:', testProduct);
      
      if (testProduct.imageUrl) {
        console.log('✅ Product image persisted successfully');
        console.log(`Image URL: ${testProduct.imageUrl}`);
        return true;
      } else {
        console.log('❌ Product found but image URL is missing');
        return false;
      }
    } else {
      console.log('❌ Product not found in products list');
      
      // Try individual product endpoint
      console.log('Trying individual product endpoint...');
      const response = await fetch(`${HEROKU_URL}/api/products/${productId}`);
      console.log(`Individual Product Response: ${response.status}`);
      
      if (response.ok) {
        const product = await response.json();
        console.log('Individual Product Data:', product);
        return product.imageUrl ? true : false;
      } else {
        const errorText = await response.text();
        console.log(`Individual Product Error: ${errorText}`);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    return false;
  }
}

async function runImageUploadTest() {
  console.log('🚀 Starting Image Upload and Persistence Test...\n');
  
  // Step 1: Login
  const cookies = await loginAdmin();
  if (!cookies) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Upload image
  const uploadResult = await testImageUpload(cookies);
  if (!uploadResult) {
    console.log('❌ Cannot proceed without successful image upload');
    return;
  }
  
  // Step 3: Create product with image
  const product = await testProductCreation(cookies, uploadResult.url);
  if (!product) {
    console.log('❌ Cannot proceed without successful product creation');
    return;
  }
  
  // Step 4: Verify persistence
  const isPersisted = await verifyProductPersistence(product.id);
  
  console.log('\n🎯 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Admin Login: Working`);
  console.log(`${uploadResult ? '✅' : '❌'} Image Upload: ${uploadResult ? 'Working' : 'Failed'}`);
  console.log(`${product ? '✅' : '❌'} Product Creation: ${product ? 'Working' : 'Failed'}`);
  console.log(`${isPersisted ? '✅' : '❌'} Image Persistence: ${isPersisted ? 'Working' : 'Failed'}`);
  
  if (!isPersisted) {
    console.log('\n🔍 Debugging Information:');
    console.log('- Image was uploaded to Cloudinary successfully');
    console.log('- Product was created with image URL');
    console.log('- But image URL is not persisting in database');
    console.log('- This suggests a database update issue');
  }
  
  console.log('\n🔄 Image upload test completed!');
}

// Run the test
runImageUploadTest().catch(console.error);