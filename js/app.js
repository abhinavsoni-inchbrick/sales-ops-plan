/* Page bootstrappers */
(function () {
  const D = window.SalesOpsData;
  const Dec = window.SalesOpsDecisions;

  function initIndex() {
    const countsEl = document.getElementById("hero-counts");
    if (countsEl) {
      const refresh = () => {
        const c = Dec.getCounts();
        countsEl.innerHTML = `
          <span class="hero-stat build">${c.build} Build</span>
          <span class="hero-stat next">${c.next} Next Phase</span>
          <span class="hero-stat skip">${c.skip} Skip</span>
          <span class="hero-stat discuss">${c.discuss} Discuss</span>
          <span class="hero-stat pending">${c.pending} Pending</span>
        `;
      };
      refresh();
      window.addEventListener("salesops:decisions-changed", refresh);
    }

    [1, 2, 3].forEach((n) => {
      const grid = document.getElementById(`grid-section-${n}`);
      if (grid) Dec.renderTileGrid(grid, D.getSectionCharts(n, "new"));
    });

    const tracker = document.getElementById("decision-tracker-root");
    if (tracker) Dec.renderTrackerTable(tracker);

    const startBtn = document.getElementById("start-presentation");
    if (startBtn) {
      const first = D.decisionIdeas[0];
      if (first) startBtn.href = D.chartPageUrl(first.id);
    }
  }

  function initSection() {
    const sectionNum = Number(document.body.dataset.section);
    if (!sectionNum) return;

    const liveGrid = document.getElementById("grid-live");
    const newGrid = document.getElementById("grid-new");
    if (liveGrid) Dec.renderTileGrid(liveGrid, D.getSectionCharts(sectionNum, "live"));
    if (newGrid) Dec.renderTileGrid(newGrid, D.getSectionCharts(sectionNum, "new"));

    const blockedGrid = document.getElementById("grid-blocked");
    if (blockedGrid) {
      Dec.renderTileGrid(
        blockedGrid,
        D.getSectionCharts(sectionNum).filter((c) => c.status === "blocked" || c.status === "derivable")
      );
    }
  }

  function initChartPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const chart = D.getChart(id);

    if (!chart) {
      document.getElementById("chart-root").innerHTML =
        '<div class="empty-state"><h2>Chart not found</h2><a href="index.html">Back to overview</a></div>';
      return;
    }

    const sec = D.sections[chart.section];
    document.body.classList.add(sec.theme);
    document.title = `${chart.id} — ${chart.title}`;

    const { prev, next } = D.getPrevNext(id);
    const entry = Dec.getEntry(id);

    document.getElementById("chart-root").innerHTML = `
      <header class="chart-detail-header ${sec.theme}">
        <div class="container">
          <nav class="chart-breadcrumb">
            <a href="index.html">Home</a>
            <span>/</span>
            <a href="${sec.page}">Section ${chart.section}</a>
            <span>/</span>
            <span>${chart.id}</span>
          </nav>
          <div class="chart-detail-hero">
            <div>
              <p class="eyebrow">${sec.emoji} Section ${chart.section} · ${chart.status === "new" ? "New idea" : chart.status}</p>
              <h1><span class="chart-emoji">${chart.emoji}</span> ${chart.title}</h1>
              <div class="tag-row">
                <span class="badge badge-cadence">⏱ ${chart.cadence}</span>
                <span class="badge badge-${chart.complexity}">🔧 ${chart.complexity}</span>
                ${entry.decision ? `<span class="badge badge-decision decision-${entry.decision}">${Dec.decisionLabel(entry.decision)}</span>` : ""}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="container chart-detail-main">
        <div class="detail-grid">
          <section class="preview-panel">
            <h2>Chart preview</h2>
            <p class="note">Illustrative sample data for the meeting — real dashboard will use RunoTrackingEvent & SalesAgentDaySnapshot.</p>
            <div class="chart-canvas-wrap">
              <canvas id="preview-canvas"></canvas>
            </div>
          </section>

          <section class="info-panel">
            ${chart.question ? `<div class="info-block"><h3>Question it answers</h3><p>${chart.question}</p></div>` : `<div class="info-block"><h3>What it shows</h3><p>Live metric from the Sales Ops dashboard.</p></div>`}
            ${chart.insight ? `<div class="info-block insight"><h3>Insight</h3><p>${chart.insight}</p></div>` : ""}
            ${chart.action ? `<div class="info-block action"><h3>Manager action</h3><p>${chart.action}</p></div>` : ""}
            <div id="decision-slot"></div>
          </section>
        </div>

        <nav class="chart-nav-bar">
          ${prev ? `<a class="nav-btn nav-prev" href="${D.chartPageUrl(prev)}">← Previous</a>` : '<span class="nav-btn nav-disabled">← Previous</span>'}
          <a class="nav-btn nav-home" href="${sec.page}">Section overview</a>
          ${next ? `<a class="nav-btn nav-next primary-nav" href="${D.chartPageUrl(next)}">Next chart →</a>` : '<span class="nav-btn nav-disabled">Next chart →</span>'}
        </nav>
      </main>
    `;

    const canvas = document.getElementById("preview-canvas");
    if (canvas && window.SalesOpsCharts) {
      window.SalesOpsCharts.render(canvas, chart.preview || "default");
    }

    const decisionSlot = document.getElementById("decision-slot");
    if (decisionSlot && chart.status === "new") {
      Dec.renderDecisionPanel(decisionSlot, id);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" && next) window.location.href = D.chartPageUrl(next);
      if (e.key === "ArrowLeft" && prev) window.location.href = D.chartPageUrl(prev);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === "index") initIndex();
    else if (page === "section") initSection();
    else if (page === "chart") initChartPage();
  });
})();
