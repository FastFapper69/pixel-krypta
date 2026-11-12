// 12r: „Ukaž mi to“ u karet nových mechanik a pořadí karet a Novinek při spuštění hry. node ukazmi.js [cs|en] [se|15]
// Hráč (uživatel 12. 11.): při spuštění vyskočily 2 karty (Denní výzva, Kořist krypty), „Ukaž mi to“ jen otevřelo menu, přes něj
// vyskočila další karta a pak Novinky, takže nic neviděl. Ověří: Novinky nejsou přes karty; „Ukaž mi to“ zvýrazní denní výzvu
// v Přípravě a truhlu v menu (rám + šipka, nic dalšího přes to); klepnutí zvýraznění zavře a pak teprve přijde další karta / Novinky.
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{const {p,E,errs,close}=await L.open({save:'fresh',lang,phone});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 const st=()=>E("({st:state,feat:!!(document.querySelector('#featPop')&&!document.querySelector('#featPop').hidden),card:(document.querySelector('#featPop h3')||{}).textContent,"+
   "news:!document.querySelector('#newsPop').hidden,spot:SPOT.on,spotEl:SPOT.el&&SPOT.el.id,ar:!!(document.querySelector('#spotAr')&&!document.querySelector('#spotAr').hidden)})");
 // účet po 2. výhře, který ještě neviděl karty 12q ani Novinky 12q
 await E("save.cleared={hrbitov:true,bazina:true};save.stats=save.stats||{};save.stats.runs=5;save.coins=300;save.feat={gear:1,quests:1};save.featNew=[];save.newsSeen='2026-11-12p';delete save.loot;persist();1");
 await E("refreshMenu();setState('menu');newsBoot();1");await p.waitForTimeout(1600);
 let s=await st();ok(s.feat&&!s.news,'1. karta, Novinky ne přes ni '+JSON.stringify(s));
 await p.screenshot({path:'out/ukazmi_'+lang+'_'+phone+'_1karta.png'});
 await p.click('#fcGo');await p.waitForTimeout(1300);s=await st();
 ok(s.st==='select'&&s.spot&&s.spotEl==='dailyBox'&&s.ar&&!s.feat&&!s.news,'Ukaž mi to → Příprava, denní výzva zvýrazněná, nic přes ni '+JSON.stringify(s));
 const vis=await E("(()=>{const r=document.querySelector('#dailyBox').getBoundingClientRect(),a=document.querySelector('#spotAr').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&a.top>=0&&a.bottom<=innerHeight&&a.left>=0&&a.right<=innerWidth;})()");
 ok(vis,'karta výzvy i šipka jsou na obrazovce');
 await p.screenshot({path:'out/ukazmi_'+lang+'_'+phone+'_vyzva.png'});
 await p.waitForTimeout(1500);s=await st();ok(s.spot&&!s.feat,'zvýraznění vydrží, další karta čeká');
 await p.mouse.click(30,400);await p.waitForTimeout(1200);s=await st();ok(!s.spot&&s.feat&&!s.news,'klepnutí → zvýraznění zmizí, přijde 2. karta '+JSON.stringify(s));
 await p.click('#fcGo');await p.waitForTimeout(1300);s=await st();
 ok(s.st==='menu'&&s.spot&&s.spotEl==='mLoot'&&s.ar&&!s.feat&&!s.news,'Ukaž mi to → menu, truhla zvýrazněná '+JSON.stringify(s));
 const ar=await E("(()=>{const r=document.querySelector('#mLoot').getBoundingClientRect(),a=document.querySelector('#spotAr').getBoundingClientRect();return a.top>=r.bottom&&a.bottom<=r.bottom+40&&Math.abs((a.left+a.right)/2-(r.left+r.right)/2)<=2;})()");
 ok(ar,'šipka je pod truhlou a míří na ni');
 await p.screenshot({path:'out/ukazmi_'+lang+'_'+phone+'_truhla.png'});
 const c0=await E("save.coins");await p.click('#mLoot');await p.waitForTimeout(2600);s=await st();
 ok(!s.spot&&(await E("save.coins"))>c0,'klepnutí na truhlu ji rovnou vyzvedne a zvýraznění zmizí');
 ok(s.news&&!s.feat,'až teď Novinky '+JSON.stringify(s));
 await p.screenshot({path:'out/ukazmi_'+lang+'_'+phone+'_novinky.png'});
 // bez ťuknutí zvýraznění samo zmizí po 6 s
 await E("document.querySelector('#newsOk').click();spotOn(()=>document.querySelector('#mLoot'),0);1");await p.waitForTimeout(6600);s=await st();ok(!s.spot&&!s.ar,'zvýraznění samo zmizí po 6 s');
 ok(await E("!document.querySelector('.kspot')"),'po zvýraznění nezůstane rám');
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
