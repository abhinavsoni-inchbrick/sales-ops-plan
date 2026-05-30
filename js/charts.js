/* Chart.js preview mocks for meeting presentation */
window.SalesOpsCharts = (function () {
  const palette = {
    cyan: "#22d3ee",
    blue: "#3b82f6",
    violet: "#a78bfa",
    pink: "#f472b6",
    green: "#34d399",
    amber: "#fbbf24",
    red: "#f87171",
    slate: "#64748b",
  };

  const agents = ["Priya", "Rahul", "Anita", "Vikram", "Sneha"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  Chart.defaults.color = "#cbd5e1";
  Chart.defaults.borderColor = "rgba(255,255,255,0.08)";
  Chart.defaults.font.family = "Inter, system-ui, sans-serif";

  function destroyExisting(canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  function baseOptions(extra = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#e2e8f0", boxWidth: 12 } },
      },
      scales: extra.scales,
      ...extra,
    };
  }

  function render(canvas, previewKey) {
    if (!canvas || typeof Chart === "undefined") return;
    destroyExisting(canvas);
    const fn = renderers[previewKey] || renderers.default;
    fn(canvas);
  }

  const renderers = {
    default(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: months,
          datasets: [{ label: "Sample metric", data: [42, 55, 48, 61, 58], backgroundColor: palette.cyan }],
        },
        options: baseOptions(),
      });
    },

    hourly(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `${8 + i}:00`),
          datasets: [
            { label: "Dials", data: [12, 28, 45, 62, 78, 85, 72, 58, 40, 22, 10, 5], backgroundColor: palette.blue },
            { label: "Connects", data: [2, 6, 12, 18, 22, 24, 20, 15, 9, 4, 2, 1], backgroundColor: palette.green },
          ],
        },
        options: baseOptions({ scales: { y: { beginAtZero: true } } }),
      });
    },

    funnel3(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            { label: "Dials", data: [4200, 4800, 5100, 4600, 4900], backgroundColor: palette.blue },
            { label: "Connects", data: [980, 1020, 1080, 940, 1010], backgroundColor: palette.cyan },
            { label: "Prospects", data: [210, 195, 240, 180, 225], backgroundColor: palette.green },
          ],
        },
        options: baseOptions({ scales: { y: { beginAtZero: true } } }),
      });
    },

    goldenHour(canvas) {
      const hours = ["9", "10", "11", "12", "14", "15", "16", "17", "18"];
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: weekdays.flatMap((d) => hours.map((h) => `${d} ${h}h`)),
          datasets: [{
            label: "Connect rate %",
            data: weekdays.flatMap(() => hours.map(() => Math.round(8 + Math.random() * 28))),
            backgroundColor: (ctx) => {
              const v = ctx.raw || 0;
              if (v > 28) return palette.green;
              if (v > 18) return palette.amber;
              return palette.slate;
            },
          }],
        },
        options: baseOptions({ indexAxis: "y", scales: { x: { max: 40 } } }),
      });
    },

    listDecay(canvas) {
      new Chart(canvas, {
        type: "line",
        data: {
          labels: ["W1", "W2", "W3", "W4", "W5"],
          datasets: [
            { label: "Junk %", data: [12, 18, 28, 38, 45], borderColor: palette.red, tension: 0.3 },
            { label: "Unanswered %", data: [35, 32, 30, 28, 26], borderColor: palette.amber, tension: 0.3 },
          ],
        },
        options: baseOptions(),
      });
    },

    speedDial(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: agents,
          datasets: [{ label: "Avg minutes to first dial", data: [8, 22, 5, 35, 14], backgroundColor: [palette.green, palette.amber, palette.green, palette.red, palette.cyan] }],
        },
        options: baseOptions({ indexAxis: "y" }),
      });
    },

    attemptConnect(canvas) {
      new Chart(canvas, {
        type: "line",
        data: {
          labels: ["Call 1", "Call 2", "Call 3", "Call 4", "Call 5", "Call 6", "Call 7", "Call 8"],
          datasets: [{ label: "Connect rate %", data: [24, 18, 12, 9, 6, 4, 3, 2], borderColor: palette.cyan, backgroundColor: "rgba(34,211,238,0.15)", fill: true, tension: 0.35 }],
        },
        options: baseOptions({ scales: { y: { max: 30 } } }),
      });
    },

    dailyTarget(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: agents,
          datasets: [
            { label: "Done", data: [62, 38, 71, 45, 55], backgroundColor: palette.green },
            { label: "Target", data: [100, 100, 100, 100, 100], backgroundColor: "rgba(148,163,184,0.25)" },
          ],
        },
        options: baseOptions({ scales: { x: { stacked: false }, y: { max: 120 } } }),
      });
    },

    weekday(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: weekdays,
          datasets: [
            { label: "Avg dials", data: [88, 92, 95, 90, 72, 28, 12], backgroundColor: palette.blue },
            { label: "Connect %", data: [22, 24, 25, 23, 18, 12, 8], backgroundColor: palette.green, yAxisID: "y1" },
          ],
        },
        options: baseOptions({
          scales: {
            y: { beginAtZero: true },
            y1: { position: "right", grid: { drawOnChartArea: false }, max: 30 },
          },
        }),
      });
    },

    redialGap(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: agents,
          datasets: [{ label: "Avg hours between attempt 1 & 2", data: [5.2, 1.1, 4.8, 0.6, 3.9], backgroundColor: [palette.amber, palette.red, palette.green, palette.red, palette.cyan] }],
        },
        options: baseOptions(),
      });
    },

    cityTime(canvas) {
      renderers.goldenHour(canvas);
    },

    effortDonut(canvas) {
      new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: ["Prospect", "Recalling", "Junk", "Unknown", "Unanswered"],
          datasets: [{ data: [28, 18, 22, 14, 18], backgroundColor: [palette.green, palette.cyan, palette.red, palette.amber, palette.slate] }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" } } },
      });
    },

    connectKpi(canvas) {
      new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: ["Connected", "Unanswered"],
          datasets: [{ data: [34, 66], backgroundColor: [palette.green, palette.slate] }],
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom" } } },
      });
    },

    pipelineWaterfall(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            { label: "Prospects", data: [180, 210, 195, 240, 225], backgroundColor: palette.violet },
            { label: "Meet Planned", data: [72, 88, 80, 102, 95], backgroundColor: palette.cyan },
            { label: "Meet Done", data: [48, 62, 55, 78, 71], backgroundColor: palette.green },
          ],
        },
        options: baseOptions(),
      });
    },

    agentFunnel(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: agents.slice(0, 4),
          datasets: [
            { label: "Prospect", data: [42, 38, 55, 28], backgroundColor: palette.violet },
            { label: "Meet Planned", data: [18, 12, 30, 10], backgroundColor: palette.cyan },
            { label: "Meet Done", data: [12, 8, 22, 6], backgroundColor: palette.green },
          ],
        },
        options: baseOptions(),
      });
    },

    leaderboard(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: agents,
          datasets: [{ label: "Dials per Prospect", data: [18, 24, 14, 32, 16], backgroundColor: palette.green }],
        },
        options: baseOptions({ indexAxis: "y" }),
      });
    },

    junkProspect(canvas) {
      new Chart(canvas, {
        type: "line",
        data: {
          labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
          datasets: [
            { label: "New Prospects", data: [42, 48, 52, 55, 58, 61], borderColor: palette.green, tension: 0.3 },
            { label: "New Junk", data: [28, 30, 35, 42, 48, 52], borderColor: palette.red, tension: 0.3 },
          ],
        },
        options: baseOptions(),
      });
    },

    fullJourney(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: ["May cohort"],
          datasets: [
            { label: "Dials", data: [4900], backgroundColor: palette.blue },
            { label: "Connects", data: [1010], backgroundColor: palette.cyan },
            { label: "Prospects", data: [225], backgroundColor: palette.violet },
            { label: "Meet Done", data: [71], backgroundColor: palette.green },
            { label: "Deal Won", data: [18], backgroundColor: palette.amber },
          ],
        },
        options: baseOptions({ indexAxis: "y" }),
      });
    },

    healthScore(canvas) {
      new Chart(canvas, {
        type: "line",
        data: {
          labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
          datasets: [{ label: "Pipeline Health", data: [72, 68, 74, 61, 58, 65], borderColor: palette.green, backgroundColor: "rgba(52,211,153,0.2)", fill: true, tension: 0.35 }],
        },
        options: baseOptions({ scales: { y: { min: 0, max: 100 } } }),
      });
    },

    effortResult(canvas) {
      new Chart(canvas, {
        type: "scatter",
        data: {
          datasets: [{
            label: "Agents",
            data: [
              { x: 420, y: 12, label: "Priya" },
              { x: 510, y: 4, label: "Rahul" },
              { x: 380, y: 18, label: "Anita" },
              { x: 620, y: 6, label: "Vikram" },
              { x: 450, y: 14, label: "Sneha" },
            ],
            backgroundColor: palette.pink,
          }],
        },
        options: baseOptions({
          scales: {
            x: { title: { display: true, text: "Total dials" } },
            y: { title: { display: true, text: "Meetings done" } },
          },
        }),
      });
    },

    blocked(canvas) {
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: ["Blocked"],
          datasets: [{ label: "Awaiting integration", data: [0], backgroundColor: palette.slate }],
        },
        options: baseOptions(),
      });
    },
  };

  // Aliases for previews sharing similar shapes
  ["cityStack", "topNumbers", "gaps", "duration", "agentCompare", "junkRate", "recalling", "prospectCount", "meetPlanned", "meetDone", "stuck", "tagGap", "sleeping", "velocity", "recallAge", "cityConversion", "showUp", "concentration", "histogram", "timeToClose", "noShowCity", "postMeet", "cohort", "waVsCall", "callsBefore", "followUps", "scatter"].forEach((key) => {
    if (!renderers[key]) renderers[key] = renderers.default;
  });

  return { render, palette };
})();
