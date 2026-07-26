import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Optimize image using Sharp
 * - Resize to 1000x1000px
 * - Convert to WebP format
 * - Set quality to 80%
 * - Maintains aspect ratio
 */
export const optimizeImage = async (filePath: string): Promise<string> => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return filePath;
    }

    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const optimizedPath = path.join(dir, `${name}-optimized.webp`);

    console.log(`Optimizing image: ${filePath}`);

    await sharp(filePath)
      .resize(1000, 1000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    console.log(`✅ Image optimized: ${optimizedPath}`);

    // Delete original file to save space
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted original: ${filePath}`);
    } catch (err) {
      console.error(`Failed to delete original: ${err}`);
    }

    return optimizedPath;
  } catch (error) {
    console.error('Image optimization error:', error);
    return filePath; // Return original if optimization fails
  }
};

/**
 * Generate thumbnail image
 * - Resize to 300x300px (cover mode)
 * - Convert to WebP format
 * - Set quality to 70%
 * - Used for product listing
 */
export const generateThumbnail = async (filePath: string): Promise<string> => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found for thumbnail: ${filePath}`);
      return filePath;
    }

    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const thumbnailPath = path.join(dir, `${name}-thumb.webp`);

    console.log(`Generating thumbnail: ${filePath}`);

    await sharp(filePath)
      .resize(300, 300, {
        fit: 'cover',
      })
      .webp({ quality: 70 })
      .toFile(thumbnailPath);

    console.log(`✅ Thumbnail generated: ${thumbnailPath}`);

    return thumbnailPath;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return filePath; // Return original if thumbnail generation fails
  }
};

/**
 * Get image URL for API response
 * Converts file path to server URL
 */
export const getImageUrl = (filePath: string, baseUrl: string = 'https://daraz-website-1.onrender.com'): string => {
  if (!filePath) return '';
  
  // If already a URL, return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Convert file path to URL
  const relativePath = filePath.replace(/\\/g, '/').split('uploads')[1] || '';
  return `${baseUrl}/uploads${relativePath}`;
};