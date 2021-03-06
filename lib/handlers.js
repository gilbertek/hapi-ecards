var uuid      = require('uuid'),
    Joi       = require('joi'),
    Boom      = require('boom'),
    fs        = require('fs'),
    UserStore = require('./userStore')
    CardStore = require('./cardStore');

var Handlers = {};

Handlers.loginHandler = function(req, res) {
    Joi.validate(req.payload, loginSchema, function(err, val) {
        if (err) {
            return res(Boom.unauthorized('Invalid email or password provided'));
        }

        UserStore.validateUser(val.email, val.password, function(err, user) {
            if (err) {
                return res(err);
            }

            req.auth.session.set(user);
            res.redirect('/cards');
        });
    });
};

Handlers.logoutHandler = function(req, res) {
    req.auth.session.clear();
    res('Logout Successful!');
    res.redirect('/');
};

Handlers.registerHandler = function(req, res) {
    Joi.validate(req.payload, registerSchema, function(err, val) {
        if (err) {
            return res(Boom.unauthorized('Invalid email or password provided'));
        }

        UserStore.createUser(val.name, val.email, val.password, function(err) {
            if (err) {
                return res(err);
            }
            res.redirect('/cards');
        });
    });
};

Handlers.cardsIndexHandler = function (req, res) {
    res.view('cards', { cards: getCards(req.auth.credentials.email) });
}

Handlers.cardsShowHandler = function (req, res) {
    var card = CardStore.card[req.params.id];
    res.view('card', card);
};

Handlers.cardsNewHandler = function (req, res) {
    res.view('new', { card_images: mapImages() });
}

Handlers.cardsCreateHandler = function (req, res) {
    Joi.validate(req.payload, cardSchema, function(err, val) {
        if (err) {
            return res(Boom.badRequest(err.details[0].message));
        };

        var card = {
            recipient_name    : val.name,
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

Handlers.cardsDeleteHandler = function(req, res) {
    delete CardStore.cards[req.params.id];
    res();
}

Handlers.uploadHandler = function (req, res) {
    var image = req.payload.upload_image;

    if (image.bytes) {
        fs.link(image.path, 'public/images/cards/' + image.filename, function() {
            fs.unlink(image.path);
        });
    }
    res.redirect('/cards');
};

Handlers.cardsSendHandler = function (req, res) {
    var card = CardStore.card[req.params.id];
    req.server.render('email', card, function(err, rendered) {
        var message = {
            html: rendered,
            subject: 'A greeting from ecards',
            from_email: card.sender_email,
            from_name: card.sender_name,
            to: [
                {
                    email: card.recipient_email,
                    name: card.recipient_name,
                    type: 'to'
                }
            ]
        };

        // mandrillClient.messages.send({message: message}, function(results) {
        //     if (results.reject_reason) {
        //         console.log(results.reject_reason)
        //         res(Boom.badRequest('Could not send card!'));
        //     } else {
        //         res.redirect('/card');
        //     }
        // }, function(err) {
        //     console.log(err);
        //     res(Boom.badRequest('Could not send card'));
        // });
    });
};

var cardSchema = Joi.object().keys({
    name:            Joi.string().min(3).max(50).required(),
    recipient_email: Joi.string().email().required(),
    sender_name:     Joi.string().min(3).max(50).required(),
    sender_email:    Joi.string() .email().required(),
    card_image:      Joi.string().regex(/.+\.(jpg|bmp|png|gif|jpeg)\b/).required(),
    message:         Joi.string().min(8).max(255)
});

var loginSchema = Joi.object().keys({
    email:           Joi.string().email().required(),
    password:        Joi.string().max(32).required(),
});

var registerSchema = Joi.object().keys({
    name:            Joi.string().min(3).max(50).required(),
    email:           Joi.string().email().required(),
    password:        Joi.string().max(32).required(),
});

function saveCard(card) {
    var id = uuid.v1();
    card.id = id;
    console.log(card);
    CardStore.cards[id] = card;
}

function mapImages() {
    return fs.readdirSync('./public/images/cards');
}

function getCards(email) {
    var cards = [];
    for (var key in CardStore.cards) {
        if (CardStore.cards[key].sender_email === email) {
            cards.push(CardStore.cards[key]);
        }
    }
    return cards;
}

module.exports = Handlers;
