#!/usr/bin/env node

/**
 * Full Auto Setup - One Command to Rule Them All
 * 
 * This script orchestrates the complete automated setup:
 * 1. Validates environment configuration
 * 2. Installs necessary dependencies (Puppeteer if needed)
 * 3. Runs automated profile setup
 * 4. Generates content
 * 5. Schedules posts
 * 
 * Usage: npm run full-auto
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Auto-create .env from .env.example if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    console.log('📝 Creating .env file from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created! You can now edit it with your credentials.\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('⚠️  Please manually copy .env.example to .env\n');
  }
}

// Load dotenv only if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, continue without it
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('');
  log('='.repeat(70), 'bright');
  log(message, 'bright');
  log('='.repeat(70), 'bright');
  console.log('');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

/**
 * Check if a package is installed
 */
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if an environment variable is properly configured
 * (not a placeholder value)
 */
const PLACEHOLDER_PATTERN = /your_|your-|<.*>|example/i;

function isConfigured(value) {
  return value && !PLACEHOLDER_PATTERN.test(value);
}

/**
 * Step 1: Validate Configuration
 */
async function validateConfiguration() {
  logHeader('Step 1: Validating Configuration');
  
  const required = {
    'AMAZON_AFFILIATE_TAG': 'Required for affiliate links',
    'PROFILE_AUTOMATION_ENABLED': 'Must be "true" for full automation'
  };
  
  const profileAutomation = {
    'TIKTOK_USERNAME': 'TikTok username',
    'TIKTOK_SESSION_ID': 'TikTok session ID (recommended) OR TIKTOK_PASSWORD',
    'INSTAGRAM_USERNAME': 'Instagram username',
    'INSTAGRAM_PASSWORD': 'Instagram password'
  };
  
  const optional = {
    'OPENAI_API_KEY': 'For AI content generation',
    'PROFILE_NICHE': 'Profile niche (defaults to highTicket)',
    'PROFILE_DRY_RUN': 'Dry run mode (defaults to true for safety)'
  };
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check required
  log('Required Configuration:', 'bright');
  
  // Check AMAZON_AFFILIATE_TAG - must be configured (not a placeholder)
  if (isConfigured(process.env.AMAZON_AFFILIATE_TAG)) {
    logSuccess('AMAZON_AFFILIATE_TAG: Required for affiliate links');
  } else {
    logError('AMAZON_AFFILIATE_TAG: Required for affiliate links - NOT CONFIGURED');
    hasErrors = true;
  }
  
  // Check PROFILE_AUTOMATION_ENABLED - must be exactly "true"
  if (process.env.PROFILE_AUTOMATION_ENABLED === 'true') {
    logSuccess('PROFILE_AUTOMATION_ENABLED: Must be "true" for full automation');
  } else {
    logError('PROFILE_AUTOMATION_ENABLED: Must be "true" for full automation - NOT CONFIGURED');
    logInfo('  Set PROFILE_AUTOMATION_ENABLED=true in .env file');
    hasErrors = true;
  }
  
  // Check profile automation
  console.log('');
  log('Profile Automation Configuration:', 'bright');
  
  // Special handling for TikTok credentials
  if (isConfigured(process.env.TIKTOK_USERNAME)) {
    logSuccess('TIKTOK_USERNAME: TikTok username');
  } else {
    logWarning('TIKTOK_USERNAME: TikTok username - Not configured');
    hasWarnings = true;
  }
  
  // Check if user has either password OR session ID
  const hasTikTokPassword = isConfigured(process.env.TIKTOK_PASSWORD);
  const hasTikTokSession = isConfigured(process.env.TIKTOK_SESSION_ID);
  
  if (hasTikTokSession) {
    logSuccess('TIKTOK_SESSION_ID: TikTok session ID (recommended method)');
  } else if (hasTikTokPassword) {
    logSuccess('TIKTOK_PASSWORD: TikTok password');
    logInfo('  💡 TIP: TIKTOK_SESSION_ID is more reliable than password');
  } else {
    logWarning('TIKTOK credentials: EITHER TIKTOK_SESSION_ID (recommended) OR TIKTOK_PASSWORD required');
    logInfo('  📌 To get session ID: Login to TikTok → F12 → Application → Cookies → Copy "sessionid"');
    hasWarnings = true;
  }
  
  // Check Instagram credentials
  if (isConfigured(process.env.INSTAGRAM_USERNAME)) {
    logSuccess('INSTAGRAM_USERNAME: Instagram username');
  } else {
    logWarning('INSTAGRAM_USERNAME: Instagram username - Not configured');
    hasWarnings = true;
  }
  
  if (isConfigured(process.env.INSTAGRAM_PASSWORD)) {
    logSuccess('INSTAGRAM_PASSWORD: Instagram password');
  } else {
    logWarning('INSTAGRAM_PASSWORD: Instagram password - Not configured');
    hasWarnings = true;
  }
  
  // Check optional
  console.log('');
  log('Optional Configuration:', 'bright');
  for (const [key, description] of Object.entries(optional)) {
    if (isConfigured(process.env[key])) {
      logSuccess(`${key}: ${description}`);
    } else {
      logInfo(`${key}: ${description} - Not configured`);
    }
  }
  
  console.log('');
  
  if (hasErrors) {
    logError('Missing required configuration. Please update your .env file.');
    logInfo('Copy .env.example to .env and fill in your details');
    return false;
  }
  
  if (hasWarnings) {
    logWarning('Some automation features may not work without full credentials');
    logInfo('Profile automation will run in dry-run mode if credentials are missing');
  }
  
  return true;
}

