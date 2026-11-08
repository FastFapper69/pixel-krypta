// Nekonečná krypta 08m: jen finále kapitol. Výběr v Přípravě + boss fight na každém finále: node endless3.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
const ui=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;S.tut=1;
  for(const m of ['hrbitov','kostnice','bazina','krypta2','trun'])S.cleared[m]=1;S.fin={trun:1};K._ev("setState(\"select\")");return 1;});
await p.waitForTimeout(400);
const sel=await p.evaluate(()=>{const t=document.querySelector('.nmtabs button[data-k="e"]');t.click();return 1;});await p.waitForTimeout(400);
const vis=await p.evaluate(()=>[...document.querySelectorAll('.mpath .mnode:not(.tre) h3')].map(h=>h.textContent));
await p.evaluate(()=>{const s=document.querySelector('.scr:not([hidden])')||document.body;});await p.screenshot({path:pre+'_sel.png'});
const fins=['trun','brana','srdce','zima'],out={vis};
for(const f of fins)out[f]=await p.evaluate(f=>{const K=window.__krypta;K.god=true;K.startRun('knight',f,{endless:true});const R=K.run,o={evo:[]};
  const lv=()=>{if(K.state==='levelup'){const q=K.levelOptions();K.applyOption(q.find(x=>x.k!=='fuse')||q[0]);}};
  for(let w=0;w<4;w++){for(let i=0;i<60*45&&!R.boss;i++){K.step(1/60);lv();}if(!R.boss)break;const B=R.boss;o.evo.push(B.evo+':'+B.id);
    for(let i=0;i<60*8;i++){K.step(1/60);lv();if(K.state==='over')break;}if(!R.boss)continue;for(const q of R.enemies.slice())if(q.id==="phyl"&&!q.dead){q.hp=0;K._ev("killEnemy")(q);}for(let i=0;i<240&&R.jars;i++){K.step(1/60);lv();}o.jarsLeft=R.jars;B.hp=1;for(let i=0;i<300&&R.boss;i++){K.step(1/60);lv();}}
  o.enW=R.enW;o.state=K.state;o.won=R.won;K.god=false;K.finish(false);return o;},f);
console.log(JSON.stringify(out),errs.slice(0,4));await b.close();})();
