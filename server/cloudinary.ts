import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Check if all required Cloudinary credentials are present
const hasCloudinaryCredentials = cloudinaryConfig.cloud_name && 
  cloudinaryConfig.api_key && 
  cloudinaryConfig.api_secret &&
  cloudinaryConfig.cloud_name !== 'your-cloud-name' &&
  cloudinaryConfig.api_key !== 'your-api-key' &&
  cloudinaryConfig.api_secret !== 'your-api-secret';

if (hasCloudinaryCredentials) {
  cloudinary.config(cloudinaryConfig);
  console.log('✅ Cloudinary configured successfully');
} else {
  console.warn('⚠️  Cloudinary credentials not found. Upload will use local storage fallback.');
}

// Create Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'standfit-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
    ],
  } as any,
});

// Create Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'standfit-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    transformation: [
      { width: 1280, height: 720, crop: 'limit', quality: 'auto' },
    ],
  } as any,
});

// Create Cloudinary storage for mixed media (images and videos)
const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req: any, file: any) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? 'standfit-videos' : 'standfit-images',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo 
        ? ['mp4', 'mov', 'avi', 'webm'] 
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: isVideo
        ? [{ width: 1280, height: 720, crop: 'limit', quality: 'auto' }]
        : [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    };
  },
});

// Multer configurations
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for images
  },
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
});

export const uploadMedia = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

// Helper functions
export const deleteFromCloudinary = async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export const getCloudinaryUrl = (publicId: string, options: any = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
};

export { cloudinary };