// Přepnutí záložek (Kování↔Vylepšení, Hrdina↔Věže) nesmí probliknout pozadím: obrazovka zůstane neprůhledná. node tabflash.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:393,height:852}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();openMenu();openForge()");await p.waitForTimeout(500);
 let bad=0;
 for(const [from,to] of [['forge','shop'],['shop','forge'],['hero','towers'],['towers','pets']]){
  if(from==='hero')await E("openMenu();openHero()"),await p.waitForTimeout(400);
  const op=await p.evaluate(async([from,to])=>{document.querySelector('#scr-'+from+' .sectabs [data-to="'+to+'"]').click();const r=[];const t0=performance.now();
    await new Promise(res=>{const f=()=>{const e=document.getElementById('scr-'+to);r.push(+getComputedStyle(e).opacity);performance.now()-t0<200?requestAnimationFrame(f):res();};requestAnimationFrame(f);});return Math.min(...r);},[from,to]);
  console.log(from,'→',to,'min. průhlednost obrazovky',op.toFixed(2));if(op<.99)bad++;await p.waitForTimeout(300);}
 // menu → screen keeps its normal fade-in
 await E("openMenu()");await p.waitForTimeout(300);const op2=await p.evaluate(async()=>{window.__krypta._ev('openForge()');return +getComputedStyle(document.getElementById('scr-forge')).opacity;});
 console.log('menu → Kovárna (normální animace) start',op2.toFixed(2));console.log('chyby',errs);process.exit(bad?1:0);})();
