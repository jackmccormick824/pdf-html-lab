# fpdf2 — lightweight, pure-Python PDF generation

**Category:** Python PDF builder (no browser) · **From starter list:** yes
**License:** LGPL-3.0 · **Language:** Python (pure — no C extensions, no system libraries)

fpdf2 (a maintained fork of the old `PyFPDF`) is the lightest-weight
option in this entire lab: no C dependencies, no font-shaping engine to
install, just `pip install fpdf2`. The standard pattern — subclassing
`FPDF` and overriding `header()`/`footer()` — gives you repeating branded
chrome and automatic page numbers (`alias_nb_pages()` for the "of N" part),
and `set_auto_page_break()` means content that overflows a page moves to
the next one without you writing pagination logic by hand (the session
table's per-row `get_y()` check in `generate.py` is a defensive fallback
for a *longer* schedule than this one happens to need — this run fits on a
single schedule page).

## Showcase features (6 of the required 4+)

1. **Branded header/footer with page numbers** — `header()`/`footer()` overrides, suppressed on the full-bleed badge page (`page_no() == 1`), active from page 2 on; `alias_nb_pages()` resolves `{nb}` to the real total.
2. **Multi-page document** — badge page (page 1) → session schedule (page 2), with different header/footer treatment per page.
3. **Styled data table** — a 14-row session grid with a colored header row and alternating row shading, drawn with `cell()`.
4. **Callout box** — a rect-based colored box with an accent bar, built from raw `rect()` + `multi_cell()` calls (fpdf2 has no callout primitive either).
5. **Custom fonts** — Noto Sans (variable) + JetBrains Mono, embedded via `add_font()`.
6. **Unicode text, verified rather than assumed** — see the bug below.

## A gap found and honestly documented, not papered over

The first draft of this example claimed CJK (`会议`, `カンファレンス`) and a
checkmark glyph (`✓`) as part of the "unicode support" showcase. Running it
printed explicit fpdf2 warnings (`Font ... is missing the following
glyphs`) — **the downloaded Noto Sans instance only covers Latin / Greek /
Cyrillic**, not CJK or symbol blocks; those live in the separate *Noto Sans
CJK* / *Noto Color Emoji* font files, which weren't downloaded. Rather than
ship a PDF with silent tofu boxes, the copy was rewritten to only claim
what the embedded font actually covers (café, naïve, über, Zürich, €, £, ¥),
and the README/on-page text now says so explicitly. fpdf2 surfacing this as
a build-time warning (instead of silently substituting `.notdef` boxes) is
itself worth noting as a real usability point in its favor.

## How to run

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 generate.py   # writes sample-output/techconf-registration.pdf
```

## Install effort

Lowest in this lab — pure `pip install fpdf2`, no system dependency
whatsoever, works the same on any OS/CI environment out of the box.

## Best for

Small/lightweight services generating simple, repeatable documents
(tickets, badges, receipts, certificates, short reports) where you want
zero deployment friction — no Pango, no Chromium, no fontconfig, nothing
beyond the Python package itself. A good fit for serverless/constrained
environments where WeasyPrint's or Playwright's system dependencies are
impractical.

## Limitations

- No CSS/HTML, no table/chart primitives — same "you build it from boxes
  and text" trade-off as pdf-lib/PDFKit, just in Python.
- Custom fonts must be manually subset-checked for the glyphs you actually
  need (see the bug above) — nothing stops you from writing a codepoint
  the font can't render except reading the warning it prints.
- Less feature-rich than ReportLab (no built-in TOC/bookmark flowables,
  smaller ecosystem) in exchange for its much smaller footprint.
