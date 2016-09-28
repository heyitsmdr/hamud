var TelnetServer = require('./classes/TelnetServer');

class Echo {
  constructor() {
    this.TelnetServer = new TelnetServer(this);
  }

  start() {
    this.TelnetServer.acceptConnections();
  }
}

var echo = new Echo();
echo.start();
