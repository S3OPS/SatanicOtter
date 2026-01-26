# SatanicOtter

SatanicOtter is a Node.js toolkit for Amazon affiliate marketing workflows with TikTok/Instagram content automation. The current build includes:

- Amazon affiliate link generator (`index.html`)
- AI content generation with OpenAI (scripts, hooks, captions)
- High-ticket product research reports
- Scheduling queue with manual review output (`review-queue/`)
- Analytics tracking for daily metrics
- Profile setup helpers and optional browser automation

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

- The scheduler currently queues content for manual review (`review-queue/`). TikTok/Instagram posting is stubbed in code and requires custom integration or browser automation.
- Profile automation uses Puppeteer when installed and requires credentials in `.env`. Set `PROFILE_DRY_RUN=false` to apply changes.
- OpenAI features require `OPENAI_API_KEY` in `.env` (see `.env.example`).

## Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - detailed configuration
- [QUICK_START.md](./QUICK_START.md) - 5-minute walkthrough
- [ONE_COMMAND_SETUP.md](./ONE_COMMAND_SETUP.md) - quick-config + full-auto flow
- [PROFILE_SETUP_GUIDE.md](./PROFILE_SETUP_GUIDE.md) - profile setup guidance
- [PROFILE_AUTOMATION_GUIDE.md](./PROFILE_AUTOMATION_GUIDE.md) - automation with secrets/browser control
- [TIKTOK_CREDENTIALS_GUIDE.md](./TIKTOK_CREDENTIALS_GUIDE.md) - session ID instructions
- [TIKTOK_INSTAGRAM_GUIDE.md](./TIKTOK_INSTAGRAM_GUIDE.md) - strategy and content guidance

## License

MIT
