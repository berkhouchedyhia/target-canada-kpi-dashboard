const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct'];

const ORIG = {
  k01:[96.55,96.89,95.87,97.06,97.39,95.77,97.68,96.97,96.6,97.06],
  k02:[2.07,2.048,1.976,2.09,2.168,2.09,2.073,2.089,2.095,2.061],
  k03:[15.01,13.28,14.45,15.66,15.66,14.31,12.77,13.45,17.2,13.57],
  k04:[36.84,32.0,34.02,34.57,34.65,31.83,36.44,31.66,31.49,33.67],
  k05:[6.49,6.26,6.47,7.02,6.91,7.08,7.12,7.07,7.11,6.8],
  k06:[73.5,73.6,72.4,73.4,74.9,75.3,74.2,75.9,73.5,74.0],
  k07:[39.91,40.07,39.97,40.65,40.57,40.51,40.19,41.01,40.11,40.62],
  k08:[3.88,4.62,4.6,3.77,3.9,3.63,3.83,3.65,3.84,3.82],
  k09:[94.18,94.59,92.76,94.57,93.02,93.92,93.92,94.74,93.3,93.6],
  k10:[79.38,81.62,85.22,86.56,87.38,85.95,85.85,85.55,85.25,86.1],
  k11:[87.02,86.47,83.82,85.07,85.27,82.16,82.28,81.29,81.46,84.16],
  k12:[3.59,3.66,3.57,4.05,4.1,3.86,4.07,4.02,3.89,3.94],
  k13:[21.46,21.41,21.01,21.59,18.64,20.68,23.74,21.46,21.84,20.53],
  k14:[92.35,97.0,95.07,94.71,95.57,95.43,95.77,96.48,94.52,96.08],
  k15:[256.6,246.6,235.9,221.4,207.6,239.0,261.5,225.6,227.9,243.6],
  k16:[69.66,75.16,72.25,71.03,72.73,76.62,70.7,73.94,71.09,78.57]
};
let DATA = JSON.parse(JSON.stringify(ORIG));

const avg = a => a.reduce((s,v)=>s+v,0)/a.length;

