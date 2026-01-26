# Troubleshooting Profile Automation

This guide helps you resolve common issues with automated profile updates for TikTok and Instagram.

## Common Issues

### TikTok: "Waiting for selector failed" Error

**Symptom:**
```
❌ Error updating TikTok profile: Waiting for selector `textarea[placeholder*="Bio"]` failed
```

**Causes:**
1. Invalid or expired `TIKTOK_SESSION_ID`
2. TikTok UI has changed
3. Network connectivity issues
4. Bot detection blocking access

**Solutions:**

#### 1. Update Your Session ID
The most common cause is an expired session ID.

1. Open TikTok in your browser and log in
2. Press F12 to open Developer Tools
3. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
4. Click on "Cookies" → "https://www.tiktok.com"
5. Find the cookie named `sessionid`
6. Copy its value
7. Update your `.env` file:
   ```
   TIKTOK_SESSION_ID=your_new_session_id_here
   ```

#### 2. Check Network Access
```bash
# Test if you can reach TikTok
curl -I https://www.tiktok.com
```

If this fails, TikTok may be blocked on your network.

#### 3. Run in Non-Headless Mode
To see what's happening:

1. Edit `automation/profileAutomation.js`
2. Change `headless: true` to `headless: false` (line 110)
3. Run the automation again to see the browser window

#### 4. Use Dry Run Mode
Test without making changes:
```bash
PROFILE_DRY_RUN=true npm run automate-profiles
```

---

### Instagram: "Request failed with status code 400"

**Symptom:**
```
❌ Error updating Instagram via Graph API: Request failed with status code 400
```

**Important:** Instagram Graph API does NOT support updating bio via API. This is a platform limitation.

**Solutions:**

#### Option 1: Manual Bio Update (Recommended for Graph API)
The automation will now display your generated bio for manual copying:

```
💡 Your generated bio:
   "🛍️ High-Ticket Product Reviews..."

📋 Copy the bio above and paste it manually into Instagram.
```

**How to update manually:**
1. Open Instagram app or website
2. Go to Profile → Edit Profile → Bio
3. Paste the generated bio
4. Save

#### Option 2: Use Browser Automation Instead
For automatic updates, use browser automation (doesn't require Graph API):

1. Remove or empty `INSTAGRAM_GRAPH_API_TOKEN` from `.env`
2. Set these instead:
   ```
   INSTAGRAM_USERNAME=your_username
   INSTAGRAM_PASSWORD=your_password
   ```
3. Run automation again

**Note:** Browser automation works for personal accounts without Business/Creator setup.

#### Option 3: Fix Graph API Configuration
If you still see 400 errors when checking account info:

**Common Causes:**
- Invalid `INSTAGRAM_ACCOUNT_ID` (must be Instagram Business Account ID, not user ID)
- Expired or invalid access token
- Missing required permissions
- Account not set up as Business or Creator account

**How to Fix:**

1. **Convert to Business Account:**
   - Instagram App → Settings → Account
   - Switch to Professional Account
   - Choose Creator or Business

2. **Connect Facebook Page:**
   - Instagram App → Settings → Account
   - Linked Accounts → Facebook
   - Connect a Facebook Page

3. **Get Your Account ID:**
   - Visit: https://developers.facebook.com/tools/explorer/
   - Select your app or create one
   - Get User Access Token with `instagram_basic` permission
   - Make a GET request to `/me/accounts` to find your Instagram Business Account ID

4. **Update `.env`:**
   ```
   INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
   INSTAGRAM_GRAPH_API_TOKEN=your_access_token
   ```

---

### Instagram Browser Automation: Login Failed

**Symptom:**
```
❌ Error updating Instagram profile: Login failed: ...
```

**Solutions:**

#### 1. Verify Credentials
```bash
# Check your .env file
cat .env | grep INSTAGRAM
```

Make sure username and password are correct.

#### 2. Handle Two-Factor Authentication
If you have 2FA enabled:

**Option A:** Use session cookies (like TikTok)
1. Login to Instagram in browser
2. Get session cookies from Developer Tools
3. Modify the code to inject cookies instead of login

**Option B:** Disable 2FA temporarily (not recommended)

#### 3. Check for Rate Limiting
Instagram may temporarily block automated logins. Wait 30-60 minutes and try again.

---

## Testing Your Setup

### 1. Check Configuration
```bash
npm run automate-profiles:dry-run
```

This shows what would happen without making changes.

### 2. View Detailed Logs
The automation now provides detailed troubleshooting tips:

**TikTok errors include:**
- Session ID validation tips
- Network accessibility checks
- UI change notifications
- Debug mode suggestions

**Instagram errors include:**
- Credential verification
- 2FA handling advice
- UI change notifications
- Alternative approaches

### 3. Verify Automation Setup
```bash
node -e "console.log(require('./automation/profileAutomation').checkAutomationSetup())"
```

---

## Performance Tips

### Timeout Issues
If operations are timing out on slow networks:

1. The default timeout is now 60 seconds
2. For very slow networks, increase further in the code:
   ```javascript
   page.setDefaultTimeout(120000); // 2 minutes
   ```

### Selector Changes
Social media platforms frequently update their UI. If selectors fail:

1. The automation tries 6+ different selectors for each element
2. Check console output to see which selector worked
3. If all fail, the UI has likely changed significantly

---

## Getting Help

If issues persist:

1. **Enable verbose logging:**
   ```bash
   DEBUG=* npm run automate-profiles
   ```

2. **Check the error details** - Recent improvements provide specific troubleshooting steps

3. **Run in non-headless mode** to see exactly what's happening

4. **Review the documentation:**
   - [PROFILE_AUTOMATION_GUIDE.md](./PROFILE_AUTOMATION_GUIDE.md)
   - [PROFILE_SETUP_GUIDE.md](./PROFILE_SETUP_GUIDE.md)

5. **Create an issue** with:
   - Full error message
   - Steps to reproduce
   - Your environment (OS, Node version)
   - Whether dry-run mode works

---

## Recent Improvements

### v1.1.0 - Enhanced Error Handling

**TikTok:**
- ✅ Multiple fallback selectors (6 different options)
- ✅ 60-second timeout for slow networks
- ✅ Better error messages with troubleshooting tips
- ✅ Improved save button detection

**Instagram Graph API:**
- ✅ Proper error handling for 400 Bad Request
- ✅ Account verification before bio update attempt
- ✅ Clear documentation of API limitations
- ✅ Manual bio copy workflow for Graph API users

**Instagram Browser Automation:**
- ✅ Multiple fallback selectors for all elements
- ✅ Login error detection and reporting
- ✅ Better handling of Instagram prompts
- ✅ Improved form submission reliability
- ✅ 60-second timeout for slow networks

---

## Best Practices

1. **Always test in dry-run mode first**
2. **Keep session IDs/tokens updated** - they expire
3. **Use browser automation for personal accounts**
4. **Use Graph API only if you need Business features**
5. **Monitor for UI changes** - platforms update frequently
6. **Run automation during off-peak hours** to avoid rate limits
