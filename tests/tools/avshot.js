// profilové obrázky: menu s avatarem a výběr v profilu: node avshot.js prefix
const {chromium}=require('playwright');const pre=process.argv[2]||'av';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.newsSeen='2099';S.tut=1;K.econInit();S.heroes.mage=true;S.nmw={'3|trun':1};S.coins=1234;S.mats.shard=300;K.openMenu();});
 await p.waitForTimeout(300);await p.screenshot({path:pre+'_menu.png',clip:{x:0,y:0,width:393,height:120}});
 await p.click('#mAv');await p.waitForTimeout(300);
 await p.click('#avList button[data-a="b:morvan"]');await p.click('#avList button[data-a="b:kraken"]');await p.waitForTimeout(200);
 await p.screenshot({path:pre+'_prof.png'});
 console.log(await p.evaluate(()=>window.__krypta.save.av),errs);await b.close();})();
