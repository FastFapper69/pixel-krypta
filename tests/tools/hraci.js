// Hráči-boti s povahami (08z). Každý hraje jinak: reakční doba, kolik varování přehlédne, jak drží odstup,
// jak moc honí krystaly, kdy zpanikaří, jak vybírá karty, kolik staví věží a jak trefí rytmus rituálu.
// Účty odpovídají postupu skutečného hráče na vstupu do kapitoly (UCTY) a po grindu Nočních můr (+grind).
//
// node hraci.js zed [běhů=2] [povahy=all]        -> kapitoly I–V: první mapa a finále, účet při vstupu a po grindu, verdikt „zeď“
// node hraci.js kapitola:c5 [běhů=3] [povahy]    -> jedna kapitola (všech 5 map), vstup i grind
// node hraci.js mapa:paluba[:vstup|grind] [běhů=4] [povahy] [hrdinové]
// UCET=2 node hraci.js mapa:zima:vstup …  -> všechny mapy se stejným účtem (index kapitoly), na srovnání obtížnosti map
// Povahy: novacek, opatrny, agresor, sberatel, stavitel, fuzak, expert (čárkou). Výstup: tabulka + hraci-results.json.
// Simulace, ne skutečný hráč: neřekne, jestli je to zábavné nebo čitelné. Ukáže balanc, zdi a mechaniky, které jdou obejít.
const {chromium}=require('playwright'),fs=require('fs');
const [SC='zed',NARG,PARG,HARG]=process.argv.slice(2);
const POVAHY={
 novacek:{name:'Nováček',hero:'knight',react:.45,aware:.45,keep:1,approach:.3,greed:.8,gemR:70,panic:.25,cards:'chaos',ritual:['g','m','g','m','m'],towers:1,jitter:.35},
 opatrny:{name:'Opatrný',hero:'archer',react:.25,aware:.85,keep:1.6,approach:.1,greed:.5,gemR:50,panic:.5,cards:'safe',ritual:['g','p','g','g','m'],towers:2,jitter:.1},
 agresor:{name:'Agresor',hero:'mage',react:.2,aware:.6,keep:.55,approach:1,greed:.4,gemR:60,panic:.15,cards:'dmg',ritual:['p','g','p','g','m'],towers:1,jitter:.12},
 sberatel:{name:'Sběratel',hero:'bard',react:.25,aware:.7,keep:.9,approach:.3,greed:2,gemR:140,panic:.3,cards:'greed',ritual:['g','p','g','m','g'],towers:2,jitter:.12},
 stavitel:{name:'Stavitel',hero:'builder',react:.25,aware:.75,keep:1.1,approach:.2,greed:.8,gemR:80,panic:.35,cards:'std',ritual:['g','p','g','m','g'],towers:6,upgrade:1,jitter:.12},
 fuzak:{name:'Fúzní lovec',hero:'mage',react:.22,aware:.75,keep:1,approach:.4,greed:.8,gemR:80,panic:.3,cards:'fuse',ritual:['p','p','g','p','g'],towers:2,jitter:.1},
 expert:{name:'Expert',hero:'bard',react:.12,aware:.97,keep:1,approach:.5,greed:1,gemR:100,panic:.35,cards:'expert',ritual:['p','p','p','p','g'],towers:3,upgrade:1,jitter:.05}};
