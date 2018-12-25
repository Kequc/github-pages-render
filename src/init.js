const nodePath = require('path');
const fs = require('fs-extra');
const removeExisting = require('./remove-existing.js');

const TEMPLATES = ['index.mustache'];
const PARTIALS = ['head.mustache', 'header.mustache', 'sidebar.mustache'];
const STYLESHEETS = ['hljs.css', 'main.css', 'markdown.css'];
const IMAGES = ['github.png', 'hr.png', 'npmjs.png'];
const IMPORTANT = ['assets', '.nojekyll', 'CNAME'];

function filterFiles (fileName) {
    return !IMPORTANT.includes(fileName);
}

function getFiles (dir, fileNames) {
    return fileNames.filter(filterFiles).map(fileName => nodePath.join(dir, fileName));
}

async function removeExisting (dir) {
    const fileNames = await fs.readdir(dir);
    const promises = getFiles(dir, fileNames).map(fs.remove);
    await Promise.all(promises);
} 

async function init (config, path = '.', force = false) {
    if (force) await removeAll(config, path);

    await populateDir(nodePath.join(path, config.templateDir), TEMPLATES);
    await populateDir(nodePath.join(path, config.templateDir, 'partials'), PARTIALS);

    await fs.ensureDir(nodePath.join(path, config.outputDir));
    await fs.ensureDir(nodePath.join(path, config.outputDir, 'assets'));
    await copyFile(nodePath.join(path, config.outputDir), '.nojekyll');
    await populateDir(nodePath.join(path, config.outputDir, 'assets', 'css'), STYLESHEETS);
    await populateDir(nodePath.join(path, config.outputDir, 'assets', 'images'), IMAGES);

    await copyFile(path, 'github-pages.json');
    await removeExisting(nodePath.join(path, config.outputDir));
}

async function removeAll (config, path) {
    await Promise.all([
        fs.remove(nodePath.join(path, config.templateDir)),
        fs.remove(nodePath.join(path, config.outputDir)),
        fs.remove(nodePath.join(path, 'github-pages.json'))
    ]);
}

async function populateDir (dir, fileNames) {
    if (fs.existsSync(dir)) return;

    await fs.mkdir(dir);
    await Promise.all(fileNames.map(fileName => copyFile(dir, fileName)));
}

function copyFile (dir, fileName) {
    const a = nodePath.join(global.__root, 'scaffold', fileName);
    const b = nodePath.join(dir, fileName);

    if (!fs.existsSync(b)) return fs.copyFile(a, b);
    return Promise.resolve();
}

module.exports = init;