const KPIS = [
  {id:'k01',n:'KPI 01',lbl:'Disponibilité ERP',axis:1,unit:'%',target:99.5,higher:true,targetLbl:'≥99,5%',fmt:v=>v.toFixed(1)+'%',prev:'Toute indisponibilité supérieure à 0,5% aurait déclenché une alerte infrastructure, forçant un audit de l\'ERP avant généralisation du déploiement.'},
  {id:'k02',n:'KPI 02',lbl:'Temps de réponse ERP',axis:1,unit:'s',target:2,higher:false,targetLbl:'<2s',fmt:v=>v.toFixed(2)+'s',prev:'Un temps de réponse dépassant 2s sur 95% des requêtes signale une surcharge système. Détectable dès la phase pilote — aurait forcé une optimisation avant ouverture des 124 magasins.'},
  {id:'k03',n:'KPI 03',lbl:'Erreurs config ERP',axis:1,unit:'%',target:2,higher:false,targetLbl:'<2%',fmt:v=>v.toFixed(1)+'%',prev:'À 8,7% d\'erreurs (cible <2%), l\'alerte aurait été déclenchée dès J+7. La règle go/no-go aurait bloqué tout déploiement jusqu\'à correction, évitant la propagation des erreurs à 30 000+ références produits.'},
  {id:'k04',n:'KPI 04',lbl:'Complétude référentiel',axis:1,unit:'%',target:98,higher:true,targetLbl:'≥98%',fmt:v=>v.toFixed(1)+'%',prev:'Un taux de complétude à 33,7% (vs 98% requis) constitue le signal le plus fort de l\'étude. Ce seul KPI aurait imposé un blocage absolu dès J+1, économisant potentiellement 1,8 Md$ CAD.'},
  {id:'k05',n:'KPI 05',lbl:'NPS client',axis:2,unit:'',target:30,higher:true,targetLbl:'≥30 à 6m',fmt:v=>v.toFixed(1),prev:'Un NPS à 6,8 (cible 30) déclenche immédiatement une enquête qualitative sur les motifs. Corrélé aux ruptures de stock, la cause racine est identifiée en 48h — vs des mois sans métrologie.'},
  {id:'k06',n:'KPI 06',lbl:'Satisfaction CSAT',axis:2,unit:'%',target:75,higher:true,targetLbl:'≥75% à 3m',fmt:v=>v.toFixed(1)+'%',prev:'Le CSAT à 73,5% (cible 75%) frôle le seuil d\'alerte. Sa corrélation avec les données logistiques permet de relier chaque point de satisfaction perdu à un dysfonctionnement SI précis.'},
  {id:'k07',n:'KPI 07',lbl:'Taux de conversion',axis:2,unit:'%',target:35,higher:true,targetLbl:'≥35% à 6m',fmt:v=>v.toFixed(1)+'%',prev:'Le taux de conversion à 40,3% est dans l\'objectif. Sa surveillance aurait permis de détecter les magasins sous-performants et d\'isoler les causes (ruptures, expérience dégradée).'},
  {id:'k08',n:'KPI 08',lbl:'Ruptures de stock',axis:2,unit:'%',target:5,higher:false,targetLbl:'<5% à 3m',fmt:v=>v.toFixed(2)+'%',prev:'Le pic à 4,62% en février déclenche automatiquement un réapprovisionnement d\'urgence. Sans ce KPI, Target n\'a découvert l\'ampleur des ruptures qu\'à travers les plaintes clients publiques.'},
  {id:'k09',n:'KPI 09',lbl:'Conformité réglementaire',axis:3,unit:'%',target:100,higher:true,targetLbl:'100% avant ouverture',fmt:v=>v.toFixed(1)+'%',prev:'La cible absolue de 100% signifie que tout écart constitue un blocage légal. À 93,7%, 6,3% des processus violent la réglementation canadienne — exposition juridique chiffrée et évitable.'},
  {id:'k10',n:'KPI 10',lbl:'Adoption ERP locale',axis:3,unit:'%',target:95,higher:true,targetLbl:'≥95% à 3m',fmt:v=>v.toFixed(1)+'%',prev:'Un taux d\'adoption de 84,8% révèle que 15% des opérations contournent l\'ERP. Ces contournements corrompent les données et créent des stocks fantômes — cause directe des ruptures identifiées par le KPI 08.'},
  {id:'k11',n:'KPI 11',lbl:'Alignement assortiment',axis:3,unit:'%',target:90,higher:true,targetLbl:'≥90% à 12m',fmt:v=>v.toFixed(1)+'%',prev:'À 83,3% d\'alignement (cible 90%), 1 produit sur 6 ne correspond pas aux attentes du marché canadien. Ce KPI traduit en indicateur mesurable ce que Target n\'a jamais quantifié avant son déploiement.'},
  {id:'k12',n:'KPI 12',lbl:'Satisfaction employés',axis:3,unit:'/5',target:3.5,higher:true,targetLbl:'≥3,5/5 à 3m',fmt:v=>v.toFixed(2)+'/5',prev:'À 3,87/5, les employés sont modérément satisfaits. Ce KPI proxy de l\'adoption culturelle aurait révélé les tensions organisationnelles bien avant qu\'elles ne se traduisent en taux d\'erreur opérationnel.'},
  {id:'k13',n:'KPI 13',lbl:'MTTR — résolution',axis:4,unit:'h',target:4,higher:false,targetLbl:'<4h (P1)',fmt:v=>v.toFixed(1)+'h',prev:'Le MTTR P1 à 2,3h est dans l\'objectif. Mais le MTTR global à 21,5h révèle que les incidents P3 (mineurs) s\'accumulent et créent une dette opérationnelle invisible sans tableau de bord.'},
  {id:'k14',n:'KPI 14',lbl:'Respect des SLA',axis:4,unit:'%',target:95,higher:true,targetLbl:'≥95% (P1)',fmt:v=>v.toFixed(1)+'%',prev:'À 95,3%, le respect des SLA est conforme. Ce KPI aurait validé que la chaîne de résolution fonctionne — et permis de calculer le coût des 4,7% d\'incidents hors délai.'},
  {id:'k15',n:'KPI 15',lbl:'MTTD — détection',axis:4,unit:'min',target:30,higher:false,targetLbl:'<30min (critique)',fmt:v=>v.toFixed(0)+'min',prev:'À 23 min pour les P1, le délai de détection est dans l\'objectif. Mais pour les P2/P3 (plus de 3h), c\'est la centralisation (KPI 16) qui crée ce délai — les deux KPIs se corrèlent directement.'},
  {id:'k16',n:'KPI 16',lbl:'Décentralisation décision',axis:4,unit:'%',target:85,higher:true,targetLbl:'≥85% à 6m',fmt:v=>v.toFixed(1)+'%',prev:'À 73,1% de décisions locales (cible 85%), 27% remontent à Minneapolis. Ce KPI rend la centralisation excessive mesurable et objectivable — ce qu\'aucun manager de Target Canada ne pouvait prouver sans données.'}
];

