/**
 * Unit tests for TikTok session health helper
 */

const { getTikTokSessionState } = require('../../../automation/utils/sessionHealth');

describe('sessionHealth utility', () => {
  test('reports missing when values are empty', () => {
    expect(getTikTokSessionState({})).toBe('missing');
    expect(getTikTokSessionState({ TIKTOK_USERNAME: '', TIKTOK_SESSION_ID: '' })).toBe('missing');
    expect(getTikTokSessionState({ TIKTOK_USERNAME: 'someone', TIKTOK_SESSION_ID: '' })).toBe('missing');
    expect(getTikTokSessionState({ TIKTOK_USERNAME: '', TIKTOK_SESSION_ID: 'abc123' })).toBe('missing');
  });

  test('reports missing when values are still placeholders', () => {
    expect(getTikTokSessionState({
      TIKTOK_USERNAME: 'your_tiktok_username',
      TIKTOK_SESSION_ID: 'your_tiktok_session_id'
    })).toBe('missing');
  });

  test('reports present-unverified when both values are present (dry-run default)', () => {
    expect(getTikTokSessionState({
      TIKTOK_USERNAME: 'someuser',
      TIKTOK_SESSION_ID: 'real-looking-session-value'
    })).toBe('present-unverified');
  });

  test('reports expired-or-rejected only when a live check rejected the session', () => {
    const env = { TIKTOK_USERNAME: 'someuser', TIKTOK_SESSION_ID: 'real-looking-session-value' };
    expect(getTikTokSessionState(env, { liveCheck: 'rejected' })).toBe('expired-or-rejected');
    expect(getTikTokSessionState(env, { liveCheck: 'ok' })).toBe('present-unverified');
    expect(getTikTokSessionState(env)).toBe('present-unverified');
  });
});
