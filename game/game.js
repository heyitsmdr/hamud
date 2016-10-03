var EchoRouter = require('./classes/EchoRouter');
var Logger = require('./classes/Logger');

class GameServer {
  constructor() {
    this.echoRouter = new EchoRouter(this);
    this.logger = new Logger(this);
  }

  start() {
    this.logger.info('HAMUD: Game Server');
    this.logger.info('##################');
    this.echoRouter.connect();
  }
}

var gameServer = new GameServer();
gameServer.start();
