/**
 * Stage 0 Runner — local, DRY-RUN-ONLY autonomous loop.
 *
 * One full cycle:
 *   product research (offline catalog)
 *   → content generation (Ollama local AI, or labeled MOCK fallback)
 *   → persistent queue (disclosure appended, idempotency keys)
 *   → simulated posting (logs "would post" — NO network to TikTok)
 *   → analytics summary
 *
 * Writes a Markdown run report to stage0-runs/<timestamp>.md.
 *
 * Guardrails enforced here:
 *  - refuses to run unless PROFILE_DRY_RUN=true
 *  - halts cleanly when the kill switch is engaged (STOP file /
 *    AUTOMATION_STOP=true)
 *  - TikTok session is checked for presence/format only — no
 *    login is attempted and TikTok is never contacted
 */

const fs = require('fs');
const path = require('path');
const { loadEnv, getEnv, getEnvBool, getEnvInt, getEnvArray } = require('./utils/config');
const { info, warn, error: logError, section } = require('./utils/logger');
const { generateProductRecommendations } = require('./productResearch');
const { generateCaption } = require('./contentGenerator');
const aiProvider = require('./utils/aiProvider');
const { appendDisclosure } = require('./utils/disclosure');
const { getTikTokSessionState } = require('./utils/sessionHealth');
const { isStopRequested } = require('./utils/stopSwitch');
const { PostQueue, makeIdempotencyKey, productIdFor } = require('./services/postQueue');
const { getSummary } = require('./analyticsTracker');

loadEnv();

const REPORTS_DIR = path.join(__dirname, '../stage0-runs');

function todayInTimezone(timezone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function contentSourceLabel(source) {
  if (source === 'ollama') return 'ollama-live';
  if (source === 'mock') return 'mock-fallback';
  return source || 'none';
}

function writeReport(lines) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(REPORTS_DIR, `${stamp}.md`);
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return reportPath;
}

