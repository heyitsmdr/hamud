var net = require('net');
var sockets = [];
var server = null;

class TelnetServer {
  constructor(Echo) {
    this.Echo = Echo;
  }

  acceptConnections() {
    server = net.createServer(socket => this.handleNewSocket(socket));
    server.listen(5000);
    console.log(`Accepting connections on port 5000`)
  }

  handleNewSocket(socket) {
    sockets.push(socket);
    socket.write('Welcome to HAMud!\n');
    socket.on('data', data => this.handleIncomingData(socket, data));
    socket.on('end', () => this.handleClosingSocket(socket));
    console.log('Socket connection opened.');
  }

  handleIncomingData(socket, data) {
    console.log(`Incoming: ${data}`);
  }

  handleClosingSocket(socket) {
    let i = sockets.indexOf(socket);
    if(i != -1) {
      sockets.splice(i, 1);
    }
    console.log('Socket connection closed.');
  }
}

module.exports = TelnetServer;
