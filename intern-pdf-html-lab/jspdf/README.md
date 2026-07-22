# jsPDF + jspdf-autotable — client-side PDF generation

**Category:** JS PDF builder (runs in the browser, no server) · **From starter list:** yes
**License:** MIT · **Language:** JavaScript (browser)

The whole point of jsPDF is that it runs **in the end user's browser tab** —
open `index.html`, click the button, and a PDF is built and downloaded with
no server round-trip and no headless-browser process. This example builds a
multi-page invoice: a hand-drawn branded header (repeated on every page via
autotable's `didDrawPage` hook), a striped line-item table
(`jspdf-autotable`), a Chart.js chart rasterized to PNG and embedded with
`addImage`, and a payment-terms callout box.

## Showcase features (5 of the required 4+)

1. **Branded header/footer** — drawn with `doc.rect`/`doc.text`, redrawn on every page via `didDrawPage`.
2. **Multi-page with page numbers** — 27 line items force a real page break; "Page X of Y" uses the standard jsPDF two-pass pattern (`doc.internal.getNumberOfPages()` after content is placed, then `doc.setPage(i)` to stamp each one, since the total isn't known until everything is laid out).
3. **Styled data table** — `jspdf-autotable` with header fill color and alternating row shading.
4. **Chart/graph** — a Chart.js bar chart rendered to an off-screen `<canvas>`, exported via `canvas.toDataURL()`, and embedded with `doc.addImage()` — the standard technique for getting a "real" chart into jsPDF, which has no charting of its own.
5. **Callout boxes** — a rounded, bordered `doc.roundedRect` with wrapped text (`doc.splitTextToSize`).

## How to run

```bash
npm install
open index.html          # click "Generate invoice PDF" — downloads client-side
```

`capture-sample-output.mjs` is a *verification* helper (not part of the
library integration) that drives a real Chromium via Puppeteer, clicks the
button, and saves the browser's actual download to `sample-output/` — since
this demo has no server-side code path to call directly, that's the most
faithful way to capture and check its real output:

```bash
npm install -D puppeteer
node capture-sample-output.mjs
```

## Install effort

Low — one `npm install` for the library, no browser automation needed to
*use* it (only to capture a sample for this repo).

## Best for

Anything that must generate a PDF entirely client-side: no backend, offline
capability, or user-uploaded-data-never-leaves-the-browser requirements.
Also good for simple export buttons ("Download as PDF") bolted onto an
existing web app without standing up a rendering service.

## Limitations

- You're back to manual coordinate placement for anything beyond
  `autoTable` (no general layout/flow engine) — similar trade-off to `../pdf-lib`.
- Charts require the rasterize-to-PNG workaround shown here; there's no
  vector chart embedding.
- Large/complex documents get unwieldy fast compared to an HTML+CSS-driven
  approach (`../puppeteer`, `../playwright-pdf`) where you can lean on a
  real layout engine.
