const nodePath = require('path');
const fs = require('fs-extra');
const fetchConfig = require('./fetch-config.js');

const NAMES = {
    TEMPLATE_DIR: 'docs-template',
    CONFIG: 'github-pages.json',
    NOJEKYLL: '.nojekyll'
};
const TEMPLATES = ['head.mustache', 'header.mustache', 'index.mustache', 'sidebar.mustache'];
const IMAGES = ['github.png', 'hr.png', 'npmjs.png'];
const STYLESHEETS = ['hljs.css', 'main.css', 'markdown.css'];

async function init (program, path = '.') {
    console.log(program.force);
    console.log(path);

    const config = await fetchConfig(path);
    if (program.force) await removeAll(path, config);

    await populateTemplates(path, config);
    await populateDocs(path);
    await populateAssets(path);
    await copyUnlessExists(path, NAMES.CONFIG);
}

async function removeAll (path, config) {
    await Promise.all([
        fs.remove(nodePath.join(path, NAMES.TEMPLATE_DIR)),
        fs.remove(nodePath.join(path, 'docs', 'assets')),
        fs.remove(nodePath.join(path, NAMES.CONFIG)),
        fs.remove(nodePath.join(path, 'docs', NAMES.NOJEKYLL))
    ]);
}

async function populateTemplates (path, config) {
    const dir = nodePath.join(path, config.templateDir || NAMES.TEMPLATE_DIR);

    if (fs.existsSync(dir)) return;

    await fs.mkdir(dir);
    await Promise.all(TEMPLATES.map((file) => {
        const a = nodePath.join(global.__root, 'scaffold', file);
        const b = nodePath.join(dir, file);
        return fs.copyFile(a, b);
    }));
}

async function populateDocs (path) {
    const dir = nodePath.join(path, 'docs');

    await fs.ensureDir(dir);
    await copyUnlessExists(dir, NAMES.NOJEKYLL);
}

async function populateAssets (path) {
    const dir = nodePath.join(path, 'docs', 'assets');

    if (fs.existsSync(dir)) return;

    await fs.mkdir(dir);
    await fs.mkdir(nodePath.join(dir, 'css'));
    await fs.mkdir(nodePath.join(dir, 'images'));

    await Promise.all(STYLESHEETS.map((file) => {
        const a = nodePath.join(global.__root, 'scaffold', file);
        const b = nodePath.join(dir, 'css', file);
        return fs.copyFile(a, b);
    }));

    await Promise.all(IMAGES.map((file) => {
        const a = nodePath.join(global.__root, 'scaffold', file);
        const b = nodePath.join(dir, 'images', file);
        return fs.copyFile(a, b);
    }));
}

async function copyUnlessExists (dir, file) {
    const a = nodePath.join(global.__root, 'scaffold', file);
    const b = nodePath.join(dir, file);

    if (fs.existsSync(b)) return;

    await fs.copyFile(a, b);
}

module.exports = init;
