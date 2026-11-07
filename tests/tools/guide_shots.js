// Guide screen: screenshots of the menu and every tab (node guide_shots.js <prefix> [cs|en])
const {chromium}=require('playwright');const pre=process.argv[2]||'gd',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.newsSeen='2099';K.openMenu();});await p.waitForTimeout(200);
 await p.evaluate(()=>{const s=document.querySelector('#scr-menu');s.scrollTop=9999;});await p.screenshot({path:pre+'_menu.png'});
 await p.click('#mGuide');await p.waitForTimeout(200);
 for(const t of ['basics','weapons','towers','world','progress']){await p.click('#gdTabs [data-g="'+t+'"]');await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+t+'.png'});}
 const w=await p.evaluate(()=>document.documentElement.scrollWidth);
 await p.click('#scr-guide [data-back]');await p.waitForTimeout(100);
 console.log(lang,'width',w,'state',await p.evaluate(()=>window.__krypta.state),errs);await b.close();})();
