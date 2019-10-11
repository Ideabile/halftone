const path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const dirToJson = require('dir-to-json');

module.exports = async (port = 3003, pathStatic = path.join(__dirname, 'public')) => {

    const server = new Hapi.Server({
        port,
        host: 'localhost',
        routes: {
            cors: true,
            files: {
                relativeTo: pathStatic
            }
        }
    });

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/',
        async handler(req, res) {
            const content = await dirToJson(pathStatic);
            return res.response(content);
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        }
    });

    await server.start();
    console.log('Server running at:', server.info.uri);

};
