// Cesta mechanik (09h): nový účet vyhrává mapy po řadě, vypíše odemčení a vyfotí kartu, menu a Přípravu. node featpath.js prefix [cs|en] [old]
const {chromium}=require('playwright');const pre=process.argv[2]||'fp',lang=process.argv[3]||'cs',old=process.argv[4]==='old';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+(old?"delete save.feat;save.stats={runs:30};":"delete save.feat;save.stats={runs:0};"));
 await E("openMenu()");await p.waitForTimeout(900);await p.screenshot({path:`${pre}_menu0.png`});
 if(old){await p.screenshot({path:`${pre}_sum.png`});console.log(await E("JSON.stringify(save.feat)"));await b.close();return;}
 console.log('start:',await E("FEATS.filter(F=>featOn(F.id)).map(F=>F.id).join(',')||'-'"),'| deck',await E("runDeck(false).join(',')"),'| fusable gate',await E("featOn('fuse')"));
 const maps=await E("JSON.stringify(MAP_IDS.slice(0,15))");let shot=0;
 for(const m of JSON.parse(maps)){await E(`startRun('knight','${m}');run.t=600;finish(true)`);await p.waitForTimeout(1200);
   const nw=await E("JSON.stringify(save.featNew||[])");await E("openMenu()");await p.waitForTimeout(800);
   if(nw!=='[]'){console.log(m,'->',nw);if(shot<2){await p.screenshot({path:`${pre}_card${shot}.png`});shot++;}}
   for(let k=0;k<4;k++){const ok=await p.$('#fcOk');if(!ok||!(await ok.isVisible()))break;await ok.click();await p.waitForTimeout(500);}}
 await E("openMenu()");await p.waitForTimeout(600);await p.screenshot({path:`${pre}_menu1.png`});
 console.log('errors',errs.slice(0,5));await b.close();})();
