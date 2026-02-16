module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/unit/**/*.test.js'
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
