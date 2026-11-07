// CPU profil těžkého boje: node prof.js [file] [map] [throttle=4] [enemies=0 extra]
const {chromium}=require('playwright');const file=process.argv[2]||'off.html',map=process.argv[3]||'doly',thr=+(process.argv[4]||4),extra=+(process.argv[5]||250);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:3});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(500);
 await p.evaluate(([map,extra])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('builder',map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   for(const id of ['fireball','lightning','blade','arrows','axe','aura'])if(!r.W[id])r.W[id]={lv:6,ang:0};
   for(let i=0;i<600;i++)K.step(1/60);
   const ids=['skeleton','zombie','bat','slime','ghost'];window.__fill=()=>{let n=0;while(r.enemies.length<170&&n++<200){const e=K.makeEnemy(ids[n%5],r.p.x+Math.random()*180-90,r.p.y+Math.random()*360-180);e.hp=e.max=1e4;r.enemies.push(e);}};window.__fill();},[map,extra]);
 const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
 await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:200});await cdp.send('Profiler.start');
 const res=await p.evaluate(()=>new Promise(res=>{const K=window.__krypta;let n=0,t0=performance.now(),last=t0,fr=[],en=0,pk=0;
   const f=()=>{window.__fill();const t=performance.now();fr.push(t-last);last=t;n++;en=Math.max(en,K.run.enemies.length);pk=Math.max(pk,K.run.parts.length);if(t-t0<5000)requestAnimationFrame(f);else{fr.sort((a,b)=>a-b);res({fps:+(n/5).toFixed(1),p50:Math.round(fr[fr.length>>1]),p95:Math.round(fr[Math.floor(fr.length*.95)]),worst:Math.round(fr[fr.length-1]),en,parts:pk,fx:K.run.fx&&K.run.fx.length,shots:K.run.shots&&K.run.shots.length});}};requestAnimationFrame(f);}));
 const {profile}=await cdp.send('Profiler.stop');
 const self={},byId={};for(const nd of profile.nodes)byId[nd.id]=nd;
 const cnt={};for(const s of profile.samples)cnt[s]=(cnt[s]||0)+1;let tot=0;
 for(const id in cnt){const nd=byId[id];const k=nd.callFrame.functionName+':'+nd.callFrame.lineNumber;self[k]=(self[k]||0)+cnt[id];tot+=cnt[id];}
 const top=Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,30).map(([k,v])=>(100*v/tot).toFixed(1).padStart(5)+'% '+k);
 console.log(map,JSON.stringify(res),errs.slice(0,3));console.log(top.join('\n'));await b.close();})();
