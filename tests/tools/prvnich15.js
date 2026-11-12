// 11z4/12b: prvních 15 minut nového hráče. „Hráč“ hraje jako rozumný nováček (sbírá, uhýbá, staví věž, když je zlato, bere hlavně nové zbraně),
// mezi běhy projde vše, co vyskočí (karty mechanik „Ukaž mi to“), a pokračuje Hrát → Vyrazit. Zapisuje časovou osu: co hráč poprvé vidí,
// jaká vysvětlivka u toho byla, kde se dlouho nic neděje. node prvnich15.js [cs|en] [minut=15] -> /tmp/p15/*.png + /tmp/p15/osa.txt
const L=require('./lib'),fs=require('fs');const lang=process.argv[2]||'cs',MIN=+(process.argv[3]||15),dir='/tmp/p15';fs.mkdirSync(dir,{recursive:true});
const out=[];fs.writeFileSync('/tmp/p15/osa.txt','');const log=s=>{out.push(s);console.log(s);fs.appendFileSync('/tmp/p15/osa.txt',s+'\n');};let shotN=0;
(async()=>{const o=await L.open({phone:'13',lang,save:'fresh'});const E=o.E,p=o.p;
const shot=async n=>{await p.waitForTimeout(450);const f=`${dir}/${String(++shotN).padStart(2,'0')}-${n}.png`;await p.screenshot({path:f});return f;};
await E("save.tut=0;save.stats={runs:0};save.prolog=0;persist();openMenu();");await p.waitForTimeout(600);
let gameT=0,menuT=0;const seen=new Set();
const firstSeen=(k,txt)=>{if(seen.has(k))return false;seen.add(k);return true;};
// menu: everything that pops up
async function menuPass(where){for(let i=0;i<8;i++){const fp=await E("(()=>{const f=$('#featPop');return f&&!f.hidden?f.innerText.replace(/\\s+/g,' ').slice(0,260):''})()");
    if(!fp)break;log(`  [${where}] VYSKOČÍ: ${fp}`);await shot('pop');menuT+=8;
    const go=await E("!!$('#fcGo')");if(go){await E("$('#fcGo').click()");await p.waitForTimeout(500);const st=await E("state");log(`    → „Ukaž mi to“ otevře: ${st}`);await shot('ukaz-'+st);menuT+=15;await E("openMenu()");await p.waitForTimeout(500);}
    else{await E("($('#fcOk')||{click(){}}).click()");await p.waitForTimeout(500);}}
  const seals=await E("[...document.querySelectorAll('#scr-menu [data-k=seal], #scr-menu .seal, #scr-menu .has')].map(e=>(e.closest('button')||e).id||'?').join(',')");if(seals)log(`  [${where}] značky „nové“ na: ${seals}`);}
async function playRun(nr){const st0=await E("JSON.stringify({map:run.mapId,hero:run.heroId,tut:!!run.tut,dur:run.map.dur})");log(`\nBĚH ${nr}: ${st0}`);
  let lastEv=0,lastLu=0,tlast='',toastLast='',noteLast='',lus=[];const gaps=[];let hpMin=999;
  while(true){const r=await p.evaluate(()=>{const K=window.__krypta,E=K._ev,ev=[];
    for(let i=0;i<40;i++){const R=K.run;if(!R||R.over)break;const S=E('state');if(S!=='play')break;const P=R.p;let fx=0,fy=0,bd=1e9,g=null;
      for(const q of R.gems){const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;g=q;}}
      for(const it of R.items)if(!it.dead&&(it.k==='chest'||it.k==='heart'&&P.hp<P.max*.6)){g=it;break;}
      if(g){fx=g.x-P.x;fy=g.y-P.y;const m=Math.hypot(fx,fy)||1;fx/=m;fy/=m;}
      for(const e of R.enemies){if(e.dead)continue;const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)+.01;if(d<30){fx+=dx/d*1.7;fy+=dy/d*1.7;}}
      if(R.boss&&!R.boss.dead){const dx=R.boss.x-P.x,dy=R.boss.y-P.y,d=Math.hypot(dx,dy);if(d>70){fx+=dx/d*.7;fy+=dy/d*.7;}}
      K.force={x:fx,y:fy};
      if(Math.random()<.01){const dk=(R.deck||E('T_BASE'));const b=document.querySelector('#buildbar .bb:not(.dis)');const near=R.towers.some(t=>Math.hypot(t.x-P.x,t.y-P.y)<70);
        if(!near&&R.coins>=E('towerCost')(dk[0]))E("buildTower((run.deck||T_BASE)[0])");else if(R.nearTower&&R.nearTower.lv<3&&R.coins>=E('towerUpCost')(R.nearTower))E('upgradeTower()');}
      K.step(1/40);}
    const R=K.run;if(!R)return{st:'none'};const ids=[...new Set(R.enemies.filter(e=>!e.dead).map(e=>(e.elite?'ELITA ':'')+(e.boss?'BOSS ':'')+e.id))];
    const items=[...new Set(R.items.filter(i=>!i.dead).map(i=>i.k))];const T=document.querySelector('#tut'),tt=document.querySelector('#toast'),nn=document.querySelector('#note');
    return{st:E('state'),over:R.over,won:R.won,t:R.t,lv:R.level,hp:Math.round(R.p.hp),max:R.p.max,coins:R.coins,tw:R.towers.length,combo:R.combo,ids,items,
      tut:T&&!T.hidden?T.textContent:'',toast:tt&&tt.classList.contains('on')?tt.textContent:'',note:nn&&nn.classList.contains('on')?nn.textContent:'',
      w:Object.keys(R.W).map(k=>k+R.W[k].lv).join(' '),edge:!!document.querySelector('#upBtn:not([hidden])')};});
    const t=Math.round(r.t||0),T=`${String(Math.floor(t/60))}:${String(t%60).padStart(2,'0')}`;hpMin=Math.min(hpMin,r.hp/r.max);
    const evt=s=>{log(`  ${T} ${s}`);if(t-lastEv>30)gaps.push(`${Math.floor(lastEv/60)}:${String(lastEv%60).padStart(2,'0')}–${T}`);lastEv=t;};
    if(r.tut&&r.tut!==tlast){tlast=r.tut;evt(`TUTORIÁL: ${r.tut}`);}
    if(r.toast&&r.toast!==toastLast){toastLast=r.toast;evt(`toast: ${r.toast}`);}
    if(r.note&&r.note!==noteLast){noteLast=r.note;evt(`hláška: ${r.note}`);}
    for(const id of r.ids||[])if(firstSeen('e:'+id))evt(`poprvé nepřítel: ${id}`);
    for(const k of r.items||[])if(firstSeen('i:'+k))evt(`poprvé předmět na zemi: ${k}`);
    if(r.edge&&firstSeen('upBtn'))evt('poprvé tlačítko vylepšení věže');
    if(r.st==='levelup'){lus.push(t);const cards=await E("[...document.querySelectorAll('#luList .k-card')].map(b=>b.querySelector('.nm').textContent+' ['+(b.querySelector('.st')||{}).textContent+']').join(' | ')");
      const tl=await E("$('#luTime').hidden?'':'S ODPOČTEM'");evt(`nová úroveň ${r.lv} ${tl}: ${cards}`);if(lus.length<=2||/Fúze|Fusion/.test(cards)&&firstSeen('fusecard'))await shot('lu');
      // nováček: fúze > nová zbraň (do 4 zbraní) > zbraň, kterou má > bonus
      await E(`(()=>{const B=[...document.querySelectorAll('#luList .k-card')];const sc=b=>b.classList.contains('fuse')?9:/Nová zbraň|New weapon/.test(b.textContent)&&Object.keys(run.W).length<4?5:/zbraň|weapon/i.test(b.textContent)?3:1;B.sort((a,b)=>sc(b)-sc(a));B[0].click();})()`);
      await p.waitForTimeout(80);continue;}
    if(r.st==='fuse'){const intro=await E("!!(FZ&&FZ.intro)");evt('FÚZE (minihra)'+(intro?' – úvod s vysvětlením: '+await E("$('#fzIntro').innerText.replace(/\\s+/g,' ').slice(0,200)"):''));await shot('fuze');
      if(intro)await E("fuseIntroGo()");for(let k=0;k<12&&await E("state")==='fuse';k++){await p.evaluate(()=>{const K=window.__krypta,E=K._ev;for(let i=0;i<40;i++){K.step(1/40);E('fuseTick()');E('fuseTap()');}});await p.waitForTimeout(250);}
      evt('fúze hotová: '+await E("$('#fzTitle').textContent+' '+$('#fzSub').textContent"));await p.waitForTimeout(1500);continue;}
    if(r.over||r.st==='over'||r.st!=='play'&&r.st!=='levelup'){if(r.st!=='over'&&!r.over){evt('stav '+r.st);await shot('stav-'+r.st);await E("setState&&0");}
      log(`  KONEC ${T}: ${r.won?'VÝHRA':'prohra'}, úroveň ${r.lv}, zbraně ${r.w}, věží ${r.tw}, nejnižší zdraví ${Math.round(hpMin*100)} %`);
      log(`  nové úrovně v časech: ${lus.map(x=>Math.floor(x/60)+':'+String(x%60).padStart(2,'0')).join(', ')}`);
      if(gaps.length)log(`  TICHO (>30 s bez ničeho nového): ${gaps.join(', ')}`);gameT+=r.t;break;}}
  await p.waitForTimeout(1600);await shot('konec');
  const ov=await E("$('#ovPop')?$('#scr-over').innerText.replace(/\\s+/g,' ').slice(0,400):''");log(`  obrazovka po běhu: ${ov}`);menuT+=15;
  await E("$('#ovMenu').click()");await p.waitForTimeout(700);}
// 1st run: Play straight from the menu
await menuPass('menu před 1. během');await shot('menu');
let nr=0;while(gameT+menuT<MIN*60){nr++;
  if(nr>1){await E("$('#mPlay').click()");await p.waitForTimeout(600);await menuPass('Příprava');
    const sel=await E("$('#scr-select')?$('#scr-select').innerText.replace(/\\s+/g,' ').slice(0,300):''");log(`\nPříprava: ${sel}`);if(nr===2)await shot('priprava');
    await E("$('#goBtn').click()");await p.waitForTimeout(500);menuT+=10;}
  else{await E("$('#mPlay').click()");await p.waitForTimeout(500);}
  if(await E("state")!=='play'){log('Hra nezačala, stav '+await E("state"));await shot('nezacala');break;}
  await playRun(nr);await menuPass('menu po běhu '+nr);if(nr<=3)await shot('menu-po-'+nr);}
log(`\nCELKEM: hra ${Math.round(gameT/60)} min, menu ~${Math.round(menuT/60)} min. Chyby JS: ${o.errs.join(' | ')||'žádné'}`);
fs.writeFileSync(dir+'/osa.txt',out.join('\n'));await o.close();})();
