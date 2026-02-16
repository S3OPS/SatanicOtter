/**
 * OpenAI Service
 * Centralized OpenAI API interactions with error handling
 */

const { getEnv } = require('./config');
const OpenAI = require('openai');

let openaiInstance = null;

/**
 * Get or create OpenAI instance (singleton pattern for efficiency)
 */
function getOpenAIClient() {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: getEnv('OPENAI_API_KEY')
    });
  }
  return openaiInstance;
}

/**
 * Check if an error is an OpenAI quota error
 */
function isQuotaError(error) {
  // Check various possible error formats from OpenAI API
  return error.code === 'insufficient_quota' || 
         error.status === 429 ||
         (error.error && error.error.code === 'insufficient_quota') ||
         (error.error && error.error.type === 'insufficient_quota');
}

/**
 * Handle OpenAI API errors with user-friendly messages
 */
function handleOpenAIError(error, context = '') {
  if (isQuotaError(error)) {
    console.error('\n❌ OpenAI API Quota Exceeded');
    console.error('─'.repeat(60));
    console.error('Your OpenAI API key has exceeded its quota limit.');
    if (context) {
      console.error(`Context: ${context}`);
    }
    console.error('\n💡 How to fix:');
    console.error('1. Check your billing: https://platform.openai.com/account/billing');
    console.error('2. Add payment method or upgrade your plan');
    console.error('3. Review usage: https://platform.openai.com/account/usage');
    console.error('4. Consider using a different API key\n');
    console.error('📚 More info: https://platform.openai.com/docs/guides/error-codes/api-errors');
    console.error('─'.repeat(60));
  }
}

/**
 * Generate completion with standardized error handling
 */
async function generateCompletion(messages, options = {}) {
  const {
    model = getEnv('OPENAI_MODEL', 'gpt-4o-mini'),
    temperature = 0.8,
    max_tokens = 2500
  } = options;
  
  const client = getOpenAIClient();
  
  try {
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    handleOpenAIError(error, options.context);
    throw error;
  }
}

/**
 * Attempt to parse JSON from AI response
 */
function parseAIResponse(content) {
  try {
    return JSON.parse(content);
  } catch (_e) {
    return { raw: content };
  }
}

module.exports = {
  getOpenAIClient,
  isQuotaError,
  handleOpenAIError,
  generateCompletion,
  parseAIResponse
};
