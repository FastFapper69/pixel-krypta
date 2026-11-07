// Kdo volá fillRect: node attr.js [file] [map]
const {chromium}=require('playwright');const file=process.argv[2]||'off.html',map=process.argv[3]||'doly';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:3});
 const p=await c.newPage();await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(500);
 const res=await p.evaluate((map)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('builder',map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   for(const id of ['fireball','lightning','blade','arrows','axe','aura'])if(!r.W[id])r.W[id]={lv:6,ang:0};
   for(let i=0;i<300;i++)K.step(1/60);const ids=['skeleton','zombie','bat','slime','ghost'];
   const fill=()=>{let n=0;while(r.enemies.length<170&&n++<200){const e=K.makeEnemy(ids[n%5],r.p.x+Math.random()*180-90,r.p.y+Math.random()*360-180);e.hp=e.max=1e4;r.enemies.push(e);}};
   const P=CanvasRenderingContext2D.prototype,cnt={};let on=false;Error.stackTraceLimit=4;
   for(const k of ['fillRect','drawImage']){const o=P[k];P[k]=function(){if(on){const s=new Error().stack.split('\n');const m=k+' '+(s[2]||'').trim().replace(/\(.*:(\d+):\d+\)/,':$1')+' < '+(s[3]||'').trim().replace(/\(.*:(\d+):\d+\)/,':$1');cnt[m]=(cnt[m]||0)+1;}return o.apply(this,arguments);};}
   const N=30;for(let i=0;i<N;i++){fill();K.step(1/60);on=true;K.render();on=false;}
   return Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,30).map(([k,v])=>Math.round(v/N)+'  '+k).join('\n');},map);
 console.log(res);await b.close();})();
