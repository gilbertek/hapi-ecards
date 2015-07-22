var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();

var cards = {};

server.connection({
    host: '0.0.0.0',
    // port: Number(process.env.PORT)
    port: 8000
});

server.ext('onRequest', function (req, res) {
    console.log('Request from: ' + req.info.remoteAddress);
    console.log('Referrer: ' + req.info.referrer)
    console.log('Request received: ' + req.path);
    res.continue();
});

server.route([
    {
        path: '/',
        method: 'GET',
        handler: {
            file: 'templates/index.html'
        }
    },
    {
        path: '/cards',
        method: 'GET',
        handler: cardHandler
    },
    {
        path: '/cards/new',
        method: 'GET',
        handler: function(req, res) {
            res.file('templates/new.html');
        }
    },
    {
        path: '/cards/new',
        method: 'POST',
        handler: createCardHandler
    },
    {
        path: '/assets/{path*}',
        method: 'GET',
        handler: {
            directory: {
                path: './public',
                listing: false
            }
        }
    }
]);

function createCardHandler (req, res) {
    // TODO: Business logic
    //
    var card = {
        name: req.payload.name,
        recipient_name  : req.payload.recipient_name,
        sender_name     : req.payload.sender_name,
        sender_name     : req.payload.sender_name,
        card_image      : req.payload.card_image,
        message         : req.payload.message
    };

    saveCard(card);
    res.redirect('/cards');
}

function cardHandler (req, res) {
    res.file('templates/cards.html');
}

function saveCard(card) {
    console.log(card);
}
server.start(function() {
    console.log('Listening on ' + server.info.uri)
});

// module.exports = server;
