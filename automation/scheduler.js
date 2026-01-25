/**
 * Posting Scheduler for TikTok and Instagram Reels
 * 
 * This module handles automated scheduling and posting of content
 * to TikTok and Instagram at optimal times.
 */

require('dotenv').config();
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

// Posting configuration
const POSTING_CONFIG = {
  timezone: process.env.TIMEZONE || 'America/New_York',
  postsPerDay: parseInt(process.env.POSTS_PER_DAY) || 5,
  times: (process.env.POSTING_TIMES || '06:30,09:00,12:30,15:00,20:00').split(','),
  autoPost: process.env.AUTO_POST === 'true',
  manualReview: process.env.MANUAL_REVIEW !== 'false'
};

// Content queue
let contentQueue = [];
let scheduledJobs = [];

/**
 * Load content from generated files
 */
async function loadContent(filepath) {
  try {
    const contentDir = path.join(__dirname, '../generated-content');
    const files = await fs.readdir(contentDir);
    
    // If no specific file, load the most recent
    if (!filepath) {
      const sortedFiles = files
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();
      
      if (sortedFiles.length === 0) {
        throw new Error('No content files found. Run content generator first.');
      }
      
      filepath = path.join(contentDir, sortedFiles[0]);
    }
    
    const data = await fs.readFile(filepath, 'utf8');
    const content = JSON.parse(data);
    
    console.log(`Loaded ${Array.isArray(content) ? content.length : 1} content items`);
    return Array.isArray(content) ? content : [content];
  } catch (error) {
    console.error('Error loading content:', error.message);
    throw error;
  }
}

/**
 * Initialize content queue
 */
async function initializeQueue(contentFile = null) {
  contentQueue = await loadContent(contentFile);
  console.log(`Content queue initialized with ${contentQueue.length} items`);
  return contentQueue;
}

/**
 * Get next content item from queue
 */
function getNextContent() {
  if (contentQueue.length === 0) {
    console.warn('Content queue is empty!');
    return null;
  }
  
  // Rotate through queue
  const content = contentQueue.shift();
  contentQueue.push(content); // Add back to end for rotation
  
  return content;
}

/**
 * Post to TikTok (placeholder - requires TikTok API setup)
 */
async function postToTikTok(content) {
  // This is a placeholder for actual TikTok API integration
  // Actual implementation would require:
  // - TikTok API credentials
  // - Video file ready for upload
  // - TikTok's posting API endpoints
  
  console.log('📱 Posting to TikTok:', {
    hook: content.hook || 'Generated content',
    category: content.category,
    timestamp: new Date().toISOString()
  });
  
  if (POSTING_CONFIG.manualReview) {
    console.log('⏸️  Manual review enabled - content queued for approval');
    await saveForReview(content, 'tiktok');
    return { status: 'pending_review', platform: 'tiktok' };
  }
  
  // Actual posting logic would go here
  return { status: 'posted', platform: 'tiktok', contentId: content.timestamp };
}

/**
 * Post to Instagram (placeholder - requires Instagram API setup)
 */
async function postToInstagram(content) {
  // This is a placeholder for actual Instagram API integration
  // Actual implementation would require:
  // - Instagram Business account
  // - Facebook Graph API credentials
  // - Video file ready for upload
  
  console.log('📸 Posting to Instagram Reels:', {
    hook: content.hook || 'Generated content',
    category: content.category,
    timestamp: new Date().toISOString()
  });
  
  if (POSTING_CONFIG.manualReview) {
    console.log('⏸️  Manual review enabled - content queued for approval');
    await saveForReview(content, 'instagram');
    return { status: 'pending_review', platform: 'instagram' };
  }
  
  // Actual posting logic would go here
  return { status: 'posted', platform: 'instagram', contentId: content.timestamp };
}

/**
 * Save content for manual review
 */
