class InternalCommands {
  constructor(EchoServer) {
    this.echo = EchoServer;
  }

  parseInternalCommand(command) {
    if(command.substr(0, 1) !== '@') {
      return { processed: false }; // Not an internal command
    }

    let internalCommand = command.substr(1);

    this.echo.logger.info(`Internal command used: @${internalCommand}`);

    if(internalCommand.toLowerCase() === 'gameservers') {
      return this.showGameServers();
    } else if(internalCommand.toLowerCase().split(' ')[0] === 'add') {
      return this.addGameServer(internalCommand.substr(4));
    }  else {
      return { processed: false };
    }
  }

  showGameServers() {
    return { processed: true, message: 'Game servers!' };
  }

  addGameServer(hostname) {
    console.log(hostname);
    return { processed: true, message: 'Ok.' };
  }
}

module.exports = InternalCommands;
