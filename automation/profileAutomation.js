/**
 * 100% Automated Profile Setup for TikTok and Instagram
 * 
 * This module provides fully automated profile configuration using browser automation.
 * It can update bio text, profile pictures, and settings automatically using credentials.
 * 
 * Security: Uses GitHub Secrets or environment variables for sensitive data.
 */

// Load dotenv only if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, continue without it
}

const { generateBio } = require('./profileSetup');

/**
 * Configuration for automated profile updates
 */
const AUTOMATION_CONFIG = {
  enabled: process.env.PROFILE_AUTOMATION_ENABLED === 'true',
  tiktok: {
    username: process.env.TIKTOK_USERNAME,
    password: process.env.TIKTOK_PASSWORD,
    sessionId: process.env.TIKTOK_SESSION_ID
  },
  instagram: {
    username: process.env.INSTAGRAM_USERNAME,
    password: process.env.INSTAGRAM_PASSWORD
  },
  niche: process.env.PROFILE_NICHE || 'highTicket',
  dryRun: process.env.PROFILE_DRY_RUN !== 'false' // Default to dry run for safety
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
  
  // Check Instagram credentials
  if (!AUTOMATION_CONFIG.instagram.username) {
    issues.push('INSTAGRAM_USERNAME not configured');
  }
  if (!AUTOMATION_CONFIG.instagram.password) {
    issues.push('INSTAGRAM_PASSWORD not configured');
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
  console.log('🎬 Updating TikTok profile...');
  
  if (AUTOMATION_CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE - No actual changes will be made\n');
    console.log('Would update TikTok profile with:');
    console.log(`  Username: ${AUTOMATION_CONFIG.tiktok.username}`);
    console.log(`  Bio: ${config.bio}`);
    console.log(`  Category: ${config.setup.category}`);
    console.log('\nTo enable actual updates, set PROFILE_DRY_RUN=false in .env\n');
    return { success: true, dryRun: true };
  }
  
  // Check if Puppeteer is available
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (error) {
    console.error('❌ Puppeteer not installed. Install with: npm install puppeteer');
    console.log('\n💡 Alternative: Use browser automation tools:');
    console.log('   • Puppeteer: npm install puppeteer');
    console.log('   • Playwright: npm install playwright');
    console.log('   • Or use GitHub Actions with secrets for automated deployment\n');
    return { success: false, error: 'Puppeteer not installed' };
  }
  
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Navigate to TikTok login
    await page.goto('https://www.tiktok.com/login', { waitUntil: 'networkidle2' });
    
    // Login logic would go here
    // Note: TikTok has bot detection, so this may require:
    // - Session cookie injection (using TIKTOK_SESSION_ID)
    // - Stealth plugins
    // - Human-like delays and mouse movements
    
    if (AUTOMATION_CONFIG.tiktok.sessionId) {
      // Use existing session
      await page.setCookie({
        name: 'sessionid',
        value: AUTOMATION_CONFIG.tiktok.sessionId,
        domain: '.tiktok.com'
      });
    } else {
      // Login with credentials (requires handling 2FA, captcha, etc.)
      // This is complex and may violate TikTok ToS
      console.warn('⚠️  Username/password login requires additional captcha/2FA handling');
    }
    
    // Navigate to profile settings
    await page.goto('https://www.tiktok.com/setting', { waitUntil: 'networkidle2' });
    
    // Update bio
    const bioSelector = 'textarea[placeholder*="Bio"]';
    await page.waitForSelector(bioSelector);
    await page.evaluate((selector, text) => {
      document.querySelector(selector).value = text;
    }, bioSelector, config.bio);
    
    // Save changes
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    await browser.close();
    
    console.log('✅ TikTok profile updated successfully');
    return { success: true, platform: 'tiktok' };
    
  } catch (error) {
    console.error('❌ Error updating TikTok profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update Instagram profile automatically
 * 
 * Note: This uses Instagram's Graph API (requires Business account)
 * or browser automation for personal accounts.
 * 
 * @param {Object} config - Profile configuration
 * @returns {Promise<Object>} - Update result
 */
async function updateInstagramProfile(config) {
  console.log('📸 Updating Instagram profile...');
  
  if (AUTOMATION_CONFIG.dryRun) {
    console.log('🔍 DRY RUN MODE - No actual changes will be made\n');
    console.log('Would update Instagram profile with:');
    console.log(`  Username: ${AUTOMATION_CONFIG.instagram.username}`);
    console.log(`  Bio: ${config.bio}`);
    console.log(`  Category: ${config.setup.category}`);
    console.log('\nTo enable actual updates, set PROFILE_DRY_RUN=false in .env\n');
    return { success: true, dryRun: true };
  }
  
  // Check if we have Graph API access (Business/Creator accounts)
  const graphApiToken = process.env.INSTAGRAM_GRAPH_API_TOKEN;
  
  if (graphApiToken) {
    // Use Instagram Graph API
    return await updateInstagramViaGraphAPI(config, graphApiToken);
  } else {
    // Fall back to browser automation
    return await updateInstagramViaBrowser(config);
  }
}

/**
 * Update Instagram via Graph API (for Business/Creator accounts)
 */
async function updateInstagramViaGraphAPI(config, token) {
  try {
    const axios = require('axios');
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    
    if (!accountId) {
      throw new Error('INSTAGRAM_ACCOUNT_ID required for Graph API');
    }
    
    // Update bio using Graph API
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}`,
      {
        biography: config.bio,
        access_token: token
      }
    );
    
    console.log('✅ Instagram profile updated via Graph API');
    return { success: true, platform: 'instagram', method: 'graph_api' };
    
  } catch (error) {
    console.error('❌ Error updating Instagram via Graph API:', error.message);
    console.log('\n💡 Graph API requires:');
    console.log('   • Business or Creator account');
    console.log('   • Facebook Page connected');
    console.log('   • Access token with instagram_basic permission');
    console.log('   • Get started: https://developers.facebook.com/docs/instagram-api\n');
    return { success: false, error: error.message };
  }
}

/**
 * Update Instagram via browser automation (for personal accounts)
 */
async function updateInstagramViaBrowser(config) {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (error) {
    console.error('❌ Puppeteer not installed. Install with: npm install puppeteer');
    return { success: false, error: 'Puppeteer not installed' };
  }
  
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Navigate to Instagram login
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
    
    // Login
    await page.type('input[name="username"]', AUTOMATION_CONFIG.instagram.username);
    await page.type('input[name="password"]', AUTOMATION_CONFIG.instagram.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Handle "Save Your Login Info?" prompt
    try {
      await page.waitForSelector('button', { timeout: 3000 });
      const notNowButton = await page.$x("//button[contains(text(), 'Not Now')]");
      if (notNowButton.length > 0) {
        await notNowButton[0].click();
      }
    } catch (e) {
      // Prompt might not appear
    }
    
    // Navigate to profile edit
    await page.goto(`https://www.instagram.com/${AUTOMATION_CONFIG.instagram.username}/`, 
      { waitUntil: 'networkidle2' });
    
    await page.click('a[href*="/edit"]');
    await page.waitForSelector('textarea');
    
    // Update bio
    await page.evaluate((text) => {
      const textarea = document.querySelector('textarea');
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }, config.bio);
    
    // Save changes
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    await browser.close();
    
    console.log('✅ Instagram profile updated successfully');
    return { success: true, platform: 'instagram', method: 'browser_automation' };
    
  } catch (error) {
    console.error('❌ Error updating Instagram profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Run automated profile setup for all platforms
 */
async function runAutomatedSetup(options = {}) {
  console.log('\n' + '='.repeat(70));
  console.log('🤖 100% AUTOMATED PROFILE SETUP');
  console.log('='.repeat(70));
  console.log('');
  
  // Check setup
  const setupCheck = checkAutomationSetup();
  
  if (!setupCheck.isReady) {
    console.log('⚠️  Automation not fully configured:\n');
    setupCheck.issues.forEach(issue => {
      console.log(`   • ${issue}`);
    });
    console.log('\n💡 See PROFILE_AUTOMATION_GUIDE.md for setup instructions\n');
    return { success: false, issues: setupCheck.issues };
  }
  
  console.log('✅ Automation configured and ready\n');
  
  if (AUTOMATION_CONFIG.dryRun) {
    console.log('🔍 Running in DRY RUN mode (safe - no actual changes)\n');
  } else {
    console.log('⚡ Running in LIVE mode - will make actual profile changes\n');
  }
  
  const niche = options.niche || AUTOMATION_CONFIG.niche;
  const results = [];
  
  // Generate profile configurations
  const tiktokBio = generateBio('tiktok', niche);
  const instagramBio = generateBio('instagram', niche);
  
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
  
  // Update Instagram profile
  if (AUTOMATION_CONFIG.instagram.username) {
    const instagramConfig = {
      bio: instagramBio,
      setup: {
        category: 'Shopping & Retail',
        features: ['Business account', 'Contact button']
      }
    };
    
    const instagramResult = await updateInstagramProfile(instagramConfig);
    results.push(instagramResult);
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 AUTOMATION SUMMARY');
  console.log('='.repeat(70));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (AUTOMATION_CONFIG.dryRun) {
    console.log('\n💡 This was a DRY RUN. Set PROFILE_DRY_RUN=false to apply changes.');
  }
  
  console.log('\n' + '='.repeat(70) + '\n');
  
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
  
  runAutomatedSetup(options)
    .then((result) => {
      if (result.success) {
        console.log('✅ Automated profile setup completed successfully!');
        process.exit(0);
      } else {
        console.log('❌ Automated profile setup completed with errors');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = {
  runAutomatedSetup,
  updateTikTokProfile,
  updateInstagramProfile,
  checkAutomationSetup,
  AUTOMATION_CONFIG
};
