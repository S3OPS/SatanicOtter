# 🚀 One-Command Automation Setup

## Run Everything with a Single Command

This system provides a **one-command automation runner** that sets up your affiliate marketing tooling. It does not auto-upload videos; the scheduler queues review items for manual posting.

---

## ⚡ Quick Start (2 Commands)

### Step 1: Configure (Interactive Q&A)
```bash
npm run quick-config
```

This will ask you a few questions and create your `.env` file automatically.

### Step 2: Run Full Auto Setup
```bash
npm run full-auto
```

That's it! The system will:
- ✅ Validate your configuration
- ✅ Install necessary dependencies (Puppeteer, etc.)
- ✅ Set up your TikTok & Instagram profiles automatically
- ✅ Generate AI content (if OpenAI configured)
- ✅ Find high-ticket products ($100+ commission)
- ✅ Display summary and next steps

---

## 🎯 What Gets Automated

### Profile Setup
- **TikTok Profile**
  - Updates bio with optimized text
  - Sets category to "Shopping & Retail"
  - Configures for affiliate marketing
  
- **Instagram Profile**
  - Updates bio with conversion-optimized text
  - Configures Business/Creator settings
  - Sets up contact options

### Content Generation
- Creates viral video scripts using AI
- Generates hooks for 5+ videos
- Provides hashtag recommendations
- Saves to `generated-content/` folder

### Product Research
- Identifies high-ticket products ($500-$2500)
- Finds items with $100+ commission
- Targets 8-10% commission rates
- Saves recommendations

---

## 🔧 Configuration Options

### Minimal Configuration (Required)
```env
AMAZON_AFFILIATE_TAG=yourname-20
PROFILE_AUTOMATION_ENABLED=true
TIKTOK_USERNAME=your_tiktok_username
TIKTOK_SESSION_ID=your_session_id
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_password
```
Use `TIKTOK_SESSION_ID` for TikTok automation (more reliable than password-based login). See [TIKTOK_CREDENTIALS_GUIDE.md](./TIKTOK_CREDENTIALS_GUIDE.md) for details.

### Full Configuration (Recommended)
```env
# Required
AMAZON_AFFILIATE_TAG=yourname-20
PROFILE_AUTOMATION_ENABLED=true

# Social Media
TIKTOK_USERNAME=your_tiktok_username
TIKTOK_SESSION_ID=your_session_id
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_password

# AI Content (Optional)
OPENAI_API_KEY=sk-your-key-here

# Profile Settings
PROFILE_NICHE=highTicket
PROFILE_DRY_RUN=true
```

---

## 📋 Manual Setup Alternative

If you prefer step-by-step control:

### 1. Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 2. Run Individual Steps
```bash
# Profile setup
npm run automate-profiles

# Generate content
npm run generate-content

# Product research
npm run product-research
```

---

## 🔒 Safety Features

### Dry Run Mode (Default)
By default, profile automation runs in **dry run mode**:
- ✅ Shows what would be changed
- ✅ No actual profile modifications
- ✅ Safe for testing

To apply actual changes:
```env
PROFILE_DRY_RUN=false
```

### Configuration Validation
The system validates:
- ✅ Required credentials present
- ✅ API keys format correct
- ✅ Dependencies available
- ✅ Warns about missing optional features

---

## 🎬 Example Output

```
🔥 FULL AUTO SETUP - One Command to Rule Them All 🔥

Complete Affiliate Marketing Automation Setup
Goal: $1,000/day through high-ticket Amazon products

======================================================================
Step 1: Validating Configuration
======================================================================

Required Configuration:
✅ AMAZON_AFFILIATE_TAG: Required for affiliate links
✅ PROFILE_AUTOMATION_ENABLED: Must be "true" for automation runner

Profile Automation Configuration:
✅ TIKTOK_USERNAME: TikTok username
✅ TIKTOK_SESSION_ID: TikTok session ID (recommended)
✅ INSTAGRAM_USERNAME: Instagram username
✅ INSTAGRAM_PASSWORD: Instagram password

======================================================================
Step 2: Installing Dependencies
======================================================================

✅ Puppeteer already installed

======================================================================
Step 3: Automated Profile Setup
======================================================================

🤖 100% AUTOMATED PROFILE SETUP
✅ Automation configured and ready
🔍 Running in DRY RUN mode (safe - no actual changes)

🎬 Updating TikTok profile...
Would update TikTok profile with:
  Username: your_username
  Bio: 💰 $1000+ commission products
       🎯 Tech, Home, Fitness deals
       ⬇️ Shop high-value finds

📸 Updating Instagram profile...
Would update Instagram profile with:
  Username: your_username
  Bio: 💰 Premium Product Curator | $1000+ Commission Finds
       🎯 Tech • Home • Fitness
       👇 Shop High-Value Deals

✅ Successful: 2
❌ Failed: 0

======================================================================
Step 4: Generating AI Content
======================================================================

📝 Generating viral content scripts...
✅ Generated 15 content pieces
✅ Saved to: generated-content/

======================================================================
Step 5: Product Research
======================================================================

🔍 Finding high-ticket products with $100+ commission...
✅ Found 25 products matching criteria
✅ Product research complete

======================================================================
🎉 Full Auto Setup Complete!
======================================================================

Your affiliate marketing automation system is now configured!

✅ COMPLETED STEPS:
1. Configuration validated
2. Dependencies installed
3. Profile setup complete
4. Content generated
5. Product research complete

🚀 NEXT STEPS:

📱 Social Media Profiles:
   • Check your TikTok profile for updated bio
   • Check your Instagram profile for updated bio
   • Review profile-configs/ folder for configuration

📝 Content Creation:
   • Review generated content in generated-content/ folder
   • Create videos using the AI-generated scripts

📊 Analytics:
   • Start tracking: npm run analytics:add
   • View summary: npm run analytics:summary

🎯 GOAL: $1,000/day through high-ticket Amazon affiliate marketing
```

