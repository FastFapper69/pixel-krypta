// Novinky: node newsshot.js prefix [cs|en] [od verze]  (vyfotí začátek a posune dolů)
const {chromium}=require('playwright');const pre=process.argv[2]||'n',lang=process.argv[3]||'cs',from=process.argv[4]||'2026-11-08n';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 await p.evaluate(f=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K._ev("save.newsSeen='"+f+"';openMenu();openNews();");},from);
 await p.waitForTimeout(400);for(let i=0;i<4;i++){await p.screenshot({path:pre+'_'+i+'.png'});await p.evaluate(()=>{const n=document.querySelector('#newsPop .nl');if(n)n.scrollTop+=560;});await p.waitForTimeout(150);}
 console.log(errs);await b.close();})();
