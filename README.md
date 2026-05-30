# Sales Ops Dashboard — Review & Decision Session

Meeting-ready static site for Inchbrick Sales Ops chart review. Colourful 3×3 grids, per-chart detail pages with Chart.js previews, and **localStorage-synced** decisions.

## Files
- `index.html` — overview, 3×3 new-idea grids per section, decision tracker
- `section1.html` / `section2.html` / `section3.html` — live + new charts in 3×3 tiles
- `chart.html?id=1.9` — individual chart review (preview, decision, **Next →** navigation)
- `js/data.js` — chart catalog
- `js/decisions.js` — Build / Next / Skip / Discuss + notes (localStorage)
- `js/charts.js` — Chart.js preview mocks
- `js/app.js` — page bootstrapping
- `css/styles.css` — presentation styling

## How to use
1. Open `index.html` in your browser (or serve locally).
2. Click **Start presentation** or any tile in the 3×3 grid.
3. On each chart page: review the preview, pick a decision (saved automatically).
4. Use **Next chart →** or arrow keys (← →) to walk through the deck.
5. Decisions sync to the **Decision tracker** on the home page — screenshot at end of meeting.

Decisions are stored under `inchbrick-sales-ops-decisions-v2` in localStorage.

## Publish to GitHub Pages
1. Create a GitHub repository and push these files to the root branch (`main` or `master`).
2. In repository settings, enable GitHub Pages from the root of the branch.
3. Your site will be available at `https://<your-org>.github.io/<repo-name>/`.
