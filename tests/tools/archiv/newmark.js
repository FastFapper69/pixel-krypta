// značky NOVÉ: node newmark.js prefix
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 await p.evaluate(()=>{const K=window.__krypta;K.save.coins=3000;K.econInit();K.openMenu();
   // a player who now gets a new item, a new map and a new tower card
   const it=K.makeItem(3);K.addItem(it);K.save.cleared.hrbitov=1;K.save.cleared.bazina=1;K.openMenu();});
 await p.waitForTimeout(300);await p.screenshot({path:pre+'_menu.png'});
 await p.click('#mHero');await p.waitForTimeout(300);await p.screenshot({path:pre+'_hero.png'});
 await p.click('#scr-hero [data-back]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_menu2.png'});
 await p.click('#mPlay');await p.waitForTimeout(300);await p.screenshot({path:pre+'_sel.png'});
 await p.click('#scr-select [data-back]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_menu3.png'});
 console.log(errs,await p.evaluate(()=>Object.keys(window.__krypta.save.seen).length));await b.close();})();
