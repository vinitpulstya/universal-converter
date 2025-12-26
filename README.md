# Folder Structure
```
universal-converter/
├─ public/
│  ├─ manifest.json      # Chrome extension manifest
│  ├─ icon16.png
│  ├─ icon32.png
│  ├─ icon48.png
│  └─ icon128.png
├─ src/
│  ├─ content/
│  │  └─ contentScript.ts # Detect selected text, inject tooltip
│  ├─ popup/
│  │  ├─ Popup.tsx
│  │  └─ popup.css
│  ├─ utils/
│  │  └─ conversions.ts  # All conversion functions
│  │  └─ units.ts  # SINGLE SOURCE OF TRUTH for units and aliases with helper types and functions
│  ├─ types/
│  │  └─ index.d.ts
│  └─ main.tsx             # react entry point
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
```

## Also read
- [Privacy Policy](privacy_policy.md)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This project uses several open-source libraries. See [ATTRIBUTION.md](ATTRIBUTION.md) for complete third-party license information.