const AXIS_COLORS = {0:'#5F5E5A',1:'#185FA5',2:'#0F6E56',3:'#854F0B',4:'#993556'};
const AXIS_LABELS = {1:'Scalabilité SI',2:'Satisfaction client',3:'Adéquation locale',4:'Réactivité décision'};

function getStatus(kpi) {
  const v = avg(DATA[kpi.id]);
  if(kpi.higher) {
    if(v >= kpi.target) return 'ok';
    if(v >= kpi.target * 0.9) return 'warn';
    return 'crit';
  } else {
    if(v <= kpi.target) return 'ok';
    if(v <= kpi.target * 1.3) return 'warn';
    return 'crit';
  }
}

function getBarPct(kpi) {
  const v = avg(DATA[kpi.id]);
  if(kpi.higher) return Math.min(100, (v/kpi.target)*100);
  else return Math.min(100, (kpi.target/v)*100);
}

function getStatusColor(s) {
  return s==='ok'?'#639922':s==='warn'?'#BA7517':'#E24B4A';
}

let currentAxis = 0;
let currentStatusFilter = null;
let selectedKPI = null;
let chart1 = null, chart2 = null, globalRadarChart = null, globalBarChart = null;

function filterAxis(ax) {
  currentAxis = ax;
  document.querySelectorAll('.ax').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.ax')[ax].classList.add('on');
  renderGrid();
}


function filterStatus(status, el) {
  currentStatusFilter = currentStatusFilter === status ? null : status;
  document.querySelectorAll('.score-pills .pill').forEach(p=>p.classList.remove('active-filter'));
  if(currentStatusFilter && el) el.classList.add('active-filter');
  renderGrid();

  const filtered = KPIS.filter(k => (currentAxis===0 || k.axis===currentAxis) && (!currentStatusFilter || getStatus(k)===currentStatusFilter));
  if(filtered.length) {
    selectKPI(filtered[0].id);
    setTimeout(() => {
      document.getElementById('detail-zone').scrollIntoView({behavior:'smooth', block:'start'});
    }, 80);
  }
}

