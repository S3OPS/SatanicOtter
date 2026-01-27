/**
 * Logging Utility
 * Standardized logging across modules
 */

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
 * Log with level
 */
function log(level, module, message, data = null) {
  const prefix = {
    ERROR: '❌',
    WARN: '⚠️ ',
    INFO: '✅',
    DEBUG: '🔍'
  }[level] || 'ℹ️ ';
  
  const msg = `${prefix} [${module}] ${message}`;
  
  if (level === LogLevel.ERROR) {
    console.error(msg);
  } else if (level === LogLevel.WARN) {
    console.warn(msg);
  } else {
    console.log(msg);
  }
  
  if (data) {
    console.log(data);
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
  log(LogLevel.DEBUG, message, data);
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
