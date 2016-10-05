var redis = require('redis');
var echoServers = [];
var echoPool = [];

class EchoRouter {
  constructor(GameServer) {
    this.game = GameServer;
  }

  connect() {
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
      echoConnection.on('disconnect', () => this.handleEchoDisconnection(echoServer));
      echoConnection.on('ECHO_ID', data => this.handleEchoId(echoServer, data));
      echoConnection.on('PLAYER_COMMAND', data => this.handlePlayerCommand(echoServer, data));

      echoPool.push({
        host: echoServer,
        hostname: echoServer.split(':')[0],
        socket: echoConnection,
        id: null
      });
    });
  }

  handleEchoConnection(echoServer) {
    this.game.logger.info(`Connection to echo server (${echoServer}) successful!`)
  }

  handleEchoDisconnection(echoServer) {
    this.game.logger.info(`Connection has been dropped to the echo server (${echoServer}), will try reconnecting..`);
  }

  handleEchoId(echoServer, echoId) {
    echoPool.forEach(echo => {
      if(echo.host === echoServer) {
        echo.id = echoId;
      }
    });

    this.game.logger.info(`Echo server (${echoServer}) identified themselves as: ${echoId}`);
  }

  handlePlayerCommand(echoServer, data) {
    this.game.logger.info(`Player ${data.playerId} used command: ${data.command}`);
    this.game.commandProcessor.processCommand(data.playerId, data.command);
  }

  sendToId(playerId, text) {
    // Get the echo server that this player is connected to
    this.game.redisClient.get(playerId).then(echoServerId => {
      echoPool.forEach(echo => {
        if(echo.id === echoServerId) {
          echo.socket.emit('TEXT_TO_PLAYER', {
            playerId: playerId,
            text: text
          });
        }
      });
    });
  }
}

module.exports = EchoRouter;
