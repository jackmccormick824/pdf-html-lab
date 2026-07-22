# html2pdf.js — export an existing styled HTML element to PDF

**Category:** JS PDF / HTML-to-PDF (client-side) · **From starter list:** yes
**License:** MIT · **Language:** JavaScript (browser)

html2pdf.js is a thin wrapper around two other libraries: **html2canvas**
(rasterizes a real DOM element to a `<canvas>`, reimplementing CSS painting
in JS rather than using the browser's native renderer) and **jsPDF**
(places that raster image into a PDF, page by page). The pitch is one line —
`html2pdf().from(element).save()` — against an element that's just normal
styled HTML/CSS, no coordinate math at all (contrast with `../jspdf`, where
everything is manually positioned).

## Showcase features (6 of the required 4+)

1. **Branded header/footer** — gradient hero banner + footer strip, plain CSS.
2. **Styled data table** — a normal HTML `<table>`, rasterized as-is.
3. **Chart/graph** — a live Chart.js `<canvas>` element, captured by html2canvas along with everything else on the page.
4. **Callout boxes** — a styled `<blockquote>`.
5. **Print CSS / page control** — `pagebreak: { mode: ['css', 'legacy'] }` +
   a `.page-break { break-before: page; }` class forces a clean 2-page
   split instead of slicing awkwardly mid-section.
6. **Custom fonts** — Sora via Google Fonts.

## How to run

```bash
npm install
open index.html      # click "Export this page to PDF" — downloads client-side
```

Like `../jspdf`, this has no server-side code path, so `capture-sample-output.mjs`
drives a real Chromium via Puppeteer to click the button and save the actual
browser download to `sample-output/`:

```bash
npm install -D puppeteer
node capture-sample-output.mjs
```

## Install effort

Low — single script include, one method call against an existing DOM element.

## Best for

"Add an export-to-PDF button to this existing web page" when you don't
want a backend/headless-browser round trip and the content is already
built as HTML/CSS (dashboards, generated reports already shown on-screen).

## Limitations

- **html2canvas re-implements CSS rendering in JavaScript** rather than
  using the browser's real paint pipeline — it does not support every CSS
  feature (some gradients/filters/webfont edge cases, iframes, certain
  transform combinations) as faithfully as an actual browser print engine.
  For pixel-perfect fidelity to complex layouts, prefer Puppeteer/Playwright
  (`../puppeteer`, `../playwright-pdf`), which print through real Chromium.
- Output is a raster image per page section, not vector text — text isn't
  selectable/searchable in the resulting PDF the way it is with every other
  HTML-to-PDF example in this lab (Puppeteer, Playwright, WeasyPrint, Paged.js
  all produce real vector text).
- Automatic page-splitting across a tall canvas can still cut awkwardly
  through content unless you explicitly mark break points, as done here.
