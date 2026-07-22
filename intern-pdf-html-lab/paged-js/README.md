# Paged.js — automatic pagination polyfill (beyond the starter list)

**Category:** CSS technique / JS polyfill (HTML/browser polish) · **From starter list:** no — this is one of this lab's own additional finds, not in the original list.
**License:** MIT · **Language:** CSS + a JS polyfill (`pagedjs`)

Paged.js polyfills the parts of the CSS Paged Media spec that browsers
don't (fully) implement natively: automatic content reflow into pages
(no manual page-break placement, unlike `../custom-print-css`), true
running headers/footers via `@page` margin boxes and `string-set`, a
working `counter(pages)` for real "Page X of Y", and `target-counter()` for
a table of contents whose page numbers are correct because Paged.js
paginates first and resolves references afterward.

This is the single most compelling justification in this whole lab for why
libraries exist on top of "just write CSS" — `../custom-print-css` shows
what you get for free from the browser; this folder shows what you get back
once you stop hand-placing page breaks.

## Showcase features (6 of the required 4+, verified via a real print pipeline)

1. **Branded header/footer with content-aware running headers** — `string-set: chaptertitle attr(data-title)` on each chapter, read back via `@top-right { content: string(chaptertitle); }` — the header text changes per chapter automatically. Verified: page 3's header reads "Welcome to the Team", page 7's reads "Appendix: Team Directory".
2. **Multi-page with real page numbers** — `counter(page)` **and** `counter(pages)` both resolve correctly (`"Page 3 of 7"`), unlike `../custom-print-css` which has to hardcode the total.
3. **TOC with accurate page references** — `target-counter(attr(href), page)` computes each entry's page number after layout; confirmed the Contents page's "1. Welcome to the Team → 3" matches the actual page.
4. **Styled data table** + **5. Chart/graph** (hand-coded inline SVG, to avoid async-canvas timing issues with Paged.js's pagination pass) + **6. Callout boxes**.

## How to run

```bash
npm install
python3 -m http.server 8420 --directory ..   # Paged.js needs http(s), not file:// — see below
open http://localhost:8420/paged-js/index.html
```

To generate the PDF (used to produce `sample-output/new-hire-handbook.pdf`):

```bash
npm install -D playwright
npx playwright install chromium   # once
node print-to-pdf.mjs
```

## Install effort

Low-medium — one vendored script (`vendor/paged.polyfill.min.js`, ~500KB)
plus normal CSS. **Must be served over http(s), not opened as a `file://`
URL** — Paged.js fetches your stylesheets via XHR to parse `@page` rules,
which the file origin's CORS restrictions block. Any static server works.

## Best for

Long, editable, flowing documents (handbooks, contracts, generated reports
with variable-length prose) where you want real automatic pagination and
running headers/TOC, and you're fine shipping a ~500KB JS polyfill to get
CSS features browsers don't have yet.

## Limitations — including one we hit and did not paper over

- **Mixed-orientation named pages don't work correctly at the pinned
  version.** This example originally tried to make the appendix page
  landscape via `page: wide;` + `@page wide { size: 297mm 210mm; }`. Paged.js
  recognized the named page but didn't resize the physical page box, and
  separately laid out the *content* at the declared wide width even though
  the visible page stayed portrait — causing clipped/overflowing text. This
  matches known, still-open upstream issues:
  [pagedjs/pagedjs#6](https://github.com/pagedjs/pagedjs/issues/6) and
  [#281](https://github.com/pagedjs/pagedjs/issues/281). The rule is left in
  `style.css`, disabled, with a comment explaining why — rather than shipping
  a broken page or silently dropping the attempt.
- Heavier than plain print CSS: a real JS dependency, and pagination runs
  client-side, which can be slow on very long documents.
- Needs an HTTP(S) origin to run at all (see above) — a `file://` demo
  silently hangs since the polyfill's stylesheet fetch fails.
