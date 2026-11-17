/**
 * Affiliate Disclosure Utility
 *
 * Amazon's Associates Operating Agreement requires the disclosure
 * statement on content that carries affiliate links. Every queued
 * post caption/description must carry it exactly once.
 */

const DISCLOSURE_TEXT = 'As an Amazon Associate I earn from qualifying purchases.';
const CAPTION_SUFFIX = '#ad #affiliate';

/**
 * Check whether a caption already carries the disclosure statement
 */
function hasDisclosure(text) {
  return typeof text === 'string' && text.includes(DISCLOSURE_TEXT);
}

/**
 * Check whether a caption already carries the #ad tag
 */
function hasAdTag(text) {
  return typeof text === 'string' && /(^|\s)#ad(\s|$)/.test(text);
}

/**
 * Append the affiliate disclosure to a caption exactly once.
 * Idempotent: calling it on an already-disclosed caption returns
 * the caption unchanged (never double-appends).
 */
function appendDisclosure(caption) {
  let out = typeof caption === 'string' ? caption.trim() : '';

  if (!hasDisclosure(out)) {
    out = out ? `${out}\n\n${DISCLOSURE_TEXT}` : DISCLOSURE_TEXT;
  }

  if (!hasAdTag(out)) {
    out = `${out} ${CAPTION_SUFFIX}`;
  }

  return out;
}

module.exports = {
  DISCLOSURE_TEXT,
  CAPTION_SUFFIX,
  hasDisclosure,
  hasAdTag,
  appendDisclosure
};
