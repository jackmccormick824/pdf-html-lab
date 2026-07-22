# HTML & PDF Libraries — Research + Showcase

A hands-on survey of free/open-source libraries and techniques for making
polished HTML reports and PDF exports — frontend (browser HTML/CSS) and
backend (Python/Node PDF generation). Every entry has a real, runnable,
verified example — no "hello world" placeholders.

## Transparency on what's new here vs. what was given

The assignment came with a starter search list (Tailwind, Pico.css,
Water.css, MVP.css, Bootstrap, Bulma, custom print CSS; Puppeteer,
Playwright, pdf-lib, jsPDF, html2pdf.js, Prince alternatives, Gotenberg;
ReportLab, WeasyPrint, xhtml2pdf, fpdf2, Playwright/Chromium, pdfkit/wkhtmltopdf;
Chart.js, Recharts, matplotlib, Plotly, SVG-in-HTML-to-PDF). **All of those
were built and are covered below** — this README and [COMPARISON.md](COMPARISON.md)
mark each one "From starter list: yes" so it's clear they came from the
brief, not from independent research.

Beyond that list, this lab also researched and built:

- **[Paged.js](intern-pdf-html-lab/paged-js)** — a pagination polyfill that automates what `custom-print-css` has to hand-roll (running headers, real "page X of N", TOC page references)
- **[PDFKit (Node)](intern-pdf-html-lab/pdfkit-node)** — Node's closest equivalent to ReportLab, with real text-flow/wrapping that pdf-lib doesn't have
- **[@react-pdf/renderer](intern-pdf-html-lab/react-pdf)** — build PDFs as React components, the natural fit for a React-based stack
- **[Pandoc](intern-pdf-html-lab/pandoc)** — Markdown-to-PDF via pluggable backends (used here with Typst)
- **[Typst](intern-pdf-html-lab/typst)** — a modern, lightweight LaTeX alternative with native math typesetting

## Start here

1. **[COMPARISON.md](COMPARISON.md)** — the full matrix: every library, language, license, install effort, best-for, limitations, and a link to its example.
2. **[RECOMMENDATION.md](RECOMMENDATION.md)** — top picks for (a) nice HTML in the browser, (b) PDF from HTML, (c) PDF built in code.
3. **`intern-pdf-html-lab/`** — one folder per library. Each has its own README (what it is, license, how to run, which showcase features it demonstrates), source, and a `sample-output/` with the real generated HTML/PDF committed so you can look at the result without running anything.

## What "done" looks like for each example

Every buildable example demonstrates at least 4 of: branded header/footer,
multi-page with page numbers, styled data table, chart/graph, callout
boxes, print CSS, dark/light theme, custom fonts, landscape page, TOC —
chosen to fit what that specific library is actually good at, not padded
for a checklist. Several go well beyond 4.

**Bugs found while building this were fixed and documented, not hidden.**
A few examples worth reading even if you're not evaluating that specific
library, because the bug (and fix) generalizes:

- [`paged-js`](intern-pdf-html-lab/paged-js) — a real, still-open upstream bug in mixed-orientation named pages (linked to the GitHub issues), left disabled with an explanation rather than shipping broken output.
- [`pdfkit-node`](intern-pdf-html-lab/pdfkit-node) — text placed at explicit coordinates still trips PDFKit's page-overflow guard if it falls inside the margin, silently spawning blank pages.
- [`reportlab`](intern-pdf-html-lab/reportlab) — `ParagraphStyle` defaults `leading` to a flat 12pt regardless of `fontSize`, causing large headings to overlap the text below them.
- [`typst`](intern-pdf-html-lab/typst) — a chart grid split mid-row across a page boundary; fixed with Typst's equivalent of `break-inside: avoid`.
- [`fpdf2`](intern-pdf-html-lab/fpdf2) — an early draft claimed CJK/emoji glyph support the embedded font didn't actually have; fpdf2's build-time warning caught it before it shipped as silent tofu boxes.

## Environment notes / system dependencies

- **Node examples** need `npm install`; Puppeteer/Playwright additionally download a Chromium binary (~170MB) on first install.
- **Python examples** need `pip install -r requirements.txt` per folder. WeasyPrint additionally needs Pango (`brew install pango` on macOS, plus `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib` — see its README).
- **Pandoc/Typst examples** need `brew install pandoc typst` (or your OS equivalent) — no LaTeX distribution required.
- **Gotenberg** needs Docker (not available in the environment this lab was built in — documented, not built).
- **wkhtmltopdf** is effectively unmaintained and had no installable package for this environment — documented, not built.

Every `sample-output/` in this repo was generated in this environment and
verified with `pdfinfo`/`pdftoppm` (page counts, rendered thumbnails) for
PDFs, or screenshotted in a real browser for HTML — not just "the command
exited 0."
