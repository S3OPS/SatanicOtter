/**
 * AI Content Generator for TikTok
 * 
 * This module generates viral content scripts, hooks, and video concepts
 * using AI (OpenAI GPT-4) based on trending products and templates.
 */

const { loadEnv, getEnv, getEnvArray } = require('./utils/config');
const { saveJSON } = require('./utils/fileOps');
const { info, error: logError, section } = require('./utils/logger');
const { 
  generateCompletion, 
  isQuotaError, 
  handleOpenAIError, 
  parseAIResponse 
} = require('./utils/openaiService');
const path = require('path');

loadEnv();

// Viral hook templates
const HOOK_TEMPLATES = [
  "POV: You found the solution to {problem}",
  "Stop buying {expensive_item} when this exists",
  "I was today years old when I discovered this",
  "Why didn't anyone tell me about this sooner?",
  "This ${price} item changed my life",
  "When I discovered {product} exists",
  "Me explaining why you NEED this",
  "Running to grab this before it sells out",
  "The way this changed everything",
  "Nobody talks about this enough"
];

// Product categories with high-ticket focus
const PRODUCT_CATEGORIES = {
  electronics: {
    keywords: ['gaming laptop', 'high-end monitor', 'camera equipment', 'smart home system', 'audio system'],
    priceRange: '$500-$2500',
    avgCommission: '8-10%',
    targetCommission: '$100-250'
  },
  home: {
    keywords: ['premium mattress', 'espresso machine', 'robot vacuum high-end', 'office chair ergonomic', 'air purifier'],
    priceRange: '$400-$2000',
    avgCommission: '10-12%',
    targetCommission: '$80-240'
  },
  fitness: {
    keywords: ['treadmill', 'exercise bike', 'home gym system', 'rowing machine', 'smart fitness equipment'],
    priceRange: '$600-$2500',
    avgCommission: '8-10%',
    targetCommission: '$100-250'
  },
  professional: {
    keywords: ['power tools set', 'DJ equipment', 'photography lighting', 'video production', 'music equipment'],
    priceRange: '$500-$2500',
    avgCommission: '8-10%',
    targetCommission: '$80-250'
  }
};

/**
 * Generate content ideas using AI with high-ticket focus
 */
async function generateContentIdeas(category, count = 5) {
  const categoryData = PRODUCT_CATEGORIES[category] || PRODUCT_CATEGORIES.electronics;
  const products = categoryData.keywords;
  
  const prompt = `Generate ${count} viral TikTok content ideas for HIGH-TICKET affiliate marketing ($1,000/day revenue goal).

Category: ${category}
Products: ${products.join(', ')}
Price Range: ${categoryData.priceRange}
Target Commission per Sale: ${categoryData.targetCommission}

FOCUS: High-ticket items ($500-$2,500) that can generate $100+ commission per sale.

For each idea, provide:
1. Hook (first 2 seconds) - emphasize value/ROI
2. Script outline (25-30 seconds) - show premium quality
3. Value justification (why worth the price)
4. Call-to-action (strong urgency)
5. Suggested hashtags
6. Expected commission amount

Format as JSON array with fields: hook, script, valueJustification, cta, hashtags, productPrice, expectedCommission`;

  try {
    const content = await generateCompletion([
      { 
        role: "system", 
        content: "You are an expert in viral social media content creation for HIGH-TICKET affiliate marketing. Focus on faceless, POV-style content that justifies premium prices and drives conversions for $500+ products. Goal: $1,000/day revenue through 5-10 high-ticket sales." 
      },
      { role: "user", content: prompt }
    ], {
      temperature: 0.8,
      max_tokens: 2500,
      context: 'generating content ideas'
    });
    
    return parseAIResponse(content);
  } catch (error) {
    logError('ContentGenerator', `Error generating content: ${error.message}`);
    throw error;
  }
}

/**
 * Generate script for a specific product
 */
