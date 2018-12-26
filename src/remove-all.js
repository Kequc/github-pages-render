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
    const response = await prompt(`Remove ${dir}? [y/N] `);
    if (response === 'y') await fs.remove(dir);
}

async function removeAll (path) {
    const config = await fetchConfig(path);
    await promptRemove(nodePath.join(config.path, config.templateDir));
    await promptRemove(nodePath.join(config.path, config.outputDir));
    await promptRemove(nodePath.join(config.path, config.mdDir));
    await promptRemove(nodePath.join(config.path, 'github-pages.json'));
}

module.exports = removeAll;
