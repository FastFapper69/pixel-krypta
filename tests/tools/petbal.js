// petbal.js: pets vs. no pet in a 120 s run (hero stands still-ish, god mode): kills, level, raw pet damage per second
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const res=await p.evaluate(()=>{const K=window.__krypta,out=[];K.save.sound=false;K.save.music=false;K.god=true;
 for(const hero of ['knight','mage']){for(const k of [null,...K.PET_IDS]){let kills=0,lv=0,pd=0,n=3;
  for(let s=0;s<n;s++){K.seedRng('bal'+s);if(k){const c=K.petRoll(k,.5);K.save.pets={v:1,cards:[c],sel:c.u};}else K.save.pets={v:1,cards:[K.petRoll('wolf',.5)],sel:null};
   K.startRun(hero,'hrbitov');const r=K.run;K.seedRng('bal'+s);
   let g=0;for(let i=0;i<60*120;i++){if(K.state==='levelup'){const b=document.querySelector('#luList button');if(b)b.click();continue;}K.step(1/60);
    // hero walks in a slow circle so enemies are met
    const a=r.t*.5;K.force={x:Math.cos(a),y:Math.sin(a)};}K.force=null;
   kills+=r.kills;lv+=r.level;pd+=(r.pdm||0)/(r.tdm||1);}
  out.push([hero,k||'none',Math.round(kills/n),+(lv/n).toFixed(1),Math.round(pd/n*100)+'%']);}}
 return out;});
for(const r of res)console.log(r.join('\t'));console.log(errs);await b.close();})();
