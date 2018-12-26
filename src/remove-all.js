const fs = require('fs-extra');
const nodePath = require('path');
const fetchConfig = require('./fetch-config.js');

function prompt (question) {
    return new Promise((resolve, reject) => {
        const { stdin, stdout } = process;
    
        stdin.resume();
        stdout.write(question);
    
        stdin.once('data', data => resolve(data.toString().trim()));
        stdin.once('error', err => reject(err));
    });
}

async function promptRemove (dir) {
    if (!fs.existsSync(dir)) return;
    const response = await prompt(`Remove ${dir}? [y/N] `);
    if (response === 'y') await fs.remove(dir);
}

function unique(value, index, self) { 
    return self.indexOf(value) === index;
}

async function removeAll (path) {
    const config = await fetchConfig(path);

    const places = [
        'docs-template',
        config.templateDir,
        'docs',
        config.outputDir,
        'docs-md',
        config.mdDir,
        'github-pages.json'
    ].filter(unique);

    for (const place of places) {
        await promptRemove(nodePath.join(config.path, place));
    }
}

module.exports = removeAll;
