const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let stat = fs.statSync(dir + '/' + file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(dir + '/' + file));
    } else { 
      results.push(dir + '/' + file);
    }
  });
  return results;
}

const SITE_ROOT = path.resolve(__dirname);
const files = walk(SITE_ROOT)
  .filter(f => f.match(/\.(html|js|css)$/))
  .filter(f => !f.includes(`${path.sep}.git${path.sep}`))
  .filter(f => !f.includes(`${path.sep}node_modules${path.sep}`));
let brokenLinks = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /(href|src|data-href)\s*=\s*['"]([^'"]+)['"]/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
      let url = match[2];
      if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('//') || url.startsWith('javascript:')) continue;
      
      url = url.split('?')[0].split('#')[0];
      if(!url) continue;

      let targetPath;
      if (url.startsWith('/')) {
          targetPath = path.join(SITE_ROOT, url);
      } else {
          try {
             targetPath = path.resolve(path.dirname(f), decodeURIComponent(url));
          } catch(e) {
             targetPath = path.resolve(path.dirname(f), url);
          }
      }

      if (!fs.existsSync(targetPath)) {
          brokenLinks.push({file: f, url: url, targetPath: targetPath});
      }
  }
});

console.log('Found ' + brokenLinks.length + ' broken links!');
brokenLinks.slice(0, 30).forEach(o => console.log(o.file, '-->', o.url));
