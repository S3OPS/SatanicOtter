# Testing Guide for SatanicOtter

This document provides comprehensive information about testing the SatanicOtter project.

## Test Framework

We use **Jest** as our testing framework for its simplicity, speed, and excellent Node.js support.

## Test Structure

```
test/
├── unit/                    # Unit tests for individual modules
│   └── utils/              # Utility function tests
│       ├── validators.test.js
│       ├── rateLimiter.test.js
│       ├── errorHandler.test.js
│       └── security.test.js
└── integration.test.js      # Integration tests for full workflows
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

## Test Coverage

Current test coverage for core utilities:

| Module | Statement Coverage | Branch Coverage | Function Coverage |
|--------|-------------------|-----------------|-------------------|
| **security.js** | 100% | 100% | 100% |
| **rateLimiter.js** | 98.27% | 75% | 100% |
| **errorHandler.js** | 96.77% | 92.75% | 100% |
| **validators.js** | 90.24% | 84.04% | 100% |

**Total Tests**: 138 unit tests + 58 integration tests = **196 tests**

## Writing Tests

### Unit Test Example

```javascript
const myModule = require('../../../automation/utils/myModule');

describe('myModule', () => {
  describe('myFunction', () => {
    test('handles valid input correctly', () => {
      const result = myModule.myFunction('valid-input');
      expect(result).toBe('expected-output');
    });

    test('throws error for invalid input', () => {
      expect(() => {
        myModule.myFunction(null);
      }).toThrow('Invalid input');
    });

    test('works with edge cases', () => {
      expect(myModule.myFunction('')).toBe('');
      expect(myModule.myFunction('123')).toBe('123');
    });
  });
});
```

### Async Test Example

```javascript
test('async function works correctly', async () => {
  const result = await myModule.asyncFunction();
  expect(result).toBe('success');
});

test('async function handles errors', async () => {
  await expect(myModule.asyncFunction('bad-input'))
    .rejects
    .toThrow('Error message');
});
```

### Mocking Example

```javascript
test('uses mocked function', () => {
  const mockFn = jest.fn().mockReturnValue('mocked-value');
  const result = myModule.functionUsingCallback(mockFn);
  
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledWith('expected-arg');
  expect(result).toBe('mocked-value');
});
```

## Test Best Practices

### 1. Test Organization
- **Group related tests** using `describe()` blocks
- **Use descriptive test names** that explain what is being tested
- **Follow the AAA pattern**: Arrange, Act, Assert

### 2. Test Coverage Goals
- **Critical utilities**: Aim for 90%+ coverage
- **Business logic**: Aim for 80%+ coverage
- **UI/Integration**: Aim for 60%+ coverage

### 3. What to Test
✅ **Do test**:
- Input validation and edge cases
- Error handling paths
- Business logic correctness
- API response parsing
- Security functions (validation, sanitization)

❌ **Don't test**:
- Third-party library internals
- Node.js built-in functions
- Configuration constants
- Simple getters/setters

### 4. Test Isolation
- Each test should be **independent**
- Use `beforeEach()` and `afterEach()` to reset state
- Don't rely on test execution order
- Clean up resources (files, network connections)

### 5. Mocking Guidelines
- Mock external dependencies (APIs, databases, file system)
- Don't mock what you're testing
- Use spies to verify function calls
- Restore mocks after tests

## Testing Specific Modules

### Testing Rate Limiting
```javascript
test('respects rate limits', () => {
  const limiter = rateLimiter.getLimiter('test', { maxRequests: 2, interval: 1000 });
  
  rateLimiter.recordRequest('test');
  rateLimiter.recordRequest('test');
  
  expect(rateLimiter.canMakeRequest('test')).toBe(false);
});
```

### Testing Error Handling
```javascript
test('categorizes errors correctly', () => {
  const error = new Error('Rate limit exceeded');
  error.status = 429;
  
  const type = errorHandler.categorizeError(error);
  expect(type).toBe(errorHandler.ErrorType.RATE_LIMIT);
});
```

### Testing Validation
```javascript
test('validates email addresses', () => {
  expect(validators.isValidEmail('test@example.com')).toBe(true);
  expect(validators.isValidEmail('invalid')).toBe(false);
});
```

### Testing Security
```javascript
test('redacts sensitive data', () => {
  const text = 'api_key=secret123';
  const redacted = security.redactSensitive(text);
  
  expect(redacted).toContain('***REDACTED***');
  expect(redacted).not.toContain('secret123');
});
```

## Continuous Integration

Tests run automatically on:
- **Every push** to any branch
- **Every pull request**
- **Before deployment**

CI workflow checks:
1. Linting (`npm run lint`)
2. Unit tests (`npm run test:unit`)
3. Integration tests (`npm run test:integration`)
4. Code coverage thresholds

## Debugging Tests

### Run Single Test File
```bash
npx jest test/unit/utils/validators.test.js
```

### Run Tests Matching Pattern
```bash
npx jest --testNamePattern="validates email"
```

### Run with Verbose Output
```bash
npx jest --verbose
```

### Debug in Watch Mode
```bash
npm run test:watch
# Press 'p' to filter by filename
# Press 't' to filter by test name
# Press 'a' to run all tests
```

## Common Test Issues

### Issue: Tests timeout
**Solution**: Increase timeout or check for unresolved promises
```javascript
test('async operation', async () => {
  // Increase timeout for this test
  jest.setTimeout(10000);
  await longRunningOperation();
}, 10000); // Or pass timeout as third parameter
```

### Issue: Tests are flaky
**Solution**: Ensure proper cleanup and avoid timing dependencies
```javascript
afterEach(() => {
  // Clean up state
  rateLimiter.resetAll();
  jest.clearAllMocks();
});
```

### Issue: Mock not working
**Solution**: Ensure mock is set up before the tested code runs
```javascript
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

afterEach(() => {
  console.error.mockRestore();
});
```

## Performance Benchmarks

### Test Execution Speed
- **Unit tests**: < 2 seconds for 138 tests
- **Integration tests**: < 5 seconds for 58 tests
- **Full suite**: < 7 seconds total

### Coverage Report Generation
- **Unit tests with coverage**: ~3 seconds
- **Full coverage report**: ~8 seconds

## Future Testing Improvements

### Planned Enhancements
- [ ] Add E2E tests for content generation workflow
- [ ] Add performance benchmarks for rate limiting
- [ ] Add mutation testing for critical paths
- [ ] Add snapshot testing for generated content
- [ ] Add API contract tests
- [ ] Increase overall coverage to 85%+

### Test Tools to Consider
- **Supertest**: For API endpoint testing
- **nock**: For mocking HTTP requests
- **faker.js**: For generating test data
- **Stryker**: For mutation testing

## Contributing Tests

When contributing code:
1. **Write tests first** (TDD approach recommended)
2. **Ensure all tests pass** before submitting PR
3. **Maintain or improve coverage** (no decrease allowed)
4. **Follow existing test patterns** for consistency
5. **Add tests for bug fixes** to prevent regression

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TDD Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

**Remember**: Good tests are your safety net. They give you confidence to refactor and improve code without fear of breaking things. Take the time to write good tests! 🧪✨
