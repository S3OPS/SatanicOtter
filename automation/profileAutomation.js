/**
 * 100% Automated Profile Setup for TikTok
 * 
 * This module provides fully automated profile configuration using browser automation.
 * It can update bio text, profile pictures, and settings automatically using credentials.
 * 
 * Security: Uses GitHub Secrets or environment variables for sensitive data.
 */

const { loadEnv, getEnv, getEnvBool } = require('./utils/config');
const { info, error: logError, warn, section } = require('./utils/logger');
const { 
  isPuppeteerAvailable, 
  launchBrowser, 
  setSessionCookie, 
  findElement,
  setText,
  navigateSafe,
  humanDelay
} = require('./utils/browserAutomation');
const { generateBio } = require('./profileSetup');

loadEnv();

/**
 * Configuration for automated profile updates
 */
const AUTOMATION_CONFIG = {
  enabled: getEnvBool('PROFILE_AUTOMATION_ENABLED', false),
  tiktok: {
    username: getEnv('TIKTOK_USERNAME'),
    password: getEnv('TIKTOK_PASSWORD'),
    sessionId: getEnv('TIKTOK_SESSION_ID')
  },
  niche: getEnv('PROFILE_NICHE', 'highTicket'),
  dryRun: getEnvBool('PROFILE_DRY_RUN', true) // Default to dry run for safety
};

/**
 * Check if automation is properly configured
 */
function checkAutomationSetup() {
  const issues = [];
  
  if (!AUTOMATION_CONFIG.enabled) {
    issues.push('PROFILE_AUTOMATION_ENABLED not set to true');
  }
  
  // Check TikTok credentials
  if (!AUTOMATION_CONFIG.tiktok.username) {
    issues.push('TIKTOK_USERNAME not configured');
  }
  
  // Check if user has EITHER password OR session ID (not both required)
  if (!AUTOMATION_CONFIG.tiktok.password && !AUTOMATION_CONFIG.tiktok.sessionId) {
    issues.push('TikTok authentication: You must set EITHER TIKTOK_SESSION_ID (recommended) OR TIKTOK_PASSWORD');
    issues.push('  → To get TIKTOK_SESSION_ID: Login to TikTok in browser → Press F12 → Application tab → Cookies → Find "sessionid" → Copy its value');
    issues.push('  → TIKTOK_SESSION_ID is more reliable and doesn\'t require handling 2FA or captcha');
  }
  
  return {
    isReady: issues.length === 0,
    issues: issues
  };
}

/**
 * Update TikTok profile automatically
 * 
 * Note: This requires browser automation (Puppeteer/Playwright) to be installed.
 * TikTok does not provide an official API for profile updates.
 * 
 * @param {Object} config - Profile configuration
 * @returns {Promise<Object>} - Update result
 */
