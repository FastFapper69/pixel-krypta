// Komiksové cutscény (12d): každý komiks CMX v CZ i EN – žádná chyba JS, popisky/bubliny/zvuková slova uvnitř svých panelů,
// opravdové přehrání (overlay, klepnutí na další panel, Přeskočit zavře a zavolá pokračování) a snímky konečné stránky.
// node komiks.js [cs|en|obe=obe] [id,id…] [--pas]  → snímky tests/tools/out/komiks/<id>-<lang>.png (×2), --pas = pás 6 okamžiků
const L=require('./lib'),fs=require('fs'),path=require('path');
const LANGS=(process.argv[2]&&process.argv[2]!=='obe')?[process.argv[2]]:['cs','en'],ONLY=process.argv[3]&&!process.argv[3].startsWith('--')?process.argv[3].split(','):null,PAS=process.argv.includes('--pas');
const OUT=path.join(__dirname,'out','komiks');fs.mkdirSync(OUT,{recursive:true});let bad=0;const no=m=>{bad++;console.log('CHYBA: '+m);};
(async()=>{L.prep();
for(const lang of LANGS){const {p,E,errs,close}=await L.open({lang,phone:'se',save:'mid'});
 const ids=ONLY||await E('CMX.ids()');
 // every chapter finale (and the prologue) must have its comic – new chapters included
 const miss=await E("['prolog'].concat(CHAPTERS.map(C=>C.maps[C.maps.length-1])).filter(id=>!CMX.has(id))");if(miss.length)no(lang+': finále bez komiksu: '+miss.join(', ')+' (přidej COMIC v CMX, skill nova-kapitola)');
 for(const id of ids){
  if(process.env.V)console.log(lang,id);const r=await E(`(()=>{const cm=CMX.C['${id}'](),beat=.5,last=cm.panels[cm.panels.length-1].t0*beat,[c,g]=CMX.mk(CMX.AW,CMX.AH),shots=[],T=[.4,1.6,3.2,4.4,last+1,last+4.6];
   for(const t of T.slice(0,-1)){g.clearRect(0,0,c.width,c.height);CMX.frame(cm,t,beat,g);if(${PAS})shots.push(c.toDataURL());}
   CMX.dbg(1);g.clearRect(0,0,c.width,c.height);CMX.frame(cm,T[T.length-1],beat,g);const rects=CMX.dbg(0);shots.push(c.toDataURL());return {rects,shots};})()`);
  const panels=r.rects.filter(q=>q.k==='panel');
  for(const q of r.rects){if(q.k==='panel')continue;
   const inside=panels.some(P=>q.x>=P.x-1&&q.y>=P.y-1&&q.x+q.w<=P.x+P.w+1&&q.y+q.h<=P.y+P.h+1);
   if(!inside)no(lang+' '+id+': '+q.k+' „'+q.t+'“ přetéká z panelu ('+[q.x,q.y,q.w,q.h].map(Math.round)+')');}
  for(let i=0;i<r.rects.length;i++)for(let j=i+1;j<r.rects.length;j++){const a=r.rects[i],b=r.rects[j];if(a.k==='panel'||b.k==='panel')continue;
   if(a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h)no(lang+' '+id+': „'+a.t+'“ se překrývá s „'+b.t+'“');}
  const save=(u,f)=>fs.writeFileSync(path.join(OUT,f),Buffer.from(u.split(',')[1],'base64'));
  save(r.shots[r.shots.length-1],id+'-'+lang+'.png');if(PAS)r.shots.forEach((u,i)=>save(u,id+'-'+lang+'-'+i+'.png'));}
 if(process.env.V)console.log('playback');
 // real playback on the phone: overlay, tap → next panel, skip → done
 const pl=await E(`new Promise(res=>{let done=0;const ok=CMX.play('trun',()=>{done=1;});setTimeout(()=>{const el=$('#comic'),cv=el.querySelector('canvas'),r=cv.getBoundingClientRect(),b=el.querySelector('.cm-skip').getBoundingClientRect(),vis=!el.hidden,t0=CMX.cur.T;CMX.cur.next();const t1=CMX.cur.T;
   el.querySelector('.cm-skip').click();setTimeout(()=>res({ok,vis,w:r.width,h:r.height,top:r.top,bb:b.bottom,H:innerHeight,W:innerWidth,jump:t1>t0+1,done,gone:el.hidden,cur:!!CMX.cur}),400);},700);})`);
 if(!pl.ok||!pl.vis||pl.w<300)no(lang+': přehrávač se neukázal '+JSON.stringify(pl));if(pl.bb>pl.H||pl.w>pl.W+1)no(lang+': přehrávač přetéká obrazovku '+JSON.stringify(pl));
 if(!pl.jump)no(lang+': klepnutí neposune na další panel');if(!pl.done||!pl.gone||pl.cur)no(lang+': Přeskočit nezavřel komiks / nezavolal pokračování '+JSON.stringify(pl));
 await E("CMX.play('prolog',()=>{})");await p.waitForTimeout(2600);await L.shot(p,path.join(OUT,'telefon-'+lang+'.png'));await E("CMX.cur&&CMX.cur.finish()");await p.waitForTimeout(400);
 if(errs.length)no(lang+': chyby JS '+errs.join(' | '));await close();}
console.log(bad?'komiksy: '+bad+' chyb':'komiksy OK ('+LANGS.join('+')+')');process.exit(bad?1:0);})();
