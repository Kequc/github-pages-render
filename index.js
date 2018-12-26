#!/usr/bin/env node
global.__root = __dirname;

const program = require('commander');
const fetchConfig = require('./src/fetch-config.js');
const init = require('./src/init.js');
const removeAll = require('./src/remove-all.js');
const render = require('./src/render.js');
const version = require('./package.json').version;

function finish () {
    process.stdout.write('Finished processing docs\n');
    process.exit();
}

program
    .version(version, '-v, --version')
    .option('-f, --force', 'refresh application scaffold');

program
    .command('init [path]')
    .action(async function (path) {
        if (program.force) await removeAll(path);
        const config = await fetchConfig(path);
        await init(config);
        finish();
    });

program
    .command('render [path]')
    .action(async function (path) {
        if (program.force) await removeAll(path);
        const config = await fetchConfig(path);
        await init(config);
        await render(config);
        finish();
    });

program.parse(process.argv);
