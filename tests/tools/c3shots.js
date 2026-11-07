// kapitola III: postaví mapy, odehraje kousek, vyfotí hru a bosse: node c3shots.js prefix [mapy]
const {chromium}=require('playwright');const pre=process.argv[2],maps=(process.argv[3]||'kovarna,reka,krystaly,srdce').split(',');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 for(const m of maps){const t0=Date.now();
   const info=await p.evaluate((m)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;const t=performance.now();K.startRun('knight',m);const bt=performance.now()-t;
     for(let i=0;i<600;i++)K.step(1/60);return {build:Math.round(bt),en:K.run.enemies.length,state:K.state};},m);
   await p.waitForTimeout(150);await p.screenshot({path:pre+'_'+m+'.png'});
   const bi=await p.evaluate(()=>{const K=window.__krypta,R=K.run;R.t=R.map.dur-1;for(let i=0;i<240;i++)K.step(1/60);const B=R.enemies.find(e=>e.boss);if(B){R.p.x=B.x;R.p.y=B.y+60;}for(let i=0;i<300;i++)K.step(1/60);return {boss:B?B.id:null,bhp:B?Math.round(B.hp):0,erupt:(R.erupt||[]).length};});
   await p.waitForTimeout(150);await p.screenshot({path:pre+'_'+m+'_boss.png'});
   console.log(m,JSON.stringify(info),JSON.stringify(bi),Date.now()-t0+'ms');}
 console.log('errors',errs.slice(0,5));await b.close();})();
