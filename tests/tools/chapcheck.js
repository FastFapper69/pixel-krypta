// Kontrola kapitoly nebo hrdiny: vypíše, co chybí, a udělá přehledový obrázek (mapy, nepřátelé, bossové, intro, set, legendárka).
// node chapcheck.js c5            -> kapitola (id z CHAPTERS)
// node chapcheck.js hero:sailor   -> hrdina
// node chapcheck.js all           -> všechny kapitoly a hrdinové (jen text)
// Před spuštěním: off.html a lang-en.js vedle skriptu (viz CLAUDE.md, Rozjetí testů). Obrázek: <arg>_check.png v aktuální složce.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{musicCheck}=require('./hudba-pravidla'),{measureNames,MAX:NAME_MAX}=require('./jmenahrdinu');
const arg=process.argv[2]||'all',root=path.join(__dirname,'..','..');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:1});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 global.window={};eval(fs.readFileSync(path.join(root,'lang-en.js'),'utf8'));const EN=window.KRYPTA_EN;
 const kampan=fs.readFileSync(path.join(root,'KAMPAN.md'),'utf8');
 const data=await p.evaluate(arg=>{const E=window.__krypta._ev;return E(`(()=>{
  const out={ch:[],hero:[]},T=s=>s==null?'':String(s);
  // guide texts (world tab): name -> description shown
  renderGuide('world');const gd={};document.querySelectorAll('#gdList .gd, .gd').forEach(r=>{const b=r.querySelector('b'),s=r.querySelector('small');if(b)gd[b.textContent]=s?s.textContent.trim():'';});
  const chs=${JSON.stringify(arg)}==='all'?CHAPTERS:CHAPTERS.filter(C=>C.id===${JSON.stringify(arg)});
  for(const C of chs){const ci=C.i,o={id:C.id,name:C.name,maps:[],issues:[],warn:[],enemies:[],bosses:[]};out.ch.push(o);
   if(C.maps.length!==5)o.issues.push('kapitola nemá 5 map');
   const seenE=new Set();
   C.maps.forEach((id,mi)=>{const M=MAPS[id],fin=mi===C.maps.length-1;if(!M){o.issues.push(id+': mapa chybí v MAPS');return;}
    o.maps.push({id,name:M.name,desc:M.desc,boss:M.boss,fin});
    if(fin&&!M.finale)o.issues.push(id+': poslední mapa nemá finale:1');
    // 11h: obtížnost podle síly hráče (kitTier/PWR). Vlastní řádek MAP_TIER daleko od vzorce = mechanika mapy, nebo chybně vyladěno
    {const K=kitTier(id);if(!M.hpm||!M.dmm)o.issues.push(id+': mapa nemá hpm/dmm');else if(MAP_TIER[id]&&K){const r=M.hpm/K[0];if(r<.6||r>1.6)o.warn.push(id+': HP nepřátel ×'+M.hpm+' je '+(r>1?'nad':'pod')+' vzorcem síly hráče ×'+K[0]+' (mechanika mapy? ověř: node ladeni.js '+id+')');}
     else if(!MAP_TIER[id])o.warn.push(id+': obtížnost ze vzorce síly hráče (HP ×'+M.hpm+', poškození ×'+M.dmm+'); doladit boty: node ladeni.js '+C.id+' a node ladeni.js zapis');}
    if(!M.desc)o.issues.push(id+': chybí popis mapy');else if(!/<b>/.test(M.desc)&&!/Finále/.test(M.desc))o.warn.push(id+': popis nemá mechaniku v <b> (OK jen u mapy bez mechaniky)');
    if(!MAP_BUILD[M.style]&&!['gk','desert','mines'].includes(M.style))o.issues.push(id+': neznámý styl '+M.style);
    if(!SONGS[id])o.warn.push(id+': nemá vlastní skladbu v SONGS (hraje první mapa kapitoly)');
    if(!MAP_TIER[id])o.warn.push(id+': bez MAP_TIER, bere se vzorec kitTier '+JSON.stringify(kitTier(id)));
    if(!M.boss||!BOSS_DEFS[M.boss])o.issues.push(id+': boss chybí');
    else{const B=BOSS_DEFS[M.boss];o.bosses.push(M.boss);if(!SPR.boss[M.boss])o.issues.push(M.boss+': chybí sprite bosse');if(!BOSS_INTRO[M.boss]||!BOSS_INTRO[M.boss].line)o.issues.push(M.boss+': chybí hláška v BOSS_INTRO');
      else o.introLines=(o.introLines||[]).concat([BOSS_INTRO[M.boss].line]);
      if(B.pat!=='kit'&&!BEH[B.pat]&&!['ring','summon','dashring','charger','wave','ghost','ranged'].includes(B.pat))o.issues.push(M.boss+': neznámé chování '+B.pat);
      if(!gd[B.name])o.issues.push(M.boss+': chybí v Průvodci (Bossové)');}
    for(const s of M.spawns||[]){if(!ENEMY_DEFS[s.e]){o.issues.push(id+': neznámý nepřítel '+s.e);continue;}seenE.add(s.e);}
    for(const s of M.elites||[])if(!ENEMY_DEFS[s.e])o.issues.push(id+': neznámá elita '+s.e);
    if(!WANT_OF[id]||!WANTED[WANT_OF[id]])o.issues.push(id+': chybí hledaný (WANT_OF)');});
   // enemies that first appear in this chapter
   const earlier=new Set(CHAPTERS.slice(0,ci).flatMap(c=>c.maps.flatMap(m=>(MAPS[m].spawns||[]).map(s=>s.e))));
   for(const e of seenE)if(!earlier.has(e)){o.enemies.push(e);if(!gd[ENEMY_DEFS[e].name])o.issues.push(e+': nový nepřítel chybí v Průvodci');}
   if(ci>0&&o.enemies.length<2)o.warn.push('kapitola přidává jen '+o.enemies.length+' nových nepřátel (zvykem jsou 3–4)');
   // set
   const sid=SET_OF_CH[C.id];if(!sid)o.issues.push('chybí set kapitoly (SETS[..].ch)');
   else{const S=SETS[sid];o.set={id:sid,name:S.name,slots:S.slots,six:!!S.six};
     for(const k of S.slots){if(!S.pieces[k])o.issues.push(sid+': chybí kus '+k);if(!ITEM_ART[sid+'_'+k])o.issues.push(sid+': chybí obrázek '+sid+'_'+k);}
     if(((ci+1)%5===0)!==!!S.six)o.issues.push(sid+': '+((ci+1)%5===0?'každá pátá kapitola má mít set 6 kusů (six:1, b6)':'set 6 kusů jen v každé páté kapitole'));
     if(S.six&&(!S.b6||!S.b6n))o.issues.push(sid+': chybí bonus za 6 kusů');
     const prev=ci>0&&SET_OF_CH[CHAPTERS[ci-1].id];if(prev&&JSON.stringify(SETS[prev].slots.slice().sort())===JSON.stringify(S.slots.slice().sort()))o.issues.push(sid+': stejné sloty jako set předchozí kapitoly');
     if(!S.b2||!S.b4||!S.b4n)o.issues.push(sid+': chybí texty bonusů 2/4');
     if(!ACH.some(a=>String(a.v).includes(C.maps[4])))o.warn.push('Mistrovství za finále kapitoly chybí (ACH s v:()=>save.cleared.'+C.maps[4]+')');}
   const lg=FIN_LEG[C.maps[4]];if(!lg)o.issues.push('chybí legendárka finále (FIN_LEG)');else o.leg=lg;
   if(!Object.values(TW_UNL).some(m=>C.maps.includes(m)))o.warn.push('kapitola neodemyká žádnou věž (TW_UNL)');
   const hs=Object.keys(HEROES).filter(h=>HEROES[h].need&&C.maps.includes(HEROES[h].need)||HEROES[h].soon===C.id);o.heroes=hs;
   if(SOON_CH[C.id]&&!ROMAN_CH[ci])o.issues.push('ROMAN_CH nemá číslo kapitoly');
   if(!CH_BG[ci%CH_BG.length])o.warn.push('barvy intra bossů');
  }
  const hs=${JSON.stringify(arg)}==='all'?Object.keys(HEROES):${JSON.stringify(arg)}.startsWith('hero:')?[${JSON.stringify(arg)}.slice(5)]:[];
  for(const h of hs){const H=HEROES[h],o={id:h,name:H&&H.name,issues:[],warn:[]};out.hero.push(o);if(!H){o.issues.push('hrdina neexistuje');continue;}
   if(!/<b>/.test(H.desc||''))o.issues.push('popis nemá bonus v <b>');if(!SPR.hero[h])o.issues.push('chybí sprite');
   const w=H.start;if(!WEAPONS[w])o.issues.push('startovní zbraň '+w+' neexistuje');else{if(!SPR.icon[w])o.issues.push('zbraň bez ikony');if(!LOGIC[w])o.issues.push('zbraň bez LOGIC');if(LOGIC[w]&&LOGIC[w].fire&&W_OFF[w]===undefined)o.warn.push('zbraň bez W_OFF (rytmický posun, výchozí 0)');
     if(!['knight','mage','archer','bard','builder'].includes(h)&&W_HERO[w]!==h)o.warn.push('tematická zbraň není v W_HERO');if(WEAPONS[w].lv.length!==6)o.issues.push('zbraň nemá 6 úrovní');}
   const T=TALENTS[h];if(!T||T.length!==4)o.issues.push('TALENTS nemá 4 talenty');
   if(!new RegExp(h+":'").test(heroBonus.toString()))o.issues.push('chybí prefix talentů v heroBonus');
   if(H.soon&&!SOON_CH[H.soon])o.issues.push('soon bez SOON_CH');if(!H.soon&&!H.cost&&!['knight','bard'].includes(h)&&!H.ach)o.warn.push('cena 0');
   if(!gd[H.name])o.issues.push('chybí v Průvodci');}
  out.allCz=[...out.ch.flatMap(o=>[o.name,...o.maps.flatMap(m=>[m.name,m.desc]),...(o.introLines||[])]),...out.hero.map(o=>o.name)];
  return JSON.stringify(out);})()`);},arg);
 const D=JSON.parse(data);let bad=0;
 // 10f: music rules (hudba-pravidla.js) for every chapter – own style with a measured mix, melody in every bar, unique motifs, variety
 for(const o of D.ch){const r=await musicCheck(p,o.maps.map(m=>m.id));o.warn.push(...r.warn.map(w=>'hudba: '+w));
   for(const id in r.songs){for(const i of r.songs[id].issues)o.issues.push(id+' hudba: '+i);for(const w of r.songs[id].warn)o.warn.push(id+' hudba: '+w);}
   if(arg!=='all')o.warn.push('hudba: změř hlasitost po taktech – node skladby.js '+o.id+' (propady 0, klid −2 až −6, boss +3 až +5 dB)');}
 const missEN=s=>s&&EN[s]==null;
 for(const o of D.ch){if(!kampan.includes(o.name))o.warn.push('KAMPAN.md nezmiňuje kapitolu');
   for(const m of o.maps){if(missEN(m.name))o.issues.push(m.id+': chybí anglický název');if(missEN(m.desc))o.issues.push(m.id+': chybí anglický popis');if(!fs.existsSync(path.join(root,'thumbs',m.id+'.png')))o.issues.push(m.id+': chybí pohlednice thumbs/'+m.id+'.png (thumbgen.js)');}
   for(const l of o.introLines||[])if(missEN(l))o.issues.push('hláška bez překladu: '+l);
   console.log('\n== Kapitola '+o.id+' · '+o.name+' == mapy '+o.maps.map(m=>m.id).join(', ')+' | noví nepřátelé '+o.enemies.join(', ')+' | set '+(o.set?o.set.id+' ['+o.set.slots.join(',')+']'+(o.set.six?' ×6':''):'-')+' | legendárka '+(o.leg||'-')+' | hrdinové '+o.heroes.join(', '));
   for(const i of o.issues)console.log('  CHYBA  '+i);for(const w of o.warn)console.log('  pozor  '+w);bad+=o.issues.length;if(!o.issues.length)console.log('  OK');}
 // 10f: hero name must fit its tile at full font size on the narrowest phone, CZ and EN (jmenahrdinu.js)
 if(D.hero.length){const rows=await measureNames(arg.startsWith('hero:')?arg.slice(5):null);
   for(const r of rows)if(!r.ok){const o=D.hero.find(h=>h.id===r.id);if(o)o.issues.push('jméno „'+r.t+'“ ('+r.lang+') zabere '+r.pct+' % dlaždice, limit '+NAME_MAX+' % – zkrať ho (nebo sname)');}}
 for(const o of D.hero){if(missEN(o.name))o.issues.push('chybí anglické jméno');console.log('\n== Hrdina '+o.id+' · '+o.name);for(const i of o.issues)console.log('  CHYBA  '+i);for(const w of o.warn)console.log('  pozor  '+w);bad+=o.issues.length;if(!o.issues.length)console.log('  OK');}
 // overview sheet for one chapter: thumbnails, enemies, bosses, set pieces, legendary, heroes
 if(arg!=='all'&&!arg.startsWith('hero:')&&D.ch[0]){const url=await p.evaluate(async id=>{const E=window.__krypta._ev;const ms=JSON.parse(E("JSON.stringify(CHAPTERS.find(c=>c.id==='"+id+"').maps)"));window.__th={};
   await Promise.all(ms.map(m=>new Promise(r=>{const i=new Image();i.onload=()=>{window.__th[m]=i;r();};i.onerror=r;i.src='thumbs/'+m+'.png';})));return E(`(()=>{const C=CHAPTERS.find(c=>c.id==='${id}');
   const ens=[...new Set(C.maps.flatMap(m=>(MAPS[m].spawns||[]).map(s=>s.e)))],sid=SET_OF_CH[C.id],S=sid&&SETS[sid],hs=Object.keys(HEROES).filter(h=>HEROES[h].need&&C.maps.includes(HEROES[h].need)||HEROES[h].soon===C.id);
   const cv=document.createElement('canvas'),W=780,H=640;cv.width=W;cv.height=H;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#1a1423';g.fillRect(0,0,W,H);g.font='bold 14px sans-serif';g.fillStyle='#f6c744';
   const lab=(t,x,y)=>{g.fillStyle='#bfb8c8';g.font='11px sans-serif';g.fillText(t,x,y);};
   g.fillStyle='#f6c744';g.font='bold 16px sans-serif';g.fillText(C.name,10,20);
   C.maps.forEach((m,i)=>{const t=window.__th[m]||thumbs[m];if(t)g.drawImage(t,10+i*152,30,144,144);else{g.strokeStyle='#e8453c';g.strokeRect(10+i*152,30,144,144);}lab(MAPS[m].name,10+i*152,188);});
   const spr=(s,x,y,sc)=>{if(s)g.drawImage(s.c,x,y,s.c.width*sc,s.c.height*sc);};
   lab('Nepřátelé',10,210);ens.forEach((e,i)=>{spr(SPR.enemy[e],10+(i%12)*62,218+((i/12)|0)*60,2);});
   lab('Bossové',10,350);C.maps.forEach((m,i)=>{spr(SPR.boss[MAPS[m].boss],10+i*152,358,1.4);lab(BOSS_DEFS[MAPS[m].boss].name,10+i*152,468);});
   if(S){lab('Set: '+S.name,10,492);S.slots.forEach((k,i)=>{const s=itemSpr(k,3,sid);g.drawImage(s.c,10+i*70,500,60,60);});}
   const lg=FIN_LEG[C.maps[4]];if(lg){lab('Legendárka',440,492);g.fillStyle='#ff9a3a';g.font='bold 13px sans-serif';g.fillText(LEGS[lg].name,440,516);}
   lab('Hrdinové',600,492);hs.forEach((h,i)=>spr(SPR.hero[h],600+i*60,500,2));
   cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;width:'+W+'px;height:'+H+'px';document.body.appendChild(cv);return 1;})()`);},D.ch[0].id);
  await p.setViewportSize({width:780,height:640});await p.waitForTimeout(100);await p.screenshot({path:arg+'_check.png',clip:{x:0,y:0,width:780,height:640}});console.log('\nPřehled: '+arg+'_check.png');}
 if(errs.length)console.log('chyby stránky',errs.slice(0,5));console.log(bad?'\nCelkem chyb: '+bad:'\nVše v pořádku.');await b.close();process.exit(bad?1:0);})();
