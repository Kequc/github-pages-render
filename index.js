#!/usr/bin/env node

const program = require('commander');
const init = require('./src/init.js');
const version = require('./package.json').version;

global.__root = __dirname;

program
    .version(version, '-v, --version')
    .option('-f, --force', 'refresh application scaffold');

program
    .command('init [path]')
    .action(async function (path = '.') {
        await init(program, path);
    });

program
    .command('process [path]')
    .action(async function (path = '.') {
        await init(program, path);
    });

program.parse(process.argv);
