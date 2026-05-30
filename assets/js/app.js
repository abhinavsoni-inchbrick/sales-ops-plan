import { SODATA, SODATA_ORDER } from './data.js';

function qsParam(name){
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

function saveState(id, state){
  localStorage.setItem('sop:'+id, JSON.stringify(state));
}

function loadState(id){
  try{ return JSON.parse(localStorage.getItem('sop:'+id)) || {}; }catch(e){ return {}; }
}

function renderDecisionControls(root, id){
  const state = loadState(id);
  const decisions = ['BUILD IT','NEXT PHASE','SKIP','NEEDS DISCUSSION'];
  const container = document.createElement('div');
  container.className = 'decision-controls';
  decisions.forEach(d => {
    const btn = document.createElement('button');
    btn.textContent = d;
    btn.className = 'dec-btn';
    if(state.decision === d) btn.classList.add('active');
    btn.addEventListener('click', ()=>{
      state.decision = d;
      saveState(id, state);
      document.querySelectorAll('.dec-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
    container.appendChild(btn);
  });
  root.appendChild(container);
}

function renderNotes(root, id){
  const state = loadState(id);
  const ta = document.createElement('textarea');
  ta.placeholder = 'Meeting notes / owner / next steps...';
  ta.value = state.notes || '';
  ta.addEventListener('input', ()=>{ state.notes = ta.value; saveState(id,state); });
  root.appendChild(ta);
}

function renderHeader(root, data){
  const h = document.createElement('div');
  h.className = 'detail-head';
  h.innerHTML = `<h1>${data.title}</h1><p class="muted">${data.cadence} · Complexity: ${data.complexity}</p>`;
  root.appendChild(h);
}

function renderChartArea(root, data){
  const canvas = document.createElement('canvas');
  canvas.id = 'detailChart';
  root.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if(data.chart.type === 'funnel'){
    new Chart(ctx, {
      type: 'bar',
      data: { labels: data.chart.labels, datasets: [
        { label: 'Dials', data: data.chart.data.dials, backgroundColor:'#60d0ff'},
        { label: 'Connects', data: data.chart.data.connects, backgroundColor:'#10b0ff'},
        { label: 'Prospects', data: data.chart.data.prospects, backgroundColor:'#00c46b'}
      ]},
      options:{ responsive:true }
    });
  } else if(data.chart.type === 'bar'){
    new Chart(ctx, { type: 'bar', data:{ labels:data.chart.labels, datasets:[{label:'Minutes to first dial', data:data.chart.data, backgroundColor:'#ffb86b'}]}, options:{responsive:true} });
  } else if(data.chart.type === 'heatmap'){
    // simple css-based heatmap fallback
    const heat = document.createElement('div');
    heat.className = 'heatmap-grid';
    const rows = data.chart.matrix.length;
    const cols = data.chart.matrix[0].length;
    heat.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    data.chart.matrix.forEach(row=>row.forEach(v=>{
      const cell = document.createElement('div');
      const intensity = Math.min(1, v*8);
      cell.style.background = `rgba(16,176,255,${intensity})`;
      cell.textContent = Math.round(v*100)+'%';
      heat.appendChild(cell);
    }));
    root.appendChild(heat);
  }
}

function initDetail(){
  const idraw = qsParam('id') || '1-9';
  const data = SODATA[idraw];
  if(!data){ document.body.innerHTML = '<p>Unknown detail id</p>'; return; }
  const container = document.getElementById('detail-root');
  renderHeader(container,data);
  const q = document.createElement('p'); q.className='muted'; q.textContent = 'Question: ' + data.question; container.appendChild(q);
  const insight = document.createElement('p'); insight.textContent = 'Insight: ' + data.insight; container.appendChild(insight);
  renderChartArea(container,data);
  renderDecisionControls(container,data.id);
  renderNotes(container,data.id);
}

window.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('detail-root')) initDetail();
});

export { initDetail };
