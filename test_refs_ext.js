const fs   = require('fs');
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

const files = walk(path.resolve(__dirname))
  .filter(f => f.match(/\.(html|js|css)$/))
  .filter(f => !f.includes(`${path.sep}.git${path.sep}`))
  .filter(f => !f.includes(`${path.sep}node_modules${path.sep}`));
let externalReferences = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/(href|src|url|data-href)\s*=\s*['"]?(\.\.\/\.\.\/[^'"\s>]+|\/pages\/[^'"\s>]+|\/scripts\/[^'"\s>]+|\/documents\/[^'"\s>]+|\/shared\/[^'"\s>]+|\/video\/[^'"\s>]+)['"]?/gi);
  if (m) {
     m.forEach(match => {
        externalReferences.push({file: f, match: match});
     });
  }
});
console.log('Found ' + externalReferences.length + ' refs pointing to pure /pages or ../../');
externalReferences.slice(0, 30).forEach(o => console.log(o.file, o.match));
