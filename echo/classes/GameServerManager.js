var io = null;
var gameServers = [];

class GameServerManager {
  constructor(EchoServer) {
    this.echo = EchoServer;
  }

  startListening() {
    io = require('socket.io')(2442);

    io.on('connection', socket => this.handleNewGameServerConnection(socket));
    io.on('disconnect', socket => this.handleDisconnectedGameServerConnection(socket));
  }

  handleNewGameServerConnection(socket) {
    gameServers.push(socket);

    socket.on('disconnect', () => this.handleDisconnectedGameServerConnection(socket));

    this.echo.logger.info(`Game server connected, with ${gameServers.length} backends now available`);
  }

  handleDisconnectedGameServerConnection(socket) {
    gameServers = gameServers.filter(gameServer => {
      if(gameServer === socket) {
        return false;
      } else {
        return true;
      }
    });

    this.echo.logger.info(`Game server disconnected, with ${gameServers.length} backends now available`);
  }
}

module.exports = GameServerManager;