---

## 🛠️ Troubleshooting

### "Missing required configuration"
**Solution:** Run `npm run quick-config` to set up your `.env` file

### "Puppeteer not installed"
**Solution:** The system will install it automatically, or run:
```bash
npm install puppeteer
```

### "Profile automation failed" or "TikTok credentials wrong"
**Problem:** You're getting an error about TikTok password or credentials being wrong

**Solution - Use TIKTOK_SESSION_ID (Recommended):**

TikTok authentication works best with a session ID rather than password. Here's how to get it:

1. **Open TikTok in your browser** and login to your account
2. **Press F12** to open Developer Tools
3. **Go to Application tab** (Chrome) or Storage tab (Firefox)
4. **Click on Cookies** → `https://www.tiktok.com`
5. **Find the "sessionid" cookie** and copy its entire value
6. **Add to your .env file:**
   ```env
   TIKTOK_SESSION_ID=paste_your_session_id_here
   ```
7. **Comment out or remove** TIKTOK_PASSWORD if you have it set

**Why SESSION_ID instead of PASSWORD?**
- ✅ More reliable and doesn't trigger bot detection
- ✅ No 2FA or captcha issues
- ✅ Works even with 2FA enabled on your account
- ✅ Doesn't risk account lockout

**After updating:** Run `npm run full-auto` again

### "OpenAI API quota exceeded"
**Solution:** 
- Add credits at https://platform.openai.com/account/billing
- Or skip AI content generation (will still work)

### "Dry run shows wrong bio"
**Solution:** Change your niche:
```env
PROFILE_NICHE=tech     # Options: highTicket, tech, home, fitness
```

---

## 📊 What Happens After Setup

### 1. Review Generated Content
Check `generated-content/` folder for:
- Video scripts
- Viral hooks
- Captions with hashtags
- Product recommendations

### 2. Create Videos
Use the generated scripts to create:
- 5-7 videos per day
- Faceless POV style content
- Product showcase videos
- Review and comparison videos

### 3. Track Performance
```bash
# Add daily metrics
npm run analytics:add

# View performance
npm run analytics:summary
```

### 4. Optimize & Scale
- Review what works
- Double down on winners
- Adjust niche if needed
- Scale to $1,000+/day

---

## 🔄 Running Full Auto Again

You can run the full auto setup anytime:

```bash
npm run full-auto
```

This will:
- Re-validate configuration
- Update profiles with latest bio templates
- Generate fresh content
- Find new products

**Note:** It's safe to run multiple times. Dry run mode protects from unwanted changes.

---

## 🎯 Success Metrics

After running full auto setup, you should have:

✅ **Profiles Configured**
- Optimized bio text
- Professional appearance
- Clear call-to-action

✅ **Content Ready**
- 15+ video scripts
- Viral hooks tested
- Hashtag strategy

✅ **Products Identified**
- 25+ high-ticket items
- $100+ commission each
- 8-10% commission rate

✅ **System Ready**
- All tools configured
- Dependencies installed
- Ready to post manually or via the review queue

---

## 📚 Additional Resources

- **[PROFILE_AUTOMATION_GUIDE.md](./PROFILE_AUTOMATION_GUIDE.md)** - Detailed automation guide
- **[PROFILE_SETUP_GUIDE.md](./PROFILE_SETUP_GUIDE.md)** - Profile optimization
- **[TIKTOK_INSTAGRAM_GUIDE.md](./TIKTOK_INSTAGRAM_GUIDE.md)** - Monetization strategy
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup guide

---

## 🔐 Security Notes

- ✅ Credentials stored locally in `.env`
- ✅ `.env` is gitignored (never committed)
- ✅ Dry run mode prevents accidents
- ✅ All automation is opt-in

**Never commit your `.env` file or share credentials publicly!**

---

## 💡 Pro Tips

1. **Always test in dry run first**
   - Set `PROFILE_DRY_RUN=true`
   - Verify output looks correct
   - Then switch to `false`

2. **Use the quick-config tool**
   - Faster than manual editing
   - Validates inputs
   - Prevents typos

3. **Run full-auto weekly**
   - Refresh content
   - Update profiles
   - Find new products

4. **Monitor analytics**
   - Track what works
   - Optimize based on data
   - Scale winners

---

**Ready to automate? Run:**
```bash
npm run quick-config && npm run full-auto
```
