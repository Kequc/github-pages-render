#!/usr/bin/env node
global.__root = __dirname;

const program = require('commander');
const fetchConfig = require('./src/fetch-config.js');
const init = require('./src/init.js');
const removeAll = require('./src/remove-all.js');
const render = require('./src/render.js');
const server = require('./src/server.js');
const version = require('./package.json').version;

program
    .version(version, '-v, --version')
    .option('-f, --force', 'refresh application scaffold');

program
    .command('server [path]')
    .action(async function (path) {
        const config = await fetchConfig(path);
        server(config);
    });

program
    .command('init [path]')
    .action(async function (path) {
        if (program.force) await removeAll(path);
        const config = await fetchConfig(path);
        await init(config);
        process.stdout.write('Finished initialisation\n');
        process.exit();
    });

program
    .command('exec [path]')
    .action(async function (path) {
        if (program.force) await removeAll(path);
        const config = await fetchConfig(path);
        await init(config);
        await render(config);
        process.stdout.write(`Finished processing ${config.outputDir}\n`);
        process.exit();
    });

program
    .command('*')
    .action(function () {
        process.stdout.write('Invalid command (use server, init, or exec)\n');
        process.exit();
    });

program.parse(process.argv);
