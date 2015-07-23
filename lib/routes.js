var Handlers = require('./handlers');

module.exports = [
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
    handler: Handlers.cardHandler
},
{
    path: '/cards/new',
    method: 'GET',
    handler: Handlers.newCardHandler
},
{
    path: '/cards/new',
    method: 'POST',
    handler: Handlers.createCardHandler
},
{
    path: '/cards/{id}send',
    method: 'POST',
    handler: Handlers.createCardHandler
},
 {
    path: '/cards/{id}',
    method: 'DELETE',
    handler: Handlers.deleteCardHandler
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
}];
