const fs = require('fs');
const path = require('path');

const mappings = {
  '/products/ragi-250gm.png': '/products/Ragi%20Front%20250%20gm.webp',
  '/products/jowar-250gm.png': '/products/Jowar%20Front%20250gm.webp',
  '/products/bajra-250gm.png': '/products/Bajra%20Front%20250%20gm.webp',
  '/products/kangni-250gm.png': '/products/Kangni%20Front%20250%20gm.webp',
  '/products/kutki-250gm.png': '/products/Kutki%20Front%20250%20gm.webp',
  '/products/rice-500gm.png': '/products/Rice%20Flour%20Front%20500%20gm.webp',
  '/products/indrayani-1kg.png': '/products/Indrayani%20Rice%20Front%201000%20gm.webp',
  '/products/kodo-500gm.png': '/products/Kodo%20Front%20250%20gm.webp'
};

const filesToEdit = [
  'src/data/products.ts',
  'src/components/MilletScienceSection.tsx',
  'src/components/BundleSection.tsx'
];

filesToEdit.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [oldUrl, newUrl] of Object.entries(mappings)) {
    content = content.split(oldUrl).join(newUrl);
  }
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
