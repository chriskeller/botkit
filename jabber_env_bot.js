
const Botkit = require('./lib/Botkit.js');
//const Botkit = require('botkit');
const xml = require('@xmpp/xml');
const debug = require('debug')('bot');
const dotenv = require('dotenv');

// read in env variables from file
const result = dotenv.config({path: '/app/secrets.env'});
if (result.error) {
  console.log("Error reading Environment variables from file: " + result.error)
}
console.log("Env parsing result: " + result.parsed)

var nodered = require('./lib/middleware/middleware-node-red')({
    //nodered_uri: 'http://localhost:1880/chat'
    nodered_uri: process.env.NODERED_URL + '/chat'
})

var controller = Botkit.jabberbot({
    json_file_store: './bot/'
});

console.log('JID: ' + process.env.JABBER_JID);
console.log('PWD: ' + process.env.JABBER_PWD);
console.log('HOST: ' + process.env.JABBER_HOST);
console.log('PORT: ' + process.env.JABBER_PORT);

var bot = controller.spawn({
    client: {
        jid: 		process.env.JABBER_JID,
        password: 	process.env.JABBER_PWD,
        host: 		process.env.JABBER_HOST,
        port: 		process.env.JABBER_PORT
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
