const fs = require('fs');
let d = 'E:/GITHUB/Web/pages/content';
fs.readdirSync(d).filter(f=>f.endsWith('.html')).forEach(f=>{
   let c = fs.readFileSync(d+'/'+f, 'utf8');
   let m = c.match(/['"]documents\/[^'"]+['"]/g);
   if(m) console.log(f, m);
});
