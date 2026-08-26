const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace single quotes 'http://localhost:5000...'
  newContent = newContent.replace(/'http:\/\/localhost:5000(\/.*?)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  // Replace template literals `http://localhost:5000...`
  newContent = newContent.replace(/`http:\/\/localhost:5000(\/.*?)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

  // Replace any stray http://localhost:5000 in template literal placeholders like `${candidate.resumeUrl.startsWith('http') ? candidate.resumeUrl : \`http://localhost:5000${candidate.resumeUrl}\`}`
  // By just replacing the base URL part
  newContent = newContent.replace(/`http:\/\/localhost:5000\$\{/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${");

  // specifically fix api.ts
  if (file.endsWith('api.ts')) {
    newContent = newContent.replace(/baseURL: 'http:\/\/localhost:5000\/api'/g, "baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api'");
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
