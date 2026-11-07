// realistický těžký boj (nepřátelé umírají a doplňují se, ultimátky, věže): node heavy.js [file=off.html] [map=doly] [throttle=4] [ults=1]
// vypíše fps, p50/p95 snímku, počty volání canvasu na snímek a peak částic
const {chromium}=require('playwright');const file=process.argv[2]||'off.html',map=process.argv[3]||'doly',thr=+(process.argv[4]||4),ults=+(process.argv[5]??1);
(async()=>{const b=await chromium.launch({args:(process.env.ARGS||'').split(' ').filter(Boolean)});const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:3});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(500);
 await p.evaluate(([map,ults])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('builder',map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   const W=ults?['vortex','storm','meteor','blizzard','note','rang']:['fireball','lightning','blade','arrows','axe','aura'];
   for(const id of W)if(!r.W[id])r.W[id]={lv:ults?3:6,ang:0,mul:1};
   const ids=['skeleton','zombie','bat','slime','ghost','spider'];let nn=0;
   window.__fill=()=>{let n=0;while(r.enemies.length<180&&n++<40){const a=Math.random()*6.283,d=60+Math.random()*120;const e=K.makeEnemy(ids[nn++%6],r.p.x+Math.cos(a)*d,r.p.y+Math.sin(a)*d*1.6);if(nn%25===0)e.elite=true;r.enemies.push(e);}};
   for(let i=0;i<300;i++){window.__fill();K.step(1/60);}
   const P=CanvasRenderingContext2D.prototype;window.__cc=0;for(const fn of ['drawImage','fillRect','fill','setTransform','clearRect','translate','rotate','save','restore'])
     {const o=P[fn];P[fn]=function(){window.__cc++;return o.apply(this,arguments);};}},[map,ults]);
 const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
 const prof=process.env.PROF;if(prof){await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:200});await cdp.send('Profiler.start');}
 const res=await p.evaluate(()=>new Promise(res=>{const K=window.__krypta;let n=0,t0=performance.now(),last=t0,fr=[],pk=0,en=0;window.__cc=0;
   const f=()=>{window.__fill();const t=performance.now();fr.push(t-last);last=t;n++;pk=Math.max(pk,K.run.parts.length);en+=K.run.enemies.length;
     if(t-t0<6000)requestAnimationFrame(f);else{fr.sort((a,b)=>a-b);res({fps:+(n/6).toFixed(1),p50:Math.round(fr[fr.length>>1]),p95:Math.round(fr[Math.floor(fr.length*.95)]),calls:Math.round(window.__cc/n),en:Math.round(en/n),parts:pk,kills:K.run.kills,fx:K.run.fx.length,nums:K.run.nums.length});}};requestAnimationFrame(f);}));
 if(prof){const {profile}=await cdp.send('Profiler.stop');const byId={};for(const nd of profile.nodes)byId[nd.id]=nd;const cnt={};for(const x of profile.samples)cnt[x]=(cnt[x]||0)+1;let tot=0;const self={};for(const id in cnt){const nd=byId[id];const k=nd.callFrame.functionName+':'+nd.callFrame.lineNumber;self[k]=(self[k]||0)+cnt[id];tot+=cnt[id];}
  console.log(Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,+prof||25).map(([k,v])=>(100*v/tot).toFixed(1).padStart(5)+'% '+k).join('\n'));}
 console.log(file,map,'ults='+ults,JSON.stringify(res),errs.slice(0,3));await b.close();})();
