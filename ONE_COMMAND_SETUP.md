# ⚡ One-Command Setup

The fastest way to get SatanicOtter running. Two commands, and you're ready to go.

## TL;DR

```bash
npm run quick-config && npm run full-auto
```

That's it! 🎉

## What Happens?

### Command 1: `npm run quick-config`

**Duration:** ~30 seconds

This command:
1. ✅ Checks if `.env` exists
2. ✅ Prompts for essential configuration (if needed)
3. ✅ Sets up OpenAI API key
4. ✅ Configures default niche and preferences
5. ✅ Validates the configuration

**What you'll be asked:**
- Your OpenAI API key (required)
- Product niche (e.g., "fitness", "tech", "beauty")
- Content tone (e.g., "casual", "professional", "enthusiastic")

**Output:**
```
✅ Configuration created: .env
✅ OpenAI API key configured
✅ Niche set to: fitness
✅ Ready to generate content!
```

### Command 2: `npm run full-auto`

**Duration:** ~2-5 minutes

This command runs a complete automation workflow:

1. **Environment Check** ✅
   - Validates Node.js version
   - Checks OpenAI API key
   - Verifies required directories

2. **Content Generation** 🤖
   - Creates 3-5 AI-powered scripts
   - Generates engaging hooks
   - Creates social media captions
   - Saves to `review-queue/`

3. **Product Research** 🔍
   - Finds high-ticket products in your niche
   - Calculates commission potential
   - Generates product descriptions

4. **Profile Setup** 👤
   - Creates profile configuration templates
   - Generates optimized bios for multiple platforms
   - Sets up default posting schedules

5. **Analytics Setup** 📊
   - Initializes analytics tracking
   - Creates daily metrics template
   - Sets up reporting structure

**Final Output:**
```
🎉 Full Automation Setup Complete!

Generated Content:
  ✅ 5 scripts in review-queue/
  ✅ 3 product research reports
  ✅ Profile configs for 4 platforms
  ✅ Analytics tracking ready

Next Steps:
  1. Review content in review-queue/
  2. Edit .env to customize settings
  3. Run: npm run schedule-posts
```

## Step-by-Step Breakdown

### If you prefer to see what's happening:

```bash
# Step 1: Quick configuration
npm run quick-config
```

**Prompts:**
```
? Enter your OpenAI API key: sk-...
? What's your product niche? fitness
? Preferred content tone? engaging
```

```bash
# Step 2: Full automation
npm run full-auto
```

**Progress:**
```
🔍 Checking environment...
✅ Node.js version: v18.17.0
✅ OpenAI API key: configured
✅ Directories: created

🤖 Generating content...
✅ Generated: script-1.txt
✅ Generated: script-2.txt
✅ Generated: script-3.txt

🔍 Researching products...
✅ Found 5 high-ticket items
✅ Total commission potential: $500+

👤 Setting up profiles...
✅ TikTok profile config created
✅ YouTube profile config created
✅ Bio templates generated

📊 Initializing analytics...
✅ Tracking system ready
✅ Daily metrics template created

🎉 Setup complete!
```

## What You Get

After running both commands, you'll have:

### 📁 Directory Structure
```
SatanicOtter/
├── .env                    # Your configuration
├── review-queue/           # Generated content
│   ├── script-1.txt
│   ├── script-2.txt
│   └── script-3.txt
├── profiles/               # Profile configs
│   ├── tiktok-config.json
│   └── youtube-config.json
├── analytics/              # Metrics tracking
│   └── daily-metrics.json
└── product-research/       # Research reports
    └── fitness-products.json
```

### 🎯 Ready-to-Use Content
- **Scripts:** 3-5 AI-generated video scripts
- **Hooks:** Attention-grabbing opening lines
- **Captions:** Optimized social media captions
- **CTAs:** Call-to-action phrases

