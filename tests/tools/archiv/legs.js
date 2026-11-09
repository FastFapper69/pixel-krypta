const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;const out={};
 const leg=(id)=>{const it=K.makeItem(4,null,.5,id);it.st={};S.inv=[it];S.eq={knight:{[it.s]:it.u}};return it;};
 const dummies=(R,n)=>{R.spawnT=1e9;const tpl=R.enemies[0];R.enemies.length=0;for(let i=0;i<n;i++){const a=i/n*6.283;R.enemies.push(Object.assign({},tpl,{x:R.p.x+Math.cos(a)*30,y:R.p.y+Math.sin(a)*30,hp:1e7,max:1e7,hc:{},dead:false,spd:0,kx:0,ky:0}));}};
 const dmgOver=(secs)=>{const R=K.run;R.need=1e9;dummies(R,12);for(let i=0;i<60*secs;i++)K.step(1/60);return Math.round(R.enemies.reduce((s,e)=>s+(1e7-e.hp),0));};
 // Metronom
 S.inv=[];S.eq={};K.startRun('knight','hrbitov');K.god=true;const base=dmgOver(12);
 leg('metro');K.startRun('knight','hrbitov');const met=dmgOver(12);out.metronom=+(met/base).toFixed(2);
 // Basový tep: shockwave rings per bar
 leg('bass');K.startRun('knight','hrbitov');K.run.need=1e9;let rings=0;for(let i=0;i<60*12;i++){K.step(1/60);rings+=K.run.fx.filter(f=>f.col==='#ff9a5a'&&f.r<4).length;}out.bassRings12s=rings;
 // Srdce krypty: second chance without the shop upgrade, recharges after 180 s
 leg('heart');S.meta.revive=0;K.startRun('knight','hrbitov');const R=K.run;K.god=false;R.p.hp=1;R.p.inv=0;R.eshots.push({x:R.p.x,y:R.p.y,vx:0,vy:0,dmg:99,r:3,life:1});K.step(1/60);
 out.heart={alive:!R.over,revived:R.revived};R.need=1e9;R.spawnT=1e9;R.enemies.length=0;K.god=true;for(let i=0;i<60*181;i+=10){for(let j=0;j<10;j++){R.pending=0;R.enemies.length=0;K.step(1/60);}}out.heart.recharged=!R.revived;
 // Kompas pouště: carts do not hurt
 leg('compass');K.startRun('knight','doly');const D=K.run;K.god=false;D.need=1e9;K.step(1/60);const c0=D.carts[0];D.p.x=c0.x;D.p.y=c0.y;D.p.inv=0;const hp=D.p.hp;K.step(1/60);out.compassCart={hpBefore:hp,hpAfter:D.p.hp};
 // Dirigentská koruna: wide rhythm window
 leg('crown');K.startRun('knight','hrbitov');K.run.W.blade.lv=5;K.run.W.aura={lv:5,cd:.4,ang:0,tick:0};K.run.fuseMiss=2;K.run.pending=1;K.step(1/60);
 document.querySelector('#luList .card.fuse').click();out.crownWide=K.FZ.wide;
 return out;});
console.log(JSON.stringify(r,null,1));
// crown: tap 120 ms late every time -> still 'perfect'
const res=await p.evaluate(()=>new Promise(r=>{const K=window.__krypta;const sd=K.M.stepDur*4;const loop=()=>{const F=K.FZ;if(!F){r('none');return;}const b=K.audioBeat(),i=F.res.findIndex(x=>x===null);
  if(i>=0&&b>=F.targets[i]+.12/sd)K.fuseTap();if(F.done){r(F.res.join(''));return;}requestAnimationFrame(loop);};requestAnimationFrame(loop);}));
console.log('koruna, ťuk o 120 ms pozdě:',res,errs.slice(0,4));await b.close();})();
