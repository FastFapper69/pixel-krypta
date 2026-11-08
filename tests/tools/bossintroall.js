// key frame of the boss intro for every map with a boss: node bossintroall.js <prefix> -> prefix_<map>.png
const {chromium}=require('playwright');const pre=process.argv[2]||'bia';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const maps=await p.evaluate(()=>Object.keys(window.__krypta.MAPS).filter(m=>window.__krypta.MAPS[m].boss));
 for(const m of maps){await p.evaluate(m=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight',m);K.run.tut=null;K.run.t=K.run.map.dur-.5;
   for(let i=0;i<120&&!K._ev('BI');i++){K.run.pending=0;K.step(1/30);}K._ev('if(BI){BI.t=BI.beat*(BI.beats-1.2);render();ctx.setTransform(Z,0,0,Z,0,0);drawBossIntro(ctx);}');},m);
  await p.screenshot({path:pre+'_'+m+'.png'});}
 const after=await p.evaluate(()=>{const K=window.__krypta;let n=0;while(K._ev('BI')&&n<400){K.step(1/30);n++;}const b=K.run.boss;const x0=b.x;for(let i=0;i<30;i++)K.step(1/30);return {frames:n,moved:Math.abs(K.run.boss.x-x0)>0.1,hud:!document.querySelector('#hud').classList.contains('bi')};});
 console.log(maps.length,JSON.stringify(after),errs.slice(0,3));await b.close();})();
