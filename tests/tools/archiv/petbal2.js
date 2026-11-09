// petbal2.js [sekund=300]: share of pet damage in time windows, per hero (pet raw damage / total damage dealt)
const {chromium}=require('playwright');const T=+process.argv[2]||300;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const res=await p.evaluate(T=>{const K=window.__krypta,out=[];K.save.sound=false;K.save.music=false;K.god=true;
 for(const hero of ['knight','mage']){for(const k of ['wolf','bat','salamander','drake','phoenix']){
  const c=K.petRoll(k,.5);K.save.pets={v:1,cards:[c],sel:c.u};K.seedRng('b');K.startRun(hero,'hrbitov');const r=K.run;const row=[hero,k];let p0=0,t0=0;
  for(let i=0;i<60*T;i++){if(K.state==='levelup'){const b=document.querySelector('#luList button');if(b)b.click();continue;}K.step(1/60);const a=r.t*.5;K.force={x:Math.cos(a),y:Math.sin(a)};
   if((i+1)%(60*60)===0){const pp=r.pdm||0,tt=r.tdm||0;row.push(Math.round((pp-p0)/Math.max(1,tt-t0)*100)+'%');p0=pp;t0=tt;}}
  K.force=null;row.push('lv'+r.level);out.push(row);}}
 return out;},T);
for(const r of res)console.log(r.join('\t'));console.log(errs);await b.close();})();
