/**
 * Formatters Utility
 * Data formatting helpers for consistent output
 * "Present thy findings with clarity" - Format data for display
 */

/**
 * Format a number as currency (USD)
 * @param {number} value - The number to format
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value, currency = 'USD') {
  if (typeof value !== 'number' || isNaN(value)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
}

/**
 * Format a number with commas
 * @param {number} value - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a percentage
 * @param {number} value - The value (0-100 or 0-1)
 * @param {number} [decimals=1] - Number of decimal places
 * @param {boolean} [normalize=true] - If true, values > 1 are treated as whole percentages
 * @returns {string} - Formatted percentage string
 */
function formatPercentage(value, decimals = 1, normalize = true) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  // Normalize: if value is between 0-1, multiply by 100
  const percentage = normalize && Math.abs(value) <= 1 ? value * 100 : value;
  
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format a date
 * @param {Date|string|number} date - The date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
function formatDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
}

/**
 * Format a datetime
 * @param {Date|string|number} date - The date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} - Formatted datetime string
 */
function formatDateTime(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
}

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - The date to format
 * @returns {string} - Relative time string
 */
function formatRelativeTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(d);
  }
}

/**
 * Format duration in milliseconds to human readable
 * @param {number} ms - Duration in milliseconds
 * @returns {string} - Human readable duration
 */
function formatDuration(ms) {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) {
    return '0s';
  }
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${ms}ms`;
  }
}

/**
 * Truncate a string to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=100] - Maximum length
 * @param {string} [suffix='...'] - Suffix to add when truncated
 * @returns {string} - Truncated string
 */
function truncate(text, maxLength = 100, suffix = '...') {
  if (typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Human readable size
 */
function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    return '0 B';
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format a JSON object for display
 * @param {Object} obj - The object to format
 * @param {number} [indent=2] - Indentation spaces
 * @returns {string} - Formatted JSON string
 */
function formatJSON(obj, indent = 2) {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return '[Unable to format]';
  }
}

/**
 * Format a list as a bulleted string
 * @param {string[]} items - Array of items
 * @param {string} [bullet='•'] - Bullet character
 * @returns {string} - Formatted list string
 */
function formatList(items, bullet = '•') {
  if (!Array.isArray(items)) {
    return '';
  }
  
  return items.map(item => `${bullet} ${item}`).join('\n');
}

/**
 * Pad a string to a fixed width
 * @param {string} text - The text to pad
 * @param {number} width - Target width
 * @param {string} [padChar=' '] - Character to pad with
 * @param {string} [align='left'] - Alignment: 'left', 'right', or 'center'
 * @returns {string} - Padded string
 */
function pad(text, width, padChar = ' ', align = 'left') {
  const str = String(text);
  const padLength = Math.max(0, width - str.length);
  
  if (align === 'left') {
    return str + padChar.repeat(padLength);
  } else if (align === 'right') {
    return padChar.repeat(padLength) + str;
  } else {
    const leftPad = Math.floor(padLength / 2);
    const rightPad = padLength - leftPad;
    return padChar.repeat(leftPad) + str + padChar.repeat(rightPad);
  }
}

/**
 * Format a table from an array of objects
 * @param {Object[]} data - Array of objects
 * @param {string[]} [columns] - Column names (defaults to all keys)
 * @returns {string} - Formatted table string
 */
function formatTable(data, columns = null) {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  const cols = columns || Object.keys(data[0]);
  const widths = {};
  
  // Calculate column widths
  cols.forEach(col => {
    widths[col] = Math.max(
      col.length,
      ...data.map(row => String(row[col] ?? '').length)
    );
  });
  
  // Build header
  const header = cols.map(col => pad(col, widths[col])).join(' | ');
  const separator = cols.map(col => '-'.repeat(widths[col])).join('-+-');
  
  // Build rows
  const rows = data.map(row => 
    cols.map(col => pad(String(row[col] ?? ''), widths[col])).join(' | ')
  );
  
  return [header, separator, ...rows].join('\n');
}

/**
 * Capitalize first letter of string
 * @param {string} text - The text to capitalize
 * @returns {string} - Capitalized string
 */
function capitalize(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return '';
  }
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} text - The text to convert
 * @returns {string} - Title case string
 */
function titleCase(text) {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

module.exports = {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  truncate,
  formatFileSize,
  formatJSON,
  formatList,
  pad,
  formatTable,
  capitalize,
  titleCase
};