function renderGrid() {
  const grid = document.getElementById('kpi-grid');
  let filtered = currentAxis === 0 ? KPIS : KPIS.filter(k=>k.axis===currentAxis);
  if(currentStatusFilter) filtered = filtered.filter(k=>getStatus(k)===currentStatusFilter);
  grid.style.gridTemplateColumns = currentAxis===0 ? 'repeat(4,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))';
  grid.innerHTML = '';
  filtered.forEach(kpi => {
    const s = getStatus(kpi);
    const v = avg(DATA[kpi.id]);
    const pct = getBarPct(kpi);
    const col = AXIS_COLORS[kpi.axis];
    const div = document.createElement('div');
    div.className = 'kc' + (selectedKPI===kpi.id?' sel':'');
    div.style.borderLeftColor = col;
    div.innerHTML = `<div class="kc-top"><span class="kc-num">${kpi.n}</span><span class="kc-badge b-${s}">${s==='ok'?'OK':s==='warn'?'Vigilance':'Critique'}</span></div><div class="kc-val" style="color:${getStatusColor(s)}">${kpi.fmt(v)}</div><div class="kc-lbl">${kpi.lbl}</div><div class="kc-bar"><div class="kc-fill" style="width:${pct.toFixed(0)}%;background:${getStatusColor(s)}"></div></div>`;
    div.onclick = ()=>selectKPI(kpi.id);
    grid.appendChild(div);
  });
  updateCounts();
}

function updateCounts() {
  const counts = {crit:0,warn:0,ok:0};
  KPIS.forEach(k=>counts[getStatus(k)]++);
  document.getElementById('cnt-crit').textContent = counts.crit+' critiques';
  document.getElementById('cnt-warn').textContent = counts.warn+' vigilance';
  document.getElementById('cnt-ok').textContent = counts.ok+' OK';
}

function selectKPI(id) {
  selectedKPI = id;
  const kpi = KPIS.find(k=>k.id===id);
  const s = getStatus(kpi);
  const v = avg(DATA[id]);
  const col = AXIS_COLORS[kpi.axis];

  document.getElementById('dz-title').textContent = kpi.n+' — '+kpi.lbl;
  document.getElementById('dz-sub').textContent = AXIS_LABELS[kpi.axis]+' · Cible : '+kpi.targetLbl;
  const badge = document.getElementById('dz-axis-badge');
  badge.textContent = AXIS_LABELS[kpi.axis];
  badge.style.cssText = `font-size:10px;background:${col}22;color:${col};`;

  const last = DATA[id][DATA[id].length-1];
  const first = DATA[id][0];
  const trend = last - first;
  document.getElementById('dz-vals').innerHTML = `
    <div class="dv"><div class="dv-label">Valeur moyenne</div><div class="dv-val" style="color:${getStatusColor(s)}">${kpi.fmt(v)}</div><div class="dv-target">cible : ${kpi.targetLbl}</div></div>
    <div class="dv"><div class="dv-label">Valeur dernière période</div><div class="dv-val">${kpi.fmt(last)}</div><div class="dv-target">${trend>=0?'+':''}${(trend).toFixed(2)} vs Jan</div></div>
    <div class="dv"><div class="dv-label">Écart à l'objectif</div><div class="dv-val" style="color:${getStatusColor(s)}">${kpi.higher?(v>=kpi.target?''+kpi.fmt(v-kpi.target)+' dessus':kpi.fmt(kpi.target-v)+' manquant'):(v<=kpi.target?kpi.fmt(kpi.target-v)+' dessous':kpi.fmt(v-kpi.target)+' dépassement')}</div><div class="dv-target">statut : ${s==='ok'?'dans l\'objectif':s==='warn'?'vigilance':'critique'}</div></div>
  `;

  document.getElementById('inject-zone').style.display = 'block';
  const izGrid = document.getElementById('iz-grid');
  const recentMonths = ['Jul','Aoû','Sep','Oct'];
  const recentIdx = [6,7,8,9];
  izGrid.innerHTML = recentIdx.map((idx,i)=>`<div class="iz-item"><label>${recentMonths[i]}</label><input type="number" id="inj_${i}" value="${DATA[id][idx].toFixed(2)}" step="0.01"></div>`).join('');

  const alertDiv = document.getElementById('dz-alert');
  if(s==='crit') alertDiv.innerHTML = `<div class="alert-box alert-crit">Alerte critique — ${kpi.lbl} à ${kpi.fmt(v)} est significativement sous l'objectif (${kpi.targetLbl}). Action immédiate requise. ${kpi.prev}</div>`;
  else if(s==='warn') alertDiv.innerHTML = `<div class="alert-box alert-warn">Vigilance — ${kpi.lbl} approche du seuil critique. Surveillance renforcée recommandée. ${kpi.prev}</div>`;
  else alertDiv.innerHTML = `<div class="alert-box alert-ok">${kpi.lbl} dans l'objectif. ${kpi.prev}</div>`;

  renderDetailCharts(kpi);
  const dz = document.getElementById('detail-zone');
  dz.classList.remove('focus-pop'); void dz.offsetWidth; dz.classList.add('focus-pop');
  renderGrid();
}

