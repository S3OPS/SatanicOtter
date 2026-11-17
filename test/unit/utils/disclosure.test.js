/**
 * Unit tests for affiliate disclosure utility
 */

const {
  DISCLOSURE_TEXT,
  CAPTION_SUFFIX,
  hasDisclosure,
  appendDisclosure
} = require('../../../automation/utils/disclosure');

describe('disclosure utility', () => {
  describe('appendDisclosure', () => {
    test('appends the disclosure statement and caption suffix', () => {
      const result = appendDisclosure('Check out this amazing product!');
      expect(result).toContain('Check out this amazing product!');
      expect(result).toContain(DISCLOSURE_TEXT);
      expect(result).toContain(CAPTION_SUFFIX);
    });

    test('is idempotent — applying twice never double-appends', () => {
      const once = appendDisclosure('Great find, link in bio');
      const twice = appendDisclosure(once);
      expect(twice).toBe(once);
      expect(twice.split(DISCLOSURE_TEXT).length - 1).toBe(1);
      expect(twice.split('#ad').length - 1).toBe(1);
    });

    test('does not re-append when disclosure already present', () => {
      const caption = `Nice product. ${DISCLOSURE_TEXT} #ad #affiliate`;
      expect(appendDisclosure(caption)).toBe(caption);
    });

    test('handles empty caption', () => {
      const result = appendDisclosure('');
      expect(result).toContain(DISCLOSURE_TEXT);
      expect(result).toContain(CAPTION_SUFFIX);
    });
  });

  describe('hasDisclosure', () => {
    test('detects the disclosure statement', () => {
      expect(hasDisclosure(`text ${DISCLOSURE_TEXT}`)).toBe(true);
      expect(hasDisclosure('no disclosure here')).toBe(false);
      expect(hasDisclosure(null)).toBe(false);
      expect(hasDisclosure(undefined)).toBe(false);
    });
  });
});
