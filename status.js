#!/usr/bin/env node

/**
 * System Status Checker for SatanicOtter
 * Verifies that the automation system is properly configured
 */

const fs = require('fs');
const path = require('path');

// Try to load dotenv, but don't fail if it's not installed yet
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed yet, that's ok - we'll report it
}

// Constants for configuration validation
const PLACEHOLDER_PATTERN = /your_|your-|<.*>|example/i;

function isConfigured(value) {
  return value && !PLACEHOLDER_PATTERN.test(value);
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logHeader(message) {
  console.log('');
  log('='.repeat(70), 'bright');
  log(message, 'bright');
  log('='.repeat(70), 'bright');
  console.log('');
}

// Check system status
function checkSystemStatus() {
  logHeader('🔥 SatanicOtter System Status');

  let score = 0;
  let maxScore = 0;

  // Check 1: Dependencies installed
  maxScore += 10;
  log('1. Dependencies:', 'bright');
  if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    logSuccess('Node.js dependencies installed');
    score += 10;
  } else {
    logError('Node.js dependencies not installed');
    log('   Run: npm install', 'cyan');
  }
  console.log('');

  // Check 2: Environment file
  maxScore += 20;
  log('2. Environment Configuration:', 'bright');
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    logSuccess('.env file exists');
    score += 10;

    // Check critical variables
    const requiredVars = ['AMAZON_AFFILIATE_TAG'];
    const optionalVars = ['OPENAI_API_KEY', 'TIKTOK_USERNAME'];
    
    let varsConfigured = 0;
    for (const varName of requiredVars) {
      if (isConfigured(process.env[varName])) {
        logSuccess(`${varName} configured`);
        score += 10;
        varsConfigured++;
      } else {
        logWarning(`${varName} not configured (required)`);
      }
    }

    for (const varName of optionalVars) {
      if (isConfigured(process.env[varName])) {
        logSuccess(`${varName} configured`);
        varsConfigured++;
      }
    }
  } else {
    logError('.env file not found');
    log('   Run: npm run setup', 'cyan');
  }
  console.log('');

  // Check 3: Automation modules
  maxScore += 20;
  log('3. Automation Modules:', 'bright');
  const modules = [
    'automation/index.js',
    'automation/contentGenerator.js',
    'automation/scheduler.js',
    'automation/productResearch.js',
    'automation/analyticsTracker.js'
  ];

  let modulesOk = 0;
  for (const module of modules) {
    if (fs.existsSync(path.join(__dirname, module))) {
      modulesOk++;
    }
  }

  if (modulesOk === modules.length) {
    logSuccess(`All ${modules.length} automation modules present`);
    score += 20;
  } else {
    logError(`Only ${modulesOk}/${modules.length} modules found`);
  }
  console.log('');

  // Check 4: Documentation
  maxScore += 10;
  log('4. Documentation:', 'bright');
  const docs = [
    'README.md',
    'QUICK_START.md',
    'SETUP_GUIDE.md',
    'TIKTOK_GUIDE.md',
    'EXAMPLE_WORKFLOW.md'
  ];

  let docsOk = 0;
  for (const doc of docs) {
    if (fs.existsSync(path.join(__dirname, doc))) {
      docsOk++;
    }
  }

  if (docsOk === docs.length) {
    logSuccess(`All ${docs.length} documentation files present`);
    score += 10;
  } else {
    logWarning(`Only ${docsOk}/${docs.length} docs found`);
    score += Math.floor(10 * docsOk / docs.length);
  }
  console.log('');

  // Check 5: Output directories
  maxScore += 10;
  log('5. Output Directories:', 'bright');
  const dirs = ['generated-content', 'analytics', 'review-queue'];
  let dirsExist = 0;
  
  for (const dir of dirs) {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      dirsExist++;
    }
  }

  if (dirsExist > 0) {
    logSuccess(`${dirsExist}/${dirs.length} output directories created`);
    score += Math.floor(10 * dirsExist / dirs.length);
  } else {
    log('   Output directories will be created on first run', 'cyan');
    score += 5;
  }
  console.log('');

  // Check 6: Web Tools
  maxScore += 10;
  log('6. Web Tools:', 'bright');
  if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    logSuccess('Amazon Link Generator tool available');
    score += 10;
  } else {
    logError('Link generator not found');
  }
  console.log('');

  // Overall Score
  logHeader('Overall System Health');
  
  const percentage = Math.round((score / maxScore) * 100);
  let status = '';
  let statusColor = 'green';

  if (percentage >= 80) {
    status = '🎉 EXCELLENT - System ready to use!';
    statusColor = 'green';
  } else if (percentage >= 60) {
    status = '✅ GOOD - Basic setup complete, configure remaining items';
    statusColor = 'cyan';
  } else if (percentage >= 40) {
    status = '⚠️  INCOMPLETE - Run setup to configure system';
    statusColor = 'yellow';
  } else {
    status = '❌ NOT READY - Run npm run setup to get started';
    statusColor = 'red';
  }

  log(`Score: ${score}/${maxScore} (${percentage}%)`, 'bright');
  log(status, statusColor);
  console.log('');

  // Next Steps
  if (percentage < 100) {
    log('📋 Recommended Next Steps:', 'bright');
    
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
      log('   1. Run: npm install', 'cyan');
    }
    
    if (!fs.existsSync(path.join(__dirname, '.env'))) {
      log('   2. Run: npm run setup', 'cyan');
    } else if (!isConfigured(process.env.AMAZON_AFFILIATE_TAG)) {
      log('   2. Configure Amazon Affiliate Tag in .env', 'cyan');
    }
    
    if (!isConfigured(process.env.OPENAI_API_KEY)) {
      log('   3. Add OpenAI API key for content generation (optional)', 'cyan');
    }
    
    console.log('');
  }

  // Available Commands
  if (percentage >= 60) {
    log('🚀 Available Commands:', 'bright');
    log('   npm run product-research   - Find high-commission products', 'cyan');
    log('   npm run generate-content   - Generate AI content (needs OpenAI)', 'cyan');
    log('   npm run schedule-posts     - Schedule social media posts', 'cyan');
    log('   npm run analytics:add      - Track daily metrics', 'cyan');
    log('   npm run automate           - Run full automation', 'cyan');
    console.log('');
  }

  return percentage >= 60;
}

// Run the check
const isReady = checkSystemStatus();
process.exit(isReady ? 0 : 1);
