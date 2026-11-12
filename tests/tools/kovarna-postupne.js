// 12w: strom v Kovárně se odhaluje postupně (uživatel 12. 11.: „nemělo by se tohle odemykat postupně?“).
// Ověří: nový hráč vidí jen první statistiku sloupce, první novou schopnost a jednu tajnou (?); druhá statistika po 5 úrovních první
// + značka na Kovárně + zvýraznění; rozehraný účet nedostane značku za uzly, které už zná; nic koupeného nezmizí. node kovarna-postupne.js [cs|en] [se|13]
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 {const {p,E,errs,close}=await L.open({save:'fresh',lang,phone});
  await E("save.feat=save.feat||{};save.feat.forge=1;save.coins=99999;save.mats.shard=9999;save.cleared={hrbitov:true,bazina:true,kostnice:true,zvonice:true};persist();openMenu();1");await p.waitForTimeout(300);
  ok(!(await E("$('#mForge').classList.contains('new')")),'nový hráč: Kovárna bez značky za základní uzly');
  await E("renderShop();setState('shop');1");await p.waitForTimeout(500);
  const vis=()=>E("[...document.querySelectorAll('#shopList .tcol')].map(c=>[...c.querySelectorAll('.tn')].map(b=>(b.dataset.sec?'?':'')+b.dataset.id).join(','))");
  let v=await vis();ok(v.every(c=>c.split(',').length===3&&c.includes('?')),'na začátku 3 uzly ve sloupci (statistika, schopnost, tajná) '+JSON.stringify(v));
  await p.screenshot({path:'out/kovarna_'+lang+'_'+phone+'_zacatek.png'});
  await E("for(let i=0;i<5;i++)save.meta.dmg=(save.meta.dmg||0)+1;persist();openMenu();1");await p.waitForTimeout(300);
  ok(await E("$('#mForge').classList.contains('new')"),'po 5 úrovních Síly má Kovárna značku');
  await E("renderShop();setState('shop');1");await p.waitForTimeout(900);v=await vis();
  ok(v[0].split(',').includes('build'),'ukázala se Dílna '+v[0]);ok(await E("SPOT.on&&SPOT.el&&SPOT.el.dataset.id==='build'"),'nový uzel je zvýrazněný');
  await p.screenshot({path:'out/kovarna_'+lang+'_'+phone+'_dilna.png'});
  await E("$('#newsPop').hidden=true;spotOff(true);openMenu();1");await p.waitForTimeout(300);ok(!(await E("$('#mForge').classList.contains('new')")),'po prohlédnutí značka zmizí');
  await E("document.querySelector('#scr-shop')&&0;renderShop();setState('shop');1");await p.waitForTimeout(400);
  await E("document.querySelector('#shopList .tn.sec').click();1");await p.waitForTimeout(300);ok(await E("/\\?/.test($('#newsPop h3').textContent)&&!!$('#newsPop .lkm').textContent"),'tajná schopnost ukáže jen podmínku: '+await E("$('#newsPop .lkm').textContent"));
  ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();}
 {const {p,E,errs,close}=await L.open({save:'late',lang,phone});await E("openMenu();1");await p.waitForTimeout(300);
  ok((await E("newOf('tree').length"))===0,'rozehraný účet: žádná značka za uzly stromu');
  await E("save.meta.dmg=2;save.meta.a1=4;save.meta.a2=1;persist();1");const all=await E("TREE.map(T=>T.stats.filter(id=>save.meta[id]>0).length+T.keys.filter(k=>save.meta[k.id]>0).length)");const n=await E("TREE.map(T=>treeVis(T).filter(x=>!x.sec&&(save.meta[x.id]||0)>0).length)");ok(n.every((x,i)=>x===all[i]),'nic koupeného nezmizelo '+JSON.stringify([n,all]));
  ok(!errs.length,'bez chyb JS');await close();}
 process.exit(bad?1:0);})();
