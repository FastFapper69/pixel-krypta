// boss intro frames: node bossintro.js <prefix> [map:boss,...]  -> prefix_<boss>_<i>.png at several beats
const {chromium}=require('playwright');
const pre=process.argv[2]||'bi',list=(process.argv[3]||'hrbitov,pristav,trun').split(',');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 for(const map of list){
  const id=await p.evaluate(map=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight',map);const r=K.run;r.tut=null;r.t=200;
    for(let i=0;i<240;i++){r.pending=0;K.step(1/60);}K._ev('spawnBoss();bossIntroStart(run.boss)');return K.run.boss.id;},map);
  const beats=[.05,.6,1.5,2.4,3.6,5.2];
  for(let i=0;i<beats.length;i++){await p.evaluate(bt=>{const K=window.__krypta;K._ev('if(BI){BI.t=BI.beat*'+bt+';drawBossIntro(ctx);}');},beats[i]);
   await p.evaluate(()=>{const K=window.__krypta;K._ev('if(BI){render();ctx.setTransform(Z,0,0,Z,0,0);drawBossIntro(ctx);}');});
   await p.screenshot({path:pre+'_'+id+'_'+i+'.png'});}
  await p.evaluate(()=>window.__krypta._ev('BI=null'));
 }
 console.log(errs.slice(0,5));await b.close();})();
