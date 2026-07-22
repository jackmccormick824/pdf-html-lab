"""
ReportLab: the classic Python PDF library. Two layers are shown here —
Platypus (the high-level "flowable" layout engine: Paragraph, Table,
Image, PageBreak, TableOfContents) for content, and the low-level Canvas
(via onPage callbacks) for the branded header/footer band and page numbers
that repeat on every page. A matplotlib chart is generated as a PNG and
embedded as an Image flowable — the standard way to get real charts into
a ReportLab document.

The TOC needs a *second* pass (doc.multiBuild instead of doc.build) because
page numbers for each heading aren't known until the whole document has
been laid out once already.
"""
import io
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
    TableStyle, Image, PageBreak,
)
from reportlab.platypus.tableofcontents import TableOfContents


class ReportDocTemplate(BaseDocTemplate):
    """Notifies the TOC of each H1 heading's resolved page number — the
    standard ReportLab pattern for a working, auto-numbered TOC. Without
    this hook, TableOfContents() renders with no entries at all."""

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name == "H1":
            text = flowable.getPlainText()
            self.notify("TOCEntry", (0, text, self.page))

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "sample-output")
os.makedirs(OUT_DIR, exist_ok=True)
OUT_PATH = os.path.join(OUT_DIR, "water-quality-report.pdf")

ACCENT = colors.HexColor("#0b5f6b")
ACCENT_LIGHT = colors.HexColor("#e4f1f2")
INK = colors.HexColor("#1a1a1a")
MUTED = colors.HexColor("#666666")

pdfmetrics.registerFont(TTFont("PTSerif", os.path.join(HERE, "fonts/PTSerif-Regular.ttf")))
pdfmetrics.registerFont(TTFont("PTSerif-Bold", os.path.join(HERE, "fonts/PTSerif-Bold.ttf")))
pdfmetrics.registerFont(TTFont("PTSans-Bold", os.path.join(HERE, "fonts/PTSans-Bold.ttf")))

# NOTE: ParagraphStyle defaults `leading` to a flat 12pt regardless of
# fontSize — every style below sets leading explicitly (~1.25-1.4x
# fontSize) to avoid lines/paragraphs overlapping the next flowable.
styles = {
    "Title": ParagraphStyle("Title", fontName="PTSerif-Bold", fontSize=24, leading=30, textColor=INK, spaceAfter=6),
    "Subtitle": ParagraphStyle("Subtitle", fontName="PTSerif", fontSize=12, leading=16, textColor=MUTED, spaceAfter=24),
    "H1": ParagraphStyle("H1", fontName="PTSans-Bold", fontSize=15, leading=19, textColor=ACCENT, spaceBefore=18, spaceAfter=8,
                          borderColor=ACCENT, borderWidth=0, keepWithNext=True),
    "Body": ParagraphStyle("Body", fontName="PTSerif", fontSize=10.5, leading=15, textColor=INK,
                            alignment=TA_JUSTIFY, spaceAfter=8),
    "TOCHeading": ParagraphStyle("TOCHeading", fontName="PTSans-Bold", fontSize=16, leading=20, textColor=INK, spaceAfter=12),
    "Callout": ParagraphStyle("Callout", fontName="PTSerif", fontSize=9.5, leading=13.5, textColor=INK),
    "CalloutTitle": ParagraphStyle("CalloutTitle", fontName="PTSans-Bold", fontSize=9.5, leading=13, textColor=ACCENT, spaceAfter=2),
}


def make_chart_image():
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    lead = [1.2, 1.4, 1.1, 0.9, 0.8, 0.7]
    limit = [15] * 6
    turbidity = [0.31, 0.28, 0.35, 0.22, 0.19, 0.18]

    fig, ax1 = plt.subplots(figsize=(6.4, 2.6), dpi=200)
    ax1.plot(months, lead, marker="o", color="#0b5f6b", label="Lead (ppb)")
    ax1.set_ylabel("Lead (ppb)", color="#0b5f6b", fontsize=9)
    ax1.tick_params(axis="y", labelcolor="#0b5f6b", labelsize=8)
    ax1.tick_params(axis="x", labelsize=8)
    ax1.axhline(15, color="#c0392b", linestyle="--", linewidth=1, label="EPA action level")
    ax1.set_ylim(0, 18)
    for spine in ["top", "right"]:
        ax1.spines[spine].set_visible(False)
    ax1.legend(fontsize=7, loc="upper right", frameon=False)
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    return buf


