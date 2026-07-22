# xhtml2pdf (pisa) — simple HTML-to-PDF, CSS 2.1-era

**Category:** Python HTML-to-PDF · **From starter list:** yes
**License:** Apache-2.0 · **Language:** Python (built on top of ReportLab)

xhtml2pdf is older and much more limited than WeasyPrint — it supports
CSS 2.1 plus a handful of CSS3 properties, with **no flexbox and no CSS
grid**. `purchase_order.html` is deliberately laid out with `<table>` and
inline widths (the way HTML email templates still have to be built today)
rather than modern CSS, because that's genuinely the ceiling of what this
library handles reliably. Page numbers use xhtml2pdf's own non-standard
`<pdf:pagenumber/>` / `<pdf:pagecount/>` tags inside a CSS `@frame` region
— its own equivalent of a repeating footer, predating (and unrelated to)
the `@page` margin-box standard WeasyPrint implements.

## Showcase features (4 of the required 4+)

1. **Branded header/footer with page numbers** — table-based header + a `@frame footer_frame` region with `<pdf:pagenumber/>` of `<pdf:pagecount/>`.
2. **Styled data table** — the line-item table, with a colored header row and right-aligned numeric columns.
3. **Callout box** — a simple bordered/colored `<div>`.
4. **Print-oriented `@page` sizing** — `@page { size: A4; margin: ...; }`.

Kept deliberately closer to the "required 4" floor rather than padded —
this library's ceiling is genuinely lower than the others in this lab, and
the honest showcase is a clean document within that ceiling, not a strained
attempt at features (dark mode, CSS grid dashboards) it can't really do.

## How to run

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 generate.py   # writes sample-output/purchase-order.pdf
```

## Install effort

Very low — pure `pip install`, no system dependency (it doesn't need
Pango/cairo the way WeasyPrint does, since it leans on ReportLab underneath).

## Best for

Quick, simple documents (invoices, purchase orders, certificates) where
you want to write HTML/CSS instead of ReportLab's Python API directly, your
layouts are simple (tables, floats, basic boxes), and you want the lightest
possible system dependency footprint of any HTML-to-PDF option in this lab.

## Limitations

- **No flexbox, no CSS grid** — confirmed by deliberately avoiding them
  here; modern layout CSS silently fails or lays out incorrectly.
- Limited CSS3 support generally (gradients, most `box-shadow`/`border-radius`
  usage, custom `@font-face` embedding is finicky) — don't reach for this
  if the design needs to look "modern."
- The project has had periods of slow maintenance historically — check
  recent commit activity before depending on it for anything beyond simple
  documents; WeasyPrint (`../weasyprint`) is the better-supported choice
  for anything CSS-heavy.
- Its own non-standard `<pdf:pagenumber/>` tag syntax is a vendor lock-in
  quirk — that markup does nothing in a real browser, unlike every other
  HTML-to-PDF example in this lab, which renders sensibly (if unstyled) in
  a browser without its intended pipeline.
