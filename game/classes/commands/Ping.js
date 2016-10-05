var Base = require('./Base');

class Ping extends Base {
  constructor(GameServer) {
    super(GameServer);
    this.command = 'ping';
  }

  execute(playerId) {
    this.game.echoRouter.sendToId(playerId, 'PONG!');
  }
}

module.exports = Ping;
