// spodek Přípravy s tlačítkem Vyrazit (simulovaný iPhone): node goshot.js out.png [scroll]
const {chromium}=require('playwright');const out=process.argv[2],sc=+(process.argv[3]||0);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 await p.evaluate(()=>{const R=document.documentElement.style;R.setProperty('--sat','59px');R.setProperty('--sab','34px');const K=window.__krypta;K.save.cleared.hrbitov=1;K.openMenu();});
 await p.click('#mPlay');await p.waitForTimeout(400);await p.evaluate(s=>{document.querySelector('#scr-select').scrollTop=s;},sc);await p.waitForTimeout(300);
 await p.screenshot({path:out,clip:{x:0,y:552,width:393,height:300}});console.log(errs);await b.close();})();