function applyInjection() {
  if(!selectedKPI) return;
  const recentIdx = [6,7,8,9];
  recentIdx.forEach((idx,i)=>{
    const el = document.getElementById('inj_'+i);
    if(el) DATA[selectedKPI][idx] = parseFloat(el.value)||DATA[selectedKPI][idx];
  });
  const kpi = KPIS.find(k=>k.id===selectedKPI);
  selectKPI(selectedKPI);
  updateGlobalCharts();
}

function resetKPI() {
  if(!selectedKPI) return;
  DATA[selectedKPI] = [...ORIG[selectedKPI]];
  selectKPI(selectedKPI);
  updateGlobalCharts();
}

function renderDetailCharts(kpi) {
  const tc = 'rgba(234,242,255,.88)';
  const gc = 'rgba(234,242,255,.10)';
  const col = AXIS_COLORS[kpi.axis];
  const s = getStatus(kpi);
  const valColor = getStatusColor(s);

  document.getElementById('chart1-title').textContent = 'Évolution mensuelle — '+kpi.lbl;
  if(chart1) chart1.destroy();
  chart1 = new Chart(document.getElementById('detailChart1'), {
    type:'line',
    data:{
      labels:months,
      datasets:[
        {label:'Valeur réelle',data:DATA[kpi.id],borderColor:valColor,backgroundColor:valColor+'22',fill:true,tension:.35,pointRadius:3,borderWidth:1.5},
        {label:'Objectif',data:Array(10).fill(kpi.target),borderColor:col,borderDash:[5,4],borderWidth:1,pointRadius:0}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:tc,font:{size:10}},grid:{color:gc},border:{display:false}},y:{ticks:{color:tc,font:{size:10},callback:v=>kpi.unit==='%'?v+'%':kpi.unit===''?v:v+kpi.unit},grid:{color:gc},border:{display:false}}}}
  });

  document.getElementById('chart2-title').textContent = 'Valeur actuelle vs objectif';
  if(chart2) chart2.destroy();
  const vAvg = avg(DATA[kpi.id]);
  chart2 = new Chart(document.getElementById('detailChart2'), {
    type:'bar',
    data:{
      labels:['Valeur actuelle','Objectif'],
      datasets:[{data:[parseFloat(vAvg.toFixed(2)),kpi.target],backgroundColor:[valColor+'CC',col+'55'],borderColor:[valColor,col],borderWidth:1,borderRadius:6}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:tc,font:{size:11}},grid:{display:false},border:{display:false}},y:{ticks:{color:tc,font:{size:10}},grid:{color:gc},border:{display:false}}}}
  });
}

