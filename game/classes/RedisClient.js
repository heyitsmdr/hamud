var redis = require('redis');
var redisClient = null;

class RedisClient {
  constructor(GameServer) {
    this.game = GameServer;
  }

  connect() {
    return new Promise(resolve => {
      redisClient = redis.createClient();
      redisClient.on('connect', () => {
        this.game.logger.info('Connection to Redis successful');
        resolve();
      });
      redisClient.on('error', e => {
        this.game.logger.error(e);
      });
    });
  }

  set(key, value) {
    redisClient.set(key, value);
  }

  get(key) {
    return new Promise(resolve => {
      redisClient.get(key, (err, reply) => {
        resolve(reply);
      });
    });
  }
}

module.exports = RedisClient;
