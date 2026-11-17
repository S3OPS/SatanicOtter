/**
 * Kill Switch (Stage 0)
 *
 * The automation halts cleanly when either:
 *  - a file named STOP exists in the repository root, or
 *  - the AUTOMATION_STOP environment variable is 'true'.
 *
 * The orchestrator checks this before every cycle.
 */

const fs = require('fs');
const path = require('path');
const { getEnvBool } = require('./config');

const REPO_ROOT = path.join(__dirname, '..', '..');
const STOP_FILENAME = 'STOP';

/**
 * @param {string} [rootDir] - directory to look for the STOP file in
 * @returns {{ stopped: boolean, reason: string|null }}
 */
function isStopRequested(rootDir = REPO_ROOT) {
  if (getEnvBool('AUTOMATION_STOP', false)) {
    return { stopped: true, reason: 'AUTOMATION_STOP=true' };
  }

  if (fs.existsSync(path.join(rootDir, STOP_FILENAME))) {
    return { stopped: true, reason: `STOP file present in ${rootDir}` };
  }

  return { stopped: false, reason: null };
}

module.exports = {
  isStopRequested,
  STOP_FILENAME,
  REPO_ROOT
};