function renderGlobalCharts() {
  const tc = 'rgba(234,242,255,.88)';
  const gc = 'rgba(234,242,255,.10)';

  const axisScores = [1,2,3,4].map(ax=>{
    const kpis = KPIS.filter(k=>k.axis===ax);
    const score = kpis.reduce((s,k)=>{
      const v = avg(DATA[k.id]);
      const pct = k.higher ? Math.min(100,(v/k.target)*100) : Math.min(100,(k.target/v)*100);
      return s+pct;
    },0)/kpis.length;
    return parseFloat(score.toFixed(1));
  });

  document.getElementById('axis-scores').innerHTML = [1,2,3,4].map((ax,i)=>{
    const sc = axisScores[i];
    const col = AXIS_COLORS[ax];
    const pct = sc.toFixed(0);
    const sColor = sc>=90?'#639922':sc>=70?'#BA7517':'#E24B4A';
    return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:11px;color:var(--color-text-secondary)">${AXIS_LABELS[ax]}</span><span style="font-size:11px;font-weight:500;color:${sColor}">${pct}%</span></div><div style="height:6px;border-radius:3px;background:var(--color-background-secondary)"><div style="height:100%;border-radius:3px;width:${pct}%;background:${col}"></div></div></div>`;
  }).join('');

  if(globalRadarChart) globalRadarChart.destroy();
  globalRadarChart = new Chart(document.getElementById('globalRadar'), {
    type:'radar',
    data:{
      labels:['Scalabilité SI','Satisfaction client','Adéquation locale','Réactivité décision'],
      datasets:[
        {label:'Performance réelle',data:axisScores,backgroundColor:'rgba(55,138,221,.15)',borderColor:'#378ADD',borderWidth:1.5,pointBackgroundColor:'#378ADD',pointRadius:3},
        {label:'Objectif 100%',data:[100,100,100,100],backgroundColor:'rgba(99,153,34,.08)',borderColor:'#639922',borderDash:[4,3],borderWidth:1,pointRadius:2,pointBackgroundColor:'#639922'}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{ticks:{display:false},grid:{color:gc},pointLabels:{color:tc,font:{size:10}},suggestedMin:0,suggestedMax:100}}}
  });
}

function updateGlobalCharts() {
  if(globalRadarChart) {
    const axisScores = [1,2,3,4].map(ax=>{
      const kpis = KPIS.filter(k=>k.axis===ax);
      const score = kpis.reduce((s,k)=>{
        const v = avg(DATA[k.id]);
        const pct = k.higher?Math.min(100,(v/k.target)*100):Math.min(100,(k.target/v)*100);
        return s+pct;
      },0)/kpis.length;
      return parseFloat(score.toFixed(1));
    });
    globalRadarChart.data.datasets[0].data = axisScores;
    globalRadarChart.update();
    document.getElementById('axis-scores').innerHTML = [1,2,3,4].map((ax,i)=>{
      const sc = axisScores[i];
      const col = AXIS_COLORS[ax];
      const pct = sc.toFixed(0);
      const sColor = sc>=90?'#639922':sc>=70?'#BA7517':'#E24B4A';
      return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:11px;color:var(--color-text-secondary)">${AXIS_LABELS[ax]}</span><span style="font-size:11px;font-weight:500;color:${sColor}">${pct}%</span></div><div style="height:6px;border-radius:3px;background:var(--color-background-secondary)"><div style="height:100%;border-radius:3px;width:${pct}%;background:${col}"></div></div></div>`;
    }).join('');
  }
}

let globalView = 'radar';
function setGlobalView(v, el) {
  globalView = v;
  document.querySelectorAll('.seg').forEach(b=>b.classList.remove('on'));
  if(el) el.classList.add('on');
  document.getElementById('global-radar-view').classList.toggle('hidden', v!=='radar');
  document.getElementById('global-bar-view').classList.toggle('hidden', v!=='bar');
  document.getElementById('global-timeline-view').classList.toggle('hidden', v!=='timeline');
  if(v==='bar') renderGlobalBar();
  if(v==='timeline') renderTimeline();
}

