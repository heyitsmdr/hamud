var io = null;
var gameServers = [];
var Chance = require('chance');
var chance = new Chance();

class GameServerManager {
  constructor(EchoServer) {
    this.echo = EchoServer;
  }

  startListening() {
    io = require('socket.io')(2442);

    io.on('connection', socket => this.handleNewGameServerConnection(socket));
  }

  handleNewGameServerConnection(socket) {
    gameServers.push(socket);

    socket.on('disconnect', () => this.handleDisconnectedGameServerConnection(socket));
    socket.on('TEXT_TO_PLAYER', data => this.handleTextToPlayer(socket, data));

    this.echo.logger.info(`Game server connected, with ${gameServers.length} backends now available`);

    socket.emit('ECHO_ID', this.echo.echoId);
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

  handlePlayerCommand(playerId, playerCommand) {
    if(gameServers.length === 0) {
      return false;
    }

    let randomServer = chance.integer({ min: 0, max: (gameServers.length - 1) });

    gameServers[randomServer].emit('PLAYER_COMMAND', {
      playerId: playerId,
      command: playerCommand
    });

    return true;
  }

  handleTextToPlayer(socket, playerData) {
    let playerId = playerData.playerId;
    let playerText = playerData.text;

    this.echo.telnetServer.sendToPlayer(playerId, playerText);
  }

  getGameServerList() {
    return `There are ${gameServers.length} game server backends connected.`;
  }
}

module.exports = GameServerManager;
