# 🚀 Complete Setup Guide - $1,000/Day TikTok & Instagram Automation

This guide will walk you through setting up the complete automation system to reach $1,000/day in affiliate revenue.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [API Configuration](#api-configuration)
4. [Running the System](#running-the-system)
5. [Daily Operations](#daily-operations)
6. [Scaling to $1,000+/day](#scaling-to-1000day)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ **Amazon Associates Account** (approved) - [Sign Up](https://affiliate-program.amazon.com/)
- ✅ **TikTok Account** (can start with personal, upgrade to business later)
- ✅ **Instagram Business Account** (required for API access)
- ✅ **OpenAI Account** with API access - [Get API Key](https://platform.openai.com/)

### Software Requirements
- ✅ **Node.js 16+** - [Download](https://nodejs.org/)
- ✅ **Python 3.8+** - [Download](https://www.python.org/)
- ✅ **Git** - [Download](https://git-scm.com/)

### Recommended Tools
- ✅ **Link-in-Bio Tool** (Stan Store, Linktree, or Beacons)
- ✅ **Video Editor** (CapCut - free) - [Download](https://www.capcut.com/)
- ✅ **Canva Pro** (for templates) - [Sign Up](https://www.canva.com/)

---

## Initial Setup

### Step 0: Verify Prerequisites

**IMPORTANT:** Before proceeding, verify that you have installed all required software:

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm is available
npm --version

# Check Python version (should be 3.8+)
python --version
# or on some systems:
python3 --version

# Check pip is available
pip --version
# or on some systems:
pip3 --version

# Check Git is installed
git --version
```

**If any command returns "command not found":**
- **Node.js/npm not found:** Install from [nodejs.org](https://nodejs.org/)
- **Python/pip not found:** Install from [python.org](https://www.python.org/)
- **Git not found:** Install from [git-scm.com](https://git-scm.com/)

After installing, **restart your terminal** before continuing.

---

### Step 1: Clone the Repository

**Run each command separately** (press Enter after each line):

```bash
git clone https://github.com/S3OPS/SatanicOtter.git
```

Then navigate into the directory:

```bash
cd SatanicOtter
```

**Note:** If you see "fatal: destination path 'SatanicOtter' already exists", the repository is already cloned. Just run `cd SatanicOtter` to enter the directory.

---

### Step 2: Install Dependencies

**Run each command separately** (press Enter after each line):

```bash
# Install Node.js dependencies
npm install
```

Then install Python dependencies:

```bash
# Install Python dependencies
pip install -r requirements.txt
```

**Note:** On some systems, you may need to use `pip3` instead of `pip`:
```bash
pip3 install -r requirements.txt
```

---

### Step 3: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use your preferred editor
```

### Step 4: Run Product Research
```bash
# Generate high-ticket product recommendations
npm run product-research
```

This will create a report showing:
- Products with $100+ commission potential
- Best categories for 8-10% commission
- How many sales needed for $1,000/day
- Prioritized product list

---

## API Configuration

### OpenAI API (Required)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create new secret key
4. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-...your-key-here
   ```

### Amazon Associates (Required)
1. Log into [Amazon Associates](https://affiliate-program.amazon.com/)
2. Find your Associate Tag (format: `yourname-20`)
3. Add to `.env`:
   ```
   AMAZON_AFFILIATE_TAG=yourname-20
   ```

### TikTok (Optional - for auto-posting)
For manual posting, skip this. For automation:
1. Get session ID from browser cookies
2. Add to `.env`:
   ```
   TIKTOK_SESSION_ID=your_session_id
   TIKTOK_USERNAME=your_username
   ```

### Instagram (Optional - for auto-posting)
For manual posting, skip this. For automation:
1. Convert to Business Account
2. Get Facebook Graph API credentials
3. Add to `.env`:
   ```
   INSTAGRAM_USERNAME=your_username
   INSTAGRAM_PASSWORD=your_app_password
   ```

---

## Running the System

### Option 1: Manual Mode (Recommended for Beginners)

**Step 1: Generate Content Ideas**
```bash
npm run generate-content
```
This creates AI-generated scripts, hooks, and video concepts in `generated-content/` folder.

**Step 2: Create Videos Manually**
- Use the generated scripts
- Record with CapCut or similar
- Use faceless POV style (hands, products, screen recordings)
- Export as vertical video (9:16 ratio)

**Step 3: Post Manually**
- Post to TikTok and Instagram Reels
- Use generated captions and hashtags
- Add link in bio
- Post at optimal times (see guide)

**Step 4: Track Results**
```bash
npm run analytics:add
```
Enter daily metrics to track progress toward $1,000/day.

**Step 5: View Analytics**
```bash
npm run analytics:summary
```
See weekly performance and recommendations.

---

### Option 2: Semi-Automated Mode

**Step 1: Generate & Schedule Content**
```bash
# Generate content and queue it up
npm run automate
```

**Step 2: Manual Review**
Check `review-queue/` folder for generated content before posting.

**Step 3: Approve & Post**
Videos are posted at scheduled times after approval.

---

### Option 3: Full Automation (Advanced)

Enable in `.env`:
```
AUTO_POST=true
MANUAL_REVIEW=false
```

Then run:
```bash
npm run automate
```

System will:
1. Generate content based on high-ticket products
2. Schedule posts for optimal times
3. Auto-post to TikTok and Instagram
4. Track performance
5. Optimize based on results

⚠️ **Warning:** Start with manual mode to learn what works before enabling full automation.

---

## Daily Operations

### Morning Routine (15 minutes)
```bash
# 1. Check yesterday's performance
npm run analytics:summary

# 2. Review top-performing content
# Check TikTok/Instagram analytics

# 3. Update link-in-bio
# Move best sellers to top positions
```

### Content Creation (2-3 hours, once per week)
```bash
# Generate new content batch
npm run generate-content

# Create 20-30 videos for the week
# Schedule them in advance
```

### Evening Check (10 minutes)
```bash
# Track today's metrics
npm run analytics:add

# Engage with comments
# Check for sales in Amazon Associates dashboard
```

---

## Scaling to $1,000+/Day

### Week 1-2: Foundation ($100-300/day)
**Focus:** Learning what works
- Post 3 videos/day manually
- Test different product categories
- Identify winning hooks
- Build 5,000-10,000 followers

**Checklist:**
- [ ] Amazon Associates approved
- [ ] Posted first 20 videos
- [ ] Link-in-bio set up
- [ ] First sale achieved
- [ ] Analytics tracking started

---

### Week 3-4: Optimization ($300-600/day)
**Focus:** Double down on winners
- Post 5 videos/day
- Focus on best-performing categories
- Implement semi-automation
- Grow to 20,000-30,000 followers

**Checklist:**
- [ ] Identified top 3 product categories
- [ ] Created 50+ videos total
- [ ] Achieving 50,000+ daily views
- [ ] Getting 3-5 sales/day
- [ ] $50+ average commission

---

### Week 5-8: Scale ($600-1,000/day)
**Focus:** Systematic scaling
- Post 5-7 videos/day
- Batch create content weekly
- Focus only on high-ticket items ($1,000+)
- Target $200+ commission per sale
- Grow to 50,000+ followers

**Checklist:**
- [ ] Batch creation system working
- [ ] Consistent 5 posts/day
- [ ] 100,000+ daily views
- [ ] 5-10 sales/day
- [ ] Hit $1,000 in a single day

---

### Week 9-12: Optimization ($1,000-2,000+/day)
**Focus:** Efficiency and growth
- Post 7-10 videos/day
- Consider 2nd account (different niche)
- Outsource video editing
- Focus on scaling winners
- 100,000+ followers

**Checklist:**
- [ ] Consistent $1,000+/day for 7 days
- [ ] Identified 10+ winning products
- [ ] Automation running smoothly
- [ ] Growing 5,000+ followers/week
- [ ] Planning expansion strategy

---

## Revenue Tracking

### Daily Metrics to Monitor
Use the analytics tracker:
```bash
npm run analytics:add
```

**Enter these metrics:**
- Videos posted (goal: 5)
- Total views (goal: 50,000+)
- Profile visits (goal: 2,500+)
- Link clicks (goal: 1,000+)
- Amazon clicks (goal: 500+)
- Sales (goal: 5-10)
- Revenue (goal: $1,000+)

### Weekly Review
```bash
npm run analytics:summary 7
```

**Review:**
- Total weekly revenue vs $7,000 goal
- Best performing videos
- Top selling products
- Conversion rates
- Areas for improvement

---

## Troubleshooting

### "command not found" Errors

**Problem:** You see errors like `npm: command not found` or `pip: command not found`

**Solutions:**
1. **Verify Installation:** Make sure you've installed the required software:
   - Node.js from [nodejs.org](https://nodejs.org/)
   - Python from [python.org](https://www.python.org/)
   
2. **Restart Terminal:** After installing software, close and reopen your terminal

3. **Check PATH:** The software may be installed but not in your system PATH
   - On Windows: Search for "Environment Variables" and verify Node.js and Python are in PATH
   - On Mac/Linux: Check `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`

4. **Use Full Paths:** If PATH isn't configured, use full paths (examples, actual paths may vary):
   - Windows: `C:\Program Files\nodejs\npm.exe install` (or check `C:\Program Files (x86)\nodejs\`)
   - Mac: `/usr/local/bin/npm install` (or `/opt/homebrew/bin/npm` for Apple Silicon)

5. **Try Alternative Commands:**
   - Use `python3` instead of `python`
   - Use `pip3` instead of `pip`

### "destination path already exists" Error

**Problem:** `fatal: destination path 'SatanicOtter' already exists and is not an empty directory`

**Solutions:**
1. **Directory Already Exists:** The repository is already cloned
   - Just run: `cd SatanicOtter`
   - Skip the `git clone` command

2. **Want Fresh Clone:** If you need a fresh copy:
   ```bash
   # Option 1: Rename existing directory (safer)
   mv SatanicOtter SatanicOtter.backup
   
   # Then clone again
   git clone https://github.com/S3OPS/SatanicOtter.git
   cd SatanicOtter
   
   # Option 2: Remove existing directory (WARNING: permanently deletes everything)
   rm -rf SatanicOtter
   
   # Then clone again
   git clone https://github.com/S3OPS/SatanicOtter.git
   cd SatanicOtter
   ```

### "Not Getting Views"
**Solutions:**
- Use trending sounds (TikTok > Discover > Trending)
- Post at optimal times (6:30 AM, 12:30 PM, 8:00 PM EST)
- Improve hooks (first 2 seconds crucial)
- Check video quality (1080p minimum)
- Use relevant hashtags (10-15 per post)

### "Getting Views But No Clicks"
**Solutions:**
- Stronger call-to-action in videos
- Optimize bio copy
- Add urgency ("Limited time", "Sale ends soon")
- Pin comment with link reminder
- Test different hooks

### "Getting Clicks But No Sales"
**Solutions:**
- Choose better products (4+ stars, 500+ reviews)
- Focus on higher-ticket items
- Improve product demonstration
- Add trust signals (reviews, unboxing)
- Verify Amazon links work correctly

### "Low Average Commission"
**Solutions:**
- Run product research tool
- Focus on $1,000+ products
- Avoid low-commission categories (<4%)
- Target 8-10% commission categories
- Use furniture, home, sports categories

---

## Best Practices

### Content Quality
✅ 1080p minimum resolution
✅ Vertical format (9:16 ratio)
✅ Clear audio (music not too loud)
✅ Good lighting (natural or ring light)
✅ Steady footage (tripod or stabilization)

### Posting Strategy
✅ Post at optimal times (see guide)
✅ Use trending sounds
✅ Engage with comments (first 30 minutes)
✅ Consistent posting (don't skip days)
✅ Track what works (analytics)

### Product Selection
✅ $500-$2,500 price range
✅ 8-10% commission rate
✅ $100+ commission per sale
✅ 4+ star rating
✅ 500+ reviews
✅ Prime eligible
✅ In stock

### Conversion Optimization
✅ Strong hooks (first 2 seconds)
✅ Clear value proposition
✅ Social proof (reviews, bestseller)
✅ Urgency (limited stock, sale)
✅ Easy CTA (link in bio)

---

## Success Metrics

### Minimum Viable Success (Week 4)
- 20,000 followers
- 30,000 views/day
- $200-400/day revenue
- 3-5% engagement rate

### Target Success (Week 8)
- 50,000 followers
- 50,000 views/day
- $1,000/day revenue
- 5%+ engagement rate

### Scaling Success (Week 12)
- 100,000+ followers
- 100,000+ views/day
- $2,000+/day revenue
- 7%+ engagement rate

---

## Additional Resources

### Documentation
- [TikTok Instagram Guide](./TIKTOK_INSTAGRAM_GUIDE.md) - Complete strategy guide
- [Main README](./README.md) - Amazon link generator tool

### Tools
- [CapCut](https://www.capcut.com/) - Free video editor
- [Canva](https://www.canva.com/) - Design templates
- [Amazon Associates](https://affiliate-program.amazon.com/) - Affiliate dashboard
- [TikTok Analytics](https://www.tiktok.com/analytics/) - Native analytics

### Support
- Check GitHub Issues for common problems
- Review analytics for optimization tips
- Use product research tool weekly

---

## Quick Command Reference

```bash
# Product Research
npm run product-research          # Find high-ticket products

# Content Generation
npm run generate-content          # Generate AI scripts

# Posting Automation
npm run schedule-posts            # Schedule posts
npm run automate                  # Full automation

# Analytics
npm run analytics:add             # Add daily metrics
npm run analytics:summary         # View summary (7 days)
npm run analytics:summary 30      # View 30-day summary

# Testing
npm run test                      # Run tests
```

---

## Next Steps

1. ✅ Complete initial setup
2. ✅ Run product research
3. ✅ Generate first content batch
4. ✅ Create first 5 videos
5. ✅ Post and track results
6. ✅ Optimize based on data
7. ✅ Scale to $1,000/day

**Remember:** Consistency beats perfection. Start posting, track results, and optimize based on data.

Good luck! 🚀
