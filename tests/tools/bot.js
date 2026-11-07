// Bot, který hraje celé běhy a vypíše statistiky (míra výher, čas, co zabíjí, které zbraně vyhrávají).
// Spuštění (vedle leží off.html, viz README):  node bot.js [počet_běhů=6] [hrdinové=all] [mapy=all] [nm=0] [novy|zkuseny|max]
//   např.  node bot.js 10 knight,bard hrbitov
// Bot je „průměrně rozumný hráč“: utíká před hordou a střelami, sbírá krystaly, brání krystal v poušti,
// léčí se v oáze, vyhýbá se lávě, staví věže, ve výběru preferuje fúze a vylepšení vlastních zbraní.
// Rituál fúze odehraje jako průměrný hráč (Dobré, Perfektní, Dobré, Vedle). Výsledky jsou orientační.
const {chromium}=require('playwright');
const N=+(process.argv[2]||6),HERO=process.argv[3]||'all',MAPA=process.argv[4]||'all',NM=+(process.argv[5]||0);
// profil účtu: 'novy' = čerstvý účet (výchozí), 'zkuseny' = hrdina úr. 10 + obchod napůl (bez výbavy), 'max' = hrdina 20 + obchod naplno
const PROF=process.argv[6]||'novy';
(async()=>{
const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
const ids=await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;
  return {heroes:Object.keys(K.save.heroes&&Object.keys(K.save.heroes).length?{knight:1,archer:1,mage:1,builder:1,bard:1}:{}),maps:['hrbitov','poust','doly']};});
