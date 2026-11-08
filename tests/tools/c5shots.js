// kapitola V: postaví mapy, odehraje kus (level-upy vybírá sám), vyfotí hru a bosse
// node c5shots.js prefix [mapy] [sekundy před bossem]
const {chromium}=require('playwright');const pre=process.argv[2],maps=(process.argv[3]||'vrakoviste,pristav,majak,vir,paluba').split(','),secs=+(process.argv[4]||20);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const play=async n=>{for(let k=0;k<n;k++){const st=await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<60;i++){if(K.state!=='play')break;K.step(1/60);}return K.state;});
   if(st==='levelup'||st==='fuse'){const bt=await p.$('#luList button');if(bt)await bt.click();else await p.evaluate(()=>window.__krypta._ev("setState('play')"));await p.waitForTimeout(30);}}};
 for(const m of maps){const t0=Date.now();
   await p.evaluate((m)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight',m);},m);
   await play(secs);await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+m+'.png'});
   await p.evaluate(()=>{const K=window.__krypta,R=K.run;R.t=R.map.dur-1;});await play(6);
   const bi=await p.evaluate(()=>{const K=window.__krypta,R=K.run,B=R.enemies.find(e=>e.boss);if(B&&!R.built.deck){R.p.x=B.x;R.p.y=B.y+70;}return {boss:B?B.id:null,hp:B?Math.round(B.hp):0};});
   await play(6);await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+m+'_boss.png'});
   const st=await p.evaluate(()=>{const R=window.__krypta.run;return {en:R.enemies.length,tent:(R.tent||[]).length,holes:(R.holes||[]).length,storm:R.storm||0};});
   console.log(m,JSON.stringify(bi),JSON.stringify(st),Date.now()-t0+'ms');}
 console.log('errors',errs.slice(0,5));await b.close();})();
