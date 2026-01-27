/**
 * Browser Automation Utilities
 * Helper functions for Puppeteer-based automation
 */

/**
 * Check if Puppeteer is available
 */
function isPuppeteerAvailable() {
  try {
    require.resolve('puppeteer');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get Puppeteer instance
 */
function getPuppeteer() {
  try {
    return require('puppeteer');
  } catch (error) {
    throw new Error('Puppeteer not installed. Install with: npm install puppeteer');
  }
}

/**
 * Launch browser with safe defaults
 */
async function launchBrowser(options = {}) {
  const puppeteer = getPuppeteer();
  
  const defaultOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Overcome limited resource problems
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  };
  
  return await puppeteer.launch({
    ...defaultOptions,
    ...options
  });
}

/**
 * Set session cookie for authentication
 */
async function setSessionCookie(page, domain, sessionId) {
  await page.setCookie({
    name: 'sessionid',
    value: sessionId,
    domain: domain,
    httpOnly: true,
    secure: true
  });
}

/**
 * Try multiple selectors and return first match
 */
async function findElement(page, selectors, timeout = 5000) {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { timeout });
      const element = await page.$(selector);
      if (element) {
        return { element, selector };
      }
    } catch (e) {
      // Try next selector
      continue;
    }
  }
  return { element: null, selector: null };
}

/**
 * Find editable element by attributes
 */
async function findEditableByAttributes(page, attributes) {
  return await page.evaluate((attrs) => {
    const candidates = Array.from(document.querySelectorAll('[contenteditable="true"]'));
    return Boolean(candidates.find((el) => {
      return attrs.some(attr => {
        const value = (el.getAttribute(attr) || '').toLowerCase();
        return attrs.some(searchTerm => value.includes(searchTerm.toLowerCase()));
      });
    }));
  }, attributes);
}

/**
 * Set text in input or contenteditable element
 */
async function setText(page, selector, text, isContentEditable = false) {
  await page.evaluate((sel, txt, isEditable) => {
    const elem = sel ? document.querySelector(sel) : null;
    
    if (!elem) return false;
    
    if (isEditable) {
      elem.textContent = txt;
      elem.dispatchEvent(new Event('input', { bubbles: true }));
      elem.dispatchEvent(new Event('change', { bubbles: true }));
    } else if ('value' in elem) {
      elem.value = txt;
      elem.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    return true;
  }, selector, text, isContentEditable);
}

/**
 * Safe navigation with timeout and error handling
 */
async function navigateSafe(page, url, options = {}) {
  const defaultOptions = {
    waitUntil: 'networkidle2',
    timeout: 60000
  };
  
  try {
    await page.goto(url, { ...defaultOptions, ...options });
    return true;
  } catch (error) {
    console.error(`Navigation to ${url} failed: ${error.message}`);
    return false;
  }
}

/**
 * Human-like delay (randomized)
 */
async function humanDelay(minMs = 1000, maxMs = 3000) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = {
  isPuppeteerAvailable,
  getPuppeteer,
  launchBrowser,
  setSessionCookie,
  findElement,
  findEditableByAttributes,
  setText,
  navigateSafe,
  humanDelay
};
