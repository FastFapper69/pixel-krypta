// campaign screen: node camp.js <prefix> [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2]||'camp',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2,locale:lang==='en'?'en-US':'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.setItem('pixel-krypta-lang',l);localStorage.setItem('pixel-krypta-v1',JSON.stringify({coins:900,heroes:{knight:true,mage:true},cleared:{hrbitov:true,bazina:true},best:{hrbitov:250,bazina:281,kostnice:122},nm:{hrbitov:3,bazina:1},stats:{runs:5},tut:1,newsSeen:'2026-11-07g',ch:1,unl:{}}));}catch(e){}},lang);
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(700);
await p.evaluate(()=>{document.querySelector('#mPlay').click();});await p.waitForTimeout(2500);
await p.evaluate(()=>{const el=document.querySelector('#mapList');el.scrollIntoView({block:'start'});});await p.waitForTimeout(300);
await p.screenshot({path:pre+'-1.png'});
await p.evaluate(()=>document.querySelector('#chNext').click());await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelector('#mapList').scrollIntoView({block:'start'});});await p.waitForTimeout(200);await p.screenshot({path:pre+'-2.png'});
const w=await p.evaluate(()=>document.documentElement.scrollWidth);console.log('w',w,errs);await b.close();})();
