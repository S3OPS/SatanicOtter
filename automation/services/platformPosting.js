/**
 * Platform Posting Service
 * Handles posting to social media platforms
 */

const path = require('path');
const { saveJSON } = require('../utils/fileOps');
const { getEnvBool } = require('../utils/config');

/**
 * Save content for manual review
 */
async function saveForReview(content, platform) {
  const reviewDir = path.join(__dirname, '../../review-queue');
  const filename = `${platform}-${Date.now()}.json`;
  const filepath = path.join(reviewDir, filename);
  
  await saveJSON({
    platform,
    content,
    queuedAt: new Date().toISOString(),
    status: 'pending'
  }, filepath);
  
  return filepath;
}

/**
 * Post to TikTok
 */
async function postToTikTok(content, _options = {}) {
  const manualReview = getEnvBool('MANUAL_REVIEW', true);
  
  if (manualReview) {
    const filepath = await saveForReview(content, 'tiktok');
    return { 
      status: 'pending_review', 
      platform: 'tiktok',
      reviewFile: filepath
    };
  }
  
  // Actual posting logic would go here
  return { 
    status: 'posted', 
    platform: 'tiktok', 
    contentId: content.timestamp 
  };
}

module.exports = {
  postToTikTok,
  saveForReview
};
