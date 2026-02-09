/**
 * Performance Metrics Utility
 * Track and monitor performance of critical operations
 * "Know thy journey's speed" - Measure to improve
 */

/**
 * @typedef {Object} Metric
 * @property {string} name - Metric name
 * @property {number} value - Metric value
 * @property {string} unit - Unit of measurement
 * @property {number} timestamp - When recorded
 */

/**
 * Storage for metrics
 * @type {Map<string, Metric[]>}
 */
const metricsStore = new Map();

/**
 * Active timers
 * @type {Map<string, number>}
 */
const activeTimers = new Map();

/**
 * Start a timer for an operation
 * @param {string} name - Timer name
 * @returns {string} - Timer ID
 */
function startTimer(name) {
  const timerId = `${name}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  activeTimers.set(timerId, process.hrtime.bigint());
  return timerId;
}

/**
 * Stop a timer and record the duration
 * @param {string} timerId - Timer ID from startTimer
 * @returns {number} - Duration in milliseconds
 */
function stopTimer(timerId) {
  const startTime = activeTimers.get(timerId);
  if (!startTime) {
    console.warn(`Timer ${timerId} not found`);
    return 0;
  }
  
  const endTime = process.hrtime.bigint();
  const durationNs = Number(endTime - startTime);
  const durationMs = durationNs / 1_000_000;
  
  // Extract metric name from timer ID
  const name = timerId.split(':')[0];
  
  // Record the metric
  recordMetric(name, durationMs, 'ms');
  
  // Clean up
  activeTimers.delete(timerId);
  
  return durationMs;
}

/**
 * Record a metric value
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {string} [unit=''] - Unit of measurement
 */
function recordMetric(name, value, unit = '') {
  if (!metricsStore.has(name)) {
    metricsStore.set(name, []);
  }
  
  metricsStore.get(name).push({
    name,
    value,
    unit,
    timestamp: Date.now()
  });
  
  // Keep only last 1000 metrics per name
  const metrics = metricsStore.get(name);
  if (metrics.length > 1000) {
    metricsStore.set(name, metrics.slice(-1000));
  }
}

/**
 * Get statistics for a metric
 * @param {string} name - Metric name
 * @returns {Object|null} - Statistics or null if no data
 */
function getStats(name) {
  const metrics = metricsStore.get(name);
  
  if (!metrics || metrics.length === 0) {
    return null;
  }
  
  const values = metrics.map(m => m.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  return {
    name,
    count: values.length,
    unit: metrics[0].unit,
    min: min.toFixed(2),
    max: max.toFixed(2),
    avg: avg.toFixed(2),
    median: median.toFixed(2),
    p95: p95.toFixed(2),
    p99: p99.toFixed(2),
    total: sum.toFixed(2)
  };
}

/**
 * Get all metric statistics
 * @returns {Object[]} - Array of statistics for all metrics
 */
function getAllStats() {
  const stats = [];
  
  for (const name of metricsStore.keys()) {
    const stat = getStats(name);
    if (stat) {
      stats.push(stat);
    }
  }
  
  return stats;
}

/**
 * Clear all metrics
 * @param {string} [name] - Optional metric name to clear (clears all if not provided)
 */
function clearMetrics(name = null) {
  if (name) {
    metricsStore.delete(name);
  } else {
    metricsStore.clear();
  }
}

/**
 * Wrap a function with performance timing
 * @param {Function} fn - Function to wrap
 * @param {string} name - Metric name
 * @returns {Function} - Wrapped function
 */
function withTiming(fn, name) {
  return async function(...args) {
    const timerId = startTimer(name);
    try {
      return await fn.apply(this, args);
    } finally {
      stopTimer(timerId);
    }
  };
}

/**
 * Increment a counter metric
 * @param {string} name - Counter name
 * @param {number} [amount=1] - Amount to increment
 */
function incrementCounter(name, amount = 1) {
  const key = `counter:${name}`;
  const current = metricsStore.get(key);
  
  if (current && current.length > 0) {
    current[current.length - 1].value += amount;
  } else {
    metricsStore.set(key, [{
      name: key,
      value: amount,
      unit: 'count',
      timestamp: Date.now()
    }]);
  }
}

/**
 * Get counter value
 * @param {string} name - Counter name
 * @returns {number} - Counter value
 */
function getCounter(name) {
  const key = `counter:${name}`;
  const metrics = metricsStore.get(key);
  
  if (!metrics || metrics.length === 0) {
    return 0;
  }
  
  return metrics[metrics.length - 1].value;
}

/**
 * Format metrics for display
 * @returns {string} - Formatted metrics string
 */
function formatMetrics() {
  const stats = getAllStats();
  
  if (stats.length === 0) {
    return 'No metrics recorded yet.';
  }
  
  const lines = ['Performance Metrics:', '='.repeat(60)];
  
  stats.forEach(stat => {
    lines.push(`\n${stat.name}:`);
    lines.push(`  Count: ${stat.count}`);
    lines.push(`  Min: ${stat.min}${stat.unit}  Max: ${stat.max}${stat.unit}`);
    lines.push(`  Avg: ${stat.avg}${stat.unit}  Median: ${stat.median}${stat.unit}`);
    lines.push(`  P95: ${stat.p95}${stat.unit}  P99: ${stat.p99}${stat.unit}`);
  });
  
  lines.push(`\n${'='.repeat(60)}`);
  
  return lines.join('\n');
}

module.exports = {
  startTimer,
  stopTimer,
  recordMetric,
  getStats,
  getAllStats,
  clearMetrics,
  withTiming,
  incrementCounter,
  getCounter,
  formatMetrics
};
