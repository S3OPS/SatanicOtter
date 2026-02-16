# 📚 SatanicOtter - Complete Documentation

> **AI-Powered Content Automation Toolkit for Affiliate Marketing**

**Version:** 1.0.0  
**Last Updated:** 2024-02-16  
**Repository:** [S3OPS/SatanicOtter](https://github.com/S3OPS/SatanicOtter)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start (5 Minutes)](#quick-start)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [Core Features](#core-features)
7. [Platform Alternatives](#platform-alternatives)
8. [Automation Workflows](#automation-workflows)
9. [Security & Best Practices](#security--best-practices)
10. [Troubleshooting](#troubleshooting)
11. [OpenAI API Quota Management](#openai-api-quota-management)
12. [API Reference](#api-reference)
13. [Contributing](#contributing)

---

## 🎯 Overview

SatanicOtter is a Node.js toolkit designed for Amazon affiliate marketing workflows with multi-platform content automation. The system includes:

- **AI Content Generation** - OpenAI-powered scripts, hooks, and captions
- **Product Research** - High-ticket product analysis ($100+ commissions)
- **Multi-Platform Support** - YouTube, TikTok, Vimeo, PeerTube, and more
- **Scheduling Queue** - Manual review system for content approval
- **Analytics Tracking** - Daily metrics and performance monitoring
- **Profile Automation** - Browser-based profile setup helpers
- **Security-First Design** - Path validation, secret redaction, input sanitization

### Current Capabilities

✅ Modular architecture with 13 reusable utility modules  
✅ 50% faster content generation (optimized rate limiting)  
✅ Path traversal protection for file operations  
✅ Automatic redaction of sensitive data in logs  
✅ Centralized configuration management with caching  
✅ Browser automation utilities for safer Puppeteer usage  
✅ 0 security vulnerabilities (npm audit)  
✅ 59 passing integration tests

---

## ⚡ Quick Start

Get running in 5 minutes:

### Step 1: Clone Repository
```bash
git clone https://github.com/S3OPS/SatanicOtter.git
cd SatanicOtter
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Guided Setup
```bash
npm run setup
```

The setup script will:
- Check system prerequisites
- Install required dependencies
- Guide you through API configuration
- Create your `.env` file

### Step 4: Verify Installation
```bash
npm run status
```

---

## 📋 Prerequisites

### Required Software
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **npm** (comes with Node.js)

### Required Accounts
- **Amazon Associates Account** (approved) - [Sign Up](https://affiliate-program.amazon.com/)
- **OpenAI Account** (optional, for AI features) - [Get API Key](https://platform.openai.com/)

### Optional Accounts (for automation)
- **TikTok Account** - For TikTok-specific automation
- **YouTube Account** - For YouTube automation
- **Vimeo Account** - For Vimeo automation

### Recommended Tools
- **Link-in-Bio Tool** - Stan Store, Linktree, or Beacons
- **Video Editor** - CapCut (free) - [Download](https://www.capcut.com/)

---

## 🛠️ Installation & Setup

### One-Command Setup (Recommended)

```bash
# Step 1: Quick configuration wizard
npm run quick-config

# Step 2: Full automated setup
npm run full-auto
```

This will:
1. Create `.env` file with your credentials
2. Validate configuration
3. Install dependencies (Puppeteer, etc.)
4. Set up profiles automatically
5. Generate sample AI content
6. Find high-ticket products
7. Display next steps

### Manual Setup

If you prefer manual configuration:

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials**:
   ```bash
   nano .env  # or use your favorite editor
   ```

3. **Run installation**:
   ```bash
   npm install
   ```

4. **Verify setup**:
   ```bash
   npm run status
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Amazon Affiliate Settings
AMAZON_ASSOCIATE_ID=your_associate_id
AMAZON_TRACKING_ID=your_tracking_id

# OpenAI API (for AI content generation)
OPENAI_API_KEY=sk-your-key-here

# Platform Credentials (choose one or more)
# TikTok - Use SESSION_ID (recommended) OR PASSWORD
TIKTOK_USERNAME=your_username
TIKTOK_SESSION_ID=your_session_id
# TIKTOK_PASSWORD=your_password  # Alternative to SESSION_ID

# YouTube API (optional)
YOUTUBE_API_KEY=your_youtube_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Automation Settings
PROFILE_DRY_RUN=true  # Set to false to apply changes
CONTENT_GENERATION_BATCH_SIZE=5
SCHEDULER_CHECK_INTERVAL=3600000
```

### Getting TikTok Session ID (Recommended)

**Why Session ID over Password?**
- ✅ Works with 2FA enabled
- ✅ No captcha issues
- ✅ More reliable and stable
- ✅ No account lockout risk

**How to Get Session ID:**

1. Login to TikTok on Chrome/Edge/Brave
2. Open Developer Tools (F12 or Ctrl+Shift+I)
3. Go to **Application** tab → **Cookies** → `https://www.tiktok.com`
4. Find cookie named `sessionid`
5. Copy the value
6. Add to `.env`: `TIKTOK_SESSION_ID=your_session_id_here`

### Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create new secret key
5. Copy and add to `.env`: `OPENAI_API_KEY=sk-...`

---

## 🎨 Core Features

### 1. Content Generation

Generate AI-powered content for your affiliate campaigns:

```bash
# Generate scripts, hooks, and captions
npm run generate-content
```

Features:
- AI-generated video scripts
- Engaging hooks and CTAs
- Platform-optimized captions
- Automatic content queue management

### 2. Product Research

Find high-ticket products with substantial commissions:

```bash
npm run product-research
```

Generates reports including:
- Product recommendations ($100+ commission potential)
- Niche analysis
- Competition research
- Content angle suggestions

### 3. Scheduling & Queue Management

Queue content for manual review before posting:

```bash
npm run schedule-posts
```

Features:
- Review queue in `review-queue/` directory
- Manual approval workflow
- Flexible posting schedules
- Time zone handling

### 4. Profile Automation

Automate profile setup and optimization:

```bash
# Generate profile configurations
npm run setup-profiles

# Interactive setup wizard
npm run setup-profiles:wizard

# Browser automation (dry-run by default)
npm run automate-profiles

# Browser automation (live mode - requires credentials)
npm run automate-profiles:live
```

### 5. Analytics Tracking

Track your daily metrics and performance:

```bash
# Add daily metrics
npm run analytics:add

# View summary report
npm run analytics:summary
```

### 6. Complete Automation

Run content generation and scheduling in one command:

```bash
npm run automate
```

---

## 🌐 Platform Alternatives

### Free Platforms NOT Owned by Facebook/Meta

The following platforms support automated posting and are completely independent from Facebook/Meta:

#### 1. **YouTube** ⭐ Recommended
- **Owner:** Google
- **API:** Full Data API v3 support
- **Automation:** Excellent (native API for uploads, metadata, playlists)
- **Audience:** Largest reach (2B+ users)
- **Cost:** Free with ads
- **Best For:** Long-form content, tutorials, product reviews

**Setup:**
```bash
# Add to .env
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

#### 2. **Vimeo**
- **Owner:** Independent
- **API:** Rich REST API for uploads and management
- **Automation:** Excellent (supported by major platforms)
- **Audience:** Professional/creative community
- **Cost:** Free tier available (with limits)
- **Best For:** High-quality, ad-free content

**Features:**
- Ad-free viewing
- Higher video quality
- Custom branding
- Live streaming (premium)

#### 3. **Dailymotion**
- **Owner:** Vivendi (French conglomerate)
- **API:** Public API for uploads and channel management
- **Automation:** Good (used by news/media sites)
- **Audience:** Global reach (300M+ users)
- **Cost:** Free with monetization options
- **Best For:** News-style content, international reach

#### 4. **PeerTube** 🔓 Open Source
- **Owner:** Decentralized (federated, no corporate owner)
- **API:** Full REST API + community scripts
- **Automation:** Excellent (open source flexibility)
- **Audience:** Privacy-focused users
- **Cost:** Free (self-hosted or join public instance)
- **Best For:** Privacy, independence, decentralization

**Key Benefits:**
- No corporate control
- Federation across instances
- Plugin support
- No ads
- Complete data ownership

#### 5. **BitChute**
- **Owner:** Independent
- **API:** Basic automation via third-party tools
- **Automation:** Limited (community scripts available)
- **Audience:** Free-speech focused community
- **Cost:** Free (with storage limits)
- **Best For:** Alternative content, niche communities

### Platform Comparison

| Platform | API Quality | Automation | Reach | Cost | Best For |
|----------|-------------|------------|-------|------|----------|
| **YouTube** | ⭐⭐⭐⭐⭐ | Excellent | Massive | Free | Maximum reach |
| **Vimeo** | ⭐⭐⭐⭐⭐ | Excellent | Medium | Free/Paid | Quality content |
| **Dailymotion** | ⭐⭐⭐⭐ | Good | Large | Free | Global content |
| **PeerTube** | ⭐⭐⭐⭐ | Excellent | Small | Free | Independence |
| **BitChute** | ⭐⭐ | Limited | Small | Free | Niche content |

### Integration Guide

To add support for alternative platforms:

1. **Create platform module** in `automation/services/`:
   ```javascript
   // automation/services/youtubePosting.js
   module.exports = {
     uploadVideo,
     updateMetadata,
     schedulePublish
   };
   ```

2. **Add platform configuration** to `.env`:
   ```bash
   PLATFORM=youtube  # or vimeo, dailymotion, peertube
   ```

3. **Update posting service** in `automation/services/platformPosting.js`

4. **Test with dry-run mode**:
   ```bash
   PROFILE_DRY_RUN=true npm run automate
   ```

---

## 🤖 Automation Workflows

### Daily Operations Workflow

```bash
# Morning: Generate fresh content
npm run generate-content

# Research products
npm run product-research

# Schedule posts for review
npm run schedule-posts

# Review queued content in review-queue/

# Track analytics
npm run analytics:add
```

### Full Automation (GitHub Actions)

Set up automated workflows using GitHub Actions:

1. **Add GitHub Secrets** (Repository Settings → Secrets):
   - `OPENAI_API_KEY`
   - `TIKTOK_SESSION_ID`
   - `AMAZON_ASSOCIATE_ID`
   - `YOUTUBE_API_KEY` (optional)

2. **Enable workflow** in `.github/workflows/`

3. **Configure schedule** (e.g., daily at 9 AM):
   ```yaml
   on:
     schedule:
       - cron: '0 9 * * *'
   ```

### CI/CD Pipeline

Automated testing and deployment:

```bash
# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## 🔒 Security & Best Practices

### Security Features

✅ **No Hardcoded Secrets** - All credentials in `.env`  
✅ **Automatic Secret Redaction** - Logs automatically mask API keys/passwords  
✅ **Path Traversal Protection** - File operations validate paths  
✅ **Input Sanitization** - User inputs sanitized before use  
✅ **Environment Validation** - Proper env var naming enforced

### Security Checklist

- ✅ Never commit `.env` file to Git
- ✅ Use `.env.example` as template (no real credentials)
- ✅ Add `.env` to `.gitignore`
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate API keys regularly
- ✅ Use session IDs instead of passwords
- ✅ Enable 2FA on all accounts
- ✅ Monitor API usage for anomalies
- ✅ Review `.gitignore` to exclude sensitive files

### Best Practices

**Content Generation:**
- Use manual review queue before posting
- Test with `PROFILE_DRY_RUN=true` first
- Monitor API quotas to avoid rate limits
- Cache generated content when possible

**Browser Automation:**
- Use session IDs (more reliable than passwords)
- Run headless in production
- Implement rate limiting
- Handle captcha scenarios gracefully

**API Usage:**
- Implement exponential backoff for retries
- Use proper error handling
- Monitor rate limits
- Cache responses when appropriate

**Platform Guidelines:**
- Review platform Terms of Service
- Respect rate limits
- Avoid spam-like behavior
- Use manual review for compliance

---

## 🐛 Troubleshooting

### Common Issues

#### "OPENAI_API_KEY not found"
**Cause:** Missing API key in `.env`

**Solution:**
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`
3. Restart application

#### "TikTok credentials wrong"
**Cause:** Invalid credentials or expired session

**Solution:**
1. Use `TIKTOK_SESSION_ID` instead of password
2. Get fresh session ID from browser cookies
3. Update `.env` and remove `TIKTOK_PASSWORD` if present
4. Test with dry-run: `npm run automate-profiles:dry-run`

#### "Dependencies not installed"
**Cause:** Missing npm packages

**Solution:**
```bash
npm install
```

#### "Module not found" errors
**Cause:** Incomplete installation

**Solution:**
```bash
rm -rf node_modules
npm install
```

#### Puppeteer installation issues
**Solution:**
```bash
# Force reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

#### Rate limit errors (OpenAI)
**Cause:** Too many API requests

**Solution:**
1. Wait a few minutes
2. Reduce batch size in `.env`
3. Implement longer delays between requests
4. Check OpenAI dashboard for quota limits

### Debug Mode

Enable verbose logging:

```bash
DEBUG=* npm run automate
```

### Getting Help

1. Check existing documentation
2. Review error messages carefully
3. Check `.env` configuration
4. Run `npm run status` to verify setup
5. Open GitHub issue with:
   - Error message
   - Steps to reproduce
   - System info (`node --version`, `npm --version`)

---

## 🔑 OpenAI API Quota Management

### Understanding API Costs

SatanicOtter uses the OpenAI API for content generation. Understanding and managing your quota is essential for smooth operation.

#### Pricing (as of 2024)

- **gpt-4o-mini** (default): $0.15/1M input tokens, $0.60/1M output tokens
- **gpt-4o**: $2.50/1M input tokens, $10.00/1M output tokens
- **gpt-3.5-turbo**: $0.50/1M input tokens, $1.50/1M output tokens

**Typical costs per content generation:**
- Scripts (5 items): ~$0.05-0.15 (gpt-4o-mini)
- Product research: ~$0.02-0.05
- Profile bios: ~$0.01-0.02
- **Total for `npm run full-auto`:** ~$0.10-0.25

### Checking Your Quota

#### Via OpenAI Dashboard
1. Visit [platform.openai.com/account/usage](https://platform.openai.com/account/usage)
2. View current month's usage
3. Check remaining credits

#### Via Status Command
```bash
npm run status
```
Shows:
- ✅ API key configured
- Current model in use
- Estimated costs

### Setting Up Billing

#### New Accounts (Free Trial)
- Free $5 credits for 3 months
- Expires after period or when depleted
- Sufficient for testing (~20-50 full-auto runs)

#### Paid Accounts
1. Go to [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Add payment method
3. Set usage limits (recommended)
4. Enable auto-recharge (optional)

### Managing Costs

#### 1. Use Cost-Efficient Models

**For development/testing:**
```env
OPENAI_MODEL=gpt-4o-mini  # Cheapest, fast, good quality
```

**For production:**
```env
OPENAI_MODEL=gpt-4o       # Best quality, higher cost
```

#### 2. Set Budget Limits

In your OpenAI dashboard:
1. Navigate to Settings → Limits
2. Set monthly budget (e.g., $10/month)
3. Set soft limits for alerts
4. Set hard limits to prevent overage

**Recommended limits:**
- Soft limit: $5 (alert when reached)
- Hard limit: $10 (stop API calls)

#### 3. Monitor Usage

```bash
# Check usage before generating content
npm run status

# Generate content (check cost)
npm run generate-content

# Monitor in dashboard
# Visit: platform.openai.com/account/usage
```

#### 4. Batch Operations Efficiently

```bash
# Generate all content at once (more efficient)
npm run full-auto

# Instead of multiple separate calls:
# npm run generate-content  # Call 1
# npm run product-research   # Call 2
# npm run setup-profiles     # Call 3
```

### Handling Quota Errors

#### Error: "insufficient_quota"

**Cause:** API key has no remaining credits

**Solutions:**

1. **Check your balance:**
   ```bash
   # Visit: platform.openai.com/account/billing
   ```

2. **Add payment method:**
   - Go to Billing → Payment methods
   - Add credit/debit card
   - Credits are added within minutes

3. **Upgrade your plan:**
   - Free trial → Pay-as-you-go
   - No monthly fees, pay only for usage

4. **Wait for limit reset:**
   - Rate limits reset monthly
   - Check reset date in dashboard

#### Error: "Rate limit exceeded"

**Cause:** Too many requests in a short time

**Solutions:**

1. **Wait a few seconds** and retry
2. **Use rate limiting** (automatically handled by SatanicOtter)
3. **Upgrade tier** for higher rate limits

### Cost Optimization Tips

#### 1. Use Caching (Built-in)
```javascript
// SatanicOtter automatically caches:
// - API responses (5 minutes)
// - Generated content (1 hour)
// - Product research (24 hours)
```

#### 2. Reduce Token Usage
```env
# Shorter content = lower cost
CONTENT_TONE=concise

# Fewer items per batch
BATCH_SIZE=3  # Default is 5
```

#### 3. Test with Dry Runs
```bash
# Profile automation (no API calls)
npm run automate-profiles:dry-run

# Test configuration without generation
npm run status
```

#### 4. Use Local Development
```bash
# Review existing content instead of regenerating
ls review-queue/
cat review-queue/script-1.txt
```

### Quota Monitoring Script

**Check remaining balance programmatically:**

```javascript
// In your code or a custom script
const { getEnv } = require('./automation/utils/config');
const OpenAI = require('openai');

async function checkBalance() {
  const client = new OpenAI({ apiKey: getEnv('OPENAI_API_KEY') });
  
  try {
    // OpenAI doesn't expose balance via API
    // Check dashboard: platform.openai.com/account/usage
    console.log('Visit https://platform.openai.com/account/usage');
  } catch (error) {
    console.error('Error checking balance:', error.message);
  }
}
```

### Setting Usage Alerts

#### Email Notifications
1. Go to [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Settings → Notifications
3. Enable "Usage alerts"
4. Set thresholds: 50%, 75%, 90%, 100%

#### Slack/Discord Integration
Use OpenAI's webhook notifications to send alerts to your team chat when limits are reached.

### Best Practices

1. **Start Small**
   - Test with `npm run generate-content` (single operation)
   - Monitor costs in dashboard
   - Scale up once comfortable

2. **Set Alerts Early**
   - Configure soft limits before going live
   - Receive alerts at 50% usage

3. **Review Generated Content**
   - Check quality before generating more
   - Adjust prompts to reduce regeneration

4. **Track ROI**
   ```bash
   # Compare API costs vs. affiliate revenue
   npm run analytics:summary
   ```

5. **Cache Aggressively**
   - SatanicOtter caches by default
   - Don't regenerate content unnecessarily

### Emergency: Out of Credits

**Quick fix:**

1. **Add payment method immediately**
   - Visit: platform.openai.com/account/billing
   - Add card → Credits available in ~5 minutes

2. **Use alternative API key**
   ```bash
   # Create new key: platform.openai.com/api-keys
   # Update .env
   OPENAI_API_KEY=sk-new-key-here
   ```

3. **Temporarily use GPT-3.5 Turbo**
   ```env
   # Cheaper alternative
   OPENAI_MODEL=gpt-3.5-turbo
   ```

### API Key Security

⚠️ **Never share or commit your API keys**

```bash
# Check .gitignore includes .env
cat .gitignore | grep .env

# Rotate keys if exposed
# Visit: platform.openai.com/api-keys
# Revoke old key → Create new key
```

### Support Resources

- **Billing Issues:** [help.openai.com](https://help.openai.com)
- **API Status:** [status.openai.com](https://status.openai.com)
- **Rate Limits:** [platform.openai.com/docs/guides/rate-limits](https://platform.openai.com/docs/guides/rate-limits)
- **Pricing:** [openai.com/pricing](https://openai.com/pricing)

---

## 📖 API Reference

### Core Commands

```bash
# Setup & Configuration
npm run setup              # Guided setup wizard
npm run quick-config       # Quick configuration
npm run full-auto          # Full automated setup
npm run status             # Check system status

# Content & Automation
npm run generate-content   # Generate AI content
npm run product-research   # Find products
npm run schedule-posts     # Schedule content
npm run automate          # Generate + schedule

# Profile Management
npm run setup-profiles            # Generate configs
npm run setup-profiles:wizard     # Interactive wizard
npm run automate-profiles         # Browser automation (dry-run)
npm run automate-profiles:dry-run # Dry-run mode
npm run automate-profiles:live    # Live mode

# Analytics
npm run analytics:add      # Add daily metrics
npm run analytics:summary  # View summary

# Testing & Quality
npm test                   # Run tests
npm run lint              # Check code style
npm run lint:fix          # Fix linting issues
```

### Module Structure

```
automation/
├── index.js                 # Main automation orchestrator
├── contentGenerator.js      # AI content generation
├── productResearch.js       # Product research
├── scheduler.js             # Content scheduling
├── profileSetup.js          # Profile configuration
├── profileAutomation.js     # Browser automation
├── analyticsTracker.js      # Analytics tracking
├── services/
│   ├── contentQueue.js      # Queue management
│   └── platformPosting.js   # Multi-platform posting
└── utils/
    ├── config.js            # Configuration management
    ├── logger.js            # Logging utilities
    ├── security.js          # Security utilities
    ├── fileOps.js           # File operations
    ├── openaiService.js     # OpenAI abstraction
    ├── browserAutomation.js # Puppeteer helpers
    ├── cache.js             # Caching layer
    ├── rateLimiter.js       # Rate limiting
    ├── errorHandler.js      # Error handling
    ├── validators.js        # Input validation
    ├── formatters.js        # Data formatting
    ├── healthCheck.js       # System health
    └── metrics.js           # Performance metrics
```

### Configuration Options

All options are set via `.env` file. See `.env.example` for complete list.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests: `npm test`
6. Run linter: `npm run lint:fix`
7. Commit changes
8. Push and create Pull Request

### Code Style

- Use ESLint configuration (`.eslintrc.js`)
- Follow existing patterns
- Add JSDoc comments for functions
- Write tests for new features
- Keep functions focused (under 50 lines)

### Security Guidelines

- Never commit secrets or credentials
- Use environment variables for config
- Validate all inputs
- Sanitize user data
- Follow principle of least privilege

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## 🎓 Additional Resources

### Platform Documentation
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Vimeo API](https://developer.vimeo.com/)
- [Dailymotion API](https://developers.dailymotion.com/)
- [PeerTube API](https://docs.joinpeertube.org/api-rest-reference.html)

### Affiliate Marketing
- [Amazon Associates Help](https://affiliate-program.amazon.com/help)
- [Affiliate Marketing Guide](https://neilpatel.com/what-is-affiliate-marketing/)

### Tools & Libraries
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Puppeteer Documentation](https://pptr.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Built with ❤️ by the SatanicOtter Team**

*"One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them."*
