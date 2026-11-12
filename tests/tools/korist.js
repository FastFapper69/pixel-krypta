// 12q: Kořist krypty (truhla u ohně v menu) a 2minutová denní výzva. node korist.js [cs|en] [se|15]
// Ověří: obojí se odemkne 2. výhrou; truhla začne napůl plná, vyzvednutí dá zlato a Úlomky, hned znovu nejde; plná po 8 h poskakuje;
// truhla nepřekrývá tlačítka menu; denní výzva dá odměnu ve 2:00 jen jednou a běh pokračuje; snímky out/korist_<lang>_*.png
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{const {p,E,errs,close}=await L.open({save:'fresh',lang,phone});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 await E("save.cleared={hrbitov:true};save.feat={};featCheck();save.featNew=[];1");
 ok(await E("!featOn('loot')&&!featOn('daily')"),'po 1. výhře ještě ne');
 await E("save.cleared.bazina=true;featCheck();save.featNew=[];delete save.loot;1");
 ok(await E("featOn('loot')&&featOn('daily')"),'2. výhra odemkne Kořist krypty i denní výzvu');
 await E("setState('menu');openMenu();1");await p.waitForTimeout(900);
 const g=await p.evaluate(()=>{const b=document.querySelector('#mLoot'),r=b&&b.getBoundingClientRect(),hit=[];if(!r||b.hidden)return {vis:false};
   document.querySelectorAll('#mStack button,#mTop button:not(#mLoot)').forEach(x=>{const q=x.getBoundingClientRect();if(q.width&&!(q.right<r.left||q.left>r.right||q.bottom<r.top||q.top>r.bottom))hit.push(x.id);});
   return {vis:true,r:[r.left,r.top,r.width,r.height].map(Math.round),hit,fill:b.querySelector('.lb i').style.width};});
 ok(g.vis&&!g.hit.length,'truhla je vidět a nic nepřekrývá '+JSON.stringify(g));
 await p.screenshot({path:'out/korist_'+lang+'_'+phone+'_menu.png'});
 const c0=await E("save.coins"),m0=await E("save.mats.shard||0");
 await p.click('#mLoot');await p.waitForTimeout(400);
 const c1=await E("save.coins"),m1=await E("save.mats.shard||0");
 ok(c1-c0>=60&&c1-c0<=80&&m1>m0,'napůl plná truhla: +'+(c1-c0)+' zlata, +'+(m1-m0)+' Úlomků');
 await p.click('#mLoot');await p.waitForTimeout(300);ok((await E("save.coins"))===c1,'hned znovu nic nedá');
 await E("save.loot.t=Date.now()-9*36e5;lootUi();1");await p.waitForTimeout(300);
 ok(await E("document.querySelector('#mLoot').classList.contains('full')"),'po 8 h je plná a poskakuje');
 await p.screenshot({path:'out/korist_'+lang+'_'+phone+'_plna.png'});
 await p.click('#mLoot');await p.waitForTimeout(300);ok((await E("save.coins"))-c1===140,'plná truhla v kapitole I: +'+((await E("save.coins"))-c1)+' zlata');
 // denní výzva 2 minuty
 await E("save.daily.chal=null;const di=dailyInfo();startRun('knight',di.map,{mod:di.mod.id});window.__krypta.god=true;run.t=119.5;1");
 const inv0=await E("save.inv.length");for(let i=0;i<30;i++)await E("window.__krypta.step(1/30)");
 ok(await E("!!run.dailyIt&&save.daily.chal===today()&&!run.over")&&(await E("save.inv.length"))===inv0+1,'ve 2:00 přišla odměna a běh pokračuje');
 await p.waitForTimeout(2700);const tt=await E("document.querySelector('#toast').textContent+'|'+document.querySelector('#toast').classList.contains('on')");ok(/Výzva splněna|Challenge complete/.test(tt),'hláška ve hře: '+tt);
 await E("document.querySelector('#note').classList.remove('on');1");await p.screenshot({path:'out/korist_'+lang+'_'+phone+'_vyzva.png'});
 await E("run.t=200;finish(false);1");await p.waitForTimeout(1200);
 ok(await E("save.inv.length")===inv0+1,'po konci běhu žádná druhá truhla');
 ok(/Výzva splněna|Challenge complete/.test(await E("document.querySelector('#ovTitle').textContent")),'obrazovka po běhu: výzva splněna');
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
