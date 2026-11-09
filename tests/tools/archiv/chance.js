const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;const out={};
 for(const chest of [false,true]){let first=0,n=0,maxMiss=0,firstTry=0;
  for(let run=0;run<400;run++){K.startRun('knight','hrbitov');const R=K.run;R.W.blade.lv=5;R.W.aura={lv:5,cd:.4,ang:0,tick:0};
   let tries=0;for(;;){tries++;R.pending=1;R.chestOpen=chest;K.step(1/60);const cards=[...document.querySelectorAll('#luList .card')];const has=cards.some(c=>c.classList.contains('fuse'));
     cards.find(c=>!c.classList.contains('fuse')).click();K.step(1/60);if(has)break;}
   if(tries===1)firstTry++;maxMiss=Math.max(maxMiss,tries);}
  out[chest?'truhla':'level-up']={'na 1. pokus':Math.round(firstTry/4)+' %','nejpozději na pokus':maxMiss};}
 // offered card declined -> comes back later
 return out;});
console.log(JSON.stringify(r),errs);await b.close();})();
