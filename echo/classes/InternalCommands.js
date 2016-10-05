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
    } else if(internalCommand.toLowerCase() === 'connections') {
      return this.showCurrentActiveConnections();
    }  else {
      return { processed: false };
    }
  }

  showGameServers() {
    return { processed: true, message: this.echo.gameServerManager.getGameServerList() };
  }

  showCurrentActiveConnections() {
    return { processed: true, message: `There are currently ${this.echo.telnetServer.getTotalActiveConnections()} active connections on this echo server.` };
  }

  addGameServer(hostname) {
    console.log(hostname);
    return { processed: true, message: 'Ok.' };
  }
}

module.exports = InternalCommands;
