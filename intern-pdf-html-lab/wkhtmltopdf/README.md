# wkhtmltopdf (+ Python's pdfkit wrapper)

**Category:** HTML-to-PDF (standalone binary + wrapper) · **From starter list:** yes
**License:** LGPL-3.0 (the binary itself) · **Status in this lab: not built — the project is effectively unmaintained and had no readily installable package in this environment.**

## What it is

wkhtmltopdf is a command-line tool that renders HTML to PDF using a
patched, embedded build of Qt WebKit — for a long time the default
"just convert HTML to a PDF" tool in the Python/Ruby/PHP world.
`pdfkit` (Python) and `wicked_pdf` (Ruby) are thin wrappers that shell out
to the `wkhtmltopdf` binary.

## Why it's not built here

Two independent problems, not one:

1. **The project is effectively unmaintained.** The last tagged release
   was in 2020, [the GitHub repo has been effectively archived/inactive for
   years](https://github.com/wkhtmltopdf/wkhtmltopdf), and the maintainers'
   own README has, at various points, recommended evaluating alternatives.
   Its WebKit engine is many years stale, so modern CSS (flexbox, grid,
   custom properties, modern `@page` support) renders inconsistently or
   not at all — a real regression compared to every browser-based tool in
   this lab (Puppeteer, Playwright) or WeasyPrint's actively maintained engine.
2. **No readily installable package in this environment.** It's no longer
   in Homebrew core (`brew install wkhtmltopdf` fails — no such formula or
   cask), so getting it running on this machine would mean manually
   downloading a `.pkg` installer from the project's GitHub releases page
   and doing a system-level install outside any package manager — a much
   heavier, less reproducible step than everything else in this lab, for a
   tool this lab can't otherwise recommend using going forward.

## How you'd actually use it (if installed)

```bash
pip install pdfkit
# plus the wkhtmltopdf binary itself, installed separately and on PATH
```
```python
import pdfkit
pdfkit.from_file("report.html", "output.pdf")
```

## Best for

Legacy codebases that already depend on it and haven't had a reason to
migrate. Not recommended for new projects in this lab's assessment —
WeasyPrint (`../weasyprint`) is the actively maintained, better-CSS-support
Python alternative, and Puppeteer/Playwright (`../puppeteer`,
`../playwright-pdf`) are the better choice when you specifically want a
real, current browser engine.

## Limitations

- Stale rendering engine — modern CSS support is genuinely worse than
  every other HTML-to-PDF option in this lab.
- Maintenance status alone is reason enough to default elsewhere for new work.
- No straightforward package-manager install path anymore on macOS, which
  is itself a practical signal about the project's trajectory.
