// Noční můry jako obtížnost kapitoly: node nmtest.js [prefix pro screenshoty]
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save,o=[];S.sound=false;S.music=false;S.tut=1;K.econInit();
   const win=(map,nm)=>{K.god=true;K.startRun('knight',map,{nm});K.step(1/30);K.finish(true);const rw=K.run.rw;K.openMenu();return rw;};
   for(const m of ['hrbitov','bazina','kostnice','zvonice'])win(m,0);
   o.push('before trun: nm1 open? '+K.mapOpenAt('hrbitov',1));
   const r0=win('trun',0);o.push('after trun: nm1 hrbitov '+K.mapOpenAt('hrbitov',1)+' bazina '+K.mapOpenAt('bazina',1)+' nm2 '+K.mapOpenAt('hrbitov',2));
   win('hrbitov',1);o.push('after hrbitov NM1: bazina NM1 '+K.mapOpenAt('bazina',1));
   for(const m of ['bazina','kostnice','zvonice'])win(m,1);
   const r1=win('trun',1);o.push('trun NM1 first win set: '+!!r1.set+' item '+!!r1.item+' nm2 open '+K.mapOpenAt('hrbitov',2));
   const r2=win('trun',1);o.push('trun NM1 again set (chance): '+!!r2.set);
   o.push('nmWon '+K.nmWon());return o.join('\n');});
 console.log(r);
 if(pre){await p.evaluate(()=>{const K=window.__krypta;K.openMenu();});await p.click('#mPlay');await p.waitForTimeout(300);if(await p.$('#chPrev:not([disabled])'))await p.click('#chPrev');await p.waitForTimeout(200);
   await p.evaluate(()=>{const s=document.querySelector('#scr-select');s.scrollTop=document.querySelector('#mapList').offsetTop-120;});await p.waitForTimeout(200);await p.screenshot({path:pre+'_n0.png'});
   await p.click('.nmtabs [data-k="1"]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_n1.png'});
   await p.click('.nmtabs [data-k="2"]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_n2.png'});}
 // old save migration
 const m=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.nmV=0;S.nmw={};S.nm={hrbitov:3,poust:2};K.econInit();return JSON.stringify(S.nmw);});
 console.log('migrated',m,errs);await b.close();})();
