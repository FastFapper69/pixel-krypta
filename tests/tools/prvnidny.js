// 12n: první dny nového hráče. node prvnidny.js [cs|en] [se|15]
// Ověří: Nástěnka se odemkne první výhrou (Fúze až na Kostnici); den prvního běhu (save.day0); karta „Zítra tě čeká“
// po 2. běhu první den, jen jednou; starý hráč ji nedostane; dárek a tip po 2 prohrách na stejné nevyhrané mapě, jen jednou
// za mapu a den, ne na Noční můře; Týden v kryptě hned pro hráče, který se vrátí další den; události ve frontě save.evQ.
// Snímky: out/prvnidny_<lang>_zitra.png, out/prvnidny_<lang>_darek.png
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{const {p,E,errs,close}=await L.open({save:'fresh',lang,phone,lw:1});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 const fin=async(map,won)=>{await E(`startRun('knight','${map}');run.t=200;finish(${won});1`);await p.waitForTimeout(1100);};
 await p.waitForTimeout(1200);ok(await E("(save.evQ||[]).some(e=>e.ev==='open')"),'událost open při spuštění');
 await E("save.stats={wins:0,kills:0,runs:0,best:{}};delete save.day0;delete save.tmrw;save.feat={};save.cleared={};save.evQ=[];1");
 // 1. první výhra: Vybavení i Nástěnka, Fúze ještě ne
 await fin('hrbitov',true);
 ok(await E("featOn('gear')&&featOn('quests')&&!featOn('fuse')"),'1. výhra odemkne Vybavení i Nástěnku, Fúzi ne');
 ok(await E("save.day0===today()"),'den prvního běhu uložený');
 ok(await E("(save.featNew||[]).join()==='gear,quests'"),'fronta karet: '+await E("(save.featNew||[]).join()"));
 await E("setState('menu');openMenu();1");await p.waitForTimeout(1300);
 ok(await E("!!document.querySelector('#featPop:not([hidden])')"),'karta Vybavení vyskočila');await p.click('#fcOk');await p.waitForTimeout(500);
 ok(await E("!!document.querySelector('#featPop:not([hidden])')&&/Nástěnka|Board/.test(document.querySelector('#featPop').textContent)"),'hned po ní karta Nástěnky');
 await p.screenshot({path:'out/prvnidny_'+lang+'_nastenka.png'});await p.click('#fcOk');await p.waitForTimeout(400);
 // karta Zítra: po 1 běhu ne, po 2 ano
 ok(!(await E("tmrwDue()")),'po 1. běhu karta Zítra ještě ne');
 // 2. dárek: dvě prohry na Utopených hrobech
 const c0=await E("save.coins"),s0=await E("save.mats.shard||0");
 await fin('bazina',false);ok(!(await E("!!run.gift")),'1. prohra: bez dárku');
 await fin('bazina',false);const g=await E("run.gift");
 ok(!!g&&await E("save.coins")>c0&&(await E("save.mats.shard||0"))>s0,'2. prohra: dárek '+JSON.stringify(g));
 ok(await E("!!document.querySelector('#ovTable td.ovtip')"),'tip na obrazovce po běhu');
 await p.screenshot({path:'out/prvnidny_'+lang+'_darek.png'});
 await fin('bazina',false);await fin('bazina',false);ok(!(await E("!!run.gift")),'další prohry týž den: dárek už ne');
 await E("startRun('knight','bazina',{nm:1});run.t=100;finish(false);1");await p.waitForTimeout(900);ok(!(await E("!!run.gift")),'Noční můra: bez dárku');
 // karta Zítra v menu (fronta karet mechanik se nejdřív vyprázdní)
 ok(await E("tmrwDue()"),'po 2 bězích je karta Zítra připravená');
 await E("save.featNew=[];setState('menu');openMenu();1");await p.waitForTimeout(1300);
 ok(await E("!!document.querySelector('#featPop:not([hidden]) .fc.tm')"),'karta Zítra vyskočila v menu');
 await p.screenshot({path:'out/prvnidny_'+lang+'_zitra.png'});
 const ov=await p.evaluate(()=>{const c=document.querySelector('#featPop .fc.tm'),r=c.getBoundingClientRect(),bad=[];
   c.querySelectorAll('b,i,small,h3,button').forEach(e=>{const q=e.getBoundingClientRect();if(q.right>r.right+.5||q.left<r.left-.5||e.scrollWidth>e.clientWidth+1)bad.push(e.textContent);});
   return {bad,h:r.height,vh:innerHeight};});
 ok(!ov.bad.length&&ov.h<ov.vh-40,'karta se vejde ('+Math.round(ov.h)+' px) '+ov.bad.join('|'));
 await p.click('#tmOk');await p.waitForTimeout(500);ok(!(await E("tmrwDue()"))&&await E("save.tmrw===1"),'karta Zítra jen jednou');
 // Týden v kryptě: nováček se 2 běhy dnes ne, zítra ano
 await E("save.stats.runs=2;delete save.lw;1");ok(!(await E("lwDue()")),'první den se 2 běhy bez Týdne v kryptě');
 await E("save.day0=(()=>{const d=new Date(Date.now()-864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();1");
 ok(await E("dayN()===1&&lwDue()"),'vrátil se další den: Týden v kryptě hned');
 // starý hráč (bez day0) kartu Zítra nedostane
 await E("delete save.day0;save.stats.runs=40;delete save.tmrw;1");ok(await E("day0Init()==='old'&&!tmrwDue()&&dayN()===-1"),'starý hráč: bez karty Zítra');
 // Fúze se odemkne na Kostnici
 await E("save.cleared.bazina=true;featCheck();1");ok(!(await E("featOn('fuse')")),'Utopené hroby už Fúzi neodemknou');
 await E("save.cleared.kostnice=true;featCheck();1");ok(await E("featOn('fuse')"),'Kostnice odemkne Fúzi');
 // události
 const ev=await E("(save.evQ||[]).map(e=>e.ev+(e.k?':'+e.k:'')).join(' ')");
 for(const k of ['scr:over','gift:bazina','tmrw','feat:gear','featlater:quests'])ok(ev.includes(k),'událost '+k);
 ok(await E("(save.evQ||[]).every(e=>e.ver&&e.at&&e.lang&&typeof e.rn==='number'&&typeof e.d0==='number')"),'události mají verzi, čas, jazyk, rn, d0');
 console.log('   události:',ev.slice(0,300));
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
