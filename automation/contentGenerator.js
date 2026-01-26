/**
 * AI Content Generator for TikTok
 * 
 * This module generates viral content scripts, hooks, and video concepts
 * using AI (OpenAI GPT-4) based on trending products and templates.
 */

// Load dotenv only if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, continue without it
}

const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Helper function to check if an error is an OpenAI quota error
 */
function isQuotaError(error) {
  return error.code === 'insufficient_quota' || (error.error && error.error.code === 'insufficient_quota');
}

/**
 * Helper function to handle OpenAI API errors with user-friendly messages
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
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in viral social media content creation for HIGH-TICKET affiliate marketing. Focus on faceless, POV-style content that justifies premium prices and drives conversions for $500+ products. Goal: $1,000/day revenue through 5-10 high-ticket sales." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2500
    });

    const content = completion.choices[0].message.content;
    
    // Try to parse JSON, fallback to structured text
    try {
      return JSON.parse(content);
    } catch (e) {
      console.log('Could not parse as JSON, returning raw content');
      return { raw: content };
    }
  } catch (error) {
    console.error('Error generating content:', error);
    handleOpenAIError(error, 'generating content ideas');
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
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert copywriter for viral short-form video content. Write scripts that hook viewers immediately and drive them to take action." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating script:', error);
    handleOpenAIError(error, 'generating script');
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
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a social media caption expert focused on driving engagement and clicks." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating caption:', error);
    handleOpenAIError(error, 'generating caption');
    throw error;
  }
}

/**
 * Save generated content to file
 */
async function saveContent(content, filename) {
  const contentDir = path.join(__dirname, '../generated-content');
  await fs.mkdir(contentDir, { recursive: true });
  
  const filepath = path.join(contentDir, filename);
  await fs.writeFile(filepath, JSON.stringify(content, null, 2));
  
  console.log(`Content saved to: ${filepath}`);
  return filepath;
}

/**
 * Main function to batch generate content
 */
async function batchGenerateContent(options = {}) {
  const {
    categories = process.env.PRODUCT_CATEGORIES?.split(',') || ['electronics', 'home', 'supplements'],
    itemsPerCategory = 5,
    outputFile = `content-batch-${Date.now()}.json`
  } = options;

  console.log('Starting content generation...');
  console.log(`Categories: ${categories.join(', ')}`);
  console.log(`Items per category: ${itemsPerCategory}`);

  const allContent = [];

  for (const category of categories) {
    console.log(`\nGenerating content for ${category}...`);
    
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
      
      // Rate limiting - wait 2 seconds between categories
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error generating content for ${category}:`, error.message);
      
      // Check for OpenAI quota error - if we hit this, stop trying other categories
      if (isQuotaError(error)) {
        console.error('\n⚠️  Stopping content generation due to API quota limit');
        break; // Exit the loop, no point trying other categories
      }
    }
  }

  console.log(`\nGenerated ${allContent.length} content pieces`);
  
  const savedPath = await saveContent(allContent, outputFile);
  return { content: allContent, filepath: savedPath };
}

// CLI execution
if (require.main === module) {
  console.log('🎬 AI Content Generator Starting...\n');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
    console.error('Please copy .env.example to .env and add your API key');
    process.exit(1);
  }

  batchGenerateContent()
    .then(result => {
      console.log('\n✅ Content generation complete!');
      console.log(`📁 Saved to: ${result.filepath}`);
      console.log(`📊 Total items: ${result.content.length}`);
    })
    .catch(error => {
      console.error('\n❌ Error:', error.message);
      
      // Provide specific guidance for quota errors
      if (isQuotaError(error)) {
        console.error('\n💡 Next Steps:');
        console.error('• Visit https://platform.openai.com/account/billing to add credits');
        console.error('• Check your usage at https://platform.openai.com/account/usage');
        console.error('• Consider upgrading your OpenAI plan if needed');
        console.error('• Make sure your payment method is valid\n');
      }
      
      process.exit(1);
    });
}

module.exports = {
  generateContentIdeas,
  generateScript,
  generateCaption,
  batchGenerateContent,
  isQuotaError,
  handleOpenAIError
};
