/**
 * Content Queue Manager
 * Handles content queue operations
 */

const path = require('path');
const { loadJSON, getMostRecentFile } = require('../utils/fileOps');

class ContentQueue {
  constructor() {
    this.queue = [];
    this.currentIndex = 0;
  }

  /**
   * Load content from file or directory
   */
  async load(filepath = null) {
    const contentDir = path.join(__dirname, '../../generated-content');
    
    let targetFile = filepath;
    if (!targetFile) {
      targetFile = await getMostRecentFile(contentDir);
      if (!targetFile) {
        throw new Error('No content files found. Run content generator first.');
      }
    }
    
    const content = await loadJSON(targetFile);
    this.queue = Array.isArray(content) ? content : [content];
    this.currentIndex = 0;
    
    return this.queue.length;
  }

  /**
   * Get next content item (with rotation)
   */
  next() {
    if (this.queue.length === 0) {
      return null;
    }
    
    const content = this.queue[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    
    return content;
  }

  /**
   * Get queue size
   */
  size() {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty() {
    return this.queue.length === 0;
  }
}

module.exports = ContentQueue;
