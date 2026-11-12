// 12k: denní a týdenní výzva jen na mapách, které hráč už vyhrál; mapa zůstane stejná celý den/týden,
// i když hráč mezitím vyhraje další mapu. Dva hráči na stejném postupu mají stejnou mapu. node vyzvamapa.js
const L=require('./lib');
(async()=>{const {p,E,errs,close}=await L.open({save:'fresh'});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 const setup=n=>E("save.cleared={};delete save.daily.pk;delete save.wk;for(const C of CHAPTERS.slice(0,"+n+"))for(const m of C.maps)save.cleared[m]=true;qEnsure();1");
 for(const n of [1,2,3,4]){await setup(n);const r=await E("(()=>{const d=dailyInfo(),w=wkInfo();return{d:d.map,w:w.map,dc:CHAPTERS.indexOf(CH_OF[d.map]),wc:CHAPTERS.indexOf(CH_OF[w.map])}})()");
  ok(r.dc<n&&r.wc<n,'vyhrané kapitoly I–'+n+': denní '+r.d+' (kap. '+(r.dc+1)+'), týdenní '+r.w+' (kap. '+(r.wc+1)+')');}
 // stejná mapa po další výhře (zámek na den/týden)
 await setup(2);const a=await E("[dailyInfo().map,wkInfo().map]");
 await E("for(const m of CHAPTERS[2].maps)save.cleared[m]=true;1");const b=await E("[dailyInfo().map,wkInfo().map]");
 ok(a[0]===b[0]&&a[1]===b[1],'po výhře další kapitoly zůstává mapa: '+a.join(',')+' → '+b.join(','));
 // stejný postup = stejná mapa (druhý „hráč“ se stejnými výhrami bez zámku)
 await E("delete save.daily.pk;delete save.wk.map;1");await E("for(const m of CHAPTERS[2].maps)delete save.cleared[m];1");
 const c=await E("[dailyInfo().map,wkInfo().map]");ok(c[0]===a[0]&&c[1]===a[1],'stejný postup → stejná mapa');
 // nový hráč bez výher: aspoň první mapa, žádná chyba
 await E("save.cleared={};delete save.daily.pk;delete save.wk.map;1");ok(await E("dailyInfo().map===MAP_IDS[0]&&wkInfo().map===MAP_IDS[0]"),'bez výher → první mapa');
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
