// 09z5: pauza se záložkami Výbava / Hrdina / Úkoly; nic nepřetéká přes rámeček. node pausetabs.js prefix [cs|en] [telefon]
const L=require('./lib');L.prep();const pre=process.argv[2]||'pause',lang=process.argv[3]||'cs',ph=process.argv[4]||'15';
(async()=>{const P=await L.open({lang,phone:ph,save:'late',dpr:3});const {p,E,errs}=P;
 await E("featInit();save.feat.quests=1;save.feat.contracts=1;save.feat.fuse=1;save.heroes.bard=true;startRun('bard','hrbitov')");await p.waitForTimeout(400);
 await p.evaluate(()=>{const K=window.__krypta;K.god=true;for(let i=0;i<60*70;i++){K.step(1/60);const s=K._ev('state');if(s!=='play'){if(s==='levelup'){const b=document.querySelector('#scr-levelup .k-card');if(b)b.click();}else K._ev("setState('play')");}}});
 await E("run.p.hp=run.p.max*.62;togglePause(true)");await p.waitForTimeout(500);const bad=[];
 for(const t of ['run','hero','q']){await E("pauseTab='"+t+"';renderPauseBuild()");await p.waitForTimeout(250);
  const o=await p.evaluate(()=>{const b=document.querySelector('#pBuild'),R=b.getBoundingClientRect(),out=[];
   for(const e of b.querySelectorAll('*')){if(!e.childElementCount&&e.textContent.trim()){const r=e.getBoundingClientRect();if(r.width&&(r.left<R.left+3||r.right>R.right-3))out.push(e.textContent.trim().slice(0,30));}}
   const pane=b.querySelector('.ppane'),PR=pane.getBoundingClientRect();return {out,clip:{x:0,y:Math.max(0,R.top-60),width:innerWidth,height:Math.min(innerHeight,R.bottom+10)-Math.max(0,R.top-60)}};});
  if(o.out.length)bad.push(t+': '+o.out.join(', '));await L.shot(p,pre+'_'+t+'.png');}
 console.log(bad.length?'✗ '+bad.join(' | '):'✓ nic nepřetéká','chyby',JSON.stringify(errs));await P.close();})();
