/**
 * Configuration Utility
 * Centralized configuration management with caching
 */

let dotenvLoaded = false;

/**
 * Load dotenv configuration (with caching to avoid multiple loads)
 */
function loadEnv() {
  if (dotenvLoaded) {
    return;
  }
  
  try {
    require('dotenv').config();
    dotenvLoaded = true;
  } catch (_e) {
    // dotenv not available, continue without it
  }
}

/**
 * Get environment variable with fallback
 */
function getEnv(key, defaultValue = '') {
  loadEnv();
  return process.env[key] || defaultValue;
}

/**
 * Get environment variable as boolean
 */
function getEnvBool(key, defaultValue = false) {
  loadEnv();
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
}

/**
 * Get environment variable as integer
 */
function getEnvInt(key, defaultValue = 0) {
  loadEnv();
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get environment variable as array (comma-separated)
 */
function getEnvArray(key, defaultValue = []) {
  loadEnv();
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.split(',').map(v => v.trim()).filter(v => v);
}

module.exports = {
  loadEnv,
  getEnv,
  getEnvBool,
  getEnvInt,
  getEnvArray
};
