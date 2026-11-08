const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:3});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
for(const k of ['wolf','drake','owl','phoenix','salamander']){await p.evaluate(k=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;const c=K.petRoll(k,.5);K.save.pets={v:1,cards:[c],sel:c.u};K.startRun('knight','hrbitov');for(let i=0;i<60*18;i++)K.step(1/60);K.render();},k);await p.waitForTimeout(150);
const pos=await p.evaluate(()=>{const r=window.__krypta.run,cv=document.querySelector('canvas').getBoundingClientRect();return {x:r.pet.x-r.cam.x,y:r.pet.y-r.cam.y,vw:cv.width,cx:cv.left,cy:cv.top};});
console.log(k,JSON.stringify(pos));await p.screenshot({path:`/tmp/ps-${k}.png`});}
console.log(errs);await b.close();})();