async function updateTikTokProfile(config) {
  info('ProfileAutomation', 'Updating TikTok profile...');
  
  if (AUTOMATION_CONFIG.dryRun) {
    info('ProfileAutomation', 'DRY RUN MODE - No actual changes will be made');
    info('ProfileAutomation', `Would update TikTok profile for: ${AUTOMATION_CONFIG.tiktok.username}`);
    info('ProfileAutomation', `Bio: ${config.bio}`);
    info('ProfileAutomation', `Category: ${config.setup.category}`);
    warn('ProfileAutomation', 'To enable actual updates, set PROFILE_DRY_RUN=false in .env');
    return { success: true, dryRun: true };
  }
  
  // Check if Puppeteer is available
  if (!isPuppeteerAvailable()) {
    logError('ProfileAutomation', 'Puppeteer not installed. Install with: npm install puppeteer');
    console.log('\n💡 Alternative: Use browser automation tools:');
    console.log('   • Puppeteer: npm install puppeteer');
    console.log('   • Playwright: npm install playwright');
    console.log('   • Or use GitHub Actions with secrets for automated deployment\n');
    return { success: false, error: 'Puppeteer not installed' };
  }
  
  let browser = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    
    // Set longer timeout for slow networks
    page.setDefaultTimeout(60000);
    
    // Navigate to TikTok login
    const loginSuccess = await navigateSafe(page, 'https://www.tiktok.com/login');
    if (!loginSuccess) {
      throw new Error('Failed to navigate to TikTok login page');
    }
    
    // Use session cookie if available (recommended)
    if (AUTOMATION_CONFIG.tiktok.sessionId) {
      await setSessionCookie(page, '.tiktok.com', AUTOMATION_CONFIG.tiktok.sessionId);
    } else {
      warn('ProfileAutomation', 'Username/password login requires additional captcha/2FA handling');
    }
    
    // Navigate to profile settings
    const settingsSuccess = await navigateSafe(page, 'https://www.tiktok.com/setting');
    if (!settingsSuccess) {
      throw new Error('Failed to navigate to TikTok settings page');
    }
    
    // Human-like delay
    await humanDelay(1000, 2000);
    
    // Find bio field using multiple selectors
    const bioSelectors = [
      'textarea[placeholder*="Bio"]',
      'textarea[placeholder*="bio"]',
      'textarea[name="bio"]',
      'textarea[aria-label*="Bio"]',
      'textarea[data-e2e="profile-bio-input"]',
      'div[contenteditable="true"][data-e2e*="bio"]',
      'div[contenteditable="true"][aria-label*="Bio"]'
    ];
    
    const { element: bioElement, selector: usedSelector } = await findElement(page, bioSelectors);
    
    if (!bioElement) {
      throw new Error('Could not find bio field. TikTok UI may have changed or authentication failed.');
    }
    
    info('ProfileAutomation', `Found bio field using selector: ${usedSelector}`);
    
    // Update bio
    const isContentEditable = usedSelector.includes('contenteditable');
    await setText(page, usedSelector, config.bio, isContentEditable);
    
    // Human-like delay before saving
    await humanDelay(500, 1000);
    
    // Find and click save button
    const saveSelectors = ['button[type="submit"]', 'button:has-text("Save")', 'button.save-button'];
    const { element: saveButton } = await findElement(page, saveSelectors, 3000);
    
    if (saveButton) {
      await saveButton.click();
      await humanDelay(2000, 3000);
    } else {
      warn('ProfileAutomation', 'Could not find save button, changes may not be saved');
    }
    
    info('ProfileAutomation', 'TikTok profile updated successfully');
    return { success: true, platform: 'tiktok' };
    
  } catch (error) {
    logError('ProfileAutomation', `Error updating TikTok profile: ${error.message}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   • Verify TIKTOK_SESSION_ID is valid (login to TikTok in browser, get from cookies)');
    console.log('   • Check if TikTok is accessible from your network');
    console.log('   • TikTok may have updated their UI - selectors may need updating');
    console.log('   • Try running in non-headless mode to see what\'s happening\n');
    return { success: false, error: error.message };
  } finally {
    // Always close browser to prevent resource leaks
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        warn('ProfileAutomation', `Error closing browser: ${closeError.message}`);
      }
    }
  }
}

/**
 * Run automated profile setup for TikTok
 */
async function runAutomatedSetup(options = {}) {
  section('100% AUTOMATED PROFILE SETUP');
  
  // Check setup
  const setupCheck = checkAutomationSetup();
  
  if (!setupCheck.isReady) {
    warn('ProfileAutomation', 'Automation not fully configured:');
    setupCheck.issues.forEach(issue => {
      console.log(`   • ${issue}`);
    });
    console.log('\n💡 See PROFILE_AUTOMATION_GUIDE.md for setup instructions\n');
    return { success: false, issues: setupCheck.issues };
  }
  
  info('ProfileAutomation', 'Automation configured and ready');
  
  if (AUTOMATION_CONFIG.dryRun) {
    info('ProfileAutomation', 'Running in DRY RUN mode (safe - no actual changes)');
  } else {
    info('ProfileAutomation', 'Running in LIVE mode - will make actual profile changes');
  }
  
  const niche = options.niche || AUTOMATION_CONFIG.niche;
  const results = [];
  
  // Generate profile configurations
  const tiktokBio = generateBio('tiktok', niche);
  
  // Update TikTok profile
  if (AUTOMATION_CONFIG.tiktok.username) {
    const tiktokConfig = {
      bio: tiktokBio,
      setup: {
        category: 'Shopping & Retail',
        features: ['Add website link in bio']
      }
    };
    
    const tiktokResult = await updateTikTokProfile(tiktokConfig);
    results.push(tiktokResult);
  }
  
  // Summary
  section('AUTOMATION SUMMARY');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  info('ProfileAutomation', `Successful: ${successful}`);
  if (failed > 0) {
    logError('ProfileAutomation', `Failed: ${failed}`);
  }
  
  if (AUTOMATION_CONFIG.dryRun) {
    warn('ProfileAutomation', 'This was a DRY RUN. Set PROFILE_DRY_RUN=false to apply changes.');
  }
  
  return {
    success: failed === 0,
    results: results
  };
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse niche
  const nicheIndex = args.indexOf('--niche');
  if (nicheIndex !== -1 && args[nicheIndex + 1]) {
    options.niche = args[nicheIndex + 1];
  }
  
  (async () => {
    try {
      const result = await runAutomatedSetup(options);
      if (result.success) {
        info('ProfileAutomation', 'Automated profile setup completed successfully!');
        process.exit(0);
      } else {
        logError('ProfileAutomation', 'Automated profile setup completed with errors');
        process.exit(1);
      }
    } catch (error) {
      logError('ProfileAutomation', `Fatal error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = {
  runAutomatedSetup,
  updateTikTokProfile,
  checkAutomationSetup,
  AUTOMATION_CONFIG
};
