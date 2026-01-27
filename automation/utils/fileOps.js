/**
 * File Operations Utility
 * Centralized file I/O with error handling
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Ensure directory exists (create if not)
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
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
  const dir = path.dirname(filepath);
  await ensureDir(dir);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  return filepath;
}

/**
 * Load JSON from file with error handling
 */
async function loadJSON(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
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
    const files = await fs.readdir(dirPath);
    const matchingFiles = files
      .filter(f => pattern.test(f))
      .map(f => ({
        name: f,
        path: path.join(dirPath, f)
      }))
      .sort((a, b) => b.name.localeCompare(a.name));
    
    return matchingFiles.length > 0 ? matchingFiles[0].path : null;
  } catch (error) {
    return null;
  }
}

/**
 * Append to log file (creates if not exists)
 */
async function appendToLog(logPath, entry) {
  const dir = path.dirname(logPath);
  await ensureDir(dir);
  
  let logs = [];
  try {
    logs = await loadJSON(logPath);
  } catch (error) {
    // File doesn't exist yet, start fresh
  }
  
  logs.push(entry);
  await saveJSON(logs, logPath);
  return logs.length;
}

module.exports = {
  ensureDir,
  saveJSON,
  loadJSON,
  getMostRecentFile,
  appendToLog
};
