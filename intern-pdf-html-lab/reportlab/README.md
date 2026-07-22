# ReportLab — the classic Python PDF library

**Category:** Python PDF builder (no browser) · **From starter list:** yes
**License:** BSD (the open-source core used here; ReportLab also sells a
commercial "Plus" edition with extra features like barcodes/charting — not
needed for anything in this example) · **Language:** Python

ReportLab has two layers: **Platypus**, a high-level "flowable" layout
engine (`Paragraph`, `Table`, `Image`, `PageBreak`, `TableOfContents`) that
handles wrapping/pagination for you, and the low-level **Canvas**, used
here via an `onPage` callback for the branded header band and footer that
repeat on every page. A matplotlib chart is rendered to an in-memory PNG
and dropped in as an `Image` flowable — the standard way to get real charts
into a ReportLab document.

## Showcase features (6 of the required 4+)

1. **TOC with real page numbers** — `TableOfContents` + a `ReportDocTemplate.afterFlowable()` hook that calls `self.notify('TOCEntry', ...)` for every heading, resolved via `doc.multiBuild()` (a second layout pass — TOC page numbers aren't known on the first pass).
2. **Branded header/footer + page numbers** — drawn directly on the `Canvas` via `onPage`, giving pixel-level control unavailable to Platypus alone.
3. **Chart/graph** — a dual-annotation matplotlib line chart (lead trend + EPA action-level reference line) embedded as an `Image` flowable.
4. **Styled data table** — `Table`/`TableStyle` with a colored header row and `ROWBACKGROUNDS` zebra striping.
5. **Callout boxes** — built from a nested single-column `Table` (a common ReportLab trick for a colored/bordered box, since Platypus has no native callout flowable).
6. **Custom fonts** — PT Serif + PT Sans registered via `pdfmetrics.registerFont(TTFont(...))`.

## Two bugs found and fixed while building this

1. **`ParagraphStyle` defaults `leading` to a flat 12pt regardless of `fontSize`.**
   The 24pt title initially overlapped the subtitle beneath it because
   neither style set `leading` explicitly. Every style in `generate.py` now
   sets `leading` (~1.25-1.4× font size) — see the comment above the `styles` dict.
2. **`&rarr;` (→) rendered as a tofu box** — PT Serif's embedded glyph set
   doesn't include that Unicode arrow. Swapped for plain text ("1.6 to 2.4
   ppb") rather than depending on a glyph the chosen font doesn't ship.

## How to run

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 generate.py   # writes sample-output/water-quality-report.pdf
```

## Install effort

Low — pure `pip install`, no system dependency, no browser. Fonts are
plain TTF files in `fonts/`.

## Best for

Structured, repeatable, data-heavy reports (compliance reports, statements,
certificates, invoices) where you want precise layout control and don't
want a browser in your dependency chain. The TOC/bookmark support makes it
a strong fit for longer documents specifically, not just single-page output.

## Limitations

- No CSS/HTML — layout is Python code (flowables + style objects), with a
  learning curve of its own (the `leading` default above is a real
  footgun).
- Charts require a separate library (matplotlib here) rendered to an
  image first — no native charting in the open-source edition.
- Verbose for highly custom/art-directed layouts compared to iterating on
  CSS in a browser.