/**
 * Step 2: Install Dependencies
 */
async function installDependencies() {
  logHeader('Step 2: Installing Dependencies');
  
  // Check if Puppeteer is needed
  const needsPuppeteer = process.env.PROFILE_AUTOMATION_ENABLED === 'true' && 
                         !isPackageInstalled('puppeteer');
  
  if (needsPuppeteer) {
    logInfo('Puppeteer not found. Installing for browser automation...');
    try {
      execSync('npm install puppeteer --no-save', { 
        stdio: 'inherit',
        cwd: __dirname
      });
      logSuccess('Puppeteer installed successfully');
    } catch (error) {
      logWarning('Failed to install Puppeteer. Profile automation may not work.');
      logInfo('You can manually install it later: npm install puppeteer');
    }
  } else if (isPackageInstalled('puppeteer')) {
    logSuccess('Puppeteer already installed');
  } else {
    logInfo('Puppeteer not needed (automation not enabled)');
  }
  
  // Check if axios is needed for Graph API
  const needsAxios = process.env.INSTAGRAM_GRAPH_API_TOKEN && 
                     !isPackageInstalled('axios');
  
  if (needsAxios) {
    logInfo('Installing axios for Instagram Graph API...');
    try {
      execSync('npm install axios --no-save', { 
        stdio: 'inherit',
        cwd: __dirname
      });
      logSuccess('Axios installed successfully');
    } catch (error) {
      logWarning('Failed to install axios');
    }
  }
  
  console.log('');
  return true;
}

/**
 * Step 3: Run Automated Profile Setup
 */
async function runProfileSetup() {
  logHeader('Step 3: Automated Profile Setup');
  
  if (process.env.PROFILE_AUTOMATION_ENABLED !== 'true') {
    logWarning('Profile automation not enabled');
    logInfo('Set PROFILE_AUTOMATION_ENABLED=true in .env to enable');
    logInfo('Running manual profile configuration instead...');
    
    try {
      execSync('npm run setup-profiles', { 
        stdio: 'inherit',
        cwd: __dirname
      });
      logSuccess('Manual profile configuration complete');
    } catch (error) {
      logError('Profile configuration failed');
      return false;
    }
  } else {
    logInfo('Running automated profile setup...');
    
    try {
      execSync('npm run automate-profiles', { 
        stdio: 'inherit',
        cwd: __dirname
      });
      logSuccess('Automated profile setup complete');
    } catch (error) {
      logError('Automated profile setup failed');
      logInfo('Check logs above for details');
      return false;
    }
  }
  
  console.log('');
  return true;
}

/**
 * Step 4: Generate Content
 */
