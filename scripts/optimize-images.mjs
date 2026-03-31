import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('public', 'products');
const outputDir = inputDir;

async function optimizeImages() {
  console.log('Starting image compression...');
  try {
    const files = await fs.readdir(inputDir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace('.png', '.webp'));
        
        console.log(`Processing: ${file}`);
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
        
        const beforeSize = (await fs.stat(inputPath)).size / 1024 / 1024;
        const afterSize = (await fs.stat(outputPath)).size / 1024;
        console.log(`  -> Saved as WebP: ${beforeSize.toFixed(2)} MB reduced to ${afterSize.toFixed(2)} KB`);
      }
    }
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('CRITICAL: Image compression failed:', error);
  }
}

optimizeImages();
