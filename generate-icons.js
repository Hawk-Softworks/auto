const fs = require('fs');
const { execSync } = require('child_process');

// SVG Content
const svgContent = fs.readFileSync('icon.svg', 'utf-8');

// Check if sharp is available
let useSharp = true;
try {
  require.resolve('sharp');
} catch (e) {
  useSharp = false;
  console.log('Sharp library nicht gefunden. Installiere mit: npm install sharp');
  console.log('Versuche alternative Methode...\n');
}

async function generateIcons() {
  if (useSharp) {
    const sharp = require('sharp');

    // Generate 192x192
    await sharp(Buffer.from(svgContent))
      .resize(192, 192)
      .png()
      .toFile('icon-192.png');
    console.log('✓ icon-192.png erstellt');

    // Generate 512x512
    await sharp(Buffer.from(svgContent))
      .resize(512, 512)
      .png()
      .toFile('icon-512.png');
    console.log('✓ icon-512.png erstellt');

    // Generate maskable 512x512 (with padding for Android)
    const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#gradient)"/>
      <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">KM</text>
    </svg>`;

    await sharp(Buffer.from(maskableSvg))
      .resize(512, 512)
      .png()
      .toFile('icon-maskable-512.png');
    console.log('✓ icon-maskable-512.png erstellt');

    console.log('\n✅ Alle Icons erfolgreich generiert!');
  } else {
    console.log('\n📋 Manuelle Icon-Generierung benötigt:');
    console.log('1. Öffne icon.svg in einem Browser');
    console.log('2. Mache Screenshots oder nutze ein Tool wie:');
    console.log('   - https://realfavicongenerator.net/');
    console.log('   - oder installiere sharp: npm install sharp');
    console.log('\nBenötigte Größen: 192x192px und 512x512px');
  }
}

generateIcons().catch(console.error);
