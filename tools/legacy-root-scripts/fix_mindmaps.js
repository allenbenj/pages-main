const fs = require('fs');
const glob = require('path');

['E:/GITHUB/Web/pages/content', 'E:/GITHUB/Web/pages/legacy'].filter(fs.existsSync).forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.html') && !file.endsWith('.js')) return;
        let p = dir + '/' + file;
        let c = fs.readFileSync(p, 'utf8');
        
        c = c.replace(/['"]documents\/mindmaps\//g, "'../documents/mindmaps/");
        c = c.replace(/['"]documents\/connections\//g, "'../documents/connections/");
        c = c.replace(/['"]\.\/documents\/connections\//g, "'../documents/connections/");
        c = c.replace(/['"]\.\/documents\/graphics\//g, "'../documents/graphics/");
        c = c.replace(/['"]documents\/graphics\//g, "'../documents/graphics/");
        c = c.replace(/['"]documents\/reports\//g, "'../documents/reports/");
        
        fs.writeFileSync(p, c);
    });
});
console.log('Fixed paths');
