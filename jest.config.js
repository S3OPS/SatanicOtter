module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/unit/**/*.test.js'
  ],
  // test/integration.test.js is a standalone Node script (run via
  // `npm run test:integration`), not a Jest suite: it executes checks at
  // load time and calls process.exit(), which kills Jest workers.
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/integration\\.test\\.js'
  ],
  collectCoverageFrom: [
    'automation/**/*.js',
    '!automation/index.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  verbose: true
};
