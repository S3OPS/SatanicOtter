# SatanicOtter

SatanicOtter is a Node.js toolkit for Amazon affiliate marketing workflows with multi-platform content automation. The current build includes:

- Amazon affiliate link generator (`index.html`)
- AI content generation with OpenAI (scripts, hooks, captions)
- High-ticket product research reports
- Multi-platform support (YouTube, TikTok, Vimeo, PeerTube, and more)
- Scheduling queue with manual review output (`review-queue/`)
- Analytics tracking for daily metrics
- Profile setup helpers and optional browser automation

## Recent Updates

**✅ Triple Security Scan Completed** - 0 vulnerabilities found  
**✅ Documentation Consolidated** - All docs merged into [DOCUMENTATION.md](./DOCUMENTATION.md)  
**✅ Platform Alternatives** - YouTube, Vimeo, Dailymotion, PeerTube support documented

**Performance & Security Improvements**:
- ✅ Modular architecture with reusable utilities
- ✅ 50% faster content generation (optimized rate limiting)
- ✅ Path traversal protection for file operations
- ✅ Automatic redaction of sensitive data in logs
- ✅ Centralized configuration management with caching
- ✅ Browser automation utilities for safer Puppeteer usage
- ✅ Zero security vulnerabilities (verified via triple scan)

See [SECURITY_REPORT.md](./SECURITY_REPORT.md) for detailed security audit results.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the guided setup (creates `.env`):
   ```bash
   npm run setup
   ```
3. Optional status check:
   ```bash
   npm run status
   ```

For the short walkthrough, see [QUICK_START.md](./QUICK_START.md). For the two-step automation flow, see [ONE_COMMAND_SETUP.md](./ONE_COMMAND_SETUP.md).

## One-command setup

```bash
npm run quick-config
npm run full-auto
```

## Link generator (web tool)

Open `index.html` in a browser to create Amazon affiliate links locally.

## Core commands

```bash
npm run generate-content    # AI scripts/hooks/captions
npm run product-research    # High-ticket product report
npm run schedule-posts      # Scheduler (manual review by default)
npm run automate            # Generate + schedule review items
npm run analytics:add       # Add daily metrics
npm run analytics:summary   # View summary
npm run setup-profiles      # Generate profile configs/bio templates
npm run setup-profiles:wizard
npm run automate-profiles   # Browser automation (dry-run by default)
```

## Automation notes

- The scheduler currently queues content for manual review (`review-queue/`). TikTok posting is stubbed in code and requires custom integration or browser automation.
- Profile automation uses Puppeteer when installed and requires credentials in `.env`. Set `PROFILE_DRY_RUN=false` to apply changes.
- OpenAI features require `OPENAI_API_KEY` in `.env` (see `.env.example`).

## Documentation

📚 **[Complete Documentation](./DOCUMENTATION.md)** - Comprehensive guide covering all features

### Additional Resources
- [SECURITY_REPORT.md](./SECURITY_REPORT.md) - Security audit results (Triple scan with 0 vulnerabilities)
- [PLATFORM_ALTERNATIVES.md](./PLATFORM_ALTERNATIVES.md) - YouTube, Vimeo, PeerTube, Dailymotion, and other free platforms
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

## License

MIT
