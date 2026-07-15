const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'content', 'documentspage.html');
let c = fs.readFileSync(target, 'utf8');
let regex = /(['"])(?:\.\/)?documents\//g;
let m = c.match(regex);
console.log('Target:', target);
console.log('Matches:', m);
if (m) {
  c = c.replace(regex, '$1../documents/');
  fs.writeFileSync(target, c);
  console.log('Wrote fix to documentspage.html');
}