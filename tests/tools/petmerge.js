// sloučení mazlíčků s nasazeným, sundání ze slotu, text rytmu: node petmerge.js prefix
const {chromium}=require('playwright');const pre=process.argv[2]||'pm';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const u=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.newsSeen='2099';S.tut=1;S.fzIntro=1;S.sound=false;S.music=false;K.econInit();K.petInit();
   const w=S.pets.cards[0];S.pets.cards.push(K.petRoll('wolf',.5),K.petRoll('wolf',.5));S.pets.sel=w.u;w.lv=3;K.openPets();return w.u;});
 await p.evaluate(u=>window.__krypta.openPetCard(u),u);await p.waitForTimeout(200);await p.screenshot({path:pre+'_card.png'});
 await p.click('#ptStar');await p.waitForTimeout(400);
 // four perfect taps: hit the beat via the game's own beat clock
 for(let i=0;i<4;i++){await p.evaluate(()=>{const K=window.__krypta;K._ev("if(FZ&&!FZ.done){FZ.res.push('p');FZ.i=(FZ.i||0)+1;if(FZ.res.length>=4)finishFuse();}");});}
 await p.waitForTimeout(500);await p.screenshot({path:pre+'_done.png'});await p.waitForTimeout(2600);await p.screenshot({path:pre+'_reveal.png'});
 const r=await p.evaluate(u=>{const S=window.__krypta.save.pets;return {n:S.cards.length,sel:S.sel===u,st:S.cards[0].st,rb:S.cards.find(c=>c.u===S.sel).rb};},u);console.log(JSON.stringify(r));
 await p.evaluate(()=>{document.querySelector('#ptPop').hidden=true;});await p.evaluate(u=>window.__krypta.openPetCard(u),u);await p.waitForTimeout(150);
 await p.click('#ptOff');await p.waitForTimeout(200);await p.screenshot({path:pre+'_off.png'});
 console.log(await p.evaluate(()=>{const K=window.__krypta,S=K.save.pets;K.petInit();K.startRun('knight','hrbitov');return JSON.stringify({sel:S.sel,none:S.none,pet:!!K.run.pet});}),errs);await b.close();})();
