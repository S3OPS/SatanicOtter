#!/usr/bin/env node

/**
 * Automated Setup Script for SatanicOtter
 * Configures the complete affiliate marketing automation system
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Print colored output
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

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logHeader(message) {
  console.log('');
  log('='.repeat(70), 'bright');
  log(message, 'bright');
  log('='.repeat(70), 'bright');
  console.log('');
}

// Check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Get version of a command
function getVersion(command, versionFlag = '--version') {
  try {
    const version = execSync(`${command} ${versionFlag}`, { encoding: 'utf8', stdio: 'pipe' });
    return version.trim().split('\n')[0];
  } catch {
    return 'unknown';
  }
}

// Step 1: Check Prerequisites
async function checkPrerequisites() {
  logHeader('Step 1: Checking Prerequisites');

  const checks = {
    node: { command: 'node', minVersion: 16, versionFlag: '--version' },
    npm: { command: 'npm', minVersion: 7, versionFlag: '--version' }
  };

  let allPassed = true;

  // Check Node.js
  if (commandExists('node')) {
    const version = getVersion('node', '--version');
    const majorVersion = parseInt(version.match(/v?(\d+)\./)?.[1] || '0');
    
    if (majorVersion >= checks.node.minVersion) {
      logSuccess(`Node.js ${version} (requires ${checks.node.minVersion}+)`);
    } else {
      logError(`Node.js ${version} is too old (requires ${checks.node.minVersion}+)`);
      logInfo('Download from: https://nodejs.org/');
      allPassed = false;
    }
  } else {
    logError('Node.js not found');
    logInfo('Download from: https://nodejs.org/');
    allPassed = false;
  }

  // Check npm
  if (commandExists('npm')) {
    const version = getVersion('npm', '--version');
    logSuccess(`npm ${version}`);
  } else {
    logError('npm not found (should be installed with Node.js)');
    allPassed = false;
  }

  // Check Python (optional)
  if (commandExists('python') || commandExists('python3')) {
    const pythonCmd = commandExists('python3') ? 'python3' : 'python';
    const version = getVersion(pythonCmd, '--version');
    logSuccess(`${version} (optional, for video processing)`);
  } else {
    logWarning('Python not found (optional, needed for video processing)');
    logInfo('Download from: https://www.python.org/');
  }

  console.log('');
  return allPassed;
}

// Step 2: Install Dependencies
async function installDependencies() {
  logHeader('Step 2: Installing Dependencies');

  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    logInfo('Dependencies already installed. Checking for updates...');
    const response = await question('Would you like to reinstall dependencies? (y/N): ');
    if (response.toLowerCase() !== 'y') {
      logInfo('Skipping dependency installation');
      console.log('');
      return true;
    }
  }

  try {
    logInfo('Installing Node.js dependencies...');
    logInfo('This may take a few minutes...');
    
    execSync('npm install', { 
      stdio: 'inherit',
      cwd: __dirname
    });
    
    logSuccess('Node.js dependencies installed successfully');
    console.log('');
    return true;
  } catch (error) {
    logError('Failed to install dependencies');
    logError(error.message);
    console.log('');
    return false;
  }
}

// Step 3: Create Environment Configuration
async function createEnvironmentConfig() {
  logHeader('Step 3: Environment Configuration');

  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  if (fs.existsSync(envPath)) {
    logWarning('.env file already exists');
    const response = await question('Would you like to reconfigure it? (y/N): ');
    if (response.toLowerCase() !== 'y') {
      logInfo('Using existing .env file');
      console.log('');
      return true;
    }
  }

  logInfo('Creating .env configuration file...');
  console.log('');
  
  // Copy from template
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  let envContent = envExample;

  // Interactive configuration
  log('Configure your API keys and settings:', 'bright');
  log('(Press Enter to skip optional fields)\n', 'cyan');

  // OpenAI API Key
  const openaiKey = await question('OpenAI API Key (get from https://platform.openai.com/): ');
  if (openaiKey.trim()) {
    envContent = envContent.replace('OPENAI_API_KEY=your_openai_api_key_here', `OPENAI_API_KEY=${openaiKey.trim()}`);
  }

  // Amazon Affiliate Tag
  const amazonTag = await question('Amazon Affiliate Tag (e.g., yourname-20): ');
  if (amazonTag.trim()) {
    envContent = envContent.replace('AMAZON_AFFILIATE_TAG=your_amazon_tag', `AMAZON_AFFILIATE_TAG=${amazonTag.trim()}`);
  }

  // Optional: TikTok
  const configureTikTok = await question('Configure TikTok posting? (y/N): ');
  if (configureTikTok.toLowerCase() === 'y') {
    const tiktokUsername = await question('TikTok Username: ');
    const tiktokSessionId = await question('TikTok Session ID (from browser cookies): ');
    
    if (tiktokUsername.trim()) {
      envContent = envContent.replace('TIKTOK_USERNAME=your_tiktok_username', `TIKTOK_USERNAME=${tiktokUsername.trim()}`);
    }
    if (tiktokSessionId.trim()) {
      envContent = envContent.replace('TIKTOK_SESSION_ID=your_tiktok_session_id', `TIKTOK_SESSION_ID=${tiktokSessionId.trim()}`);
    }
  }

  // Optional: Instagram
  const configureInstagram = await question('Configure Instagram posting? (y/N): ');
  if (configureInstagram.toLowerCase() === 'y') {
    const instaUsername = await question('Instagram Username: ');
    const instaPassword = await question('Instagram Password: ');
    
    if (instaUsername.trim()) {
      envContent = envContent.replace('INSTAGRAM_USERNAME=your_instagram_username', `INSTAGRAM_USERNAME=${instaUsername.trim()}`);
    }
    if (instaPassword.trim()) {
      envContent = envContent.replace('INSTAGRAM_PASSWORD=your_instagram_password', `INSTAGRAM_PASSWORD=${instaPassword.trim()}`);
    }
  }

  // Save .env file
  fs.writeFileSync(envPath, envContent);
  logSuccess('.env file created successfully');
  console.log('');

  return true;
}

// Step 4: Validate Configuration
async function validateConfiguration() {
  logHeader('Step 4: Validating Configuration');

  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    logError('.env file not found');
    return false;
  }

  // Load environment variables
  require('dotenv').config();

  const requiredVars = ['AMAZON_AFFILIATE_TAG'];
  const optionalVars = ['OPENAI_API_KEY', 'TIKTOK_USERNAME', 'INSTAGRAM_USERNAME'];

  let isValid = true;

  // Check required variables
  log('Required Configuration:', 'bright');
  for (const varName of requiredVars) {
    if (process.env[varName] && process.env[varName] !== `your_${varName.toLowerCase()}`) {
      logSuccess(`${varName}: Configured`);
    } else {
      logWarning(`${varName}: Not configured (required for affiliate links)`);
      isValid = false;
    }
  }

  console.log('');
  log('Optional Configuration:', 'bright');
  for (const varName of optionalVars) {
    if (process.env[varName] && !process.env[varName].includes('your_')) {
      logSuccess(`${varName}: Configured`);
    } else {
      logInfo(`${varName}: Not configured (optional)`);
    }
  }

  console.log('');
  return isValid;
}

// Step 5: Run Initial Test
async function runInitialTest() {
  logHeader('Step 5: Running Initial Test');

  logInfo('Testing product research module (no API keys required)...');
  console.log('');

  try {
    execSync('npm run product-research', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('');
    logSuccess('Product research test completed successfully!');
    console.log('');
    return true;
  } catch (error) {
    logError('Product research test failed');
    logError(error.message);
    console.log('');
    return false;
  }
}

// Step 6: Display Next Steps
async function displayNextSteps() {
  logHeader('🎉 Setup Complete!');

  log('Your SatanicOtter automation system is ready to use!\n', 'green');

  log('📚 NEXT STEPS:\n', 'bright');

  log('1. Generate Product Recommendations:', 'cyan');
  log('   npm run product-research\n');

  log('2. Generate AI Content (requires OpenAI API key):', 'cyan');
  log('   npm run generate-content\n');

  log('3. Track Your Analytics:', 'cyan');
  log('   npm run analytics:add\n');

  log('4. Schedule Posts:', 'cyan');
  log('   npm run schedule-posts\n');

  log('5. Run Full Automation:', 'cyan');
  log('   npm run automate\n');

  log('📖 DOCUMENTATION:\n', 'bright');
  log('   • SETUP_GUIDE.md - Complete setup and operations guide', 'cyan');
  log('   • TIKTOK_INSTAGRAM_GUIDE.md - Full monetization strategy', 'cyan');
  log('   • EXAMPLE_WORKFLOW.md - Real-world example workflow', 'cyan');
  log('   • README.md - Project overview and quick start\n', 'cyan');

  log('🎯 GOAL: $1,000/day through high-ticket Amazon affiliate marketing\n', 'bright');

  log('💡 TIP: Start with product research, then generate content!', 'yellow');
  console.log('');
}

// Main setup function
async function runSetup() {
  console.clear();
  
  log('🔥 SatanicOtter Automation System Setup 🔥\n', 'bright');
  log('Complete Affiliate Marketing Automation for TikTok & Instagram', 'cyan');
  log('Goal: $1,000/day through high-ticket Amazon products\n', 'cyan');

  try {
    // Step 1: Check Prerequisites
    const prerequisitesOk = await checkPrerequisites();
    if (!prerequisitesOk) {
      logError('Please install required software and run setup again');
      rl.close();
      process.exit(1);
    }

    // Step 2: Install Dependencies
    const depsInstalled = await installDependencies();
    if (!depsInstalled) {
      logError('Setup failed: Could not install dependencies');
      rl.close();
      process.exit(1);
    }

    // Step 3: Create Environment Configuration
    const envCreated = await createEnvironmentConfig();
    if (!envCreated) {
      logError('Setup failed: Could not create environment configuration');
      rl.close();
      process.exit(1);
    }

    // Step 4: Validate Configuration
    await validateConfiguration();

    // Step 5: Run Initial Test
    const testPassed = await runInitialTest();

    // Step 6: Display Next Steps
    await displayNextSteps();

    rl.close();
    process.exit(0);

  } catch (error) {
    logError('Setup failed with error:');
    console.error(error);
    rl.close();
    process.exit(1);
  }
}

// Run setup
runSetup();
