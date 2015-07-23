var Hapi = require('hapi'),
    CardStore = require('./lib/cardStore');

// Create a server with a host and port
var server = new Hapi.Server();
CardStore.initialize();

server.connection({
    host: '127.0.0.1',
    // port: Number(process.env.PORT)
    port: 8000
});

server.views({
    engines: {
        html: require('handlebars')
    },
    path: __dirname + '/templates'
});

server.register({
    register: require('good'),
    options: {
        opsInterval: 5000,
        reporters: [
            {
                reporter: require('good-file'),
                events: { ops: '*' },
                config: {
                    path: './logs',
                    prefix: 'hapi-process',
                    rotate: 'daily'
                }
            },
            {
                reporter: require('good-file'),
                events: { response: '*' },
                config: {
                    path: './logs',
                    prefix: 'hapi-request',
                    rotate: 'daily'
                }
            },
            {
                reporter: require('good-file'),
                events: { error: '*' },
                config: {
                    path: './logs',
                    prefix: 'hapi-error',
                    rotate: 'daily'
                }
            }
        ]
    }
}, function(err) {
    console.log(err);
});

server.ext('onPreResponse', function(req, res) {
    if (req.response.isBoom) {
        return res.view('error', req.response);
    }
    res.continue();
});

server.route(require('./lib/routes'));

server.start(function() {
    console.log('Listening on ' + server.info.uri)
});
