// scrollshot.js <out.png> <setup-js> : run setup via _ev, scroll the visible screen to the bottom, screenshot
const {chromium}=require('playwright');const out=process.argv[2],setup=process.argv[3];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2,locale:process.argv[4]||'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
await p.evaluate(x=>window.__krypta._ev(x),"save.sound=false;save.music=false;"+setup);await p.waitForTimeout(500);
await p.evaluate(()=>{for(const e of document.querySelectorAll('.scr:not([hidden]), .scr:not([hidden]) *'))if(e.scrollHeight>e.clientHeight+20&&getComputedStyle(e).overflowY!=='visible')e.scrollTop=1e5;});
await p.waitForTimeout(300);await p.screenshot({path:out});console.log(out,JSON.stringify(errs));await b.close();})();
