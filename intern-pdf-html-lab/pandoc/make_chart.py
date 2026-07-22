import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
csat = [4.21, 4.18, 4.30, 4.35, 4.41, 4.47]

fig, ax = plt.subplots(figsize=(6, 2.6), dpi=150)
ax.plot(months, csat, marker="o", color="#1d4ed8", linewidth=2.2)
ax.set_ylim(3.8, 5.0)
ax.set_ylabel("CSAT (out of 5)", fontsize=9)
ax.tick_params(labelsize=8)
for spine in ["top", "right"]:
    ax.spines[spine].set_visible(False)
fig.tight_layout()
fig.savefig("csat_chart.png")
print("Wrote csat_chart.png")