function renderGlobalBar() {
  const tc = 'rgba(234,242,255,.88)';
  const gc = 'rgba(234,242,255,.10)';
  if(globalBarChart) globalBarChart.destroy();
  const labels = KPIS.map(k=>k.n);
  const vals = KPIS.map(k=>parseFloat(getBarPct(k).toFixed(1)));
  const colors = KPIS.map(k=>{const s=getStatus(k);return s==='ok'?'#639922':s==='warn'?'#BA7517':'#E24B4A';});
  globalBarChart = new Chart(document.getElementById('globalBar'), {
    type:'bar',
    data:{labels,datasets:[
      {label:'Performance %',data:vals,backgroundColor:colors,borderRadius:4},
      {label:'Objectif 100%',data:Array(16).fill(100),type:'line',borderColor:'#378ADD',borderDash:[4,3],borderWidth:1,pointRadius:0}
    ]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:tc,font:{size:10},callback:v=>v+'%'},grid:{color:gc},border:{display:false},min:0,max:110},y:{ticks:{color:tc,font:{size:10}},grid:{display:false},border:{display:false}}}}
  });
}

function renderTimeline() {
  const tl = document.getElementById('timeline-html');
  const events = [
    {t:'J+1',kpi:'KPI 04',what:'Complétude référentiel à 33,7%',action:'Blocage go/no-go automatique — ouverture interdite',type:'crit'},
    {t:'J+7',kpi:'KPI 03',what:'Erreurs config ERP à 8,7%',action:'Alerte DSI + audit ERP d\'urgence déclenché',type:'crit'},
    {t:'M+1',kpi:'KPI 09',what:'Conformité réglementaire à 93,7%',action:'Blocage légal — audit externe obligatoire',type:'crit'},
    {t:'M+2',kpi:'KPI 05',what:'NPS à 6,8 vs objectif 30',action:'Plan client d\'urgence + corrélation logistique',type:'warn'},
    {t:'M+2',kpi:'KPI 08',what:'Rupture stock pic à 4,6%',action:'Réapprovisionnement d\'urgence déclenché',type:'warn'},
    {t:'M+3',kpi:'KPI 10',what:'Adoption ERP à 84,8%',action:'Déploiement Key Users — 5 magasins prioritaires',type:'warn'},
    {t:'M+6',kpi:'KPI 16',what:'Décentralisation à 73,1%',action:'Réorganisation gouvernance — délégation P2/P3',type:'warn'},
    {t:'M+14',kpi:'Réel Target',what:'Prise de conscience publique de l\'échec',action:'Fermeture 133 magasins · 2,1 Md$ CAD de pertes',type:'crit'}
  ];
  tl.innerHTML = `<div style="position:relative;padding-left:80px;margin-top:8px">
    <div style="position:absolute;left:60px;top:0;bottom:0;width:1px;background:var(--color-border-tertiary)"></div>
    ${events.map(e=>`<div style="position:relative;margin-bottom:12px;min-height:40px">
      <div style="position:absolute;left:-68px;width:52px;text-align:right;font-size:10px;font-weight:500;color:${e.type==='crit'?'#A32D2D':'#854F0B'};top:2px">${e.t}</div>
      <div style="position:absolute;left:-5px;top:5px;width:10px;height:10px;border-radius:50%;background:${e.type==='crit'?'#E24B4A':'#EF9F27'};border:2px solid var(--color-background-primary)"></div>
      <div style="background:var(--color-background-secondary);border-radius:8px;padding:8px 12px;border-left:2px solid ${e.type==='crit'?'#E24B4A':'#EF9F27'}">
        <div style="font-size:10px;font-weight:500;color:${AXIS_COLORS[1]};margin-bottom:2px">${e.kpi}</div>
        <div style="font-size:11px;font-weight:500;color:var(--color-text-primary)">${e.what}</div>
        <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${e.action}</div>
      </div>
    </div>`).join('')}
  </div>`;
}

renderGrid();
renderGlobalCharts();
selectKPI('k03');