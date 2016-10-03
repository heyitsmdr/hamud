var TelnetServer = require('./classes/TelnetServer');
var RedisClient = require('./classes/RedisClient');
var Logger = require('./classes/Logger');
var GameServerManager = require('./classes/GameServerManager');
var InternalCommands = require('./classes/InternalCommands');

class EchoServer {
  constructor() {
    this.telnetServer = new TelnetServer(this);
    this.redisClient = new RedisClient(this);
    this.logger = new Logger(this);
    this.gameServerManager = new GameServerManager(this);
    this.internalCommands = new InternalCommands(this);
    this.echoId = `ECHO_SERVER:${Date.now()}`
  }

  start() {
    this.logger.info('HAMUD: Echo Server');
    this.logger.info('##################');

    this.logger.info(`Echo ID is ${this.echoId}`);

    this.redisClient.connect().then(() => {
      this.gameServerManager.startListening();

      this.telnetServer.acceptConnections();
    });
  }
}

var echoServer = new EchoServer();
echoServer.start();
