# WeasyPrint — HTML + CSS to PDF, no browser involved

**Category:** Python HTML-to-PDF · **From starter list:** yes
**License:** BSD · **Language:** Python

WeasyPrint has its own layout/rendering engine written in Python — it is
**not** a headless browser (contrast with Puppeteer/Playwright). The payoff
is much stronger native support for CSS Paged Media than any browser ships:
`@page` margin boxes, `string-set`/`string()` running headers, and
`counter(pages)` all just work, no JavaScript required. This is the direct
answer to the gaps documented in `../paged-js` (needs a JS polyfill, and
even then has bugs with mixed-orientation named pages) and
`../custom-print-css` (hand-rolls what it can, but can't do true running
headers or a real "of N" page count).

## Showcase features (7 of the required 4+)

1. **Branded header/footer with content-aware running headers** — `string-set: chaptertitle attr(data-title)` per chapter, read back via `@top-right { content: string(chaptertitle); }`. Verified: page 3's header reads "Health & Dental Plans", page 4's reads "Retirement & 401(k)" — matching each chapter automatically.
2. **Multi-page with real page numbers** — `counter(page)` and `counter(pages)` both resolve natively: "Page 3 of 6", etc.
3. **TOC with accurate page references** — `target-counter(attr(href), page)`, natively, no JS (compare to `../paged-js`, which needs the polyfill for the same feature).
4. **Styled data table** — plain `<table>`, styled with CSS, zebra-free but color-coded header.
5. **Chart/graph via SVG** — a matplotlib chart exported straight to **SVG** (not PNG) and embedded as `<img>` — WeasyPrint renders real vector SVG, so the chart stays crisp at any zoom, unlike a rasterized PNG.
6. **Callout boxes** — info/warning variants.
7. **Custom fonts + 2-column print layout** — Karla + Crimson Pro via `@font-face`, and the glossary page uses native CSS multi-column (`column-count: 2`) — another CSS feature real browsers support inconsistently for print but WeasyPrint handles cleanly.

## How to run

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 generate.py   # writes sample-output/employee-benefits-guide.pdf
```

**macOS system dependency:** WeasyPrint needs Pango (via GObject/cairo) for
text shaping. Install with `brew install pango`, then run with
`DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib` set (Homebrew's lib
directory isn't on the default dynamic-library search path on Apple
Silicon) — see the exact command above. On Linux, `apt install
libpango-1.0-0 libpangoft2-1.0-0` (or your distro's equivalent) is usually
enough with no extra env var.

## Install effort

Medium — pure `pip install`, but the Pango/cairo system dependency (and,
on macOS, the `DYLD_FALLBACK_LIBRARY_PATH` workaround) is a real first-run
speed bump compared to ReportLab/fpdf2/xhtml2pdf, which need nothing beyond `pip`.

## Best for

The strongest pure-HTML/CSS-to-PDF option in this entire lab when you want
real print-specific CSS (running headers, named pages, page counters, TOC
page refs) without shipping a browser. Great fit for a FastAPI backend
generating polished reports from server-rendered HTML templates.

## Limitations

- Its own layout/rendering engine means occasional CSS quirks vs. a real
  browser — very modern/experimental CSS features may lag behind Chrome.
- No JavaScript execution at all — anything that needs a script to run
  (interactive charts, client-computed layout) must be pre-rendered to
  static HTML/SVG first, as done here with the matplotlib chart.
- The system-dependency install (Pango et al.) is the one point of
  friction in an otherwise pure-Python stack.
