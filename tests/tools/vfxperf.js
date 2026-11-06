// heavy-fight frame rate: many enemies + weapons + towers, real rAF loop for 4 s (node vfxperf.js [file])
const {chromium}=require('playwright');const file=process.argv[2]||'off.html';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(400);
 await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('builder','doly');const r=K.run;r.coins=9999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])K.buildTower(k);
   for(const id of ['fireball','lightning','blade','arrows','axe','aura'])if(!r.W[id])r.W[id]={lv:6,ang:0};
   for(let i=0;i<600;i++)K.step(1/60);});
 const res=await p.evaluate(()=>new Promise(res=>{const K=window.__krypta;let n=0,t0=performance.now(),mx=0,last=t0,pk=0;
   const f=()=>{const t=performance.now();mx=Math.max(mx,t-last);last=t;n++;pk=Math.max(pk,K.run.parts.length);if(t-t0<4000)requestAnimationFrame(f);else res({fps:Math.round(n/4),worst:Math.round(mx),en:K.run.enemies.length,parts:pk});};requestAnimationFrame(f);}));
 console.log(file,JSON.stringify(res),errs);await b.close();})();
