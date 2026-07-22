# Playwright — HTML to PDF via headless Chromium

**Category:** JS PDF / HTML-to-PDF (headless browser) · **From starter list:** yes
**License:** Apache-2.0 · **Language:** Node.js (also has official Python/.NET/Java bindings)

Playwright's PDF API is close to a drop-in match for Puppeteer's (`../puppeteer`)
— same `page.pdf()` shape, same `headerTemplate`/`footerTemplate` mechanism —
because both talk to the same underlying Chromium print pipeline. Rather
than repeat that folder, this example leans on the parts of a report that
actually benefit from a *different* tool choice: a wide 8-column table that
wants `landscape: true`, a self-hosted variable font via `@font-face` (no
Google Fonts CDN dependency), and Plotly.js instead of Chart.js.

## Showcase features (6 of the required 4+)

1. **Landscape page** — `landscape: true` in `page.pdf()`, the dedicated Playwright/Puppeteer option (as opposed to hand-writing `@page { size: landscape; }`, see `../custom-print-css`).
2. **Custom fonts** — Space Grotesk (variable font) self-hosted from `fonts/`, embedded via `@font-face`, no external font request at all.
3. **Chart/graph** — Plotly.js `staticPlot` line chart (multi-series, legend, axis titles) — shows Plotly specifically, since `../puppeteer` already covers Chart.js.
4. **Styled data table** — an 8-column regional/monthly breakdown that only reads comfortably in landscape.
5. **Callout boxes** — info + warning variants.
6. **Branded header/footer with page numbers** — same `headerTemplate`/`footerTemplate` + auto `totalPages` mechanism as Puppeteer.

## How to run

```bash
npm install
npx playwright install chromium   # once, downloads/verifies the matching browser build
node generate.mjs                 # writes sample-output/regional-sales-report.pdf
```

## Install effort

Medium — same category as Puppeteer: `npm install` plus a browser binary
download (Playwright manages this via `playwright install`, separately from
the npm package, and can install Chromium/Firefox/WebKit — only Chromium
supports `page.pdf()`).

## Best for

Nearly interchangeable with Puppeteer for the HTML-to-PDF use case — pick
Playwright if your team already uses it for end-to-end testing (shared
tooling/knowledge), if you want official multi-language bindings, or if you
value its generally faster release cadence and auto-wait ergonomics.
Puppeteer is the more "default" choice if you have no other reason to prefer one.

**Python note (covers the starter list's "Playwright/Chromium" entry under
Python PDF):** the Python bindings (`pip install playwright`) expose the
identical `page.pdf()` API used here — `page.pdf(path=..., landscape=True,
header_template=..., footer_template=...)` — so everything in this folder
is directly portable to a Python backend (e.g. a FastAPI service) without
learning a different tool, just a different syntax for the same calls.

## Limitations

- Same as Puppeteer: bundles/manages real browser binaries — heavier than
  any pure-library (ReportLab, pdf-lib, fpdf2) approach.
- `landscape: true` affects the *whole* PDF — for true **mixed** portrait/landscape
  pages in one document via pure browser tooling, you're back to CSS Paged
  Media tricks (and, per `../paged-js`'s README, even Paged.js's named-page
  orientation support is currently buggy) — generating separate PDFs per
  orientation and merging with `../pdf-lib` is the more reliable path today.
