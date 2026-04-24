"""Tier-1 brand polish pass (v2): flexible logo replacement."""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

LOGO_NAV = (
    '<a href="index.html" class="flex items-center gap-2.5 group flex-shrink-0">'
    '<span class="relative inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-transform group-hover:scale-105">'
    '<svg viewBox="0 0 40 40" class="w-full h-full" aria-hidden="true">'
    '<defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">'
    '<stop offset="0%" stop-color="#E8192E"/><stop offset="100%" stop-color="#9B0D1A"/>'
    '</linearGradient></defs>'
    '<rect width="40" height="40" fill="url(#bg1)"/>'
    '<path d="M13 11h7.5c2.7 0 4.5 1.5 4.5 3.9 0 1.7-.9 2.9-2.5 3.4 2 .5 3 1.9 3 4 0 2.7-2 4.4-5 4.4H13V11zm3 3v4.2h3.4c1.4 0 2.1-.7 2.1-2.1 0-1.4-.7-2.1-2.2-2.1H16zm0 6.9v4.8h4c1.5 0 2.4-.9 2.4-2.4 0-1.5-.9-2.4-2.4-2.4h-4z" fill="#fff"/>'
    '</svg>'
    '</span>'
    '<span class="flex flex-col leading-none">'
    '<span class="text-[1.0625rem] font-bold tracking-tight text-ink">Basha</span>'
    '<span class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ash mt-0.5">Donair · Kelowna</span>'
    '</span>'
    '</a>'
)

LOGO_FOOTER = (
    '<div class="flex items-center gap-2.5 mb-4">'
    '<span class="inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden">'
    '<svg viewBox="0 0 40 40" class="w-full h-full" aria-hidden="true">'
    '<rect width="40" height="40" fill="#CC1122"/>'
    '<path d="M13 11h7.5c2.7 0 4.5 1.5 4.5 3.9 0 1.7-.9 2.9-2.5 3.4 2 .5 3 1.9 3 4 0 2.7-2 4.4-5 4.4H13V11zm3 3v4.2h3.4c1.4 0 2.1-.7 2.1-2.1 0-1.4-.7-2.1-2.2-2.1H16zm0 6.9v4.8h4c1.5 0 2.4-.9 2.4-2.4 0-1.5-.9-2.4-2.4-2.4h-4z" fill="#fff"/>'
    '</svg>'
    '</span>'
    '<span class="flex flex-col leading-none">'
    '<span class="text-lg font-bold tracking-tight">Basha</span>'
    '<span class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ash mt-0.5">Donair · Kelowna</span>'
    '</span>'
    '</div>'
)

# Aggressive but safe logo anchor matcher: first <a href="index.html"...> ... </a>
# that appears INSIDE <nav> (we slice to just the nav region first).
NAV_BLOCK_RE = re.compile(r'(<nav[^>]*id="navbar"[^>]*>.*?</nav>)', re.DOTALL)
LOGO_ANCHOR_RE = re.compile(r'<a href="index\.html"[^>]*class="[^"]*flex[^"]*"[^>]*>.*?</a>', re.DOTALL)

# Footer logo: first div that contains a `w-\d+ h-\d+ bg-basha-red rounded-full` with "B"
FOOTER_LOGO_RE = re.compile(
    r'<div class="flex items-center gap-\d+\s*mb-\d+">\s*<div class="w-\d+ h-\d+ bg-basha-red rounded-full[^"]*"[^>]*>\s*B\s*</div>\s*<span[^>]*>[^<]*</span>\s*</div>',
    re.DOTALL,
)


def polish(path):
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    orig = html

    # 1. Replace first logo anchor inside navbar
    def swap_nav(m):
        nav = m.group(1)
        nav_new = LOGO_ANCHOR_RE.sub(LOGO_NAV, nav, count=1)
        return nav_new
    html = NAV_BLOCK_RE.sub(swap_nav, html, count=1)

    # 2. Footer logo
    html = FOOTER_LOGO_RE.sub(LOGO_FOOTER, html)

    # 3. img hardening
    def img_hardener(m):
        tag = m.group(0)
        if 'loading=' not in tag:
            tag = tag[:-1] + ' loading="lazy">'
        if 'decoding=' not in tag:
            tag = tag[:-1] + ' decoding="async">'
        return tag
    html = re.sub(r'<img[^>]*>', img_hardener, html)

    # 4. Defer non-critical script tags in body
    html = re.sub(
        r'<script src="(js/[^"]+)"(?!\s+defer)></script>',
        r'<script src="\1" defer></script>',
        html,
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
