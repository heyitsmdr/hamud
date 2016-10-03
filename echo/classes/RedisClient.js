var redis = require('redis');
var redisClient = null;

class RedisClient {
  constructor(EchoServer) {
    this.echoServer = EchoServer;
  }

  connect() {
    return new Promise(resolve => {
      redisClient = redis.createClient();
      redisClient.on('connect', () => {
        this.echoServer.logger.info('Connection to Redis successful');
        resolve();
      });
      redisClient.on('error', e => {
        this.echoServer.logger.error(e);
      });
    });
  }

  set(key, value) {
    redisClient.set(key, value);
  }
}

module.exports = RedisClient;
