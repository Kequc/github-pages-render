module.exports = init;

const nodePath = require('path');
const fs = require('fs-extra');

const TEMPLATES = ['index.mustache'];
const PARTIALS = ['head.mustache', 'header.mustache', 'sidebar.mustache'];
const STYLESHEETS = ['hljs.css', 'main.css', 'markdown.css'];
const IMAGES = ['github.png', 'hr.png', 'npmjs.png'];
const IMPORTANT = ['assets', '.nojekyll'];

async function init (config) {
    await populateDir(nodePath.join(config.path, config.templateDir), TEMPLATES);
    await populateDir(nodePath.join(config.path, config.templateDir, 'partials'), PARTIALS);

    await fs.ensureDir(nodePath.join(config.path, config.mdDir));

    await fs.ensureDir(nodePath.join(config.path, config.outputDir));
    await fs.ensureDir(nodePath.join(config.path, config.outputDir, 'assets'));
    await copyFile(nodePath.join(config.path, config.outputDir), '.nojekyll');
    await populateDir(nodePath.join(config.path, config.outputDir, 'assets', 'css'), STYLESHEETS);
    await populateDir(nodePath.join(config.path, config.outputDir, 'assets', 'images'), IMAGES);

    await saveConfig(config);
    await removeExisting(config);
}

async function populateDir (dir, fileNames) {
    if (fs.existsSync(dir)) return;

    await fs.mkdir(dir);
    await Promise.all(fileNames.map(fileName => copyFile(dir, fileName)));
}

async function copyFile (dir, fileName) {
    const target = nodePath.join(dir, fileName);

    if (fs.existsSync(target)) return;

    const source = nodePath.join(global.__root, 'scaffold', fileName);

    await fs.copyFile(source, target);
}

async function saveConfig (config) {
    const target = nodePath.join(config.path, 'github-pages.json');

    if (fs.existsSync(target)) return;

    const clone = Object.assign({}, config);
    delete clone.path;

    await fs.writeFile(target, JSON.stringify(clone, null, 4) + '\n');
}

async function removeExisting (config) {
    const fileNames = await fs.readdir(nodePath.join(config.path, config.outputDir));
    const promises = getFiles(config, fileNames).map(file => fs.remove(file));
    await Promise.all(promises);
} 

function getFiles (config, fileNames) {
    return fileNames
        .filter(fileName => filterFiles(config, fileName))
        .map(fileName => nodePath.join(config.path, config.outputDir, fileName));
}

function filterFiles (config, fileName) {
    return ![].concat(IMPORTANT, config.important).includes(fileName);
}
