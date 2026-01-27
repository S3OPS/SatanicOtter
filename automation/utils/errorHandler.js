/**
 * Error Handler Utility
 * Centralized error handling with standardized patterns
 * "When you fall, know how to land" - Handle errors gracefully
 */

const { redactSensitive } = require('./security');

/**
 * Error types for categorization
 */
const ErrorType = {
  VALIDATION: 'VALIDATION_ERROR',
  API: 'API_ERROR',
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  CONFIG: 'CONFIG_ERROR',
  FILE: 'FILE_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Custom error class with additional context
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {string} type - Error type from ErrorType
   * @param {Object} [context] - Additional context
   * @param {Error} [cause] - Original error that caused this
   */
  constructor(message, type = ErrorType.UNKNOWN, context = {}, cause = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.context = context;
    this.cause = cause;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  
  /**
   * Convert to JSON for logging/serialization
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: redactSensitive(this.message),
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Categorize an error by type
 * @param {Error} error - The error to categorize
 * @returns {string} - The error type
 */
function categorizeError(error) {
  // Rate limit errors
  if (error.status === 429 || 
      error.code === 'rate_limit_exceeded' ||
      (error.message && error.message.toLowerCase().includes('rate limit'))) {
    return ErrorType.RATE_LIMIT;
  }
  
  // Authentication errors
  if (error.status === 401 || 
      error.status === 403 ||
      error.code === 'unauthorized' ||
      (error.message && error.message.toLowerCase().includes('unauthorized'))) {
    return ErrorType.AUTH;
  }
  
  // Network errors
  if (error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'EAI_AGAIN') {
    return ErrorType.NETWORK;
  }
  
  // File system errors
  if (error.code === 'ENOENT' ||
      error.code === 'EACCES' ||
      error.code === 'EISDIR') {
    return ErrorType.FILE;
  }
  
  // API errors
  if (error.status >= 400 || error.response) {
    return ErrorType.API;
  }
  
  // Validation errors
  if (error.name === 'ValidationError' ||
      (error.message && error.message.toLowerCase().includes('invalid'))) {
    return ErrorType.VALIDATION;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Create a user-friendly error message
 * @param {Error} error - The error
 * @param {string} [type] - Error type (auto-detected if not provided)
 * @returns {string} - User-friendly message
 */
function getUserMessage(error, type = null) {
  const errorType = type || categorizeError(error);
  
  const messages = {
    [ErrorType.VALIDATION]: 'Invalid input provided. Please check your data.',
    [ErrorType.API]: 'Service temporarily unavailable. Please try again later.',
    [ErrorType.NETWORK]: 'Network connection issue. Check your internet connection.',
    [ErrorType.AUTH]: 'Authentication failed. Please check your credentials.',
    [ErrorType.CONFIG]: 'Configuration error. Please check your settings.',
    [ErrorType.FILE]: 'File operation failed. Check file permissions and path.',
    [ErrorType.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
    [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
  };
  
  return messages[errorType] || messages[ErrorType.UNKNOWN];
}

/**
 * Get troubleshooting tips for an error
 * @param {Error} error - The error
 * @param {string} [type] - Error type (auto-detected if not provided)
 * @returns {string[]} - Array of troubleshooting tips
 */
function getTroubleshootingTips(error, type = null) {
  const errorType = type || categorizeError(error);
  
  const tips = {
    [ErrorType.VALIDATION]: [
      'Check that all required fields are provided',
      'Verify data formats match expected patterns',
      'Review the input validation rules'
    ],
    [ErrorType.API]: [
      'Check if the API service is running',
      'Verify your API key is valid',
      'Review API documentation for changes'
    ],
    [ErrorType.NETWORK]: [
      'Check your internet connection',
      'Verify firewall settings allow the connection',
      'Try again in a few minutes'
    ],
    [ErrorType.AUTH]: [
      'Verify API keys in .env file are correct',
      'Check if credentials have expired',
      'Ensure account has required permissions'
    ],
    [ErrorType.CONFIG]: [
      'Review .env.example for required variables',
      'Ensure .env file exists and is readable',
      'Check for typos in configuration values'
    ],
    [ErrorType.FILE]: [
      'Check if the file/directory exists',
      'Verify read/write permissions',
      'Ensure the path is correct'
    ],
    [ErrorType.RATE_LIMIT]: [
      'Wait a few minutes before retrying',
      'Consider implementing request batching',
      'Check your API quota and limits'
    ],
    [ErrorType.UNKNOWN]: [
      'Check the logs for more details',
      'Try running with debug mode enabled',
      'Report the issue if it persists'
    ]
  };
  
  return tips[errorType] || tips[ErrorType.UNKNOWN];
}

/**
 * Wrap an async function with error handling
 * @param {Function} fn - The async function to wrap
 * @param {Object} [options] - Options
 * @param {string} [options.context] - Context for error messages
 * @param {Function} [options.onError] - Error callback
 * @returns {Function} - The wrapped function
 */
function withErrorHandling(fn, options = {}) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      const type = categorizeError(error);
      const wrappedError = new AppError(
        error.message,
        type,
        { context: options.context, args: args.length },
        error
      );
      
      if (options.onError) {
        options.onError(wrappedError);
      }
      
      throw wrappedError;
    }
  };
}

/**
 * Log an error with standardized format
 * @param {string} module - Module name
 * @param {Error} error - The error
 * @param {Object} [options] - Options
 * @param {boolean} [options.showStack] - Show stack trace
 * @param {boolean} [options.showTips] - Show troubleshooting tips
 */
function logError(module, error, options = {}) {
  const { showStack = false, showTips = true } = options;
  const type = categorizeError(error);
  
  console.error(`\n❌ [${module}] ${error.message}`);
  console.error(`   Type: ${type}`);
  
  if (error.context) {
    console.error(`   Context: ${JSON.stringify(error.context)}`);
  }
  
  if (showStack && error.stack) {
    console.error(`   Stack: ${error.stack.split('\n').slice(1, 4).join('\n')}`);
  }
  
  if (showTips) {
    const tips = getTroubleshootingTips(error, type);
    console.error('\n💡 Troubleshooting:');
    tips.forEach(tip => console.error(`   • ${tip}`));
  }
  
  console.error('');
}

/**
 * Assert a condition and throw if false
 * @param {boolean} condition - The condition to check
 * @param {string} message - Error message if condition is false
 * @param {string} [type] - Error type
 * @throws {AppError} If condition is false
 */
function assert(condition, message, type = ErrorType.VALIDATION) {
  if (!condition) {
    throw new AppError(message, type);
  }
}

/**
 * Try to execute a function, returning a default value on error
 * @param {Function} fn - The function to execute
 * @param {*} defaultValue - Value to return on error
 * @returns {*} - Result or default value
 */
function tryOrDefault(fn, defaultValue) {
  try {
    const result = fn();
    // Handle async functions
    if (result && typeof result.then === 'function') {
      return result.catch(() => defaultValue);
    }
    return result;
  } catch {
    return defaultValue;
  }
}

module.exports = {
  ErrorType,
  AppError,
  categorizeError,
  getUserMessage,
  getTroubleshootingTips,
  withErrorHandling,
  logError,
  assert,
  tryOrDefault
};