// účet na vstupu do kapitoly (index = kapitola, 0 = I). Kalibrace 8. 11. podle nejdál postoupeného hráče: v kapitole III hrdina 16–18,
// Vylepšení ~15/30, výbava ve 4 slotech rarity 1–3 na +0 až +3, 2 kusy setu. Další kapitoly jsou odhad (+3 úrovně hrdiny, +3 Vylepšení, +1 slot a +1 vylepšení výbavy).
// Až budou hráči dál, přepočítej z tabulky profiles (save.hlv, save.meta, save.eq/inv).
const UCTY=[
 {hlv:1,meta:0,rev:0,tiers:0,tlv:0,gear:null,slots:0,sets:null,pet:['wolf',0],tw:[['arrow',0],['fire',0],['frost',0],['tesla',0]]},
 {hlv:8,meta:7,rev:1,tiers:0,tlv:0,gear:[1,1],slots:3,sets:['bone',1],pet:['wolf',3],tw:[['arrow',0],['fire',0],['frost',0],['tesla',0],['crypt',0]]},
 {hlv:16,meta:14,rev:1,tiers:1,tlv:2,gear:[2,2],slots:4,sets:['bone',2],pet:['owl',3],tw:[['arrow',1],['fire',1],['frost',1],['tesla',1],['obelisk',0]]},
 {hlv:19,meta:17,rev:2,tiers:2,tlv:3,gear:[2,3],slots:5,sets:['forge',2],pet:['fox',4],tw:[['arrow',1],['fire',1],['frost',1],['tesla',1],['forge',1]]},
 {hlv:22,meta:20,rev:2,tiers:3,tlv:3,gear:[2,4],slots:6,sets:['frost',2],pet:['salamander',3],tw:[['arrow',1],['fire',2],['frost',1],['tesla',2],['hearth',1]]},
 {hlv:25,meta:22,rev:2,tiers:4,tlv:4,gear:[3,4],slots:6,sets:['tide',2],pet:['drake',4],tw:[['arrow',2],['fire',2],['frost',2],['tesla',2],['icelance',1]]},
 {hlv:29,meta:25,rev:3,tiers:5,tlv:5,gear:[3,5],slots:6,sets:['tide',4],pet:['drake',5],tw:[['arrow',2],['fire',2],['frost',2],['tesla',2],['cannon',1]]}];
// finále hraje hráč, který prošel 4 mapy kapitoly (o kousek silnější než na vstupu)
const fin=A=>Object.assign({},A,{hlv:A.hlv+2,meta:Math.min(30,A.meta+2)});
const grind=A=>Object.assign({},A,{hlv:Math.min(40,A.hlv+4),meta:Math.min(30,A.meta+3),gear:A.gear?[Math.min(3,A.gear[0]+1),A.gear[1]+2]:[1,2],slots:Math.min(6,(A.slots||0)+1)||3,sets:A.sets?[A.sets[0],Math.min(4,A.sets[1]+2)]:null,tlv:A.tlv+2});
(async()=>{
const b=await chromium.launch();const errs=[];
const pages=[];for(let i=0;i<2;i++){const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/'+(process.env.F||'off.html'));await p.waitForTimeout(500);
  await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;});pages.push(p);}
const chs=await pages[0].evaluate(()=>window.__krypta._ev('JSON.stringify(CHAPTERS.map(c=>({id:c.id,i:c.i,name:c.name,maps:c.maps})))')).then(JSON.parse);
const pov=(PARG&&PARG!=='all'?PARG.split(','):Object.keys(POVAHY));
// jobs
const jobs=[];const N=+(NARG||(SC==='zed'?2:SC.startsWith('kapitola')?3:4));
const add=(map,ci,acc,o)=>{for(const k of pov)for(let i=0;i<N;i++){const heroes=HARG?HARG.split(','):[POVAHY[k].hero];const hero=heroes[i%heroes.length];
  jobs.push({map,ci,acc,pov:k,hero,seed:1000+i*7919+map.length*131+k.length*17+(acc==='grind'?55:0),...(o||{})});}};
