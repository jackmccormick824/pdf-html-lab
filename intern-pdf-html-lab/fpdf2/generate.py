"""
fpdf2: a lightweight, pure-Python PDF library (no C extensions, no
system dependency at all — the lightest install in this entire lab).
Subclassing FPDF and overriding header()/footer() is the standard fpdf2
pattern for repeating branded chrome and automatic page numbers; content
that overflows a page triggers an automatic page break on its own
(set_auto_page_break), so the session table below doesn't need any manual
pagination logic even though it runs past a single page.
"""
import os

from fpdf import FPDF

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "sample-output")
os.makedirs(OUT_DIR, exist_ok=True)

ACCENT = (194, 65, 12)   # burnt orange
INK = (26, 26, 26)
MUTED = (110, 110, 110)
LIGHT = (253, 237, 224)


class ConferencePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return  # badge page has its own full-bleed design, no chrome
        self.set_font("Noto", "B", 9)
        self.set_text_color(*MUTED)
        self.cell(0, 8, "TechConf 2026 — Attendee Materials", align="L")
        self.set_font("Noto", "", 9)
        self.cell(0, 8, "Austin Convention Center · Sept 14-16", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.6)
        self.line(15, 20, 195, 20)
        self.ln(6)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-15)
        self.set_font("Noto", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 10, f"Page {self.page_no()} of {{nb}}", align="C")


