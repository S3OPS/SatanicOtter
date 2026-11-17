/**
 * Persistent Post Queue (Stage 0)
 *
 * JSON-file backed queue for scheduled posts. Every item carries a
 * deterministic idempotency key (hash of product ID + date + slot),
 * so re-running the loop for the same day never creates duplicate
 * entries. Completed items are recorded in a ledger file, so
 * restarts resume cleanly and finished work is never re-queued.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_DATA_DIR = path.join(__dirname, '../../automation-data');

/**
 * Derive a stable product ID from a product object
 * (ASIN when present, otherwise a slug of the product name)
 */
function productIdFor(product = {}) {
  const raw = product.asin || product.id || product.productId ||
    product.productName || product.name || 'unknown-product';
  return String(raw).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Deterministic idempotency key for one product on one day in one slot.
 * Same inputs always produce the same key.
 */
function makeIdempotencyKey(product, dateStr, slot) {
  const productId = productIdFor(product);
  return crypto
    .createHash('sha256')
    .update(`${productId}|${dateStr}|${slot}`)
    .digest('hex')
    .slice(0, 32);
}

function readJsonFile(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_e) {
    return fallback;
  }
}

function writeJsonFile(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

class PostQueue {
  constructor(dataDir = DEFAULT_DATA_DIR) {
    this.dataDir = dataDir;
    this.queueFile = path.join(dataDir, 'post-queue.json');
    this.ledgerFile = path.join(dataDir, 'post-ledger.json');
    this.items = [];
    this.ledger = [];
  }

  /**
   * Load queue + ledger from disk (missing files = empty)
   */
  load() {
    this.items = readJsonFile(this.queueFile, []);
    this.ledger = readJsonFile(this.ledgerFile, []);
    return this.items.length;
  }

  /**
   * Persist queue + ledger to disk
   */
  save() {
    writeJsonFile(this.queueFile, this.items);
    writeJsonFile(this.ledgerFile, this.ledger);
  }

  /**
   * Is this idempotency key already known (queued or completed)?
   */
  has(key) {
    return this.items.some(item => item.key === key) ||
      this.ledger.some(entry => entry.key === key);
  }

  /**
   * Add items, skipping any whose idempotency key is already known.
   * Returns { added, skipped }.
   */
  enqueue(newItems) {
    let added = 0;
    let skipped = 0;

    for (const item of newItems) {
      if (this.has(item.key)) {
        skipped++;
      } else {
        this.items.push({
          status: 'queued',
          queuedAt: new Date().toISOString(),
          ...item
        });
        added++;
      }
    }

    this.save();
    return { added, skipped };
  }

  /**
   * Items still waiting to be (simulated-)posted
   */
  pending() {
    return this.items.filter(item => item.status === 'queued');
  }

  /**
   * Mark an item complete and record it in the ledger
   */
  markCompleted(key, record = {}) {
    const item = this.items.find(i => i.key === key);
    if (!item) {
      return false;
    }

    item.status = record.status || 'dry-run-complete';
    item.completedAt = new Date().toISOString();

    this.ledger.push({
      key,
      productId: item.productId,
      date: item.date,
      slot: item.slot,
      completedAt: item.completedAt,
      mode: record.mode || 'dry-run',
      result: record.result || 'would-post'
    });

    this.save();
    return true;
  }

  size() {
    return this.items.length;
  }

  ledgerSize() {
    return this.ledger.length;
  }
}

module.exports = {
  PostQueue,
  makeIdempotencyKey,
  productIdFor,
  DEFAULT_DATA_DIR
};
