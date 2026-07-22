"""
WeasyPrint: a real HTML+CSS-to-PDF engine (its own layout engine, not a
headless browser) with much stronger native CSS Paged Media support than
any browser — @page margin boxes, string-set/string(), and counter(pages)
all work here with zero JavaScript, in contrast to ../paged-js (needs a JS
polyfill for the same features) and ../custom-print-css (hand-rolls what it
can, but can't do running headers or a real "of N" total).

This script first renders a matplotlib chart to SVG (to demonstrate "SVG
in HTML-to-PDF" from the brief's chart section), then converts report.html
to PDF.
"""
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "sample-output")
os.makedirs(OUT_DIR, exist_ok=True)


def make_match_chart():
    rates = [0, 1, 2, 3, 4, 5, 6]
    match = [0, 1, 2, 3, 4, 4, 4]

    fig, ax = plt.subplots(figsize=(6.2, 2.4), dpi=150)
    ax.plot(rates, rates, linestyle="--", color="#999", linewidth=1, label="Your contribution")
    ax.plot(rates, match, color="#0e5c4a", linewidth=2.5, marker="o", label="Nimbus match")
    ax.axvline(3, color="#b45309", linestyle=":", linewidth=1)
    ax.text(3.1, 0.3, "auto-enroll\nrate (3%)", fontsize=7, color="#b45309")
    ax.set_xlabel("Your contribution (%)", fontsize=8)
    ax.set_ylabel("Match (%)", fontsize=8)
    ax.tick_params(labelsize=7)
    ax.legend(fontsize=7, frameon=False, loc="upper left")
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    fig.tight_layout()

    svg_path = os.path.join(HERE, "match_chart.svg")
    fig.savefig(svg_path, format="svg")
    plt.close(fig)
    return svg_path


def main():
    make_match_chart()

    # Imported after matplotlib to avoid WeasyPrint's font/lib probing
    # delaying the (usually much faster) chart generation step above.
    from weasyprint import HTML

    html_path = os.path.join(HERE, "report.html")
    out_path = os.path.join(OUT_DIR, "employee-benefits-guide.pdf")
    HTML(html_path).write_pdf(out_path)
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
