/* Sales Ops Dashboard — chart catalog & navigation */
window.SalesOpsData = (function () {
  const STORAGE_KEY = "inchbrick-sales-ops-decisions-v2";

  const sections = {
    1: {
      id: 1,
      slug: "section1",
      title: "Dialled Calls",
      emoji: "📞",
      theme: "s1",
      subtitle: "Volume, timing, reach — is the team dialling smart or just dialling a lot?",
      page: "section1.html",
    },
    2: {
      id: 2,
      slug: "section2",
      title: "Interested Clients",
      emoji: "🔥",
      theme: "s2",
      subtitle: "After first contact — who is warm, progressing, or going cold silently",
      page: "section2.html",
    },
    3: {
      id: 3,
      slug: "section3",
      title: "Deal Pipeline",
      emoji: "🏁",
      theme: "s3",
      subtitle: "What happens after the meeting — building toward closed deals",
      page: "section3.html",
    },
  };

  const charts = [
    /* Section 1 — live */
    { id: "1.1", section: 1, status: "live", emoji: "⏰", title: "Hourly Call Distribution", cadence: "Daily", complexity: "low", chartType: "bar", preview: "hourly" },
    { id: "1.2", section: 1, status: "live", emoji: "🏙️", title: "City-Wise Distribution", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "cityStack" },
    { id: "1.3", section: 1, status: "live", emoji: "📱", title: "Top Numbers by Volume", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "topNumbers" },
    { id: "1.4", section: 1, status: "live", emoji: "🔁", title: "High-Touch Contacts (5+)", cadence: "Weekly", complexity: "low", chartType: "scatter", preview: "scatter" },
    { id: "1.5", section: 1, status: "live", emoji: "✅", title: "Connected vs Unanswered", cadence: "Daily", complexity: "low", chartType: "doughnut", preview: "connectKpi" },
    { id: "1.6", section: 1, status: "live", emoji: "🔍", title: "Runo Log-Only Gaps", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "gaps" },
    { id: "1.7", section: 1, status: "live", emoji: "⏱️", title: "Call Duration Distribution", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "duration" },
    { id: "1.8", section: 1, status: "live", emoji: "👥", title: "Agent Compare (4-way)", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "agentCompare" },
    /* Section 1 — new */
    { id: "1.9", section: 1, status: "new", emoji: "📊", title: "Monthly Dial → Connect → Prospect Funnel", cadence: "Monthly", complexity: "low", chartType: "bar", preview: "funnel3",
      question: "Each month, how many dials turned into connects, and how many connects turned into prospects?",
      insight: "A three-bar grouped chart per month. Instantly shows if volume is up but quality is down.",
      action: "If connects are flat but prospects drop, the pitch changed. If dials drop but prospect rate rises, the number list improved." },
    { id: "1.11", section: 1, status: "new", emoji: "🕐", title: "Golden Hour Heatmap", cadence: "Weekly", complexity: "low", chartType: "heatmap", preview: "goldenHour",
      question: "Which exact hour and day of the week gets the highest connect rate?",
      insight: "Hour × weekday colour grid. Darker = more connects. One glance shows the 2-hour window to dial hard.",
      action: "Share in Monday standup. Block peak hours for dialling only — no admin, no meetings." },
    { id: "1.12", section: 1, status: "new", emoji: "📉", title: "Number List Decay Chart", cadence: "Weekly", complexity: "low", chartType: "line", preview: "listDecay",
      question: "Is our current lead batch getting stale? When does it stop working?",
      insight: "Week-on-week junk% and unanswered% per batch. A rising junk line means the list is dying.",
      action: "If a batch crosses 40% junk by week 3, retire it immediately and source fresh numbers." },
    { id: "1.13", section: 1, status: "new", emoji: "⚡", title: "Speed-to-First-Dial Report", cadence: "Daily", complexity: "medium", chartType: "bar", preview: "speedDial",
      question: "How fast does each agent dial a new lead after it arrives?",
      insight: "Time from lead assignment to first dial, per agent. Leads called within 5 minutes convert dramatically better.",
      action: "Flag any new lead sitting undialled for 30+ minutes. Set a rule: first dial within 15 minutes." },
    { id: "1.14", section: 1, status: "new", emoji: "📞", title: "First Call vs Repeat Attempt Connect Rate", cadence: "Monthly", complexity: "low", chartType: "line", preview: "attemptConnect",
      question: "Do we connect better on call 1 or call 4 to the same number?",
      insight: "Connect rate by attempt number. If call 1 = 25% but call 5 = 4%, stop after 4 tries.",
      action: "Set a data-driven maximum attempt policy. Move stale numbers to WhatsApp." },
    { id: "1.15", section: 1, status: "new", emoji: "🎯", title: "Live Daily Target Progress", cadence: "Daily", complexity: "medium", chartType: "bar", preview: "dailyTarget",
      question: "By 2 PM today, is each agent on pace to hit their dial target?",
      insight: "Real-time progress bar per agent: dials done vs target with projected end-of-day number.",
      action: "If any agent is below 40% of target by midday, one call from the manager changes the rest of the day." },
    { id: "1.16", section: 1, status: "new", emoji: "📅", title: "Day-of-Week Performance Trend", cadence: "Monthly", complexity: "low", chartType: "bar", preview: "weekday",
      question: "Is the team consistently weaker on certain days of the week?",
      insight: "Average dials and connect rate by weekday over the past month.",
      action: "Use to plan team incentives and shift standup focus on low-energy days." },
    { id: "1.17", section: 1, status: "new", emoji: "🔁", title: "Redial Gap Tracker", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "redialGap",
      question: "Are agents redialling too quickly and annoying contacts, or waiting too long?",
      insight: "Average time between attempt 1 and attempt 2 per agent.",
      action: "Set a minimum redial gap of 4 hours. Track compliance here." },
    { id: "1.18", section: 1, status: "new", emoji: "🏙️", title: "City × Time-of-Day Win Map", cadence: "Monthly", complexity: "medium", chartType: "heatmap", preview: "cityTime",
      question: "Does Pune pick up at 11 AM but Mumbai only respond at 6 PM?",
      insight: "City rows × hour columns, cell colour = connect rate.",
      action: "Set city-specific calling windows in the team SOP. Can lift connect rate by 15–20%." },
    { id: "1.19", section: 1, status: "new", emoji: "🍩", title: "Agent Effort Breakdown Donut", cadence: "Weekly", complexity: "low", chartType: "doughnut", preview: "effortDonut",
      question: "Where is each agent actually spending their dials — on prospects or on dead numbers?",
      insight: "% of dials going to each disposition bucket per agent.",
      action: "Use in 1-on-1s. If Unknown is high, fix data before coaching pitch." },
    /* Section 2 — live */
    { id: "2.1", section: 2, status: "live", emoji: "🗑️", title: "Junk Lead Rate", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "junkRate" },
    { id: "2.2", section: 2, status: "live", emoji: "📲", title: "Recalling (Callback Pool)", cadence: "Daily", complexity: "low", chartType: "bar", preview: "recalling" },
    { id: "2.3", section: 2, status: "live", emoji: "⭐", title: "Prospect Count", cadence: "Weekly", complexity: "low", chartType: "line", preview: "prospectCount" },
    { id: "2.4", section: 2, status: "live", emoji: "📅", title: "Google Meet Planned", cadence: "Daily", complexity: "low", chartType: "bar", preview: "meetPlanned" },
    { id: "2.5", section: 2, status: "live", emoji: "✔️", title: "Google Meet Done", cadence: "Daily", complexity: "low", chartType: "bar", preview: "meetDone" },
    { id: "2.6", section: 2, status: "live", emoji: "⚠️", title: "Stuck Prospects", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "stuck" },
    { id: "2.7", section: 2, status: "live", emoji: "🏷️", title: "Tag Gap Audit", cadence: "Daily", complexity: "low", chartType: "doughnut", preview: "tagGap" },
    /* Section 2 — new */
    { id: "2.8", section: 2, status: "new", emoji: "🗓️", title: "Monthly Pipeline Waterfall", cadence: "Monthly", complexity: "low", chartType: "bar", preview: "pipelineWaterfall",
      question: "Each month: how many prospects became meetings planned, and how many became meetings done?",
      insight: "Grouped bar per month: Prospects → Meet Planned → Meet Done with drop-off visible.",
      action: "If Prospect count grows but Meet Planned is flat, agents are not converting interest to meetings." },
    { id: "2.10", section: 2, status: "new", emoji: "🔽", title: "Prospect to Meeting Funnel per Agent", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "agentFunnel",
      question: "Which agent is great at getting prospects but terrible at converting them to meetings?",
      insight: "Per-agent three-step funnel with individual drop-off %.",
      action: "Pair a strong prospector with a strong closer." },
    { id: "2.11", section: 2, status: "new", emoji: "💤", title: "Sleeping Prospects Alert", cadence: "Weekly", complexity: "low", chartType: "bar", preview: "sleeping",
      question: "Which warm prospects have not been contacted in 7+ days?",
      insight: "List of contacts tagged Prospect with no dial in the last 7 days.",
      action: "Auto-surface every Monday. Call today or reassign — no exceptions." },
    { id: "2.12", section: 2, status: "new", emoji: "⏱️", title: "Prospect Velocity Chart", cadence: "Monthly", complexity: "low", chartType: "bar", preview: "velocity",
      question: "How many days and calls does it take each agent to turn a number into a Prospect?",
      insight: "Avg days and avg dials from first call to Prospect tag, per agent.",
      action: "Set a team benchmark: Prospect within 3 calls or 5 days." },
    { id: "2.13", section: 2, status: "new", emoji: "🧊", title: "Recalling Age Dashboard", cadence: "Daily", complexity: "low", chartType: "bar", preview: "recallAge",
      question: "Which callback promises are silently going cold right now?",
      insight: "Every contact tagged Recalling, sorted by days since tag. Day 3 is the danger zone.",
      action: "Escalate Recalling contacts older than 3 days without a redial." },
    { id: "2.14", section: 2, status: "new", emoji: "🏆", title: "Agent Conversion Leaderboard", cadence: "Monthly", complexity: "low", chartType: "bar", preview: "leaderboard",
      question: "Who converts the most dials into real prospects?",
      insight: "Dials-to-Prospect ratio ranked by agent.",
      action: "Recognise the top converter publicly — not the top dialler." },
    { id: "2.15", section: 2, status: "new", emoji: "🗺️", title: "City Conversion Heatmap", cadence: "Monthly", complexity: "low", chartType: "heatmap", preview: "cityConversion",
      question: "Which cities produce real buyers and which ones just burn time?",
      insight: "City rows × disposition columns. Dark green = high prospect rate.",
      action: "Reduce dial volume in red cities. Double effort in green ones." },
    { id: "2.16", section: 2, status: "new", emoji: "📈", title: "Junk vs Prospect Weekly Ratio", cadence: "Weekly", complexity: "low", chartType: "line", preview: "junkProspect",
      question: "Is our number quality improving or degrading week by week?",
      insight: "Dual line chart: new prospects vs new junk confirmed per week.",
      action: "Two consecutive weeks of rising junk = retire the number batch." },
    { id: "2.17", section: 2, status: "new", emoji: "📅", title: "Meeting Show-Up Rate by Day of Week", cadence: "Monthly", complexity: "low", chartType: "bar", preview: "showUp",
      question: "Are Monday morning meetings more reliable than Friday afternoon ones?",
      insight: "Meet Done / Meet Planned ratio broken by day of week.",
      action: "Stop booking Friday slots. Push meetings to Tue–Thu 10 AM–12 PM." },
    { id: "2.18", section: 2, status: "new", emoji: "👤", title: "Prospect Concentration Risk", cadence: "Monthly", complexity: "low", chartType: "doughnut", preview: "concentration",
      question: "Is one agent holding 60% of all active prospects?",
      insight: "% of total active Prospects held by each agent.",
      action: "No agent should hold more than 30%. Redistribute monthly." },
    /* Section 3 — blocked/derivable */
    { id: "3.1", section: 3, status: "blocked", emoji: "🚫", title: "Meeting Status (attended/no-show)", cadence: "Monthly", complexity: "high", chartType: "bar", preview: "blocked" },
    { id: "3.2", section: 3, status: "derivable", emoji: "📊", title: "Calls Before First Meeting", cadence: "Monthly", complexity: "medium", chartType: "bar", preview: "callsBefore" },
    { id: "3.3", section: 3, status: "derivable", emoji: "📞", title: "Follow-ups After Meeting", cadence: "Weekly", complexity: "medium", chartType: "line", preview: "followUps" },
    { id: "3.4", section: 3, status: "blocked", emoji: "🚫", title: "Deal Won / Booking", cadence: "Monthly", complexity: "high", chartType: "bar", preview: "blocked" },
    { id: "3.5", section: 3, status: "blocked", emoji: "💰", title: "Revenue & Closure Rate", cadence: "Monthly", complexity: "high", chartType: "bar", preview: "blocked" },
    /* Section 3 — new */
    { id: "3.6", section: 3, status: "new", emoji: "🗓️", title: "Monthly Full-Journey Funnel", cadence: "Monthly", complexity: "medium", chartType: "bar", preview: "fullJourney",
      question: "Each month: from total dials, how many became prospects, meetings, and bookings?",
      insight: "Five-step horizontal bar per month: Dials → Connects → Prospects → Meet Done → Deal Won.",
      action: "Use in monthly leadership review." },
    { id: "3.8", section: 3, status: "new", emoji: "📏", title: "Calls Before First Meeting Histogram", cadence: "Monthly", complexity: "medium", chartType: "bar", preview: "histogram",
      question: "Do most deals need 4 calls or 10 calls before a meeting happens?",
      insight: "Histogram of total dials before each first Meet Done.",
      action: "After 6 dials with no meeting, route to WhatsApp or reassign." },
    { id: "3.9", section: 3, status: "new", emoji: "🏁", title: "Time-to-Close Funnel by Agent", cadence: "Monthly", complexity: "medium", chartType: "bar", preview: "timeToClose",
      question: "Which agent takes 8 days from first dial to meeting, and which takes 25?",
      insight: "Average days: first dial → Prospect → Meet Done → Deal Won, per agent.",
      action: "Pair the fastest-closing agent as mentor for the slowest." },
    { id: "3.10", section: 3, status: "new", emoji: "❌", title: "No-Show Rate by City", cadence: "Monthly", complexity: "medium", chartType: "bar", preview: "noShowCity",
      question: "Which cities schedule meetings that consistently do not happen?",
      insight: "City × (Meet Planned minus Meet Done) rate.",
      action: "For high no-show cities, try phone calls or earlier time slots." },
    { id: "3.11", section: 3, status: "new", emoji: "🔃", title: "Post-Meeting Follow-Up Score", cadence: "Weekly", complexity: "medium", chartType: "bar", preview: "postMeet",
      question: "After a meeting is done, how fast does each agent follow up?",
      insight: "Count dials made within 48 hours of a Meet Done, per agent.",
      action: "Rule: every Meet Done must have follow-up within 24 hours." },
    { id: "3.12", section: 3, status: "new", emoji: "🌊", title: "Lead Cohort Conversion", cadence: "Monthly", complexity: "medium", chartType: "line", preview: "cohort",
      question: "Do leads brought in during month 1 convert better than month 3?",
      insight: "Group contacts by month first dialled. Track over 60 days.",
      action: "Focus fresh leads on the first week of the month when agents are sharpest." },
    { id: "3.13", section: 3, status: "new", emoji: "📬", title: "WhatsApp vs Call for Recalling", cadence: "Monthly", complexity: "medium", chartType: "bar", preview: "waVsCall",
      question: "For callback contacts, does WhatsApp or a phone call result in more meetings?",
      insight: "Split Recalling contacts by first channel. Compare Meet Done rate.",
      action: "If WhatsApp converts 2× better, make it the default after 48 hours." },
    { id: "3.14", section: 3, status: "new", emoji: "🔮", title: "Pipeline Health Score", cadence: "Weekly", complexity: "high", chartType: "line", preview: "healthScore",
      question: "Is next month's revenue likely to be better or worse — in a single number?",
      insight: "Weekly score: prospects + meet-done trend + stuck count + tag gap.",
      action: "Show every Monday in standup. Green = push hard. Red = fix quality." },
    { id: "3.15", section: 3, status: "new", emoji: "⚖️", title: "Effort vs Result by Agent", cadence: "Monthly", complexity: "low", chartType: "scatter", preview: "effortResult",
      question: "Who is putting in 3× the effort for 0.5× the result?",
      insight: "Plot total dials against meetings done and deals won per agent.",
      action: "Reallocate leads away from high-effort low-result agents." },
  ];

  const decisionIdeas = charts.filter((c) => c.status === "new");

  const chartById = Object.fromEntries(charts.map((c) => [c.id, c]));

  function getChart(id) {
    return chartById[id] || null;
  }

  function getSectionCharts(sectionNum, statusFilter) {
    return charts.filter((c) => {
      if (c.section !== sectionNum) return false;
      if (!statusFilter) return true;
      return c.status === statusFilter;
    });
  }

  function getNavOrder() {
    return charts.map((c) => c.id);
  }

  function getPrevNext(id) {
    const order = getNavOrder();
    const idx = order.indexOf(id);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? order[idx - 1] : null,
      next: idx < order.length - 1 ? order[idx + 1] : null,
    };
  }

  function chartPageUrl(id) {
    return `chart.html?id=${encodeURIComponent(id)}`;
  }

  return {
    STORAGE_KEY,
    sections,
    charts,
    decisionIdeas,
    chartById,
    getChart,
    getSectionCharts,
    getNavOrder,
    getPrevNext,
    chartPageUrl,
  };
})();
