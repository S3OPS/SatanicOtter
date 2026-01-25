# 🎬 TikTok Credentials Setup Guide

## Quick Answer: Which Credential Should I Use?

**Use `TIKTOK_SESSION_ID` (Recommended) ✅**

You need EITHER `TIKTOK_SESSION_ID` OR `TIKTOK_PASSWORD` - **not both**.

---

## Why Session ID is Better Than Password

| Feature | Session ID | Password |
|---------|-----------|----------|
| **Reliability** | ✅ Very reliable | ⚠️ May fail |
| **2FA Support** | ✅ Works with 2FA | ❌ Blocked by 2FA |
| **Captcha Issues** | ✅ No captcha | ❌ Often triggers captcha |
| **Account Safety** | ✅ No lockout risk | ⚠️ May cause lockouts |
| **Bot Detection** | ✅ Bypasses detection | ❌ Triggers bot detection |
| **Setup Difficulty** | ⭐ Easy (5 steps) | ⭐⭐⭐ Hard (needs 2FA handling) |

**Bottom Line:** Session ID is more stable, secure, and works even if you have 2FA enabled.

---

## 📋 Method 1: Get TikTok Session ID (RECOMMENDED)

### Step-by-Step Instructions

#### For Chrome/Edge/Brave:

1. **Open TikTok** in your browser and **login** to your account
   - Go to https://www.tiktok.com
   - Login with your credentials

2. **Open Developer Tools**
   - Press `F12` (or right-click → Inspect)
   - Or use menu: More Tools → Developer Tools

3. **Navigate to Application Tab**
   - Click on the "Application" tab at the top
   - If you don't see it, click the `>>` button to find it

4. **Find Cookies**
   - In the left sidebar, expand "Cookies"
   - Click on "https://www.tiktok.com"

5. **Copy Session ID**
   - Scroll down to find the cookie named `sessionid`
   - Click on it to select
   - Copy the entire "Value" (it's a long string of letters and numbers)
   - Should look something like: `1234567890abcdefghijklmnopqrstuvwxyz...`

6. **Add to .env File**
   ```env
   TIKTOK_SESSION_ID=paste_your_copied_value_here
   ```

#### For Firefox:

1. **Open TikTok** and **login**
2. **Press `F12`** to open Developer Tools
3. **Click "Storage" tab** at the top
4. **Expand "Cookies"** → Click "https://www.tiktok.com"
5. **Find "sessionid"** in the list
6. **Copy the "Value"** column
7. **Add to .env file** as shown above

#### For Safari:

1. **Enable Developer Menu** first:
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"
2. **Open TikTok** and **login**
3. **Click Develop** → Show Web Inspector
4. **Click Storage tab**
5. **Click Cookies** → https://www.tiktok.com
6. **Find and copy "sessionid" value**

---

## 🔄 Method 2: Using Password (Alternative)

Only use this if you absolutely cannot get the session ID.

### Requirements:
- 2FA must be disabled on your TikTok account
- May require additional captcha handling
- Less reliable for automation

### Setup:
```env
TIKTOK_USERNAME=your_username
TIKTOK_PASSWORD=your_password
```

### Limitations:
- ❌ Won't work if 2FA is enabled
- ❌ May trigger captcha verification
- ❌ Can cause account security alerts
- ❌ May result in temporary account locks

---

## ✅ Verification

After adding credentials to your `.env` file, verify the setup:

```bash
# Run in dry-run mode first (safe)
npm run full-auto
```

You should see:
```
✅ TIKTOK_SESSION_ID: TikTok session ID (recommended method)
```

or

```
✅ TIKTOK_PASSWORD: TikTok password
💡 TIP: TIKTOK_SESSION_ID is more reliable than password
```

---

## 🔧 Troubleshooting

### "Session expired" Error
**Cause:** Your session ID is old or invalid

**Solution:**
1. Login to TikTok in browser
2. Get a fresh session ID (follow Method 1 steps)
3. Replace old TIKTOK_SESSION_ID in .env
4. Run automation again

**Note:** Session IDs typically last 30-90 days

### "Invalid credentials" or "Wrong password" Error  
**Cause:** Using password method with 2FA or bot detection

**Solution:**
1. Switch to session ID method (Method 1)
2. Remove or comment out TIKTOK_PASSWORD
3. Add TIKTOK_SESSION_ID instead

### "Either TIKTOK_PASSWORD or TIKTOK_SESSION_ID required"
**Cause:** Neither credential is set in .env

**Solution:**
1. Choose session ID method (recommended)
2. Follow Method 1 to get your session ID
3. Add it to .env file
4. Save the file

### Session ID looks wrong or incomplete
**Cause:** Didn't copy the complete value

**Solution:**
1. Make sure to copy the ENTIRE value from the cookie
2. It should be a long string (50+ characters)
3. No spaces at beginning or end
4. Example format: `abc123def456...xyz789`

---

## 🔐 Security Best Practices

### DO:
✅ Keep your .env file in .gitignore (never commit it)
✅ Use GitHub Secrets for CI/CD automation
✅ Refresh session ID every 30-60 days
✅ Use strong password on your TikTok account
✅ Enable 2FA on TikTok (session ID works with 2FA!)

### DON'T:
❌ Share your session ID or password with anyone
❌ Commit credentials to GitHub
❌ Use the same password across multiple services
❌ Leave credentials in plain text outside .env
❌ Share screenshots that show your session ID

---

## 🔄 How Often to Update Session ID

Session IDs expire after some time. You'll need to refresh when:

- ✅ **Every 30-60 days** (proactive refresh)
- ✅ **When you get "session expired" error**
- ✅ **After changing your TikTok password**
- ✅ **After logging out from all devices on TikTok**

**Tip:** Set a calendar reminder to refresh your session ID monthly.

---

## 📚 Related Documentation

- [Full Automation Guide](./PROFILE_AUTOMATION_GUIDE.md)
- [One Command Setup](./ONE_COMMAND_SETUP.md)
- [Quick Start Guide](./QUICK_START.md)

---

## 💡 Still Having Issues?

If you're still having trouble after following this guide:

1. **Check that you copied the ENTIRE session ID value**
2. **Make sure there are no extra spaces**
3. **Verify you're logged in to TikTok in the browser**
4. **Try getting a fresh session ID**
5. **Check the troubleshooting section above**

**Common mistake:** Copying only part of the session ID. Make sure to copy the complete value!

---

**Last Updated:** 2026-01-25
