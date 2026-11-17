/**
 * Unit tests for the persistent post queue (idempotency + ledger)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { PostQueue, makeIdempotencyKey, productIdFor } = require('../../../automation/services/postQueue');

describe('postQueue service', () => {
  let dataDir;

  beforeEach(() => {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'postqueue-test-'));
  });

  afterEach(() => {
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  describe('productIdFor', () => {
    test('prefers ASIN when present', () => {
      expect(productIdFor({ asin: 'B0ABC123', productName: 'Other' })).toBe('b0abc123');
    });

    test('slugifies the product name otherwise', () => {
      expect(productIdFor({ productName: 'Gaming Laptop (High-End)' })).toBe('gaming-laptop-high-end');
    });
  });

  describe('makeIdempotencyKey', () => {
    const product = { productName: 'Premium Mattress (King)' };

    test('is stable — same inputs always produce the same key', () => {
      const a = makeIdempotencyKey(product, '2026-11-17', 0);
      const b = makeIdempotencyKey(product, '2026-11-17', 0);
      expect(a).toBe(b);
      expect(a).toMatch(/^[0-9a-f]{32}$/);
    });

    test('differs by date and by slot', () => {
      const base = makeIdempotencyKey(product, '2026-11-17', 0);
      expect(makeIdempotencyKey(product, '2026-11-18', 0)).not.toBe(base);
      expect(makeIdempotencyKey(product, '2026-11-17', 1)).not.toBe(base);
    });
  });

  describe('enqueue / persistence / ledger', () => {
    const item = () => ({
      key: makeIdempotencyKey({ productName: 'Treadmill (Premium)' }, '2026-11-17', 0),
      productId: 'treadmill-premium',
      productName: 'Treadmill (Premium)',
      date: '2026-11-17',
      slot: 0,
      caption: 'test caption'
    });

    test('enqueue skips duplicates by idempotency key', () => {
      const queue = new PostQueue(dataDir);
      queue.load();

      expect(queue.enqueue([item()])).toEqual({ added: 1, skipped: 0 });
      expect(queue.enqueue([item()])).toEqual({ added: 0, skipped: 1 });
      expect(queue.size()).toBe(1);
    });

    test('queue persists to disk and reloads in a fresh instance', () => {
      const queue = new PostQueue(dataDir);
      queue.load();
      queue.enqueue([item()]);

      const reloaded = new PostQueue(dataDir);
      expect(reloaded.load()).toBe(1);
      expect(reloaded.pending().length).toBe(1);
    });

    test('completed items land in the ledger and are never re-queued', () => {
      const queue = new PostQueue(dataDir);
      queue.load();
      const it = item();
      queue.enqueue([it]);

      expect(queue.markCompleted(it.key, { mode: 'dry-run', result: 'would-post' })).toBe(true);
      expect(queue.ledgerSize()).toBe(1);
      expect(queue.pending().length).toBe(0);
      expect(queue.enqueue([item()])).toEqual({ added: 0, skipped: 1 });

      const reloaded = new PostQueue(dataDir);
      reloaded.load();
      expect(reloaded.ledgerSize()).toBe(1);
      expect(reloaded.has(it.key)).toBe(true);
    });
  });
});
