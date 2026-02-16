/**
 * Unit tests for security utility
 */

const path = require('path');
const security = require('../../../automation/utils/security');

describe('security utility', () => {
  describe('validateFilePath', () => {
    test('returns absolute path for valid input', () => {
      const result = security.validateFilePath('test.txt');
      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toContain('test.txt');
    });

    test('throws error for null or undefined paths', () => {
      expect(() => security.validateFilePath(null)).toThrow('Invalid file path');
      expect(() => security.validateFilePath(undefined)).toThrow('Invalid file path');
    });

    test('throws error for non-string paths', () => {
      expect(() => security.validateFilePath(123)).toThrow('Invalid file path');
      expect(() => security.validateFilePath({})).toThrow('Invalid file path');
    });

    test('prevents path traversal with ../', () => {
      const allowedDir = '/allowed';
      expect(() => {
        security.validateFilePath('../etc/passwd', allowedDir);
      }).toThrow('Path traversal attempt detected');
    });

    test('prevents path traversal with multiple ../', () => {
      const allowedDir = '/allowed';
      expect(() => {
        security.validateFilePath('../../etc/passwd', allowedDir);
      }).toThrow('Path traversal attempt detected');
    });

    test('allows paths within allowed directory', () => {
      const allowedDir = process.cwd();
      const result = security.validateFilePath('test/file.txt', allowedDir);
      expect(result).toContain('test');
      expect(result).toContain('file.txt');
    });

    test('allows subdirectories within allowed directory', () => {
      const allowedDir = process.cwd();
      const result = security.validateFilePath('test/sub/file.txt', allowedDir);
      expect(result).toContain('test');
      expect(result).toContain('sub');
      expect(result).toContain('file.txt');
    });

    test('works without allowedDir parameter', () => {
      const result = security.validateFilePath('test.txt');
      expect(path.isAbsolute(result)).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    test('removes angle brackets', () => {
      const result = security.sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toBe('scriptalert("xss")/script');
    });

    test('removes newlines', () => {
      const result = security.sanitizeInput('line1\nline2\rline3');
      expect(result).not.toContain('\n');
      expect(result).not.toContain('\r');
      expect(result).toBe('line1line2line3');
    });

    test('trims whitespace', () => {
      const result = security.sanitizeInput('  test  ');
      expect(result).toBe('test');
    });

    test('handles empty strings', () => {
      const result = security.sanitizeInput('');
      expect(result).toBe('');
    });

    test('returns non-strings unchanged', () => {
      expect(security.sanitizeInput(123)).toBe(123);
      expect(security.sanitizeInput(null)).toBe(null);
      expect(security.sanitizeInput(undefined)).toBe(undefined);
      const obj = { test: true };
      expect(security.sanitizeInput(obj)).toBe(obj);
    });

    test('handles strings with multiple issues', () => {
      const result = security.sanitizeInput('  <script>\nalert("xss")\r</script>  ');
      expect(result).toBe('scriptalert("xss")/script');
    });
  });

  describe('isValidEnvVarName', () => {
    test('accepts valid uppercase names', () => {
      expect(security.isValidEnvVarName('API_KEY')).toBe(true);
      expect(security.isValidEnvVarName('DATABASE_URL')).toBe(true);
      expect(security.isValidEnvVarName('MAX_RETRIES')).toBe(true);
    });

    test('accepts names starting with underscore', () => {
      expect(security.isValidEnvVarName('_PRIVATE_KEY')).toBe(true);
      expect(security.isValidEnvVarName('__DEBUG__')).toBe(true);
    });

    test('accepts names with numbers', () => {
      expect(security.isValidEnvVarName('API_KEY_V2')).toBe(true);
      expect(security.isValidEnvVarName('MAX_RETRIES_3')).toBe(true);
    });

    test('rejects lowercase names', () => {
      expect(security.isValidEnvVarName('api_key')).toBe(false);
      expect(security.isValidEnvVarName('apiKey')).toBe(false);
    });

    test('rejects names with special characters', () => {
      expect(security.isValidEnvVarName('API-KEY')).toBe(false);
      expect(security.isValidEnvVarName('API.KEY')).toBe(false);
      expect(security.isValidEnvVarName('API KEY')).toBe(false);
    });

    test('rejects names starting with numbers', () => {
      expect(security.isValidEnvVarName('3API_KEY')).toBe(false);
      expect(security.isValidEnvVarName('123')).toBe(false);
    });

    test('rejects empty strings', () => {
      expect(security.isValidEnvVarName('')).toBe(false);
    });
  });

  describe('redactSensitive', () => {
    test('redacts API keys', () => {
      const result = security.redactSensitive('api_key=abc123def456');
      expect(result).toContain('***REDACTED***');
      expect(result).not.toContain('abc123def456');
    });

    test('redacts API keys with different formats', () => {
      // The regex in redactSensitive requires the pattern to match with specific separators
      expect(security.redactSensitive('api_key=abc123')).toContain('***REDACTED***');
      expect(security.redactSensitive('api-key = abc123')).toContain('***REDACTED***');
    });

    test('redacts tokens', () => {
      const result = security.redactSensitive('token=xyz789');
      expect(result).toContain('***REDACTED***');
      expect(result).not.toContain('xyz789');
    });

    test('redacts passwords', () => {
      const result = security.redactSensitive('password: mypassword123');
      expect(result).toContain('***REDACTED***');
      expect(result).not.toContain('mypassword123');
    });

    test('redacts secrets', () => {
      const result = security.redactSensitive('secret=mysecret456');
      expect(result).toContain('***REDACTED***');
      expect(result).not.toContain('mysecret456');
    });

    test('redacts OpenAI API keys', () => {
      const result = security.redactSensitive('sk-1234567890abcdefghij');
      expect(result).toBe('sk-***REDACTED***');
    });

    test('redacts multiple sensitive values', () => {
      const text = 'api_key=abc123 token=xyz789 password=secret';
      const result = security.redactSensitive(text);
      expect(result).toContain('***REDACTED***');
      expect(result).not.toContain('abc123');
      expect(result).not.toContain('xyz789');
      expect(result).not.toContain('secret');
    });

    test('preserves non-sensitive text', () => {
      const text = 'This is a normal message without secrets';
      const result = security.redactSensitive(text);
      expect(result).toBe(text);
    });

    test('returns non-strings unchanged', () => {
      expect(security.redactSensitive(123)).toBe(123);
      expect(security.redactSensitive(null)).toBe(null);
      expect(security.redactSensitive(undefined)).toBe(undefined);
    });

    test('handles prefixed keys', () => {
      // The regex pattern matches "prefix_" followed by "api_key" or "apikey" 
      const result = security.redactSensitive('client_api_key: abc123');
      expect(result).toContain('***REDACTED***');
      expect(result).not.toContain('abc123');
    });
  });

  describe('containsSensitiveData', () => {
    test('detects api keys', () => {
      expect(security.containsSensitiveData('api_key=123')).toBe(true);
      expect(security.containsSensitiveData('API-KEY: abc')).toBe(true);
      expect(security.containsSensitiveData('apikey=xyz')).toBe(true);
    });

    test('detects tokens', () => {
      expect(security.containsSensitiveData('token=abc123')).toBe(true);
      expect(security.containsSensitiveData('TOKEN: xyz')).toBe(true);
      expect(security.containsSensitiveData('auth_token=123')).toBe(true);
    });

    test('detects passwords', () => {
      expect(security.containsSensitiveData('password=secret')).toBe(true);
      expect(security.containsSensitiveData('PASSWORD: abc')).toBe(true);
      expect(security.containsSensitiveData('user_password=xyz')).toBe(true);
    });

    test('detects secrets', () => {
      expect(security.containsSensitiveData('secret=value')).toBe(true);
      expect(security.containsSensitiveData('SECRET: abc')).toBe(true);
      expect(security.containsSensitiveData('client_secret=xyz')).toBe(true);
    });

    test('detects OpenAI API keys', () => {
      expect(security.containsSensitiveData('sk-1234567890abcdefghij')).toBe(true);
    });

    test('detects email addresses', () => {
      expect(security.containsSensitiveData('user@example.com')).toBe(true);
      expect(security.containsSensitiveData('test.user+tag@domain.co.uk')).toBe(true);
    });

    test('returns false for non-sensitive text', () => {
      expect(security.containsSensitiveData('This is normal text')).toBe(false);
      expect(security.containsSensitiveData('No private info here')).toBe(false);
    });

    test('returns false for non-strings', () => {
      expect(security.containsSensitiveData(123)).toBe(false);
      expect(security.containsSensitiveData(null)).toBe(false);
      expect(security.containsSensitiveData(undefined)).toBe(false);
      expect(security.containsSensitiveData({})).toBe(false);
    });

    test('returns false for empty strings', () => {
      expect(security.containsSensitiveData('')).toBe(false);
    });

    test('is case-insensitive for keywords', () => {
      expect(security.containsSensitiveData('API_KEY=123')).toBe(true);
      expect(security.containsSensitiveData('Token=abc')).toBe(true);
      expect(security.containsSensitiveData('PASSWORD=xyz')).toBe(true);
    });
  });
});
