const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(600);
const map=process.argv[2]||'hrbitov';
let r=await p.evaluate((map)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.cleared={hrbitov:true,poust:true};K.save.heroes.mage=true;
  const Q=K.qEnsure();Q.w.id={hrbitov:'baron',poust:'widow',doly:'smith'}[map];Q.w.st=1;K.openQuests();
  return {q:Q.q.map(q=>q.id+':'+q.x),w:Q.w,menuDot:document.querySelector('#mQuest').className};},map);
console.log(JSON.stringify(r));
await p.screenshot({path:'q_board.png',fullPage:false});
await p.evaluate(()=>{document.querySelector('#scr-quests').scrollTop=2000});await p.waitForTimeout(100);await p.screenshot({path:'q_board2.png'});
r=await p.evaluate((map)=>{const K=window.__krypta;K.god=true;K.startRun('knight',map);for(let i=0;i<60;i++)K.step(1/60);
  K.run.wantT=3;let n=0;while(!K.run.wanted&&n<600){K.step(1/60);n++;}
  const w=K.run.wanted;return {spawned:!!w,id:w&&w.want,hp:w&&Math.round(w.hp),n};},map);
console.log(JSON.stringify(r));
for(let i=0;i<8;i++)await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<30;i++)K.step(1/60);});
await p.waitForTimeout(200);await p.screenshot({path:'q_run.png'});
r=await p.evaluate(()=>{const K=window.__krypta;const w=K.run.wanted;if(w){w.hp=1;}let n=0;while(K.run.wanted&&n<900){K.step(1/60);n++;}
  // move wanted offscreen check arrow not needed
  return {killed:K.run.qc.want,n,bur:w&&w.bur,pin:document.querySelector('#qPin').textContent};});
console.log(JSON.stringify(r));
r=await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<120;i++)K.step(1/60);return document.querySelector('#qPin').textContent});console.log('pin',r);
await p.screenshot({path:'q_run2.png'});
r=await p.evaluate(()=>{const K=window.__krypta;document.querySelector('#btnPause').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));document.querySelector('#pQuit').click();
  const Q=K.save.qd;return {st:K.state,w:Q.w,q:Q.q.map(q=>q.id+' '+q.v+'/'+q.n+(q.done?' done':''))};});
console.log(JSON.stringify(r));
// finish a run properly to see end screen rows
r=await p.evaluate((map)=>{const K=window.__krypta;const Q=K.save.qd;Q.q[0].v=Q.q[0].n-1;K.startRun('knight',map);for(let i=0;i<200;i++)K.step(1/60);K.run.t=K.run.map.dur+1;let n=0;while(!K.run.boss&&n<400){K.step(1/60);n++;}
  if(K.run.boss)K.run.boss.hp=1;n=0;while(!K.run.over&&n<1200){K.step(1/60);n++;}return {over:K.run.over,won:K.run.won,qres:(K.run.qres||[]).length};},map);
console.log(JSON.stringify(r));await p.waitForTimeout(1300);await p.screenshot({path:'q_over.png'});
r=await p.evaluate(()=>{const K=window.__krypta;K.openQuests();const b=document.querySelector('[data-claim]');if(b)b.click();const c0=K.save.qd.c;const wc=document.querySelector('#qWClaim');if(wc)wc.click();
  return {c:K.save.qd.c,c0,wk:K.save.qw.c,w:K.save.qd.w,ready:document.querySelectorAll('.qt-node.ready').length}});
console.log(JSON.stringify(r));await p.waitForTimeout(2500);await p.screenshot({path:'q_claim.png'});
r=await p.evaluate(()=>{const K=window.__krypta;const n=document.querySelector('.qt-node.ready');if(n)n.click();return {ms:K.save.qd.ms,coins:K.save.coins,pop:!document.querySelector('#qPop').hidden}});
console.log(JSON.stringify(r));
r=await p.evaluate(()=>{const K=window.__krypta;const rr=document.querySelector('[data-rr]');const before=K.save.qd.q.map(q=>q.id).join();if(rr)rr.click();return before+' -> '+K.save.qd.q.map(q=>q.id).join()+' rr='+K.save.qd.rr+' w='+document.documentElement.scrollWidth});
console.log(r);
console.log('ERR',errs);await b.close();})();
