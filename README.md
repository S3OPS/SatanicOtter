# SatanicOtter

## Amazon Affiliate Link Generator

A simple, client-side web application for creating Amazon affiliate links instantly. This tool helps Amazon Associates generate commission-enabled product links quickly and easily.

### Features

- ✅ **Easy to Use**: Simple interface with instant results
- 🌍 **Multi-Region Support**: Works with all Amazon domains (com, co.uk, de, fr, ca, etc.)
- 💾 **Remember Your Tag**: Automatically saves your affiliate tag for future use
- 📋 **One-Click Copy**: Copy generated links to clipboard instantly
- 🔒 **Privacy First**: All processing happens in your browser - no data sent to servers
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### How to Use

1. **Open the Tool**: Simply open `index.html` in your web browser
2. **Enter Your Tag**: Input your Amazon Associate Tag (e.g., `yourname-20`)
3. **Paste Product URL**: Add any Amazon product URL
4. **Generate Link**: Click "Generate Affiliate Link" to create your commission-enabled link
5. **Copy & Share**: Use the copy button to quickly grab your affiliate link

### Supported Amazon Domains

- amazon.com (United States)
- amazon.co.uk (United Kingdom)
- amazon.de (Germany)
- amazon.fr (France)
- amazon.ca (Canada)
- amazon.co.jp (Japan)
- amazon.it (Italy)
- amazon.es (Spain)
- amazon.in (India)
- amazon.com.au (Australia)
- And more...

### Getting Your Amazon Associate Tag

If you don't have an Amazon Associate Tag yet:

1. Visit [Amazon Associates](https://affiliate-program.amazon.com/)
2. Sign up for the Amazon Associates Program
3. Once approved, you'll receive your unique Associate Tag
4. Your tag typically follows the format: `yourname-20`

### Example

**Input:**
- Affiliate Tag: `mystore-20`
- Product URL: `https://www.amazon.com/dp/B08N5WRWNW`

**Output:**
- Affiliate Link: `https://www.amazon.com/dp/B08N5WRWNW?tag=mystore-20&linkCode=ll1`

### Technical Details

- **Pure HTML/CSS/JavaScript**: No dependencies or build process required
- **LocalStorage**: Your affiliate tag is saved locally for convenience
- **URL Parsing**: Properly handles and preserves existing URL parameters
- **Clipboard API**: Modern clipboard integration with fallback support

### Privacy & Security

- All processing happens locally in your browser
- No data is sent to external servers
- Your affiliate tag is stored only in your browser's local storage
- Open source - inspect the code to verify

### License

This project is open source and available for anyone to use.

### Disclaimer

This tool is provided as-is for legitimate use by Amazon Associates. Users are responsible for complying with Amazon's Operating Agreement and all applicable laws and regulations.