# Typst — modern markup-based typesetting (beyond the starter list)

**Category:** Document-pipeline / native typesetting · **From starter list:** no — one of this lab's own additional finds, and arguably the most different tool in the whole lab: not HTML/CSS, not a Python drawing API, its own markup language with its own compiler.
**License:** Apache-2.0 · **Language:** Typst (its own markup + scripting language); the compiler is a single Rust binary

Typst is a from-scratch alternative to LaTeX: a markup language with real
programming constructs (functions, loops, conditionals — `report.typ`
defines two reusable functions, `callout()` and `bar-chart()`) that
compiles directly to PDF via a single static binary, no TeX distribution
(multiple GB) required. Where `../pandoc` gets good default styling from
plain Markdown with near-zero setup, this file shows what's possible
writing native Typst markup directly: a custom page template function,
real math typesetting, and native footnotes.

## Showcase features (8 of the required 4+)

1. **TOC** — `#outline()`, one line, auto-populated with correct page numbers.
2. **Branded header/footer + page numbers** — a template function (`report()`) sets a `context`-driven header/footer showing the report title and "Page X of Y" (`counter(page).final()` for the true total), suppressed on the cover.
3. **Multi-page** — 4 pages, content reflows automatically; nothing is manually paginated.
4. **Styled data table with caption** — `#table()` wrapped in `#figure()` for automatic "Table 1: ..." numbering, referenced in text via `@tbl-results`.
5. **Chart/graph** — a fully vector bar chart built from Typst's own `rect()`/`grid()` primitives, no chart library, no image file.
6. **Callout boxes** — a reusable `callout()` function (two color variants used).
7. **Native math typesetting** — a real display equation (`$cost(b, w, l) = ...$`) with proper glyph spacing/sizing, something none of the other 21 tools in this lab do natively.
8. **Footnotes + custom fonts** — native `#footnote[...]`, and Fraunces/Inter/IBM Plex Mono embedded via `--font-path fonts`.

## A bug found and fixed while building this

The bar chart originally split **mid-row** across a page boundary: two
bars ("Filter", "Agg" — coincidentally the *tallest* two, which made the
bug more visually confusing, not less) silently jumped to the next page
while the other three stayed on the page before, orphaning value labels
from their bars. The fix is Typst's direct equivalent of CSS's
`break-inside: avoid`: wrapping the whole chart in `block(breakable:
false)[...]`. See the comment directly above `bar-chart()` in `report.typ`.

## How to run

```bash
brew install typst   # or your OS's package manager
typst compile report.typ sample-output/query-engine-report.pdf --font-path fonts
```

## Install effort

Low — a single binary install, no LaTeX distribution, no Python/Node
runtime needed for the compiler itself.

## Best for

STEM/technical reports with real math, academic-style documents,
long-form structured reports (specs, whitepapers) where you want LaTeX-
quality typesetting without LaTeX's install size or notoriously cryptic
error messages — Typst's error messages point at the actual line/column
and explain the problem in plain English.

## Limitations

- Its own markup language is one more thing to learn — not HTML/CSS, not
  a general-purpose language's drawing API, a dedicated syntax with its
  own learning curve (functions, content blocks, `context` for
  layout-dependent values).
- Smaller ecosystem than LaTeX (fewer battle-tested packages for exotic
  document types), though growing quickly and sufficient for everything
  shown here without installing a single external package.
- Charting/drawing is manual (as shown) — there's a community `cetz`
  package for more elaborate diagrams/plots, not used here to keep this
  example's dependencies to "one binary, no package registry fetch."
