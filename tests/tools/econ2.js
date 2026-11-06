const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;S.mats={bone:0,amber:0,magma:0};const out={};
 // 1) a full simulated win on hrbitov NM0: materials from elites/boss + end bonus, NM I unlock
 const stepN=(n,R)=>{for(let i=0;i<n&&!R.over;i++){R.pending=0;if(K.state==='levelup')document.querySelector('#luList .card').click();K.step(1/60);}};
 const sim=(map,o,secs)=>{K.startRun('knight',map,o);const R=K.run;K.god=true;R.W.blade.lv=6;R.W.aura={lv:6,cd:.4,ang:0,tick:0};
   for(let i=0;i<60*secs&&!R.over;i++){R.pending=0;if(K.state==='levelup')document.querySelector('#luList .card').click();K.step(1/60);}return R;};
 S.cleared={hrbitov:true};S.nm={};
 let R=sim('hrbitov',{nm:0},75);out.matPicked30s=R.mat;out.elitesSoFar=R.eliteI;
 // jump to the boss and kill it
 R.t=R.map.dur;stepN(60*4,R);out.bossSpawned=!!R.boss;if(R.boss){R.boss.hp=1;R.boss.x=R.p.x+12;R.boss.y=R.p.y;}stepN(60*4,R);
 out.win={over:R.over,won:R.won,rw:JSON.stringify(R.rw),mats:JSON.stringify(S.mats),nmUnlocked:S.nm.hrbitov};
 // 2) nightmare scaling: same enemy, NM0 vs NM3
 K.startRun('knight','hrbitov',{nm:0});const e0=K.run.enemies[0];const hp0=e0.max/ (1),d0=e0.dmg;
 K.startRun('knight','hrbitov',{nm:3});const e3=K.run.enemies.find(e=>e.id===e0.id)||K.run.enemies[0];
 out.nm3={hpRatio:+(e3.max/K.run.enemies[0].max).toFixed(2),sameType:e3.id===e0.id,hpMul:+(e3.max/ (hp0)).toFixed(2),dmgMul:+(e3.dmg/d0).toFixed(2)};
 // 3) NM3 win drops an epic, unlocks NM4, gold x1.9, mats x2.5
 S.nm.hrbitov=3;R=sim('hrbitov',{nm:3},2);R.t=R.map.dur;stepN(60*4,R);if(R.boss){R.boss.hp=1;R.boss.x=R.p.x+12;R.boss.y=R.p.y;}stepN(60*4,R);
 out.nm3win={won:R.won,item:R.rw&&R.rw.item?R.rw.item.r:null,nmNow:S.nm.hrbitov,gain:R.gain};
 // 4) daily challenge
 const di=K.dailyInfo();out.daily={map:di.map,mod:di.mod.id,done:di.done};
 K.startRun('knight',di.map,{mod:di.mod.id});const st=K.st;out.dailyRun={mod:K.run.mod,max:st.max,dmg:st.dmg,regen:st.regen};
 K.run.t=181;K.god=false;K.run.p.hp=1;K.run.p.inv=0;K.run.eshots.push({x:K.run.p.x,y:K.run.p.y,vx:0,vy:0,dmg:99,r:3,life:1});K.step(1/60);
 out.dailyDone={over:K.run.over,daily:!!(K.run.rw&&K.run.rw.daily),flag:S.daily.chal};
 return out;});
console.log(JSON.stringify(r,null,1));
await p.waitForTimeout(900);await p.screenshot({path:'over_daily.png'});
console.log(errs.slice(0,5));await b.close();})();
