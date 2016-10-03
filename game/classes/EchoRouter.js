var redis = require('redis');
var echoServers = [];
var echoPool = [];
var redisClient = null;

class EchoRouter {
  constructor(GameServer) {
    this.game = GameServer;
  }

  connectRedis() {
    return new Promise(resolve => {
      redisClient = redis.createClient();
      redisClient.on('connect', () => {
        this.game.logger.info(`Connection to Redis successful!`);
        resolve();
      });
      redisClient.on('error', e => {
        this.game.logger.error(e);
      });
    });
  }

  connect() {
    this.connectRedis().then(() => {
      // Get a pool of servers
      if(process.env.ECHO_SERVERS) {
        let echoServerArray = process.env.ECHO_SERVERS.split(',');
        echoServers = echoServerArray;
      } else {
        echoServers = ['localhost:2442'];
      }

      // Create connections to all of them
      echoServers.forEach(echoServer => {
        let echoio = require('socket.io-client');

        let echoConnection = echoio.connect(`http://${echoServer}`);

        this.game.logger.info(`Attempting to connect to echo server ${echoServer}`);

        echoConnection.on('connect', () => this.handleEchoConnection(echoServer));
        echoConnection.on('disconnect', () => this.handleEchoDisconncetion(echoServer));

        echoPool.push({
          hostname: echoServer.split(':')[0],
          socket: echoConnection
        });
      });
    });
  }

  handleEchoConnection(echoServer) {
    this.game.logger.info(`Connection to echo server (${echoServer}) successful!`)
  }

  handleEchoDisconnection(echoServer) {
    this.game.logger.info(`Connection has been dropped to the echo server (${echoServer}), will try reconnecting..`);
  }

  sendToId(echoId, text) {
    let echoServerId = redisClient.get(echoId);

    echoPool.forEach(echo => {
      
    });

    console.log(echoServerId);
  }
}

module.exports = EchoRouter;
