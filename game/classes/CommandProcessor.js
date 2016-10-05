var walk = require('walk');
var availableCommands = [];

class CommandProcessor {
  constructor(GameServer) {
    this.game = GameServer;
  }

  initializeCommands() {
    return new Promise(resolve => {
      let walker = walk.walk(`${__dirname}/commands`);

      walker.on('file', (root, fileStat, next) => {
        if(fileStat.name === 'Base.js') {
          return next(); // This isn't an actual command
        }

        try {
          let commandClass = require(`${root}/${fileStat.name}`);
          let commandInstance = new commandClass(this.game);
          availableCommands.push(commandInstance);
        } catch(e) {
          this.game.logger.error(`Error loading command class: ${fileStat.name}`)
          this.game.logger.error(e);
        }

        next();
      });

      walker.on('end', () => {
        this.game.logger.info(`Loaded ${availableCommands.length} commands into memory`);
        resolve();
      });
    });
  }

  processCommand(playerId, playerCommand) {
    let baseCommand = playerCommand.split(' ')[0];

    for(let i = 0; i < availableCommands.length; i++) {
      if(availableCommands[i].command === baseCommand) {
        availableCommands[i].execute(playerId);
        return;
      }
    }

    this.game.echoRouter.sendToId(playerId, `Huh? I don't understand '${playerCommand}'.`);
  }
}

module.exports = CommandProcessor;
