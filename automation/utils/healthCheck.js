/**
 * Health Check Utility
 * System health monitoring and diagnostics
 * "Check the Fellowship's readiness" - Ensure all components are operational
 */

const fs = require('fs').promises;
const path = require('path');
const { getStats } = require('./metrics');

/**
 * Health status enum
 */
const HealthStatus = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
  UNKNOWN: 'unknown'
};

/**
 * Check if a file or directory exists
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>}
 */
async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a module can be loaded
 * @param {string} modulePath - Path to module
 * @returns {Promise<Object>}
 */
async function checkModule(modulePath) {
  try {
    const fullPath = require.resolve(modulePath);
    require(modulePath);
    return {
      status: HealthStatus.HEALTHY,
      path: fullPath,
      message: 'Module loaded successfully'
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      path: modulePath,
      message: error.message
    };
  }
}

/**
 * Check environment variable
 * @param {string} name - Variable name
 * @param {boolean} [required=false] - Whether it's required
 * @returns {Object}
 */
function checkEnvVar(name, required = false) {
  const value = process.env[name];
  const isSet = value && value.trim() !== '';
  const isPlaceholder = value && /your_|your-|<.*>|example/i.test(value);
  
  if (!isSet) {
    return {
      status: required ? HealthStatus.UNHEALTHY : HealthStatus.DEGRADED,
      name,
      message: required ? 'Required variable not set' : 'Optional variable not set'
    };
  }
  
  if (isPlaceholder) {
    return {
      status: required ? HealthStatus.UNHEALTHY : HealthStatus.DEGRADED,
      name,
      message: 'Variable contains placeholder value'
    };
  }
  
  return {
    status: HealthStatus.HEALTHY,
    name,
    message: 'Variable configured'
  };
}

/**
 * Check directory writability
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>}
 */
async function checkDirectory(dirPath) {
  try {
    // Create directory if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });
    
    // Try to write a test file
    const testFile = path.join(dirPath, '.health-check-test');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    
    return {
      status: HealthStatus.HEALTHY,
      path: dirPath,
      message: 'Directory writable'
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      path: dirPath,
      message: `Directory not writable: ${error.message}`
    };
  }
}

/**
 * Check API connectivity (basic check)
 * @param {string} name - API name
 * @param {Function} testFn - Test function that returns true/false or throws
 * @returns {Promise<Object>}
 */
async function checkAPI(name, testFn) {
  try {
    const result = await testFn();
    return {
      status: result ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
      name,
      message: result ? 'API responsive' : 'API check failed'
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      name,
      message: `API error: ${error.message}`
    };
  }
}

/**
 * Run full health check
 * @returns {Promise<Object>}
 */
async function runHealthCheck() {
  const startTime = Date.now();
  const checks = {
    modules: [],
    environment: [],
    directories: [],
    performance: []
  };
  
  // Check core modules
  const coreModules = [
    '../index.js',
    '../contentGenerator.js',
    '../scheduler.js',
    '../productResearch.js',
    '../analyticsTracker.js'
  ];
  
  for (const mod of coreModules) {
    try {
      checks.modules.push(await checkModule(mod));
    } catch (error) {
      checks.modules.push({
        status: HealthStatus.UNHEALTHY,
        path: mod,
        message: error.message
      });
    }
  }
  
  // Check environment variables
  const envVars = [
    { name: 'OPENAI_API_KEY', required: false },
    { name: 'AMAZON_AFFILIATE_TAG', required: true },
    { name: 'TIKTOK_USERNAME', required: false },
    { name: 'TIKTOK_SESSION_ID', required: false }
  ];
  
  for (const { name, required } of envVars) {
    checks.environment.push(checkEnvVar(name, required));
  }
  
  // Check directories
  const directories = [
    path.join(__dirname, '../../generated-content'),
    path.join(__dirname, '../../review-queue'),
    path.join(__dirname, '../../logs'),
    path.join(__dirname, '../../analytics')
  ];
  
  for (const dir of directories) {
    checks.directories.push(await checkDirectory(dir));
  }
  
  // Check performance metrics
  const perfMetrics = ['contentGeneration', 'apiCalls', 'fileOperations'];
  for (const metric of perfMetrics) {
    const stats = getStats(metric);
    if (stats) {
      checks.performance.push({
        status: parseFloat(stats.p99) > 5000 ? HealthStatus.DEGRADED : HealthStatus.HEALTHY,
        name: metric,
        message: `P99: ${stats.p99}${stats.unit}`
      });
    }
  }
  
  // Calculate overall status
  const allChecks = [
    ...checks.modules,
    ...checks.environment,
    ...checks.directories,
    ...checks.performance
  ];
  
  const unhealthyCount = allChecks.filter(c => c.status === HealthStatus.UNHEALTHY).length;
  const degradedCount = allChecks.filter(c => c.status === HealthStatus.DEGRADED).length;
  
  let overallStatus;
  if (unhealthyCount > 0) {
    overallStatus = HealthStatus.UNHEALTHY;
  } else if (degradedCount > allChecks.length * 0.3) {
    overallStatus = HealthStatus.DEGRADED;
  } else {
    overallStatus = HealthStatus.HEALTHY;
  }
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
    checks,
    summary: {
      total: allChecks.length,
      healthy: allChecks.filter(c => c.status === HealthStatus.HEALTHY).length,
      degraded: degradedCount,
      unhealthy: unhealthyCount
    }
  };
}

/**
 * Format health check results for display
 * @param {Object} results - Health check results
 * @returns {string}
 */
function formatHealthCheck(results) {
  const lines = [];
  const statusEmoji = {
    [HealthStatus.HEALTHY]: '✅',
    [HealthStatus.DEGRADED]: '⚠️',
    [HealthStatus.UNHEALTHY]: '❌',
    [HealthStatus.UNKNOWN]: '❓'
  };
  
  lines.push('='.repeat(60));
  lines.push(`System Health Check - ${statusEmoji[results.status]} ${results.status.toUpperCase()}`);
  lines.push('='.repeat(60));
  lines.push(`Timestamp: ${results.timestamp}`);
  lines.push(`Duration: ${results.duration}ms`);
  lines.push(`Summary: ${results.summary.healthy}/${results.summary.total} healthy`);
  
  if (results.checks.modules.length > 0) {
    lines.push('\n📦 Modules:');
    results.checks.modules.forEach(check => {
      lines.push(`  ${statusEmoji[check.status]} ${path.basename(check.path)}: ${check.message}`);
    });
  }
  
  if (results.checks.environment.length > 0) {
    lines.push('\n🔐 Environment:');
    results.checks.environment.forEach(check => {
      lines.push(`  ${statusEmoji[check.status]} ${check.name}: ${check.message}`);
    });
  }
  
  if (results.checks.directories.length > 0) {
    lines.push('\n📁 Directories:');
    results.checks.directories.forEach(check => {
      lines.push(`  ${statusEmoji[check.status]} ${path.basename(check.path)}: ${check.message}`);
    });
  }
  
  if (results.checks.performance.length > 0) {
    lines.push('\n⚡ Performance:');
    results.checks.performance.forEach(check => {
      lines.push(`  ${statusEmoji[check.status]} ${check.name}: ${check.message}`);
    });
  }
  
  lines.push(`\n${'='.repeat(60)}`);
  
  return lines.join('\n');
}

module.exports = {
  HealthStatus,
  pathExists,
  checkModule,
  checkEnvVar,
  checkDirectory,
  checkAPI,
  runHealthCheck,
  formatHealthCheck
};