def callout(title, text, bg=ACCENT_LIGHT, bar=ACCENT):
    inner = Table(
        [[Paragraph(title, styles["CalloutTitle"])], [Paragraph(text, styles["Callout"])]],
        colWidths=[440],
    )
    inner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (0, 0), 10),
        ("BOTTOMPADDING", (0, -1), (0, -1), 10),
        ("TOPPADDING", (0, 1), (0, 1), 0),
        ("LINEBEFORE", (0, 0), (0, -1), 4, bar),
    ]))
    return inner


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    # Running header band
    canvas.setFillColor(ACCENT)
    canvas.rect(0, height - 14 * mm, width, 14 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("PTSans-Bold", 10)
    canvas.drawString(20 * mm, height - 9.5 * mm, "City of Ashgrove — Water Utility")
    canvas.setFont("PTSerif", 9)
    canvas.drawRightString(width - 20 * mm, height - 9.5 * mm, "Annual Water Quality Report · FY2026")

    # Footer with page number
    canvas.setFillColor(MUTED)
    canvas.setFont("PTSerif", 8)
    canvas.drawString(20 * mm, 12 * mm, "Confidential draft — for board review")
    canvas.drawRightString(width - 20 * mm, 12 * mm, f"Page {doc.page}")
    canvas.restoreState()


def main():
    doc = ReportDocTemplate(OUT_PATH, pagesize=A4,
                             topMargin=22 * mm, bottomMargin=20 * mm,
                             leftMargin=20 * mm, rightMargin=20 * mm,
                             title="Annual Water Quality Report — City of Ashgrove")

    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])

    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle("TOCLevel0", fontName="PTSerif", fontSize=10.5, leading=16, leftIndent=0),
    ]

    story = []
    story.append(Spacer(1, 40))
    story.append(Paragraph("Annual Water Quality Report", styles["Title"]))
    story.append(Paragraph("City of Ashgrove Water Utility · Fiscal Year 2026", styles["Subtitle"]))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Contents", styles["TOCHeading"]))
    story.append(toc)
    story.append(PageBreak())

    def heading(text, level=0):
        story.append(Paragraph(text, styles["H1"]))

    heading("1. Summary")
    story.append(Paragraph(
        "All 14 monitoring sites across the Ashgrove distribution system remained below EPA "
        "action levels for lead and copper throughout FY2026. Average lead concentration fell "
        "for the fourth consecutive year, continuing the trend since the 2022 service-line "
        "replacement program began. Turbidity readings were stable and well within the "
        "0.3 NTU treatment technique limit for 95% of monthly samples.",
        styles["Body"]))
    story.append(callout(
        "Lead levels at a four-year low",
        "Average lead concentration across all sites dropped to 0.7 ppb in June, down from "
        "1.4 ppb in January — well under the EPA action level of 15 ppb.",
    ))

    heading("2. Lead &amp; Turbidity Trends")
    story.append(Image(make_chart_image(), width=440, height=178))

    heading("3. Monitoring Site Results")
    table_data = [["Site", "District", "Lead (ppb)", "Copper (ppm)", "Status"]]
    rows = [
        ["Site 01 — Elm & 3rd", "Downtown", "0.6", "0.21", "Compliant"],
        ["Site 04 — Riverside Park", "West End", "0.9", "0.34", "Compliant"],
        ["Site 07 — Maple Heights", "North Hills", "1.8", "0.42", "Compliant"],
        ["Site 09 — Old Mill Rd", "West End", "2.4", "0.51", "Watch"],
        ["Site 12 — Harbor District", "Downtown", "0.5", "0.19", "Compliant"],
        ["Site 14 — Cedar Grove", "North Hills", "0.7", "0.28", "Compliant"],
    ]
    table_data += rows
    t = Table(table_data, colWidths=[130, 90, 75, 80, 75])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "PTSans-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "PTSerif"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ACCENT_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cccccc")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))
    story.append(callout(
        "Old Mill Rd site flagged for follow-up",
        "Site 09 has trended upward for two consecutive quarters (1.6 to 2.4 ppb). Still "
        "well under the action level, but Operations has scheduled an out-of-cycle service "
        "line inspection for early Q3.",
        bg=colors.HexColor("#fdf1ea"), bar=colors.HexColor("#b45309"),
    ))

    heading("4. Next Steps")
    story.append(Paragraph(
        "The utility will complete the final 6 service line replacements under the 2022 program "
        "by September 2026, closing out the program two months ahead of the original schedule. "
        "Routine quarterly sampling continues at all 14 sites, with the Old Mill Rd site added to "
        "monthly (rather than quarterly) monitoring pending the Q3 inspection results.",
        styles["Body"]))

    doc.multiBuild(story)
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
