const nodePath = require('path');
const fs = require('fs-extra');

const CONFIG = 'github-pages.json';

async function fetchConfig (path) {
    const defaultConfig = await fs.readJSON(nodePath.join(global.__root, 'scaffold', CONFIG));
    try {
        const config = await fs.readJson(nodePath.join(path, CONFIG));
        return Object.assign({}, defaultConfig, config);
    } catch (err) {
        return defaultConfig;
    }
}

module.exports = fetchConfig;
