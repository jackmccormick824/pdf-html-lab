# Puppeteer — HTML to PDF via headless Chrome

**Category:** JS PDF / HTML-to-PDF (headless browser) · **From starter list:** yes
**License:** Apache-2.0 · **Language:** Node.js (bundles its own Chromium)

Puppeteer drives a real (headless) Chrome to render `report.html` — a
normal HTML/CSS/JS page with a live Chart.js canvas — then calls
`page.pdf()` to print it. The standout feature over plain browser print CSS
is `headerTemplate`/`footerTemplate`: small HTML snippets Puppeteer stamps
onto every page, with `<span class="pageNumber">` / `<span class="totalPages">`
auto-populated for you — no CSS counter tricks required (compare to
`../custom-print-css`, which has to fake "of N" because vanilla CSS can't
compute total page count reliably).

## Showcase features (6 of the required 4+)

1. **Branded header/footer** — via Puppeteer's `headerTemplate`/`footerTemplate`, not CSS.
2. **Multi-page with page numbers** — `pageNumber`/`totalPages` are computed by Puppeteer itself.
3. **Styled data table** — plan-mix breakdown table.
4. **Chart/graph** — a live Chart.js line chart, rendered in the real DOM
   and rasterized as part of the page (the script waits for
   `body[data-chart-ready="true"]` before printing so the canvas isn't
   captured mid-draw — a common gotcha with chart-in-headless-browser PDFs).
5. **Callout boxes** — info/warning boxes with `break-inside: avoid`.
6. **Custom fonts** — Manrope via Google Fonts, loaded like a normal webpage.

## How to run

```bash
npm install                 # downloads Puppeteer's bundled Chromium (~170MB)
node generate.mjs           # writes sample-output/monthly-metrics-report.pdf
```

## Install effort

Medium — `npm install` alone pulls down a full Chromium binary. No system
dependency beyond Node, but it's a bigger download than any other example
in this lab.

## Best for

Turning an existing (or purpose-built) HTML report into a pixel-faithful
PDF — if it renders correctly in Chrome, it prints correctly. Best choice
when your report is already a web page, or when a designer/frontend dev
is more comfortable in HTML/CSS than a Python drawing API.

## Limitations

- Heaviest install of any example here (bundled browser).
- Rendering is exactly what Chrome would print — for tight control over
  exact pagination of long flowing text (avoiding orphaned headings, etc.)
  you still lean on the same CSS Paged Media rules as `../custom-print-css`,
  or reach for `../paged-js` if you need real automatic re-pagination logic.
- Python equivalent: `playwright` (Python bindings) or `pyppeteer` give the
  same headless-Chrome-to-PDF approach outside Node — see the note in
  `../playwright-pdf/README.md`.
