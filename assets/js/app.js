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

// ---------- Index page helpers ----------
function getSelectedMap(){
  try{ return JSON.parse(localStorage.getItem('sop:selected')) || {} }catch(e){ return {}; }
}

function setSelectedMap(m){ localStorage.setItem('sop:selected', JSON.stringify(m)); }

function toggleSelection(id, checked){
  const m = getSelectedMap();
  if(checked) m[id]=true; else delete m[id];
  setSelectedMap(m);
}

function exportDecisionsCSV(){
  const rows = [['id','title','decision','notes']];
  Object.keys(SODATA).forEach(id=>{
    const st = loadState(id);
    rows.push([id, SODATA[id].title, st.decision||'', (st.notes||'').replace(/\n/g,' ')]);
  });
  const csv = rows.map(r=>r.map(c=>`"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download='sop-decisions.csv'; a.click();
}

function renderSidebar(){
  const container = document.getElementById('idea-list');
  if(!container) return;
  container.innerHTML = '';
  const sel = getSelectedMap();
  SODATA_ORDER.forEach(id=>{
    const data = SODATA[id];
    const row = document.createElement('div'); row.className='idea-row';
    const cb = document.createElement('input'); cb.type='checkbox'; cb.id='cb-'+id; cb.checked = !!sel[id];
    cb.addEventListener('change', ()=>{ toggleSelection(id, cb.checked); });
    const label = document.createElement('label'); label.htmlFor='cb-'+id; label.innerHTML = `<strong>${data.title}</strong><br/><small class="muted">${data.cadence} · ${data.complexity}</small>`;
    const open = document.createElement('a'); open.href=`detail.html?id=${id}`; open.textContent='Open full'; open.className='secondary-button'; open.style.marginLeft='8px';
    row.appendChild(cb); row.appendChild(label); row.appendChild(open);
    container.appendChild(row);
  });
}

// QuickView modal
let quickIndex = 0; let quickList = [];
function openQuickView(startIndex=0){
  quickList = SODATA_ORDER.filter(id=> getSelectedMap()[id]);
  if(quickList.length===0) quickList = SODATA_ORDER.slice();
  quickIndex = startIndex%quickList.length;
  showQuick(quickList[quickIndex]);
}

function showQuick(id){
  const data = SODATA[id];
  let modal = document.getElementById('quick-modal');
  if(!modal){
    modal = document.createElement('div'); modal.id='quick-modal'; modal.className='quick-modal';
    modal.innerHTML = `<div class="quick-inner"><button class="close-quick">✕</button><div id="quick-content"></div><div class="quick-controls"><button id="quick-prev">◀ Prev</button><button id="quick-next">Next ▶</button><a id="quick-full" class="secondary-button" target="_blank">Open full</a></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.close-quick').addEventListener('click', ()=>modal.remove());
    modal.querySelector('#quick-prev').addEventListener('click', ()=>{ quickIndex = (quickIndex-1+quickList.length)%quickList.length; showQuick(quickList[quickIndex]); });
    modal.querySelector('#quick-next').addEventListener('click', ()=>{ quickIndex = (quickIndex+1)%quickList.length; showQuick(quickList[quickIndex]); });
  }
  const content = modal.querySelector('#quick-content'); content.innerHTML='';
  const h = document.createElement('h2'); h.textContent = data.title; content.appendChild(h);
  const q = document.createElement('p'); q.className='muted'; q.textContent = 'Question: '+data.question; content.appendChild(q);
  const cdiv = document.createElement('div'); cdiv.id='quick-chart'; content.appendChild(cdiv);
  // render small chart
  const canvas = document.createElement('canvas'); cdiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if(data.chart.type==='funnel'){
    new Chart(ctx,{type:'bar', data:{labels:data.chart.labels, datasets:[{label:'Prospects', data:data.chart.data.prospects, backgroundColor:'#00c46b'}]}, options:{responsive:true}});
  } else if(data.chart.type==='bar'){
    new Chart(ctx,{type:'bar', data:{labels:data.chart.labels, datasets:[{label:'Value', data:data.chart.data, backgroundColor:'#ffb86b'}]}, options:{responsive:true}});
  }
  modal.querySelector('#quick-full').href = `detail.html?id=${id}`;
  document.body.appendChild(modal);
}

function initIndex(){
  renderSidebar();
  const exp = document.getElementById('export-decisions'); if(exp) exp.addEventListener('click', exportDecisionsCSV);
  document.querySelectorAll('#agent-grid .agent').forEach(btn=>{
    btn.addEventListener('click', ()=>{ openQuickView(0); });
  });
}

// Auto-init index if on index page
if(document.getElementById('idea-list')){
  window.addEventListener('DOMContentLoaded', initIndex);
}

export { initDetail, initIndex, openQuickView };
