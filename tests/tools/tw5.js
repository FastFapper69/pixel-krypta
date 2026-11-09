// věže kapitoly V (09c): Lodní dělo a Harpunářská věž – postaví je u hrdiny, nechá je střílet, vyfotí a vypíše statistiku
// node tw5.js prefix [rarita 0-4]
const {chromium}=require('playwright');const pre=process.argv[2]||'tw5',rar=+(process.argv[3]||4);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const setup=async(m)=>p.evaluate(([m,rar])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight',m);const R=K.run;R.t=150;
   for(let i=0;i<120;i++)K.step(1/60);
   K._ev(`{const P=run.p;for(const [k,dx] of [['cannon',-34],['harpoon',34]]){const ts=twStat({k,r:${rar},lv:0,b:{}});addTower(k,P.x+dx,P.y+34,ts);}}`);
   return R.towers.length;},[m,rar]);
 const stepN=n=>p.evaluate(n=>{const K=window.__krypta;let pins=0,balls=0,harps=0;for(let i=0;i<n;i++){K.step(1/60);const R=K.run;if(!R)break;
   if(R.enemies.some(e=>e.pin>R.t))pins++;if(R.fx.some(f=>f.k==='cball'))balls++;if(R.fx.some(f=>f.k==='harp'))harps++;}return {pins,balls,harps,state:K.state};},n);
 for(const m of ['pristav','vir']){console.log(m,'towers',await setup(m));
   for(let s=0;s<4;s++){const r=await stepN(20+s*9);if(r.state==='levelup'||r.state==='fuse'){const bt=await p.$('#luList button');if(bt)await bt.click();}
     await p.waitForTimeout(60);await p.screenshot({path:`${pre}_${m}_${s}.png`});console.log(' ',JSON.stringify(r));}}
 console.log('errors',errs.slice(0,5));await b.close();})();
