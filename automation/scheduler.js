/**
 * Posting Scheduler for TikTok
 * 
 * This module handles automated scheduling and posting of content
 * to TikTok at optimal times.
 */

const { loadEnv, getEnv, getEnvBool, getEnvInt, getEnvArray } = require('./utils/config');
const { appendToLog } = require('./utils/fileOps');
const { info, error: logError, section } = require('./utils/logger');
const ContentQueue = require('./services/contentQueue');
const { postToTikTok } = require('./services/platformPosting');
const cron = require('node-cron');
const path = require('path');

loadEnv();

// Posting configuration
const POSTING_CONFIG = {
  timezone: getEnv('TIMEZONE', 'America/New_York'),
  postsPerDay: getEnvInt('POSTS_PER_DAY', 5),
  times: getEnvArray('POSTING_TIMES', ['06:30', '09:00', '12:30', '15:00', '20:00']),
  autoPost: getEnvBool('AUTO_POST', false)
};

// Content queue and scheduled jobs
const contentQueue = new ContentQueue();
let scheduledJobs = [];

/**
 * Initialize content queue
 */
async function initializeQueue(contentFile = null) {
  const count = await contentQueue.load(contentFile);
  info('Scheduler', `Content queue initialized with ${count} items`);
  return count;
}

/**
 * Get next content item from queue
 */
function getNextContent() {
  return contentQueue.next();
}

/**
 * Post to TikTok (delegates to platform posting service)
 */
async function postContent(content) {
  info('Scheduler', `Posting to TikTok: ${content.hook || content.category}`);
  return await postToTikTok(content);
}

/**
 * Execute scheduled post
 */
async function executeScheduledPost() {
  info('Scheduler', 'Scheduled post execution triggered');
  
  const content = getNextContent();
  if (!content) {
    logError('Scheduler', 'No content available to post');
    return;
  }
  
  try {
    const result = await postContent(content);
    
    info('Scheduler', `Post execution complete: ${result.status}`);
    
    // Log posting activity
    const logFile = path.join(__dirname, '../logs', `posting-log-${new Date().toISOString().split('T')[0]}.json`);
    await appendToLog(logFile, {
      timestamp: new Date().toISOString(),
      content: content.hook || content.category,
      result
    });
    
  } catch (err) {
    logError('Scheduler', `Error executing post: ${err.message}`);
  }
}

/**
 * Schedule posts for the day
 */
function schedulePosts() {
  section('Scheduling posts');
  info('Scheduler', `Timezone: ${POSTING_CONFIG.timezone}`);
  info('Scheduler', `Posts per day: ${POSTING_CONFIG.postsPerDay}`);
  info('Scheduler', `Times: ${POSTING_CONFIG.times.join(', ')}`);
  
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
    info('Scheduler', `Scheduled post for ${time} (${cronExpression})`);
  });
  
  info('Scheduler', `${scheduledJobs.length} posts scheduled`);
  
  if (POSTING_CONFIG.autoPost) {
    info('Scheduler', 'Auto-posting ENABLED - posts will publish automatically');
  } else {
    info('Scheduler', 'Manual review ENABLED - posts will be queued for approval');
  }
}

/**
 * Start the scheduler
 */
async function start(contentFile = null) {
  section('Starting posting scheduler');
  
  try {
    // Load content
    await initializeQueue(contentFile);
    
    // Schedule posts
    schedulePosts();
    
    info('Scheduler', 'Scheduler running. Press Ctrl+C to stop.');
    info('Scheduler', `Next posts scheduled for: ${POSTING_CONFIG.times.join(', ')}`);
    
    // Keep process alive
    process.on('SIGINT', () => {
      section('Stopping scheduler');
      scheduledJobs.forEach(job => job.stop());
      info('Scheduler', 'Goodbye!');
      process.exit(0);
    });
    
  } catch (err) {
    logError('Scheduler', `Error starting scheduler: ${err.message}`);
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
  postContent,
  start
};
