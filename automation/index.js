/**
 * Main Automation Controller
 * 
 * This is the main entry point for the full automation system.
 * It coordinates content generation and posting scheduling.
 */

// Load dotenv only if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, continue without it
}

const { batchGenerateContent, isQuotaError, handleOpenAIError } = require('./contentGenerator');
const { start: startScheduler } = require('./scheduler');

const AUTOMATION_CONFIG = {
  generateOnStart: true,
  autoSchedule: true,
  contentBatchSize: 15 // Generate 15 pieces of content at a time
};

/**
 * Main automation flow
 */
async function runAutomation() {
  console.log('🎬 SatanicOtter Social Media Automation System');
  console.log('='.repeat(60));
  console.log('\n');
  
  try {
    let contentFile = null;
    
    // Step 1: Generate content if enabled
    if (AUTOMATION_CONFIG.generateOnStart) {
      console.log('📝 Step 1: Generating AI content...\n');
      
      const categories = process.env.PRODUCT_CATEGORIES?.split(',') || 
                        ['electronics', 'home', 'supplements'];
      
      const result = await batchGenerateContent({
        categories,
        itemsPerCategory: Math.ceil(AUTOMATION_CONFIG.contentBatchSize / categories.length),
        outputFile: `auto-content-${Date.now()}.json`
      });
      
      contentFile = result.filepath;
      
      console.log('\n✅ Content generation complete!');
      console.log(`Generated ${result.content.length} content pieces`);
      console.log(`Saved to: ${contentFile}\n`);
      
      // Wait a moment before scheduling
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Step 2: Start scheduler
    if (AUTOMATION_CONFIG.autoSchedule) {
      console.log('📅 Step 2: Starting post scheduler...\n');
      await startScheduler(contentFile);
    } else {
      console.log('\n✅ Automation complete!');
      console.log('To schedule posts, run: npm run schedule-posts');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Automation error:', error.message);
    
    // Check for OpenAI quota error
    if (isQuotaError(error)) {
      handleOpenAIError(error, 'running automation');
    } else {
      console.error('\nTroubleshooting:');
      console.error('1. Ensure .env file is configured with API keys');
      console.error('2. Check that all dependencies are installed (npm install)');
      console.error('3. Verify API keys are valid');
    }
    
    process.exit(1);
  }
}

/**
 * Health check
 */
function checkEnvironment() {
  const required = ['OPENAI_API_KEY'];
  const recommended = ['TIKTOK_SESSION_ID'];
  
  console.log('🔍 Environment Check:\n');
  
  let hasErrors = false;
  
  // Check required
  required.forEach(key => {
    if (process.env[key]) {
      console.log(`✅ ${key}: configured`);
    } else {
      console.log(`❌ ${key}: MISSING (required)`);
      hasErrors = true;
    }
  });
  
  // Check recommended
  recommended.forEach(key => {
    if (process.env[key]) {
      console.log(`✅ ${key}: configured`);
    } else {
      console.log(`⚠️  ${key}: not configured (recommended for posting)`);
    }
  });
  
  console.log('\n');
  
  if (hasErrors) {
    console.error('❌ Missing required environment variables');
    console.error('Please configure .env file (see .env.example)\n');
    return false;
  }
  
  return true;
}

// CLI execution
if (require.main === module) {
  // Check environment
  if (!checkEnvironment()) {
    process.exit(1);
  }
  
  // Run automation
  runAutomation();
}

module.exports = {
  runAutomation,
  checkEnvironment
};
