// Nekonečná krypta 08l: boss po 30 s, po zabití se vrací silnější s novými útoky, rekord v bossech: node endless2.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
const r=await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight','kostnice',{endless:true});const R=K.run,o={waves:[]};
  const lv=()=>{if(K.state==='levelup'){const q=K.levelOptions();K.applyOption(q.find(x=>x.k!=='fuse')||q[0]);}};
  for(let i=0;i<60*35;i++){K.step(1/60);lv();}o.bossAt35=!!R.boss;
  for(let w=0;w<6;w++){let t0=R.t;for(let i=0;i<60*40&&!R.boss;i++){K.step(1/60);lv();}if(!R.boss)break;const B=R.boss;o.waves.push({evo:B.evo,hp:Math.round(B.max),dmg:Math.round(B.dmg),wait:Math.round(R.t-t0)});
    for(let i=0;i<60*6;i++){K.step(1/60);lv();}o.eshots=(o.eshots||0)+R.eshots.length;B.hp=1;for(let i=0;i<30&&R.boss;i++){K.step(1/60);lv();}}
  o.enW=R.enW;o.enemies=R.enemies.length;K.god=false;K.finish(false);o.rec=K.save.endW;o.ess=K.run.rw&&K.run.rw.ess;return o;});
await p.waitForTimeout(800);await p.screenshot({path:pre+'_end.png'});
console.log(JSON.stringify(r),errs.slice(0,4));await b.close();})();
