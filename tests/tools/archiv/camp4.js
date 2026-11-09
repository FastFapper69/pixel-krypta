// obrazovka kampaně s kapitolou IV (hráč po finále III): node camp4.js <png> [cs|en]
const {chromium}=require('playwright');const out=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{localStorage.setItem('pixel-krypta-lang',l);const cl={};for(const m of ['hrbitov','bazina','kostnice','zvonice','trun','poust','kanon','karavana','hrobka','brana','doly','kovarna','reka','krystaly','srdce','jezero'])cl[m]=true;
 localStorage.setItem('pixel-krypta-v1',JSON.stringify({coins:2000,heroes:{knight:true},cleared:cl,stats:{runs:40},tut:1,newsSeen:99,ch:1,lastMap:'pevnost'}));},lang);
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('#mPlay').click());await p.waitForTimeout(1200);
for(let i=0;i<3;i++){await p.evaluate(()=>{const n=document.querySelector('#chNext');if(n&&!n.disabled)n.click();});await p.waitForTimeout(400);}
await p.evaluate(()=>document.querySelector('#mapList').scrollIntoView({block:'start'}));await p.waitForTimeout(1500);await p.screenshot({path:out});
console.log('w',await p.evaluate(()=>document.documentElement.scrollWidth),errs);await b.close();})();
