var winston = require('winston');
var log = null;

class Logger {
  constructor(EchoServer) {
    this.echoServer = EchoServer;
    log = new winston.Logger({
      transports: [
        new winston.transports.Console({
          colorize: true
        })
      ]
    });
  }

  info(text) {
    log.info(text);
  }

  error(text) {
    log.error(text);
  }
}

module.exports = Logger;
