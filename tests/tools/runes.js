// Runy (09k): vložení do předmětu, bonus hrdiny, slučování v Kovárně, kořist z NM bosse (limit 3 denně), efekty v běhu.
// node runes.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2]||'rn',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:20};featInit();save.cleared.zima=1;featCheck();save.featNew=[];save.mats.ess=30;"+
   "save.runes={fire1:4,ice2:1,bolt1:4,ward3:1};save.feat={};for(const F of FEATS)save.feat[F.id]=1;const it=makeItem(4,'amulet');addItem(it);save.eq.knight=save.eq.knight||{};save.eq.knight.amulet=it.u;window.__u=it.u;persist();");
 console.log('feat runes',await E("featOn('runes')"));
 await E("heroSel='knight';openHero();openItem(window.__u)");await p.waitForTimeout(400);await p.screenshot({path:`${pre}_item0.png`});
 await (await p.$('[data-rs="0"]')).click();await p.waitForTimeout(300);await p.screenshot({path:`${pre}_pick.png`});
 await (await p.$('[data-k="fire1"]')).click();await p.waitForTimeout(300);
 await (await p.$('[data-rs="1"]')).click();await p.waitForTimeout(200);await (await p.$('[data-k="bolt1"]')).click();await p.waitForTimeout(300);
 await p.screenshot({path:`${pre}_item1.png`});
 console.log('bonus',await E("JSON.stringify(heroBonus('knight').rn)"),'bag',await E("JSON.stringify(save.runes)"));
 await E("$('#itemPop').hidden=true;openRunes()");await p.waitForTimeout(600);await p.screenshot({path:`${pre}_forge.png`});
 const mb=await p.$('[data-rm="fire1"]');console.log('merge button',!!mb);
 // drop limit: 6 NM boss wins, max 3 runes
 console.log('drops',await E("(()=>{save.runeDay=null;let n=0;for(let i=0;i<6;i++){startRun('knight','hrbitov',{nm:3});run.t=600;finish(true);if(run.rw&&run.rw.rune)n++;}return n+' (runeDay '+save.runeDay.n+')';})()"));
 await p.waitForTimeout(1500);console.log('end row',(await p.evaluate(()=>document.querySelector('#scr-over').innerText)).includes('Runa')||'(no rune this run)');
 // effects in a run
 console.log('run',await p.evaluate(()=>{const K=window.__krypta;K.god=true;K._ev("startRun('knight','hrbitov');run.t=100;");for(let i=0;i<60*20;i++){K.step(1/60);if(K.state!=='play'){const b=document.querySelector('#luList button');if(b)b.click();}}
   return K._ev("JSON.stringify({rn:st.rn,kills:run.kills,rays:run.fx.filter(f=>f.k==='ray').length})");}));
 console.log('errors',errs.slice(0,5));await b.close();})();
