const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:3});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
await p.evaluate(()=>{const S=window.__krypta.save;S.sound=false;S.music=false;S.cleared={hrbitov:true,poust:true};window.__krypta.openMenu();});
await p.click('#mPlay');await p.waitForTimeout(2500);
await p.evaluate(()=>document.querySelector('#scr-select').scrollTop=520);await p.waitForTimeout(300);
await p.screenshot({path:'thumbs.png'});console.log(errs);await b.close();})();
