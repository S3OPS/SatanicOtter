/**
 * Profile Setup Automation for TikTok
 * 
 * This module helps automatically configure your TikTok profile
 * to match the efficiency of the auto system for affiliate marketing.
 * 
 * It sets up:
 * - Optimized bio text (for conversions)
 * - Profile and cover images
 * - Link-in-bio configuration
 * - Category/niche settings
 * - Business account setup
 */

// Load dotenv only if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, continue without it
}

const fs = require('fs').promises;
const path = require('path');

// Profile optimization templates based on high-ticket affiliate marketing
const BIO_TEMPLATES = {
  tiktok: {
    highTicket: [
      "💰 $1000+ commission products\n🎯 Tech, Home, Fitness deals\n⬇️ Shop high-value finds",
      "🔥 Premium product reviews\n💎 High-ticket affiliate finds\n🛒 Link below for best deals",
      "⚡ Testing $500-$2500 products\n📈 Honest reviews & deals\n👇 Shop premium finds",
      "💻 Tech & Home essentials\n🎁 $100+ commission items\n🔗 Best deals in bio"
    ],
    tech: [
      "🎮 Gaming & Tech Reviews\n💰 Premium deals ($1000+)\n⬇️ Shop latest tech",
      "📱 Tech enthusiast\n💎 High-end product finds\n🛒 Exclusive deals below"
    ],
    home: [
      "🏡 Home & Lifestyle finds\n💰 Premium quality products\n⬇️ Transform your space",
      "✨ Home essentials & upgrades\n🎁 Luxury for less\n👇 Shop the collection"
    ],
    fitness: [
      "💪 Fitness gear reviews\n🏋️ Premium equipment finds\n⬇️ Level up your workouts",
      "🎯 Fitness & wellness\n💎 High-quality gear\n👇 Shop pro equipment"
    ]
  }
};

// Link-in-bio optimization
const LINK_IN_BIO_CONFIG = {
  structure: {
    priority: [
      'Current Hot Deal (Top Product)',
      'Shop All Products',
      'Best Sellers (Top 3-5)',
      'New Arrivals',
      'Categories (Electronics, Home, Fitness)',
      'Email Newsletter (optional)'
    ],
    tips: [
      'Update top link weekly with best performer',
      'Use urgency badges (Sale, Limited, New)',
      'Add emojis for visual appeal',
      'Track clicks to optimize order',
      'Keep titles short (3-5 words max)'
    ]
  },
  tools: {
    recommended: [
      {
        name: 'Stan Store',
        url: 'https://stan.store',
        features: ['Built-in shopping', 'Email collection', 'Analytics'],
        cost: '$29/month',
        bestFor: 'Full creator monetization'
      },
      {
        name: 'Linktree',
        url: 'https://linktr.ee',
        features: ['Easy setup', 'Analytics', 'Multiple links'],
        cost: 'Free + Paid tiers',
        bestFor: 'Simple link management'
      },
      {
        name: 'Beacons',
        url: 'https://beacons.ai',
        features: ['Store + links', 'Media kit', 'Fan support'],
        cost: 'Free tier available',
        bestFor: 'All-in-one solution'
      }
    ]
  }
};

// Profile picture and branding recommendations
const BRANDING_GUIDE = {
  profilePicture: {
    tips: [
      'Use high-contrast colors for visibility',
      'Keep it simple and recognizable',
      'Avoid text (hard to read at small size)',
      'Match color scheme across platforms',
      'Use logo or niche-relevant icon'
    ],
    tools: [
      'Canva (templates available)',
      'Looka (AI logo generator)',
      'Figma (advanced design)'
    ]
  },
  coverImage: {
    tips: [
      'Include your value proposition',
      'Add call-to-action ("Shop Deals")',
      'Use brand colors consistently',
      'Keep text minimal and large',
      'Update seasonally for relevance'
    ]
  },
  colorScheme: {
    recommended: [
      { name: 'Premium Gold', colors: ['#FFD700', '#000000', '#FFFFFF'] },
      { name: 'Tech Blue', colors: ['#0066FF', '#00CCFF', '#FFFFFF'] },
      { name: 'Luxury Purple', colors: ['#6B46C1', '#9F7AEA', '#FFFFFF'] },
      { name: 'Modern Coral', colors: ['#FF6B6B', '#4ECDC4', '#FFFFFF'] }
    ]
  }
};

