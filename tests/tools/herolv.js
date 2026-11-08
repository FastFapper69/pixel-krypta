// úrovně hrdinů 21-40, volba talentů a prestiž: node herolv.js prefix
const {chromium}=require('playwright');const pre=process.argv[2]||'hl';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;S.tut=1;S.newsSeen='2099';K.econInit();S.coins=99999;S.mats.shard=5000;S.mats.ess=3000;
   S.hlv.knight=29;S.htal={knight:{25:1}};const b0=K.heroBonus('knight');
   K.heroUp('knight');const L=K._ev("heroLv('knight')");const cost=K._ev("JSON.stringify([20,25,30,39].map(L=>ECON.heroCost(L)))");
   K.openHero();return {L,b0:{hp:b0.hpPct.toFixed(2),armor:b0.armor},cost};});
 console.log(JSON.stringify(r));
 await p.evaluate(()=>{const t=document.querySelector('.tchs');t.scrollIntoView({block:'center'});});await p.waitForTimeout(250);await p.screenshot({path:pre+'_30.png'});
 await p.click('.tch button[data-t="30"][data-i="0"]',{force:true});await p.waitForTimeout(150);
 const w=await p.evaluate(()=>{const K=window.__krypta;K.startRun('knight','hrbitov');return JSON.stringify({blade:K.run.W.blade.xn,tal:Object.keys(K.st.tal)});});console.log('run',w);
 await p.evaluate(()=>{const K=window.__krypta;K.openMenu();K.save.hlv.knight=40;K.save.htal.knight={25:0,30:0,35:1,40:0};K.openHero();document.querySelector('.prs').scrollIntoView({block:'center'});});await p.waitForTimeout(250);
 await p.screenshot({path:pre+'_40.png'});await p.click('#hPr',{force:true});await p.waitForTimeout(150);
 console.log('prestige',await p.evaluate(()=>JSON.stringify({pr:window.__krypta.save.hpr,b:window.__krypta.heroBonus('knight').dmg.toFixed(3)})),errs);await b.close();})();