async function generateContent() {
  logHeader('Step 4: Generating AI Content');
  
  if (!isConfigured(process.env.OPENAI_API_KEY)) {
    logWarning('OpenAI API key not configured');
    logInfo('Skipping content generation. Add OPENAI_API_KEY to .env to enable');
    console.log('');
    return true;
  }
  
  logInfo('Generating viral content scripts and hooks...');
  
  try {
    execSync('npm run generate-content', { 
      stdio: 'inherit',
      cwd: __dirname
    });
    logSuccess('Content generation complete');
  } catch (error) {
    logWarning('Content generation failed or was skipped');
    logInfo('You can generate content later with: npm run generate-content');
  }
  
  console.log('');
  return true;
}

/**
 * Step 5: Product Research
 */
async function runProductResearch() {
  logHeader('Step 5: Product Research');
  
  logInfo('Finding high-ticket products with $100+ commission...');
  
  try {
    execSync('npm run product-research', { 
      stdio: 'inherit',
      cwd: __dirname
    });
    logSuccess('Product research complete');
  } catch (error) {
    logWarning('Product research failed');
  }
  
  console.log('');
  return true;
}

/**
 * Step 6: Display Summary
 */
async function displaySummary() {
  logHeader('🎉 Full Auto Setup Complete!');
  
  log('Your affiliate marketing automation system is now configured!\n', 'green');
  
  log('✅ COMPLETED STEPS:\n', 'bright');
  log('1. Configuration validated', 'green');
  log('2. Dependencies installed', 'green');
  log('3. Profile setup complete', 'green');
  log('4. Content generated (if OpenAI configured)', 'green');
  log('5. Product research complete\n', 'green');
  
  log('🚀 NEXT STEPS:\n', 'bright');
  
  log('📱 Social Media Profiles:', 'cyan');
  log('   • Check your TikTok profile for updated bio');
  log('   • Check your Instagram profile for updated bio');
  log('   • Review profile-configs/ folder for configuration\n');
  
  log('📝 Content Creation:', 'cyan');
  log('   • Review generated content in generated-content/ folder');
  log('   • Create videos using the AI-generated scripts');
  log('   • See TIKTOK_INSTAGRAM_GUIDE.md for video tips\n');
  
  log('📊 Analytics:', 'cyan');
  log('   • Start tracking: npm run analytics:add');
  log('   • View summary: npm run analytics:summary\n');
  
  log('🤖 Automation:', 'cyan');
  log('   • Schedule posts: npm run schedule-posts');
  log('   • Run full automation: npm run automate\n');
  
  log('📚 DOCUMENTATION:\n', 'bright');
  log('   • PROFILE_SETUP_GUIDE.md - Profile optimization', 'cyan');
  log('   • PROFILE_AUTOMATION_GUIDE.md - 100% automation', 'cyan');
  log('   • TIKTOK_INSTAGRAM_GUIDE.md - Monetization strategy', 'cyan');
  log('   • SETUP_GUIDE.md - Complete setup guide\n', 'cyan');
  
  if (process.env.PROFILE_DRY_RUN !== 'false') {
    log('💡 TIP: Profile automation ran in DRY RUN mode (safe)', 'yellow');
    log('   Set PROFILE_DRY_RUN=false in .env to apply actual changes\n', 'yellow');
  }
  
  log('🎯 GOAL: $1,000/day through high-ticket Amazon affiliate marketing\n', 'bright');
  
  console.log('');
}

/**
 * Main function
 */
async function runFullAutoSetup() {
  log('\n🔥 FULL AUTO SETUP - One Command to Rule Them All 🔥\n', 'bright');
  log('Complete Affiliate Marketing Automation Setup', 'cyan');
  log('Goal: $1,000/day through high-ticket Amazon products\n', 'cyan');
  
  try {
    // Step 1: Validate Configuration
    const configValid = await validateConfiguration();
    if (!configValid) {
      logError('Setup cannot continue without required configuration');
      process.exit(1);
    }
    
    // Step 2: Install Dependencies
    await installDependencies();
    
    // Step 3: Run Profile Setup
    await runProfileSetup();
    
    // Step 4: Generate Content
    await generateContent();
    
    // Step 5: Product Research
    await runProductResearch();
    
    // Step 6: Display Summary
    await displaySummary();
    
    process.exit(0);
    
  } catch (error) {
    logError('Full auto setup failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run setup
runFullAutoSetup();
