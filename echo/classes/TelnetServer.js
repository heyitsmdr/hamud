var os = require('os');
var net = require('net');
var sockets = [];
var server = null;

class TelnetServer {
  constructor(EchoServer) {
    this.echoServer = EchoServer;
  }

  acceptConnections() {
    server = net.createServer(socket => this.handleNewSocket(socket));
    server.listen(5000);
    this.echoServer.logger.info(`Accepting connections on port 5000`);
  }

  handleNewSocket(socket) {
    // Add the socket to our pool
    sockets.push(socket);

    // Set up socket events
    socket.on('data', data => this.handleIncomingData(socket, data));
    socket.on('end', () => this.handleClosingSocket(socket));

    // Assign an id to the connection
    socket.playerId = `ECHO_PLAYER:${Date.now()}`

    // Store the new connection in Redis
    this.echoServer.redisClient.set(socket.playerId, this.echoServer.echoId);

    // Let us (and the player) know that they've successfully made a connection
    this.echoServer.logger.info(`Socket connection opened with assigned ID: ${socket.playerId} [${sockets.length}]`);
    socket.write('You are now connected to another universe!\n');
  }

  handleIncomingData(socket, data) {
    let command = this.normalizeCommand(data);

    let internalCommandProcessed = this.echoServer.internalCommands.parseInternalCommand(command);

    if(internalCommandProcessed.processed === true) {
      socket.write(internalCommandProcessed.message)
    } else {
      console.log('Not a processed internal command..');
    }
  }

  normalizeCommand(command) {
    let commandString = command.toString('utf8');
    let finalCommand = '';

    for(let i = 0; i < commandString.length; i++) {
      switch(commandString.charCodeAt(i)) {
        case 15:
        case 10:
        case 13:
          break;
        default:
          finalCommand = finalCommand + commandString.substr(i, 1);
      }
    }

    return finalCommand;
  }

  handleClosingSocket(socket) {
    // Remove the socket from our pool
    let i = sockets.indexOf(socket);
    if(i != -1) {
      sockets.splice(i, 1);
    }

    // Clear out the Redis value
    this.echoServer.redisClient.set(socket.playerId, '');

    // Let us know that the conncetion is now closed
    this.echoServer.logger.info(`Socket connection closed with assigned ID: ${socket.playerId} [${sockets.length}]`);
  }
}

module.exports = TelnetServer;
