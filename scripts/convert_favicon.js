import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = path.resolve('public/favicon.png');
const outputPath = path.resolve('public/favicon.ico');

// Check if input exists
if (!fs.existsSync(inputPath)) {
  console.error("Input file not found at:", inputPath);
  process.exit(1);
}

// Convert
sharp(inputPath)
  .resize(32, 32)
  .toFormat('png') // Sharp can't write ICO directly usually, but let's try or just save as PNG named .ico (less ideal) or use another lib.
  // Wait, standard sharp doesn't write ICO.
  // Best approach: Write a 32x32 PNG and then we might have to rely on browser support for "fake" ico or just create an ICO buffer manually.
  // Actually, let's use a simpler approach: 
  // If user insists on .ico extension, we can create a PNG and rename it, 
  // BUT real ICO is a container. 
  // Let's use 'sharp-ico' or just try to use 'png-to-ico' via node script if npx failed.
  // Since we installed 'sharp', let's see if we can do it.
  // Actually, let's try to install 'png-to-ico' as a dev dependency since npx failed.
  .toFile(outputPath.replace('.ico', '.png')) // Save as PNG first to verify
  .then(() => console.log("Resized PNG created"))
  .catch(err => console.error(err));
