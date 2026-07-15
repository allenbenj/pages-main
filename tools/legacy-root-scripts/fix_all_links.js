const fs = require('fs');
['E:/GITHUB/Web/pages/content', 'E:/GITHUB/Web/pages/legacy'].filter(fs.existsSync).forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.html') && !file.endsWith('.js')) return;
        let p = dir + '/' + file;
        let c = fs.readFileSync(p, 'utf8');

        // Fix mismatched quotes (single then double, or double then single ending)
        // Wait, it's easier to just match `href='../documents/` and make the quote match the ending quote, 
        // OR better: match `(['"])?((?:\.\/|\.\.\/)*)documents\/([^'"]+)(['"])?`
        
        let changed = false;

        // Fix the mismatched replacements from earlier (e.g. href='../documents/... ")
        while(c.match(/='(\.\.\/documents\/[^'"]+)"/)) {
            c = c.replace(/='(\.\.\/documents\/[^'"]+)"/g, '="$1"');
            changed = true;
        }
        while(c.match(/="(\.\.\/documents\/[^'"]+)'/)) {
            c = c.replace(/="(\.\.\/documents\/[^'"]+)'/g, '="$1"');
            changed = true;
        }

        // Now replace any remaining documents/ that doesn't have ../ in front
        // e.g. "documents/... or './documents/... 
        let regex = /(['"])(?:\.\/)?documents\//g;
        if (c.match(regex)) {
             c = c.replace(regex, "$1../documents/");
             changed = true;
        }

        if (changed) {
            fs.writeFileSync(p, c);
            console.log('Fixed', p);
        }
    });
});