async function saveForReview(content, platform) {
  const reviewDir = path.join(__dirname, '../review-queue');
  await fs.mkdir(reviewDir, { recursive: true });
  
  const filename = `${platform}-${Date.now()}.json`;
  const filepath = path.join(reviewDir, filename);
  
  await fs.writeFile(filepath, JSON.stringify({
    platform,
    content,
    queuedAt: new Date().toISOString(),
    status: 'pending'
  }, null, 2));
  
  console.log(`Content saved for review: ${filepath}`);
}

/**
 * Execute scheduled post
 */
async function executeScheduledPost() {
  console.log('\n⏰ Scheduled post execution triggered');
  
  const content = getNextContent();
  if (!content) {
    console.error('No content available to post');
    return;
  }
  
  try {
    // Post to both platforms
    const [tiktokResult, instagramResult] = await Promise.all([
      postToTikTok(content),
      postToInstagram(content)
    ]);
    
    console.log('✅ Post execution complete:', {
      tiktok: tiktokResult.status,
      instagram: instagramResult.status
    });
    
    // Log posting activity
    await logActivity({
      timestamp: new Date().toISOString(),
      content: content.hook || content.category,
      tiktok: tiktokResult,
      instagram: instagramResult
    });
    
  } catch (error) {
    console.error('❌ Error executing post:', error.message);
  }
}

/**
 * Log posting activity
 */
async function logActivity(activity) {
  const logDir = path.join(__dirname, '../logs');
  await fs.mkdir(logDir, { recursive: true });
  
  const logFile = path.join(logDir, `posting-log-${new Date().toISOString().split('T')[0]}.json`);
  
  let logs = [];
  try {
    const existing = await fs.readFile(logFile, 'utf8');
    logs = JSON.parse(existing);
  } catch (error) {
    // File doesn't exist yet
  }
  
  logs.push(activity);
  await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
}

/**
 * Schedule posts for the day
 */
function schedulePosts() {
  console.log('\n📅 Scheduling posts...');
  console.log('Timezone:', POSTING_CONFIG.timezone);
  console.log('Posts per day:', POSTING_CONFIG.postsPerDay);
  console.log('Times:', POSTING_CONFIG.times.join(', '));
  
  // Clear existing scheduled jobs
  scheduledJobs.forEach(job => job.stop());
  scheduledJobs = [];
  
  // Schedule for each time slot
  POSTING_CONFIG.times.slice(0, POSTING_CONFIG.postsPerDay).forEach(time => {
    const [hour, minute] = time.split(':');
    const cronExpression = `${minute} ${hour} * * *`;
    
    const job = cron.schedule(cronExpression, executeScheduledPost, {
      timezone: POSTING_CONFIG.timezone
    });
    
    scheduledJobs.push(job);
    console.log(`✓ Scheduled post for ${time} (${cronExpression})`);
  });
  
  console.log(`\n✅ ${scheduledJobs.length} posts scheduled`);
  
  if (POSTING_CONFIG.autoPost) {
    console.log('🤖 Auto-posting ENABLED - posts will publish automatically');
  } else {
    console.log('👤 Manual review ENABLED - posts will be queued for approval');
  }
}

/**
 * Start the scheduler
 */
async function start(contentFile = null) {
  console.log('🚀 Starting posting scheduler...\n');
  
  try {
    // Load content
    await initializeQueue(contentFile);
    
    // Schedule posts
    schedulePosts();
    
    console.log('\n✅ Scheduler running. Press Ctrl+C to stop.');
    console.log(`Next posts scheduled for: ${POSTING_CONFIG.times.join(', ')}`);
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Stopping scheduler...');
      scheduledJobs.forEach(job => job.stop());
      console.log('Goodbye!');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting scheduler:', error.message);
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  const contentFile = process.argv[2]; // Optional content file path
  start(contentFile);
}

module.exports = {
  initializeQueue,
  schedulePosts,
  postToTikTok,
  postToInstagram,
  start
};
