const fs = require('fs-extra');
const nodePath = require('path');

function removeExtension (fileName) {
    const stop = fileName.lastIndexOf('.');
    if (stop === -1) return fileName;
    return fileName.substring(0, stop);
}

function createMap (keys, values) {
    const result = {};

    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
    }

    return result;
}

async function gatherFiles (dir, keepExtension = false) {
    const stats = await fs.lstat(dir);

    if (stats.isFile()) {
        const content = await fs.readFile(dir, 'utf-8');
        return content;
    }

    const fileNames = await fs.readdir(dir);
    const promises = fileNames.map(fileName => gatherFiles(nodePath.join(dir, fileName), keepExtension));
    const contents = await Promise.all(promises);

    if (keepExtension) {
        return createMap(fileNames, contents);
    }

    return createMap(fileNames.map(removeExtension), contents);
}

module.exports = gatherFiles;
