// pás hrdinů v Hrdinovi a v Přípravě: node herostrip.js out_prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 await p.evaluate(()=>{const K=window.__krypta;K.save.coins=5000;K.econInit();for(const h of ['knight','archer','mage','builder','bard'])K.save.heroes[h]=1;K.openHero();});await p.waitForTimeout(300);
 await p.screenshot({path:pre+'_hero.png'});
 await p.click('#scr-hero [data-back]');await p.click('#mPlay');await p.waitForTimeout(300);await p.screenshot({path:pre+'_sel.png'});await p.evaluate(()=>{const s=document.querySelector('#heroList');s.scrollLeft=9999;});await p.waitForTimeout(200);await p.screenshot({path:pre+'_sel2.png'});
 console.log(errs);await b.close();})();
