// výbava 2.0: obrazovka Vybavení se 6 sloty, kategoriemi a kartou předmětu s vlastností: node gearshot.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2]||'g',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 const info=await p.evaluate(()=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;
  return E("save.newsSeen='2099';for(let i=0;i<24;i++)addItem(makeItem(i%5,SLOT_IDS[i%6]));const ep=makeItem(3,'boots');addItem(ep);const lg=makeItem(4,'ring');addItem(lg);"+
   "save.eq.knight={helm:save.inv.find(i=>i.s==='helm').u,boots:ep.u,gloves:save.inv.find(i=>i.s==='gloves').u,ring:lg.u};persist();openHero();"+
   "JSON.stringify({b:save.inv.map(i=>(i.b||'-')+(i.af?'*':'')).join(' '),bonus:bonusLines(heroBonus('knight')).map(l=>l.join(' ')).join(' | ')})");});
 await p.waitForTimeout(250);await p.screenshot({path:pre+'_hero.png'});
 await p.evaluate(()=>{const e=document.querySelector('#invGrid');if(e)e.scrollIntoView({block:'start'});});await p.waitForTimeout(150);await p.screenshot({path:pre+'_inv.png'});
 await p.evaluate(()=>{const K=window.__krypta;K._ev("openItem(save.inv.find(i=>i.af&&i.s==='boots').u)");});await p.waitForTimeout(250);await p.screenshot({path:pre+'_item.png'});
 console.log(info,errs);await b.close();})();
