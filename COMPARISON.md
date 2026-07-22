# Comparison Matrix

Every row was actually built and verified in this repo (rendered/screenshotted for HTML,
or generated + inspected with `pdfinfo`/`pdftoppm` for PDF), except the two rows marked
**docs-only** and two rows marked **not built** — see the notes under those.

**From starter list** = yes means the item appeared in the brief's starter search list;
no means it's an additional discovery made while researching this lab (see the root
[README.md](README.md) for the full explanation of why that distinction matters here).

## HTML / CSS polish

| Library | Language | License | HTML/PDF | Install effort | Best for | Limitations | Starter list? | Example |
|---|---|---|---|---|---|---|---|---|
| Tailwind CSS v4 | CSS (utility classes) | MIT | HTML | Low (npm + CLI build) | Teams already on Tailwind; consistent design tokens across product + reports | Verbose markup; needs a build step | Yes | [tailwind](intern-pdf-html-lab/tailwind) |
| Bootstrap 5.3 | CSS + JS | MIT | HTML | Very low (drop-in CSS/JS) | Fast, recognizable dashboards/components | Bakes in visual opinion; harder to fully reskin | Yes | [bootstrap](intern-pdf-html-lab/bootstrap) |
| Bulma 1.0 | CSS only | MIT | HTML | Very low (single CSS file) | Semantic class names, no JS dependency | Smaller ecosystem than Bootstrap | Yes | [bulma](intern-pdf-html-lab/bulma) |
| Pico.css v2 | CSS only (classless) | MIT | HTML | Trivial (one `<link>`) | Docs/internal tools with near-zero CSS effort | Little visual customization without extra CSS | Yes | [pico-css](intern-pdf-html-lab/pico-css) |
| Water.css v2 | CSS only (classless) | MIT | HTML | Trivial (one `<link>`) | Auto OS dark/light theme, zero JS | No manual toggle without extra work | Yes | [water-css](intern-pdf-html-lab/water-css) |
| MVP.css | CSS only (classless) | MIT | HTML | Trivial | Same niche as Pico/Water | **Not built** — near-identical capability to Pico/Water, would be redundant; noted for transparency instead | Yes | — |
| Hand-rolled CSS Paged Media | CSS (browser-native) | N/A | HTML → PDF via print | None (built into every browser) | Simple documents, learning the underlying platform | No automatic pagination or real running headers; manual page breaks only | Yes ("custom print styles") | [custom-print-css](intern-pdf-html-lab/custom-print-css) |
| Paged.js | CSS + JS polyfill | MIT | HTML → PDF via print | Low-medium (must serve over http, not file://) | Long flowing documents needing real auto-pagination/TOC/running headers | ~500KB JS; mixed-orientation named pages currently buggy (documented, upstream issue) | **No — additional find** | [paged-js](intern-pdf-html-lab/paged-js) |
| Jinja2 | Python (templating engine, not a renderer) | BSD-3-Clause | HTML (feeds into any PDF renderer) | Low | Generating a report's HTML from data — inheritance, macros, includes, custom filters — instead of hand-writing it per document; FastAPI's own default templating engine | Produces HTML only, no layout/PDF opinion of its own; needs a CSS approach + renderer (paired here with WeasyPrint) | **No — additional find** | [jinja2](intern-pdf-html-lab/jinja2) |

## JS PDF / HTML-to-PDF

| Library | Language | License | HTML/PDF | Install effort | Best for | Limitations | Starter list? | Example |
|---|---|---|---|---|---|---|---|---|
| Puppeteer | Node.js | Apache-2.0 | Both (PDF via headless Chrome) | Medium (bundles Chromium, ~170MB) | Pixel-faithful PDF from an existing HTML/CSS report | Heaviest install of the JS options; still browser-print-engine pagination | Yes | [puppeteer](intern-pdf-html-lab/puppeteer) |
| Playwright | Node.js (+ Python/.NET/Java) | Apache-2.0 | Both (PDF via headless Chromium) | Medium (separate browser install step) | Same as Puppeteer; better fit if already used for E2E testing | Same engine weight; `landscape` is whole-document, not per-page | Yes | [playwright-pdf](intern-pdf-html-lab/playwright-pdf) |
| pdf-lib | JS/TS (browser or Node) | MIT | PDF (programmatic, no browser) | Low | Merging/splitting/watermarking PDFs; precise manual layout | No layout engine — every position computed by hand | Yes | [pdf-lib](intern-pdf-html-lab/pdf-lib) |
| jsPDF (+ autotable) | JS (browser) | MIT | PDF (client-side, no server) | Low | "Download as PDF" buttons with zero backend | Manual coordinates beyond autoTable; charts need rasterizing first | Yes | [jspdf](intern-pdf-html-lab/jspdf) |
| html2pdf.js | JS (browser) | MIT | PDF (client-side, html2canvas + jsPDF) | Low | Exporting an existing styled DOM element to PDF, one line of code | Raster output (no selectable text); html2canvas CSS support is imperfect | Yes | [html2pdf-js](intern-pdf-html-lab/html2pdf-js) |
| PDFKit (Node) | Node.js | MIT | PDF (programmatic, no browser) | Low | Prose-heavy generated docs (letters, statements) needing real text flow | No table/chart helpers; margin/overflow footgun (documented) | **No — additional find** | [pdfkit-node](intern-pdf-html-lab/pdfkit-node) |
| @react-pdf/renderer | React | MIT | PDF (programmatic, no browser) | Low | Teams already building UI in React; fits a React/FastAPI stack | Flexbox-only layout; can't render Recharts/other DOM component libs directly | **No — additional find** | [react-pdf](intern-pdf-html-lab/react-pdf) |
| Gotenberg | Language-agnostic (Docker service) | MIT | Both (HTTP API around Chromium + LibreOffice) | High (Docker required) | Shared PDF-rendering microservice across multiple languages/services; Office-file conversion | **Docs-only** — Docker unavailable in this environment | Yes | [gotenberg](intern-pdf-html-lab/gotenberg) (docs only) |

## Python PDF

| Library | Language | License | HTML/PDF | Install effort | Best for | Limitations | Starter list? | Example |
|---|---|---|---|---|---|---|---|---|
| ReportLab | Python | BSD (open-source core) | PDF (programmatic, no browser) | Low | Structured, repeatable reports (compliance, statements); has real TOC/bookmark support | Verbose API; `leading` footgun (documented); charts need an external lib | Yes | [reportlab](intern-pdf-html-lab/reportlab) |
| WeasyPrint | Python | BSD | PDF (real HTML/CSS engine, not a browser) | Medium (needs Pango/cairo system libs) | The strongest pure HTML/CSS-to-PDF option here: native running headers, TOC page refs, `counter(pages)`, multi-column | Own layout engine — occasional CSS quirks vs. a real browser; no JS execution | Yes | [weasyprint](intern-pdf-html-lab/weasyprint) |
| xhtml2pdf (pisa) | Python (built on ReportLab) | Apache-2.0 | PDF (HTML/CSS 2.1-era) | Very low (no system deps) | Simple documents (invoices, POs) with table/float layout | No flexbox/grid; limited CSS3; slower-moving project | Yes | [xhtml2pdf](intern-pdf-html-lab/xhtml2pdf) |
| fpdf2 | Python (pure) | LGPL-3.0 | PDF (programmatic, no browser) | Lowest in this lab (zero system deps) | Lightweight services, constrained/serverless environments | No table/chart helpers; manual glyph-coverage checking (documented bug) | Yes | [fpdf2](intern-pdf-html-lab/fpdf2) |
| Playwright (Python bindings) | Python | Apache-2.0 | Both (same engine as Node Playwright) | Medium (same browser install) | Portable, identical API to the Node example, for a Python backend | **Not built as a separate folder** — identical underlying engine/API to [playwright-pdf](intern-pdf-html-lab/playwright-pdf); Python usage documented in that folder's README instead | Yes | see [playwright-pdf](intern-pdf-html-lab/playwright-pdf) README |
| pdfkit (Python) / wkhtmltopdf | Python wrapper + standalone binary | LGPL-3.0 (binary) | HTML → PDF | High (unmaintained binary, no package manager install path found) | Legacy codebases already depending on it | **Docs-only** — project largely unmaintained (last release 2020), no Homebrew formula/cask available | Yes | [wkhtmltopdf](intern-pdf-html-lab/wkhtmltopdf) (docs only) |

## Document pipelines (beyond the starter list)

| Tool | Language | License | HTML/PDF | Install effort | Best for | Limitations | Starter list? | Example |
|---|---|---|---|---|---|---|---|---|
| Pandoc (+ Typst backend) | CLI (Haskell) | GPL-2.0-or-later | Markdown → PDF | Low (2 `brew install`s) | Docs-as-Markdown workflows needing occasional polished PDF export | Fine visual control needs a custom template; best for prose, not app-like layouts | **No — additional find** | [pandoc](intern-pdf-html-lab/pandoc) |
| Typst | Its own markup + compiler | Apache-2.0 | Native markup → PDF | Low (single binary) | STEM/technical reports needing real math typesetting; LaTeX-quality without LaTeX's size/UX | Own markup language to learn; smaller ecosystem than LaTeX | **No — additional find** | [typst](intern-pdf-html-lab/typst) |

## Charts (cross-cutting technique, not a separate category)

The brief's starter list groups charts separately (Chart.js, Recharts, matplotlib, Plotly,
SVG-in-HTML-to-PDF) — in practice these are techniques used *inside* the examples above,
not standalone deliverables:

| Technique | Used in | Notes |
|---|---|---|
| Chart.js (canvas, CDN) | [tailwind](intern-pdf-html-lab/tailwind), [bootstrap](intern-pdf-html-lab/bootstrap), [puppeteer](intern-pdf-html-lab/puppeteer) | Standard in-browser charting; rasterizes fine in headless-browser PDF pipelines |
| Plotly.js (`staticPlot`) | [playwright-pdf](intern-pdf-html-lab/playwright-pdf) | Used instead of Chart.js there specifically to cover the starter list's Plotly mention |
| matplotlib → PNG | [reportlab](intern-pdf-html-lab/reportlab), [pandoc](intern-pdf-html-lab/pandoc) | Standard Python embed-a-chart-as-image pattern |
| matplotlib → SVG | [weasyprint](intern-pdf-html-lab/weasyprint) | Vector chart, stays crisp at any zoom, unlike a PNG |
| Hand-drawn (no library) | [pdf-lib](intern-pdf-html-lab/pdf-lib) (rects), [pdfkit-node](intern-pdf-html-lab/pdfkit-node) (vector line via bezier/path), [react-pdf](intern-pdf-html-lab/react-pdf) (flexbox bars), [typst](intern-pdf-html-lab/typst) (native `rect()`/`grid()`) | Shows what's possible with zero charting dependency in programmatic-PDF tools |
| jsPDF + rasterized Chart.js canvas | [jspdf](intern-pdf-html-lab/jspdf) | The standard workaround for charts in a library with no native charting |
| Recharts | — | **Not built** — renders to the DOM only; cannot be embedded in a non-browser PDF pipeline (pdf-lib/PDFKit/react-pdf/ReportLab/etc.). Explained in detail in [react-pdf](intern-pdf-html-lab/react-pdf)'s README, since that's the most likely place someone would look for it. |

## Notable free tools considered and explicitly not built

| Tool | Why not built |
|---|---|
| Gotenberg | Docker unavailable in this environment (docs-only entry above) |
| wkhtmltopdf / pdfkit (Python) | Unmaintained, no installable package found for this environment (docs-only entry above) |
| MVP.css | Functionally redundant with Pico.css/Water.css, already covered |
| Recharts | Renders to DOM only, not embeddable in a non-browser PDF pipeline (see chart table above) |
| Prince XML | Paid license — explicitly excluded per the brief's free/open-source constraint; WeasyPrint, Playwright, and Puppeteer are this lab's free alternatives |
| LaTeX (pdflatex/xelatex via TeX Live) | Free, but a multi-gigabyte install — Typst was chosen instead as the modern, lightweight alternative with a similar typesetting-quality goal |