async function generateScript(productName, productPrice, productBenefit) {
  const randomHook = HOOK_TEMPLATES[Math.floor(Math.random() * HOOK_TEMPLATES.length)];
  
  const prompt = `Create a 25-second viral video script for TikTok promoting this product:

Product: ${productName}
Price: $${productPrice}
Main Benefit: ${productBenefit}

Use this hook template: "${randomHook}"

Format:
[0-2s] Hook: 
[3-10s] Build-up:
[11-20s] Demonstration:
[21-25s] CTA:

Make it conversational, exciting, and focused on the transformation/benefit.`;

  try {
    return await generateCompletion([
      { 
        role: "system", 
        content: "You are an expert copywriter for viral short-form video content. Write scripts that hook viewers immediately and drive them to take action." 
      },
      { role: "user", content: prompt }
    ], {
      temperature: 0.9,
      max_tokens: 500,
      context: 'generating script'
    });
  } catch (error) {
    logError('ContentGenerator', `Error generating script: ${error.message}`);
    throw error;
  }
}

/**
 * Generate caption with hashtags
 */
async function generateCaption(productName, hook) {
  const prompt = `Create a short, engaging TikTok caption for this product video:

Product: ${productName}
Video Hook: ${hook}

Requirements:
- 1-2 sentences max
- Include 8-12 relevant hashtags
- Add emoji
- End with "Link in bio 🔗"
- Make it curiosity-driven`;

  try {
    return await generateCompletion([
      { role: "system", content: "You are a social media caption expert focused on driving engagement and clicks." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 200,
      context: 'generating caption'
    });
  } catch (error) {
    logError('ContentGenerator', `Error generating caption: ${error.message}`);
    throw error;
  }
}

/**
 * Main function to batch generate content
 */
async function batchGenerateContent(options = {}) {
  const {
    categories = getEnvArray('PRODUCT_CATEGORIES', ['electronics', 'home', 'supplements']),
    itemsPerCategory = 5,
    outputFile = `content-batch-${Date.now()}.json`
  } = options;

  section('Starting content generation');
  info('ContentGenerator', `Categories: ${categories.join(', ')}`);
  info('ContentGenerator', `Items per category: ${itemsPerCategory}`);

  const allContent = [];

  for (const category of categories) {
    info('ContentGenerator', `Generating content for ${category}...`);
    
    try {
      const ideas = await generateContentIdeas(category, itemsPerCategory);
      
      if (Array.isArray(ideas)) {
        for (const idea of ideas) {
          allContent.push({
            category,
            ...idea,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        allContent.push({
          category,
          content: ideas,
          timestamp: new Date().toISOString()
        });
      }
      
      // Rate limiting - wait 1 second between categories (optimized from 2s)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      logError('ContentGenerator', `Error generating content for ${category}: ${error.message}`);
      
      // Check for OpenAI quota error - if we hit this, stop trying other categories
      if (isQuotaError(error)) {
        logError('ContentGenerator', 'Stopping content generation due to API quota limit');
        break;
      }
    }
  }

  info('ContentGenerator', `Generated ${allContent.length} content pieces`);
  
  const savedPath = await saveJSON(allContent, path.join(__dirname, '../generated-content', outputFile));
  return { content: allContent, filepath: savedPath };
}

// CLI execution
if (require.main === module) {
  section('AI Content Generator Starting');
  
  if (!getEnv('OPENAI_API_KEY')) {
    logError('ContentGenerator', 'OPENAI_API_KEY not found in environment variables');
    logError('ContentGenerator', 'Please copy .env.example to .env and add your API key');
    process.exit(1);
  }

  (async () => {
    try {
      const result = await batchGenerateContent();
      info('ContentGenerator', 'Content generation complete!');
      info('ContentGenerator', `Saved to: ${result.filepath}`);
      info('ContentGenerator', `Total items: ${result.content.length}`);
    } catch (error) {
      logError('ContentGenerator', error.message);
      
      // Provide specific guidance for quota errors
      if (isQuotaError(error)) {
        console.error('\n💡 Next Steps:');
        console.error('• Visit https://platform.openai.com/account/billing to add credits');
        console.error('• Check your usage at https://platform.openai.com/account/usage');
        console.error('• Consider upgrading your OpenAI plan if needed');
        console.error('• Make sure your payment method is valid\n');
      }
      
      process.exit(1);
    }
  })();
}

module.exports = {
  generateContentIdeas,
  generateScript,
  generateCaption,
  batchGenerateContent,
  isQuotaError,
  handleOpenAIError
};
