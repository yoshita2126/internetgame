/* 6G Network Challenge — no server, account, or external AI required. */
(()=>{
'use strict';
const S=window.NetworkSim;
const $=id=>document.getElementById(id);
const format=n=>Math.round(n).toLocaleString('en-US');
const STORAGE='6NEXUS:progress:v1',SCORES='6NEXUS:scores:v1',PROFILE='6NEXUS:profile:v1';
const paths={
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 trophy:'<path d="M8 4h8v5a4 4 6 0 1-8 0ZM8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v6m-4 2h8m-6-2h4"/>',
 book:'<path d="M12 5c-3-2-7-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-6-1-9 1Zm0 0v15"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 2.5m0 3h.01"/>',
 play:'<path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none"/>',
 pause:'<path d="M8 5v14M16 5v14" stroke-width="3"/>',
 arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
 shield:'<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z"/>',
 spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Zm7-2v4m-2-2h4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 0v3m0 4v5m6-8 2-2"/>',
 restart:'<path d="M3 11a9 9 1 1 1 2 7M3 4v7h7"/>',
 activity:'<path d="M2 12h4l3-8 6 16 3-8h4"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>',
 check:'<path d="m5 12 4 5L20 6"/>',
 network:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m11 7-5 9m7-9 5 9M7.5 18h9"/>',
 sliders:'<path d="M4 7h5m4 0h7M4 17h9m4 0h3"/><circle cx="11" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 radio:'<path d="M9 9a4 4 1 0 1 6 0M5 6a9 9 1 0 1 14 0M9 20l3-9 3 9m-5-3h4"/><circle cx="12" cy="10" r="1"/>',
 chart:'<path d="M3 3v18h18M6 15l4-5 4 2 6-7"/>',
 heart:'<path d="M20.5 4.6a5.4 5.4 0 0 0-7.6 0L12 5.5l-.9-.9a5.4 5.4 0 0 0-7.6 7.6L12 21l8.5-8.8a5.4 5.4 0 0 0 0-7.6Z"/><path d="M4 12h4l2-4 3 8 2-4h5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
 terminal:'<path d="m4 6 5 6-5 6m9 0h7"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
 car:'<path d="m4 10 2-6h12l2 6M3 10h18v8H3Zm2 8v2m14-2v2M6 14h2m8 0h2"/>',
 vr:'<path d="M4 6h16l2 11-7 1-3-3-3 3-7-1ZM7 10v3m10-3v3"/>',
 factory:'<path d="M3 21V9l6 4V9l6 4V3h4l2 18ZM7 17h1m4 0h1m4 0h1"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4m-3 14h2"/>',
 cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 warning:'<path d="m12 3 10 18H2Zm0 6v5m0 3h.01"/>'
};
function icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.network}</svg>`;}
function icons(node=document){node.querySelectorAll('i[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
let storageAvailable=true;
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{if(storageAvailable){storageAvailable=false;toast('Browser storage is unavailable. This session will still work.');}}}
let leaderboard=read(SCORES,[]);if(!Array.isArray(leaderboard))leaderboard=[];
leaderboard=leaderboard.filter(x=>x&&typeof x.name==='string'&&['score','level','throughput','efficiency','reliability'].every(k=>Number.isFinite(x[k]))).slice(0,30);
let profile=read(PROFILE,{name:'Network Engineer',best:0});if(!profile||typeof profile.name!=='string'||!Number.isFinite(profile.best))profile={name:'Network Engineer',best:0};
let state=S.newState(),selectedStation=0,zoom=1,chartMetric='throughput',modalResume=false,toastTimeout,aiProposal=null;
const saved=read(STORAGE,null);
function validSave(s){return s&&s.version===1&&['running','paused','levelComplete','gameover','won'].includes(s.status)&&Number.isInteger(s.level)&&s.level>=1&&s.level<=5&&['time','elapsed','score','health'].every(k=>Number.isFinite(s[k])&&s[k]>=0)&&s.time<=60&&s.health<=100&&s.allocation?.length===6&&s.allocation.every(x=>Number.isInteger(x)&&x>=0&&x<=100)&&S.sum(s.allocation)<=100&&Array.isArray(s.history)&&s.history.every(x=>['time','throughput','latency','energy','reliability'].every(k=>Number.isFinite(x[k])))&&Array.isArray(s.events)&&s.events.every(x=>Number.isFinite(x.time)&&typeof x.message==='string')&&Array.isArray(s.eventDeck)&&s.eventDeck.every(x=>S.EVENTS[x.type]&&Number.isFinite(x.at)&&Number.isInteger(x.station)&&x.station>=0&&x.station<4)&&(!s.event||(S.EVENTS[s.event.type]&&Number.isFinite(s.event.remaining)&&Number.isInteger(s.event.station)&&s.event.station>=0&&s.event.station<4))&&Number.isInteger(s.eventIndex)&&Number.isInteger(s.mission)&&s.mission>=-1&&s.mission<6&&Number.isFinite(s.missionProgress)&&Number.isFinite(s.missionDelay)&&Array.isArray(s.missionCompleted)&&s.missionCompleted.every(i=>Number.isInteger(i)&&i>=0&&i<6)&&s.totals&&['throughput','energy','reliability','ticks'].every(k=>Number.isFinite(s.totals[k])&&s.totals[k]>=0)&&Number.isFinite(s.boost)&&Number.isFinite(s.boostCooldown);}
if(validSave(saved)){state=saved;if(state.status==='running')state.status='paused';state.demands=S.demandAt(state.level,state.elapsed,state.event);state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));}
if(!state.events.length)S.log(state,'Simulation initialized. Awaiting engineer deployment.');
function save(){if(state.status!=='ready')write(STORAGE,state);if(state.score>profile.best){profile.best=Math.round(state.score);write(PROFILE,profile);}}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),4200);}

function buildControls(){
 $('allocation-controls').innerHTML=S.APPS.map((a,i)=>`<div class="allocation-row" style="--slice:${a.color}"><div class="allocation-row-top"><span class="app-icon"><i data-icon="${a.icon}"></i></span><label class="app-name" for="allocation-${i}">${a.name}</label>${a.critical?'<span class="critical">CRITICAL</span>':''}<output class="allocation-percent" id="allocation-output-${i}" for="allocation-${i}"></output></div><div class="allocation-slider-row"><input type="range" id="allocation-${i}" data-allocation="${i}" min="0" max="100" step="1" aria-label="${a.name} bandwidth allocation" title="Percentage of the shared spectrum budget"><span class="demand-label" id="demand-${i}"></span></div></div>`).join('');
 $('spectrum-bar').innerHTML=S.APPS.map((a,i)=>`<span id="spectrum-${i}" style="--slice:${a.color}"></span>`).join('');icons($('allocation-controls'));
 document.querySelectorAll('[data-allocation]').forEach(input=>input.addEventListener('input',()=>{
  if(['gameover','won','levelComplete'].includes(state.status))return;
  const i=Number(input.dataset.allocation),available=100-S.sum(state.allocation)+state.allocation[i],requested=Number(input.value);
  state.allocation[i]=Math.min(requested,available);
  if(requested>available)toast('Spectrum is fully allocated. Lower another slice to free resources.');
  state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));renderMetrics();renderAllocation();renderMapState();save();
 }));
}
const stations=[{name:'ALPHA',x:235,y:166,sector:'MOBILITY DISTRICT'},{name:'BRAVO',x:488,y:108,sector:'INDUSTRIAL ZONE'},{name:'CHARLIE',x:690,y:240,sector:'CIVIC CENTER'},{name:'DELTA',x:430,y:314,sector:'RESIDENTIAL GRID'}];
let devices=[];
function buildMap(){
 const svg=$('network-map');let content=`<defs><filter id="packet-glow"><feGaussianBlur stdDeviation="2"/></filter><filter id="tower-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="city-glow"><stop stop-color="#1b4c5b" stop-opacity=".26"/><stop offset="1" stop-color="#0d1523" stop-opacity="0"/></radialGradient><linearGradient id="river"><stop stop-color="#123148"/><stop offset="1" stop-color="#0c2639"/></linearGradient></defs><g id="map-world"><ellipse cx="454" cy="232" rx="390" ry="205" fill="url(#city-glow)"/><path d="M-20 321C115 270 173 355 272 343S413 212 555 251 720 163 930 184" fill="none" stroke="url(#river)" stroke-width="30" opacity=".52"/><path d="M-20 321C115 270 173 355 272 343S413 212 555 251 720 163 930 184" fill="none" stroke="#28485d" stroke-width="1" opacity=".5"/>`;
 // Isometric city footprints, kept in SVG so the map is crisp at any viewport.
 content+='<g transform="translate(455 214) matrix(1 .36 -1 .36 0 0)">';
 for(let row=-5;row<=5;row++)for(let col=-5;col<=5;col++){
  const seed=Math.abs(Math.sin(row*43.4+col*28.7));if(seed<.17||(Math.abs(row)+Math.abs(col)>8))continue;
  const x=col*43,y=row*43,w=24+seed*7,h=23+(1-seed)*7;
  content+=`<rect class="city-block" x="${x}" y="${y}" width="${w}" height="${h}" rx="1"/><rect x="${x+4}" y="${y+4}" width="${w-8}" height="${h-8}" fill="#23445b" opacity="${.1+seed*.12}"/>`;
 }
 for(let i=-6;i<=6;i++)content+=`<path class="city-street ${i%3===0?'major':''}" d="M${i*43-6},-250V250M-270,${i*43-6}H270"/>`;
 content+='</g>';
 content+='<path d="m110 215 310-132 354 133-335 157Z" fill="none" stroke="#305c71" stroke-width=".8" stroke-dasharray="3 5" opacity=".25"/>';
 const backs=[[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]];
 backs.forEach(([a,b],i)=>{const p=stations[a],q=stations[b],path=`M${p.x} ${p.y}Q${(p.x+q.x)/2} ${(p.y+q.y)/2-32} ${q.x} ${q.y}`;content+=`<path class="map-link backbone" d="${path}"/><circle r="2.1" fill="${i%3===0?'#b290ff':'#70fff0'}"><animateMotion dur="${3+i*.5}s" repeatCount="indefinite" path="${path}"/></circle>`;});
 devices=[];
 stations.forEach((st,index)=>{
  for(let j=0;j<8;j++){
   const angle=(j/8)*Math.PI*2+index*.9,rx=60+(j%3)*30,ry=35+(j%3)*19;
   const dx=st.x+Math.cos(angle)*rx,dy=st.y+Math.sin(angle)*ry;
   const path=`M${st.x} ${st.y}Q${(st.x+dx)/2+15} ${(st.y+dy)/2-8} ${dx} ${dy}`;
   const app=(j+index*2)%6,color=S.APPS[app].color;
   content+=`<g class="device-link" data-link-station="${index}" data-link-app="${app}"><path class="map-link" d="${path}" style="stroke:${color}"/><circle class="map-packet" r="3" fill="${color}"><animateMotion dur="${2.5+j*.37}s" begin="-${j*.8}s" repeatCount="indefinite" path="${path}"/></circle><circle r="1.4" fill="${color}"><animateMotion dur="${2.5+j*.37}s" begin="-${j*.8}s" repeatCount="indefinite" path="${path}"/></circle><g class="device-group" transform="translate(${dx} ${dy})"><rect class="device-symbol" x="-8" y="-8" width="16" height="16" rx="4" style="stroke:${color}"/><g transform="translate(-5 -5) scale(.42)" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths[S.APPS[app].icon]}</g></g></g>`;
   devices.push({station:index,app});
  }
 });
 stations.forEach((st,i)=>{
  content+=`<g class="tower ${i===0?'selected':''}" id="tower-${i}" data-station="${i}" role="button" tabindex="0" aria-label="Inspect base station ${st.name}" transform="translate(${st.x} ${st.y})"><ellipse class="tower-halo" rx="64" ry="29"/><ellipse class="tower-halo" rx="46" ry="21"/><path d="m-22 7 22-12 22 12-22 12Z" fill="#163e4866" stroke="#3a9b933d"/><path class="tower-core" d="m-21 0 21-12L21 0 0 12Z"/><path d="M-8 0 0-23 8 0M-5-8H5M-3-15H3" fill="none" stroke="#97fff0" stroke-width="1.4"/><circle cy="-24" r="2.3" fill="#95fff2"/><path d="M-6-29a8 8 0 0 1 12 0m-17-4a15 15 0 0 1 22 0" fill="none" stroke="#69ded4" stroke-width="1" opacity=".8"/><rect x="-34" y="22" width="68" height="15" rx="3" fill="#0c192a" stroke="#2c465b" stroke-width=".7"/><text class="tower-name" y="32" text-anchor="middle">${st.name} <tspan fill="#5be0d3">6G</tspan></text><text class="tower-caption" y="47" text-anchor="middle" id="tower-status-${i}">ONLINE · 8 DEVICES</text></g>`;
 });
 content+='<text class="map-label" x="75" y="105">MOBILITY DISTRICT</text><text class="map-label" x="576" y="55">INDUSTRIAL ZONE</text><text class="map-label" x="697" y="354">CIVIC CENTER</text><text class="map-label" x="155" y="378">RESIDENTIAL GRID</text></g>';
 svg.innerHTML=content;
 svg.querySelectorAll('[data-station]').forEach(el=>{const select=()=>{selectedStation=Number(el.dataset.station);renderMapState();showStation();};el.addEventListener('click',select);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});});
}
function renderMapState(){
 const m=state.metrics,offline=state.event?.type==='failure'?state.event.station:-1;
 if(['paused','levelComplete','gameover','won'].includes(state.status)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)$('network-map').pauseAnimations();else $('network-map').unpauseAnimations();
 $('users-count').textContent=m.connected;$('tower-count').textContent=`/ ${offline<0?4:3} active stations`;
 stations.forEach((st,i)=>{const t=$(`tower-${i}`);t.classList.toggle('offline',i===offline);t.classList.toggle('selected',i===selectedStation);$(`tower-status-${i}`).textContent=i===offline?'OFFLINE · REROUTE':`ONLINE · ${Math.round(m.connected/(offline<0?4:3))} DEVICES`;});
 document.querySelectorAll('.device-link').forEach(el=>{const index=Number(el.dataset.linkApp),failed=Number(el.dataset.linkStation)===offline;el.style.opacity=failed?'.17':'1';el.querySelectorAll('circle').forEach(packet=>packet.style.display=failed||m.apps[index].capacity<.1?'none':'');el.querySelector('.map-link').style.stroke=failed?'#ff806d':m.apps[index].deficit>.2?'#ff9678':m.apps[index].deficit>.04?'#a78afa':S.APPS[index].color;});
 const st=stations[selectedStation];$('station-detail').querySelector('strong').textContent=`BASE STATION ${st.name}`;$('station-detail').querySelector(':scope > div > span').textContent=selectedStation===offline?'Offline · click tower to reroute':'Terahertz link · 6G active';$('station-load').textContent=selectedStation===offline?'OFFLINE':`${Math.min(100,Math.round(m.throughput/m.capacity*100))}% LOAD`;
 $('map-status').textContent=state.status==='ready'?'PREVIEW':state.status==='paused'?'PAUSED':state.event?'EVENT ACTIVE':state.status==='running'?'LIVE NETWORK':'SESSION ENDED';
}
function renderAllocation(){
 const used=S.sum(state.allocation);$('budget-used').innerHTML=`${used}<span> / 100%</span>`;$('budget-remaining').textContent=`${100-used}%`;
 S.APPS.forEach((a,i)=>{const input=$(`allocation-${i}`);input.value=state.allocation[i];input.style.setProperty('--fill',`${state.allocation[i]}%`);
  input.disabled=['gameover','won','levelComplete'].includes(state.status);input.setAttribute('aria-valuetext',`${state.allocation[i]} percent, ${state.metrics.apps[i].capacity.toFixed(1)} Gbps allocated, ${state.demands[i].toFixed(1)} Gbps requested`);
  $(`allocation-output-${i}`).textContent=`${state.allocation[i]}%`;$(`demand-${i}`).textContent=`${state.demands[i].toFixed(0)} Gbps req.`;$(`demand-${i}`).classList.toggle('danger',state.metrics.apps[i].deficit>.1);$(`spectrum-${i}`).style.width=`${state.allocation[i]}%`;
 });
}
function sparkline(key,color){
 let values=state.history.slice(-18).map(x=>x[key]);if(values.length<2)values=[.45,.5,.42,.66,.62,.72,.59,.72,.78,.71,.76,.82,.77,.9,.84,.87].map(x=>x*state.metrics[key]);
 const min=Math.min(...values)*.82,max=Math.max(...values)*1.08;
 const pts=values.map((v,i)=>`${i/(values.length-1)*100},${27-(v-min)/Math.max(max-min,.1)*24}`).join(' ');
 $(`spark-${key}`).innerHTML=`<defs><linearGradient id="spark-fill-${key}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><polygon points="0,30 ${pts} 100,30" fill="url(#spark-fill-${key})"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.3"/>`;
}
function renderMetrics(){
 const m=state.metrics;
 $('metric-throughput').textContent=m.throughput.toFixed(1);$('metric-latency').textContent=m.latency.toFixed(2);$('metric-energy').textContent=m.energy.toFixed(1);$('metric-reliability').textContent=m.reliability.toFixed(2);
 $('throughput-caption').innerHTML=`<b>↑</b> ${m.connected} devices connected · ${m.capacity.toFixed(0)} Gbps capacity`;
 $('latency-caption').innerHTML=`<b>${m.latency<5?'↓':'↑'}</b> ${m.latency<5?'Within target':'Above 5 ms target'} · ${m.dropped} dropped connections`;
 $('energy-caption').innerHTML=`<b>↗</b> ${Math.round(m.energy/m.powerLimit*100)}% of ${m.powerLimit.toFixed(1)} kW power budget`;
 $('reliability-caption').innerHTML=`<b>●</b> ${m.reliability>=99?'Healthy connections':m.reliability>=95?'Service degradation':'Critical service degradation'} · target ${state.level===5?'99.9':'99'}%`;
 $('metric-latency').classList.toggle('danger',m.latency>=5);$('metric-energy').classList.toggle('danger',m.energy>m.powerLimit);$('metric-reliability').classList.toggle('danger',m.reliability<95);
 $('reliability-ring').style.setProperty('--value',`${m.reliability}%`);
 $('bandwidth-value').textContent=`${m.throughput.toFixed(0)} / ${m.capacity.toFixed(0)} Gbps`;$('bandwidth-bar').style.width=`${Math.min(100,m.throughput/m.capacity*100)}%`;
 $('utilization-value').textContent=`${m.utilization.toFixed(0)}%`;$('utilization-bar').style.width=`${Math.min(100,m.utilization)}%`;
 $('packet-value').innerHTML=`${m.loss.toFixed(2)}<span>%</span>`;$('packet-value').classList.toggle('danger',m.loss>1);
 sparkline('throughput','#45e3dc');sparkline('latency','#ab85ff');sparkline('energy','#f2ca6e');
}
function renderChart(){
 const history=state.history,key=chartMetric,unit={throughput:'Gbps',latency:'ms',energy:'kW'}[key],name={throughput:'Throughput',latency:'Latency',energy:'Energy'}[key],color={throughput:'#45e3dc',latency:'#ab85ff',energy:'#f2ca6e'}[key];
 $('chart-label').textContent=`${name} (${unit})`;$('performance-chart').setAttribute('aria-label',`${name} over the last ${history.length} seconds`);
 const max=Math.max(key==='throughput'?S.LEVELS[state.level-1].capacity:key==='latency'?6:state.metrics.powerLimit,...history.map(x=>x[key]))*1.1;
 let svg=`<defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}" stop-opacity=".19"/><stop offset="1" stop-color="${color}" stop-opacity=".01"/></linearGradient></defs>`;
 for(let i=0;i<4;i++){const y=15+i*34;svg+=`<path class="chart-grid" d="M36 ${y}H711"/><text class="chart-text" x="0" y="${y+3}">${Math.round(max*(1-i/3))}</text>`;}
 const points=history.map((v,i)=>[36+(i/59)*675,117-v[key]/max*102]);
 if(points.length>0){const pts=points.map(p=>p.join(',')).join(' ');svg+=`<polygon points="${points[0][0]},117 ${pts} ${points[points.length-1][0]},117" fill="url(#chart-fill)"/><polyline class="chart-line" style="stroke:${color}" points="${pts}"/><circle cx="${points.at(-1)[0]}" cy="${points.at(-1)[1]}" r="3" fill="${color}"/>`;}
 else svg+='<text class="empty-chart" text-anchor="middle" x="380" y="65">Live telemetry begins when you start the challenge</text>';
 for(let i=0;i<=4; i++){const seconds=history.length?Math.max(0,history[0].time)+i*15:i*15;svg+=`<text class="chart-text" text-anchor="${i===0?'start':i===4?'end':'middle'}" x="${36+i*168.75}" y="143">${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}</text>`;}
 $('performance-chart').innerHTML=svg;
}
function renderMission(){
 const mission=S.MISSIONS[state.mission];
 if(!mission){$('mission-title').textContent='All available missions complete';$('mission-description').textContent=state.level<3?'More missions unlock in the Smart City level.':'Keep your network performing to earn more points.';$('mission-progress-text').textContent=`${state.missionsEarned} missions completed`;$('mission-percent').textContent='100%';$('mission-bar').style.width='100%';$('mission-reward').textContent='WELL PLAYED';return;}
 const complete=state.missionCompleted.includes(state.mission);
 $('mission-title').textContent=mission.title;$('mission-description').textContent=complete?'Mission complete. Excellent engineering!':mission.description;$('mission-reward').textContent=`+${mission.reward} PTS`;
 const progress=Math.min(mission.target,state.missionProgress),percent=Math.round(progress/mission.target*100);
 $('mission-progress-text').textContent=`${progress} / ${mission.target} ${mission.unit}`;$('mission-percent').textContent=`${percent}%`;$('mission-bar').style.width=`${percent}%`;
 $('mission-note').textContent=state.mission===5?'A surge can arrive in levels 3–5. Keep integrity above zero.':'Hold the target continuously. The counter resets if it slips.';
}
function render(){
 document.body.classList.toggle('playing',state.status!=='ready');document.body.classList.toggle('paused',state.status==='paused');
 $('level-name').textContent=S.LEVELS[state.level-1].name;$('level-chip').textContent=`LVL ${String(state.level).padStart(2,'0')} `;
 $('session-description').textContent=state.status==='ready'?'Initialize your network to begin':state.event?`${S.EVENTS[state.event.type].name} · ${state.event.remaining}s remaining`:S.LEVELS[state.level-1].caption;
 $('level-track').innerHTML=S.LEVELS.map((l,i)=>`<span class="${i+1===state.level?'current':i+1<state.level?'complete':''}" title="Level ${i+1}: ${l.name}"><b>${i+1<state.level?'✓':i+1}</b></span>`).join('');
 $('score').textContent=format(state.score);$('score-rate').textContent=state.status==='running'?`${state.metrics.scoreRate>=0?'+':''}${Math.round(state.metrics.scoreRate)}/s`:'PTS';$('score-rate').classList.toggle('danger',state.metrics.scoreRate<0);
 $('timer').textContent=`${String(Math.floor(state.time/60)).padStart(2,'0')}:${String(Math.ceil(state.time%60)).padStart(2,'0')}`;
 $('profile-score').innerHTML=`${format(state.score)}<span> PTS</span>`;$('profile-level').innerHTML=`${String(state.level).padStart(2,'0')} <span> / 05</span>`;$('best-score').innerHTML=`${format(Math.max(profile.best,state.score))}<span> PTS</span>`;
 $('profile-rank').textContent=state.status==='ready'?'Network rookie':S.LEVELS[state.level-1].name;$('profile-caption').textContent=state.status==='ready'?'Ready to make the connection?':`${state.missionsEarned} missions completed · ${profile.name}`;
 $('start-button').querySelector('span').textContent={ready:'START CHALLENGE',running:'NETWORK LIVE',paused:'RESUME CHALLENGE',levelComplete:'CONTINUE TO NEXT LEVEL',won:'PLAY AGAIN',gameover:'TRY AGAIN'}[state.status];
 $('start-button').disabled=state.status==='running';$('pause-button').disabled=!['running','paused'].includes(state.status);$('pause-button').innerHTML=icon(state.status==='paused'?'play':'pause');$('pause-button').setAttribute('aria-label',state.status==='paused'?'Resume game':'Pause game');
 $('health-value').textContent=`${Math.ceil(state.health)}%`;$('health-bar').style.width=`${state.health}%`;$('health-bar').style.background=state.health<30?'var(--orange)':state.health<60?'var(--yellow)':'var(--green)';$('health-label').textContent=state.health<30?'Critical':state.health<60?'Degraded':'Stable';
 const event=state.events[0];$('latest-event').innerHTML=`<b class="status-dot"></b><time>${timeLabel(event.time)}</time><span>${escapeHTML(event.message)}${state.event?`<b class="event-countdown">${state.event.remaining}s</b>`:''}</span>`;$('event-count').textContent=String(state.events.length).padStart(2,'0');document.querySelector('.event-strip').classList.toggle('event-active',!!state.event);
 renderAllocation();renderMetrics();renderMapState();renderChart();renderMission();
}
function timeLabel(n){return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
function openModal(title,eyebrow,content,footer='',wide=false){
 if(!$('modal').open){modalResume=state.status==='running';if(modalResume)state.status='paused';}
 $('modal').classList.toggle('modal-wide',wide);
 $('modal-content').innerHTML=`<div class="modal-header"><div><span class="eyebrow">${eyebrow}</span><h2 id="dialog-title">${title}</h2></div><button class="icon-button" data-action="close" aria-label="Close dialog"><i data-icon="close"></i></button></div><div class="modal-content">${content}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;
 $('modal').setAttribute('aria-labelledby','dialog-title');icons($('modal-content'));if(!$('modal').open)$('modal').showModal();render();save();
}
function closeModal(){if($('modal').open)$('modal').close();if(modalResume&&state.status==='paused')state.status='running';modalResume=false;render();save();}
function showHelp(){
 openModal('A connected city. Your command.','ENGINEER FIELD GUIDE',`<p class="modal-intro">Keep a city connected for five one-minute levels. Use the six sliders to share a <strong>100% spectrum budget</strong>. Watch the live telemetry and adapt when traffic changes.</p><div class="help-steps"><div class="help-step"><b>01</b><h3>Connect the city</h3><p>Start with a balanced allocation. Each percentage reserves a slice of your level's bandwidth capacity. Unused spectrum saves power.</p></div><div class="help-step"><b>02</b><h3>Protect critical services</h3><p>Compare each slider's allocation with its requested Gbps. Autonomous vehicles and emergency services need especially fast, reliable links.</p></div><div class="help-step"><b>03</b><h3>Respond to events</h3><p>Spikes, station failures, and power limits can disrupt service. Click a station to boost capacity or reroute an outage. AI Optimize proposes an allocation you can compare and apply.</p></div><div class="help-step"><b>04</b><h3>Survive & score</h3><p>Healthy traffic earns points each second. Congestion and dropped connections subtract points and damage integrity. At zero integrity, the session ends. Survive 60 seconds to advance.</p></div></div><div class="help-note"><strong>Quick start:</strong> Try the initial allocation, keep latency below 5 ms for your first +500 point mission, then try AI Optimize during the first traffic event.<br><strong>Controls:</strong> arrow keys adjust a focused slider; Space pauses/resumes outside controls. Help and strategy dialogs pause the clock. Progress saves automatically in this browser.</div><p class="small-note" style="margin-top:15px">All figures are simulated for learning. Units: Gbps for data rate, milliseconds for latency, and kW for instantaneous electrical power. 6G technology and deployment specifications are still evolving.</p>`, `<button class="button primary" data-action="help-start">${state.status==='ready'?'LET’S CONNECT':'BACK TO THE NETWORK'} <i data-icon="arrow"></i></button>`);
}
function showRequirements(){
 openModal('Every connection has a purpose.','RESOURCE ALLOCATION',`<p class="modal-intro">Allocation is a share of total capacity. At this level, <strong>1% = ${(S.context(state).capacity/100).toFixed(2)} Gbps</strong> before any power throttling. Lower a slice to free budget for another. Idle reserved bandwidth still consumes power.</p><div class="table-scroll"><table class="requirements-table"><thead><tr><th>APPLICATION</th><th>DEMAND</th><th>LATENCY TARGET</th><th>RELIABILITY</th><th>POWER / GBPS</th></tr></thead><tbody>${S.APPS.map((a,i)=>`<tr><td>${a.name}</td><td>${state.demands[i].toFixed(1)} Gbps</td><td>≤ ${a.latency} ms</td><td>${a.reliability}%</td><td>${a.energy.toFixed(3)} kW</td></tr>`).join('')}</tbody></table></div><div class="help-note">The network also uses 2.4 kW of base power. Exceeding your power budget throttles all slices. On Level 5, queueing adds 16% more delay. Targets guide the optimizer; your score measures the whole network.</div>`,`<button class="button primary" data-action="close">GOT IT <i data-icon="check"></i></button>`,true);
}
function showAI(){
 const ctx=S.context(state),mine=S.evaluate(state.allocation,state.demands,ctx),proposal=S.optimize(state.demands,ctx);aiProposal=proposal.allocation;
 const ai=proposal.metrics,rows=[['Throughput',mine.throughput,ai.throughput,'Gbps',1],['Average latency',mine.latency,ai.latency,'ms',2],['Power consumption',mine.energy,ai.energy,'kW',2],['Network reliability',mine.reliability,ai.reliability,'%',2],['Packet loss',mine.loss,ai.loss,'%',2],['Expected score rate',mine.scoreRate,ai.scoreRate,'pts/s',1]];
 const constrained=ai.congestion>.03;
 openModal('My Strategy vs AI Strategy','AI RECOMMENDATION · LOCAL HEURISTIC',`<div class="ai-reason"><i data-icon="spark"></i><span>${constrained?'Demand exceeds available resources. This allocation protects emergency and autonomous links first, then distributes capacity to the remaining services. Some congestion is unavoidable until the event ends.':'Meet current demand with the smallest useful slices. Emergency and autonomous links receive first priority; unneeded spectrum stays free to reduce power consumption.'}</span></div><table class="comparison-table"><thead><tr><th>EXPECTED PERFORMANCE</th><th>MY STRATEGY</th><th>AI STRATEGY</th></tr></thead><tbody>${rows.map(([name,a,b,unit,digits])=>`<tr><td>${name}</td><td>${a.toFixed(digits)} ${unit}</td><td>${b.toFixed(digits)} ${unit}</td></tr>`).join('')}</tbody></table><div class="ai-allocation">${S.APPS.map((a,i)=>`<div><span>${a.name}</span><strong>${aiProposal[i]}% <small>${(aiProposal[i]/100*ctx.capacity).toFixed(1)} Gbps</small></strong></div>`).join('')}</div><p class="small-note">${S.sum(aiProposal)}% allocated · ${100-S.sum(aiProposal)}% held in reserve. Both strategies use the same traffic snapshot and event conditions. This is a simulated priority heuristic, not an external AI model. Future traffic can change the outcome.</p>`, `<button class="button secondary" data-action="close">KEEP MY STRATEGY</button><button class="button primary" data-action="apply-ai" ${['gameover','won','levelComplete'].includes(state.status)?'disabled':''}>APPLY AI STRATEGY <i data-icon="check"></i></button>`);
}
function showMissions(){
 openModal('Small decisions. Big impact.','MISSION CONTROL',`<p class="modal-intro">Missions arrive in a random order as you complete them. Each requires consecutive seconds at its target. Network integrity must stay above zero.</p><div class="mission-list">${S.MISSIONS.map((m,i)=>`<div><i data-icon="${state.missionCompleted.includes(i)?'check':i===state.mission?'target':'shield'}"></i><div><h3>${m.title}</h3><p>${state.missionCompleted.includes(i)?'COMPLETED':i===state.mission?'ACTIVE MISSION':i>=4&&state.level<3?'UNLOCKS IN LEVEL 3':m.description}</p></div><span class="reward">+${m.reward}</span></div>`).join('')}</div>`, `<button class="button primary" data-action="close">BACK TO NETWORK <i data-icon="arrow"></i></button>`);
}
const sampleScores=[{name:'QuantumPilot',score:16480,level:5,throughput:209.6,efficiency:11.8,reliability:99.87},{name:'NexusNova',score:14720,level:5,throughput:193.2,efficiency:11.3,reliability:99.42},{name:'PacketWizard',score:12950,level:5,throughput:180.4,efficiency:10.6,reliability:98.94},{name:'NeonEngineer',score:10640,level:4,throughput:158.7,efficiency:10.2,reliability:98.65},{name:'SignalSurfer',score:8910,level:4,throughput:143.5,efficiency:9.8,reliability:97.86}];
function showLeaderboard(){
 const rows=[...sampleScores,...leaderboard.map(x=>({...x,local:true}))].sort((a,b)=>b.score-a.score).slice(0,15);
 openModal('The network’s finest.','ENGINEER LEADERBOARD',`<p class="modal-intro">See how your engineering stacks up. Neon-highlighted results are sessions completed in this browser; other players are fictional examples.</p><div class="table-scroll"><table class="leader-table"><thead><tr><th>RANK</th><th>ENGINEER</th><th>SCORE</th><th>LEVEL</th><th>AVG. GBPS</th><th>GBPS / KW</th><th>RELIABILITY</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${r.local?'local-player':''}"><td>${String(i+1).padStart(2,'0')}</td><td><div class="leader-name"><span class="leader-avatar">${escapeHTML(r.name.slice(0,2).toUpperCase())}</span>${escapeHTML(r.name)}${r.local?' · YOU':''}</div></td><td>${format(r.score)}</td><td>${r.level}</td><td>${r.throughput.toFixed(1)}</td><td>${r.efficiency.toFixed(2)}</td><td>${r.reliability.toFixed(2)}%</td></tr>`).join('')}</tbody></table></div><p class="small-note" style="margin-top:15px">Throughput and reliability are session averages. Energy efficiency is total throughput samples divided by total power samples, in Gbps/kW. Top 15 local sessions are retained.</p>`, `<button class="button primary" data-action="close">BACK TO NETWORK <i data-icon="arrow"></i></button>`,true);
}
function showEvents(){
 openModal('Every signal tells a story.','NETWORK EVENT LOG',`<div class="event-log">${state.events.map(e=>`<div><time>${timeLabel(e.time)}</time><span>${escapeHTML(e.message)}</span></div>`).join('')}</div>`,`<button class="button primary" data-action="close">BACK TO NETWORK</button>`);
}
function showStation(){
 const offline=state.event?.type==='failure'&&state.event.station===selectedStation,ctx=S.context(state);
 openModal(`Base station ${stations[selectedStation].name}`,'NETWORK INFRASTRUCTURE',`<p class="modal-intro">${stations[selectedStation].sector} · ${offline?'Station offline. A fiber handover can reroute this cell through the remaining stations.':'Terahertz radio link with coordinated multi-cell scheduling. All four stations share the spectrum slices on your dashboard.'}</p><div class="result-stats"><div><strong>${(ctx.capacity/4).toFixed(1)}</strong><span>NOMINAL CELL GBPS</span></div><div><strong>${offline?'0':Math.round(state.metrics.connected/(state.event?.type==='failure'?3:4))}</strong><span>CONNECTED DEVICES</span></div><div><strong>${offline?'OFF':'6G'}</strong><span>${offline?'STATION OFFLINE':'RADIO CORE ONLINE'}</span></div></div><div class="help-note">${offline?'Rerouting restores the unavailable capacity immediately and costs 200 points. Or wait for automatic recovery when the event ends.':'Boost coordinated transmission for 12 seconds: +12% capacity, +1.4 kW base power, and proportionally higher slice power. Cooldown: 25 seconds. Check your power budget first.'}</div>`, `<button class="button secondary" data-action="close">CLOSE</button><button class="button primary" data-action="${offline?'reroute':'boost'}" ${state.status==='ready'||!['running','paused'].includes(state.status)||(offline?state.score<200:state.boostCooldown>0)?'disabled':''}>${offline?'REROUTE · −200 PTS':state.boostCooldown>0?`COOLDOWN · ${state.boostCooldown}s`:'BOOST NETWORK'} <i data-icon="bolt"></i></button>`);
}
function startGame(){
 if(state.status==='running')return;
 if(state.status==='paused'){state.status='running';render();save();return;}
 if(state.status==='levelComplete'){showLevelComplete();return;}
 if(['won','gameover'].includes(state.status))state=S.newState();
 S.startLevel(state);S.log(state,'Network online. Meet traffic demand and keep integrity above zero.','success');toast('You’re online. Keep latency below 5 ms for your first mission.');render();save();
}
function restart(){
 if(state.status==='ready'){state.allocation=S.balanced();state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));render();return;}
 openModal('A fresh frequency.','RESTART CHALLENGE',`<p class="modal-intro">Start again at Level 1 with full network integrity and a new score. Your personal best and completed leaderboard entries are saved.</p>`,`<button class="button secondary" data-action="close">KEEP PLAYING</button><button class="button primary" data-action="confirm-restart">RESTART CHALLENGE <i data-icon="restart"></i></button>`);
}
function showLevelComplete(){
 const next=S.LEVELS[state.level];
 openModal('Connection secured.','LEVEL COMPLETE',`<div class="result-hero"><div class="result-emblem"><i data-icon="shield"></i></div><h3>${S.LEVELS[state.level-1].name}</h3><p>Your city stayed connected. A more demanding network awaits.</p></div><div class="result-stats"><div><strong>${format(state.score)}</strong><span>TOTAL SCORE</span></div><div><strong>${Math.ceil(state.health)}%</strong><span>INTEGRITY</span></div><div><strong>+${Math.round(state.health*5)}</strong><span>LEVEL BONUS</span></div></div><div class="next-level-note"><span>UP NEXT · LEVEL ${state.level+1}</span><strong>${next.name} · ${next.users} devices</strong></div><p class="small-note" style="margin-top:15px">${next.caption} Capacity increases to ${next.capacity} Gbps, power budget to ${next.power} kW. You recover 25 integrity on advancing.</p>`,`<button class="button primary" data-action="next-level">NEXT LEVEL <i data-icon="arrow"></i></button>`);
}
function finalizeResult(){
 if(state.resultSaved)return;
 const n=Math.max(1,state.totals.ticks);
 state.resultId=`${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
 leaderboard.push({id:state.resultId,name:profile.name,score:Math.round(state.score),level:state.level,throughput:state.totals.throughput/n,efficiency:state.totals.throughput/Math.max(state.totals.energy,1),reliability:state.totals.reliability/n});
 leaderboard.sort((a,b)=>b.score-a.score);leaderboard=leaderboard.slice(0,15);write(SCORES,leaderboard);state.resultSaved=true;save();
}
function showGameOver(){
 finalizeResult();const won=state.status==='won';
 openModal(won?'You connected the future.':'Even great networks go offline.',won?'6G MASTER · CHALLENGE COMPLETE':'NETWORK OFFLINE · SESSION ENDED',`<div class="result-hero"><div class="result-emblem"><i data-icon="${won?'trophy':'radio'}"></i></div><h3>${won?'Master of the network.':'Time to rethink the allocation.'}</h3><p>${won?'Five levels. An entire city. One exceptional engineer.':'Congestion exhausted your network integrity. Try protecting critical slices and using AI Optimize when demand changes.'}</p></div><div class="result-stats"><div><strong>${format(state.score)}</strong><span>FINAL SCORE</span></div><div><strong>${state.level}</strong><span>LEVEL REACHED</span></div><div><strong>${state.missionsEarned}</strong><span>MISSIONS COMPLETE</span></div></div><div class="name-field"><label for="player-name">Leaderboard name</label><input id="player-name" maxlength="20" value="${escapeHTML(profile.name)}" placeholder="Network Engineer" autocomplete="nickname"></div><p class="small-note" style="margin-top:12px">Your score is already saved locally. Change your name and select Save & view leaderboard to update it.</p>`,`<button class="button secondary" data-action="result-leaderboard">SAVE & VIEW LEADERBOARD</button><button class="button primary" data-action="play-again">PLAY AGAIN <i data-icon="restart"></i></button>`);
}
function saveName(){const input=$('player-name');if(!input)return;profile.name=input.value.trim().slice(0,20)||'Network Engineer';const result=leaderboard.find(x=>x.id===state.resultId);if(result)result.name=profile.name;write(PROFILE,profile);write(SCORES,leaderboard);}
function togglePause(){if(state.status==='running')state.status='paused';else if(state.status==='paused')state.status='running';else return;toast(state.status==='paused'?'Network paused. Take a moment to plan.':'Network resumed.');render();save();}
const actions={
 start:startGame,help:showHelp,'allocation-help':showRequirements,leaderboard:showLeaderboard,missions:showMissions,events:showEvents,ai:showAI,pause:togglePause,restart,close:closeModal,
 dashboard:()=>{window.scrollTo({top:0,behavior:'smooth'});},
 'help-start':()=>{const ready=state.status==='ready';closeModal();if(ready)startGame();},
 balance:()=>{if(['gameover','won','levelComplete'].includes(state.status)){toast('Start a new level or session to change the allocation.');return;}state.allocation=S.balanced();state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));render();save();toast('Balanced allocation restored. 10% spectrum held in reserve.');},
 'apply-ai':()=>{if(!aiProposal||['gameover','won','levelComplete'].includes(state.status))return;state.allocation=[...aiProposal];state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));S.log(state,'AI strategy applied. Critical slices prioritized; spare spectrum released.','success');closeModal();toast('AI strategy applied. Watch the network adapt.');},
 'zoom-in':()=>{zoom=S.clamp(zoom+.15,1,1.75);updateZoom();},'zoom-out':()=>{zoom=S.clamp(zoom-.15,1,1.75);updateZoom();},'zoom-reset':()=>{zoom=1;updateZoom();},
 'confirm-restart':()=>{modalResume=false;closeModal();state=S.newState();startGame();},
 'next-level':()=>{if(state.status!=='levelComplete')return;modalResume=false;closeModal();state.level++;state.health=Math.min(100,state.health+25);S.startLevel(state);if(state.mission===-1)S.pickMission(state,Math.random);S.log(state,`Level ${state.level} ready: ${S.LEVELS[state.level-1].users} devices, ${S.LEVELS[state.level-1].capacity} Gbps capacity.`,'success');render();save();toast(`Welcome to ${S.LEVELS[state.level-1].name}. Your capacity has increased.`);},
 'play-again':()=>{saveName();modalResume=false;closeModal();state=S.newState();startGame();},
 'result-leaderboard':()=>{saveName();showLeaderboard();},
 boost:()=>{if(state.boostCooldown>0||!['running','paused'].includes(state.status))return;state.boost=12;state.boostCooldown=25;S.log(state,'Coordinated boost enabled: +12% capacity for 12 seconds. Extra power required.');state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));closeModal();toast('Network boosted for 12 seconds. Keep an eye on power.');},
 reroute:()=>{if(state.event?.type!=='failure'||state.score<200)return;state.score-=200;state.event=null;S.log(state,'Failed station traffic rerouted. Full capacity restored. −200 points.','success');state.demands=S.demandAt(state.level,state.elapsed,null);state.metrics=S.evaluate(state.allocation,state.demands,S.context(state));closeModal();toast('Traffic rerouted. All four cells are serving the city.');}
};
function updateZoom(){$('map-world').setAttribute('transform',`translate(${450*(1-zoom)} ${220*(1-zoom)}) scale(${zoom})`);}
document.addEventListener('click',e=>{const action=e.target.closest('[data-action]');if(action&&!action.disabled)actions[action.dataset.action]?.();const chart=e.target.closest('[data-chart]');if(chart){chartMetric=chart.dataset.chart;document.querySelectorAll('[data-chart]').forEach(b=>b.classList.toggle('selected',b===chart));renderChart();}});
$('modal').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat&&!$('modal').open&&!['INPUT','TEXTAREA','BUTTON','A'].includes(document.activeElement?.tagName)&&document.activeElement?.getAttribute('role')!=='button'){e.preventDefault();togglePause();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.status==='running'){state.status='paused';render();save();}});
window.addEventListener('beforeunload',save);
$('chart-wrap').addEventListener('pointermove',e=>{if(!state.history.length)return;const rect=$('chart-wrap').getBoundingClientRect(),fraction=S.clamp(((e.clientX-rect.left)/rect.width*720-36)/675,0,1),index=S.clamp(Math.round(fraction*59),0,state.history.length-1),item=state.history[index];$('chart-tooltip').hidden=false;$('chart-tooltip').style.left=`${Math.min(rect.width-125,Math.max(5,e.clientX-rect.left+10))}px`;$('chart-tooltip').textContent=`${timeLabel(item.time)} · ${item[chartMetric].toFixed(2)} ${{throughput:'Gbps',latency:'ms',energy:'kW'}[chartMetric]}`;});
$('chart-wrap').addEventListener('pointerleave',()=>$('chart-tooltip').hidden=true);
buildControls();buildMap();icons();render();
if(state.status==='paused')toast('Your network is saved. Select Resume to continue.');
setInterval(()=>{
 if(state.status!=='running')return;
 const notices=S.tick(state);render();save();
 for(const notice of notices){if(notice==='event')toast(S.EVENTS[state.event.type].name+' — check the network log.');if(notice==='mission')toast(`Mission complete! +${S.MISSIONS[state.mission].reward} points.`);if(notice==='levelComplete')showLevelComplete();if(notice==='gameover'||notice==='won')showGameOver();}
},1000);
})();




