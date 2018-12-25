#!/usr/bin/env node
global.__root = __dirname;

const program = require('commander');
const fetchConfig = require('./fetch-config.js');
const init = require('./src/init.js');
const render = require('./src/render.js');
const version = require('./package.json').version;

program
    .version(version, '-v, --version')
    .option('-f, --force', 'refresh application scaffold');

program
    .command('init [path]')
    .action(async function (path) {
        const config = await fetchConfig(path);
        await init(config, path, program.force);
    });

program
    .command('process [path]')
    .action(async function (path) {
        const config = await fetchConfig(path);
        await init(config, path, program.force);
        await render(config, path);
    });

program.parse(process.argv);
