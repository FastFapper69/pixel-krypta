// 11r mechaniky proti snadným mapám: Trosky (prázdnota ukusuje okraje), Vír (nádech a vyvržení), Zlatá pole (strašáci ožívají),
// Zahrada světla (světlušky z květů), Předměstí / Síň soch / Pokladnice (zlatá krev). Odehraje kus mapy, vyfotí a vypíše stav.
// node mech11r.js prefix [mapy] [cs|en]
const L=require('./lib');const pre=process.argv[2]||'m11r',maps=(process.argv[3]||'trosky,vir,pole,zahrada,predmesti,sochy,pokladnice').split(','),lang=process.argv[4]||'cs';
(async()=>{const {p,E,errs,close}=await L.open({lang,phone:'15',save:'late'});
 const play=async n=>{for(let k=0;k<n;k++){const st=await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<60;i++){if(K.state!=='play')break;K.step(1/60);}return K.state;});
   if(st==='levelup'||st==='fuse'){const bt=await p.$('#luList button');if(bt)await bt.click();else await E("setState('play')");await p.waitForTimeout(30);}}};
 for(const m of maps){
   await p.evaluate(m=>{const K=window.__krypta;K.god=true;K.startRun('knight',m);},m);
   const out={};
   if(m==='trosky'){await p.evaluate(()=>{const R=window.__krypta.run;R.t=150;});await play(40);
     await p.evaluate(()=>{const R=window.__krypta.run,C=R.map.size/2;R.p.x=C+R.ksh.r-30;R.p.y=C;});await play(1);
     out.ring=await p.evaluate(()=>{const S=window.__krypta.run.ksh;return [S.r|0,S.to|0,S.next|0,+S.warn.toFixed(2)];});
     await p.screenshot({path:pre+'_trosky.png'});
     await p.evaluate(()=>{const R=window.__krypta.run,C=R.map.size/2;R.p.x=C+R.ksh.r+40;R.p.y=C;R.p.hp=R.p.max;window.__krypta.god=false;});await play(2);
     out.outside=await p.evaluate(()=>{const R=window.__krypta.run;return {hp:Math.round(R.p.hp/R.p.max*100)};});await p.screenshot({path:pre+'_trosky_out.png'});
     await p.evaluate(()=>{window.__krypta.god=true;});}
   if(m==='vir'){await p.evaluate(()=>{const R=window.__krypta.run;R.t=70;});await play(8);
     // wait for the warning bar, photo, then the spit
     for(let i=0;i<40;i++){const w=await p.evaluate(()=>window.__krypta._ev('vortexPhase().warn'));if(w)break;await play(1);}
     await p.evaluate(()=>{const R=window.__krypta.run,v=R.built.vc;R.p.x=v.x+90;R.p.y=v.y+60;});await play(1);await p.screenshot({path:pre+'_vir_warn.png'});
     const n0=await E('run.eshots.length');for(let i=0;i<20;i++){await play(1);const n=await E('run.eshots.length');if(n>n0+10)break;}
     out.shots=await E('run.eshots.length');await p.screenshot({path:pre+'_vir_spit.png'});}
   if(m==='pole'){await p.evaluate(()=>{const R=window.__krypta.run;R.t=60;});await play(20);
     out.posts=await E("run.enemies.filter(e=>e.stat&&!e.dead).length+' stojí, '+run.enemies.filter(e=>e.stat&&e.awake&&!e.dead).length+' ožilo'");
     const q=await p.evaluate(()=>{const R=window.__krypta.run;const e=R.enemies.find(e=>e.stat&&!e.awake&&!e.dead);if(e){R.p.x=e.x+50;R.p.y=e.y+20;}return !!e;});await play(1);await p.screenshot({path:pre+'_pole.png'});}
   if(m==='zahrada'){await p.evaluate(()=>{const R=window.__krypta.run;R.t=40;});
     for(let i=0;i<60;i++){await play(1);const w=await E('run.kb&&run.kb.warn>0');if(w)break;}
     await p.evaluate(()=>{const R=window.__krypta.run,f=R.kb.F[0];R.p.x=f.x+10;R.p.y=f.y;});const n0=await E("run.enemies.filter(e=>e.id==='firefly').length");
     for(let i=0;i<12;i++){await play(1);const op=await E('run.kb.F[0].op');if(op>.6)break;}
     out.ff=[n0,await E("run.enemies.filter(e=>e.id==='firefly').length")];await p.screenshot({path:pre+'_zahrada.png'});}
   if(['predmesti','sochy','pokladnice'].includes(m)){await p.evaluate(()=>{const R=window.__krypta.run;R.t=90;});await play(15);
     out.heal=await p.evaluate(()=>{const K=window.__krypta,R=K.run,E=K._ev,P=R.p;P.hp=P.max*.5;const h0=P.hp;let n=0;
       for(const e of R.enemies){if(e.boss||e.dead||e.stat)continue;e.x=P.x+20;e.y=P.y;e.hp=1;E('hurtEnemy')(e,999,0,0);if(++n>=6)break;}
       return {killed:n,gain:+((P.hp-h0)/P.max*100).toFixed(1),capPct:4};});
     await play(1);await p.screenshot({path:pre+'_'+m+'.png'});}
   console.log(m,JSON.stringify(out));}
 console.log('chyby JS:',errs.slice(0,6));await close();})();
