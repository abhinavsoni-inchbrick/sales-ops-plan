/* localStorage-backed meeting decisions — single source of truth */
window.SalesOpsDecisions = (function () {
  const { STORAGE_KEY } = window.SalesOpsData;
  const DECISIONS = ["build", "next", "skip", "discuss"];

  function loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("salesops:decisions-changed", { detail: data }));
  }

  function getEntry(chartId) {
    const all = loadAll();
    const entry = all[chartId];
    if (!entry || typeof entry !== "object") {
      return { decision: null, note: "", owner: "" };
    }
    return {
      decision: DECISIONS.includes(entry.decision) ? entry.decision : null,
      note: String(entry.note || ""),
      owner: String(entry.owner || ""),
    };
  }

  function setDecision(chartId, decision) {
    const all = loadAll();
    const current = getEntry(chartId);
    all[chartId] = {
      ...current,
      decision: decision === current.decision ? null : decision,
    };
    saveAll(all);
    return all[chartId];
  }

  function setNote(chartId, note) {
    const all = loadAll();
    const current = getEntry(chartId);
    all[chartId] = { ...current, note };
    saveAll(all);
  }

  function setOwner(chartId, owner) {
    const all = loadAll();
    const current = getEntry(chartId);
    all[chartId] = { ...current, owner };
    saveAll(all);
  }

  function getCounts() {
    const all = loadAll();
    const counts = { build: 0, next: 0, skip: 0, discuss: 0, pending: 0 };
    window.SalesOpsData.decisionIdeas.forEach((c) => {
      const d = all[c.id]?.decision;
      if (d && counts[d] !== undefined) counts[d] += 1;
      else counts.pending += 1;
    });
    return counts;
  }

  function decisionLabel(key) {
    const labels = {
      build: "Build It",
      next: "Next Phase",
      skip: "Skip",
      discuss: "Needs Discussion",
    };
    return labels[key] || "";
  }

  function decisionClass(key) {
    return key ? `decision-${key}` : "";
  }

  function renderDecisionPanel(container, chartId, options = {}) {
    if (!container) return;
    const chart = window.SalesOpsData.getChart(chartId);
    if (!chart || chart.status !== "new") {
      container.innerHTML = chart?.status === "live"
        ? '<p class="decision-hint">Already live — no build decision needed.</p>'
        : "";
      return;
    }

    const entry = getEntry(chartId);
    const showNote = options.showNote !== false;

    container.innerHTML = `
      <div class="decision-panel" data-chart-id="${chartId}">
        <p class="decision-panel-title">Meeting decision</p>
        <div class="decision-options" role="radiogroup" aria-label="Chart decision for ${chart.title}">
          ${DECISIONS.map(
            (d) => `
            <button type="button" class="decision-btn decision-btn--${d} ${entry.decision === d ? "is-selected" : ""}"
              data-decision="${d}" aria-pressed="${entry.decision === d}">
              <span class="decision-check">${entry.decision === d ? "✓" : ""}</span>
              ${decisionLabel(d)}
            </button>`
          ).join("")}
        </div>
        ${showNote ? `
        <div class="decision-meta">
          <label>Owner / note
            <input type="text" class="decision-note-input" placeholder="Who follows up?" value="${escapeHtml(entry.note || entry.owner || "")}" />
          </label>
        </div>` : ""}
      </div>
    `;

    container.querySelectorAll(".decision-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const decision = btn.dataset.decision;
        setDecision(chartId, decision);
        renderDecisionPanel(container, chartId, options);
        syncDecisionIndicators();
      });
    });

    const noteInput = container.querySelector(".decision-note-input");
    if (noteInput) {
      noteInput.addEventListener("change", () => setNote(chartId, noteInput.value.trim()));
      noteInput.addEventListener("blur", () => setNote(chartId, noteInput.value.trim()));
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function syncDecisionIndicators() {
    document.querySelectorAll("[data-chart-id]").forEach((el) => {
      const id = el.dataset.chartId;
      if (!id) return;
      const entry = getEntry(id);
      el.classList.remove("has-build", "has-next", "has-skip", "has-discuss");
      if (entry.decision) el.classList.add(`has-${entry.decision}`);
      const badge = el.querySelector(".tile-decision-badge");
      if (badge) {
        badge.textContent = entry.decision ? decisionLabel(entry.decision) : "Undecided";
        badge.className = `tile-decision-badge ${decisionClass(entry.decision)}`;
      }
    });
  }

  function renderTrackerTable(container) {
    if (!container) return;
    const ideas = window.SalesOpsData.decisionIdeas;

    container.innerHTML = `
      <div class="tracker-head">
        <div class="tracker-stats" id="tracker-stats"></div>
        <button type="button" class="ghost-button" id="clear-decisions">Reset all decisions</button>
      </div>
      <div class="tracker-table-wrap">
        <table class="tracker-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Chart</th>
              <th>Build It</th>
              <th>Next Phase</th>
              <th>Skip</th>
              <th>Needs Discussion</th>
              <th>Owner / Note</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            ${ideas
              .map((c) => {
                const e = getEntry(c.id);
                return `
              <tr data-chart-id="${c.id}" class="tracker-row ${e.decision ? `row-${e.decision}` : ""}">
                <td>${c.id}</td>
                <td><strong>${c.emoji} ${c.title}</strong></td>
                ${DECISIONS.map(
                  (d) => `
                <td class="tracker-check-cell">
                  <button type="button" class="tracker-check ${e.decision === d ? "is-checked" : ""}"
                    data-chart-id="${c.id}" data-decision="${d}" aria-label="${decisionLabel(d)} for ${c.title}"
                    aria-pressed="${e.decision === d}">
                    <span class="check-box">${e.decision === d ? "✓" : ""}</span>
                  </button>
                </td>`
                ).join("")}
                <td>
                  <input type="text" class="tracker-note" data-chart-id="${c.id}" value="${escapeHtml(e.note || "")}" placeholder="Owner / note" />
                </td>
                <td><a class="table-link" href="${window.SalesOpsData.chartPageUrl(c.id)}">Review →</a></td>
              </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll(".tracker-check").forEach((btn) => {
      btn.addEventListener("click", () => {
        setDecision(btn.dataset.chartId, btn.dataset.decision);
        renderTrackerTable(container);
        syncDecisionIndicators();
      });
    });

    container.querySelectorAll(".tracker-note").forEach((input) => {
      input.addEventListener("change", () => setNote(input.dataset.chartId, input.value.trim()));
      input.addEventListener("blur", () => setNote(input.dataset.chartId, input.value.trim()));
    });

    const statsEl = container.querySelector("#tracker-stats");
    if (statsEl) {
      const c = getCounts();
      statsEl.innerHTML = `
        <span class="stat-pill stat-build">${c.build} Build It</span>
        <span class="stat-pill stat-next">${c.next} Next Phase</span>
        <span class="stat-pill stat-skip">${c.skip} Skip</span>
        <span class="stat-pill stat-discuss">${c.discuss} Needs Discussion</span>
        <span class="stat-pill stat-pending">${c.pending} Pending</span>
      `;
    }

    const clearBtn = container.querySelector("#clear-decisions");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Clear all meeting decisions from this browser?")) {
          localStorage.removeItem(STORAGE_KEY);
          renderTrackerTable(container);
          syncDecisionIndicators();
        }
      });
    }
  }

  function renderTileGrid(container, chartList) {
    if (!container) return;
    const items = chartList || window.SalesOpsData.charts;
    container.innerHTML = items
      .map((c) => {
        const e = getEntry(c.id);
        const sec = window.SalesOpsData.sections[c.section];
        return `
        <a href="${window.SalesOpsData.chartPageUrl(c.id)}" class="chart-tile ${sec.theme} ${c.status} ${e.decision ? `has-${e.decision}` : ""}" data-chart-id="${c.id}">
          <span class="tile-id">${c.id}</span>
          <span class="tile-emoji">${c.emoji}</span>
          <span class="tile-title">${c.title}</span>
          <span class="tile-meta">
            <span class="badge badge-cadence">${c.cadence}</span>
            <span class="badge badge-${c.complexity}">${c.complexity}</span>
          </span>
          ${c.status === "new" ? `<span class="tile-decision-badge ${decisionClass(e.decision)}">${e.decision ? decisionLabel(e.decision) : "Tap to decide"}</span>` : `<span class="tile-status-badge status-${c.status}">${c.status}</span>`}
        </a>`;
      })
      .join("");
    syncDecisionIndicators();
  }

  window.addEventListener("salesops:decisions-changed", () => syncDecisionIndicators());

  return {
    DECISIONS,
    loadAll,
    getEntry,
    setDecision,
    setNote,
    setOwner,
    getCounts,
    decisionLabel,
    decisionClass,
    renderDecisionPanel,
    renderTrackerTable,
    renderTileGrid,
    syncDecisionIndicators,
  };
})();
