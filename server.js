var Hapi = require('hapi'),
    uuid = require('uuid'),
    Joi  = require('joi'),
    Boom = require('boom'),
    fs   = require('fs');

// Create a server with a host and port
var server = new Hapi.Server();

var cards = loadCards();

server.connection({
    host: '0.0.0.0',
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
            res.view('new', { card_images: mapImages() });
        }
    },
    {
        path: '/cards/new',
        method: 'POST',
        handler: createCardHandler
    },
    {
        path: '/cards/{id}send',
        method: 'POST',
        handler: createCardHandler
    },
     {
        path: '/cards/{id}',
        method: 'DELETE',
        handler: deleteCardHandler
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
    Joi.validate(req.payload, cardSchema, function(err, val) {
        if (err) {
            return res(Boom.badRequest(err.details[0].message));
        };

        var card = {
            recipient_namename: val.name,
            recipient_email   : val.recipient_email,
            sender_name       : val.sender_name,
            sender_email      : val.sender_email,
            card_image        : val.card_image,
            message           : val.message
        };

        saveCard(card);
        res.redirect('/cards');
    });
}

function deleteCardHandler(req, res) {
    delete cards[req.params.id];
    res();
}

function cardHandler (req, res) {
    res.view('cards', { cards: cards });
}

function saveCard(card) {
    var id = uuid.v1();
    card.id = id;
    console.log(card);
    cards[id] = card;
}

function loadCards() {
    var file = fs.readFileSync('./cards.json');
    return JSON.parse(file.toString());
}

function mapImages() {
    return fs.readdirSync('./public/images/cards');
}

var cardSchema = Joi.object().keys({
    name:            Joi.string().min(3).max(50).required(),
    recipient_email: Joi.string().email().required(),
    sender_name:     Joi.string().min(3).max(50).required(),
    sender_email:    Joi.string().email().required(),
    card_image:      Joi.string().regex(/.+\.(jpg|bmp|png|gif|jpeg)\b/).required(),
    message:         Joi.string().min(8).max(255)
});

server.start(function() {
    console.log('Listening on ' + server.info.uri)
});
