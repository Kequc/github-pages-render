module.exports = render;

// this is here to render all the stuff in the /docs folder because
// github pages tried to make me use jekyll.

const nodePath = require('path');
const fs = require('fs-extra');
const gatherFiles = require('./render/gather-files.js');
const persistHtml = require('./render/persist-html.js');

async function render (config) {
    const version = await getPackageVersion(config);
    const templateFiles = await gatherFiles(nodePath.join(config.path, config.templateDir));
    const mdFiles = await gatherFiles(nodePath.join(config.path, config.mdDir), true);
    mdFiles['index.md'] = mdFiles['index.md'] || await fs.readFile(nodePath.join(config.path, config.readme), 'utf-8');

    await processDir(config, '.', mdFiles, templateFiles, version);
}

async function processDir (config, location, mdFiles, templateFiles, version) {
    const promises = [];

    for (const fileName of Object.keys(mdFiles)) {
        const md = mdFiles[fileName];

        if (md instanceof Object) {
            // this is a directory
            promises.push(processDir(config, nodePath.join(location, fileName), md, templateFiles, version));
        } else {
            const name = fileName.substring(0, fileName.lastIndexOf('.'));
            const template = getTemplate(config, templateFiles, location, fileName);

            if (template === undefined) {
                throw new Error('Missing index.mustache template.');
            }

            promises.push(persistHtml(config, location, name, md, template, templateFiles.partials, version));
        }
    }

    await Promise.all(promises);
}

function getTemplate (config, templateFiles, location, fileName) {
    const file = nodePath.join(location, fileName);

    for (const templateArr of Object.values(config.templates)) {
        if (templateArr.includes(location)) return templateFiles[location];
        if (templateArr.includes(file)) return templateFiles[file];
    }

    return templateFiles['index'];
}

async function getPackageVersion (config) {
    try {
        const content = await fs.readFile(nodePath.join(config.path, 'package.json'), 'utf-8');
        return JSON.parse(content).version;
    } catch (err) {
        return null;
    }
}
