// Nástěnka 09e: záložky Dnes / Týden / Výzva, běhy ve všech režimech, vyzvednutí hvězd, kontraktů a medailí.
// node qboard.js prefix [cs|en] [new|mid] [den 0-6]   (den = vynucené téma dne, Po=0)
const {chromium}=require('playwright');const pre=process.argv[2]||'qb',lang=process.argv[3]||'cs',acc=process.argv[4]||'mid',dow=process.argv[5];
const MID="save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats=save.stats||{};save.stats.runs=12;save.cleared=save.cleared||{};for(const C of CHAPTERS.slice(0,2))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};"+
 "for(let i=0;i<8;i++)addItem(makeItem(i%4));twInit();petInit();persist();";
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+(acc==='mid'?MID:"save.stats=save.stats||{};save.stats.runs=1;")+
   (dow!==undefined?"{const d=new Date();d.setDate(d.getDate()+((+"+dow+")-((d.getDay()+6)%7)));window.__fakeDay=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');save.qd=qNewDay(window.__fakeDay);}":""));
 const shot=async(n)=>{await p.waitForTimeout(450);await p.screenshot({path:`${pre}_${n}.png`,fullPage:true});
   console.log('\n### '+n+'\n'+(await p.evaluate(()=>{const s=document.querySelector('#scr-quests');return s.hidden?'':s.innerText.replace(/\n+/g,' | ')})).slice(0,1400));};
 console.log(await E("qEnsure();JSON.stringify({theme:qTheme(save.qd.d).id,q:save.qd.q.map(q=>[q.id,q.ns,q.xs[0]]),k:save.qw.k.map(K=>[K.id,K.steps.map(s=>s.k+':'+s.n)]),wk:wkInfo()})"));
 await E("openQuests()");await shot('day0');
 // a few runs: normal win, NM win, daily, weekly
 const runs=["startRun('knight','hrbitov');run.qc.el=9;run.qc.boss=1;run.qc.combo=60;for(const k in ENEMY_DEFS)run.qc.k[k]=200;run.kills=900;run.t=600;finish(true)",
   "startRun('knight','bazina',{nm:1});run.qc.el=20;run.qc.boss=2;run.kills=700;run.t=600;finish(true)",
   "{const d=dailyInfo();save.daily.chal='';startRun('knight',d.map,{mod:d.mod.id});run.t=200;finish(false)}",
   "{const I=wkInfo();startRun(I.hero,I.map,{wk:1});run.t=run.map.dur+30;run.p.hp=run.p.max;finish(true)}"];
 for(const r of runs){await E(r);await p.waitForTimeout(1500);}
 console.log('\nend screen:',(await p.evaluate(()=>document.querySelector('#scr-over').innerText.replace(/\n+/g,' | '))).slice(0,600));
 await E("openQuests()");await shot('day1');
 const btn=await p.$('[data-claim]');if(btn){await btn.click();await p.waitForTimeout(900);}await shot('day2');
 await E("qTab='week';renderQuests()");await shot('week');
 const kb=await p.$('[data-k]');if(kb){await kb.click();await p.waitForTimeout(900);const pop=await p.$('#qPop:not([hidden])');if(pop)await p.screenshot({path:`${pre}_reveal.png`});}
 await E("qTab='wk';renderQuests()");await shot('wk');
 console.log('\nclaimable',await E("qClaimable()"),'\nerrors',errs.slice(0,6));await b.close();})();
