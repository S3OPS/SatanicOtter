/**
 * TikTok Session Health (Stage 0)
 *
 * Session-ID auth is the recommended TikTok login method (see
 * .env.example): it avoids password handling, 2FA and CAPTCHA.
 * This helper only inspects presence/format of the configured
 * values. It NEVER opens TikTok or attempts a login.
 *
 * States:
 *  - 'missing':            username or session ID absent or still a placeholder
 *  - 'present-unverified': both values present; no live check performed
 *                          (the default — and the only reachable "present"
 *                          state in dry-run mode)
 *  - 'expired-or-rejected': a live check was performed elsewhere and
 *                          reported the session as rejected
 */

const PLACEHOLDER_VALUES = new Set([
  'your_tiktok_username',
  'your_tiktok_session_id',
  'your_session_id',
  'your_username'
]);

function isUsableValue(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && !PLACEHOLDER_VALUES.has(trimmed);
}

/**
 * Report the TikTok session state from env values.
 *
 * @param {object} env - environment map (defaults to process.env)
 * @param {object} [options]
 * @param {string} [options.liveCheck] - result of an out-of-band live
 *   verification ('rejected' marks the session expired-or-rejected).
 *   Dry-run callers never pass this.
 * @returns {'missing'|'present-unverified'|'expired-or-rejected'}
 */
function getTikTokSessionState(env = process.env, options = {}) {
  const username = env.TIKTOK_USERNAME;
  const sessionId = env.TIKTOK_SESSION_ID;

  if (!isUsableValue(username) || !isUsableValue(sessionId)) {
    return 'missing';
  }

  if (options.liveCheck === 'rejected') {
    return 'expired-or-rejected';
  }

  return 'present-unverified';
}

module.exports = {
  getTikTokSessionState,
  isUsableValue,
  PLACEHOLDER_VALUES
};
