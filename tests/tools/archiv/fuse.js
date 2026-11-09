const {chromium}=require('playwright');
const mode=process.argv[2]||'perfect';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.startRun('knight','hrbitov');const R=K.run;
 R.W.blade.lv=5;R.W.aura={lv:5,cd:.4,ang:0,tick:0};R.fuseMiss=2;R.pending=1;K.step(1/60);});
await p.waitForTimeout(200);
const cards=await p.$$eval('#luList .card',els=>els.map(e=>e.className+' | '+e.innerText.replace(/\n/g,' ')));console.log(cards);
await p.screenshot({path:'fz_card.png'});
await p.click('#luList .card.fuse');await p.waitForTimeout(100);
console.log('state',await p.evaluate(()=>window.__krypta.state));
// tap in rhythm from inside the page (rAF-precise), mode perfect / sloppy / none
const res=await p.evaluate(mode=>new Promise(r=>{const K=window.__krypta;let shot=false;
  const loop=()=>{const F=K.FZ;if(!F){r({done:true});return;}
    const b=K.audioBeat(),i=F.res.findIndex(x=>x===null);
    if(i>=0&&mode!=='none'){const off=mode==='perfect'?0:(i%2?.25:.12);if(b>=F.targets[i]+off-.01)K.fuseTap();}
    if(!shot&&F.res.filter(x=>x).length===2){shot=true;r2();}
    if(F.done){r({res:F.res,state:K.state});return;}requestAnimationFrame(loop);};
  const r2=()=>{window.__mid=true;};requestAnimationFrame(loop);}),mode);
console.log(JSON.stringify(res));
await p.screenshot({path:'fz_done_'+mode+'.png'});
await p.waitForTimeout(1600);
console.log(JSON.stringify(await p.evaluate(()=>{const R=window.__krypta.run;return{state:window.__krypta.state,W:Object.fromEntries(Object.entries(R.W).map(([k,v])=>[k,[v.lv,v.mul]])),pending:R.pending,hud:[...document.querySelectorAll('#items .it')].map(e=>e.className+':'+e.innerText)};})));
// next level-ups must offer vortex II but never blade/aura again
console.log(JSON.stringify(await p.evaluate(()=>{const K=window.__krypta;const seen=new Set();for(let i=0;i<300;i++)K.levelOptions().forEach(o=>seen.add(o.k+':'+(o.id||'')+':'+(o.lv||'')));return [...seen].filter(x=>/vortex|blade|aura/.test(x));})));
console.log(errs);await b.close();})();
