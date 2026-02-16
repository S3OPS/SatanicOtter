/**
 * Unit tests for rate limiter utility
 */

const rateLimiter = require('../../../automation/utils/rateLimiter');

describe('rateLimiter utility', () => {
  beforeEach(() => {
    // Clear all limiters before each test
    rateLimiter.resetAll();
  });

  describe('basic rate limiting', () => {
    test('allows requests within limit', () => {
      // Configure limiter with test settings
      rateLimiter.getLimiter('test-service', { maxRequests: 3, interval: 1000 });
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(true);
      rateLimiter.recordRequest('test-service');
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(true);
      rateLimiter.recordRequest('test-service');
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(true);
      rateLimiter.recordRequest('test-service');
    });

    test('blocks requests exceeding limit', () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 2, interval: 1000 });
      
      rateLimiter.recordRequest('test-service');
      rateLimiter.recordRequest('test-service');
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(false);
    });

    test('allows requests after time window expires', async () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 2, interval: 100 });
      
      rateLimiter.recordRequest('test-service');
      rateLimiter.recordRequest('test-service');
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(false);
      
      // Wait for interval to pass
      await rateLimiter.sleep(150);
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(true);
    });
  });

  describe('multiple services', () => {
    test('maintains separate limits for different services', () => {
      rateLimiter.getLimiter('service-a', { maxRequests: 1, interval: 1000 });
      rateLimiter.getLimiter('service-b', { maxRequests: 1, interval: 1000 });
      
      rateLimiter.recordRequest('service-a');
      rateLimiter.recordRequest('service-b');
      
      expect(rateLimiter.canMakeRequest('service-a')).toBe(false);
      expect(rateLimiter.canMakeRequest('service-b')).toBe(false);
      
      rateLimiter.getLimiter('service-c', { maxRequests: 1, interval: 1000 });
      expect(rateLimiter.canMakeRequest('service-c')).toBe(true);
    });
  });

  describe('exponential backoff calculation', () => {
    test('calculates correct delay for retry attempts', () => {
      const baseDelay = 1000;
      const maxDelay = 10000;
      
      // First retry: 1000ms base (2^0 = 1)
      const delay0 = rateLimiter.calculateBackoff(0, baseDelay, maxDelay);
      expect(delay0).toBeGreaterThanOrEqual(baseDelay);
      expect(delay0).toBeLessThan(baseDelay * 2);
      
      // Second retry: 2000ms base (2^1 = 2)
      const delay1 = rateLimiter.calculateBackoff(1, baseDelay, maxDelay);
      expect(delay1).toBeGreaterThanOrEqual(baseDelay * 2);
      expect(delay1).toBeLessThan(baseDelay * 4);
      
      // Third retry: 4000ms base (2^2 = 4)
      const delay2 = rateLimiter.calculateBackoff(2, baseDelay, maxDelay);
      expect(delay2).toBeGreaterThanOrEqual(baseDelay * 4);
      expect(delay2).toBeLessThan(baseDelay * 8);
    });

    test('respects maximum delay cap', () => {
      const baseDelay = 1000;
      const maxDelay = 5000;
      
      const delay = rateLimiter.calculateBackoff(10, baseDelay, maxDelay);
      expect(delay).toBeLessThanOrEqual(maxDelay);
    });

    test('adds jitter to prevent thundering herd', () => {
      const baseDelay = 1000;
      const maxDelay = 10000;
      
      const delays = [];
      for (let i = 0; i < 10; i++) {
        delays.push(rateLimiter.calculateBackoff(2, baseDelay, maxDelay));
      }
      
      // Check that delays are not all identical (jitter is applied)
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('waitForRateLimit', () => {
    test('waits for rate limit window to clear', async () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 1, interval: 100 });
      
      rateLimiter.recordRequest('test-service');
      
      const startTime = Date.now();
      await rateLimiter.waitForRateLimit('test-service');
      const elapsed = Date.now() - startTime;
      
      // Should have waited approximately 100ms + buffer
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(rateLimiter.canMakeRequest('test-service')).toBe(true);
    });
  });

  describe('withRateLimit', () => {
    test('executes function within rate limits', async () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 2, interval: 1000 });
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const result = await rateLimiter.withRateLimit('test-service', mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('waits when rate limit is exceeded', async () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 1, interval: 100 });
      const mockFn = jest.fn().mockResolvedValue('success');
      
      // Fill up the rate limit
      rateLimiter.recordRequest('test-service');
      
      const startTime = Date.now();
      await rateLimiter.withRateLimit('test-service', mockFn);
      const elapsed = Date.now() - startTime;
      
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('withRetry', () => {
    test('retries on errors', async () => {
      rateLimiter.getLimiter('test-service', { maxRetries: 2, baseDelay: 10 });
      let attempts = 0;
      const mockFn = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 2) {
          const error = new Error('Rate limit exceeded');
          error.status = 429;
          throw error;
        }
        return 'success';
      });
      
      const result = await rateLimiter.withRetry('test-service', mockFn);
      
      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });

    test('gives up after max retries', async () => {
      rateLimiter.getLimiter('test-service', { maxRetries: 2, baseDelay: 10 });
      const mockFn = jest.fn().mockImplementation(() => {
        const error = new Error('Rate limit exceeded');
        error.status = 429;
        throw error;
      });
      
      await expect(
        rateLimiter.withRetry('test-service', mockFn)
      ).rejects.toThrow('Rate limit exceeded');
      
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('isRateLimitError', () => {
    test('identifies rate limit errors by status code', () => {
      const error = new Error('Rate limit exceeded');
      error.status = 429;
      expect(rateLimiter.isRateLimitError(error)).toBe(true);
    });

    test('identifies rate limit errors by message', () => {
      const error = new Error('rate limit exceeded');
      expect(rateLimiter.isRateLimitError(error)).toBe(true);
    });

    test('returns false for non-rate-limit errors', () => {
      const error = new Error('Some other error');
      const result = rateLimiter.isRateLimitError(error);
      expect(result).toBeFalsy();
    });
  });

  describe('getStats', () => {
    test('returns current rate limiter statistics', () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 5, interval: 1000 });
      
      rateLimiter.recordRequest('test-service');
      rateLimiter.recordRequest('test-service');
      
      const stats = rateLimiter.getStats('test-service');
      
      expect(stats.currentRequests).toBe(2);
      expect(stats.maxRequests).toBe(5);
      expect(stats.available).toBe(3);
    });

    test('shows correct stats when at limit', () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 2, interval: 1000 });
      
      rateLimiter.recordRequest('test-service');
      rateLimiter.recordRequest('test-service');
      
      const stats = rateLimiter.getStats('test-service');
      
      expect(stats.available).toBe(0);
    });
  });

  describe('reset and resetAll', () => {
    test('resets a single rate limiter', () => {
      rateLimiter.getLimiter('test-service', { maxRequests: 1, interval: 1000 });
      rateLimiter.recordRequest('test-service');
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(false);
      
      rateLimiter.reset('test-service');
      
      expect(rateLimiter.canMakeRequest('test-service')).toBe(true);
    });

    test('resets all rate limiters', () => {
      rateLimiter.getLimiter('service-a', { maxRequests: 1, interval: 1000 });
      rateLimiter.getLimiter('service-b', { maxRequests: 1, interval: 1000 });
      
      rateLimiter.recordRequest('service-a');
      rateLimiter.recordRequest('service-b');
      
      expect(rateLimiter.canMakeRequest('service-a')).toBe(false);
      expect(rateLimiter.canMakeRequest('service-b')).toBe(false);
      
      rateLimiter.resetAll();
      
      rateLimiter.getLimiter('service-a', { maxRequests: 1, interval: 1000 });
      rateLimiter.getLimiter('service-b', { maxRequests: 1, interval: 1000 });
      expect(rateLimiter.canMakeRequest('service-a')).toBe(true);
      expect(rateLimiter.canMakeRequest('service-b')).toBe(true);
    });
  });
});
