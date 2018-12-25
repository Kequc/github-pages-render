// this is here to render all the stuff in the /docs folder because
// github pages tried to make me use jekyll.

const nodePath = require('path');
const fs = require('fs-extra');
const gatherFiles = require('./gather-files.js');
const persistHtml = require('./persist-html.js');

function getName (fileName) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
}

function getTemplate (config, templateFiles, file) {
    for (const templateArr of Object.values(config.templates)) {
        if (templateArr.includes(file)) return templateFiles[file];
    }
    return templateFiles['./index.mustache'];
}

async function processDir (config, path, mdFiles, templateFiles) {
    const promises = [];

    for (const fileName of Object.keys(mdFiles)) {
        const file = nodePath.join(path, fileName);
        const md = mdFiles[fileName];

        if (md instanceof Object) {
            promises.push(processDir(config, file, md, templateFiles));
        } else {
            const name = getName(fileName);
            const template = getTemplate(config, templateFiles, file);

            if (template === undefined) throw new Error('Missing index.mustache template.');

            promises.push(persistHtml(config, path, name, md, template, template.partials));
        }
    }

    await Promise.all(promises);
}

async function process (config, path = '.') {
    const templateFiles = await gatherFiles(nodePath.join(path, config.templateDir));
    const mdFiles = await gatherFiles(nodePath.join(path, config.mdDir), true);
    mdFiles['./index.md'] = await fs.readFile(nodePath.join(path, config.readme), 'utf-8');

    await processDir(config, path, mdFiles, templateFiles);
}

module.exports = process;
