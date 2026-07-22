# Jinja2 — HTML templating (rendered to PDF via WeasyPrint)

**Category:** HTML/CSS polish — component/template approach · **From starter list:** no — additional find
**License:** BSD-3-Clause · **Language:** Python

Every other HTML example in this lab (`../bootstrap`, `../tailwind`,
`../pico-css`, …) is a single hand-written HTML file. That's fine for a
one-off document, but it doesn't scale to "render this report for whichever
customer/account/date range the request asks for" — the actual shape of a
report endpoint behind FastAPI. Jinja2 is the templating layer that closes
that gap: it's FastAPI's own default templating engine (`fastapi.templating.Jinja2Templates`),
so this example is also the most direct answer to the brief's "prefer
solutions that could plug into a FastAPI + React stack later."

This example renders an **overdue invoice digest** across four customers
from a single Python list of dicts, using one base layout and one set of
macros — then hands the resulting HTML to WeasyPrint (already covered in
`../weasyprint`) to print it. The showcase here is the templating layer,
not the PDF engine.

## Showcase features (7 of the required 4+)

1. **Template inheritance** — `templates/base.html.j2` defines the shared shell (brand strip, `<head>`); `templates/report.html.j2` extends it and only fills in `{% block content %}`.
2. **Macros** — `templates/macros.html.j2` defines `invoice_table()` and `callout()` once; both are called once per customer inside a loop, instead of copy-pasting table/callout markup four times by hand (compare to every hand-written HTML example elsewhere in this lab).
3. **Includes with shared context** — `templates/partials/_customer_header.html.j2` is `{% include %}`-ed once per loop iteration and reads `customer` from the caller's scope automatically.
4. **Custom filters** — `usd()` and `dateformat()` are plain Python functions registered onto the Jinja2 `Environment` and called as `{{ amount | usd }}` / `{{ due | dateformat }}`.
5. **Branded header/footer with per-page running headers** — same WeasyPrint `string-set`/`string()` technique as `../weasyprint`, but here `data-title="{{ customer.name }}"` comes from loop data, not a hardcoded value per chapter.
6. **Conditional callout boxes** — `{% if customer.days_overdue_max > 60 %}` picks an escalation (red-orange) vs. reminder (blue) callout variant per customer, driven entirely by data.
7. **Chart/graph** — a matplotlib bar chart of overdue balance per customer, exported to SVG and embedded via `{{ chart_svg | safe }}` — explicitly opting out of Jinja2's autoescaping for trusted, locally-generated markup (the one line in this example that's actually risky if the input weren't trusted, which is worth calling out).

Multi-page with real page numbers (`counter(page)`/`counter(pages)`), a
styled data table, and print CSS (`break-inside: avoid` on each customer
chapter) all come along for free from the WeasyPrint rendering step, same
as `../weasyprint`.

## How to run

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 generate.py
```

This writes two things:

- `rendered-report.html` — the raw Jinja2 output. It's a complete, valid
  HTML file with no template syntax left in it — open it directly in a
  browser (it sits next to `style.css` and `fonts/`, so it renders exactly
  as designed with no server needed). This is the point: **the template
  engine's job stops at HTML.** What happens next (browser, WeasyPrint,
  Playwright, print) is a separate concern.
- `sample-output/overdue-invoice-digest.pdf` — that same HTML, printed by
  WeasyPrint.

**macOS system dependency:** same as `../weasyprint` — WeasyPrint needs
Pango. `brew install pango`, then run with
`DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib` set. See `../weasyprint/README.md`
for the full explanation.

## Install effort

Low — `pip install jinja2 weasyprint matplotlib`, plus the same Pango
system dependency as `../weasyprint` (Jinja2 itself is pure Python, zero
dependencies).

## Best for

Any report where the HTML structure is fixed but the data isn't —
per-customer statements, per-tenant dashboards, anything rendered once per
request. This is the realistic FastAPI pattern: `Jinja2Templates` renders
the HTML server-side, then either serve it directly as a webpage or pipe it
through WeasyPrint/Playwright for a PDF version of the same template — one
source of truth for both.

## Limitations

- Jinja2 only produces HTML/text — it has no opinion on layout, styling, or
  PDF rendering; you still need a CSS approach (this example reuses `../weasyprint`'s)
  and, for PDF, a renderer (WeasyPrint here, but Playwright/Puppeteer work
  identically against the same rendered HTML).
- Autoescaping is on by default for `.html` templates (good — prevents
  accidental XSS from untrusted data), but that means anything you
  deliberately want rendered as raw markup (like the chart SVG here) needs
  an explicit `| safe`, which is also exactly the line to double-check
  during review if the content source ever becomes less trusted.
- No built-in support for CSS/JS bundling, hot-reload, or anything else a
  full framework (e.g. FastAPI + Jinja2 together) would normally provide —
  it's a templating library, not a web framework.
