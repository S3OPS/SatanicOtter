# 🤖 100% Automated Profile Setup Guide

## Complete Automation with GitHub Secrets & Browser Automation

This guide shows you how to make the profile setup **100% automated** using GitHub Secrets, GitHub Actions, or local browser automation.

---

## 🎯 Automation Options

### Option 1: GitHub Actions (Recommended for CI/CD)
**Best for:** Scheduled automated updates, team projects
**Security:** Credentials stored as GitHub Secrets
**Setup time:** 10 minutes

### Option 2: Local Browser Automation
**Best for:** One-time setup, personal use
**Security:** Credentials in local .env file
**Setup time:** 5 minutes

### Option 3: API-Based (Instagram Business Only)
**Best for:** Instagram Business/Creator accounts
**Security:** Access tokens as secrets
**Setup time:** 15 minutes (requires Facebook Developer app)

---

## 🔐 Option 1: GitHub Actions with Secrets

### Step 1: Add GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

**Required for TikTok:**
```
TIKTOK_USERNAME=your_tiktok_username
TIKTOK_PASSWORD=your_tiktok_password
# OR use session ID instead of password:
TIKTOK_SESSION_ID=your_session_id_from_browser_cookies
```

**Required for Instagram:**
```
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password
# OR for Business accounts, use Graph API:
INSTAGRAM_GRAPH_API_TOKEN=your_access_token
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
```

**Optional Configuration:**
```
PROFILE_NICHE=highTicket
# Options: highTicket, tech, home, fitness

PROFILE_DRY_RUN=false
# Set to false to actually apply changes
```

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/profile-setup.yml`:

```yaml
name: Automated Profile Setup

on:
  # Run manually
  workflow_dispatch:
    inputs:
      niche:
        description: 'Profile niche'
        required: false
        default: 'highTicket'
        type: choice
        options:
          - highTicket
          - tech
          - home
          - fitness
      dry_run:
        description: 'Dry run (no actual changes)'
        required: false
        default: true
        type: boolean
  
  # Run on schedule (weekly)
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight

jobs:
  setup-profiles:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          npm install puppeteer axios
      
      - name: Run automated profile setup
        env:
          TIKTOK_USERNAME: ${{ secrets.TIKTOK_USERNAME }}
          TIKTOK_PASSWORD: ${{ secrets.TIKTOK_PASSWORD }}
          TIKTOK_SESSION_ID: ${{ secrets.TIKTOK_SESSION_ID }}
          INSTAGRAM_USERNAME: ${{ secrets.INSTAGRAM_USERNAME }}
          INSTAGRAM_PASSWORD: ${{ secrets.INSTAGRAM_PASSWORD }}
          INSTAGRAM_GRAPH_API_TOKEN: ${{ secrets.INSTAGRAM_GRAPH_API_TOKEN }}
          INSTAGRAM_ACCOUNT_ID: ${{ secrets.INSTAGRAM_ACCOUNT_ID }}
          PROFILE_NICHE: ${{ github.event.inputs.niche || 'highTicket' }}
          PROFILE_DRY_RUN: ${{ github.event.inputs.dry_run || 'true' }}
          PROFILE_AUTOMATION_ENABLED: true
        run: |
          npm run automate-profiles
      
      - name: Upload logs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: automation-logs
          path: logs/
```

### Step 3: Run the Workflow

1. Go to Actions tab in your repository
2. Select "Automated Profile Setup"
3. Click "Run workflow"
4. Choose your niche and dry run setting
5. Click "Run workflow" button

**First run:** Use dry_run=true to test without making changes
**Live run:** Set dry_run=false to actually update profiles

---

## 🖥️ Option 2: Local Browser Automation

### Step 1: Install Browser Automation Tools

```bash
# Install Puppeteer (for Chrome/Chromium automation)
npm install puppeteer

# OR install Playwright (for multi-browser support)
npm install playwright
```

### Step 2: Configure Environment Variables

Update your `.env` file:

```env
# Enable automation
PROFILE_AUTOMATION_ENABLED=true

# TikTok credentials
TIKTOK_USERNAME=your_tiktok_username
TIKTOK_PASSWORD=your_tiktok_password

# Instagram credentials
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password

# Configuration
PROFILE_NICHE=highTicket
PROFILE_DRY_RUN=true
```

### Step 3: Run Automated Setup

```bash
# Dry run (safe - shows what would change)
npm run automate-profiles

# Live run (actually updates profiles)
PROFILE_DRY_RUN=false npm run automate-profiles

# Specify niche
npm run automate-profiles -- --niche tech
```

### Step 4: Verify Changes

After running, check:
1. Your TikTok profile bio
2. Your Instagram profile bio
3. Logs in `logs/profile-automation.log`

---

## 📱 Option 3: Instagram Graph API (Business Accounts Only)

### Prerequisites
- Instagram Business or Creator account
- Facebook Page connected to Instagram
- Facebook Developer account

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → Business type
3. Add Instagram Basic Display product
4. Configure OAuth redirect URLs

### Step 2: Get Access Token

1. Go to Graph API Explorer
2. Select your app
3. Add `instagram_basic` permission
4. Generate access token
5. Exchange for long-lived token (60 days)

**Get long-lived token:**
```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=YOUR_APP_ID&\
client_secret=YOUR_APP_SECRET&\
fb_exchange_token=SHORT_LIVED_TOKEN"
```

### Step 3: Get Instagram Account ID

```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?\
access_token=YOUR_ACCESS_TOKEN"

