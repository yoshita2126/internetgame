/* Deterministic, unit-consistent teaching model. This is not a 6G standards model. */
(function(root){
'use strict';
const APPS=[
 {id:'vehicle',name:'Autonomous Vehicle',icon:'car',color:'#49dfd4',demand:17,latency:2,reliability:99.9,energy:.07,base:.8,weight:2.6,critical:true},
 {id:'vr',name:'AR / VR User',icon:'vr',color:'#a78afa',demand:23,latency:5,reliability:99,energy:.085,base:1.6,weight:1.1},
 {id:'factory',name:'Smart Factory',icon:'factory',color:'#7caaff',demand:20,latency:3,reliability:99.9,energy:.075,base:1.2,weight:1.8},
 {id:'emergency',name:'Emergency Service',icon:'heart',color:'#ee92b1',demand:9,latency:1.5,reliability:99.99,energy:.065,base:.45,weight:3.8,critical:true},
 {id:'mobile',name:'Mobile User',icon:'phone',color:'#f2c775',demand:22,latency:10,reliability:98,energy:.06,base:2.3,weight:.9},
 {id:'iot',name:'IoT Sensors',icon:'cpu',color:'#76c5a6',demand:6,latency:20,reliability:97,energy:.035,base:3,weight:.65}
];
const LEVELS=[
 {name:'6G Beginner',caption:'Learn the spectrum. Connect your first 32 devices.',capacity:120,factor:1,users:32,power:13,duration:60,events:1},
 {name:'Growing Network',caption:'A growing city needs a smarter allocation.',capacity:160,factor:1.36,users:68,power:16.5,duration:60,events:2},
 {name:'Smart City',caption:'Autonomous streets. Connected factories. Zero excuses.',capacity:215,factor:1.83,users:128,power:20,duration:60,events:2},
 {name:'Network Crisis',caption:'Protect vital services through outages and traffic surges.',capacity:240,factor:2.05,users:188,power:21.5,duration:60,events:3},
 {name:'6G Master',caption:'Every millisecond matters. Keep the future connected.',capacity:270,factor:2.35,users:256,power:23.5,duration:60,events:3}
];
const EVENTS={
 spike:{name:'300% traffic spike',description:'Traffic is at 300% of normal for 8 seconds. Preserve critical services.',duration:8,color:'#ff9678'},
 failure:{name:'Base-station failure',description:'One station is offline. Capacity reduced by 22%. Reroute from the station panel.',duration:12,color:'#ff9678'},
 emergency:{name:'Emergency traffic',description:'Emergency demand has tripled. Prioritize the emergency service slice.',duration:12,color:'#ee92b1'},
 energy:{name:'Power grid limitation',description:'Power budget reduced by 25%. Reduce excess allocation to avoid throttling.',duration:12,color:'#f2ca6e'},
 iot:{name:'IoT sensor surge',description:'City sensors are transmitting at 4× their usual rate.',duration:11,color:'#a78afa'}
};
const MISSIONS=[
 {id:'latency',title:'Keep latency below 5 ms',description:'Maintain a fast connection for 10 consecutive seconds.',target:10,reward:500,unit:'seconds'},
 {id:'reliability',title:'Maintain 99% reliability',description:'Keep the city connected for 10 consecutive seconds.',target:10,reward:600,unit:'seconds'},
 {id:'loss',title:'Keep packet loss below 1%',description:'Deliver clean traffic for 10 consecutive seconds.',target:10,reward:550,unit:'seconds'},
 {id:'energy',title:'Reduce energy consumption by 20%',description:'Use 20% less power than a fully allocated network for 8 seconds.',target:8,reward:650,unit:'seconds'},
 {id:'users',title:'Serve 100 users',description:'Connect at least 100 devices for 8 consecutive seconds. Level 3+.',target:8,reward:750,unit:'seconds'},
 {id:'spike',title:'Handle a 300% traffic spike',description:'Keep your network online through an entire 8-second surge.',target:8,reward:900,unit:'seconds'}
];
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const sum=a=>a.reduce((x,y)=>x+y,0);
const balanced=()=>[17,21,18,10,18,6];
function context(state){
 const level=LEVELS[state.level-1];
 let capacity=level.capacity*(state.event?.type==='failure'?.78:1);
 if(state.boost>0)capacity*=1.12;
 return {capacity,powerLimit:level.power*(state.event?.type==='energy'?.75:1),users:level.users,level:state.level,boost:state.boost>0};
}
function demandAt(levelNo,time,event){
 const l=LEVELS[levelNo-1];
 return APPS.map((app,i)=>{
  let d=app.demand*l.factor*(.98+.08*Math.sin(time*.19+i*1.7)+.045*Math.sin(time*.43+i*.7));
  if(levelNo>=3&&i===5)d*=1.3;
  if(event?.type==='spike')d*=3;
  if(event?.type==='emergency'&&i===3)d*=3;
  if(event?.type==='iot'&&i===5)d*=4;
  return d;
 });
}
function evaluate(allocation,demands,ctx){
 const reserved=allocation.map(p=>p/100*ctx.capacity);
 const energy=2.4+sum(reserved.map((v,i)=>v*APPS[i].energy))+(ctx.boost?1.4:0);
 const throttle=Math.min(1,ctx.powerLimit/Math.max(energy,.01));
 let rawTotal=sum(demands),throughput=0,weightedLatency=0,loss=0;
 const apps=APPS.map((app,i)=>{
  const capacity=reserved[i]*throttle;
  const served=Math.min(capacity,demands[i]);
  const deficit=1-served/Math.max(demands[i],.01);
  const load=demands[i]/Math.max(capacity,.1);
  const latency=app.base+.55*Math.min(load,1)**2+deficit*25*(ctx.level===5?1.16:1);
  const packetLoss=.03+deficit*65;
  const reliability=clamp(99.995-packetLoss*.58-deficit*3,0,99.99);
  throughput+=served;
  weightedLatency+=latency*demands[i];
  loss+=packetLoss*demands[i];
  return {capacity,served,demand:demands[i],deficit,latency,packetLoss,reliability};
 });
 loss=rawTotal?loss/rawTotal:0;
 const latency=rawTotal?weightedLatency/rawTotal:0;
 const congestion=rawTotal?1-throughput/rawTotal:0;
 const dropped=Math.round(ctx.users*congestion);
 const reliability=clamp(99.995-loss*.58-congestion*3,0,99.99);
 const utilization=throughput/Math.max(sum(reserved),1)*100;
 const efficiency=throughput/Math.max(energy,1);
 const energyOver=Math.max(0,energy/ctx.powerLimit-1);
 const scoreRate=throughput*.14+Math.max(0,8-latency)*1.4+Math.max(0,6-loss)*1.3+utilization*.05+Math.max(0,1-energy/ctx.powerLimit)*8-dropped*.35-congestion*28-energyOver*14;
 return {throughput,latency,energy,reliability,loss,utilization,efficiency,congestion,dropped,connected:ctx.users-dropped,reserved:sum(reserved),capacity:ctx.capacity,powerLimit:ctx.powerLimit,energyOver,scoreRate,apps};
}
function optimize(demands,ctx){
 const allocation=APPS.map(()=>0);
 const objective=a=>{
  const m=evaluate(a,demands,ctx);
  return m.apps.reduce((v,app,i)=>v-APPS[i].weight*(app.deficit*160+Math.max(0,app.latency-APPS[i].latency)*1.2),0)+m.throughput*.06-m.energy*.65-m.energyOver*25;
 };
 let current=objective(allocation);
 for(let step=0;step<100;step++){
  let best=current,index=-1;
  for(let i=0;i<6;i++){const candidate=[...allocation];candidate[i]++;const value=objective(candidate);if(value>best+1e-8){best=value;index=i;}}
  if(index<0)break;
  allocation[index]++;current=best;
 }
 return {allocation,metrics:evaluate(allocation,demands,ctx)};
}
function newState(){
 const s={version:1,status:'ready',level:1,time:60,elapsed:0,score:0,health:100,allocation:balanced(),event:null,eventDeck:[],eventIndex:0,boost:0,boostCooldown:0,mission:0,missionProgress:0,missionCompleted:[],missionsEarned:0,missionDelay:0,history:[],events:[],resultSaved:false,totals:{throughput:0,energy:0,reliability:0,ticks:0},spikeSurvived:false};
 s.demands=demandAt(1,0,null);s.metrics=evaluate(s.allocation,s.demands,context(s));return s;
}
function levelEventDeck(level,rng=Math.random){
 const types=level===1?['emergency','iot']:level===2?['emergency','iot','energy']:Object.keys(EVENTS);
 const count=LEVELS[level-1].events;const deck=[];
 const forced=level===4?'failure':level===5?'spike':null;
 const pool=types.filter(t=>t!==forced);
 for(let i=0;i<count;i++){
  const isForced=(level===4&&i===0)||(level===5&&i===1);
  const type=isForced?forced:pool.splice(Math.floor(rng()*pool.length),1)[0];
  deck.push({at:level===1?27:count===2?18+i*24:13+i*17,type,station:Math.floor(rng()*4)});
 }
 return deck;
}
function startLevel(s,rng=Math.random){s.status='running';s.time=60;s.event=null;s.eventDeck=levelEventDeck(s.level,rng);s.eventIndex=0;s.boost=0;s.boostCooldown=0;s.missionProgress=0;s.demands=demandAt(s.level,s.elapsed,null);s.metrics=evaluate(s.allocation,s.demands,context(s));}
function log(s,message,type='info'){s.events.unshift({time:s.elapsed,message,type});s.events=s.events.slice(0,60);}
function missionMatches(m,s){
 const v=s.metrics;
 if(m.id==='latency')return v.latency<5;
 if(m.id==='reliability')return v.reliability>=99;
 if(m.id==='loss')return v.loss<1;
 if(m.id==='energy'){
  const full=evaluate([17,23,20,10,23,7],s.demands,context(s)).energy;
  return v.energy<=full*.8&&v.connected>=LEVELS[s.level-1].users*.65;
 }
 if(m.id==='users')return v.connected>=100;
 if(m.id==='spike')return s.event?.type==='spike'&&s.health>0;
 return false;
}
function pickMission(s,rng){
 const choices=MISSIONS.map((m,i)=>i).filter(i=>!s.missionCompleted.includes(i)&&(i!==4||s.level>=3)&&(i!==5||s.level>=3));
 if(!choices.length){s.mission=-1;return;}
 s.mission=choices[Math.floor(rng()*choices.length)];s.missionProgress=0;
}
function tick(s,rng=Math.random){
 if(s.status!=='running')return [];
 const notices=[];s.time=Math.max(0,s.time-1);s.elapsed++;
 if(s.boost>0)s.boost--;if(s.boostCooldown>0)s.boostCooldown--;
 if(s.event){s.event.remaining--;if(s.event.remaining<=0){
  if(s.event.type==='spike'){s.spikeSurvived=true;if(s.mission===5)s.missionProgress=MISSIONS[5].target;}
  log(s,`${EVENTS[s.event.type].name} resolved. Normal service restored.`,'success');s.event=null;notices.push('event-ended');
 }}
 const levelElapsed=60-s.time;const next=s.eventDeck[s.eventIndex];
 if(next&&levelElapsed>=next.at&&!s.event){s.event={type:next.type,remaining:EVENTS[next.type].duration,station:next.station};s.eventIndex++;log(s,EVENTS[next.type].description,'warning');notices.push('event');}
 s.demands=demandAt(s.level,s.elapsed,s.event);s.metrics=evaluate(s.allocation,s.demands,context(s));
 const m=s.metrics;
 s.score=Math.max(0,s.score+m.scoreRate);
 const damage=Math.max(0,m.loss-3)*.09+Math.max(0,m.latency-6)*.2+m.congestion*1.5+m.energyOver*5;
 const recovery=m.loss<1?1.6:m.loss<3?.45:0;
 s.health=clamp(s.health-damage+recovery,0,100);
 s.history.push({time:s.elapsed,throughput:m.throughput,latency:m.latency,energy:m.energy,reliability:m.reliability});if(s.history.length>60)s.history.shift();
 s.totals.throughput+=m.throughput;s.totals.energy+=m.energy;s.totals.reliability+=m.reliability;s.totals.ticks++;
 if(s.missionDelay>0){s.missionDelay--;if(s.missionDelay===0)pickMission(s,rng);}
 else if(s.mission>=0){const mission=MISSIONS[s.mission];
  if(s.missionProgress<mission.target)s.missionProgress=missionMatches(mission,s)?s.missionProgress+1:0;
  if(s.missionProgress>=mission.target&&!s.missionCompleted.includes(s.mission)){s.score+=mission.reward;s.missionCompleted.push(s.mission);s.missionsEarned++;s.missionDelay=4;log(s,`Mission complete: ${mission.title}. +${mission.reward} points.`,'success');notices.push('mission');}
 }
 if(s.health<=0){s.health=0;s.status='gameover';log(s,'Network integrity depleted. Session ended.','warning');notices.push('gameover');}
 else if(s.time===0){s.score+=Math.round(s.health*5);s.status=s.level===5?'won':'levelComplete';log(s,`Level ${s.level} complete. Integrity bonus +${Math.round(s.health*5)}.`,'success');notices.push(s.status);}
 return notices;
}
root.NetworkSim={APPS,LEVELS,EVENTS,MISSIONS,clamp,sum,balanced,context,demandAt,evaluate,optimize,newState,startLevel,log,tick,pickMission};
if(typeof module!=='undefined')module.exports=root.NetworkSim;
})(typeof window!=='undefined'?window:globalThis);
