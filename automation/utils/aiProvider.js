/**
 * AI Provider Abstraction (Stage 0)
 *
 * Selects the text-generation backend via the AI_PROVIDER env var:
 *  - 'openai' (default): delegates to utils/openaiService — the
 *    original behavior, unchanged.
 *  - 'ollama': local Ollama HTTP API at OLLAMA_HOST
 *    (default http://localhost:11434), model OLLAMA_MODEL
 *    (default qwen3:14b). Plain HTTP via Node's fetch — no new deps.
 *
 * If Ollama is unreachable, generation falls back to a clearly
 * labeled MOCK generator so an offline dry-run can still complete
 * with zero external accounts. Mock output is template text, is
 * logged with a loud warning, and is marked (source: 'mock' /
 * '[MOCK CONTENT ...]' prefix). It must never be presented as
 * real AI output.
 */

const { getEnv } = require('./config');
const { warn } = require('./logger');
const { generateCompletion: openaiGenerateCompletion } = require('./openaiService');

// Tracks where the most recent generation actually came from:
// 'openai' | 'ollama' | 'mock' | null (nothing generated yet)
let lastContentSource = null;

function getProvider() {
  return (getEnv('AI_PROVIDER', 'openai') || 'openai').toLowerCase();
}

function getLastContentSource() {
  return lastContentSource;
}

/**
 * Generate a completion via the local Ollama chat API.
 * Throws on any failure (unreachable, bad status, empty reply) —
 * the caller decides on fallback.
 */
async function ollamaGenerateCompletion(messages, options = {}) {
  const host = (getEnv('OLLAMA_HOST', 'http://localhost:11434') || 'http://localhost:11434').replace(/\/+$/, '');
  const model = getEnv('OLLAMA_MODEL', 'qwen3:14b');
  const timeoutMs = 60000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: { temperature: options.temperature ?? 0.8 }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Ollama responded HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data && data.message && data.message.content;
    if (!content) {
      throw new Error('Ollama returned no message content');
    }
    return content;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * MOCK completion generator — template text only, clearly labeled.
 * Used solely so offline dry-runs can complete when no AI provider
 * is available. Output is NOT real AI output.
 */
function generateMockCompletion(messages) {
  const userMessage = [...messages].reverse().find(m => m.role === 'user');
  const userText = userMessage ? userMessage.content : '';

  // Content-ideas prompts ask for a JSON array — honor that shape so
  // parseAIResponse() downstream behaves the same as with a real model.
  if (userText.includes('JSON array')) {
    const productsMatch = userText.match(/Products:\s*(.+)/);
    const products = productsMatch
      ? productsMatch[1].split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const names = products.length > 0 ? products : ['Featured Product'];
    const countMatch = userText.match(/Generate (\d+)/);
    const requested = countMatch ? parseInt(countMatch[1], 10) : names.length;
    const count = Math.max(1, Math.min(requested, 10));

    const ideas = [];
    for (let i = 0; i < count; i++) {
      const product = names[i % names.length];
      ideas.push({
        hook: `MOCK: POV: You found the solution — ${product}`,
        script: `[MOCK SCRIPT] 0-2s hook; 3-10s problem; 11-20s show ${product}; 21-25s CTA. (Template fallback — no AI provider was available.)`,
        valueJustification: 'MOCK: premium quality justifies the price (template text, not AI-generated).',
        cta: 'MOCK: Link in bio — check it before it sells out.',
        hashtags: ['#mock', '#tiktokmademebuyit', '#affiliate'],
        productPrice: 999,
        expectedCommission: 100,
        source: 'mock'
      });
    }
    return JSON.stringify(ideas);
  }

  // Plain-text prompts (scripts, captions)
  const productMatch = userText.match(/Product:\s*(.+)/);
  const product = productMatch ? productMatch[1].trim() : 'this product';
  return `[MOCK CONTENT — no AI provider available] You NEED to see ${product} 😱 Link in bio 🔗 #mock #affiliate`;
}

/**
 * Generate a completion with the configured provider.
 * Same signature as openaiService.generateCompletion.
 */
async function generateCompletion(messages, options = {}) {
  const provider = getProvider();

  if (provider === 'ollama') {
    try {
      const content = await ollamaGenerateCompletion(messages, options);
      lastContentSource = 'ollama';
      return content;
    } catch (error) {
      warn('AIProvider', `OLLAMA UNREACHABLE (${error.message}). Falling back to the MOCK content generator — output is labeled MOCK and is NOT real AI output.`);
      lastContentSource = 'mock';
      return generateMockCompletion(messages);
    }
  }

  const content = await openaiGenerateCompletion(messages, options);
  lastContentSource = 'openai';
  return content;
}

module.exports = {
  getProvider,
  getLastContentSource,
  generateCompletion,
  ollamaGenerateCompletion,
  generateMockCompletion
};
