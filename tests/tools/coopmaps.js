// co-op on the new maps: host with a virtual partner runs, snapshots are built and fed to a guest page; node coopmaps.js
const {chromium}=require('playwright');
const maps=(process.argv[2]||'bazina,kostnice,zvonice,trun,kanon,karavana,hrobka,brana').split(',');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async()=>{const c=await b.newContext({viewport:{width:390,height:800}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);return p;};
const H=await mk(),G=await mk();
for(const m of maps){
  // host: start a co-op run with a virtual partner and capture the snapshots it would send
  const snaps=await H.evaluate(m=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.LO.map=m;K.LO.hero='knight';K.LO.mateHero='mage';
    K.NET.open=true;K.CO.on=true;K.CO.role='host';const out=[];K.NET.mode='rtc';K.NET.dcS={readyState:'open',send:s=>{if(s.indexOf('"t":"s"')>0)out.push(s);}};K.NET.dcE={readyState:'open',send:()=>{}};
    try{K.coHostGo();}catch(e){return 'start:'+e.message;}const R=()=>K.run2;
    for(let i=0;i<300;i++)K.step(1/60);R().t=R().map.dur-1;for(let i=0;i<900;i++)K.step(1/60);return out.slice(-3);},m);
  if(typeof snaps==='string'){console.log(m,snaps);continue;}
  // guest: start the same map as guest and apply the host's snapshots
  const r=await G.evaluate(([m,snaps])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.CO.on=true;K.CO.role='guest';
    try{K.guestStartRun({map:m,gh:'mage',hh:'knight',nm:0});}catch(e){return 'gstart:'+e.message;}
    for(const s of snaps){try{K.NET.h.s(JSON.parse(s));}catch(e){return 'apply:'+e.message;}for(let i=0;i<8;i++)K.step(1/60);}
    const R=K.run2;return{en:R.enemies.length,boss:!!R.boss,mf:typeof K.MF,cr:R.crystal&&Math.round(R.crystal.x)};},[m,snaps]);
  console.log(m,'snaps',snaps.length,JSON.stringify(r));
  await H.evaluate(()=>{const K=window.__krypta;K.CO.on=false;K.CO.role=null;K.NET.open=false;K.openMenu();});await G.evaluate(()=>{const K=window.__krypta;K.CO.on=false;K.CO.role=null;K.openMenu();});}
console.log('errors',errs.slice(0,6));await b.close();})();
