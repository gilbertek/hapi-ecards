var Handlers = require('./handlers');

module.exports = [
{
    path: '/',
    method: 'GET',
    handler: {
        file: 'templates/index.html'
    },
    config: {
        auth: false
    }
},
{
    path: '/cards',
    method: 'GET',
    handler: Handlers.cardsIndexHandler
},
{
    path: '/cards/{id}',
    method: 'GET',
    handler: Handlers.cardsShowHandler
},
{
    path: '/cards/new',
    method: 'GET',
    handler: Handlers.cardsNewHandler
},
{
    path: '/cards/new',
    method: 'POST',
    handler: Handlers.cardsCreateHandler
},
{
    path: '/cards/{id}send',
    method: 'POST',
    handler: Handlers.cardsSendHandler
},
{
    path: '/cards/{id}',
    method: 'DELETE',
    handler: Handlers.cardsDeleteHandler
},
{
    path: '/login',
    method: 'GET',
    handler: {
        file: 'templates/login.html'
    },
    config: {
        auth: false
    }
},
{
    path: '/login',
    method: 'POST',
    handler: Handlers.loginHandler,
    config: {
        auth: false
    }
},
{
    path: '/logout',
    method: 'GET',
    handler: Handlers.logoutHandler,
},
{
    path: '/register',
    method: 'GET',
    handler: {
        file: 'templates/register.html'
    },
    config: {
        auth: false
    }
},
{
    path: '/register',
    method: 'POST',
    handler: Handlers.registerHandler,
    config: {
        auth: false
    }
},
{
    path: '/upload',
    method: 'GET',
    handler: {
        file: 'templates/upload.html'
    }
},
{
    path: '/upload',
    method: 'POST',
    handler: Handlers.uploadHandler,
    config: {
        payload: {
            output: 'file',
            uploads: 'public/images',
            maxBytes: 209715200,
            output: 'stream'
        }
    }
},
{
    path: '/assets/{path*}',
    method: 'GET',
    handler: {
        directory: {
            path: './public',
            listing: false
        }
    },
    config: {
        auth: false
    }
}];
