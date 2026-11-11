// kapitola X (11p): každou mapu odehraje (výchozí hrdina Paladin) s věžemi kapitoly (Kovadlina, Svatyně), setem a korunou,
// vyfotí běh a bosse; u Dvora věčnosti ověří dvojčata (padnou jen spolu), u finále projde všechny čtyři fáze Aurela až do výhry.
// node c10shots.js prefix [mapy] [sekundy před bossem] [hrdina]
const {chromium}=require('playwright');const pre=process.argv[2]||'c10',maps=(process.argv[3]||'schody,trofeje,hkovarna,vecnost,korunace').split(','),secs=+(process.argv[4]||40),hero=process.argv[5]||'paladin';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const play=async n=>{for(let k=0;k<n;k++){const st=await p.evaluate(()=>{const K=window.__krypta;for(let i=0;i<60;i++){if(K.state!=='play')break;K.step(1/60);}return K.state;});
   if(st==='levelup'||st==='fuse'){const bt=await p.$('#luList button');if(bt)await bt.click();else await p.evaluate(()=>window.__krypta._ev("setState('play')"));await p.waitForTimeout(30);}
   else if(st!=='play')return st;}return 'play';};
 const info=()=>p.evaluate(()=>{const R=window.__krypta.run,B=R.boss,T=R.twinB;return {state:window.__krypta.state,boss:B?B.id+' '+Math.round(B.hp/B.max*100)+'%':null,twin:T?(T.dead?'dead':Math.round(T.hp/T.max*100)+'%'+(T.fallen?' fallen':'')):null,
   ph:R.kcr?R.kcr.ph:null,shards:R.kcr?R.kcr.sh.filter(s=>!s.dead).length:null,holes:R.kcl?R.kcl.L.length:null,anvil:R.kan?R.kan.L.length:null,tro:R.ktr?R.ktr.L.filter(e=>e&&!e.dead&&e.awake).length+'/'+R.ktr.L.filter(e=>e&&!e.dead).length:null,dark:R.kdark?+R.kdark.toFixed(2):null,hp:Math.round(R.p.hp),en:R.enemies.length,won:R.won};});
 for(const m of maps){const t0=Date.now();
   await p.evaluate(([m,h])=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.save.heroes[h]=true;K.startRun(h,m);
     E("st.lg.sc4=1;st.lg.sc6=1;st.lg.crown7=1;");const R=K.run,C=R.map.size/2;['anvil','sanctum'].forEach((t,i)=>E("addTower('"+t+"',"+(C+40*(i?1:-1))+","+(C+30)+",null)"));},[m,hero]);
   await play(secs);await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+m+'.png'});console.log(m,'run',JSON.stringify(await info()));
   await p.evaluate(()=>{const K=window.__krypta,R=K.run;R.t=R.map.dur-1;});await play(6);
   await p.evaluate(()=>{const R=window.__krypta.run,B=R.boss;if(B){R.p.x=B.x;R.p.y=B.y+70;}});
   if(m==='vecnost'){await play(4);await p.evaluate(()=>{const R=window.__krypta.run;window.__krypta._ev("hurtEnemy(run.boss,1e9,0,0)");});await play(2);console.log(' den down',JSON.stringify(await info()));
     await play(6);console.log(' after 6s (revived?)',JSON.stringify(await info()));
     await p.evaluate(()=>{window.__krypta._ev("hurtEnemy(run.boss,1e9,0,0)");});await play(1);await p.evaluate(()=>{window.__krypta._ev("hurtEnemy(run.twinB,1e9,0,0)");});await play(2);console.log(' both',JSON.stringify(await info()));}
   else if(m==='korunace'){await play(6);await p.screenshot({path:pre+'_'+m+'_p1.png'});
     await p.evaluate(()=>{const B=window.__krypta.run.boss;B.hp=B.max*.65;});await play(10);await p.screenshot({path:pre+'_'+m+'_p2.png'});console.log(' p2',JSON.stringify(await info()));
     await p.evaluate(()=>{const R=window.__krypta.run,s=R.kcr.sh.find(s=>!s.dead);if(s)window.__krypta._ev("hurtEnemy(run.kcr.sh.find(s=>!s.dead),1e9,0,0)");});await play(2);console.log(' shard broken',JSON.stringify(await info()));
     await p.evaluate(()=>{const B=window.__krypta.run.boss;B.hp=B.max*.35;});await play(9);await p.screenshot({path:pre+'_'+m+'_p3.png'});console.log(' p3',JSON.stringify(await info()));
     await p.evaluate(()=>{window.__krypta._ev("hurtEnemy(run.boss,run.boss.max*.3,0,0)");});await play(6);await p.screenshot({path:pre+'_'+m+'_p4.png'});console.log(' p4',JSON.stringify(await info()));
     await play(12);console.log(' p4 end',JSON.stringify(await info()));let st='play';for(let k=0;k<8&&st==="play";k++){const gone=await p.evaluate(()=>{const R=window.__krypta.run;if(!R.boss)return 1;window.__krypta._ev("hurtEnemy(run.boss,run.boss.max,0,0)");return 0;});st=await play(gone?4:1);}
     await p.waitForTimeout(300);await p.screenshot({path:pre+'_'+m+'_end.png'});console.log(' end',st,JSON.stringify(await info()));}
   else{const bi=await p.evaluate(()=>{const B=window.__krypta.run.boss;if(B)B.hp=B.max*.45;return B?B.id:null;});await play(10);console.log(' boss',bi,JSON.stringify(await info()));}
   await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+m+'_boss.png'});console.log(' ',Date.now()-t0+'ms');}
 console.log('errors',errs.slice(0,5));await b.close();})();
