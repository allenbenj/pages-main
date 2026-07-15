const fs = require('fs');
const dir = 'E:/GITHUB/Web/pages';

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html') && !file.endsWith('.js')) return;
    let p = dir + '/' + file;
    let c = fs.readFileSync(p, 'utf8');
    let original = c;

    // Convert `../documents/...` -> `documents/...`
    c = c.replace(/(href|src|url|data-href|data-modal-image|fetch)\s*\(?\s*['"](\.\.\/documents\/([^'"]+))['"]\)?/gi, (match, p1, p2, p3) => {
        return match.replace('../documents/', 'documents/');
    });
    
    c = c.replace(/['"](\.\.\/documents\/[^'"]+)['"]/g, match => match.replace('../documents/', 'documents/'));
    c = c.replace(/['"]\.\.\/shared\//g, '"shared/');
    c = c.replace(/['"]\.\.\/video\//g, '"video/');
    c = c.replace(/['"]\.\.\/audio\//g, '"audio/');
    c = c.replace(/['"]\.\.\/documentspage\.html(.*?)['"]/g, '"documentspage.html$1"');

    if (c !== original) {
        fs.writeFileSync(p, c);
        console.log('Fixed', file);
    }
});
