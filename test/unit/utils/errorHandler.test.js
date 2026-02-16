/**
 * Unit tests for errorHandler utility
 */

const errorHandler = require('../../../automation/utils/errorHandler');
const { ErrorType, AppError } = errorHandler;

describe('errorHandler utility', () => {
  describe('ErrorType', () => {
    test('exports all error types', () => {
      expect(ErrorType.VALIDATION).toBe('VALIDATION_ERROR');
      expect(ErrorType.API).toBe('API_ERROR');
      expect(ErrorType.NETWORK).toBe('NETWORK_ERROR');
      expect(ErrorType.AUTH).toBe('AUTH_ERROR');
      expect(ErrorType.CONFIG).toBe('CONFIG_ERROR');
      expect(ErrorType.FILE).toBe('FILE_ERROR');
      expect(ErrorType.RATE_LIMIT).toBe('RATE_LIMIT_ERROR');
      expect(ErrorType.UNKNOWN).toBe('UNKNOWN_ERROR');
    });
  });

  describe('AppError', () => {
    test('creates error with message and type', () => {
      const error = new AppError('Test error', ErrorType.VALIDATION);
      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.name).toBe('AppError');
      expect(error.timestamp).toBeDefined();
    });

    test('includes context and cause', () => {
      const cause = new Error('Original error');
      const context = { userId: 123 };
      const error = new AppError('Test error', ErrorType.API, context, cause);
      
      expect(error.context).toEqual(context);
      expect(error.cause).toBe(cause);
    });

    test('defaults to UNKNOWN type', () => {
      const error = new AppError('Test error');
      expect(error.type).toBe(ErrorType.UNKNOWN);
    });

    test('toJSON returns sanitized error object', () => {
      const error = new AppError('Test error', ErrorType.VALIDATION, { test: true });
      const json = error.toJSON();
      
      expect(json.name).toBe('AppError');
      expect(json.type).toBe(ErrorType.VALIDATION);
      expect(json.message).toBe('Test error');
      expect(json.context).toEqual({ test: true });
      expect(json.timestamp).toBeDefined();
      expect(json.stack).toBeDefined();
    });
  });

  describe('categorizeError', () => {
    test('identifies rate limit errors by status code', () => {
      const error = new Error('Too many requests');
      error.status = 429;
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.RATE_LIMIT);
    });

    test('identifies rate limit errors by code', () => {
      const error = new Error('Rate limit');
      error.code = 'rate_limit_exceeded';
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.RATE_LIMIT);
    });

    test('identifies rate limit errors by message', () => {
      const error = new Error('Rate limit exceeded');
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.RATE_LIMIT);
    });

    test('identifies auth errors by status code', () => {
      const error401 = new Error('Unauthorized');
      error401.status = 401;
      expect(errorHandler.categorizeError(error401)).toBe(ErrorType.AUTH);

      const error403 = new Error('Forbidden');
      error403.status = 403;
      expect(errorHandler.categorizeError(error403)).toBe(ErrorType.AUTH);
    });

    test('identifies auth errors by message', () => {
      const error = new Error('unauthorized access');
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.AUTH);
    });

    test('identifies network errors by code', () => {
      const codes = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'EAI_AGAIN'];
      codes.forEach(code => {
        const error = new Error('Network error');
        error.code = code;
        expect(errorHandler.categorizeError(error)).toBe(ErrorType.NETWORK);
      });
    });

    test('identifies file errors by code', () => {
      const codes = ['ENOENT', 'EACCES', 'EISDIR'];
      codes.forEach(code => {
        const error = new Error('File error');
        error.code = code;
        expect(errorHandler.categorizeError(error)).toBe(ErrorType.FILE);
      });
    });

    test('identifies API errors by status code', () => {
      const error = new Error('API error');
      error.status = 500;
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.API);
    });

    test('identifies validation errors by name', () => {
      const error = new Error('Invalid input');
      error.name = 'ValidationError';
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.VALIDATION);
    });

    test('identifies validation errors by message', () => {
      const error = new Error('Invalid email format');
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.VALIDATION);
    });

    test('returns UNKNOWN for unrecognized errors', () => {
      const error = new Error('Something went wrong');
      expect(errorHandler.categorizeError(error)).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('getUserMessage', () => {
    test('returns user-friendly message for each error type', () => {
      const types = Object.values(ErrorType);
      types.forEach(type => {
        const error = new Error('Test');
        const message = errorHandler.getUserMessage(error, type);
        expect(message).toBeDefined();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });

    test('auto-detects error type when not provided', () => {
      const error = new Error('Rate limit exceeded');
      error.status = 429;
      const message = errorHandler.getUserMessage(error);
      expect(message).toContain('Too many requests');
    });

    test('returns default message for unknown types', () => {
      const error = new Error('Unknown error');
      const message = errorHandler.getUserMessage(error, 'INVALID_TYPE');
      expect(message).toContain('unexpected error');
    });
  });

  describe('getTroubleshootingTips', () => {
    test('returns tips array for each error type', () => {
      const types = Object.values(ErrorType);
      types.forEach(type => {
        const error = new Error('Test');
        const tips = errorHandler.getTroubleshootingTips(error, type);
        expect(Array.isArray(tips)).toBe(true);
        expect(tips.length).toBeGreaterThan(0);
        tips.forEach(tip => {
          expect(typeof tip).toBe('string');
        });
      });
    });

    test('returns validation tips for validation errors', () => {
      const error = new Error('Invalid input');
      const tips = errorHandler.getTroubleshootingTips(error, ErrorType.VALIDATION);
      expect(tips.some(tip => tip.includes('required fields'))).toBe(true);
    });

    test('returns network tips for network errors', () => {
      const error = new Error('Network error');
      error.code = 'ECONNREFUSED';
      const tips = errorHandler.getTroubleshootingTips(error);
      expect(tips.some(tip => tip.includes('internet connection'))).toBe(true);
    });

    test('returns auth tips for auth errors', () => {
      const error = new Error('Unauthorized');
      error.status = 401;
      const tips = errorHandler.getTroubleshootingTips(error);
      expect(tips.some(tip => tip.includes('API keys') || tip.includes('credentials'))).toBe(true);
    });
  });

  describe('withErrorHandling', () => {
    test('wraps function and returns result on success', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrapped = errorHandler.withErrorHandling(fn);
      
      const result = await wrapped('arg1', 'arg2');
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('catches and wraps errors', async () => {
      const originalError = new Error('Original error');
      const fn = jest.fn().mockRejectedValue(originalError);
      const wrapped = errorHandler.withErrorHandling(fn);
      
      await expect(wrapped()).rejects.toThrow(AppError);
    });

    test('calls onError callback when provided', async () => {
      const originalError = new Error('Original error');
      const fn = jest.fn().mockRejectedValue(originalError);
      const onError = jest.fn();
      const wrapped = errorHandler.withErrorHandling(fn, { onError });
      
      try {
        await wrapped();
      } catch {
        // Expected to throw
      }
      
      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toBeInstanceOf(AppError);
    });

    test('includes context in wrapped error', async () => {
      const originalError = new Error('Original error');
      const fn = jest.fn().mockRejectedValue(originalError);
      const wrapped = errorHandler.withErrorHandling(fn, { context: 'test-module' });
      
      try {
        await wrapped('arg1');
      } catch (error) {
        expect(error.context.context).toBe('test-module');
        expect(error.context.args).toBe(1);
        expect(error.cause).toBe(originalError);
      }
    });
  });

  describe('assert', () => {
    test('does nothing when condition is true', () => {
      expect(() => {
        errorHandler.assert(true, 'Should not throw');
      }).not.toThrow();
    });

    test('throws AppError when condition is false', () => {
      expect(() => {
        errorHandler.assert(false, 'Condition failed');
      }).toThrow(AppError);
    });

    test('uses specified error type', () => {
      try {
        errorHandler.assert(false, 'Config error', ErrorType.CONFIG);
      } catch (error) {
        expect(error.type).toBe(ErrorType.CONFIG);
      }
    });

    test('defaults to VALIDATION type', () => {
      try {
        errorHandler.assert(false, 'Validation error');
      } catch (error) {
        expect(error.type).toBe(ErrorType.VALIDATION);
      }
    });
  });

  describe('tryOrDefault', () => {
    test('returns function result on success', () => {
      const fn = () => 'success';
      const result = errorHandler.tryOrDefault(fn, 'default');
      expect(result).toBe('success');
    });

    test('returns default value on error', () => {
      const fn = () => { throw new Error('Failed'); };
      const result = errorHandler.tryOrDefault(fn, 'default');
      expect(result).toBe('default');
    });

    test('handles async functions', async () => {
      const fn = async () => 'async success';
      const result = await errorHandler.tryOrDefault(fn, 'default');
      expect(result).toBe('async success');
    });

    test('returns default for rejected promises', async () => {
      const fn = async () => { throw new Error('Failed'); };
      const result = await errorHandler.tryOrDefault(fn, 'default');
      expect(result).toBe('default');
    });

    test('works with complex default values', () => {
      const fn = () => { throw new Error('Failed'); };
      const defaultValue = { value: 42, nested: { key: 'test' } };
      const result = errorHandler.tryOrDefault(fn, defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });

  describe('logError', () => {
    let consoleErrorSpy;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    test('logs error with module name', () => {
      const error = new Error('Test error');
      errorHandler.logError('TestModule', error);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const firstCall = consoleErrorSpy.mock.calls[0][0];
      expect(firstCall).toContain('TestModule');
      expect(firstCall).toContain('Test error');
    });

    test('logs error type', () => {
      const error = new Error('Test error');
      error.status = 429;
      errorHandler.logError('TestModule', error);
      
      const typeLine = consoleErrorSpy.mock.calls.find(call => 
        call[0].includes('Type:')
      );
      expect(typeLine).toBeDefined();
      expect(typeLine[0]).toContain('RATE_LIMIT');
    });

    test('shows troubleshooting tips by default', () => {
      const error = new Error('Test error');
      errorHandler.logError('TestModule', error);
      
      const tipsHeader = consoleErrorSpy.mock.calls.find(call => 
        call[0].includes('Troubleshooting')
      );
      expect(tipsHeader).toBeDefined();
    });

    test('hides tips when showTips is false', () => {
      const error = new Error('Test error');
      errorHandler.logError('TestModule', error, { showTips: false });
      
      const tipsHeader = consoleErrorSpy.mock.calls.find(call => 
        call[0] && call[0].includes && call[0].includes('Troubleshooting')
      );
      expect(tipsHeader).toBeUndefined();
    });
  });
});
