const nodePath = require('path');
const fs = require('fs-extra');

const CONFIG = 'github-pages.json';

async function readConfig (path) {
    const defaultConfig = await fs.readJSON(nodePath.join(global.__root, 'scaffold', CONFIG));
    try {
        const config = await fs.readJson(nodePath.join(path, CONFIG));
        return Object.assign({}, defaultConfig, config);
    } catch (err) {
        return defaultConfig;
    }
}

async function fetchConfig (path) {
    const config = await readConfig(path);

    if (!config.outputDir) throw new Error('Config "outputDir" must exist.');
    if (!config.templateDir) throw new Error('Config "templateDir" must exist.');
    if (!config.mdDir) throw new Error('Config "mdDir" must exist.');
    if ((config.readme || '')[0] !== '.') throw new Error('Config "readme" must be a relative path.');

    if (!(config.links instanceof Object)) throw new Error('Config "links" must be an object.');
    if (!(config.links instanceof Object)) throw new Error('Config "links" must be an object.');
    if (!(config.variables instanceof Object)) throw new Error('Config "variables" must be an object.');

    for (const templateArr of Object.values(config.templates)) {
        if (!Array.isArray(templateArr)) throw new Error('Config "templates" item must be an array.');
        for (const value of templateArr) {
            if (typeof value !== 'string') throw new Error('Config "templates" item content must be strings.');
        }
    }

    if (!Array.isArray(config.menu)) throw new Error('Config "menu" must be an array.');

    for (const item of menu) {
        if (!(item instanceof Object)) throw new Error('Config "menu" item must be an object.');
        if (!item.name) throw new Error('Config "menu" item must have a name.');
        if (!item.path) throw new Error('Config "menu" item must have a path.');
    }

    return config;
}

module.exports = fetchConfig;
