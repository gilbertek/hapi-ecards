var uuid      = require('uuid'),
    Joi       = require('joi'),
    Boom      = require('boom'),
    fs        = require('fs'),
    CardStore = require('./cardStore');

var Handlers = {};

Handlers.createCardHandler = function (req, res) {
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

Handlers.deleteCardHandler = function(req, res) {
    delete CardStore.cards[req.params.id];
    res();
}

Handlers.cardHandler = function (req, res) {
    res.view('cards', { cards: CardStore.cards });
}

Handlers.newCardHandler = function (req, res) {
    res.view('new', { card_images: mapImages() });
}

function saveCard(card) {
    var id = uuid.v1();
    card.id = id;
    console.log(card);
    CardStore.cards[id] = card;
}

function mapImages() {
    return fs.readdirSync('./public/images/cards');
}

var cardSchema = Joi.object().keys({
    name:            Joi.string().min(3).max(50).required(),
    recipient_email: Joi.string().email().required(),
    sender_name:     Joi.string().min(3).max(50).required(),
    sender_email:    Joi.string() .email().required(),
    card_image:      Joi.string().regex(/.+\.(jpg|bmp|png|gif|jpeg)\b/).required(),
    message:         Joi.string().min(8).max(255)
});

module.exports = Handlers;
