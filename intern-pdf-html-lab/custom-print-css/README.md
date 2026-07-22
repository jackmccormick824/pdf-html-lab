# Hand-rolled CSS Paged Media — no framework

**Category:** CSS technique (HTML/browser polish) · **From starter list:** yes ("custom CSS print styles")
**License:** N/A (browser-native CSS) · **Language:** CSS only

No framework at all — this is what's built into every browser for free via
the CSS Paged Media spec: `@page`, `break-after: page` / `page-break-after`,
`break-inside: avoid`, `counter-reset`/`counter-increment`, `orphans`/`widows`.
The report is manually split into three fixed-size (210mm × 297mm) `.page`
divs with a duplicated running header/footer in each — on screen that's just
a styled div; under `@media print` those same divs become one physical page
each via `break-after: page`.

**Verified with a real print pipeline, not just eyeballed on screen:**
`print-to-pdf.mjs` uses Playwright to load the page, force `print` media
emulation, and call `page.pdf()` — the same underlying mechanism as a
person hitting ⌘P → Save as PDF in Chrome. Output is 3 pages, A4, with the
CSS counters resolving to "Page 1 of 3" / "Page 2 of 3" / "Page 3 of 3" as designed.

## Showcase features (6 of the required 4+)

1. **Branded header/footer** — repeated running header + footer per page (hand-duplicated in the DOM, since plain CSS has no native "repeat this on every page" primitive — that's exactly the gap Paged.js fills, see `../paged-js`).
2. **Multi-page with page numbers** — `break-after: page` + CSS counters, confirmed via `pdfinfo` (3 pages) and rendered thumbnails.
3. **Styled data table** — `break-inside: avoid` keeps rows from splitting across a page boundary.
4. **Chart/graph** — Chart.js line chart of cloud spend (page 3).
5. **Callout boxes** — info/warning boxes, also `break-inside: avoid`.
6. **Print CSS** — the entire point of the folder: `@page` size/margins, screen-vs-print divergence (`.screen-note` hidden on print), fixed physical page dimensions previewable without opening the print dialog.

## How to run

```bash
open index.html                        # screen preview — pages shown as bordered A4-sized cards
# or, to actually generate the PDF:
npm install
npx playwright install chromium         # only needed once
node print-to-pdf.mjs                   # writes sample-output/report.pdf
```

`sample-output/report.pdf` is committed — open it directly to see the result
without running anything.

## Install effort

Zero for the CSS itself (it's the platform). The `print-to-pdf.mjs` script
adds Playwright only as a way to *verify/produce* the PDF — the CSS technique
itself works with any browser's built-in print dialog too.

## Best for

Learning what you get "for free" before reaching for a library, and for
simple, fully-controlled documents (certificates, invoices, cover-page-style
reports) where hand-placing 2-4 page breaks is manageable.

## Limitations

- **No automatic pagination.** You must decide page breaks yourself by
  physically splitting content into fixed-size blocks — this does not reflow
  automatically if content length changes (add one more table row and it
  will overflow its `.page` div instead of flowing onto a new page).
- **No native repeating headers/footers.** `@page` margin boxes (the spec
  mechanism for this) have very limited/no support in Chrome's print engine,
  so headers/footers must be duplicated by hand in each page block, as done here.
- **`counter(pages)` (total page count) isn't reliably supported** in
  browsers — that's why the footer here hardcodes "of 3" rather than
  computing it. Paged.js (`../paged-js`) solves exactly this class of problem.
