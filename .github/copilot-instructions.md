# GitHub Copilot Instructions for SatanicOtter

Welcome, fellow traveler of Middle-earth! These instructions guide GitHub Copilot in assisting with the SatanicOtter project—a Node.js toolkit for Amazon affiliate marketing workflows with TikTok content automation.

## 🗡️ 1. Directives: The Command of the King

These action verbs define how to approach code changes:

### Optimize: "Make the journey faster"
Don't take the long way around the mountain; use the Great Eagles.
- Improve performance and reduce execution time
- Minimize API calls and optimize resource usage
- Use efficient algorithms and data structures
- Leverage async/await patterns for non-blocking operations
- Cache results when appropriate to avoid redundant computations

### Refactor: "Clean up the camp"
Keep the same mission, but organize the supplies so they aren't a mess.
- Improve code readability and maintainability
- Extract reusable functions and modules
- Follow consistent naming conventions
- Remove code duplication
- Keep existing functionality intact—no behavior changes

### Modularize: "Break up the Fellowship"
Instead of one giant group, give Aragorn, Legolas, and Gimli their own specific tasks so they can work better separately.
- Split large functions into smaller, focused utilities
- Separate concerns (e.g., API logic, data processing, UI)
- Create reusable modules for common operations
- Use clear interfaces between components
- Each module should have a single, well-defined responsibility

### Audit: "Inspect the ranks"
Look through the code to find any hidden Orcs (security flaws) or traitors.
- Identify security vulnerabilities (exposed API keys, unsafe inputs)
- Check for error handling gaps
- Validate input sanitization
- Review dependency versions for known vulnerabilities
- Ensure proper secret management (use `.env`, never hardcode)

## 🧙‍♂️ 2. Automation Frameworks: Choosing Your Fellowship

You wouldn't send a Hobbit to do a Wizard's job. These frameworks are the specific tools best suited for the terrain:

### Puppeteer: Like Legolas—fast, modern, and incredibly accurate
- Use for browser automation (TikTok profile setup, interactions)
- Handle dynamic content loading with proper waits
- Implement proper error handling for network failures
- Use headless mode for CI/CD environments
- Clean up browser instances to prevent memory leaks

### GitHub Actions: Like the Beacon of Gondor
- Automate testing, linting, and deployment
- Trigger workflows on push, pull request, or schedule
- Use secrets for sensitive credentials
- Implement proper error notifications
- Cache dependencies to speed up builds

### OpenAI API: The wisdom of the Wizards
- Use for AI-powered content generation (scripts, hooks, captions)
- Implement proper rate limiting and quota management
- Handle API errors gracefully with retries and fallbacks
- Optimize prompts for quality and cost efficiency
- Cache generated content when possible

## 🗺️ 3. Architecture & Logic: The Map and the Strategy

This is how the fellowship is organized so they don't walk into a trap:

### Module Organization
- **automation/**: Core automation scripts (content generation, scheduling, analytics)
- **setup scripts**: Configuration wizards (`setup.js`, `quickConfig.js`, `fullAutoSetup.js`)
- **test/**: Integration tests
- Keep related functionality together in the same module

### Error Handling: "What if the bridge collapses?"
```javascript
try {
  // Attempt the operation
  await riskyOperation();
} catch (error) {
  // Don't let the whole program die
  console.error('Error occurred:', error.message);
  // Implement fallback or graceful degradation
  return fallbackBehavior();
}
```

### Async/Await: "Wait for my signal"
```javascript
// Ensure Gandalf doesn't try to arrive before he's finished riding from Rohan
async function processContent() {
  const content = await generateContent(); // Wait for AI generation
  await validateContent(content); // Wait for validation
  return await schedulePost(content); // Wait for scheduling
}
```

### Configuration Management
- Store all secrets in `.env` files (never commit to git)
- Use `.env.example` as a template
- Load config with `dotenv` at application start
- Provide sensible defaults for optional settings
- Validate required environment variables on startup

## ⚔️ 4. Constraint Phrases: The "One Ring" Rules

These are the strict "Don'ts." Power can corrupt a script, making it too bloated and heavy to carry.

### "Do NOT add extra features": "Just take the Ring to the fire"
- Don't stop to liberate every village in Middle-earth; we are on a schedule
- Stick to the requested changes
- Avoid scope creep and feature additions
- Keep changes minimal and focused
- If you see an opportunity for improvement, note it separately but don't implement it unless requested

### "Keep existing logic intact": "Don't change the prophecy"
- Use what we already have without rewriting the history books
- Preserve existing functionality when refactoring
- Don't break existing APIs or interfaces
- Maintain backward compatibility
- Test thoroughly to ensure no regressions

### "Avoid deprecated APIs": "Don't use the old magic"
- Don't use tools from the First Age that no longer work in the Third Age
- Use current Node.js APIs (async/await over callbacks)
- Keep dependencies up to date
- Avoid deprecated npm packages
- Use modern JavaScript (ES6+) syntax

### "Maintain security": "Guard the gates of Gondor"
- Never expose API keys or credentials in code
- Validate and sanitize all user inputs
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Follow the principle of least privilege

## 🎯 Project-Specific Guidelines

### Content Generation
- Use OpenAI API with proper error handling
- Implement quota management to avoid rate limits
- Generate content in batches for efficiency
- Store generated content for review before posting

### TikTok Automation
- Use session ID authentication (more reliable than password)
- Implement dry-run mode for testing (`PROFILE_DRY_RUN=true`)
- Handle 2FA and captcha scenarios gracefully
- Respect rate limits and avoid spam-like behavior

### Scheduling and Queue Management
- Default to manual review mode for safety
- Generate content to `review-queue/` directory
- Implement proper time zone handling
- Allow flexible posting schedules via configuration

### Testing
- Run existing integration tests before major changes
- Validate changes don't break existing functionality
- Test error scenarios and edge cases
- Use dry-run modes when available

## 📜 Code Style

- Use clear, descriptive variable names
- Add JSDoc comments for functions and modules
- Use consistent formatting (2-space indentation)
- Follow the existing code style in the project
- Keep functions focused and under 50 lines when possible

---

*"All we have to decide is what to do with the time that is given us."* — Gandalf

Remember: The goal is to help users build robust, maintainable automation tools for TikTok content and Amazon affiliate marketing. Keep the code clean, secure, and efficient.