# Then get Instagram account:
curl -X GET "https://graph.facebook.com/v18.0/PAGE_ID?\
fields=instagram_business_account&\
access_token=YOUR_ACCESS_TOKEN"
```

### Step 4: Configure and Run

Add to `.env`:
```env
INSTAGRAM_GRAPH_API_TOKEN=your_long_lived_token
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
PROFILE_AUTOMATION_ENABLED=true
```

Run:
```bash
npm run automate-profiles
```

---

## 🔒 Security Best Practices

### For GitHub Actions:
✅ **DO:**
- Store all credentials as GitHub Secrets
- Use `PROFILE_DRY_RUN=true` for first runs
- Review logs before enabling live mode
- Rotate passwords regularly
- Use repository secrets (not environment secrets)

❌ **DON'T:**
- Commit credentials to .env files
- Share secrets in issues or PRs
- Use personal access tokens in public repos
- Leave dry_run=false in scheduled runs without testing

### For Local Automation:
✅ **DO:**
- Keep .env file in .gitignore
- Use strong, unique passwords
- Enable 2FA on social accounts (handle in code)
- Run in headless mode (headless: true)
- Clear cookies after automation

❌ **DON'T:**
- Share your .env file
- Run on public/shared computers
- Store passwords in code
- Disable security features

### For API-Based:
✅ **DO:**
- Use long-lived tokens (60 days)
- Set up token refresh automation
- Monitor token expiration
- Restrict token permissions
- Store tokens as secrets

❌ **DON'T:**
- Use short-lived tokens in automation
- Share access tokens
- Commit tokens to repository
- Use tokens from untrusted sources

---

## 📋 NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "automate-profiles": "node automation/profileAutomation.js",
    "automate-profiles:dry-run": "PROFILE_DRY_RUN=true node automation/profileAutomation.js",
    "automate-profiles:live": "PROFILE_DRY_RUN=false node automation/profileAutomation.js"
  }
}
```

---

## 🐛 Troubleshooting

### "Puppeteer not installed"
```bash
npm install puppeteer
# OR
npm install playwright
```

### "Session expired" (TikTok)
Get new session ID:
1. Open TikTok in browser
2. Login to your account
3. Open DevTools (F12) → Application → Cookies
4. Copy `sessionid` cookie value
5. Update `TIKTOK_SESSION_ID` in secrets/env

### "Invalid credentials" (Instagram)
- Check username/password are correct
- Disable 2FA temporarily or use session cookies
- Try Graph API for Business accounts
- Check for Instagram security alerts

### "Captcha detected"
Browser automation may trigger captchas:
- Use session IDs instead of login
- Add random delays between actions
- Use puppeteer-extra-plugin-stealth
- Consider Graph API for Instagram

### "Rate limited"
Too many automation attempts:
- Wait 24 hours before retrying
- Use dry run mode for testing
- Reduce automation frequency
- Check platform API limits

---

## 🎬 Example Workflows

### Weekly Profile Optimization
```yaml
# .github/workflows/weekly-profile-update.yml
on:
  schedule:
    - cron: '0 12 * * 1'  # Every Monday at noon

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install && npm install puppeteer
      - run: npm run automate-profiles:live
        env:
          # Add all secrets here
```

### A/B Testing Bio Variations
```bash
# Test different niches
npm run automate-profiles -- --niche tech
sleep 604800  # Wait 1 week
npm run automate-profiles -- --niche home
sleep 604800  # Wait 1 week
# Compare analytics to find best performer
```

### Multi-Account Management
```bash
# Account 1
TIKTOK_USERNAME=account1 npm run automate-profiles
# Account 2
TIKTOK_USERNAME=account2 npm run automate-profiles
# Account 3
TIKTOK_USERNAME=account3 npm run automate-profiles
```

---

## ✅ Verification Checklist

After automation runs:

### TikTok:
- [ ] Bio text updated correctly
- [ ] Username visible in logs
- [ ] No errors in automation output
- [ ] Profile accessible on TikTok app
- [ ] Link in bio clickable

### Instagram:
- [ ] Bio text updated correctly
- [ ] Business category set (if applicable)
- [ ] Contact button enabled (if configured)
- [ ] Profile public and accessible
- [ ] Link in bio working

### Security:
- [ ] No credentials in logs
- [ ] Secrets not exposed in output
- [ ] Browser closed properly
- [ ] Cookies cleared (if applicable)

---

## 🚀 Next Steps

1. **Start with dry run** to test configuration
2. **Verify output** shows correct bio text
3. **Enable live mode** with `PROFILE_DRY_RUN=false`
4. **Monitor first run** for any errors
5. **Set up scheduled runs** for ongoing optimization
6. **Track performance** using analytics tools

---

## 📚 Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Security Notice:** Automating social media accounts may violate platform Terms of Service. Use responsibly and at your own risk. Always start with dry run mode and verify behavior before enabling live updates.
