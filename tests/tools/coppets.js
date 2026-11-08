// mazlíčci v co-opu: host (vlastní mazlíček) + virtuální kamarád (Krotitel se dvěma mazlíčky z hello), snímky → guest: node coppets.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2]||'cp';
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async()=>{const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);return p;};
const H=await mk(),G=await mk();
const res=await H.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.LO.map='hrbitov';K.LO.hero='knight';K.LO.mateHero='tamer';
  K.LO.matePets=[{k:'drake',r:3,lv:2,b:{}},{k:'owl',r:2,lv:0,b:{}}];K.LO.mateBonus=K.heroBonus('tamer');
  K.NET.open=true;K.CO.on=true;K.CO.role='host';const out=[];K.NET.mode='rtc';K.NET.dcS={readyState:'open',send:s=>{if(s.indexOf('"t":"s"')>0)out.push(s);}};K.NET.dcE={readyState:'open',send:()=>{}};
  K.coHostGo();const R=K.run2,q=R.pls[1];for(let i=0;i<60*25;i++){K.step(1/60);if(K.state==='levelup'){const o=K.levelOptions();K.applyOption(o[0]);}if(K.state==='wait'){K._ev("run.lv.guest=true;afterOption()");}}
  return{host:R.pet&&R.pet.k,hostHits:R.pet&&R.pet.hits,mate:q.pet&&q.pet.k,mate2:q.pet2&&q.pet2.k,mateHits:(q.pet&&q.pet.hits)+'/'+(q.pet2&&q.pet2.hits),dist:q.pet?Math.round(Math.hypot(q.pet.x-q.p.x,q.pet.y-q.p.y)):-1,snaps:out.slice(-4)};});
await H.waitForTimeout(200);await H.screenshot({path:pre+'_host.png'});
const snaps=res.snaps;delete res.snaps;console.log('host',JSON.stringify(res));
const r=await G.evaluate(snaps=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.CO.on=true;K.CO.role='guest';K.guestStartRun({map:'hrbitov',gh:'tamer',hh:'knight',nm:0});
  for(const s of snaps){K.NET.h.s(JSON.parse(s));for(let i=0;i<4;i++)K.step(1/60);}const R=K.run2;return{gpets:(R.gpets||[]).map(p=>p.k),pt:JSON.parse(snaps[snaps.length-1]).pt.length};},snaps);
await G.waitForTimeout(200);await G.screenshot({path:pre+'_guest.png'});
console.log('guest',JSON.stringify(r),'errors',errs.slice(0,5));await b.close();})();
