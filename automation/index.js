/**
 * Main Automation Controller
 * 
 * This is the main entry point for the full automation system.
 * It coordinates content generation and posting scheduling.
 */

const { loadEnv, getEnv, getEnvArray } = require('./utils/config');
const { info, error: logError, section } = require('./utils/logger');
const { batchGenerateContent, isQuotaError, handleOpenAIError } = require('./contentGenerator');
const { start: startScheduler } = require('./scheduler');

loadEnv();

const AUTOMATION_CONFIG = {
  generateOnStart: true,
  autoSchedule: true,
  contentBatchSize: 15 // Generate 15 pieces of content at a time
};

/**
 * Main automation flow
 */
async function runAutomation() {
  section('SatanicOtter Social Media Automation System');
  
  try {
    let contentFile = null;
    
    // Step 1: Generate content if enabled
    if (AUTOMATION_CONFIG.generateOnStart) {
      info('Automation', 'Step 1: Generating AI content...');
      
      const categories = getEnvArray('PRODUCT_CATEGORIES', ['electronics', 'home', 'supplements']);
      
      const result = await batchGenerateContent({
        categories,
        itemsPerCategory: Math.ceil(AUTOMATION_CONFIG.contentBatchSize / categories.length),
        outputFile: `auto-content-${Date.now()}.json`
      });
      
      contentFile = result.filepath;
      
      info('Automation', 'Content generation complete!');
      info('Automation', `Generated ${result.content.length} content pieces`);
      info('Automation', `Saved to: ${contentFile}`);
      
      // Wait a moment before scheduling
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Step 2: Start scheduler
    if (AUTOMATION_CONFIG.autoSchedule) {
      info('Automation', 'Step 2: Starting post scheduler...');
      await startScheduler(contentFile);
    } else {
      info('Automation', 'Automation complete!');
      info('Automation', 'To schedule posts, run: npm run schedule-posts');
      process.exit(0);
    }
    
  } catch (error) {
    logError('Automation', `Automation error: ${error.message}`);
    
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
  
  section('Environment Check');
  
  let hasErrors = false;
  
  // Check required
  required.forEach(key => {
    if (getEnv(key)) {
      info('Environment', `${key}: configured`);
    } else {
      logError('Environment', `${key}: MISSING (required)`);
      hasErrors = true;
    }
  });
  
  // Check recommended
  recommended.forEach(key => {
    if (getEnv(key)) {
      info('Environment', `${key}: configured`);
    } else {
      console.log(`⚠️  ${key}: not configured (recommended for posting)`);
    }
  });
  
  console.log('\n');
  
  if (hasErrors) {
    logError('Environment', 'Missing required environment variables');
    logError('Environment', 'Please configure .env file (see .env.example)');
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
