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
