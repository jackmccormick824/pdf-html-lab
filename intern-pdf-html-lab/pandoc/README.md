# Pandoc — Markdown to PDF, pluggable backends (beyond the starter list)

**Category:** Document-pipeline / Markdown-to-PDF · **From starter list:** no — one of this lab's own additional finds. (It's the practical answer to the starter list's "Prince alternatives" line, in a different way than WeasyPrint/Playwright: instead of an HTML+CSS pipeline, it's a plain-text-to-PDF pipeline.)
**License:** GPL-2.0-or-later (Pandoc itself is free/open and fine for commercial use — GPL applies to the converter tool, not to documents you produce with it) · **Language:** Haskell CLI, used here from the command line

Pandoc converts Markdown (with YAML frontmatter for title/author/TOC
metadata) directly to PDF — but it has **no PDF engine of its own**; it
delegates to one of several interchangeable backends. This example uses
**Typst** (`--pdf-engine=typst`, fast, no LaTeX install needed) and was
also verified against **WeasyPrint** (`--pdf-engine=weasyprint`, reusing
this lab's `../weasyprint` install) — same Markdown source, two different
rendering engines, near-identical output. The classic backend is a LaTeX
distribution (`pdflatex`/`xelatex`), not used here because a full TeX Live
install is several gigabytes — genuinely the heaviest "system dependency"
of anything in this lab, which is exactly why it's skipped in favor of Typst.

## Showcase features (5 of the required 4+)

1. **TOC** — `toc: true` in the YAML frontmatter is the entire implementation; Pandoc + the Typst backend produce a dot-leader TOC with correct page numbers automatically.
2. **Multi-page with page numbers** — page numbers appear in the footer by default, no configuration needed.
3. **Styled data table** — a plain Markdown pipe table (`| Channel | Tickets | ... |`) renders as a properly formatted table with header rule.
4. **Chart/graph** — a matplotlib PNG referenced with standard Markdown image syntax (`![caption](file.png)`), which Pandoc automatically turns into a captioned, numbered figure ("Figure 1: ...").
5. **Callout box (as blockquote)** — Markdown `> ...` blockquotes render as indented, visually distinct quote blocks — the closest thing to a "callout" achievable without a custom template (see Limitations).

## How to run

```bash
brew install pandoc typst   # or your OS's package manager
./generate.sh               # writes sample-output/support-digest.pdf
```

## Install effort

Low, given the Typst backend — two `brew install` commands, zero
Python/Node dependencies for the conversion itself (matplotlib is only
used here to produce the chart image, not by Pandoc).

## Best for

Documentation-as-Markdown workflows — READMEs, changelogs, research notes,
release notes — where the source should stay plain, diffable, and
readable on its own (in a Git PR, on GitHub, in an editor) but you
occasionally need a polished PDF export. Also a strong fit anywhere your
content pipeline already produces Markdown (a CMS export, a static site
generator, an LLM) and you want a PDF at the end without hand-building an
HTML template.

## Limitations

- **No fine-grained visual control without a custom template.** The
  "branded header/footer," "dark/light theme," and "custom callout box"
  features other folders showcase explicitly are only reachable here via
  a custom Typst/LaTeX template (`--template=...`) — meaningfully more
  setup than everything else in this file, so this example intentionally
  stays at Pandoc's polished-but-generic default styling rather than
  half-implementing a template.
- Best fit is prose-shaped content; anything more app-like (dashboards,
  multi-column layouts, precise pixel positioning) is better served by an
  HTML/CSS pipeline (`../weasyprint`, `../puppeteer`) or native Typst (`../typst`).
- The classic/most common backend (a LaTeX engine) is a multi-gigabyte
  install — worth knowing before you commit to it as your default.
