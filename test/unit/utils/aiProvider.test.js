/**
 * Unit tests for AI provider selection and mock fallback
 */

const aiProvider = require('../../../automation/utils/aiProvider');

describe('aiProvider utility', () => {
  const savedEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  describe('getProvider', () => {
    test('returns openai when AI_PROVIDER=openai', () => {
      // Note: the unset case is not asserted here because dotenv loads
      // the repo's .env (which may set AI_PROVIDER) on first getEnv().
      process.env.AI_PROVIDER = 'openai';
      expect(aiProvider.getProvider()).toBe('openai');
    });

    test('returns ollama when AI_PROVIDER=ollama', () => {
      process.env.AI_PROVIDER = 'ollama';
      expect(aiProvider.getProvider()).toBe('ollama');
    });
  });

  describe('generateMockCompletion', () => {
    test('returns a JSON array string for content-ideas prompts, marked as mock', () => {
      const output = aiProvider.generateMockCompletion([
        { role: 'user', content: 'Generate 2 viral ideas. Products: gaming laptop, espresso machine. Format as JSON array with fields: hook, script' }
      ]);
      const parsed = JSON.parse(output);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
      expect(parsed[0].source).toBe('mock');
      expect(parsed[0].hook).toContain('MOCK');
    });

    test('returns clearly labeled mock text for plain-text prompts', () => {
      const output = aiProvider.generateMockCompletion([
        { role: 'user', content: 'Create a caption. Product: Espresso Machine' }
      ]);
      expect(output).toContain('[MOCK CONTENT');
      expect(output).toContain('Espresso Machine');
    });
  });

  describe('generateCompletion with ollama provider', () => {
    test('falls back to mock output when the Ollama server is unreachable', async () => {
      process.env.AI_PROVIDER = 'ollama';
      process.env.OLLAMA_HOST = 'http://127.0.0.1:1'; // nothing listens here
      process.env.OLLAMA_MODEL = 'qwen3:14b';

      const output = await aiProvider.generateCompletion([
        { role: 'user', content: 'Create a caption. Product: Robot Vacuum' }
      ]);

      expect(output).toContain('[MOCK CONTENT');
      expect(aiProvider.getLastContentSource()).toBe('mock');
    });
  });
});
