/**
 * Cache Utility
 * Simple in-memory caching with TTL support for reducing API calls
 * "Use the Great Eagles" - This speeds up the journey by caching repeated operations
 */

/**
 * @typedef {Object} CacheEntry
 * @property {*} value - The cached value
 * @property {number} timestamp - When the entry was created
 * @property {number} ttl - Time-to-live in milliseconds
 */

/** @type {Map<string, CacheEntry>} */
const cache = new Map();

/**
 * Default TTL values for different cache types (in milliseconds)
 */
const DEFAULT_TTL = {
  content: 60 * 60 * 1000,      // 1 hour for content
  apiResponse: 5 * 60 * 1000,   // 5 minutes for API responses
  config: 24 * 60 * 60 * 1000,  // 24 hours for config
  short: 60 * 1000              // 1 minute for short-lived data
};

/**
 * Generate a cache key from multiple values
 * @param {...*} parts - Parts to combine into a key
 * @returns {string} - The cache key
 */
function generateKey(...parts) {
  return parts
    .map(p => typeof p === 'object' ? JSON.stringify(p) : String(p))
    .join(':');
}

/**
 * Set a value in the cache
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {number} [ttl=DEFAULT_TTL.apiResponse] - Time-to-live in milliseconds
 */
function set(key, value, ttl = DEFAULT_TTL.apiResponse) {
  cache.set(key, {
    value,
    timestamp: Date.now(),
    ttl
  });
}

/**
 * Get a value from the cache
 * @param {string} key - Cache key
 * @returns {*} - The cached value or undefined if not found/expired
 */
function get(key) {
  const entry = cache.get(key);
  
  if (!entry) {
    return undefined;
  }
  
  // Check if expired
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return undefined;
  }
  
  return entry.value;
}

/**
 * Check if a key exists and is not expired
 * @param {string} key - Cache key
 * @returns {boolean} - True if key exists and is valid
 */
function has(key) {
  return get(key) !== undefined;
}

/**
 * Delete a key from the cache
 * @param {string} key - Cache key
 * @returns {boolean} - True if the key was deleted
 */
function del(key) {
  return cache.delete(key);
}

/**
 * Clear all entries from the cache
 */
function clear() {
  cache.clear();
}

/**
 * Clear expired entries from the cache
 * @returns {number} - Number of entries cleared
 */
function clearExpired() {
  const now = Date.now();
  let cleared = 0;
  
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
      cleared++;
    }
  }
  
  return cleared;
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
function getStats() {
  const now = Date.now();
  let active = 0;
  let expired = 0;
  
  for (const entry of cache.values()) {
    if (now - entry.timestamp > entry.ttl) {
      expired++;
    } else {
      active++;
    }
  }
  
  return {
    total: cache.size,
    active,
    expired
  };
}

/**
 * Wrap a function with caching
 * @param {Function} fn - The function to wrap
 * @param {Function} keyGenerator - Function to generate cache key from arguments
 * @param {number} [ttl] - TTL for cached values
 * @returns {Function} - The wrapped function
 */
function withCache(fn, keyGenerator, ttl = DEFAULT_TTL.apiResponse) {
  return async function(...args) {
    const key = keyGenerator(...args);
    const cached = get(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = await fn.apply(this, args);
    set(key, result, ttl);
    
    return result;
  };
}

/**
 * Memoize a synchronous function
 * @param {Function} fn - The function to memoize
 * @param {number} [ttl] - TTL for cached values
 * @returns {Function} - The memoized function
 */
function memoize(fn, ttl = DEFAULT_TTL.config) {
  return function(...args) {
    const key = generateKey(fn.name || 'anon', ...args);
    const cached = get(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = fn.apply(this, args);
    set(key, result, ttl);
    
    return result;
  };
}

module.exports = {
  generateKey,
  set,
  get,
  has,
  del,
  clear,
  clearExpired,
  getStats,
  withCache,
  memoize,
  DEFAULT_TTL
};
