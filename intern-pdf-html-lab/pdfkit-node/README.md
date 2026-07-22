# PDFKit (Node) — programmatic PDF drawing with real text flow

**Category:** JS PDF builder (no browser) · **From starter list:** no — this is one of this lab's own additional finds (Node's closest equivalent to Python's ReportLab).
**License:** MIT · **Language:** Node.js (also runs in the browser via browserify/webpack)

Like `../pdf-lib`, PDFKit has no HTML/CSS — but unlike pdf-lib, `.text()`
**wraps and flows automatically** within a given width, and the document
adds new pages on its own when content overflows a page. That makes it a
much better fit for prose-heavy documents (letters, contracts, reports with
real paragraphs) than pdf-lib's raw coordinate-only `drawText`.

## Showcase features (6 of the required 4+)

1. **Custom fonts** — Lora (serif, variable) + Inter (sans, variable) embedded via `doc.registerFont()`.
2. **Multi-page with page numbers** — the letter body's paragraphs overflow onto page 2 *automatically* (no manual page-break decision), then `bufferPages: true` + `doc.switchToPage()` stamps "Page X of Y" once the real total is known — PDFKit's documented two-pass pattern.
3. **Chart/graph** — a fully vector line chart (no image, no chart library) drawn with `.moveTo`/`.lineTo`/`.circle`, demonstrating PDFKit's real strength: general-purpose vector drawing, not just text.
4. **Styled data table** — hand-drawn like pdf-lib's (PDFKit has no built-in table primitive either).
5. **Callout boxes** — a filled rect + accent-color left bar, sized dynamically to the wrapped text height via `doc.heightOfString()`.
6. **Branded header** — a vector-drawn circular logo mark (no image asset) + rule line.

## A bug worth knowing about (found and fixed while building this)

Text placed with explicit `x, y` coordinates still trips PDFKit's automatic
page-overflow guard if `y` falls inside the page's declared bottom margin —
even though you gave it a fixed position. The original page-numbering loop
here (`doc.text('Page X of Y', 64, 802, ...)`) silently spawned a **new
blank page on every iteration**, because 802pt is below the 781.89pt content
boundary (A4 height 841.89 − 60pt bottom margin). The fix, and the standard
pattern for this in PDFKit: temporarily zero `doc.page.margins.bottom`
around the stamp call, then restore it. See the comment in `generate.mjs`.

## How to run

```bash
npm install
node generate.mjs   # writes sample-output/investor-update-letter.pdf
```

## Install effort

Low — pure npm install, no browser, no system dependency.

## Best for

Text-heavy generated documents (letters, contracts, statements, reports
with real prose) where you want vector drawing for a chart/logo/diagram but
don't want to compute line-wrapping yourself. A more ergonomic middle
ground between pdf-lib's raw primitives and a full HTML/CSS pipeline.

## Limitations

- No table helper (as of the version pinned here) — every table in this
  lab's Node examples (`pdf-lib`, `pdfkit-node`) hand-draws its own.
- No CSS — layout logic (widths, positions, wrapping around a chart) is
  still your responsibility, just less of it than pdf-lib.
- The margin/overflow footgun above is a real trap if you're used to
  ReportLab or WeasyPrint's more forgiving positioning models.
