// 12s: Příprava při otevření odroluje k vybrané mapě jen když není vidět; výběr hrdiny ani mapy už s obrazovkou nehýbe
// (uživatel 12. 11.: „při volbě hrdiny to snapne zpět na dolní část screenu“). node priprava-rolovani.js [cs|en] [se|13]
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{const {p,E,errs,close}=await L.open({save:'mid',lang,phone});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 const sc=()=>E("(()=>{const e=[document.querySelector('#scr-select'),document.querySelector('#scr-select .wrap'),document.scrollingElement].find(x=>x&&x.scrollTop>0);return e?Math.round(e.scrollTop):0;})()");
 const vis=()=>E("(()=>{const m=document.querySelector('#mapList .mnode.sel');if(!m)return false;const r=m.getBoundingClientRect(),g=document.querySelector('#goBtn').getBoundingClientRect(),h=document.querySelector('#scr-select .head').getBoundingClientRect();return r.top>=h.bottom-1&&r.bottom<=g.top;})()");
 // vybraná mapa = poslední otevřená v kapitole (dole v seznamu)
 await E("save.heroes=save.heroes||{};save.heroes.mage=true;persist();sel.picked=1;const C=CHAPTERS[2];sel.map=C.maps[C.maps.length-1];sel.nm=0;renderSelect();setState('select');1");await p.waitForTimeout(700);
 ok(await vis(),'po otevření je vybraná mapa vidět (nad Vyrazit) · rolováno '+await sc());
 // 13b (uživatel: „při otevření přípravy to problikne a snapne se zase dolů“): odrolovat ještě před 1. vykreslením, pak už se nehýbat
 await E("openMenu();1");await p.waitForTimeout(400);
 const fr=await p.evaluate(()=>new Promise(res=>{const K=window.__krypta,el=()=>[document.querySelector('#scr-select'),document.querySelector('#scr-select .wrap'),document.scrollingElement].find(x=>x&&x.scrollTop>0),v=()=>{const e=el();return e?Math.round(e.scrollTop):0;};
  K._ev("sel.picked=1;const C=CHAPTERS[2];sel.map=C.maps[C.maps.length-1];renderSelect();setState('select');1");const a=[];let n=0;const f=()=>{a.push(v());if(++n<20)requestAnimationFrame(f);else res(a);};requestAnimationFrame(f);}));
 ok(fr[0]>0&&fr.every(x=>x===fr[0]),'otevření: od 1. snímku na místě, žádný skok · '+fr.join(','));
 await E("(()=>{for(const e of [document.querySelector('#scr-select'),document.querySelector('#scr-select .wrap'),document.scrollingElement])if(e)e.scrollTop=0;})()");await p.waitForTimeout(200);
 const own=await E("HERO_IDS.filter(h=>heroOwned(h)&&h!==sel.hero)[0]||''");
 if(own){await E("document.querySelectorAll('#heroList [data-id], #heroList button, #heroList .hcard').length");
   await E(`(()=>{const b=[...document.querySelectorAll('#heroList *')].find(x=>x.dataset&&x.dataset.id==='${own}')||[...document.querySelectorAll('#heroList button')][1];b.click();})()`);await p.waitForTimeout(400);
   ok(await sc()===0,'výběr hrdiny nahoře s obrazovkou nehne · rolováno '+await sc()+' · hrdina '+await E("sel.hero"));}
 else ok(false,'účet nemá druhého hrdinu');
 await p.screenshot({path:'out/priprava-rolovani_'+lang+'_'+phone+'.png'});
 const y0=await sc();await E("(()=>{const b=[...document.querySelectorAll('#mapList .mnode')].filter(x=>!x.classList.contains('sel'))[0];if(b)b.click();})()");await p.waitForTimeout(400);
 ok(await sc()===y0,'klepnutí na jinou mapu s obrazovkou nehne · '+y0+' → '+await sc());
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
