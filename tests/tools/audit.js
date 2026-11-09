// Audit projektu jedním příkazem (skill audit-projektu): node audit.js [rychly|plny]
//   rychly (výchozí, ~3 min): statické kontroly, testy ukládání/překladů/kapitol/menu, všechny obrazovky (nový i pokročilý účet, CZ i EN), každá mapa 20 s + boss
//   plny: navíc hráči-boti přes všechny kapitoly (hraci.js zed 1) a výkon menu
// Server (Supabase) se kontroluje zvlášť přes Supabase nástroje – viz .claude/skills/audit-projektu/SKILL.md.
// Výstup: ✓/⚠/✗ po oblastech, na konci souhrn; exit 1 když je něco ✗.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process'),L=require('./lib');
const MODE=process.argv[2]||'rychly',ROOT=L.ROOT,out=[];let bad=0,warn=0;
const ok=(a,t)=>{out.push('✓ '+a+(t?' – '+t:''));console.log('✓',a,t||'');};
const wr=(a,t)=>{warn++;out.push('⚠ '+a+' – '+t);console.log('⚠',a,'–',t);};
const er=(a,t)=>{bad++;out.push('✗ '+a+' – '+t);console.log('✗',a,'–',t);};
const sh=(cmd,args,t=300)=>{try{return {ok:true,o:execFileSync(cmd,args,{cwd:L.DIR,timeout:t*1000,encoding:'utf8',stdio:['ignore','pipe','pipe']})};}catch(e){return {ok:false,o:(e.stdout||'')+(e.stderr||'')+String(e.message||'')};}};
(async()=>{
L.prep();
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const js=(html.match(/<script>([\s\S]*?)<\/script>/g)||[]).join('\n'),css=(html.match(/<style>([\s\S]*?)<\/style>/g)||[]).join('\n');
console.log('\n== STATICKÉ KONTROLY ==');
{ // 1) stejná funkce definovaná dvakrát (platí ta poslední – takhle zmizelo ztlumení hudby 09r)
 const seen={},dup=[];for(const m of js.matchAll(/^function (\w+)\(/gm)){if(seen[m[1]])dup.push(m[1]);seen[m[1]]=1;}
 dup.length?er('Duplicitní funkce',dup.join(', ')+' (platí jen poslední definice)'):ok('Duplicitní funkce','žádné');}
{ // 2) verze hry = první položka Novinek
 const v=(html.match(/const GAME_VER='([^']+)'/)||[])[1],n=(html.match(/const NEWS=\[\s*\{v:'([^']+)'/)||[])[1];
 v===n?ok('Verze a Novinky',v):er('Verze a Novinky','GAME_VER '+v+' ≠ první Novinka '+n);}
{ // 3) tajné klíče v repu (anon klíč Supabase je veřejný záměrně)
 const s=[];if(/service_role/.test(html))s.push('service_role');if(/dev_key\s*[:=]\s*['"][^'"]{8,}/.test(html))s.push('dev_key');
 for(const f of fs.readdirSync(L.DIR).filter(f=>/\.(js|py|sql)$/.test(f))){const t=fs.readFileSync(path.join(L.DIR,f),'utf8');if(/KRYPTA_DEV_KEY\s*=\s*['"][^'"]{8,}/.test(t)||/service_role['"]?\s*[:=]\s*['"]ey/.test(t))s.push(f);}
 s.length?er('Tajné klíče',s.join(', ')):ok('Tajné klíče','nic v repu');}
{ // 4) fialová v UI (přání uživatele 09z2: fialová jen pro Epické a kouzla)
 let n=0;for(const m of css.matchAll(/#([0-9a-f]{6})\b/gi)){const h=m[1],r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16),mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx-mn<20)continue;
  let hue;if(mx===r)hue=((g-b)/(mx-mn))%6;else if(mx===g)hue=(b-r)/(mx-mn)+2;else hue=(r-g)/(mx-mn)+4;hue=(hue*60+360)%360;if(hue>250&&hue<320&&(mx-mn)<90)n++;}
 n>25?wr('Fialová v UI',n+' tlumených fialových barev v CSS (cíl: jen rarity a kouzla)'):ok('Fialová v UI',n+' tlumených fialových v CSS');}
{ // 5) velikosti
 const kb=f=>Math.round(fs.statSync(path.join(ROOT,f)).size/1024);
 ok('Velikost','index.html '+kb('index.html')+' kB, lang-en.js '+kb('lang-en.js')+' kB');
 kb('CLAUDE.md')>40?wr('CLAUDE.md',kb('CLAUDE.md')+' kB – popisy verzí patří do docs/HISTORIE.md, sem jen pravidla a aktuální stav'):ok('CLAUDE.md',kb('CLAUDE.md')+' kB');}
console.log('\n== TESTY ==');
for(const [n,args,t] of [['Překlady',['i18n.js']],['Ukládání',['savekeys.js']],['Kapitoly a hrdinové',['chapcheck.js','all','/tmp/audit-cc']],['Stejná denní výzva',['dailysame.js']],['Mechaniky po restartu',['featreload.js','/tmp/audit-fr']],['Hlavní menu',['menucheck.js'],400],['Server (stub): ukládání, PIN, žebříček',['cloudstub.js']],['Horní okraj pod rozmazáním iOS',['topcheck.js']],['Pauza: záložky a rámeček',['pausetabs.js','/tmp/audit-pause']],['Oslava hrdiny a nové zbraně',['celeb.js','/tmp/audit-celeb']],['Úder ultimátky před nabídkou úrovně',['ulthold.js']]]){
 const r=sh('node',args,t||300),last=r.o.trim().split('\n').slice(-2).join(' ').slice(0,160);
 const fail=!r.ok||/chyby \[(?!\])|errors \[(?!\])|NEPROŠLO|CHYBÍ|✗/.test(r.o);fail?er(n,last):ok(n);}
console.log('\n== OBRAZOVKY (chyby JS, chybějící soubory) ==');
{const b=await require('playwright').chromium.launch();
 for(const lang of ['cs','en'])for(const sv of ['fresh','late']){const P=await L.open({browser:b,lang,save:sv});const fails=[];
  for(const [k,code] of Object.entries(L.SCREENS)){const n0=P.errs.length;try{await P.E("openMenu();"+code);await P.p.waitForTimeout(250);}catch(e){fails.push(k+': '+e.message.split('\n')[0].slice(0,100));}
   if(P.errs.length>n0)fails.push(k+': '+P.errs.slice(n0).join(' | ').slice(0,160));}
  fails.length?er('Obrazovky '+lang+'/'+sv,fails.slice(0,4).join(' ; ')):ok('Obrazovky '+lang+'/'+sv,Object.keys(L.SCREENS).length+' obrazovek bez chyb');await P.close();}
 console.log('\n== MAPY (20 s hry + boss, nesmrtelný hrdina) ==');
 const P=await L.open({browser:b,save:'late'});const ids=await P.E('MAP_IDS');const fails=[],noThumb=[];
 for(const m of ids){if(!fs.existsSync(path.join(ROOT,'thumbs',m+'.png')))noThumb.push(m);
  const n0=P.errs.length;try{await P.p.evaluate(m=>{const K=window.__krypta;K.god=true;K.startRun('mage',m);for(let i=0;i<1200;i++)K.step(1/60);const R=K.run2||K.run;R.t=R.map.dur-1;for(let i=0;i<900;i++){K.step(1/60);if(R.over)break;}K.god=false;},m);}
  catch(e){fails.push(m+': '+e.message.split('\n')[0].slice(0,120));}if(P.errs.length>n0)fails.push(m+': '+P.errs.slice(n0)[0].slice(0,140));}
 await P.E("openMenu()");
 fails.length?er('Mapy',fails.slice(0,5).join(' ; ')):ok('Mapy',ids.length+' map bez chyb');
 noThumb.length?er('Pohlednice map','chybí thumbs/'+noThumb.join(', ')):ok('Pohlednice map','všechny');
 await P.close();
 // běh do konce: nová úroveň, pauza, prohra, výsledky
 const G=await L.open({browser:b,save:'mid'});try{await G.E("startRun('knight','hrbitov')");for(const s of ["step&&0","openLevelUp()","setState('play')","togglePause(true)","togglePause(false);finish(false)"]){await G.E(s);await G.p.waitForTimeout(300);}
  await G.p.waitForTimeout(1500);}catch(e){G.errs.push(e.message.split('\n')[0]);}
 G.errs.length?er('Konec běhu',G.errs.slice(0,3).join(' | ')):ok('Konec běhu','nová úroveň, pauza, výsledky bez chyb');await G.close();
 await b.close();}
if(MODE==='plny'){console.log('\n== HRÁČI-BOTI (kapitoly I–VI) ==');const r=sh('node',['hraci.js','zed','1','expert,novacek'],1200);
 const m=r.o.match(/chyby: (\[.*\])/);(!r.ok||(m&&m[1]!=='[]'))?er('Boti',(m?m[1]:r.o.slice(-200))):ok('Boti','bez chyb – tabulka výher: tests/tools/hraci-results.json');
 const pf=sh('node',['menuperf.js'],300);const slow=(pf.o.match(/"worst":(\d+)/g)||[]).map(x=>+x.split(':')[1]).filter(x=>x>250);slow.length?wr('Plynulost menu',slow.length+' přechodů se sekem > 250 ms'):ok('Plynulost menu');}
console.log('\n== SOUHRN ==\n'+(bad?bad+' ✗ chyb, ':'')+(warn?warn+' ⚠ upozornění':'')+(!bad&&!warn?'vše v pořádku':''));
fs.writeFileSync(path.join(L.DIR,'audit-last.txt'),new Date().toISOString()+' '+MODE+'\n'+out.join('\n')+'\n');process.exit(bad?1:0);
})();
