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

    config.path = path || '.';

    if (typeof config.outputDir !== 'string') throw new Error('Config "outputDir" must be a string.');
    if (typeof config.templateDir !== 'string') throw new Error('Config "templateDir" must be a string.');
    if (typeof config.mdDir !== 'string') throw new Error('Config "mdDir" must be a string.');
    if (typeof config.readme !== 'string') throw new Error('Config "readme" must be a string.');

    if (!Array.isArray(config.important)) throw new Error('Config "important" must be an array.');

    for (const important of config.important) {
        if (typeof important !== 'string') throw new Error('Config "important" content must be strings.');
    }

    if (!(config.links instanceof Object)) throw new Error('Config "links" must be an object.');
    if (!(config.links instanceof Object)) throw new Error('Config "links" must be an object.');
    if (!(config.view instanceof Object)) throw new Error('Config "view" must be an object.');
    if (!(config.templates instanceof Object)) throw new Error('Config "templates" must be an object.');

    for (const templates of Object.values(config.templates)) {
        if (!Array.isArray(templates)) throw new Error('Config "templates" item must be an array.');
        for (const item of templates) {
            if (typeof item !== 'string') throw new Error('Config "templates" item content must be strings.');
        }
    }

    return config;
}

module.exports = fetchConfig;
