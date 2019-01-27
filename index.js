#!/usr/bin/env node
global.__root = __dirname;

const yargsParser = require('yargs-parser');
const fetchConfig = require('./src/fetch-config.js');
const performInit = require('./src/init.js');
const performRemove = require('./src/remove.js');
const performRender = require('./src/render.js');
const performServer = require('./src/server.js');

const args = yargsParser(process.argv.slice(2), {
    boolean: ['f'],
    number: ['p'],
    string: ['o', 't', 'm', 'r']
});
const opt = {
    outputDir: args.o,
    templateDir: args.t,
    mdDir: args.m,
    readme: args.r,
    port: args.p
};

switch (args._[0]) {
case 'init':
    init(args._[1], args.f);
    break;
case 'remove':
    remove(args._[1]);
    break;
case 'server':
    server(args._[1]);
    break;
default:
    render(args._[0]);
}

async function init (dir, force = false) {
    if (force) await remove(dir);
    const config = await fetchConfig(dir, opt);
    await performInit(config);
    process.stdout.write('Finished initialisation\n');
    process.exit();
}

async function remove (dir) {
    const config = await fetchConfig(dir, opt);
    await performRemove(config);
}

async function server (dir) {
    const config = await fetchConfig(dir, opt);
    performServer(config);
}

async function render (dir) {
    const config = await fetchConfig(dir, opt);
    await performInit(config);
    await performRender(config);
    process.stdout.write(`Finished processing ${config.outputDir}\n`);
    process.exit();
}