### 📋 Configuration Files
- **Profiles:** Pre-configured for TikTok, YouTube, Vimeo
- **Analytics:** Daily metrics tracking template
- **Products:** High-ticket items with commission data

## Customization After Setup

### Edit Configuration
```bash
# Edit your .env file
nano .env  # or use your favorite editor
```

Key settings to customize:
```env
# API Keys
OPENAI_API_KEY=sk-your-key-here

# Content Settings
PRODUCT_NICHE=fitness
CONTENT_TONE=engaging
OPENAI_MODEL=gpt-4o-mini

# Platform Settings
TARGET_PLATFORM=tiktok
PROFILE_DRY_RUN=true

# Scheduling
SCHEDULE_TIME=10:00
POSTS_PER_DAY=3
```

### Generate More Content
```bash
# Generate additional content
npm run generate-content

# Research more products
npm run product-research
```

### Review Your Content
```bash
# List generated content
ls review-queue/

# View a script
cat review-queue/script-1.txt

# Edit before posting
nano review-queue/script-1.txt
```

## Skip the Wizard?

If you already have a `.env` file and want to regenerate everything:

```bash
# Full automation only (skips config prompts)
npm run full-auto
```

This uses your existing configuration and regenerates all content.

## What If Something Fails?

### OpenAI API Error
**Error:** `OpenAI API key not found`

**Fix:**
```bash
# Run quick-config again
npm run quick-config

# Or manually edit .env
echo "OPENAI_API_KEY=sk-your-key" >> .env
```

### Insufficient Quota
**Error:** `OpenAI API quota exceeded`

**Fix:**
1. Check billing: https://platform.openai.com/account/billing
2. Add payment method or upgrade plan
3. Try again once quota is restored

### Module Not Found
**Error:** `Cannot find module 'openai'`

**Fix:**
```bash
# Reinstall dependencies
npm install

# Then try again
npm run full-auto
```

## Advanced: Custom Automation Flow

Want more control? Run individual steps:

```bash
# 1. Configuration
npm run quick-config

# 2. Content generation only
npm run generate-content

# 3. Product research only
npm run product-research

# 4. Profile setup only
npm run setup-profiles:wizard

# 5. Analytics setup
npm run analytics:add
```

## Comparison: Manual vs. One-Command

### Manual Setup (Traditional Way)
```bash
npm install                    # Install dependencies
npm run setup                  # Interactive setup (5 mins)
npm run generate-content       # Generate content
npm run product-research       # Research products
npm run setup-profiles         # Set up profiles
npm run analytics:add          # Initialize analytics
```
**Total time:** ~15-20 minutes

### One-Command Setup (Fast Way)
```bash
npm run quick-config && npm run full-auto
```
**Total time:** ~3-5 minutes

**Difference:** 75% faster! ⚡

## After Setup: What's Next?

### 1. Review Generated Content
```bash
# Check what was created
ls review-queue/
cat review-queue/script-1.txt
```

### 2. Test Automation
```bash
# Dry run (no actual posting)
npm run automate-profiles:dry-run
```

### 3. Schedule Posts
```bash
# Queue content for posting
npm run schedule-posts
```

### 4. Track Metrics
```bash
# Log daily performance
npm run analytics:add

# View summary
npm run analytics:summary
```

## Need More Help?

- **Complete guide:** [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Platform options:** [PLATFORM_ALTERNATIVES.md](./PLATFORM_ALTERNATIVES.md)
- **Security info:** [SECURITY_REPORT.md](./SECURITY_REPORT.md)

## Pro Tips

1. **Run quick-config first** - It's faster and creates a minimal `.env`
2. **Review before posting** - Always check `review-queue/` content
3. **Start with dry-run** - Test automation safely
4. **Track your metrics** - Use analytics to measure success
5. **Customize gradually** - Start with defaults, refine over time

---

**Ready? Let's go!**

```bash
npm run quick-config && npm run full-auto
```

🎯 **Happy automating!**

*SatanicOtter - From zero to automated content in minutes*
