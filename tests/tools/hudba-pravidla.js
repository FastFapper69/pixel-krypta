// 10f: pravidla hudby, která vzešla z poslechu (10a–10f), jako kontrola – ať je nová kapitola nemůže porušit.
// Používá ji hudbacheck.js (všechny skladby nebo jedna kapitola) a chapcheck.js (každá kapitola).
// Měření hlasitosti po taktech (propady, klid, boss) dělá skladby.js – je pomalé, proto zvlášť.
//
// Pravidla (CHYBA = musí se opravit, pozor = doporučení):
//  - každá sekce z form0/form/bossForm existuje, melodie má 32 osmin a žádný takt bez not (na telefonu díra −16 až −25 dB)
//  - boss má aspoň jednu sekci s energií 3
//  - (10h) styl skladby má banger kit STYLES.x.bang = bangKit({...}) a BANG_TRIM (hlasitost hustšího aranžmá přes zvuk.js), skladba ho nevypíná (bang:false)
//  - (10h) melodie může mít i 64 šestnáctin (hraje se přesně, jako menu); sekce smí mít vlastní basový riff bass[64] a protimelodii cm[64]
//  - styl existuje v STYLES a má změřený mix: STYLE_ROLE (tests/tools/rolecal.js), STYLE_TRIM a STYLE_REV
//  - kapitola má jeden vlastní styl, který nepoužívá žádná jiná kapitola (každá kapitola zní jinak)
//  - úvodní motiv (1. takt sekce A) je jedinečný mezi všemi skladbami (i po transpozici)
//  - pestrost: aspoň MIN_SHAPES různých taktů melodie (po transpozici) – jinak je to jeden motif dokola
//  - skladba ze songKit má vlastní odpověď (answer) a vlastní boss motiv – odvozené jsou jen nouzovka
const MIN_SHAPES=12;
function rules(ids,MIN){
  const out={songs:{},issues:[],warn:[]},shape=a=>{const f=a.find(v=>v!=null);return a.map(v=>v==null?'.':v-f).join(',');};
  const chOf=id=>{const C=CH_OF[id];return C?C.id:null;},styleCh={};
  for(const id in SONGS){const c=chOf(id);if(c){(styleCh[SONGS[id].style]=styleCh[SONGS[id].style]||new Set()).add(c);}}
  const motifOf=S=>S.sec&&S.sec.A&&S.sec.A.lead?shape(S.sec.A.lead.slice(0,8)):null;
  for(const id of ids){const S=SONGS[id],o={issues:[],warn:[],shapes:0,style:S&&S.style};out.songs[id]=o;
    if(!S){o.issues.push('chybí skladba v SONGS');continue;}
    if(!STYLES[S.style])o.issues.push('neznámý styl '+S.style);
    else{if(!STYLE_ROLE[S.style])o.issues.push('styl '+S.style+' nemá změřený mix STYLE_ROLE (node rolecal.js '+id+')');
      if(STYLE_TRIM[S.style]==null&&S.style!=='grave')o.issues.push('styl '+S.style+' nemá STYLE_TRIM (srovnej hlasitost přes zvuk.js)');
      if(STYLE_REV[S.style]==null)o.issues.push('styl '+S.style+' nemá STYLE_REV');
      if(!STYLES[S.style].bang)o.issues.push('styl '+S.style+' nemá banger kit (STYLES.'+S.style+'.bang=bangKit({...}))');
      if(BANG_TRIM[S.style]==null)o.issues.push('styl '+S.style+' nemá BANG_TRIM (srovnej hlasitost přes zvuk.js)');
      if(S.bang===false)o.warn.push('skladba má vypnutý banger (bang:false)');}
    const used=[...new Set([...(S.form0||[]),...(S.form||[]),...(S.bossForm||[])])],sh=new Set();
    for(const k of used){const X=S.sec[k];if(!X){o.issues.push('sekce '+k+' chybí');continue;}const L=X.lead||[];
      const W=L.length===64?16:8;if(L.length!==32&&L.length!==64)o.issues.push('sekce '+k+': melodie nemá 32 osmin ani 64 šestnáctin ('+L.length+')');
      for(const q of ['bass','cm'])if(X[q]&&X[q].length!==64)o.issues.push('sekce '+k+': '+q+' nemá 64 šestnáctin');
      for(let b=0;b<L.length;b+=W){const bar=L.slice(b,b+W);if(bar.every(v=>v==null))o.issues.push('sekce '+k+', takt '+(b/W+1)+': bez melodie (díra na telefonu)');else sh.add(shape(bar));}}
    if(!(S.bossForm||[]).some(k=>S.sec[k]&&S.sec[k].e>=3))o.issues.push('boss nemá sekci s energií 3');
    o.shapes=sh.size;if(sh.size<MIN)o.warn.push('málo pestrá: '+sh.size+' různých taktů (aspoň '+MIN+')');
    const mo=motifOf(S);if(mo)for(const j in SONGS)if(j!==id&&j!=='menu'&&motifOf(SONGS[j])===mo)o.issues.push('úvodní motiv stejný jako '+j);
    if(S.kit){if(!S.kit.answer)o.warn.push('songKit bez vlastní odpovědi (answer) – odvozená zní jako ozvěna motivu');if(!S.kit.boss)o.warn.push('songKit bez vlastního boss motivu (boss)');}
    const c=chOf(id);if(c&&styleCh[S.style]&&styleCh[S.style].size>1)o.issues.push('styl '+S.style+' sdílí víc kapitol ('+[...styleCh[S.style]].join(', ')+') – kapitola má mít vlastní zvuk');}
  // a chapter: one style for all its maps
  const st=new Set(ids.map(i=>SONGS[i]&&SONGS[i].style).filter(Boolean));if(ids.length>1&&st.size>1)out.warn.push('mapy kapitoly mají různé styly: '+[...st].join(', '));
  return out;}
// run inside the game page (Playwright page with off.html loaded)
async function musicCheck(page,ids,min){return JSON.parse(await page.evaluate(([src,ids,min])=>window.__krypta._ev('JSON.stringify(('+src+')('+JSON.stringify(ids)+','+min+'))'),[rules.toString(),ids,min||MIN_SHAPES]));}
module.exports={musicCheck,MIN_SHAPES};
