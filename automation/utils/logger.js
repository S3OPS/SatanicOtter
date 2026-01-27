/**
 * Logging Utility
 * Standardized logging across modules with security
 */

const { redactSensitive } = require('./security');

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format timestamp
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Log with level (with automatic redaction of sensitive data)
 */
function log(level, module, message, data = null) {
  const prefix = {
    ERROR: '❌',
    WARN: '⚠️ ',
    INFO: '✅',
    DEBUG: '🔍'
  }[level] || 'ℹ️ ';
  
  // Redact sensitive data from message
  const safeMessage = redactSensitive(message);
  const msg = `${prefix} [${module}] ${safeMessage}`;
  
  if (level === LogLevel.ERROR) {
    console.error(msg);
  } else if (level === LogLevel.WARN) {
    console.warn(msg);
  } else {
    console.log(msg);
  }
  
  if (data) {
    // Redact sensitive data if data is a string
    const safeData = typeof data === 'string' ? redactSensitive(data) : data;
    console.log(safeData);
  }
}

/**
 * Convenience methods
 */
function error(module, message, data) {
  log(LogLevel.ERROR, module, message, data);
}

function warn(module, message, data) {
  log(LogLevel.WARN, module, message, data);
}

function info(module, message, data) {
  log(LogLevel.INFO, module, message, data);
}

function debug(module, message, data) {
  log(LogLevel.DEBUG, module, message, data);
}

/**
 * Log section header
 */
function section(title, width = 60) {
  console.log('\n' + '='.repeat(width));
  console.log(title);
  console.log('='.repeat(width) + '\n');
}

module.exports = {
  LogLevel,
  log,
  error,
  warn,
  info,
  debug,
  section
};
