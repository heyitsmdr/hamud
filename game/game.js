var EchoRouter = require('./classes/EchoRouter');
var RedisClient = require('./classes/RedisClient');
var CommandProcessor = require('./classes/CommandProcessor');
var Logger = require('./classes/Logger');

class GameServer {
  constructor() {
    this.echoRouter = new EchoRouter(this);
    this.redisClient = new RedisClient(this);
    this.logger = new Logger(this);
    this.commandProcessor = new CommandProcessor(this);
  }

  start() {
    this.logger.info('HAMUD: Game Server');
    this.logger.info('##################');
    this.redisClient.connect().then(() => {
      this.commandProcessor.initializeCommands().then(() => {
        this.echoRouter.connect();
      });
    });
  }
}

var gameServer = new GameServer();
gameServer.start();
