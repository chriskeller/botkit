const Botkit = require('botkit');
const xml = require('@xmpp/xml');
const debug = require('debug')('bot');

// read in env variables from file
require('dotenv').config();

var nodered = require('./lib/middleware/middleware-node-red')({
    nodered_uri: 'http://localhost:1880/chat'
})

var controller = Botkit.jabberbot({
    json_file_store: './bot/'
});

var bot = controller.spawn({
    client: {
        jid: 		process.env.JABBER_JID,
        password: 	process.env.JABBER_PWD,
        host: 		process.env.JABBER_HOST,
        port: 		process.evn.JABBER_PORT
    }
});

//controller.middleware.ingest.use(nodered.ingest);

// set middleware for receive
controller.middleware.receive.use(nodered.receive);

// change ears
// controller.changeEars(nodered.hears);


// callback function which react to user inputs
// rasa first processes the input and identifies the next_action
controller.hears(['nodered-response'], ['direct_mention', 'self_message', 'direct_message'], nodered.hears, function( bot, message ){

    //debug('Message', JSON.stringify( message, null, 2 ));
    bot.reply( message, message.response );
});
