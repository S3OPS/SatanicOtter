/**
 * Validators Utility
 * Input validation helpers for safer code
 * "Know thy enemy" - Validate inputs to prevent attacks
 */

/**
 * Validate that a value is a non-empty string
 * @param {*} value - The value to check
 * @param {string} [_name='value'] - Name for error messages (unused but kept for API compatibility)
 * @returns {boolean} - True if valid
 */
function isNonEmptyString(value, _name = 'value') {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate that a value is a positive integer
 * @param {*} value - The value to check
 * @returns {boolean} - True if valid
 */
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validate that a value is a non-negative integer
 * @param {*} value - The value to check
 * @returns {boolean} - True if valid
 */
function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Validate that a value is a valid email format
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid
 */
function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validate that a value is a valid URL
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid
 */
function isValidUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate that a value is a valid Amazon affiliate tag format
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid
 */
function isValidAmazonTag(value) {
  if (typeof value !== 'string') return false;
  // Amazon tags are typically alphanumeric with optional dashes, ending in -20 or similar
  const tagRegex = /^[a-zA-Z0-9-]+$/;
  return tagRegex.test(value) && value.length >= 3 && value.length <= 30;
}

/**
 * Validate that a value is a valid time string (HH:MM format)
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid
 */
function isValidTimeString(value) {
  if (typeof value !== 'string') return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(value);
}

/**
 * Validate that a value is a valid timezone
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid
 */
function isValidTimezone(value) {
  if (typeof value !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate that a value is one of allowed values
 * @param {*} value - The value to check
 * @param {Array} allowedValues - Array of allowed values
 * @returns {boolean} - True if valid
 */
function isOneOf(value, allowedValues) {
  return Array.isArray(allowedValues) && allowedValues.includes(value);
}

/**
 * Validate that a value is within a range
 * @param {number} value - The value to check
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} - True if valid
 */
function isInRange(value, min, max) {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
}

/**
 * Validate that a value is a valid ISO date string
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid
 */
function isValidISODate(value) {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes('-');
}

/**
 * Validate that an object has all required keys
 * @param {Object} obj - The object to check
 * @param {string[]} requiredKeys - Array of required key names
 * @returns {Object} - { valid: boolean, missingKeys: string[] }
 */
function hasRequiredKeys(obj, requiredKeys) {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missingKeys: requiredKeys };
  }
  
  const missingKeys = requiredKeys.filter(key => !(key in obj));
  return {
    valid: missingKeys.length === 0,
    missingKeys
  };
}

/**
 * Validate that a value is not a placeholder value
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid (not a placeholder)
 */
function isNotPlaceholder(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  
  const placeholderPatterns = [
    /your_/i,
    /your-/i,
    /<.*>/,
    /example/i,
    /todo/i,
    /changeme/i,
    /replace_me/i,
    /^\[.*\]$/,
    /^undefined$/,
    /^null$/
  ];
  
  return !placeholderPatterns.some(pattern => pattern.test(value));
}

/**
 * Validate environment configuration
 * @param {Object} env - Environment variables object (process.env)
 * @param {Object} schema - Validation schema
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateEnvConfig(env, schema) {
  const errors = [];
  
  for (const [key, config] of Object.entries(schema)) {
    const value = env[key];
    
    // Check required
    if (config.required && (!value || !isNotPlaceholder(value))) {
      errors.push(`${key}: Required but not configured`);
      continue;
    }
    
    // Skip validation if not set and not required
    if (!value) continue;
    
    // Type validation
    if (config.type === 'email' && !isValidEmail(value)) {
      errors.push(`${key}: Invalid email format`);
    } else if (config.type === 'url' && !isValidUrl(value)) {
      errors.push(`${key}: Invalid URL format`);
    } else if (config.type === 'amazonTag' && !isValidAmazonTag(value)) {
      errors.push(`${key}: Invalid Amazon affiliate tag format`);
    } else if (config.type === 'time' && !isValidTimeString(value)) {
      errors.push(`${key}: Invalid time format (use HH:MM)`);
    } else if (config.type === 'timezone' && !isValidTimezone(value)) {
      errors.push(`${key}: Invalid timezone`);
    } else if (config.type === 'boolean' && !['true', 'false'].includes(value)) {
      errors.push(`${key}: Must be 'true' or 'false'`);
    } else if (config.type === 'integer') {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        errors.push(`${key}: Must be an integer`);
      } else if (config.min !== undefined && num < config.min) {
        errors.push(`${key}: Must be at least ${config.min}`);
      } else if (config.max !== undefined && num > config.max) {
        errors.push(`${key}: Must be at most ${config.max}`);
      }
    }
    
    // Enum validation
    if (config.enum && !config.enum.includes(value)) {
      errors.push(`${key}: Must be one of: ${config.enum.join(', ')}`);
    }
    
    // Custom validator
    if (config.validate && typeof config.validate === 'function') {
      const customError = config.validate(value);
      if (customError) {
        errors.push(`${key}: ${customError}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create a validation result object
 * @param {boolean} valid - Whether validation passed
 * @param {string[]} [errors=[]] - Array of error messages
 * @returns {Object} - Validation result
 */
function validationResult(valid, errors = []) {
  return {
    valid,
    errors,
    hasErrors: () => errors.length > 0,
    getFirstError: () => errors[0] || null
  };
}

module.exports = {
  isNonEmptyString,
  isPositiveInteger,
  isNonNegativeInteger,
  isValidEmail,
  isValidUrl,
  isValidAmazonTag,
  isValidTimeString,
  isValidTimezone,
  isOneOf,
  isInRange,
  isValidISODate,
  hasRequiredKeys,
  isNotPlaceholder,
  validateEnvConfig,
  validationResult
};
