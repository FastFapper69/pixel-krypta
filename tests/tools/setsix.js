// sety ve slotech a set 6 kusů: obrázky všech kusů, karta hrdiny s celým setem, Sbírka, test schopnosti: node setsix.js prefix
const {chromium}=require('playwright');const pre=process.argv[2]||'ss';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const sheet=await p.evaluate(()=>{const E=window.__krypta._ev,ids=E('SET_IDS'),cv=document.createElement('canvas'),Z=8;cv.width=6*14*Z;cv.height=ids.length*14*Z;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#1a1423';g.fillRect(0,0,cv.width,cv.height);
   ids.forEach((id,y)=>E("setSlots('"+id+"')").forEach((sl,x)=>{const s=E("itemSpr('"+sl+"',3,'"+id+"')");g.drawImage(s.c,x*14*Z+Z,y*14*Z+Z,12*Z,12*Z);}));return cv.toDataURL();});
 require('fs').writeFileSync(pre+'_art.png',Buffer.from(sheet.split(',')[1],'base64'));
 const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save,E=K._ev;S.newsSeen='2099';S.tut=1;S.sound=false;S.music=false;K.econInit();S.eq.knight={};
   for(const sl of E("setSlots('tide')")){const it=E("makeSetItem('tide','"+sl+"',3)");E('addItem')(it);S.eq.knight[sl]=it.u;}
   const B=K.heroBonus('knight');const dist=[0,0,0,0,0];for(let i=0;i<2000;i++)dist[E("setRarity(1,'tide')")]++;const d2=[0,0,0,0,0];for(let i=0;i<2000;i++)d2[E("setRarity(1,'bone')")]++;
   const slots={};for(let i=0;i<200;i++){const it=E("makeSetItem('sun')");slots[it.s]=(slots[it.s]||0)+1;}
   K.startRun('knight','hrbitov');const r=K.run;for(let i=0;i<300;i++){r.pending=0;K.step(1/60);}
   const out={st6:!!B.lg.st6,count:E("setCount('knight','tide')"),tideRar:dist,boneRar:d2,sunSlots:slots};K.openMenu();K.openHero();return out;});
 console.log(JSON.stringify(r));
 await p.evaluate(()=>document.querySelector('.setinfo').scrollIntoView({block:'center'}));await p.waitForTimeout(250);await p.screenshot({path:pre+'_hero.png'});
 await p.evaluate(()=>{const K=window.__krypta;K.openCodex();});await p.waitForTimeout(250);
 await p.evaluate(()=>{const s=[...document.querySelectorAll('.cxset')].pop();if(s)s.scrollIntoView({block:'center'});});await p.waitForTimeout(250);await p.screenshot({path:pre+'_codex.png'});
 console.log(errs);await b.close();})();
