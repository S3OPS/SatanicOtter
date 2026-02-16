# 🔧 Environment Configuration Schema

Complete reference for all `.env` configuration variables in SatanicOtter.

## Quick Setup

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env

# Or use the setup wizard
npm run setup
```

---

## 📋 Configuration Variables

### API Keys (Required)

#### `OPENAI_API_KEY`
- **Type:** String
- **Required:** ✅ Yes (for content generation)
- **Format:** `sk-...` (starts with `sk-`)
- **Example:** `sk-proj-abc123...`
- **Where to get:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Used for:** AI content generation, product research, bio generation
- **Cost:** ~$0.10-0.25 per full-auto run (gpt-4o-mini)

#### `OPENAI_MODEL`
- **Type:** String
- **Required:** ❌ No
- **Default:** `gpt-4o-mini`
- **Options:**
  - `gpt-4o-mini` - Cheapest, fast, good quality (recommended for development)
  - `gpt-4o` - Best quality, higher cost (recommended for production)
  - `gpt-3.5-turbo` - Older, cheaper alternative
- **Example:** `gpt-4o-mini`
- **Performance:**
  - gpt-4o-mini: ~$0.15/1M tokens in, ~$0.60/1M tokens out
  - gpt-4o: ~$2.50/1M tokens in, ~$10.00/1M tokens out

#### `ANTHROPIC_API_KEY`
- **Type:** String
- **Required:** ❌ No (future feature)
- **Format:** `sk-ant-...`
- **Example:** `sk-ant-api03-abc123...`
- **Where to get:** [console.anthropic.com](https://console.anthropic.com)
- **Status:** Reserved for future Claude integration
- **Note:** Not currently used

---

### TikTok Configuration (Optional)

#### `TIKTOK_USERNAME`
- **Type:** String
- **Required:** ⚠️ Yes (if using profile automation)
- **Format:** Username without `@`
- **Example:** `myusername` (not `@myusername`)
- **Used for:** Profile automation, bio updates

#### `TIKTOK_SESSION_ID`
- **Type:** String
- **Required:** ⚠️ Recommended over password
- **Format:** Long alphanumeric string
- **Example:** `a1b2c3d4e5f6...`
- **How to get:**
  1. Log in to TikTok in your browser
  2. Open Developer Tools (F12)
  3. Go to: Application → Cookies → `https://www.tiktok.com`
  4. Find cookie named `sessionid`
  5. Copy the value
- **Security:** More secure than password, no 2FA issues
- **Lifespan:** Expires after ~30 days of inactivity

#### `TIKTOK_PASSWORD`
- **Type:** String
- **Required:** ❌ No (only if not using SESSION_ID)
- **Format:** Your TikTok password
- **Example:** `MySecureP@ssw0rd`
- **Security:** ⚠️ Less secure than SESSION_ID
- **Issues:** May trigger 2FA or captcha
- **Note:** Use SESSION_ID instead when possible

---

### Profile Automation (Optional)

#### `PROFILE_AUTOMATION_ENABLED`
- **Type:** Boolean
- **Required:** ❌ No
- **Default:** `false`
- **Options:** `true`, `false`
- **Example:** `true`
- **Purpose:** Enable automated profile setup with Puppeteer
- **Requires:** Puppeteer, valid TikTok credentials

#### `PROFILE_NICHE`
- **Type:** String
- **Required:** ❌ No
- **Default:** `general`
- **Options:** `fitness`, `tech`, `beauty`, `highTicket`, `gaming`, `education`, `lifestyle`, `fashion`, `food`, `travel`, `finance`, `health`, `pets`, `automotive`, `home`
- **Example:** `highTicket`
- **Purpose:** Determines content style and product recommendations
- **Effect:** Influences bio generation, product research, content tone

#### `PROFILE_DRY_RUN`
- **Type:** Boolean
- **Required:** ❌ No
- **Default:** `true`
- **Options:** `true`, `false`
- **Example:** `true`
- **Purpose:** Test automation without making actual changes
- **Recommendation:** Always use `true` for testing first
- **Safety:** Prevents accidental profile modifications

---

### Amazon Affiliate (Required for Links)

