/**
 * Input Validation and Security Utilities
 * Helps prevent security vulnerabilities
 */

const path = require('path');

/**
 * Validate and sanitize file paths to prevent path traversal attacks
 */
function validateFilePath(filepath, allowedDir = null) {
  if (!filepath || typeof filepath !== 'string') {
    throw new Error('Invalid file path');
  }
  
  // Resolve to absolute path
  const resolved = path.resolve(filepath);
  
  // If allowedDir specified, ensure file is within that directory
  if (allowedDir) {
    const allowedResolved = path.resolve(allowedDir);
    const relative = path.relative(allowedResolved, resolved);
    
    // Check if the relative path escapes the allowed directory
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error('Path traversal attempt detected');
    }
  }
  
  return resolved;
}

/**
 * Sanitize user input for display (prevent XSS in logs/output)
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[\r\n]/g, '') // Remove newlines
    .trim();
}

/**
 * Validate environment variable name
 */
function isValidEnvVarName(name) {
  return /^[A-Z_][A-Z0-9_]*$/.test(name);
}

/**
 * Redact sensitive data from logs
 */
function redactSensitive(text) {
  if (typeof text !== 'string') {
    return text;
  }
  
  // Redact API keys, tokens, passwords
  return text
    .replace(/([a-zA-Z0-9_-]+_)?[Aa]pi[_-]?[Kk]ey[:\s=]+([^\s,;]+)/g, '$1api_key=***REDACTED***')
    .replace(/([a-zA-Z0-9_-]+_)?[Tt]oken[:\s=]+([^\s,;]+)/g, '$1token=***REDACTED***')
    .replace(/([a-zA-Z0-9_-]+_)?[Pp]assword[:\s=]+([^\s,;]+)/g, '$1password=***REDACTED***')
    .replace(/([a-zA-Z0-9_-]+_)?[Ss]ecret[:\s=]+([^\s,;]+)/g, '$1secret=***REDACTED***')
    .replace(/sk-[a-zA-Z0-9]{20,}/g, 'sk-***REDACTED***'); // OpenAI API keys
}

/**
 * Check if a string looks like it might contain sensitive data
 */
function containsSensitiveData(text) {
  if (typeof text !== 'string') {
    return false;
  }
  
  const sensitivePatterns = [
    /api[_-]?key/i,
    /token/i,
    /password/i,
    /secret/i,
    /sk-[a-zA-Z0-9]{20,}/, // OpenAI API keys
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ // Email addresses
  ];
  
  return sensitivePatterns.some(pattern => pattern.test(text));
}

module.exports = {
  validateFilePath,
  sanitizeInput,
  isValidEnvVarName,
  redactSensitive,
  containsSensitiveData
};