if(SC==='zed'){for(const C of chs)for(const m of [C.maps[0],C.maps[4]])for(const acc of ['vstup','grind'])add(m,C.i,acc);}
else if(SC.startsWith('kapitola:')){const C=chs.find(c=>c.id===SC.split(':')[1]);for(const m of C.maps)for(const acc of ['vstup','grind'])add(m,C.i,acc);}
else if(SC.startsWith('mapa:')){const [,m,acc]=SC.split(':');const C=chs.find(c=>c.maps.includes(m));for(const a of acc?[acc]:['vstup','grind'])add(m,C.i,a);}
else{console.log('Neznámý scénář. Viz hlavička souboru.');process.exit(1);}
console.log(jobs.length+' běhů, '+pov.map(k=>POVAHY[k].name).join(', '));
const t0=Date.now(),rows=[];let done=0;
async function runOne(p,J){const P=POVAHY[J.pov],isFin=chs[J.ci].maps[4]===J.map,U=process.env.UCET!=null?UCTY[+process.env.UCET]:UCTY[J.ci],A0=isFin&&process.env.UCET==null?fin(U):U,A=J.acc==='grind'?grind(A0):A0; // UCET=n: stejný účet pro všechny mapy (srovnání map)
  await p.evaluate(([J,A,P])=>{const K=window.__krypta,E=K._ev,S=K.save;K.god=false;S.sound=false;S.music=false;S.cheat=false;K.lastRun=null;
    let s=J.seed;Math.random=()=>((s=(s*16807)%2147483647)/2147483647);
    E('econInit()');const h=J.hero;S.heroes[h]=true;S.hlv={};S.hlv[h]=A.hlv;S.htal={};if(A.hlv>=25){S.htal[h]={25:0,30:0,35:1,40:0};}
    S.meta={treeV:2};S.metaV=2;for(const id of ['hp','dmg','spd','mag','xp','build'])S.meta[id]=A.meta;S.meta.revive=A.rev;
    const br=['a','d','l'];for(let t=0;t<A.tiers;t++)for(const x of br)S.meta[x+(t+1)]=A.tlv;
    S.inv=[];S.eq={};S.eq[h]={};const setS=A.sets?E("setSlots('"+A.sets[0]+"')").slice(0,A.sets[1]):[];
    const order=[...setS,...E('SLOT_IDS').filter(x=>!setS.includes(x))].slice(0,Math.max(A.slots||0,setS.length));
    if(A.gear)for(const sl of order){const it=setS.includes(sl)?E("makeSetItem('"+A.sets[0]+"','"+sl+"',"+A.gear[0]+",.6)"):K.makeItem(A.gear[0],sl,.6);it.lv=A.gear[1];E('addItem')(it);S.eq[h][sl]=it.u;}
    const pc=E('petRoll')(A.pet[0],.6);pc.lv=A.pet[1];S.pets={v:1,cards:[pc],sel:pc.u};
    S.tw={v:2,cards:[],deck:[]};for(const [k,r] of A.tw){const c=E('twRoll')(k,r,.6);c.lv=Math.min(10,A.gear?A.gear[1]:0);S.tw.cards.push(c);S.tw.deck.push(c.u);}
    K.startRun(h,J.map,{});const R=K.run;R.tut=null;
    window.__hb={P,last:-9,f:{x:0,y:0},seen:new WeakMap(),names:null,trapS:E('TRAP_S'),fus:E('JSON.stringify(FUSIONS)')};},[J,A,P]);
  for(let guard=0;guard<600;guard++){
    const st=await p.evaluate(()=>{const K=window.__krypta,E=K._ev,DT=1/40,H=window.__hb,P=H.P;
      const seen=o=>{let v=H.seen.get(o);if(v===undefined){v=Math.random()<P.aware;H.seen.set(o,v);}return v;};
      for(let n=0;n<40*20;n++){const R=K.run;if(!R||R.over)return 'over';
        if(K.state==='levelup'){pickCard(K,R,P,H);continue;}
        if(K.state==='fuse'&&K.FZ&&!K.FZ.done){const seq=P.ritual.slice();for(let i=seq.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[seq[i],seq[j]]=[seq[j],seq[i]];}K.FZ.res=seq.slice(0,4);K.finishFuse();K.afterOption();continue;}
        if(K.state!=='play')return K.state;
        if(R.t-H.last>=P.react*(.7+Math.random()*.6)){H.last=R.t;H.f=decide(K,E,R,P,H,seen);}
        K.force=H.f;
        if(R.t>R.map.dur+400){K.finish(false);return 'over';}
        if(n%40===0)towers(K,R,P);
        K.step(DT);}
      return 'run';
      function decide(K,E,R,P,H,seen){const p=R.p,map=R.map,low=p.hp<p.max*P.panic,keepM=P.keep*(low?1.6:1),appr=low?0:P.approach;let fx=0,fy=0;
        const away=(x,y,r,w)=>{const dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy)+.01;if(d<r){const k=(r-d)/r*w;fx+=dx/d*k;fy+=dy/d*k;}};
        let near=null,nd=1e9;
        for(const e of R.enemies){if(e.dead||e.bur)continue;const d=Math.hypot(p.x-e.x,p.y-e.y);if(d<nd){nd=d;near=e;}away(e.x,e.y,((e.boss?52:e.elite?34:20)+e.r)*keepM,e.boss?4:e.elite?2.5:1.6);}
        if(near&&nd>40*keepM){fx-=(p.x-near.x)/nd*appr;fy-=(p.y-near.y)/nd*appr;}
        for(const s of R.eshots)away(s.x,s.y,30,2.5*Math.min(1,P.aware+.2));
        // known map dangers (the more aware, the more of them are noticed)
        for(const pl of R.built.pools||[])if(seen(pl))away(pl.x,pl.y,pl.r+14,3);
        for(const c of R.carts||[])if(seen(c))away(c.x,c.y,45,4);
        if(R.built.vc&&seen(R.built.vc))away(R.built.vc.x,R.built.vc.y,170,3);
        for(const q of R.tent||[]){if(q.hit||p.x<q.xa||p.x>q.xb||!seen(q))continue;const dy=p.y-q.y;if(Math.abs(dy)<q.w+10)fy+=(dy>=0?1:-1)*3;}
        for(const q of R.holes||[])if(seen(q))away(q.x,q.y,q.r+12,3);
        for(const q of R.kst||[])if(!q.hit&&seen(q))away(q.x,q.y,q.r+10,4);
        for(const q of R.erupt||[])if(q.t>0&&seen(q))away(q.x,q.y,(q.r||30)+10,4);
        for(const q of R.aval||[]){if(q.hit||!seen(q))continue;const dy=p.y-q.y;if(Math.abs(dy)<q.h+10)fy+=(dy>=0?1:-1)*3.5;}
        if(R.kp&&seen(R.kp))away(R.kp.x,R.kp.y,90,3);
        // chapter VI: telescope beams, the void between islands (unless the bridges shine), lines between wolves
        if(R.kb&&R.t>12&&Math.random()<P.aware+.3){const C=map.size/2,o=(map.kit.mech.find(m=>m.id==='beam')||{}),n=o.n||2;for(let k=0;k<n;k++){const an=R.kb.a+k*6.283/n,cs=Math.cos(an),sn=Math.sin(an),dx=p.x-C,dy=p.y-C,pr=dx*cs+dy*sn,pp=-dx*sn+dy*cs;
          if(pr>10&&pr<(o.len||520)&&Math.abs(pp)<30){const s2=pp>=0?1:-1;fx+=-sn*s2*4;fy+=cs*s2*4;}}}
        if(R.built.zone&&R.kg&&!R.kg.on&&Math.random()<P.aware+.4){const Z=R.built.zone,sz=map.size,at=(x,y)=>Z[Math.max(0,Math.min(sz-1,y|0))*sz+Math.max(0,Math.min(sz-1,x|0))];
          for(let k=0;k<8;k++){const a=k/8*6.283,x=p.x+Math.cos(a)*22,y=p.y+Math.sin(a)*22;if(at(x,y))away(x,y,26,3);}}
        for(const [a,b] of R.kl||[]){const vx=b.x-a.x,vy=b.y-a.y,L2=vx*vx+vy*vy||1,t=Math.max(0,Math.min(1,((p.x-a.x)*vx+(p.y-a.y)*vy)/L2));away(a.x+vx*t,a.y+vy*t,18,3);}
        for(const f of R.fx)if((f.k==='magma'||f.k==='venom')&&seen(f))away(f.x,f.y,(f.r||14)+10,3);
        if(R.built.traps&&(E('M.step')%16)>=11)for(const t of R.built.traps)if(seen(t))away(t.x,t.y,H.trapS*1.6+8,3);
        let goal=null;
        if(R.fcy&&seen(R.fcy)){let bd=1e9;for(const i of R.fcy.act){const q=R.built.runes[i],d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;goal=q;}}}
        if(!goal&&(p.cold||0)>.55&&R.built.fires&&R.built.fires.length){let bd=1e9;for(const f of R.built.fires){const d=Math.hypot(f.x-p.x,f.y-p.y);if(d<bd){bd=d;goal=f;}}}
        if(!goal&&p.hp<p.max*Math.max(.4,P.panic)&&R.built.oases&&R.built.oases.length&&!(R.crystal&&R.crystal.hp<R.crystal.max*.6)){let bd=1e9;for(const o of R.built.oases){const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<bd){bd=d;goal=o;}}}
        if(!goal&&R.crystal&&Math.hypot(R.crystal.x-p.x,R.crystal.y-p.y)>(R.crystal.hp<R.crystal.max*.6?20:60))goal=R.crystal;
        if(!goal&&R.crystal){let bd=1e9;for(const e of R.enemies){if(e.dead)continue;const d=Math.hypot(e.x-R.crystal.x,e.y-R.crystal.y);if(d<bd){bd=d;goal=bd<40?e:null;}}}
        const gr=P.gemR*(low?.4:1);
        if(!goal){let bd=gr+20;for(const g of R.items){const d=Math.hypot(g.x-p.x,g.y-p.y);if(d<bd){bd=d;goal=g;}}}
        if(!goal){let bd=gr;for(const g of R.gems){const d=Math.hypot(g.x-p.x,g.y-p.y);if(d<bd){bd=d;goal=g;}}}
        if(goal){const dx=goal.x-p.x,dy=goal.y-p.y,d=Math.hypot(dx,dy)+1,w=goal===R.crystal||R.fcy?1.2:.9*(goal.v!==undefined||goal.k?Math.min(1.6,P.greed*(low?.4:1)):1);fx+=dx/d*w;fy+=dy/d*w;}
        const cx=map.size/2-p.x,cy=map.size/2-p.y,cd=Math.hypot(cx,cy);if(cd>map.size*.38){fx+=cx/cd*1.5;fy+=cy/cd*1.5;}
        if(P.jitter){const a=Math.random()*6.283;fx+=Math.cos(a)*P.jitter;fy+=Math.sin(a)*P.jitter;}
        const L=Math.hypot(fx,fy);return L>.12?{x:fx/L,y:fy/L}:{x:0,y:0};}
      function pickCard(K,R,P,H){const cards=[...document.querySelectorAll('#luList button')];if(!cards.length){K.step(DT);return;}
        if(!H.names){H.names={};const W=E('WEAPONS'),PS=E('PASSIVES');for(const id in W)H.names[W[id].name]=['w',id];for(const id in PS)H.names[PS[id].name]=['p',id];}
        const fus=JSON.parse(H.fus),own=R.W,hp=R.p.hp/R.p.max;let best=null,bs=-1e9;
        for(const el of cards){const h3=el.querySelector('h3'),nm=h3.firstChild?h3.firstChild.textContent.trim():h3.textContent,f=el.classList.contains('fuse'),info=H.names[nm]||['?',''],[k,id]=info,have=k==='w'&&own[id];
          const partner=k==='w'&&fus.some(x=>(x.a===id&&own[x.b])||(x.b===id&&own[x.a]));let sc;
          switch(P.cards){
           case'chaos':sc=f?40:Math.random()*20;break;
           case'safe':sc=f?60:k==='p'&&['heart','shield','regen'].includes(id)?14:have?10:k==='w'?6:4;break;
           case'dmg':sc=f?90:k==='p'&&['power','haste','eye'].includes(id)?14:have?13:k==='w'?10:3;break;
           case'greed':sc=f?80:k==='p'&&['magnet','greed'].includes(id)?15:have?11:k==='w'?7:4;break;
           case'fuse':sc=f?100:partner?20:have?12:k==='w'?8:4;break;
           case'expert':sc=f?100:partner?16:have&&own[id].lv>=4?14:k==='p'&&['power','haste'].includes(id)?11:have?10:k==='w'?9:k==='p'&&id==='heart'&&hp<.5?12:5;break;
           default:sc=f?100:have?12:k==='w'?8:4;}
          sc+=Math.random()*(P.cards==='chaos'?0:5);if(sc>bs){bs=sc;best=el;}}
        best.click();}
      function towers(K,R,P){const lim=Math.min(P.towers,R.hero&&R.hero.builder?6:P.towers);
        if(R.coins>=(R.crystal?90:60)&&R.towers.length<lim&&!(R.crystal&&R.crystal.hp<R.crystal.max*.7)&&R.deck&&R.deck.length)K.buildTower(R.deck[R.towers.length%R.deck.length]);
        if(P.upgrade&&R.nearTower&&R.nearTower.lv<3&&R.coins>=120)K.upgradeTower();
        if(R.crystal&&R.nearCrystal&&R.crystal.hp<R.crystal.max*.75&&Math.random()<(P.aware))K.repairCrystal();}
    });
    if(st==='over')break;if(st!=='run'&&st!=='play'&&st!=='levelup'&&st!=='fuse')await p.waitForTimeout(40);}
  const r=await p.evaluate(()=>{const K=window.__krypta,R=K.run;if(!R.over)K.finish(false);return Object.assign({},K.lastRun||K.tmRow('death'),{gain:R.gain,cap:R.t>R.map.dur+390});});
  return Object.assign(r,{pov:J.pov,acc:J.acc,ci:J.ci});}
