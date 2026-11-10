// Loot podle obtížnosti (10j): pevná část odměn za VÝHRU na každé mapě a obtížnosti (Normál, NM I–III).
// Neběží simulace, jen počítá ze vzorců ve hře (endCoins bez sebraného zlata, runRewards bez sebraných Úlomků).
// Ověřuje, že odměna roste: v kapitole po mapách, mezi kapitolami (vstup nové > poslední běžná mapa minulé), Esence finále po kapitolách,
// ceny hrdinů kapitol rostou
// a s obtížností (NM I > Normál …). Volitelně s výsledky botů (hraci-results.json) ukáže skutečné zlato za běh.
// node lootcurve.js [hraci-results.json …]
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
const b=await chromium.launch(),p=await(await b.newContext()).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/'+(process.env.F||'off.html'));await p.waitForTimeout(500);
const T0=await p.evaluate(()=>{const E=window.__krypta._ev;return E(`(()=>{const out=[];
  for(const C of CHAPTERS)for(const m of C.maps){const M=MAPS[m],fin=!!M.finale,chi=C.i;
    for(let nm=0;nm<=3;nm++){
      const gold=Math.round((100+(M.gb||0))*(1+.3*nm)*(1+.15*chi)), // výherní bonus zlata ×kapitola (bez sebraného, bez bonusů hrdiny)
        sh=Math.round((fin?25:10)*1.5*(1+.5*nm)*(fin?1.25:1)*SH_K*(1+.15*chi)), // pevná část Úlomků za výhru
        shK=+((1+.5*nm)*(fin?1.25:1)*SH_K*(1+.15*chi)).toFixed(2), // násobek sebraných Úlomků
        es=fin?Math.round(ES_FIRST[nm]*(1+.15*chi)):0,item=nm?ECON.nmItem[nm]:fin?'zlatá truhla':0;
      out.push({ch:chi+1,m,fin,nm,hpm:M.hpm,dmm:M.dmm,gold,sh,shK,es,item});}}
  return JSON.stringify({T:out,H:HERO_IDS.filter(h=>heroCh(h)>=1).map(h=>({h,ch:heroCh(h)+1,cost:HEROES[h].cost}))});})()`);}).then(JSON.parse);
const {T,H}=T0;
await b.close();
const pad=(s,n)=>String(s).padEnd(n);
console.log('PEVNÁ ODMĚNA ZA VÝHRU (Normál | NM I | NM II | NM III)');
console.log(pad('mapa',12)+pad('zlato',22)+pad('násobek Úlomků',26)+'Esence / předmět (první výhra)');
const maps=[...new Set(T.map(r=>r.m))],issues=[];
for(const m of maps){const R=T.filter(r=>r.m===m);
  console.log(pad(m+(R[0].fin?' ★':''),12)+pad(R.map(r=>r.gold).join('/'),22)+pad(R.map(r=>r.shK).join('/'),26)+R.map(r=>r.es||r.item||'-').join('/'));
  for(let i=1;i<R.length;i++)if(R[i].gold<=R[i-1].gold||R[i].shK<=R[i-1].shK)issues.push(m+': NM '+i+' nedává víc než NM '+(i-1));}
// staircase checks on Normal: loot must grow along the campaign (HP and real difficulty are checked by bots, hraci.js)
const N=T.filter(r=>r.nm===0);
for(let i=1;i<N.length;i++){const a=N[i-1],c=N[i];
  if(c.ch===a.ch){if(c.gold<a.gold)issues.push(c.m+': zlato za výhru menší než '+a.m);}
  else{const prev=N.filter(r=>r.ch===a.ch&&!r.fin).pop();if(c.gold<=prev.gold)issues.push(c.m+': vstup kapitoly nedává víc zlata než '+prev.m);if(c.shK<=prev.shK)issues.push(c.m+': vstup kapitoly nedává víc Úlomků než '+prev.m);}}
const F=T.filter(r=>r.fin&&r.nm===0);for(let i=1;i<F.length;i++)if(F[i].es<=F[i-1].es)issues.push(F[i].m+': finále nedává víc Esence než '+F[i-1].m);
console.log('\nCENY HRDINŮ KAPITOL: '+H.map(x=>x.h+' (kap. '+x.ch+') '+x.cost).join(', '));
for(const x of H){const y=H.find(z=>z.ch<x.ch&&z.cost>=x.cost);if(y)issues.push('hrdina '+x.h+' není dražší než '+y.h+' z dřívější kapitoly');}
// bots: real gold per run
const files=process.argv.slice(2);if(files.length){const rows=files.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')));
  console.log('\nBOTI – zlato za běh (medián výher / proher) a Úlomky za výhru:');
  const med=a=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[a.length>>1]:'-';};
  for(const m of maps){const R=rows.filter(r=>r.map===m);if(!R.length)continue;const W=R.filter(r=>r.won),L=R.filter(r=>!r.won);
    console.log('  '+pad(m,12)+pad('výhra '+med(W.map(r=>r.gain)),14)+pad('prohra '+med(L.map(r=>r.gain)),14)+'Úlomky '+med(W.map(r=>r.shard!=null?r.shard:(r.rw&&r.rw.mat?r.rw.mat[1]:'-'))));}}
console.log('\n'+(issues.length?'PROBLÉMY:\n  '+issues.join('\n  '):'Loot roste všude: po mapách, mezi kapitolami i s obtížností.'));
if(errs.length)console.log('chyby JS:',errs.slice(0,3));
})();
