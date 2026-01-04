// Script to upload seed images to Cloudinary and update the database
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dih456opf',
  api_key: '815796146159497',
  api_secret: 'Ng87W5wXUkfJByI4JFPYlJ9sa1s'
});

// Create placeholder images for products
const productImages = [
  { name: 'rice-premium-thai', color: '#8B4513', text: 'Premium\nThai Rice' },
  { name: 'rice-ofada-nigerian', color: '#A0522D', text: 'Nigerian\nOfada Rice' },
  { name: 'rice-basmati', color: '#F5DEB3', text: 'Basmati\nRice' },
  { name: 'beans-brown', color: '#8B4513', text: 'Brown\nBeans' },
  { name: 'beans-white', color: '#F5F5DC', text: 'White\nBeans' },
  { name: 'oil-palm', color: '#FF4500', text: 'Palm Oil\n25L' },
  { name: 'oil-groundnut', color: '#DAA520', text: 'Groundnut\nOil 25L' },
  { name: 'oil-vegetable', color: '#FFD700', text: 'Vegetable\nOil 25L' },
  { name: 'spice-curry', color: '#FF8C00', text: 'Curry\nPowder 1kg' },
  { name: 'spice-pepper', color: '#DC143C', text: 'Ground\nPepper 1kg' }
];

async function createPlaceholderImage(name, color, text) {
  console.log(`🎨 Creating placeholder image for ${name}...`);
  
  try {
    // Create a simple SVG placeholder
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="${color}"/>
        <rect x="20" y="20" width="360" height="360" fill="white" opacity="0.9" rx="10"/>
        <text x="200" y="180" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
              text-anchor="middle" fill="${color}" dominant-baseline="middle">
          ${text.split('\n').map((line, i) => 
            `<tspan x="200" dy="${i === 0 ? 0 : 40}">${line}</tspan>`
          ).join('')}
        </text>
        <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" 
              text-anchor="middle" fill="#666" dominant-baseline="middle">
          Standfit Premium
        </text>
      </svg>
    `;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
      {
        public_id: `standfit-images/${name}`,
        folder: 'standfit-images',
        resource_type: 'image',
        format: 'jpg',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );
    
    console.log(`✅ Uploaded ${name}: ${result.secure_url}`);
    return result.secure_url;
    
  } catch (error) {
    console.error(`❌ Failed to upload ${name}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting image upload to Cloudinary...\n');
  
  const imageUrls = {};
  
  for (const image of productImages) {
    const url = await createPlaceholderImage(image.name, image.color, image.text);
    if (url) {
      imageUrls[image.name] = url;
    }
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Upload Summary:');
  console.log('==================');
  Object.entries(imageUrls).forEach(([name, url]) => {
    console.log(`✅ ${name}: ${url}`);
  });
  
  console.log(`\n🎯 Successfully uploaded ${Object.keys(imageUrls).length}/${productImages.length} images`);
  
  return imageUrls;
}

// Run the upload
uploadAllImages().catch(console.error);