let ji=0;await Promise.all(pages.map(async p=>{while(ji<jobs.length){const J=jobs[ji++];try{rows.push(await runOne(p,J));}catch(e){errs.push(String(e).slice(0,200));}
  if(++done%10===0)process.stdout.write(done+' ');}}));
console.log('\n'+rows.length+' běhů za '+Math.round((Date.now()-t0)/1000)+' s');
fs.writeFileSync('hraci-results.json',JSON.stringify(rows));
// ----- report -----
const pad=(s,n)=>String(s).padEnd(n),pct=(a)=>a.length?Math.round(a.filter(r=>r.won).length/a.length*100):null,med=a=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[a.length>>1]:0;},fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const P=pov;
const maps=[...new Set(rows.map(r=>r.map))];
for(const acc of ['vstup','grind']){const R0=rows.filter(r=>r.acc===acc);if(!R0.length)continue;
  console.log('\n'+(acc==='vstup'?'ÚČET PŘI VSTUPU DO KAPITOLY':'ÚČET PO GRINDU NOČNÍCH MŮR')+' – výhry %');
  console.log(pad('mapa',12)+P.map(k=>pad(POVAHY[k].name.slice(0,9),10)).join('')+'průměr');
  for(const m of maps){const R=R0.filter(r=>r.map===m);if(!R.length)continue;const v=P.map(k=>pct(R.filter(r=>r.pov===k)));
    console.log(pad(m,12)+v.map(x=>pad(x==null?'-':x+' %',10)).join('')+pct(R)+' %');}}
