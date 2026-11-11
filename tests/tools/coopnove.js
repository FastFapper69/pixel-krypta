// 11j co-op: karty pouta, Souhra, společné shrnutí a Duetní fúze (s botem, bez sítě) + snímky karet, rituálu a konce.
// node coopnove.js [složka] [cs|en] [telefon]
const L=require('./lib');const dir=process.argv[2]||'/tmp',lang=process.argv[3]||'cs',phone=process.argv[4]||'se';let bad=0;
const ok=(c,m)=>{console.log((c?'OK   ':'CHYBA ')+m);if(!c)bad++;};
(async()=>{const o=await L.open({phone,lang,save:'late'}),E=o.E,P=o.p;
 await E("save.sound=false;save.music=false;LO.hero='knight';LO.botHero='mage';LO.map='hrbitov';LO.nm=0;coBotOpen();coHostGo(true)");await P.waitForTimeout(300);
 const st=()=>P.evaluate(()=>{const K=window.__krypta;for(let i=0;i<30;i++){if(K.state==='play')K.step(1/60);}return K.state;});
 // 1) bond cards are offered in co-op
 const offered=await E("(()=>{run.level=5;let n=0;for(let i=0;i<60;i++){const o=levelOptions();if(o.some(x=>x.k==='bond'))n++;}return n;})()");ok(offered>3,'karty pouta se nabízejí ('+offered+'/60 nabídek)');
 // 2) all four bonds work
 const b=await E(`(()=>{run.bond={zap:1,frost:1,life:1,pull:1};const P=players();P[1].x=P[0].x+90;P[1].y=P[0].y;P[0].hp=P[0].max*.5;const hp0=P[0].hp;
   const e=makeEnemy('skeleton',P[0].x+45,P[0].y,false);e.hp=e.max=9999;run.enemies.push(e);const f=makeEnemy('skeleton',P[0].x+45,P[0].y+60,false);f.hp=f.max=9999;run.enemies.push(f);
   run.gems.push({x:P[0].x+60,y:P[0].y+2,v:1});const g=run.gems[run.gems.length-1];
   coopBeat(0);return {slow:e.slowT>0,zap:run.fx.some(x=>x.k==='ray'),heal:P[0].hp>hp0,pull:!!g.pull,dmgF:f.hp<9999};})()`);
 ok(b.slow,'mráz zpomalí');ok(b.zap,'výboj přeskočí blesk');ok(b.heal,'život léčí');ok(b.pull,'tah přitáhne krystal');
 await E("(()=>{const L=document.querySelector('#luList');L.innerHTML='';['zap','life'].forEach((id,i)=>L.appendChild(luCard(optInfo({k:'bond',id}),i,false)));setState('levelup');luPaint();})()");await P.waitForTimeout(300);
 await P.screenshot({path:dir+'/coop_pouto_'+lang+'.png'});await E("setState('play')");
 // 3) Souhra: both kill on the same beat
 const sh=await E(`(()=>{run.cst=null;for(let i=0;i<10;i++){M.step+=4;coKill(0,{});coKill(1,{});}const C=coSt();return {sh:C.sh,chest:run.items.some(i=>i.k==='chest')};})()`);
 ok(sh.sh===10,'Souhra ×10 (je '+sh.sh+')');ok(sh.chest,'za 10 souher padla truhla');
 const sh2=await E(`(()=>{const a=coSt().sh;coKill(0,{});M.step+=4;coKill(1,{});return coSt().sh-a;})()`);ok(sh2===0,'zabití na různé doby Souhru nedá');
 // 4) duet: host has bolt 5, bot has fire 5 (recipe split)
 const f=await E(`(()=>{const F=FUSIONS.find(f=>!WEAPONS[f.id].secret);run.W={};run.W[F.a]={lv:5,cd:0};run.pls[1].W={};run.pls[1].W[F.b]={lv:5,cd:0};return {f:F.id,a:F.a,b:F.b,dz:duetFusable().length};})()`);
 ok(f.dz===1,'duet se najde ('+f.a+' + '+f.b+')');
 await E("run.duetMiss=2;run.xp=run.need+1;run.pending=1;openLevelUp()");await P.waitForTimeout(400);
 const cards=await E("[...document.querySelectorAll('#luList .k-card')].map(b=>b.querySelector('.nm').textContent)");
 ok(cards[0]===await E(`WEAPONS['${f.f}'].name`),'první karta je duet: '+cards[0]);await P.screenshot({path:dir+'/coop_duet_karta_'+lang+'.png'});
 await E("document.querySelector('#luList .k-card').click()");await P.waitForTimeout(300);await P.screenshot({path:dir+'/coop_duet_ritual_'+lang+'.png'});
 const pips=await E("[...document.querySelectorAll('#fzPips i')].map(i=>i.className)");ok(pips[1].includes('mate')&&pips[3].includes('mate'),'v rituálu jsou doby kamaráda odlišené: '+pips.join(','));
 await E("FZ.res=['p','x','p','x'];finishFuse()");await P.waitForTimeout(1400);
 const res=await E(`({h:Object.keys(run.W),g:Object.keys(run.pls[1].W),s:state})`);ok(res.h.includes(f.f)&&res.g.includes(f.f),'ultimátku mají oba ('+res.h+' | '+res.g+')');ok(!res.h.includes(f.a)&&!res.g.includes(f.b),'rodičovské zbraně zmizely');
 // 5) summary at the end
 await E("run.cst.k=[142,97];run.cst.d=[23456,18000];run.cst.r=[2,1];finish(true)");await P.waitForTimeout(2600);await E("showOver&&showOver()");await P.waitForTimeout(300);
 const rows=await E("[...document.querySelectorAll('#ovTable tr')].map(r=>r.textContent)");ok(rows.some(r=>r.startsWith(lang==='en'?' You':' Ty')),'shrnutí má řádek hráče');ok(rows.some(r=>/Souhra|Teamwork|Sync/i.test(r)),'shrnutí má Souhru');
 await P.screenshot({path:dir+'/coop_konec_'+lang+'.png',fullPage:false});
 const ov=await E("(()=>{const t=document.querySelector('#ovTable');return t.scrollWidth-t.clientWidth;})()");ok(ov<=1,'tabulka nepřetéká ('+ov+')');
 // bond card look
 await E("finish&&0;");ok(!o.errs.length,'chyby JS: '+JSON.stringify(o.errs.slice(0,3)));await o.close();process.exit(bad?1:0);})();
