// Mosty kapitol (09i): poslední fáze každého finále (náznak další kapitoly) a karta Cesta dál. node bridges.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2]||'br',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:5};featInit();save.fin={};");
 for(const m of ['trun','brana','srdce','zima','paluba']){
   await p.evaluate(m=>{const K=window.__krypta;K.god=true;K._ev(`startRun('knight','${m}');run.t=run.map.dur-1;`);for(let i=0;i<600&&!K._ev('run.boss&&!BI');i++){K.step(1/60);if(K._ev('!!BI'))K._ev('bossIntroSkip()');}
     K._ev('if(run.boss){run.boss.hp=run.boss.max*.3;}');for(let i=0;i<240;i++)K.step(1/60);},m);
   await p.waitForTimeout(3500);await p.screenshot({path:`${pre}_${m}.png`});
   await E("run.boss&&(run.boss.hp=0);finish(true)");await p.waitForTimeout(1200);await E("openMenu()");await p.waitForTimeout(900);
   if(m==='trun'||m==='paluba')await p.screenshot({path:`${pre}_${m}_card.png`});
   for(let k=0;k<4;k++){const ok=await p.$('#fcOk');if(!ok||!(await ok.isVisible()))break;await ok.click();await p.waitForTimeout(400);}}
 console.log('errors',errs.slice(0,5));await b.close();})();
