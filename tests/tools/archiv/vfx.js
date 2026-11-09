// VFX check: builds all towers (levels 1-3), runs a fight with several weapons and saves zoomed screenshots
// node vfx.js <mapa> <prefix>
const {chromium}=require('playwright');
const map=process.argv[2]||'hrbitov',pre=process.argv[3]||'vfx';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 await p.evaluate((map)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.startRun('builder',map);const r=K.run;r.coins=9999;r.t=40;
   for(const k of ['arrow','fire','frost','tesla'])K.buildTower(k);
   r.towers.forEach((t,i)=>{t.lv=1+(i%3);});
   for(const id of ['fireball','lightning','blade','arrows','axe'])if(!r.W[id])r.W[id]={lv:4,ang:0};
   for(let i=0;i<1500;i++)K.step(1/60);K.run.p.hp=K.run.p.max;},map);
 await p.screenshot({path:pre+'_a.png'});
 await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<37;i++)K.step(1/60);});
 await p.screenshot({path:pre+'_b.png'});
 const perf=await p.evaluate(()=>{const K=window.__krypta;const t=performance.now();for(let i=0;i<300;i++)K.step(1/60);return {ms:(performance.now()-t)/300,parts:K.run.parts.length,en:K.run.enemies.length};});
 console.log(JSON.stringify(perf),errs);await b.close();})();
