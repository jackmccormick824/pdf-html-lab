# Recommendation

## (a) Nice HTML in the browser

**Top pick: [Tailwind CSS](intern-pdf-html-lab/tailwind)** if you already have
(or are willing to add) a build step — it gives the most control per line of
markup and keeps a design system consistent between your product UI and your
reports.
**Runner-up: [Pico.css](intern-pdf-html-lab/pico-css) or
[Water.css](intern-pdf-html-lab/water-css)** (classless) when you want a
good-looking document from plain semantic HTML in minutes, with zero class
vocabulary to learn — Water.css specifically if you want automatic OS
dark/light theming with no JavaScript at all. Skip
[Bootstrap](intern-pdf-html-lab/bootstrap)/[Bulma](intern-pdf-html-lab/bulma)
unless you specifically want their prebuilt component vocabulary (navbars,
cards, badges) — they're faster to assemble a dashboard from but harder to
fully reskin later.

## (b) PDF from HTML

**Top pick: [Playwright](intern-pdf-html-lab/playwright-pdf) or
[Puppeteer](intern-pdf-html-lab/puppeteer)** when your report is already (or
can be) a real HTML/CSS page — they print through actual Chromium, so if it
looks right in the browser, it looks right in the PDF, including modern CSS,
live charts, and custom fonts. Prefer Playwright if your team already has it
for end-to-end testing; otherwise Puppeteer is the more "default" choice.
**Runner-up: [WeasyPrint](intern-pdf-html-lab/weasyprint)** if you want to
stay in Python and avoid shipping a browser binary — its native support for
CSS Paged Media (running headers, `counter(pages)`, TOC page references,
multi-column) is genuinely stronger than what Chromium's print engine gives
Puppeteer/Playwright, at the cost of a Pango/cairo system dependency and no
JavaScript execution. Reach for **[Paged.js](intern-pdf-html-lab/paged-js)**
specifically when you need real automatic re-pagination of long flowing
content in-browser and are fine with a JS polyfill (and its one known bug
around mixed-orientation named pages, documented in that folder).

None of the above answers where the HTML itself comes from when it's
generated per request rather than hand-written once. **[Jinja2](intern-pdf-html-lab/jinja2)**
is that layer — template inheritance, macros, and loops over your data
model produce the HTML that Playwright/Puppeteer/WeasyPrint then print. It's
also FastAPI's own default templating engine, so it's the natural fit if
the backend is already FastAPI.

## (c) PDF built in code (no browser, no HTML)

**Top pick: [ReportLab](intern-pdf-html-lab/reportlab)** (Python) for anything
structured and repeatable — compliance reports, statements, certificates —
where you want a real TOC, precise layout control, and a mature, widely-used
library. **Runner-up: [pdf-lib](intern-pdf-html-lab/pdf-lib) or
[PDFKit](intern-pdf-html-lab/pdfkit-node)** (JS/Node) if your stack is already
JavaScript — pdf-lib for merging/editing/watermarking existing PDFs, PDFKit
specifically when your content is prose-heavy and you want automatic text
wrapping rather than pdf-lib's raw coordinate placement. If you're on a
constrained or serverless Python environment where even ReportLab feels
heavy, **[fpdf2](intern-pdf-html-lab/fpdf2)** is the lightest install in this
entire lab (pure Python, zero system dependencies) and covers the same core
use cases at a smaller scale.

**Honorable mention, genuinely different category:** if your reports lean
technical (formulas, structured long-form documents) or you're comfortable
maintaining native document markup instead of a programming-language API,
**[Typst](intern-pdf-html-lab/typst)** produces the best out-of-the-box
typography of anything tested in this lab — real math typesetting, footnotes,
and TOC support in a single lightweight binary, no LaTeX install required.

## What we'd actually reach for on a FastAPI + React project

Frontend report preview: **[Tailwind](intern-pdf-html-lab/tailwind)**, reusing
the app's existing design tokens. PDF export of that same page:
**[Playwright](intern-pdf-html-lab/playwright-pdf)**, called from the FastAPI
backend, printing the already-styled page — one rendering pass, one source of
truth for how the report looks on screen and on paper. For reports that are
rendered server-side instead (emailed statements, background jobs with no
React page to screenshot), **[Jinja2](intern-pdf-html-lab/jinja2)** generates
the HTML from the data model and **[WeasyPrint](intern-pdf-html-lab/weasyprint)**
prints it — same split of concerns, just without a browser round-trip. If a
report needs to be generated without ever touching HTML at all (background
jobs, high volume, tight latency budgets), **[ReportLab](intern-pdf-html-lab/reportlab)**
on the Python side or **[pdf-lib](intern-pdf-html-lab/pdf-lib)**/**[PDFKit](intern-pdf-html-lab/pdfkit-node)**
on the Node side, depending on which language owns that service.