/**
 * Generate optimized bio text based on niche
 */
function generateBio(platform, niche = 'highTicket') {
  const templates = BIO_TEMPLATES[platform]?.[niche] || BIO_TEMPLATES[platform]?.highTicket || [];
  
  if (templates.length === 0) {
    return null;
  }
  
  // Return random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

/**
 * Create profile setup configuration
 */
async function createProfileConfig(options = {}) {
  const {
    niche = 'highTicket',
    linkInBioUrl = null,
    customBio = null
  } = options;

  const config = {
    timestamp: new Date().toISOString(),
    platforms: {
      tiktok: {
        bio: customBio || generateBio('tiktok', niche),
        niche: niche,
        username: process.env.TIKTOK_USERNAME || '[Set tiktok username in .env]',
        linkInBio: linkInBioUrl || '[Set up link-in-bio tool and add URL here]',
        setup: {
          accountType: 'Regular Account',
          category: getNicheCategory(niche),
          contactOptions: ['Email'],
          features: getRecommendedFeatures()
        }
      }
    },
    branding: BRANDING_GUIDE,
    linkInBio: LINK_IN_BIO_CONFIG
  };

  return config;
}

/**
 * Get recommended category based on niche
 */
function getNicheCategory(niche) {
  const categories = {
    highTicket: 'Shopping & Retail',
    tech: 'Electronics',
    home: 'Home & Garden',
    fitness: 'Fitness & Sports',
    professional: 'Business & Economy'
  };
  
  return categories[niche] || 'Shopping & Retail';
}

/**
 * Get platform-specific recommended features
 */
function getRecommendedFeatures() {
  return [
    'Add website link in bio',
    'Enable TikTok Shop (if available in region)',
    'Set up Creator Fund (1000+ followers, 10k+ views)',
    'Enable product links in videos',
    'Join TikTok Creator Marketplace'
  ];
}

/**
 * Save profile configuration to file
 */
async function saveProfileConfig(config, filename = 'profile-setup.json') {
  const configDir = path.join(__dirname, '../profile-configs');
  await fs.mkdir(configDir, { recursive: true });
  
  const filepath = path.join(configDir, filename);
  await fs.writeFile(filepath, JSON.stringify(config, null, 2));
  
  console.log(`Profile configuration saved to: ${filepath}`);
  return filepath;
}

/**
 * Display profile setup instructions
 */
function displaySetupInstructions(config) {
  console.log(`\n${'='.repeat(70)}`);
  console.log('🎯 PROFILE SETUP INSTRUCTIONS');
  console.log('='.repeat(70));
  
  Object.entries(config.platforms).forEach(([platform, settings]) => {
    console.log(`\n📱 ${platform.toUpperCase()} SETUP:`);
    console.log('-'.repeat(70));
    
    console.log('\n1️⃣  Account Settings:');
    console.log(`   Username: ${settings.username}`);
    console.log(`   Account Type: ${settings.setup.accountType}`);
    console.log(`   Category: ${settings.setup.category}`);
    
    console.log('\n2️⃣  Bio Text (copy this):');
    console.log(`   ┌${'─'.repeat(68)}┐`);
    settings.bio.split('\n').forEach(line => {
      console.log(`   │ ${line.padEnd(67)}│`);
    });
    console.log(`   └${'─'.repeat(68)}┘`);
    
    console.log('\n3️⃣  Link in Bio:');
    console.log(`   ${settings.linkInBio}`);
    
    console.log('\n4️⃣  Recommended Features to Enable:');
    settings.setup.features.forEach((feature, idx) => {
      console.log(`   ${idx + 1}. ${feature}`);
    });
    
    console.log('');
  });
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('🎨 BRANDING RECOMMENDATIONS');
  console.log('='.repeat(70));
  
  console.log('\n📸 Profile Picture:');
  config.branding.profilePicture.tips.forEach((tip, idx) => {
    console.log(`   ${idx + 1}. ${tip}`);
  });
  
  console.log('\n🎨 Recommended Color Schemes:');
  config.branding.colorScheme.recommended.forEach((scheme, idx) => {
    console.log(`   ${idx + 1}. ${scheme.name}: ${scheme.colors.join(', ')}`);
  });
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('🔗 LINK-IN-BIO SETUP');
  console.log('='.repeat(70));
  
  console.log('\n📋 Recommended Structure (top to bottom):');
  config.linkInBio.structure.priority.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ${item}`);
  });
  
  console.log('\n💡 Optimization Tips:');
  config.linkInBio.structure.tips.forEach((tip) => {
    console.log(`   • ${tip}`);
  });
  
  console.log('\n🛠️  Recommended Tools:');
  config.linkInBio.tools.recommended.forEach((tool, idx) => {
    console.log(`   ${idx + 1}. ${tool.name} (${tool.cost})`);
    console.log(`      → ${tool.bestFor}`);
    console.log(`      → ${tool.url}`);
  });
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ NEXT STEPS:');
  console.log('='.repeat(70));
  console.log('\n1. Update your profile bio on each platform (copy from above)');
  console.log('2. Set up link-in-bio tool (Stan Store, Linktree, or Beacons)');
  console.log('3. Create/upload profile picture (use Canva templates)');
  console.log('4. Enable recommended features on each platform');
  console.log('5. Add Amazon affiliate links to link-in-bio tool');
  console.log('6. Start posting content using: npm run generate-content');
  console.log(`\n${'='.repeat(70)}`);
  console.log('');
}

/**
 * Main setup function
 */
async function setupProfiles(options = {}) {
  console.log('🚀 Starting Profile Setup Automation...\n');
  
  // Check for required environment variables
  const tiktokUsername = process.env.TIKTOK_USERNAME;
  if (!tiktokUsername) {
    console.warn('⚠️  No usernames found in .env file');
    console.warn('Add TIKTOK_USERNAME to .env for personalization\n');
  }
  
  // Create profile configuration
  const config = await createProfileConfig(options);
  
  // Save configuration
  const configPath = await saveProfileConfig(config);
  
  // Display setup instructions
  displaySetupInstructions(config);
  
  return {
    config,
    configPath,
    success: true
  };
}

/**
 * Interactive setup wizard
 */
async function runSetupWizard() {
  console.log(`\n${'='.repeat(70)}`);
  console.log('🎯 PROFILE SETUP WIZARD');
  console.log('='.repeat(70));
  console.log('\nThis wizard will help you set up your TikTok profile');
  console.log('for maximum efficiency with the affiliate marketing automation system.\n');
  
  // Note: For a fully interactive experience, you could use readline to prompt for niche
  // For now, this wizard uses the default high-ticket niche
  // Future enhancement: Add readline prompts for niche selection
  
  const niche = 'highTicket';
  console.log('Generating optimized profile configuration for high-ticket niche...\n');
  
  // Run setup
  await setupProfiles({ niche });
  
  console.log('✅ Profile setup complete!');
  console.log('Check the instructions above and profile-configs/ folder for details.\n');
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const isWizard = args.includes('--wizard') || args.includes('-w');
  
  if (isWizard) {
    runSetupWizard()
      .then(() => {
        console.log('Setup wizard completed successfully!');
        process.exit(0);
      })
      .catch(error => {
        console.error('Error running setup wizard:', error.message);
        process.exit(1);
      });
  } else {
    // Extract options from command line
    const options = {};
    
    // Parse niche
    const nicheIndex = args.indexOf('--niche');
    if (nicheIndex !== -1 && args[nicheIndex + 1]) {
      options.niche = args[nicheIndex + 1];
    }
    
    setupProfiles(options)
      .then(() => {
        console.log('✅ Profile setup completed successfully!');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Error setting up profiles:', error.message);
        process.exit(1);
      });
  }
}

module.exports = {
  setupProfiles,
  createProfileConfig,
  generateBio,
  saveProfileConfig,
  displaySetupInstructions,
  runSetupWizard,
  BIO_TEMPLATES,
  LINK_IN_BIO_CONFIG,
  BRANDING_GUIDE
};