def callout(pdf, title, body, bg=LIGHT, bar=ACCENT):
    x, y = pdf.get_x(), pdf.get_y()
    pdf.set_fill_color(*bar)
    pdf.rect(x, y, 1.5, 18, style="F")
    pdf.set_fill_color(*bg)
    pdf.rect(x + 1.5, y, 180 - 1.5, 18, style="F")
    pdf.set_xy(x + 6, y + 2.5)
    pdf.set_font("Noto", "B", 9.5)
    pdf.set_text_color(*INK)
    pdf.cell(170, 5, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(x + 6)
    pdf.set_font("Noto", "", 9)
    pdf.multi_cell(168, 4.6, body)
    pdf.set_xy(x, y + 20)


def main():
    pdf = ConferencePDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_font("Noto", "", os.path.join(HERE, "fonts/NotoSans.ttf"))
    pdf.add_font("Noto", "B", os.path.join(HERE, "fonts/NotoSans.ttf"))
    pdf.add_font("Mono", "", os.path.join(HERE, "fonts/JetBrainsMono.ttf"))
    pdf.alias_nb_pages()  # lets {nb} in footer() resolve to the real total

    # ---------------- Page 1: badge (unicode-heavy, custom fonts) ----------------
    pdf.add_page()
    pdf.set_fill_color(*ACCENT)
    pdf.rect(0, 0, 210, 70, style="F")
    pdf.set_xy(20, 18)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Noto", "B", 22)
    pdf.cell(0, 12, "TechConf 2026", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(20)
    pdf.set_font("Noto", "", 12)
    pdf.cell(0, 8, "Attendee Registration Confirmation", new_x="LMARGIN", new_y="NEXT")

    pdf.set_xy(20, 90)
    pdf.set_text_color(*MUTED)
    pdf.set_font("Noto", "", 10)
    pdf.cell(0, 6, "ATTENDEE", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(20)
    pdf.set_text_color(*INK)
    pdf.set_font("Noto", "B", 18)
    pdf.cell(0, 10, "Priya Natarajan", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(20)
    pdf.set_font("Noto", "", 11)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 7, "Senior Platform Engineer · Nimbus Analytics", new_x="LMARGIN", new_y="NEXT")

    pdf.set_xy(20, 122)
    pdf.set_font("Mono", "", 11)
    pdf.set_text_color(*INK)
    pdf.cell(0, 7, "Badge ID: TC26-08421 — Payment confirmed — Workshop pass included",
              new_x="LMARGIN", new_y="NEXT")

    callout(
        pdf,
        "You're all set for September 14-16",
        "Bring this confirmation (printed or on your phone) to badge pickup. "
        "Pickup opens at 08:00 on Day 1 in the North Lobby — look for the "
        "orange TechConf banners. Your workshop pass covers one half-day "
        "workshop of your choice on Day 2; seats are first-come, first-served.",
    )
    pdf.ln(4)
    pdf.set_x(20)
    pdf.set_font("Noto", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(
        170, 4.6,
        "Unicode check: café, naïve, über, Zürich, €125 day pass, £, ¥ — all "
        "rendered from the same embedded Noto Sans instance, no per-script "
        "font-switching. (Full CJK/emoji coverage needs the separate "
        "Noto Sans CJK / Noto Color Emoji font files — not included in the "
        "base Latin/Greek/Cyrillic instance downloaded here; fpdf2 warns "
        "loudly about missing glyphs at build time rather than silently "
        "showing blank boxes, which is how this gap was caught.)",
    )

    # ---------------- Page 2+: session schedule (auto page-break) ----------------
    pdf.add_page()
    pdf.set_font("Noto", "B", 14)
    pdf.set_text_color(*INK)
    pdf.cell(0, 10, "Session Schedule", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    col_widths = [22, 78, 45, 35]
    headers = ["Time", "Session", "Speaker", "Track"]
    sessions = [
        ["09:00", "Opening Keynote: The Next Decade of Data Infra", "M. Chen", "Keynote"],
        ["10:15", "Building Reliable Ingestion Pipelines at Scale", "R. Okafor", "Platform"],
        ["10:15", "A Practical Guide to Query Optimization", "S. Lindqvist", "Data"],
        ["11:30", "Zero-Downtime Schema Migrations", "P. Natarajan", "Platform"],
        ["11:30", "Designing Dashboards People Actually Read", "J. Alvarez", "Product"],
        ["13:30", "Workshop: Streaming ETL from Scratch", "R. Okafor", "Workshop"],
        ["13:30", "Workshop: Building a Report-Generation Pipeline", "T. Brandt", "Workshop"],
        ["15:00", "Cost Optimization War Stories", "K. Nakamura", "Platform"],
        ["15:00", "From Notebook to Production: An ML Pipeline Story", "A. Osei", "Data"],
        ["16:15", "Panel: What We Got Wrong About Data Mesh", "Multiple", "Keynote"],
        ["09:00", "Day 2 Keynote: Lessons from a Decade of Outages", "K. Nakamura", "Keynote"],
        ["10:15", "Rate Limiting That Doesn't Make Everyone Angry", "S. Lindqvist", "Platform"],
        ["10:15", "Data Contracts in Practice", "J. Alvarez", "Data"],
        ["11:30", "Closing Remarks & What's Next", "M. Chen", "Keynote"],
    ]

    def draw_table_header():
        pdf.set_font("Noto", "B", 9)
        pdf.set_fill_color(*ACCENT)
        pdf.set_text_color(255, 255, 255)
        for w, h in zip(col_widths, headers):
            pdf.cell(w, 8, h, border=0, fill=True)
        pdf.ln(8)

    draw_table_header()
    pdf.set_font("Noto", "", 9)
    pdf.set_text_color(*INK)
    for i, row in enumerate(sessions):
        if pdf.get_y() > 265:  # leave room before auto-break, then redraw header
            pdf.add_page()
            draw_table_header()
            pdf.set_font("Noto", "", 9)
            pdf.set_text_color(*INK)
        pdf.set_fill_color(*LIGHT) if i % 2 else pdf.set_fill_color(255, 255, 255)
        for w, cell in zip(col_widths, row):
            pdf.cell(w, 7.5, cell, border="B", fill=True)
        pdf.ln(7.5)

    out_path = os.path.join(OUT_DIR, "techconf-registration.pdf")
    pdf.output(out_path)
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
