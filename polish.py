"""Final polish pass — strip GA4 placeholder, optimize hero LCP, uniform footer/sticky."""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

GA4_RE = re.compile(
    r'<!-- ── Google Analytics[^>]*-->\s*<script async src="https://www\.googletagmanager\.com[^"]*G-X+[^"]*"></script>\s*<script>[^<]*?gtag\([^)]*G-X+[^)]*\);?\s*</script>',
    re.DOTALL,
)
GA4_RE_LOOSE = re.compile(
    r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-X+"></script>\s*<script>\s*window\.dataLayer.*?gtag\(\'config\', \'G-X+\'\);\s*</script>',
    re.DOTALL,
)
GA4_COMMENT = re.compile(r'<!-- ── Google Analytics[^>]*-->', re.DOTALL)

# Optimize Unsplash URLs: w=1920 → w=1200, q=80 → q=70 (smaller payload)
def optimize_unsplash(html):
    return re.sub(
        r'(https://images\.unsplash\.com/photo-[^"\s)]+)([?&])w=(1600|1800|1920|2400)',
        r'\1\2w=1200',
        html,
    )

# Add fetchpriority to first <img> tag (hero LCP)
def hero_priority(html):
    # only apply once per page
    def once(m, state=[False]):
        if state[0]: return m.group(0)
        state[0] = True
        tag = m.group(0)
        if 'fetchpriority' not in tag:
            tag = tag[:-1] + ' fetchpriority="high">'
        return tag
    return re.sub(r'<img[^>]*>', once, html, count=1)

# Standard franchise CTA strip (uniform across pages, light theme)
CTA_STRIP = (
    '<section class="bg-cloud border-y border-hairline">'
    '<div class="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 grid md:grid-cols-3 gap-8 items-center">'
    '<div class="reveal">'
    '<div class="text-xs font-bold tracking-[0.18em] uppercase text-basha-red mb-2">Visit · Pickup · Delivery</div>'
    '<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-ink leading-tight">Open daily · 10am – 9pm</h2>'
    '<p class="text-ash mt-3 leading-relaxed">101-135 Rutland Rd&nbsp;N, Kelowna, BC. Free parking on-site.</p>'
    '</div>'
    '<div class="reveal flex flex-wrap gap-3 justify-start md:justify-center">'
    '<a href="tel:+17787537313" class="btn-rausch btn-pill cta-primary">📞 (778) 753-7313</a>'
    '<a href="menu.html" class="btn-ghost btn-pill">View Menu →</a>'
    '</div>'
    '<div class="reveal flex md:justify-end gap-2">'
    '<a href="https://www.skipthedishes.com/basha-donair-and-shawarma-rutland" rel="noopener" class="icon-circle" aria-label="SkipTheDishes" title="SkipTheDishes">🍴</a>'
    '<a href="https://www.doordash.com/store/basha-donair-shawarma-kelowna-28542163/" rel="noopener" class="icon-circle" aria-label="DoorDash" title="DoorDash">🚪</a>'
    '<a href="https://www.facebook.com/bashakelowna/" rel="noopener" class="icon-circle" aria-label="Facebook" title="Facebook">f</a>'
    '<a href="https://www.instagram.com/bashadonairkelowna/" rel="noopener" class="icon-circle" aria-label="Instagram" title="Instagram">◫</a>'
    '</div>'
    '</div>'
    '</section>'
)


def polish(path):
    name = os.path.basename(path)
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    orig = html

    # 1. Strip GA4 placeholder blocks (saves 63 KiB unused JS)
    html = GA4_RE.sub('', html)
    html = GA4_RE_LOOSE.sub('', html)
    html = GA4_COMMENT.sub('', html)

    # 2. Optimize Unsplash URLs
    html = optimize_unsplash(html)

    # 3. Hero image fetchpriority (skip 404, gallery, contact — non-hero pages)
    if name not in {"404.html"}:
        html = hero_priority(html)

    # 4. Insert uniform CTA strip just before closing footer (only once)
    if "<!-- UNIFORM-CTA -->" not in html and "</footer>" in html:
        # Insert before footer
        html = re.sub(
            r'(<footer)',
            f'<!-- UNIFORM-CTA -->{CTA_STRIP}\\1',
            html,
            count=1,
        )

    # 5. Update sticky-order-bar to consistent labels
    html = re.sub(
        r'<div class="sticky-order-bar md:hidden">.*?</div>',
        '<div class="sticky-order-bar md:hidden">'
        '<a href="tel:+17787537313" aria-label="Call">📞 Call</a>'
        '<a href="menu.html" aria-label="Order">🥙 Order</a>'
        '<a href="https://www.google.com/maps/search/?api=1&query=101-135+Rutland+Rd+N+Kelowna+BC" aria-label="Directions">📍 Map</a>'
        '</div>',
        html,
        flags=re.DOTALL,
        count=1,
    )

    if html != orig:
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        return True
    return False


for p in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(p)
    ok = polish(p)
    print(f"[{'polished' if ok else 'skip    '}] {name}")
