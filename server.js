var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});


server.route({
    path: '/hello',
    method: 'GET',
    handler: function(req, res) {
        res('Hello, world!');
    }
});

server.start(
    function() {
        console.log('Listening on ' + server.info.uri)
    }
);


