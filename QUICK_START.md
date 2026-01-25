# ⚡ Quick Start - Get Running in 5 Minutes

## 🚀 One-Command Setup

Get your $1,000/day affiliate marketing automation system running with a single command!

### Prerequisites

Make sure you have:
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Step 1: Clone Repository

```bash
git clone https://github.com/S3OPS/SatanicOtter.git
cd SatanicOtter
```

### Step 2: Run Automated Setup

```bash
npm run setup
```

That's it! The setup script will:
- ✅ Check your system prerequisites
- ✅ Install all required dependencies
- ✅ Guide you through API configuration
- ✅ Create your .env file
- ✅ Run an initial test
- ✅ Show you next steps

---

## 🎯 What You'll Need

The setup wizard will ask for:

### Required
- **Amazon Affiliate Tag** - Get from [Amazon Associates](https://affiliate-program.amazon.com/)
  - Format: `yourname-20`
  - Required for creating affiliate links

### Optional (for AI content generation)
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/)
  - Enables AI-powered video script generation
  - Can skip and add later

### Optional (for auto-posting)
- **TikTok Credentials** - Username and session ID
- **Instagram Credentials** - Username and password
- Can skip and post manually

---

## 📋 After Setup

Once setup completes, you can immediately:

### 1. Setup Your Social Media Profiles (NEW!)
```bash
npm run setup-profiles
# or for interactive wizard:
npm run setup-profiles:wizard
```
Generates optimized bio text, branding guidelines, and link-in-bio structure for TikTok & Instagram.

### 2. Find High-Commission Products
```bash
npm run product-research
```
Identifies products with $100+ commission potential.

### 3. Generate AI Content (if OpenAI key configured)
```bash
npm run generate-content
```
Creates viral video scripts, hooks, and captions.

### 4. Track Your Analytics
```bash
npm run analytics:add
```
Log daily metrics toward your $1,000/day goal.

### 5. Schedule Posts (if social media configured)
```bash
npm run schedule-posts
```
Automatically posts 5x/day at optimal times.

### 6. Full Automation
```bash
npm run automate
```
Run the complete workflow end-to-end.

---

## 📖 Learn More

- **[PROFILE_SETUP_GUIDE.md](./PROFILE_SETUP_GUIDE.md)** - Optimize your TikTok & Instagram profiles
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and configuration
- **[TIKTOK_INSTAGRAM_GUIDE.md](./TIKTOK_INSTAGRAM_GUIDE.md)** - Complete monetization strategy
- **[EXAMPLE_WORKFLOW.md](./EXAMPLE_WORKFLOW.md)** - Real-world example
- **[README.md](./README.md)** - Project overview

---

## 🎬 Quick Video Tutorial

### Manual Mode (Recommended for Beginners)
1. Run `npm run product-research` to find products
2. Run `npm run generate-content` to get AI scripts
3. Create videos manually using the scripts
4. Post to TikTok/Instagram manually
5. Track results with `npm run analytics:add`

### Semi-Automated Mode (After Learning)
1. Run `npm run automate` to generate and queue content
2. Review generated content
3. Approve and auto-post at scheduled times
4. Analytics tracked automatically

### Full Automation (Advanced)
1. Set `AUTO_POST=true` in `.env`
2. Run `npm run automate`
3. System handles everything
4. Monitor with `npm run analytics:summary`

---

## 🎯 Your Goal: $1,000/Day

The system is designed to help you reach $1,000/day through:

**Strategy:**
- Focus on high-ticket products ($500-$2,500)
- Target 8-10% commission rates
- Achieve $100-$250 per sale
- Need only 5-10 sales/day

**Timeline:**
- **Week 1-2:** Learn what works ($100-300/day)
- **Week 3-4:** Optimize winners ($300-600/day)
- **Week 5-8:** Scale to $1,000/day
- **Week 9-12:** Maintain and grow ($1,000-2,000+/day)

---

## ❓ Troubleshooting

### "command not found" Error
Make sure Node.js is installed:
```bash
node --version  # Should show v16 or higher
npm --version   # Should show v7 or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### OpenAI API Quota Error
If you see "insufficient_quota" error:

**Symptoms:**
```
Error: You exceeded your current quota, please check your plan and billing details.
```

**Solution:**
1. Visit [OpenAI Billing Dashboard](https://platform.openai.com/account/billing)
2. Add a payment method or purchase credits
3. Verify your billing details are up to date
4. Check your [usage dashboard](https://platform.openai.com/account/usage)

**Notes:**
- Free tier has limited credits that expire
- Pay-as-you-go requires valid payment method
- Monitor usage to avoid unexpected costs
- Consider GPT-4o-mini (cheaper) vs GPT-4 (more expensive)

### Setup Script Fails
Try manual installation:
```bash
npm install
cp .env.example .env
nano .env  # Edit with your API keys
```

### Need Help?
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section
2. Review [EXAMPLE_WORKFLOW.md](./EXAMPLE_WORKFLOW.md) for step-by-step guide
3. Check GitHub Issues for common problems

---

## 🔥 Ready to Start?

```bash
# Run the automated setup
npm run setup

# Then start with product research
npm run product-research
```

**Let's get to $1,000/day!** 🚀
