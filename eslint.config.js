/**
 * ESLint Configuration for SatanicOtter (ESLint v9 Flat Config)
 * Code quality rules for consistent, secure JavaScript
 * "The rules of Rivendell" - Standards that keep the code safe
 */

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      // Code Quality
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off', // Allow console for CLI tools
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'warn',
      'no-var': 'warn',
      
      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // Error Prevention
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'no-throw-literal': 'error',
      'no-return-await': 'warn',
      'require-await': 'warn',
      'no-await-in-loop': 'warn',
      
      // Best Practices
      'curly': ['warn', 'multi-line'],
      'default-case': 'warn',
      'dot-notation': 'warn',
      'no-empty-function': ['warn', { allow: ['arrowFunctions'] }],
      'no-lone-blocks': 'warn',
      'no-multi-spaces': 'warn',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'warn',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-useless-concat': 'warn',
      'no-useless-return': 'warn',
      'yoda': 'warn',
      
      // Style (minimal to not be annoying)
      'array-bracket-spacing': ['warn', 'never'],
      'block-spacing': 'warn',
      'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      'comma-dangle': ['warn', 'never'],
      'comma-spacing': 'warn',
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'key-spacing': 'warn',
      'keyword-spacing': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'semi': ['warn', 'always'],
      'semi-spacing': 'warn',
      'space-before-blocks': 'warn',
      'space-before-function-paren': ['warn', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],
      'space-in-parens': ['warn', 'never'],
      'space-infix-ops': 'warn',
      
      // ES6+
      'arrow-parens': ['warn', 'as-needed'],
      'arrow-spacing': 'warn',
      'no-duplicate-imports': 'error',
      'no-useless-computed-key': 'warn',
      'no-useless-constructor': 'warn',
      'no-useless-rename': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': ['warn', 'never']
    }
  },
  {
    // Test files can have more relaxed rules
    files: ['test/**/*.js', '**/*.test.js', '**/*.spec.js'],
    rules: {
      'no-unused-expressions': 'off'
    }
  },
  {
    // Browser automation files use page.evaluate() which runs in browser context
    files: ['automation/utils/browserAutomation.js', 'automation/profileAutomation.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly'
      }
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '*.min.js'
    ]
  }
];
