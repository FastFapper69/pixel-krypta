// truhla setu po výhře finále v NM: výsledková obrazovka s tlačítkem, losování z truhly, karta v Přípravě: node setchest.js prefix
const {chromium}=require('playwright');const pre=process.argv[2]||'sc';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;S.tut=1;S.newsSeen='2099';K.econInit();
   const win=(map,nm)=>{K.god=true;K.startRun('knight',map,{nm});K.step(1/30);K.finish(true);return K.run.rw;};
   for(const m of ['hrbitov','bazina','kostnice','zvonice','trun'])win(m,0);K.openMenu();
   for(const m of ['hrbitov','bazina','kostnice','zvonice'])win(m,1);K.openMenu();
   const inv0=S.inv.length;const rw=win('trun',1);return {setCh:rw.setCh,pending:(S.setCh||[]).length,invSame:S.inv.length===inv0+(rw.item?1:0)+(rw.leg?1:0)};});
 console.log(JSON.stringify(r));
 await p.waitForTimeout(400);await p.screenshot({path:pre+'_over.png'});
 await p.click('#ovSet',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:pre+'_roll.png'});
 await p.waitForTimeout(2600);await p.screenshot({path:pre+'_got.png'});
 await p.click('#rvOk');await p.waitForTimeout(300);
 console.log('after open', await p.evaluate(()=>({pending:(window.__krypta.save.setCh||[]).length,btn:document.querySelector('#ovSet').hidden})));
 // leave one pending and look at Prep
 await p.evaluate(()=>{const K=window.__krypta;K.save.setCh=[{sid:K._ev('SET_OF_CH')[K._ev('CHAPTERS')[0].id],r:2}];K.openMenu();});
 await p.click('#mPlay');await p.waitForTimeout(300);if(await p.$('#chPrev:not([disabled])'))await p.click('#chPrev');await p.waitForTimeout(200);
 await p.evaluate(()=>{const s=document.querySelector('#scr-select'),t=document.querySelector('.tre.ready');if(t)t.scrollIntoView({block:'center'});});await p.waitForTimeout(200);
 await p.screenshot({path:pre+'_prep.png'});
 console.log(errs);await b.close();})();