const heroes=HERO==='all'?['knight','archer','mage','builder','bard']:HERO.split(',');
const maps=MAPA==='all'?ids.maps:MAPA.split(',');
const rows=[];const t0=Date.now();
for(const map of maps)for(const hero of heroes)for(let i=0;i<N;i++){
  await p.evaluate(([hero,map,nm,seed,prof])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=false;
    const S=K.save,f=prof==='max'?1:prof==='zkuseny'?.5:0;S.meta=S.meta||{};S.hlv=S.hlv||{};
    for(const [id,mx] of [['hp',5],['dmg',5],['spd',5],['mag',5],['xp',5],['revive',1],['build',4]])S.meta[id]=Math.floor(mx*f+(mx===1&&f>=1?0:0));
    S.hlv[hero]=prof==='max'?20:prof==='zkuseny'?10:1;S.eq={};S.cheat=false;K.lastRun=null;
    let s=seed;Math.random=()=>((s=(s*16807)%2147483647)/2147483647);
    K.startRun(hero,map,{nm});window.__bot={seed};window.__dbg=[];},[hero,map,NM,1000+i*7919+hero.length*31+map.length*131,PROF]);
  // simuluj po kouscích, aby šlo čekat na rituál fúze (setTimeout ve hře)
  for(let guard=0;guard<400;guard++){
    const st=await p.evaluate(()=>{const K=window.__krypta,DT=1/40;
      for(let n=0;n<40*20;n++){const R=K.run;if(!R||R.over)return 'over';if(n===0&&window.__dbg!==undefined)window.__dbg.push([K.state,R.t|0,'lv',R.level,'hp',R.p.hp|0,'cr',R.crystal?R.crystal.hp|0:'-','coins',R.coins,'tw',R.towers.length,'en',R.enemies.length,'dist',R.crystal?Math.hypot(R.crystal.x-R.p.x,R.crystal.y-R.p.y)|0:'-'].join(' '));
        if(K.state==='levelup'){const cards=[...document.querySelectorAll('#luList button')];
          // skóre karty: fúze > vylepšení vlastní zbraně > nová zbraň > pasivka; trochu náhody
          let best=null,bs=-1;for(const el of cards){const h=el.querySelector('h3').textContent,f=el.classList.contains('fuse');
            const up=/Úr\.|Lv/.test(h),nw=/Nové|New/.test(h);let sc=f?100:up?12:nw?8:4;
            const img=el.querySelector('img');sc+=Math.random()*5;if(sc>bs){bs=sc;best=el;}}
          if(best)best.click();continue;}
        if(K.state==='fuse'&&K.FZ&&!K.FZ.done){K.FZ.res=['g','p','g','m'];K.finishFuse();K.afterOption();continue;}
        if(K.state!=='play')return K.state;
        const p=R.p,map=R.map;let fx=0,fy=0;
        // drž se v boji: uteč jen před tím, co je moc blízko, jinak jdi k nejbližšímu nepříteli
        let near=null,nd=1e9;
        for(const e of R.enemies){if(e.dead||e.bur)continue;const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)+.01;
          if(d<nd){nd=d;near=e;}const keep=(e.boss?52:e.elite?34:20)+e.r;
          if(d<keep){const w=(keep-d)/keep*(e.boss?4:e.elite?2.5:1.6);fx+=dx/d*w;fy+=dy/d*w;}}
        if(near&&nd>40){fx-=(p.x-near.x)/nd*.5;fy-=(p.y-near.y)/nd*.5;}
        for(const s of R.eshots){const dx=p.x-s.x,dy=p.y-s.y,d=Math.hypot(dx,dy)+.01;if(d>30)continue;const w=(30-d)/30*2.5;fx+=dx/d*w;fy+=dy/d*w;}
        for(const pl of R.built.pools||[]){const dx=p.x-pl.x,dy=p.y-pl.y,d=Math.hypot(dx,dy);if(d<pl.r+14){const w=(pl.r+14-d)/14*3;fx+=dx/(d+.01)*w;fy+=dy/(d+.01)*w;}}
        if(R.carts)for(const ct of R.carts){const dx=p.x-ct.x,dy=p.y-ct.y,d2=dx*dx+dy*dy;if(d2<45*45){const d=Math.sqrt(d2)+.01,w=(45-d)/45*4;fx+=dx/d*w;fy+=dy/d*w;}}
        // cíl: oáza při nízkém zdraví, krystal v poušti, nejbližší krystal XP
        let goal=null;
        if(p.hp<p.max*.4&&R.built.oases&&R.built.oases.length&&!(R.crystal&&R.crystal.hp<R.crystal.max*.6)){let bd=1e9;for(const o of R.built.oases){const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<bd){bd=d;goal=o;}}}
        if(!goal&&R.crystal&&Math.hypot(R.crystal.x-p.x,R.crystal.y-p.y)>(R.crystal.hp<R.crystal.max*.6?20:60))goal=R.crystal;
        // v poušti brání krystal: jdi na nepřítele, který na něj útočí
        if(!goal&&R.crystal){let bd=1e9;for(const e of R.enemies){if(e.dead)continue;const d=Math.hypot(e.x-R.crystal.x,e.y-R.crystal.y);if(d<bd){bd=d;goal=bd<40?e:null;}}}
        if(!goal){let bd=90;for(const g of R.items){const d=Math.hypot(g.x-p.x,g.y-p.y);if(d<bd){bd=d;goal=g;}}}
        if(!goal){let bd=70;for(const g of R.gems){const d=Math.hypot(g.x-p.x,g.y-p.y);if(d<bd){bd=d;goal=g;}}}
        if(goal){const dx=goal.x-p.x,dy=goal.y-p.y,d=Math.hypot(dx,dy)+1;fx+=dx/d*.9;fy+=dy/d*.9;}
        const cx=map.size/2-p.x,cy=map.size/2-p.y,cd=Math.hypot(cx,cy);if(cd>map.size*.38){fx+=cx/cd*1.5;fy+=cy/cd*1.5;}
        const L=Math.hypot(fx,fy);K.force=L>.12?{x:fx/L,y:fy/L}:{x:0,y:0};
        if(R.t>map.dur+400){K.finish(false);return 'over';} // pojistka: nekonečný běh
        if(n%40===0&&R.coins>=(R.crystal?90:60)&&R.towers.length<(R.hero&&R.hero.builder?6:3)&&!(R.crystal&&R.crystal.hp<R.crystal.max*.7))K.buildTower(R.heroId==='builder'||R.crystal?'arrow':['arrow','fire','frost'][R.towers.length%3]);
        if(n%40===0&&R.hero&&R.hero.builder&&R.nearTower&&R.nearTower.lv<3&&R.coins>=120)K.upgradeTower();
        if(n%40===0&&R.crystal&&R.nearCrystal&&R.crystal.hp<R.crystal.max*.75)K.repairCrystal();
        K.step(DT);
      }return 'run';});
    if(st==='over')break;
    if(st!=='run'&&st!=='play'&&st!=='levelup'&&st!=='fuse'){await p.waitForTimeout(50);}
  }
  const r=await p.evaluate(()=>{const K=window.__krypta,R=K.run;if(window.DBG)console.log(R.p.x,R.p.y,K.state);if(!R.over)K.finish(false);return Object.assign({},K.lastRun||K.tmRow('death'),{gain:R.gain,rw:R.rw&&R.rw.mat?R.rw.mat[1]:0});});
  rows.push(r);process.stdout.write('.');if(process.env.DBG)console.log(await p.evaluate(()=>window.__dbg.slice(0,12).join('\n')));
}
console.log('\nprofil: '+PROF+(NM?' · Noční můra '+NM:'')+' · '+rows.length+' běhů za '+Math.round((Date.now()-t0)/1000)+' s');
// souhrn
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const med=a=>{a=[...a].sort((x,y)=>x-y);return a.length?a[a.length>>1]:0;};
const pad=(s,n)=>String(s).padEnd(n);
console.log('\n'+pad('mapa',9)+pad('hrdina',9)+pad('výhry',8)+pad('medián',8)+pad('úroveň',8)+'nejčastější příčina smrti');
for(const map of maps)for(const hero of heroes){const R=rows.filter(r=>r.map===map&&r.hero===hero);if(!R.length)continue;
  const w=R.filter(r=>r.won).length,cs={};R.filter(r=>!r.won).forEach(r=>cs[r.cause]=(cs[r.cause]||0)+1);
  const top=Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,v])=>k+' ×'+v).join(', ');
  console.log(pad(map,9)+pad(hero,9)+pad(Math.round(w/R.length*100)+' %',8)+pad(fmt(med(R.map(r=>r.t))),8)+pad(Math.round(R.reduce((a,r)=>a+r.lv,0)/R.length),8)+top);}
