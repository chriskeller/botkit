const request = require('request-promise')
const debug = require('debug')('nodered')

module.exports = config => {
  if (!config) {
    config = {}
  }

  if (!config.nodered_uri) {
    //config.nodered_uri = 'http://localhost:1880/chat'
    config.nodered_uri = process.env.NODERED_URL + '/chat'
  }

  var middleware = {
    ingest: (bot, message, res, next ) => {
      debug('Ingest message: ', JSON.stringify(message, null, 1 ));

      next();
    },
    receive: (bot, message, next) => {
      // is_echo: can be true for facebook bots when the echo webhook is subscribed
      // bot_id: keep an eye https://github.com/howdyai/botkit/pull/694
      // if bot_id is present, the message comes from another bot
      if (!message.text || message.is_echo || message.bot_id) {
        next()
        return
      }

      debug('Send message text to Node-RED: ', message.text)
      const options = {
        method: 'POST',
        //uri: '${config.nodered_uri}',
        uri: config.nodered_uri,
        body: {
          query: message.text
        },
        json: true
      }

      debug('POST options: ', options)

      request(options)
        .then(response => {
          debug('Node-RED response received:', response)
          message.response = response
          next()
        })
    },

    hears: (patterns, message) => {
      return patterns.some(pattern => {
	debug('Node-RED response sending: ', message.response );
        if( message.response ) {
	  return true
	}
      })
    }

  }
  return middleware
}
