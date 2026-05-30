const SODATA = {
  "1-9": {
    id: "1-9",
    title: "Monthly Dial → Connect → Prospect Funnel",
    cadence: "Monthly",
    complexity: "Low",
    question: "How many dials turned into connects and prospects each month?",
    insight: "Three-bar grouped monthly visualization highlights volume vs quality.",
    action: "Investigate flat connects with dropping prospects or rising prospect rates from better lists.",
    chart: { type: 'funnel', labels: ["Jan","Feb","Mar","Apr","May"], data: { dials:[1200,1400,1300,1500,1600], connects:[300,320,310,330,360], prospects:[60,70,65,75,90] } }
  },
  "1-11": {
    id: "1-11",
    title: "Golden Hour Heatmap",
    cadence: "Weekly",
    complexity: "Low",
    question: "Which exact hour and day of the week gets the highest connect rate?",
    insight: "Hour × weekday colour grid surfaces the highest-performing call windows.",
    action: "Reserve peak dialing hours and block admin tasks then.",
    chart: { type: 'heatmap', matrix: [[0.05,0.06,0.04,0.08,0.12,0.10,0.07,0.09,0.06,0.05,0.03,0.02],[0.04,0.05,0.03,0.07,0.11,0.09,0.06,0.08,0.05,0.04,0.02,0.01]] }
  },
  "1-13": {
    id: "1-13",
    title: "Speed-to-First-Dial Report",
    cadence: "Daily",
    complexity: "Medium",
    question: "How fast does each agent dial a new lead after it arrives?",
    insight: "Time from lead assignment to first dial, per agent. Leads called within 5 minutes convert dramatically better.",
    action: "Flag any new lead sitting undialled for 30+ minutes and set a 15-minute standard.",
    chart: { type: 'bar', labels:['Aarav','Neha','Rohan','Priya','Sahil'], data:[4,12,7,9,20] }
  }
};

// Order of IDs for navigation
const SODATA_ORDER = ["1-9","1-11","1-13"];

export { SODATA, SODATA_ORDER };
