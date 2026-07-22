# pdf-lib — programmatic PDF construction & manipulation

**Category:** JS PDF builder (no browser) · **From starter list:** yes
**License:** MIT · **Language:** Node.js / browser (works in both)

pdf-lib has no HTML/CSS involved at all — you place text and shapes with
explicit x/y coordinates on a page, like a canvas API. `generate.mjs` builds
two separate PDF documents (a one-page certificate, a multi-page data
table), then demonstrates pdf-lib's other headline feature: **merging**
already-built PDFs into one file (`copyPages`), followed by a post-process
pass that stamps page numbers across the merged result.

## Showcase features (5 of the required 4+)

1. **Custom fonts** — real Poppins TTF files embedded via `@pdf-lib/fontkit` (`fonts/Poppins-{Regular,Bold}.ttf`), not a standard PDF font.
2. **Chart/graph** — a hand-drawn bar chart using `drawRectangle` — pdf-lib has no chart helper, so this shows the "everything is primitives" nature of the library.
3. **Callout boxes** — a bordered/colored rectangle + text, drawn manually.
4. **Multi-page with page numbers** — the appendix document paginates a
   9-row table across multiple pages, then the *merge* step stamps
   "Page X of Y" across the combined 3-page document (numbers that are only
   knowable after the merge, which is exactly why it happens as a separate pass).
5. **Styled data table** — drawn with `drawText` at fixed column x-positions; no table helper built in.

## How to run

```bash
npm install
node generate.mjs   # writes sample-output/certificate-and-appendix.pdf
```

## Install effort

Low — pure npm install, no browser, no system dependency. Fonts are plain
files in `fonts/` (downloaded once from Google's open-source Poppins repo).

## Best for

Merging/splitting/watermarking/filling existing PDFs, or building precisely
positioned documents (certificates, badges, ID cards, forms) where you want
full manual control and don't want to drag in a browser or a layout engine.
Also a good fit in the browser itself (pdf-lib runs client-side too) for
"stamp a signature onto this uploaded PDF" style features.

## Limitations

- No layout engine — no text wrapping/flow, no automatic table sizing, no
  CSS. Every position is a number you compute yourself (see the manual
  `colX` array and `y -= 22` line-height stepping in `generate.mjs`).
- Not the right tool for "take this existing complex HTML report and make
  it a PDF" — that's Puppeteer/Playwright/WeasyPrint's job. pdf-lib shines
  once you're building or editing PDFs directly.
