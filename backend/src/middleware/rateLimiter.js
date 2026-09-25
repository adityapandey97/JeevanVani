/**
 * In-Memory Token Bucket / Sliding Window Rate Limiter
 * Protects auth, voice transcription, and AI assistant endpoints from abuse.
 * Zero-dependency, lightweight, and configurable per route.
 */

const hitMap = new Map();

// Clean up expired buckets every 10 minutes (unref so it does not prevent process exit)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hitMap.entries()) {
    if (now > entry.resetTime) {
      hitMap.delete(key);
    }
  }
}, 600000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Creates rate limiter middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (e.g. 60000 for 1 min)
 * @param {number} options.max - Maximum requests allowed per window
 * @param {string} options.message - Custom error message
 */
export function rateLimiter({ windowMs = 60000, max = 60, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    // Generate identifier from IP + route prefix
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();

    let entry = hitMap.get(key);
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      hitMap.set(key, entry);
    } else {
      entry.count++;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: Math.ceil((entry.resetTime - now) / 1000)
        }
      });
    }

    next();
  };
}

// Pre-configured rate limiters for critical application surfaces
export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // 30 login/register attempts per 15 min
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
});

export const voiceLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 min
  max: 45, // 45 voice transcriptions per minute
  message: 'Voice processing rate limit reached. Please wait a few seconds.'
});

export const assistantLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 min
  max: 30, // 30 AI queries per minute
  message: 'Career Assistant query rate limit reached. Please pause a moment.'
});

export default {
  rateLimiter,
  authLimiter,
  voiceLimiter,
  assistantLimiter
};
