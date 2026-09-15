import { Redis } from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

let redisClient = null;
let isConnected = false;
let connectionAttempted = false;

export function getRedisConfig() {
  return {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: true,
    connectTimeout: 2000,
    retryStrategy(times) {
      if (times > 3) {
        // Stop spamming if Redis is not running locally
        return null;
      }
      return Math.min(times * 1000, 2000);
    }
  };
}

export function initRedis() {
  if (redisClient) return redisClient;

  try {
    const config = getRedisConfig();
    redisClient = new Redis(config);

    redisClient.on('connect', () => {
      isConnected = true;
      connectionAttempted = true;
      console.log(`[Redis] Connected successfully to ${REDIS_HOST}:${REDIS_PORT}`);
    });

    redisClient.on('ready', () => {
      isConnected = true;
    });

    redisClient.on('error', (err) => {
      isConnected = false;
      if (!connectionAttempted) {
        console.warn(`[Redis] Connection warning: Redis server not available at ${REDIS_HOST}:${REDIS_PORT}. Operating in zero-config in-memory fallback mode.`);
        connectionAttempted = true;
      }
    });

    redisClient.on('close', () => {
      isConnected = false;
    });
  } catch (error) {
    isConnected = false;
    console.warn('[Redis] Initialization warning:', error.message);
  }

  return redisClient;
}

export function isRedisAvailable() {
  return isConnected;
}

export async function checkRedisHealth() {
  if (!redisClient || !isConnected) {
    return {
      status: 'fallback',
      message: 'Operating in zero-config direct / in-memory mode',
      host: REDIS_HOST,
      port: REDIS_PORT
    };
  }

  try {
    const ping = await redisClient.ping();
    return {
      status: 'connected',
      ping,
      host: REDIS_HOST,
      port: REDIS_PORT
    };
  } catch (err) {
    return {
      status: 'degraded',
      error: err.message,
      host: REDIS_HOST,
      port: REDIS_PORT
    };
  }
}

export default {
  initRedis,
  getRedisConfig,
  isRedisAvailable,
  checkRedisHealth
};
