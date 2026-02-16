/**
 * Unit tests for validators utility
 */

const validators = require('../../../automation/utils/validators');

describe('validators utility', () => {
  describe('isNonEmptyString', () => {
    test('returns true for non-empty strings', () => {
      expect(validators.isNonEmptyString('hello')).toBe(true);
      expect(validators.isNonEmptyString('  test  ')).toBe(true);
      expect(validators.isNonEmptyString('123')).toBe(true);
    });

    test('returns false for empty or invalid inputs', () => {
      expect(validators.isNonEmptyString('')).toBe(false);
      expect(validators.isNonEmptyString('   ')).toBe(false);
      expect(validators.isNonEmptyString(null)).toBe(false);
      expect(validators.isNonEmptyString(undefined)).toBe(false);
      expect(validators.isNonEmptyString(123)).toBe(false);
    });
  });

  describe('isPositiveInteger', () => {
    test('returns true for positive integers', () => {
      expect(validators.isPositiveInteger(1)).toBe(true);
      expect(validators.isPositiveInteger(100)).toBe(true);
      expect(validators.isPositiveInteger(999999)).toBe(true);
    });

    test('returns false for zero, negative, or non-integers', () => {
      expect(validators.isPositiveInteger(0)).toBe(false);
      expect(validators.isPositiveInteger(-1)).toBe(false);
      expect(validators.isPositiveInteger(1.5)).toBe(false);
      expect(validators.isPositiveInteger('1')).toBe(false);
      expect(validators.isPositiveInteger(null)).toBe(false);
    });
  });

  describe('isNonNegativeInteger', () => {
    test('returns true for non-negative integers', () => {
      expect(validators.isNonNegativeInteger(0)).toBe(true);
      expect(validators.isNonNegativeInteger(1)).toBe(true);
      expect(validators.isNonNegativeInteger(100)).toBe(true);
    });

    test('returns false for negative or non-integers', () => {
      expect(validators.isNonNegativeInteger(-1)).toBe(false);
      expect(validators.isNonNegativeInteger(1.5)).toBe(false);
      expect(validators.isNonNegativeInteger('0')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    test('returns true for valid email addresses', () => {
      expect(validators.isValidEmail('test@example.com')).toBe(true);
      expect(validators.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(validators.isValidEmail('user+tag@example.com')).toBe(true);
    });

    test('returns false for invalid email addresses', () => {
      expect(validators.isValidEmail('invalid')).toBe(false);
      expect(validators.isValidEmail('test@')).toBe(false);
      expect(validators.isValidEmail('@example.com')).toBe(false);
      expect(validators.isValidEmail('test @example.com')).toBe(false);
      expect(validators.isValidEmail('')).toBe(false);
      expect(validators.isValidEmail(null)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    test('returns true for valid URLs', () => {
      expect(validators.isValidUrl('https://example.com')).toBe(true);
      expect(validators.isValidUrl('http://localhost:3000')).toBe(true);
      expect(validators.isValidUrl('https://sub.domain.com/path?query=1')).toBe(true);
    });

    test('returns false for invalid URLs', () => {
      expect(validators.isValidUrl('not-a-url')).toBe(false);
      // Note: 'ftp:/invalid' is technically a valid URL according to URL constructor
      expect(validators.isValidUrl('')).toBe(false);
      expect(validators.isValidUrl(null)).toBe(false);
      expect(validators.isValidUrl('just-text')).toBe(false);
    });
  });

  describe('isValidAmazonTag', () => {
    test('returns true for valid Amazon affiliate tags', () => {
      expect(validators.isValidAmazonTag('mystore-20')).toBe(true);
      expect(validators.isValidAmazonTag('test123-21')).toBe(true);
      expect(validators.isValidAmazonTag('affiliate-tag')).toBe(true);
    });

    test('returns false for invalid Amazon affiliate tags', () => {
      expect(validators.isValidAmazonTag('ab')).toBe(false); // too short
      expect(validators.isValidAmazonTag('a'.repeat(31))).toBe(false); // too long
      expect(validators.isValidAmazonTag('tag with spaces')).toBe(false);
      expect(validators.isValidAmazonTag('tag@invalid')).toBe(false);
      expect(validators.isValidAmazonTag('')).toBe(false);
      expect(validators.isValidAmazonTag(null)).toBe(false);
    });
  });

  describe('isValidTimeString', () => {
    test('returns true for valid time strings', () => {
      expect(validators.isValidTimeString('00:00')).toBe(true);
      expect(validators.isValidTimeString('12:30')).toBe(true);
      expect(validators.isValidTimeString('23:59')).toBe(true);
      expect(validators.isValidTimeString('9:05')).toBe(true);
    });

    test('returns false for invalid time strings', () => {
      expect(validators.isValidTimeString('24:00')).toBe(false);
      expect(validators.isValidTimeString('12:60')).toBe(false);
      expect(validators.isValidTimeString('9:5')).toBe(false);
      expect(validators.isValidTimeString('12-30')).toBe(false);
      expect(validators.isValidTimeString('')).toBe(false);
    });
  });

  describe('isValidTimezone', () => {
    test('returns true for valid timezones', () => {
      expect(validators.isValidTimezone('America/New_York')).toBe(true);
      expect(validators.isValidTimezone('Europe/London')).toBe(true);
      expect(validators.isValidTimezone('UTC')).toBe(true);
    });

    test('returns false for invalid timezones', () => {
      expect(validators.isValidTimezone('Invalid/Zone')).toBe(false);
      expect(validators.isValidTimezone('Not A Timezone')).toBe(false);
      expect(validators.isValidTimezone('')).toBe(false);
      expect(validators.isValidTimezone(null)).toBe(false);
    });
  });

  describe('isOneOf', () => {
    test('returns true when value is in allowed values', () => {
      expect(validators.isOneOf('a', ['a', 'b', 'c'])).toBe(true);
      expect(validators.isOneOf(1, [1, 2, 3])).toBe(true);
      expect(validators.isOneOf('test', ['test'])).toBe(true);
    });

    test('returns false when value is not in allowed values', () => {
      expect(validators.isOneOf('d', ['a', 'b', 'c'])).toBe(false);
      expect(validators.isOneOf(4, [1, 2, 3])).toBe(false);
      expect(validators.isOneOf('test', [])).toBe(false);
    });

    test('returns false for invalid input', () => {
      expect(validators.isOneOf('a', null)).toBe(false);
      expect(validators.isOneOf('a', 'not-array')).toBe(false);
    });
  });

  describe('isInRange', () => {
    test('returns true when value is within range', () => {
      expect(validators.isInRange(5, 0, 10)).toBe(true);
      expect(validators.isInRange(0, 0, 10)).toBe(true);
      expect(validators.isInRange(10, 0, 10)).toBe(true);
      expect(validators.isInRange(-5, -10, 0)).toBe(true);
    });

    test('returns false when value is outside range', () => {
      expect(validators.isInRange(-1, 0, 10)).toBe(false);
      expect(validators.isInRange(11, 0, 10)).toBe(false);
      expect(validators.isInRange(NaN, 0, 10)).toBe(false);
    });

    test('returns false for non-numeric values', () => {
      expect(validators.isInRange('5', 0, 10)).toBe(false);
      expect(validators.isInRange(null, 0, 10)).toBe(false);
      expect(validators.isInRange(undefined, 0, 10)).toBe(false);
    });
  });

  describe('isValidISODate', () => {
    test('returns true for valid ISO date strings', () => {
      expect(validators.isValidISODate('2024-01-01')).toBe(true);
      expect(validators.isValidISODate('2024-12-31T23:59:59Z')).toBe(true);
      expect(validators.isValidISODate('2024-06-15T12:30:00.000Z')).toBe(true);
    });

    test('returns false for invalid date strings', () => {
      expect(validators.isValidISODate('not-a-date')).toBe(false);
      expect(validators.isValidISODate('01/01/2024')).toBe(false);
      expect(validators.isValidISODate('')).toBe(false);
      expect(validators.isValidISODate(null)).toBe(false);
    });
  });

  describe('hasRequiredKeys', () => {
    test('returns valid:true when all keys are present', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = validators.hasRequiredKeys(obj, ['a', 'b']);
      expect(result.valid).toBe(true);
      expect(result.missingKeys).toEqual([]);
    });

    test('returns valid:false with missing keys listed', () => {
      const obj = { a: 1, b: 2 };
      const result = validators.hasRequiredKeys(obj, ['a', 'b', 'c']);
      expect(result.valid).toBe(false);
      expect(result.missingKeys).toEqual(['c']);
    });

    test('handles null or invalid objects', () => {
      const result = validators.hasRequiredKeys(null, ['a', 'b']);
      expect(result.valid).toBe(false);
      expect(result.missingKeys).toEqual(['a', 'b']);
    });
  });

  describe('isNotPlaceholder', () => {
    test('returns true for real values', () => {
      expect(validators.isNotPlaceholder('real-value')).toBe(true);
      expect(validators.isNotPlaceholder('mystore-20')).toBe(true);
      expect(validators.isNotPlaceholder('actual@email.com')).toBe(true);
    });

    test('returns false for placeholder values', () => {
      expect(validators.isNotPlaceholder('your_value')).toBe(false);
      expect(validators.isNotPlaceholder('your-api-key')).toBe(false);
      expect(validators.isNotPlaceholder('<YOUR_VALUE>')).toBe(false);
      expect(validators.isNotPlaceholder('example@example.com')).toBe(false);
      expect(validators.isNotPlaceholder('TODO')).toBe(false);
      expect(validators.isNotPlaceholder('CHANGEME')).toBe(false);
      expect(validators.isNotPlaceholder('[value]')).toBe(false);
      expect(validators.isNotPlaceholder('undefined')).toBe(false);
      expect(validators.isNotPlaceholder('null')).toBe(false);
    });

    test('returns false for empty or invalid inputs', () => {
      expect(validators.isNotPlaceholder('')).toBe(false);
      expect(validators.isNotPlaceholder('   ')).toBe(false);
      expect(validators.isNotPlaceholder(null)).toBe(false);
    });
  });

  describe('validateEnvConfig', () => {
    test('validates required fields', () => {
      const env = { KEY1: 'value1' };
      const schema = {
        KEY1: { required: true },
        KEY2: { required: true }
      };
      const result = validators.validateEnvConfig(env, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('KEY2: Required but not configured');
    });

    test('validates email fields', () => {
      const env = { EMAIL: 'invalid-email' };
      const schema = { EMAIL: { type: 'email' } };
      const result = validators.validateEnvConfig(env, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('EMAIL: Invalid email format');
    });

    test('validates integer fields with range', () => {
      const env = { COUNT: '150' };
      const schema = {
        COUNT: { type: 'integer', min: 1, max: 100 }
      };
      const result = validators.validateEnvConfig(env, schema);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Must be at most 100');
    });

    test('validates enum fields', () => {
      const env = { MODE: 'invalid' };
      const schema = {
        MODE: { enum: ['dev', 'prod', 'test'] }
      };
      const result = validators.validateEnvConfig(env, schema);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Must be one of');
    });

    test('skips validation for optional unset fields', () => {
      const env = {};
      const schema = { OPTIONAL: { type: 'email' } };
      const result = validators.validateEnvConfig(env, schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('validates custom validator function', () => {
      const env = { CUSTOM: 'bad' };
      const schema = {
        CUSTOM: {
          validate: (value) => {
            return value === 'bad' ? 'Custom validation failed' : null;
          }
        }
      };
      const result = validators.validateEnvConfig(env, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('CUSTOM: Custom validation failed');
    });
  });

  describe('validationResult', () => {
    test('creates valid result object', () => {
      const result = validators.validationResult(true);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.hasErrors()).toBe(false);
      expect(result.getFirstError()).toBe(null);
    });

    test('creates invalid result with errors', () => {
      const errors = ['Error 1', 'Error 2'];
      const result = validators.validationResult(false, errors);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(errors);
      expect(result.hasErrors()).toBe(true);
      expect(result.getFirstError()).toBe('Error 1');
    });
  });
});
