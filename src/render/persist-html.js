module.exports = persistHtml;

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

async function persistHtml (config, location, name, md, template, partials = {}) {
    await fs.ensureDir(nodePath.join(config.path, config.outputDir, location));

    const file = nodePath.join(config.path, config.outputDir, location, name + '.html');
    const content = markdown.render(fixLinks(config, md));
    const html = mustache.render(template, Object.assign({}, config.view, { content }), partials);

    await fs.writeFile(file, html);
}

function fixLinks (config, md) {
    return md
        .replace(new RegExp(`\\]\\(${config.outputDir}\\/assets\\/`, 'g'), '](/assets/')
        .replace(new RegExp(`\\]\\(${config.mdDir}\\/`, 'g'), '](/')
        .replace(new RegExp(`\\]\\(\\.\\/\\${config.readme}`, 'g'), '](/')
        .replace(new RegExp('\\.md\\)', 'g'), '.html)');
}
