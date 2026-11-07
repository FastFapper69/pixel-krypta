// Výkon v hordě: počet volání canvasu za snímek + čas update/render (ms, bez zpomalení). node bench.js [file] [map] [hero]
const {chromium}=require('playwright');const file=process.argv[2]||'off.html',map=process.argv[3]||'doly',hero=process.argv[4]||'builder';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:3});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(500);
 const res=await p.evaluate(([map,hero])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun(hero,map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   for(const id of ['fireball','lightning','blade','arrows','axe','aura'])if(!r.W[id])r.W[id]={lv:6,ang:0};
   for(let i=0;i<300;i++)K.step(1/60);
   // fill horde
   const ids=['skeleton','zombie','bat','slime','ghost'];
   const fill=()=>{let n=0;while(r.enemies.length<170&&n++<200){const e=K.makeEnemy?K.makeEnemy(ids[n%5],r.p.x+Math.random()*180-90,r.p.y+Math.random()*360-180):null;if(!e)break;e.hp=e.max=1e4;r.enemies.push(e);}};
   if(!K.makeEnemy)return {err:'no makeEnemy hook'};
   fill();
   const P=CanvasRenderingContext2D.prototype,cnt={};let on=false;
   for(const k of ['fillRect','drawImage','createRadialGradient','save','restore','rotate','translate','beginPath','fill','clearRect']){const o=P[k];P[k]=function(){if(on)cnt[k]=(cnt[k]||0)+1;return o.apply(this,arguments);};}
   const set=Object.getOwnPropertyDescriptor(P,'globalAlpha').set,fs=Object.getOwnPropertyDescriptor(P,'fillStyle').set;
   Object.defineProperty(P,'globalAlpha',{set(v){if(on)cnt.alpha=(cnt.alpha||0)+1;set.call(this,v)},get:Object.getOwnPropertyDescriptor(P,'globalAlpha').get});
   Object.defineProperty(P,'fillStyle',{set(v){if(on)cnt.fillStyle=(cnt.fillStyle||0)+1;fs.call(this,v)},get:Object.getOwnPropertyDescriptor(P,'fillStyle').get});
   let tu=0,tr=0;const N=120;
   for(let i=0;i<N;i++){fill();const a=performance.now();K.step(1/60);const b2=performance.now();on=true;K.render();on=false;const c2=performance.now();tu+=b2-a;tr+=c2-b2;}
   for(const k in cnt)cnt[k]=Math.round(cnt[k]/N);
   return {upd:+(tu/N).toFixed(2),ren:+(tr/N).toFixed(2),en:r.enemies.length,parts:r.parts.length,fx:r.fx.length,shots:r.shots.length,gems:r.gems.length,cnt};},[map,hero]);
 console.log(map,hero,JSON.stringify(res),errs.slice(0,3));await b.close();})();
