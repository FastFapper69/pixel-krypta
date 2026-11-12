// 12l: Poslední světlo – lucerna musí po zabitích zůstat objektem (12e–12k ji počítadlo zabití run.kn přepsalo na řetězec a hra padala). node lucerna.js
const L=require('./lib');
(async()=>{const {p,E,errs,close}=await L.open({save:'late'});
 await E("save.sound=false;save.music=false;startRun('knight','svetlo',{});1");
 const r=await E(`(()=>{const hp0=run.p.hp;let k=0;for(let i=0;i<60*30;i++){const N=run.kn;if(N&&typeof N==='object'){run.p.x=N.x;run.p.y=N.y;}
   if(i%20===0)for(const e of run.enemies.slice(0,3))if(!e.boss){killEnemy(e);k++;}
   if(state==='levelup'||document.querySelector('#lvlUp:not(.hidden)'))try{applyOption(levelOptions()[0])}catch(e){}
   __krypta.step(1/60);}
  return{t:+run.t.toFixed(1),k,killCnt:run.killCnt,kn:typeof run.kn,knx:run.kn&&run.kn.x,hp0,hp:run.p.hp,state}})()`);
 const ok=r.kn==='object'&&r.killCnt===r.k&&r.hp>0&&!errs.length;console.log((ok?'✓ ':'✗ ')+'lucerna po '+r.k+' zabitích',JSON.stringify(r),errs.slice(0,2));process.exitCode=ok?0:1;await close();})();
