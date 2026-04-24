# Basha Donair & Shawarma Kelowna

Authentic halal Mediterranean restaurant website — Kelowna, BC.

**Live:** https://website-ffb90ac7.lfg.obp.mybluehost.me
**Address:** 101-135 Rutland Rd N, Kelowna, BC V1X 3B1
**Phone:** (778) 753-7313

## Stack

- Static HTML5 (multi-page) — 12 pages + sitemap
- Tailwind CSS v3 (compiled, minified) with Airbnb-inspired design tokens
- Inter (single-family typography, 2026 Airbnb Cereal substitute)
- Vanilla JS: reveal-on-scroll, Ken Burns, magnetic buttons, scroll progress, count-up
- Schema.org JSON-LD: `Restaurant`, `Menu`/`MenuItem`, `FAQPage`, `BreadcrumbList`, `LocalBusiness`, `AggregateRating`
- `llms.txt` + AI-crawler-permissive `robots.txt` for GEO

## Development

```bash
npm install
npm run build         # build Tailwind CSS once
npm run watch         # build in watch mode
python -m http.server 8000   # preview at localhost:8000
```

## Deployment

Deployed to Bluehost shared hosting. Upload contents of this directory to `public_html/website_ffb90ac7/` via FTP or the cPanel File Manager.

## SEO landing pages

- `donair-rutland.html` — "donair Rutland"
- `shawarma-kelowna.html` — "shawarma Kelowna"
- `donair-near-me.html` — generic near-me
- `best-donair-kelowna.html` — competitive "best donair"
- `halal-kelowna.html` — "halal food Kelowna"

## Critical TODOs (owner)

- [ ] Claim + optimize Google Business Profile
- [ ] Replace `G-XXXXXXXXXX` in all HTML with real GA4 Measurement ID
- [ ] Paste real Formspree Form IDs into `contact.html` + `catering.html`
- [ ] Update placeholder aggregateRating (4.6 / 487) with real Google review numbers
- [ ] Drop real food photos into `images/gallery/` (named `food-01.jpg` → `food-12.jpg`)
- [ ] Swap placeholder review quotes with real Google reviews
