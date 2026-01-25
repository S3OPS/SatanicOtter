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
    
    const tiktokUsername = await question('TikTok Username: ');
    if (tiktokUsername.trim()) {
      envContent = envContent.replace(/TIKTOK_USERNAME=.*/, `TIKTOK_USERNAME=${tiktokUsername.trim()}`);
    }
    
    const tiktokPassword = await question('TikTok Password (or press Enter to skip): ');
    if (tiktokPassword.trim()) {
      envContent = envContent.replace(/TIKTOK_PASSWORD=.*/, `TIKTOK_PASSWORD=${tiktokPassword.trim()}`);
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
