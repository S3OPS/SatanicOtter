#!/usr/bin/env node

/**
 * Integration Test for SatanicOtter Setup
 * Tests that the setup process creates all necessary files and configurations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🧪 Running SatanicOtter Integration Tests\n');

// Change to project root
process.chdir(path.join(__dirname, '..'));

// Test 1: Package.json has correct scripts
test('package.json contains setup script', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts.setup, 'setup script not found');
  assert(packageJson.scripts.setup === 'node setup.js', 'setup script incorrect');
});

test('package.json contains status script', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts.status, 'status script not found');
  assert(packageJson.scripts.status === 'node status.js', 'status script incorrect');
});

// Test 2: Required files exist
test('setup.js exists', () => {
  assert(fs.existsSync('setup.js'), 'setup.js not found');
});

test('status.js exists', () => {
  assert(fs.existsSync('status.js'), 'status.js not found');
});

test('QUICK_START.md exists', () => {
  assert(fs.existsSync('QUICK_START.md'), 'QUICK_START.md not found');
});

test('.env.example exists', () => {
  assert(fs.existsSync('.env.example'), 'env.example not found');
});

// Test 3: Automation modules exist
const modules = [
  'automation/index.js',
  'automation/contentGenerator.js',
  'automation/scheduler.js',
  'automation/productResearch.js',
  'automation/analyticsTracker.js',
  'automation/profileSetup.js',
  'automation/profileAutomation.js'
];

modules.forEach(module => {
  test(`${module} exists`, () => {
    assert(fs.existsSync(module), `${module} not found`);
  });
});

// Test core scripts
test('fullAutoSetup.js exists', () => {
  assert(fs.existsSync('fullAutoSetup.js'), 'fullAutoSetup.js not found');
});

test('quickConfig.js exists', () => {
  assert(fs.existsSync('quickConfig.js'), 'quickConfig.js not found');
});

// Test 4: Documentation exists
const docs = [
  'README.md',
  'QUICK_START.md',
  'SETUP_GUIDE.md',
  'TIKTOK_GUIDE.md',
  'EXAMPLE_WORKFLOW.md',
  'PROFILE_SETUP_GUIDE.md',
  'PROFILE_AUTOMATION_GUIDE.md',
  'ONE_COMMAND_SETUP.md'
];

docs.forEach(doc => {
  test(`${doc} exists`, () => {
    assert(fs.existsSync(doc), `${doc} not found`);
  });
});

// Test 5: Scripts are executable (syntax check)
test('setup.js has valid syntax', () => {
  try {
    execSync('node -c setup.js', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('setup.js has syntax errors');
  }
});

test('status.js has valid syntax', () => {
  try {
    execSync('node -c status.js', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('status.js has syntax errors');
  }
});

// Test 6: Automation scripts have valid syntax
modules.forEach(module => {
  test(`${module} has valid syntax`, () => {
    try {
      execSync(`node -c ${module}`, { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`${module} has syntax errors`);
    }
  });
});

// Test 7: README contains quick start reference
test('README.md references QUICK_START.md', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  assert(readme.includes('QUICK_START.md'), 'README does not reference QUICK_START.md');
});

test('README.md contains npm run setup command', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  assert(readme.includes('npm run setup'), 'README does not mention npm run setup');
});

// Test 8: QUICK_START.md has proper content
test('QUICK_START.md contains setup instructions', () => {
  const quickStart = fs.readFileSync('QUICK_START.md', 'utf8');
  assert(quickStart.includes('npm run setup'), 'QUICK_START does not contain setup command');
  assert(quickStart.includes('npm run product-research'), 'QUICK_START does not contain product-research command');
});

// Test 9: status script can run
test('status script executes without errors', () => {
  try {
    execSync('node status.js', { stdio: 'pipe' });
  } catch (error) {
    // Status script exits with 1 when not fully configured, that's expected
    if (error.status !== 1) {
      throw error;
    }
  }
});

// Test 10: product-research works without configuration
test('product-research script executes', () => {
  try {
    const output = execSync('npm run product-research', { stdio: 'pipe', encoding: 'utf8' });
    assert(output.includes('HIGH-TICKET PRODUCT RESEARCH'), 'product-research output missing');
  } catch (error) {
    throw new Error(`product-research failed: ${error.message}`);
  }
});

// Test 11: Profile setup module
test('package.json contains setup-profiles script', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts['setup-profiles'], 'setup-profiles script not found');
  assert(packageJson.scripts['setup-profiles'].includes('profileSetup.js'), 'setup-profiles script incorrect');
});

test('package.json contains setup-profiles:wizard script', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts['setup-profiles:wizard'], 'setup-profiles:wizard script not found');
});

test('profile setup module can be loaded', () => {
  try {
    const profileSetup = require('../automation/profileSetup.js');
    assert(profileSetup.setupProfiles, 'setupProfiles function not exported');
    assert(profileSetup.BIO_TEMPLATES, 'BIO_TEMPLATES not exported');
    assert(profileSetup.LINK_IN_BIO_CONFIG, 'LINK_IN_BIO_CONFIG not exported');
    assert(profileSetup.BRANDING_GUIDE, 'BRANDING_GUIDE not exported');
  } catch (error) {
    throw new Error(`Failed to load profile setup module: ${error.message}`);
  }
});

test('profile setup has bio templates for all platforms', () => {
  const { BIO_TEMPLATES } = require('../automation/profileSetup.js');
  assert(BIO_TEMPLATES.tiktok, 'TikTok templates missing');
  assert(BIO_TEMPLATES.tiktok.highTicket, 'TikTok high-ticket templates missing');
  assert(BIO_TEMPLATES.tiktok.tech, 'TikTok tech templates missing');
});

test('profile setup has bio generation function', () => {
  const { generateBio } = require('../automation/profileSetup.js');
  const tiktokBio = generateBio('tiktok', 'tech');
  
  assert(tiktokBio, 'TikTok bio not generated');
  assert(typeof tiktokBio === 'string', 'TikTok bio is not a string');
});

// Test 12: Profile automation module
test('package.json contains automate-profiles scripts', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts['automate-profiles'], 'automate-profiles script not found');
  assert(packageJson.scripts['automate-profiles:dry-run'], 'automate-profiles:dry-run script not found');
  assert(packageJson.scripts['automate-profiles:live'], 'automate-profiles:live script not found');
});

test('profile automation module can be loaded', () => {
  try {
    const profileAutomation = require('../automation/profileAutomation.js');
    assert(profileAutomation.runAutomatedSetup, 'runAutomatedSetup function not exported');
    assert(profileAutomation.checkAutomationSetup, 'checkAutomationSetup function not exported');
    assert(profileAutomation.AUTOMATION_CONFIG, 'AUTOMATION_CONFIG not exported');
  } catch (error) {
    throw new Error(`Failed to load profile automation module: ${error.message}`);
  }
});

test('profile automation checks configuration', () => {
  const { checkAutomationSetup } = require('../automation/profileAutomation.js');
  const result = checkAutomationSetup();
  
  assert(result.isReady !== undefined, 'checkAutomationSetup should return isReady status');
  assert(Array.isArray(result.issues), 'checkAutomationSetup should return issues array');
});

test('profile automation includes TikTok bio selector fallbacks', () => {
  const automationSource = fs.readFileSync('automation/profileAutomation.js', 'utf8');
  assert(automationSource.includes('data-e2e="profile-bio-input"'), 'missing data-e2e bio selector');
  assert(automationSource.includes('contenteditable="true"'), 'missing contenteditable bio selector');
  assert(automationSource.includes('data-e2e*="bio"'), 'missing contenteditable bio fallback');
});

test('GitHub Actions workflow exists', () => {
  assert(fs.existsSync('.github/workflows/profile-automation.yml'), 
    'GitHub Actions workflow file not found');
});

// Test 13: One-command setup
test('package.json contains full-auto script', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts['full-auto'], 'full-auto script not found');
  assert(packageJson.scripts['quick-config'], 'quick-config script not found');
});

test('fullAutoSetup.js has valid syntax', () => {
  try {
    execSync('node -c fullAutoSetup.js', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('fullAutoSetup.js has syntax errors');
  }
});

test('quickConfig.js has valid syntax', () => {
  try {
    execSync('node -c quickConfig.js', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('quickConfig.js has syntax errors');
  }
});

// Test 14: New utility modules
test('cache utility module can be loaded', () => {
  try {
    const cache = require('../automation/utils/cache.js');
    assert(cache.set, 'cache.set function not exported');
    assert(cache.get, 'cache.get function not exported');
    assert(cache.withCache, 'cache.withCache function not exported');
  } catch (error) {
    throw new Error(`Failed to load cache module: ${error.message}`);
  }
});

test('rate limiter utility module can be loaded', () => {
  try {
    const rateLimiter = require('../automation/utils/rateLimiter.js');
    assert(rateLimiter.withRateLimit, 'rateLimiter.withRateLimit function not exported');
    assert(rateLimiter.withRetry, 'rateLimiter.withRetry function not exported');
    assert(rateLimiter.calculateBackoff, 'rateLimiter.calculateBackoff function not exported');
  } catch (error) {
    throw new Error(`Failed to load rate limiter module: ${error.message}`);
  }
});

test('error handler utility module can be loaded', () => {
  try {
    const errorHandler = require('../automation/utils/errorHandler.js');
    assert(errorHandler.ErrorType, 'errorHandler.ErrorType not exported');
    assert(errorHandler.AppError, 'errorHandler.AppError not exported');
    assert(errorHandler.categorizeError, 'errorHandler.categorizeError function not exported');
  } catch (error) {
    throw new Error(`Failed to load error handler module: ${error.message}`);
  }
});

test('validators utility module can be loaded', () => {
  try {
    const validators = require('../automation/utils/validators.js');
    assert(validators.isNonEmptyString, 'validators.isNonEmptyString function not exported');
    assert(validators.isValidUrl, 'validators.isValidUrl function not exported');
    assert(validators.validateEnvConfig, 'validators.validateEnvConfig function not exported');
  } catch (error) {
    throw new Error(`Failed to load validators module: ${error.message}`);
  }
});

test('formatters utility module can be loaded', () => {
  try {
    const formatters = require('../automation/utils/formatters.js');
    assert(formatters.formatCurrency, 'formatters.formatCurrency function not exported');
    assert(formatters.formatDate, 'formatters.formatDate function not exported');
    assert(formatters.formatTable, 'formatters.formatTable function not exported');
  } catch (error) {
    throw new Error(`Failed to load formatters module: ${error.message}`);
  }
});

// Test 15: ESLint and CI/CD configuration
test('ESLint configuration exists', () => {
  assert(fs.existsSync('.eslintrc.js'), '.eslintrc.js not found');
});

test('package.json contains lint script', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(packageJson.scripts['lint'], 'lint script not found');
  assert(packageJson.scripts['lint:fix'], 'lint:fix script not found');
});

test('CI/CD workflow exists', () => {
  assert(fs.existsSync('.github/workflows/ci.yml'), 
    'CI/CD workflow file not found');
});

test('Dependabot configuration exists', () => {
  assert(fs.existsSync('.github/dependabot.yml'), 
    'Dependabot configuration not found');
});

// Summary
console.log('\n' + '='.repeat(70));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(70));

if (testsFailed === 0) {
  console.log('✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed\n');
  process.exit(1);
}