// ekonomika: průměrný zisk zlata a materiálu za běh
console.log('\n'+pad('mapa',9)+pad('zlato/běh',11)+'materiál/běh   (výhry | prohry)');
for(const map of maps){const R=rows.filter(r=>r.map===map);if(!R.length)continue;const av=(a,k)=>a.length?Math.round(a.reduce((x,r)=>x+(r[k]||0),0)/a.length):0;
  const W=R.filter(r=>r.won),L=R.filter(r=>!r.won);console.log(pad(map,9)+pad(av(R,'gain'),11)+av(R,'rw')+'   ('+av(W,'gain')+'/'+av(W,'rw')+' | '+av(L,'gain')+'/'+av(L,'rw')+')');}
// zbraně: v kolika výhrách vs. prohrách se vyskytly
const W={};for(const r of rows)for(const k in r.weapons){const o=W[k]||(W[k]={n:0,w:0});o.n++;if(r.won)o.w++;}
const all=rows.filter(r=>r.won).length/rows.length;
console.log('\nzbraně (jak často ve výherním buildu; celkem výher '+Math.round(all*100)+' %):');
console.log(Object.entries(W).sort((a,b)=>b[1].w/b[1].n-a[1].w/a[1].n).map(([k,o])=>'  '+pad(k,10)+pad(o.n+'×',6)+Math.round(o.w/o.n*100)+' % výher').join('\n'));
const D={};for(const r of rows)for(const k in r.dmg_by)D[k]=(D[k]||0)+r.dmg_by[k];const tot=Object.values(D).reduce((a,b)=>a+b,0)||1;
console.log('\nkdo dává hráči poškození (podíl):\n'+Object.entries(D).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>'  '+pad(k,18)+Math.round(v/tot*100)+' %').join('\n'));
require('fs').writeFileSync('bot-results.json',JSON.stringify(rows));
console.log('\nchyby:',errs.slice(0,5));await b.close();})();