#### `AMAZON_AFFILIATE_TAG`
- **Type:** String
- **Required:** ⚠️ Yes (for affiliate links)
- **Format:** `yourname-20` (ends with `-20`)
- **Example:** `techreviews-20`
- **Where to get:** [affiliate-program.amazon.com](https://affiliate-program.amazon.com/)
- **Purpose:** Track commissions from your links
- **Validation:** Must be approved Amazon affiliate

---

### Content Settings

#### `POSTS_PER_DAY`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `9`
- **Range:** `1-20`
- **Example:** `9`
- **Purpose:** Number of posts to schedule per day
- **Recommendation:** 
  - New accounts: 3-5 posts
  - Established accounts: 6-9 posts
  - High-growth strategy: 9-12 posts

#### `TIMEZONE`
- **Type:** String
- **Required:** ❌ No
- **Default:** `America/New_York`
- **Format:** IANA timezone name
- **Examples:**
  - `America/New_York` (EST/EDT)
  - `America/Los_Angeles` (PST/PDT)
  - `America/Chicago` (CST/CDT)
  - `Europe/London` (GMT/BST)
  - `Asia/Tokyo` (JST)
- **Purpose:** Schedule posts for optimal times in your target market
- **List:** [Wikipedia IANA Timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

#### `VIDEO_LENGTH_MIN`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `15`
- **Range:** `7-60` (seconds)
- **Example:** `15`
- **Purpose:** Minimum video length for content planning
- **Platform limits:**
  - TikTok: 15s-10m
  - Instagram Reels: 15s-90s
  - YouTube Shorts: 15s-60s

#### `VIDEO_LENGTH_MAX`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `30`
- **Range:** `15-180` (seconds)
- **Example:** `30`
- **Purpose:** Maximum video length for content planning
- **Recommendation:** 15-30s for maximum engagement

---

### Scheduling

#### `POSTING_TIMES`
- **Type:** String (comma-separated)
- **Required:** ❌ No
- **Default:** `06:30,07:45,09:00,10:15,12:30,13:24,15:00,18:00,20:00`
- **Format:** `HH:MM` (24-hour format)
- **Example:** `09:00,12:00,15:00,18:00,21:00`
- **Purpose:** When to schedule posts throughout the day
- **Best practices:**
  - Early morning: 6-8 AM (commute time)
  - Lunch: 12-1 PM
  - Evening: 6-9 PM (highest engagement)
  - Late night: 9-11 PM
- **Count:** Should match or exceed `POSTS_PER_DAY`

---

### Product Configuration

#### `PRODUCT_CATEGORIES`
- **Type:** String (comma-separated)
- **Required:** ❌ No
- **Default:** `electronics,home,fitness,professional`
- **Options:** `electronics`, `home`, `fitness`, `professional`, `kitchen`, `outdoor`, `automotive`, `beauty`, `fashion`, `toys`, `sports`, `tools`, `garden`, `pet`, `baby`, `health`, `office`, `gaming`, `music`, `camera`
- **Example:** `electronics,home,fitness`
- **Purpose:** Focus product research on specific categories
- **Commission rates:**
  - Electronics: 2-4%
  - Home: 3-8%
  - Fitness: 4-8%
  - Professional tools: 3-6%

#### `MIN_PRODUCT_PRICE`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `500`
- **Range:** `100-10000` (USD)
- **Example:** `500`
- **Purpose:** Minimum product price for high-ticket strategy
- **High-ticket threshold:** $500+
- **Why:** Higher commissions per sale

#### `MAX_PRODUCT_PRICE`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `2500`
- **Range:** `500-10000` (USD)
- **Example:** `2500`
- **Purpose:** Maximum product price (balance sellability vs. commission)
- **Sweet spot:** $500-2500 (best conversion + commission)
- **Why:** Products >$2500 have lower conversion rates

---

### Revenue Goals

#### `DAILY_REVENUE_GOAL`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `1000`
- **Range:** `100-10000` (USD)
- **Example:** `1000`
- **Purpose:** Target daily revenue for analytics tracking
- **Use:** Measure progress in analytics dashboard
- **Realistic:** Adjust based on follower count and engagement

#### `TARGET_AVG_COMMISSION`
- **Type:** Integer
- **Required:** ❌ No
- **Default:** `100`
- **Range:** `10-500` (USD)
- **Example:** `100`
- **Purpose:** Target average commission per sale
- **Calculation:** Product price × category commission rate
- **Examples:**
  - $2000 laptop × 2% = $40
  - $1500 treadmill × 8% = $120
  - $800 mixer × 6% = $48

---

### Automation Settings

#### `AUTO_POST`
- **Type:** Boolean
- **Required:** ❌ No
- **Default:** `false`
- **Options:** `true`, `false`
- **Example:** `false`
- **Purpose:** Automatically post content without manual review
- **⚠️ Warning:** Review content before enabling
- **Recommendation:** Start with `false`, enable after testing

#### `MANUAL_REVIEW`
- **Type:** Boolean
- **Required:** ❌ No
- **Default:** `true`
- **Options:** `true`, `false`
- **Example:** `true`
- **Purpose:** Queue content in `review-queue/` for approval
- **Safety:** Prevents unwanted posts
- **Recommendation:** Keep `true` until system is proven

#### `BACKUP_CONTENT`
- **Type:** Boolean
- **Required:** ❌ No
- **Default:** `true`
- **Options:** `true`, `false`
- **Example:** `true`
- **Purpose:** Save backup copies of generated content
- **Storage:** `review-queue/` and timestamped backups
- **Benefit:** Recover content if accidentally deleted

---

## 🎯 Configuration Presets

### Development/Testing
```env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4o-mini
PROFILE_DRY_RUN=true
MANUAL_REVIEW=true
AUTO_POST=false
POSTS_PER_DAY=3
DAILY_REVENUE_GOAL=100
```

### Production/Live
```env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4o
TIKTOK_SESSION_ID=your-session-id
PROFILE_DRY_RUN=false
MANUAL_REVIEW=false
AUTO_POST=true
POSTS_PER_DAY=9
DAILY_REVENUE_GOAL=1000
```

### High-Ticket Focus
```env
PRODUCT_CATEGORIES=electronics,home,fitness,professional
MIN_PRODUCT_PRICE=1000
MAX_PRODUCT_PRICE=3000
TARGET_AVG_COMMISSION=150
DAILY_REVENUE_GOAL=2000
```

### Conservative Start
```env
OPENAI_MODEL=gpt-4o-mini
POSTS_PER_DAY=3
MANUAL_REVIEW=true
AUTO_POST=false
PROFILE_DRY_RUN=true
MIN_PRODUCT_PRICE=300
MAX_PRODUCT_PRICE=1000
```

---

## 🔍 Validation

### Check Configuration
```bash
npm run status
```

### Required Variables
- `OPENAI_API_KEY` - Always required
- `AMAZON_AFFILIATE_TAG` - Required for link generation
- `TIKTOK_USERNAME` + `TIKTOK_SESSION_ID` - Required for profile automation

### Optional Variables
All others have sensible defaults and can be omitted.

---

## 🚨 Security Best Practices

1. **Never commit `.env` to git**
   ```bash
   # Check .gitignore
   cat .gitignore | grep .env
   ```

2. **Rotate API keys regularly**
   - Every 90 days minimum
   - Immediately if exposed

3. **Use environment variables in production**
   ```bash
   # Don't use .env files in production
   # Use system environment variables or secrets manager
   ```

4. **Validate before use**
   ```bash
   npm run status  # Checks all required variables
   ```

5. **Use separate keys for dev/prod**
   - Development: Lower rate limits, separate billing
   - Production: Higher limits, monitored closely

---

## 📊 Monitoring

### Usage Tracking
```bash
# Check current settings
npm run status

# View API usage
# Visit: platform.openai.com/account/usage

# Track revenue
npm run analytics:summary
```

### Alerts
Set up monitoring for:
- OpenAI quota (soft limit at 50%)
- Failed API calls
- Posting errors
- Revenue milestones

---

## 🆘 Troubleshooting

### "OPENAI_API_KEY not found"
**Fix:** Run `npm run setup` or add key to `.env`

### "Invalid OpenAI model"
**Fix:** Use `gpt-4o-mini`, `gpt-4o`, or `gpt-3.5-turbo`

### "TikTok session expired"
**Fix:** Get new session ID from browser (expires after ~30 days)

### "Invalid timezone"
**Fix:** Use IANA format (e.g., `America/New_York`)

### "Posting times format error"
**Fix:** Use 24-hour format with commas: `09:00,12:00,15:00`

---

## 📚 Related Documentation

- [QUICK_START.md](./QUICK_START.md) - Setup guide
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete reference
- [SECURITY_REPORT.md](./SECURITY_REPORT.md) - Security details
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

---

*Last Updated: 2024-02-16*
