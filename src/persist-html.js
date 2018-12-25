const nodePath = require('path');
const hljs = require('highlight.js');
const markdownIt = require('markdown-it');
const mustache = require('mustache');
const fs = require('fs-extra');

const markdown = markdownIt({
    highlight (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(lang, str).value;
        }
        return '';
    },
    html: true,
    xhtmlOut: true
});

function fixLinks (config, str) {
    return str
        .replace(new RegExp(`\\]\\(${config.outputDir}\\/assets\\/`, 'g'), '](/assets/')
        .replace(new RegExp(`\\]\\(${config.mdDir}\\/`, 'g'), '](/')
        .replace(new RegExp(`\\]\\(\\.\\/\\${config.readme}`, 'g'), '](/')
        .replace(new RegExp('\\.md\\)', 'g'), '.html)');
}

async function persistHtml (config, path, name, md, template, partials = {}) {
    await fs.ensureDir(path);
    const variables = { md: markdown.render(fixLinks(md)), menu: config.menu };
    const html = mustache.render(template, Object.assign({}, config.variables, variables), partials);
    await fs.writeFile(nodePath.join(path, name + '.html', html));
}

module.exports = persistHtml;
