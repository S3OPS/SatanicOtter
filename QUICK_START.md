# 🚀 Quick Start Guide

Get SatanicOtter running in 5 minutes or less.

## Prerequisites

Before you start, ensure you have:
- **Node.js** v14 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **OpenAI API Key** ([get one](https://platform.openai.com/api-keys))

## Installation

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/S3OPS/SatanicOtter.git
cd SatanicOtter

# Install dependencies
npm install
```

### Step 2: Run Setup Wizard

```bash
npm run setup
```

The setup wizard will:
- Create your `.env` configuration file
- Prompt you for required API keys
- Set up default preferences
- Validate your configuration

### Step 3: Verify Installation

```bash
npm run status
```

This checks that everything is configured correctly.

## Your First Content Generation

Generate AI-powered content for your niche:

```bash
npm run generate-content
```

This will:
- Use OpenAI to create engaging scripts
- Generate hooks and call-to-action phrases
- Create captions optimized for social media
- Save everything to the `review-queue/` folder

## Quick Commands

### Content Creation
```bash
npm run generate-content    # AI scripts, hooks, captions
npm run product-research    # High-ticket product analysis
npm run schedule-posts      # Queue content for review
```

### Analytics
```bash
npm run analytics:add       # Log today's metrics
npm run analytics:summary   # View performance summary
```

### Profile Setup
```bash
npm run setup-profiles              # Generate profile configs
npm run setup-profiles:wizard       # Interactive profile setup
npm run automate-profiles:dry-run   # Test profile automation (safe)
```

### One-Command Automation
```bash
# Quick configuration
npm run quick-config

# Full automation setup
npm run full-auto
```

## Next Steps

### 1. Review Generated Content
Check the `review-queue/` folder for AI-generated content:
```bash
ls review-queue/
```

### 2. Customize Configuration
Edit `.env` to fine-tune settings:
```bash
nano .env  # or use your favorite editor
```

Key settings:
- `OPENAI_MODEL`: Choose your AI model (default: gpt-4o-mini)
- `PRODUCT_NICHE`: Your target niche (e.g., "fitness", "tech")
- `CONTENT_TONE`: Desired tone (e.g., "engaging", "professional")

### 3. Explore Platform Alternatives
TikTok isn't the only option! See [PLATFORM_ALTERNATIVES.md](./PLATFORM_ALTERNATIVES.md) for:
- YouTube (maximum reach)
- Vimeo (quality content)
- PeerTube (decentralized)
- And more...

### 4. Set Up Automation
Configure scheduling for automated content posting:
```bash
npm run schedule-posts
```

By default, content goes to `review-queue/` for manual approval.

## Common Issues

### "OpenAI API Key not found"
**Solution:** Run `npm run setup` again and enter your API key.

### "Insufficient quota"
**Solution:** Check your OpenAI billing at [platform.openai.com/account/billing](https://platform.openai.com/account/billing)

### "Module not found"
**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

For more troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Advanced Features

### Profile Automation
Automate profile setup with browser automation:
```bash
# Safe mode (no changes made)
npm run automate-profiles:dry-run

# Live mode (applies changes)
PROFILE_DRY_RUN=false npm run automate-profiles:live
```

**Note:** Requires Puppeteer and valid credentials in `.env`

### Content Scheduling
Set up cron-based scheduling:
```bash
# Edit the scheduler configuration
nano automation/scheduler.js

# Test the scheduler
npm run schedule-posts
```

### Custom Workflows
Create your own automation pipeline:
```bash
# Generate content, then schedule it
npm run generate-content && npm run schedule-posts
```

## Project Structure

```
SatanicOtter/
├── automation/           # Core automation scripts
│   ├── contentGenerator.js
│   ├── productResearch.js
│   ├── scheduler.js
│   ├── analyticsTracker.js
│   ├── utils/           # Utility modules
│   └── services/        # Service integrations
├── test/                # Integration tests
├── review-queue/        # Generated content (manual review)
├── index.html          # Amazon affiliate link generator
└── .env                # Your configuration (not in git)
```

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to git
- Keep your API keys secret
- Use environment variables for all credentials
- Review the [SECURITY_REPORT.md](./SECURITY_REPORT.md) for details

## Getting Help

Need assistance?

1. **Check the docs:**
   - [Complete Documentation](./DOCUMENTATION.md)
   - [Troubleshooting Guide](./TROUBLESHOOTING.md)
   - [Security Report](./SECURITY_REPORT.md)

2. **Open an issue:** [GitHub Issues](https://github.com/S3OPS/SatanicOtter/issues)

3. **Review examples:** Check `review-queue/` for sample outputs

## What's Next?

Now that you're up and running:

1. ✅ Generate your first content
2. ✅ Review and refine
3. ✅ Choose your platform(s)
4. ✅ Set up automation
5. ✅ Track your metrics

For detailed guidance on each step, see the [Complete Documentation](./DOCUMENTATION.md).

---

**Happy automating! 🎯**

*SatanicOtter - AI-Powered Content Automation for Affiliate Marketing*
