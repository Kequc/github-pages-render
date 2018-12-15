const nodePath = require('path');
const fs = require('fs-extra');

async function init (program, path) {
    const templatesDir = nodePath.join(path, 'docs-template');
    const scaffoldDir = nodePath.join(global.__root, 'scaffold');

    console.log(program.force);
    console.log(path);
    console.log(templatesDir);
    console.log(scaffoldDir);

    // if (program.force) {
    //     await fs.remove(templatesDir);
    // }

    // if (!fs.existsSync(templatesDir)) {
    //     await fs.mkdir(templatesDir);
    // }
}

module.exports = init;
