/**
 * File Operations Utility
 * Centralized file I/O with error handling and security
 */

const fs = require('fs').promises;
const path = require('path');
const { validateFilePath } = require('./security');

/**
 * Ensure directory exists (create if not)
 */
async function ensureDir(dirPath) {
  try {
    // Validate path to prevent path traversal
    const safePath = validateFilePath(dirPath);
    await fs.mkdir(safePath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error.message);
    return false;
  }
}

/**
 * Save JSON to file with automatic directory creation
 */
async function saveJSON(data, filepath) {
  // Validate path to prevent path traversal
  const safePath = validateFilePath(filepath);
  const dir = path.dirname(safePath);
  await ensureDir(dir);
  await fs.writeFile(safePath, JSON.stringify(data, null, 2));
  return safePath;
}

/**
 * Load JSON from file with error handling
 */
async function loadJSON(filepath) {
  try {
    // Validate path to prevent path traversal
    const safePath = validateFilePath(filepath);
    const data = await fs.readFile(safePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load JSON from ${filepath}: ${error.message}`);
  }
}

/**
 * Get most recent file matching pattern in directory
 */
async function getMostRecentFile(dirPath, pattern = /\.json$/) {
  try {
    // Validate path to prevent path traversal
    const safePath = validateFilePath(dirPath);
    const files = await fs.readdir(safePath);
    const matchingFiles = files
      .filter(f => pattern.test(f))
      .map(f => ({
        name: f,
        path: path.join(safePath, f)
      }))
      .sort((a, b) => b.name.localeCompare(a.name));
    
    return matchingFiles.length > 0 ? matchingFiles[0].path : null;
  } catch (_error) {
    return null;
  }
}

/**
 * Append to log file (creates if not exists)
 */
async function appendToLog(logPath, entry) {
  // Validate path to prevent path traversal
  const safePath = validateFilePath(logPath);
  const dir = path.dirname(safePath);
  await ensureDir(dir);
  
  let logs = [];
  try {
    logs = await loadJSON(safePath);
  } catch (_error) {
    // File doesn't exist yet, start fresh
  }
  
  logs.push(entry);
  await saveJSON(logs, safePath);
  return logs.length;
}

module.exports = {
  ensureDir,
  saveJSON,
  loadJSON,
  getMostRecentFile,
  appendToLog
};
