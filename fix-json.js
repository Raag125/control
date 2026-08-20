const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/admin/blogsData.json');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\/images\/hero-banner\.jpg/g, '/images/hero-banner.webp');
fs.writeFileSync(file, content);
console.log('Fixed hero-banner.jpg in blogsData.json');
