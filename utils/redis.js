import { createClient } from "redis";
import { promisify } from "util";

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Represents a Redis utility class.
   * @constructor
   */
  constructor() {
    this.client = createClient();
    this.client.on("error", (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  /**
   * Checks if the Redis client is connected and returns a boolean value.
   *
   * @returns {boolean} True if the Redis client is connected, false otherwise.
   */
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<any>} - A promise that resolves to the value associated with the key.
   */
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  /**
   * Sets a key-value pair in Redis with an optional expiration time.
   *
   * @param {string} key - The key to set in Redis.
   * @param {string} value - The value to associate with the key.
   * @param {number} time - The expiration time in seconds (optional).
   * @returns {Promise<void>} - A Promise that resolves when the key-value pair is set in Redis.
   */
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  /**
   * Deletes a key from Redis.
   *
   * @param {string} key - The key to delete.
   * @returns {Promise<void>} - A promise that resolves when the key is deleted.
   */
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
