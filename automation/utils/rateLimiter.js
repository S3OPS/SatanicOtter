/**
 * Rate Limiter Utility
 * Prevents exceeding API rate limits with exponential backoff
 * "Don't storm the gates of Moria" - Take it steady to avoid being blocked
 */

/**
 * @typedef {Object} RateLimiterConfig
 * @property {number} maxRequests - Maximum requests per interval
 * @property {number} interval - Time interval in milliseconds
 * @property {number} maxRetries - Maximum retry attempts on rate limit
 * @property {number} baseDelay - Base delay for exponential backoff (ms)
 * @property {number} maxDelay - Maximum delay between retries (ms)
 */

/**
 * Default configuration for rate limiting
 */
const DEFAULT_CONFIG = {
  maxRequests: 10,
  interval: 60 * 1000, // 1 minute
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 60 * 1000
};

/**
 * Rate limiter instances for different services
 * @type {Map<string, Object>}
 */
const limiters = new Map();

/**
 * Create or get a rate limiter for a service
 * @param {string} serviceName - Name of the service to limit
 * @param {Partial<RateLimiterConfig>} [config] - Configuration options
 * @returns {Object} - The rate limiter instance
 */
function getLimiter(serviceName, config = {}) {
  if (!limiters.has(serviceName)) {
    limiters.set(serviceName, {
      config: { ...DEFAULT_CONFIG, ...config },
      requests: [],
      retryCount: 0
    });
  }
  return limiters.get(serviceName);
}

/**
 * Clean up old requests outside the time window
 * @param {Object} limiter - The limiter instance
 */
function cleanupOldRequests(limiter) {
  const now = Date.now();
  const cutoff = now - limiter.config.interval;
  limiter.requests = limiter.requests.filter(time => time > cutoff);
}

/**
 * Check if we can make a request
 * @param {string} serviceName - Name of the service
 * @returns {boolean} - True if a request is allowed
 */
function canMakeRequest(serviceName) {
  const limiter = getLimiter(serviceName);
  cleanupOldRequests(limiter);
  
  return limiter.requests.length < limiter.config.maxRequests;
}

/**
 * Record a request
 * @param {string} serviceName - Name of the service
 */
function recordRequest(serviceName) {
  const limiter = getLimiter(serviceName);
  limiter.requests.push(Date.now());
}

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (0-based)
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} - Delay in milliseconds
 */
function calculateBackoff(attempt, baseDelay = DEFAULT_CONFIG.baseDelay, maxDelay = DEFAULT_CONFIG.maxDelay) {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  const delay = Math.min(exponentialDelay + jitter, maxDelay);
  
  return Math.floor(delay);
}

/**
 * Wait for the rate limit window to pass
 * @param {string} serviceName - Name of the service
 * @returns {Promise<void>}
 */
async function waitForRateLimit(serviceName) {
  const limiter = getLimiter(serviceName);
  
  if (limiter.requests.length === 0) {
    return;
  }
  
  const oldestRequest = Math.min(...limiter.requests);
  const waitTime = oldestRequest + limiter.config.interval - Date.now();
  
  if (waitTime > 0) {
    await sleep(waitTime + 100); // Add small buffer
  }
}

/**
 * Utility function to sleep
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a function with rate limiting
 * @param {string} serviceName - Name of the service
 * @param {Function} fn - Async function to execute
 * @returns {Promise<*>} - Result of the function
 */
async function withRateLimit(serviceName, fn) {
  const limiter = getLimiter(serviceName);
  
  // Wait if at capacity
  while (!canMakeRequest(serviceName)) {
    await waitForRateLimit(serviceName);
    cleanupOldRequests(limiter);
  }
  
  // Record and execute
  recordRequest(serviceName);
  return fn();
}

/**
 * Execute a function with rate limiting and retry logic
 * @param {string} serviceName - Name of the service
 * @param {Function} fn - Async function to execute
 * @param {Object} [options] - Options
 * @param {Function} [options.isRetryable] - Function to determine if error is retryable
 * @param {Function} [options.onRetry] - Callback when retrying
 * @returns {Promise<*>} - Result of the function
 */
async function withRetry(serviceName, fn, options = {}) {
  const limiter = getLimiter(serviceName);
  const { isRetryable = () => true, onRetry = () => {} } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= limiter.config.maxRetries; attempt++) {
    try {
      return await withRateLimit(serviceName, fn);
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      const shouldRetry = attempt < limiter.config.maxRetries && isRetryable(error);
      
      if (shouldRetry) {
        const delay = calculateBackoff(attempt, limiter.config.baseDelay, limiter.config.maxDelay);
        onRetry(attempt + 1, delay, error);
        await sleep(delay);
      } else {
        break;
      }
    }
  }
  
  throw lastError;
}

/**
 * Check if an error is a rate limit error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a rate limit error
 */
function isRateLimitError(error) {
  // Check various rate limit error patterns
  return error.status === 429 ||
         error.code === 'rate_limit_exceeded' ||
         (error.message && error.message.toLowerCase().includes('rate limit')) ||
         (error.error && error.error.type === 'rate_limit_error');
}

/**
 * Get statistics for a rate limiter
 * @param {string} serviceName - Name of the service
 * @returns {Object} - Rate limiter statistics
 */
function getStats(serviceName) {
  const limiter = getLimiter(serviceName);
  cleanupOldRequests(limiter);
  
  return {
    serviceName,
    currentRequests: limiter.requests.length,
    maxRequests: limiter.config.maxRequests,
    windowMs: limiter.config.interval,
    available: limiter.config.maxRequests - limiter.requests.length
  };
}

/**
 * Reset a rate limiter
 * @param {string} serviceName - Name of the service
 */
function reset(serviceName) {
  if (limiters.has(serviceName)) {
    const limiter = limiters.get(serviceName);
    limiter.requests = [];
    limiter.retryCount = 0;
  }
}

/**
 * Reset all rate limiters
 */
function resetAll() {
  limiters.clear();
}

module.exports = {
  getLimiter,
  canMakeRequest,
  recordRequest,
  calculateBackoff,
  waitForRateLimit,
  withRateLimit,
  withRetry,
  isRateLimitError,
  getStats,
  reset,
  resetAll,
  sleep,
  DEFAULT_CONFIG
};
