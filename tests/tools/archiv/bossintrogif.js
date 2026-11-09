// boss intro as animation frames (20 fps): node bossintrogif.js <dir> [maps]
const {chromium}=require('playwright');
const dir=process.argv[2]||'.',list=(process.argv[3]||'hrbitov,pristav,trun').split(',');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 for(const map of list){
  const id=await p.evaluate(map=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight',map);const r=K.run;r.tut=null;r.t=200;
    for(let i=0;i<240;i++){r.pending=0;K.step(1/60);}K._ev('spawnBoss();bossIntroStart(run.boss)');return K.run.boss.id;},map);
  for(let f=0;f<200;f++){const on=await p.evaluate(f=>window.__krypta._ev('(()=>{if(!BI)return false;BI.t=f*0.05;BI.e.x=run.p.x+40;render();ctx.setTransform(Z,0,0,Z,0,0);drawBossIntro(ctx);return BI.t<BI.beat*BI.beats;})()'.replace('f*',f+'*')),f);
   if(!on)break;await p.screenshot({path:dir+'/'+id+'_'+String(f).padStart(3,'0')+'.png'});}
  await p.evaluate(()=>window.__krypta._ev('BI=null'));}
 console.log(errs.slice(0,3));await b.close();})();
