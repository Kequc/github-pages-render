const fs = require('fs-extra');

function createMap (keys, values) {
    const result = {};

    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
    }

    return result;
}

async function gatherFiles (location) {
    const stats = await fs.lstat(location);

    if (stats.isFile()) {
        const content = await fs.readFile(location, 'utf-8');
        return content;
    }

    const files = await fs.readdir(location);
    const contents = await Promise.all(files.map(gatherFiles));

    return createMap(files, contents);
}

module.exports = gatherFiles;