async function runStage0() {
  section('Stage 0 — Dry-Run Autonomous Loop');
  const startedAt = new Date().toISOString();
  const timezone = getEnv('TIMEZONE', 'America/Chicago');
  const dateStr = todayInTimezone(timezone);
  const postsPerDay = Math.max(1, getEnvInt('POSTS_PER_DAY', 2));
  const provider = aiProvider.getProvider();
  const providerDetail = provider === 'ollama'
    ? ` (${getEnv('OLLAMA_MODEL', 'qwen3:14b')} @ ${getEnv('OLLAMA_HOST', 'http://localhost:11434')})`
    : '';

  const reportLines = [
    '# Stage 0 Run Report',
    '',
    `- Started: ${startedAt}`,
    `- Mode: DRY-RUN (no posting, no TikTok contact)`,
    `- Date (timezone ${timezone}): ${dateStr}`,
    `- AI provider configured: ${provider}${providerDetail}`,
    `- Posts per day cap: ${postsPerDay}`
  ];

  // Guardrail: Stage 0 is dry-run only — never run it live.
  if (!getEnvBool('PROFILE_DRY_RUN', true)) {
    const msg = 'PROFILE_DRY_RUN is not true — Stage 0 refuses to run. Stage 0 is dry-run only.';
    logError('Stage0', msg);
    reportLines.push(`- RESULT: REFUSED — ${msg}`);
    writeReport(reportLines);
    throw new Error(msg);
  }

  // Kill switch — checked before the cycle begins.
  const stop = isStopRequested();
  if (stop.stopped) {
    info('Stage0', `HALTED by kill switch (${stop.reason}). No cycle executed.`);
    reportLines.push(`- Kill switch: ENGAGED (${stop.reason}) — cycle halted before any work`);
    reportLines.push('- RESULT: HALTED');
    const reportPath = writeReport(reportLines);
    info('Stage0', `Run report written: ${reportPath}`);
    return { halted: true, reportPath };
  }
  reportLines.push('- Kill switch: clear');

  // TikTok session — presence/format check only. No login, no network.
  const sessionState = getTikTokSessionState(process.env);
  info('Stage0', `TikTok session state: ${sessionState} (dry-run: presence check only, no login attempted)`);
  reportLines.push(`- TikTok session state: ${sessionState} (presence check only — no login attempted)`);

  // Step 1: product research — the existing offline catalog.
  // No network or credentials are involved in this module.
  const recommendations = generateProductRecommendations();
  const selected = recommendations.slice(0, postsPerDay);
  info('Stage0', `Research (offline catalog): ${recommendations.length} recommendations, selected ${selected.length} for today`);
  reportLines.push(`- Research: offline catalog, ${recommendations.length} recommendations, ${selected.length} selected`);

  // Step 2: content generation + queueing (disclosure + idempotency).
  const times = getEnvArray('POSTING_TIMES', ['06:30', '20:00']);
  const tag = getEnv('AMAZON_AFFILIATE_TAG', '');
  const queue = new PostQueue();
  queue.load();

  const newItems = [];
  for (let slot = 0; slot < selected.length; slot++) {
    const product = selected[slot];
    const hook = `POV: You found the solution — ${product.productName}`;

    let caption;
    try {
      caption = await generateCaption(product.productName, hook);
    } catch (error) {
      warn('Stage0', `Caption generation failed for ${product.productName} (${error.message}); using hook text as caption.`);
      caption = hook;
    }
    caption = appendDisclosure(String(caption).trim());

    newItems.push({
      key: makeIdempotencyKey(product, dateStr, slot),
      productId: productIdFor(product),
      productName: product.productName,
      category: product.category,
      date: dateStr,
      slot,
      time: times[slot] || times[times.length - 1] || '06:30',
      caption,
      affiliateLink: tag
        ? `https://www.amazon.com/s?k=${encodeURIComponent(product.productName)}&tag=${tag}`
        : null,
      contentSource: aiProvider.getLastContentSource()
    });
  }

  const { added, skipped } = queue.enqueue(newItems);
  info('Stage0', `Queue: ${added} added, ${skipped} duplicate(s) skipped by idempotency, ${queue.size()} total, ledger ${queue.ledgerSize()}`);
  reportLines.push(`- Queue: ${added} added, ${skipped} duplicate(s) skipped, ${queue.size()} total entries, ledger ${queue.ledgerSize()} completed`);

  // Step 3: simulated posting — log only. TikTok is never contacted.
  const pending = queue.pending().slice(0, postsPerDay);
  const simulatedLines = [];
  for (const item of pending) {
    info('Stage0', `WOULD POST (dry-run, no network): [${item.date} ${item.time}] ${item.productName} — key ${item.key}`);
    queue.markCompleted(item.key, { mode: 'dry-run', result: 'would-post' });
    simulatedLines.push(`  - [${item.time}] ${item.productName} (key ${item.key})`);
  }
  reportLines.push(`- Simulated posts this run: ${simulatedLines.length}`);
  reportLines.push(...simulatedLines);

  // Step 4: analytics summary (existing tracker; null when no data yet).
  let analyticsSummary = null;
  try {
    analyticsSummary = await getSummary(7);
  } catch (_e) {
    analyticsSummary = null;
  }
  reportLines.push(`- Analytics (last 7 days): ${analyticsSummary ? JSON.stringify(analyticsSummary) : 'no entries recorded yet'}`);

  // Content source actually used this run — stated honestly.
  const sourceLabel = contentSourceLabel(aiProvider.getLastContentSource());
  reportLines.push(`- Content source used: ${sourceLabel}`);
  if (sourceLabel === 'mock-fallback') {
    reportLines.push('- WARNING: content is MOCK template output (no AI provider was reachable). It is NOT real AI output.');
  }
  info('Stage0', `Content source used: ${sourceLabel}`);

  reportLines.push('- RESULT: COMPLETE (dry-run)');
  const reportPath = writeReport(reportLines);
  info('Stage0', `Run report written: ${reportPath}`);

  return {
    halted: false,
    reportPath,
    sessionState,
    contentSource: sourceLabel,
    queueAdded: added,
    queueSkipped: skipped,
    queueTotal: queue.size(),
    ledgerTotal: queue.ledgerSize(),
    simulated: simulatedLines.length
  };
}

// CLI execution
if (require.main === module) {
  runStage0()
    .then(() => process.exit(0))
    .catch(error => {
      logError('Stage0', error.message);
      process.exit(1);
    });
}

module.exports = { runStage0 };
