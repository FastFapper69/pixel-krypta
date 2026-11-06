const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;S.coins=5000;S.cleared={hrbitov:true};S.nm={hrbitov:2};S.pity={iron:0,gold:29};K.openMenu();});
await p.click('#mChest');await p.waitForTimeout(300);
// gold chest with guaranteed legendary (pity)
await p.evaluate(()=>{document.querySelectorAll('#chestList .card')[3].querySelector('button').click();});
const shots=[];for(const ms of [200,600,1150,1500,1750,2300]){await p.waitForTimeout(ms-(shots.length?[200,600,1150,1500,1750,2300][shots.length-1]:0));const f='ca_'+ms+'.png';await p.screenshot({path:f});shots.push(f);}
// smoothness: measure frame gaps while animating
const gaps=await p.evaluate(()=>new Promise(r=>{const g=[];let l=performance.now();const f=n=>{g.push(n-l);l=n;if(g.length<90)requestAnimationFrame(f);else r([Math.max(...g.slice(2)).toFixed(1),(g.slice(2).reduce((a,b)=>a+b,0)/(g.length-2)).toFixed(1)]);};requestAnimationFrame(f);}));
console.log('snímky max/průměr ms:',gaps);
await p.click('#rvOk');await p.click('#scr-chests [data-back]');await p.click('#mPlay');await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelector('#scr-select').scrollTop=2000);await p.waitForTimeout(200);await p.screenshot({path:'nm_new.png'});
console.log(errs);await b.close();})();
