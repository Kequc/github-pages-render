const Server = require('node-static').Server;
const http = require('http');

function server (config) {
    const file = new Server(`./${config.outputDir}`);

    http.createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        }).resume();
    }).listen(config.port);

    process.stdout.write(`Server running on port ${config.port}\n`);
}

module.exports = server;
