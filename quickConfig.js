#!/usr/bin/env node

/**
 * Quick Config Helper
 * 
 * This script helps users quickly configure their .env file
 * for full automation with a simple Q&A interface.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function quickConfig() {
  console.clear();
  log('\n🚀 QUICK CONFIGURATION FOR FULL AUTO SETUP\n', 'bright');
  log('This will configure your .env file for one-command automation\n', 'cyan');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  // Load or create .env
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    log('Found existing .env file. Will update it.\n', 'yellow');
  } else {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
    log('Creating new .env file from template.\n', 'green');
  }
  
  log('='.repeat(70), 'bright');
  log('REQUIRED CONFIGURATION', 'bright');
  log('='.repeat(70) + '\n', 'bright');
  
  // Amazon Affiliate Tag
  const amazonTag = await question('Amazon Affiliate Tag (e.g., yourname-20): ');
  if (amazonTag.trim()) {
    envContent = envContent.replace(/AMAZON_AFFILIATE_TAG=.*/, `AMAZON_AFFILIATE_TAG=${amazonTag.trim()}`);
  }
  
  // Enable Profile Automation
  const enableAutomation = await question('\nEnable profile automation? (yes/no) [yes]: ');
  if (!enableAutomation.trim() || enableAutomation.toLowerCase().startsWith('y')) {
    envContent = envContent.replace(/PROFILE_AUTOMATION_ENABLED=.*/, 'PROFILE_AUTOMATION_ENABLED=true');
    
    log('\n' + '='.repeat(70), 'bright');
    log('TIKTOK CREDENTIALS', 'bright');
    log('='.repeat(70) + '\n', 'bright');
    
    log('💡 TIP: For TikTok, you can use EITHER session ID OR password', 'cyan');
    log('   Session ID is MORE RELIABLE and recommended!\n', 'cyan');
    
    const tiktokUsername = await question('TikTok Username: ');
    if (tiktokUsername.trim()) {
      envContent = envContent.replace(/TIKTOK_USERNAME=.*/, `TIKTOK_USERNAME=${tiktokUsername.trim()}`);
    }
    
    log('\nChoose authentication method for TikTok:', 'bright');
    log('1. Session ID (RECOMMENDED - more reliable, no 2FA issues)');
    log('2. Password (may have 2FA/captcha issues)\n');
    
    const tiktokAuthChoice = await question('Select method (1 or 2) [1]: ');
    
    if (tiktokAuthChoice === '2') {
      const tiktokPassword = await question('TikTok Password: ');
      if (tiktokPassword.trim()) {
        // Handle both commented and uncommented TIKTOK_PASSWORD lines
        if (envContent.includes('TIKTOK_PASSWORD=')) {
          envContent = envContent.replace(/^(\s*#\s*)?TIKTOK_PASSWORD=.*/m, `TIKTOK_PASSWORD=${tiktokPassword.trim()}`);
        } else {
          // Add it after TIKTOK_SESSION_ID if it doesn't exist
          envContent = envContent.replace(/(TIKTOK_SESSION_ID=.*)/, `$1\nTIKTOK_PASSWORD=${tiktokPassword.trim()}`);
        }
      }
    } else {
      log('\n📌 How to get your TikTok Session ID:', 'yellow');
      log('1. Open TikTok in browser and login', 'yellow');
      log('2. Press F12 to open Developer Tools', 'yellow');
      log('3. Go to Application → Cookies → https://www.tiktok.com', 'yellow');
      log('4. Find "sessionid" cookie and copy its value\n', 'yellow');
      
      const tiktokSessionId = await question('TikTok Session ID (or press Enter to set later): ');
      if (tiktokSessionId.trim()) {
        envContent = envContent.replace(/TIKTOK_SESSION_ID=.*/, `TIKTOK_SESSION_ID=${tiktokSessionId.trim()}`);
      } else {
        log('\n⚠️  You can add TIKTOK_SESSION_ID to .env file later', 'yellow');
      }
    }
    
    log('\n' + '='.repeat(70), 'bright');
    log('INSTAGRAM CREDENTIALS', 'bright');
    log('='.repeat(70) + '\n', 'bright');
    
    const instagramUsername = await question('Instagram Username: ');
    if (instagramUsername.trim()) {
      envContent = envContent.replace(/INSTAGRAM_USERNAME=.*/, `INSTAGRAM_USERNAME=${instagramUsername.trim()}`);
    }
    
    const instagramPassword = await question('Instagram Password (or press Enter to skip): ');
    if (instagramPassword.trim()) {
      envContent = envContent.replace(/INSTAGRAM_PASSWORD=.*/, `INSTAGRAM_PASSWORD=${instagramPassword.trim()}`);
    }
  }
  
  log('\n' + '='.repeat(70), 'bright');
  log('OPTIONAL CONFIGURATION', 'bright');
  log('='.repeat(70) + '\n', 'bright');
  
  // OpenAI API Key
  const configOpenAI = await question('Add OpenAI API key for AI content? (yes/no) [no]: ');
  if (configOpenAI.toLowerCase().startsWith('y')) {
    const openaiKey = await question('OpenAI API Key: ');
    if (openaiKey.trim()) {
      envContent = envContent.replace(/OPENAI_API_KEY=.*/, `OPENAI_API_KEY=${openaiKey.trim()}`);
    }
  }
  
  // Profile Niche
  log('\nChoose your profile niche:');
  log('1. High-Ticket (All categories - $1000+ commission)');
  log('2. Tech & Electronics');
  log('3. Home & Lifestyle');
  log('4. Fitness & Wellness\n');
  
  const nicheChoice = await question('Select niche (1-4) [1]: ');
  const nicheMap = {
    '1': 'highTicket',
    '2': 'tech',
    '3': 'home',
    '4': 'fitness'
  };
  const niche = nicheMap[nicheChoice.trim()] || 'highTicket';
  envContent = envContent.replace(/PROFILE_NICHE=.*/, `PROFILE_NICHE=${niche}`);
  
  // Dry Run
  const dryRun = await question('\nRun in DRY RUN mode first? (recommended) (yes/no) [yes]: ');
  if (!dryRun.trim() || dryRun.toLowerCase().startsWith('y')) {
    envContent = envContent.replace(/PROFILE_DRY_RUN=.*/, 'PROFILE_DRY_RUN=true');
  } else {
    envContent = envContent.replace(/PROFILE_DRY_RUN=.*/, 'PROFILE_DRY_RUN=false');
  }
  
  // Save .env
  fs.writeFileSync(envPath, envContent);
  
  log('\n' + '='.repeat(70), 'bright');
  log('✅ CONFIGURATION COMPLETE!', 'green');
  log('='.repeat(70) + '\n', 'bright');
  
  log('Your .env file has been configured.\n', 'green');
  log('🚀 Run the full auto setup with:\n', 'cyan');
  log('   npm run full-auto\n', 'bright');
  log('This will:', 'cyan');
  log('  • Validate configuration', 'cyan');
  log('  • Install dependencies', 'cyan');
  log('  • Set up profiles automatically', 'cyan');
  log('  • Generate AI content', 'cyan');
  log('  • Find high-ticket products\n', 'cyan');
  
  if (envContent.includes('PROFILE_DRY_RUN=true')) {
    log('💡 Note: Profiles will be updated in DRY RUN mode (safe)', 'yellow');
    log('   Set PROFILE_DRY_RUN=false in .env to apply actual changes\n', 'yellow');
  }
  
  rl.close();
}

quickConfig().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
