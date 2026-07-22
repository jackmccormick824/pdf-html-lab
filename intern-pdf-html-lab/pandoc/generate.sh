#!/bin/bash
# Pandoc: converts Markdown (with YAML frontmatter for title/author/TOC
# metadata) straight to PDF. It has no PDF engine of its own — it hands
# off to one of several backends. This script uses Typst (fast, no LaTeX
# install required); a WeasyPrint pass is also shown, commented out, since
# both are already set up elsewhere in this lab.
set -euo pipefail
cd "$(dirname "$0")"

python3 make_chart.py

mkdir -p sample-output
pandoc report.md -o sample-output/support-digest.pdf --pdf-engine=typst

# Alternate backend (needs the ../weasyprint folder's venv active, plus
# DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib on macOS — see its README):
# pandoc report.md -o sample-output/support-digest-weasyprint.pdf --pdf-engine=weasyprint

echo "Wrote sample-output/support-digest.pdf"