// verdict: each chapter should be a wall at entry and get beatable after grinding
console.log('\nVERDIKT (střední povahy = bez nováčka a experta):');
const mid=r=>r.pov!=='novacek'&&r.pov!=='expert';
for(const m of maps){const v=pct(rows.filter(r=>r.map===m&&r.acc==='vstup'&&mid(r))),g=pct(rows.filter(r=>r.map===m&&r.acc==='grind'&&mid(r))),fin=rows.find(r=>r.map===m&&r.ci!=null)&&chs.some(c=>c.maps[4]===m);
  let t=v==null?'':v>(fin?45:65)?'moc lehké při vstupu':v<(fin?0:5)&&(g==null||g<15)?'moc tvrdé i po grindu':g!=null&&g<v+10?'grind skoro nepomáhá':'zeď funguje';
  console.log('  '+pad(m,12)+pad('vstup '+(v==null?'-':v+' %'),14)+pad('grind '+(g==null?'-':g+' %'),14)+t);}
// odd strategies: one personality far ahead of the others
const odd=[];for(const m of maps){const all=pct(rows.filter(r=>r.map===m));for(const k of P){const RK=rows.filter(r=>r.map===m&&r.pov===k),x=pct(RK);if(x!=null&&RK.length>=3&&k!=='expert'&&x-all>=40)odd.push(m+': '+POVAHY[k].name+' '+x+' % proti průměru '+all+' %');}}
if(odd.length)console.log('\nPODEZŘELE SNADNÁ STRATEGIE:\n  '+odd.join('\n  '));
// how they die
console.log('\nCO ZABÍJÍ (prohry, top 3 na mapu):');
for(const m of maps){const L=rows.filter(r=>r.map===m&&!r.won),cs={};L.forEach(r=>cs[r.cause]=(cs[r.cause]||0)+1);const cap=L.filter(r=>r.cap).length;console.log('  '+pad(m,12)+Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>k+' ×'+v).join(', ')+(cap?', NEDOHRÁNO (kitování bez konce) ×'+cap:'')+'  | medián přežití '+fmt(med(L.map(r=>r.t))));}
console.log('\nchyby:',errs.slice(0,5));await b.close();})();
