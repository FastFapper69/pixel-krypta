const {chromium}=require('playwright');const [file,out,map='doly']=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(500);
 await p.evaluate((map)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.seedRng('dk');K.startRun('mage',map);K.run.enemies.length=0;K.run.t=1;for(let i=0;i<30;i++){K.run.enemies.length=0;K.step(1/60);}K.run.enemies.length=0;window.__krypta.render();},map);
 await p.screenshot({path:out});console.log(out,errs);await b.close();})();
