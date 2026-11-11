// kapitola VII (11f): každou mapu odehraje s Nyx (Černá díra) a věžemi kapitoly, set a legendárka zapnuté,
// vyfotí běh a bosse ve 2. fázi a vypíše stav mechanik (trhliny, ozvěna, lucerna, černá díra) – musí proběhnout bez chyb JS.
// node c7shots.js prefix [mapy] [sekundy před bossem] [hrdina]
const {chromium}=require('playwright');const pre=process.argv[2]||'c7',maps=(process.argv[3]||'okraj,trosky,ozveny,svetlo,nicota').split(','),secs=+(process.argv[4]||40),hero=process.argv[5]||'nyx';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const play=async n=>{for(let k=0;k<n;k++){const st=await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<60;i++){if(K.state!=='play')break;K.step(1/60);}return K.state;});
   if(st==='levelup'||st==='fuse'){const bt=await p.$('#luList button');if(bt)await bt.click();else await p.evaluate(()=>window.__krypta._ev("setState('play')"));await p.waitForTimeout(30);}}};
 for(const m of maps){const t0=Date.now();
   await p.evaluate(([m,h])=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun(h,m);
     E("st.lg.sv4=1;st.lg.vheart=1;");const R=K.run,C=R.map.size/2;['espire','lantern'].forEach((t,i)=>E("addTower('"+t+"',"+(C+40*(i?1:-1))+","+(C+30)+",null)"));},[m,hero]);
   await play(secs);await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+m+'.png'});
   await p.evaluate(()=>{const K=window.__krypta,R=K.run;R.t=R.map.dur-1;});await play(6);
   const bi=await p.evaluate(()=>{const K=window.__krypta,R=K.run,B=R.enemies.find(e=>e.boss);if(B){R.p.x=B.x;R.p.y=B.y+70;B.hp=B.max*.45;}return {boss:B?B.id:null};});
   await play(10);await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+m+'_boss.png'});
   const st=await p.evaluate(()=>{const R=window.__krypta.run;return {en:R.enemies.length,rifts:R.kr?R.kr.L.length+'/'+R.kr.n:null,echo:R.ke?R.ke.E.filter(Boolean).length:null,lant:R.kn?[R.kn.x|0,R.kn.y|0]:null,pull:R.kpOn,holes:R.fx.filter(f=>f.k==='bhole').length,tech:R.fx.filter(f=>f.k==='tech').length,hp:Math.round(R.p.hp),state:window.__krypta.state};});
   console.log(m,JSON.stringify(bi),JSON.stringify(st),Date.now()-t0+'ms');}
 console.log('errors',errs.slice(0,5));await b.close();})();
