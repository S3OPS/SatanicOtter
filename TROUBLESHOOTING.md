# Troubleshooting Profile Automation

This guide helps you resolve common issues with automated profile updates for TikTok.

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

**TikTok troubleshooting includes:**
- Session ID validation tips
- UI change notifications
- Browser debug guidance

---

## Best Practices

1. **Always test in dry-run mode first**
2. **Keep session IDs/tokens updated** - they expire
3. **Monitor for UI changes** - platforms update frequently
4. **Run automation during off-peak hours** to avoid rate limits
