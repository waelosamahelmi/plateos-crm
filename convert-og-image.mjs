// Script to convert SVG to PNG for OG image
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.join(process.cwd(), 'public', 'og-image.svg');
const pngPath = path.join(process.cwd(), 'public', 'og-image.png');

const svgBuffer = fs.readFileSync(svgPath);

sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ Successfully converted og-image.svg to og-image.png');
  })
  .catch((err) => {
    console.error('❌ Error converting SVG to PNG:', err);
  });
