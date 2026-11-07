// počty volání canvasu na snímek podle sekcí render(): node callcount.js [map]
const {chromium}=require('playwright');const fs=require('fs');const map=process.argv[2]||'doly';
let src=fs.readFileSync(__dirname+'/'+(process.argv[3]||'off.html'),'utf8');
const marks=['// steam clouds','// vortex of blades','// oasis water','// lava pools','// aura','// gems bob','// items','// ground effects','// units sorted','// blades','// shots','// storm drop','// lightning','// falling meteors','// storm chains','// tesla arcs','// particles','// damage numbers'];
for(const m of marks)src=src.replace('  '+m,'  window.__mk&&__mk('+JSON.stringify(m.slice(3))+');'+m);
src=src.replace('  renderLight(g,ox,oy);\n','  window.__mk&&__mk("light");renderLight(g,ox,oy);window.__mk&&__mk("over/amb");\n');
src=src.replace('function render(){','window.__rend=()=>render();function render(){');
fs.writeFileSync(__dirname+'/_cc.html',src);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:3});
 const p=await c.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+__dirname+'/_cc.html');await p.waitForTimeout(500);
 const r=await p.evaluate((map)=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('builder',map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   for(const id of ['vortex','storm','meteor','blizzard','note','rang'])if(!r.W[id])r.W[id]={lv:3,ang:0,mul:1};
   const ids=['skeleton','zombie','bat','slime','ghost','spider'];let nn=0;
   const fill=()=>{let n=0;while(r.enemies.length<180&&n++<40){const a=Math.random()*6.283,d=60+Math.random()*120;const e=K.makeEnemy(ids[nn++%6],r.p.x+Math.cos(a)*d,r.p.y+Math.sin(a)*d*1.6);if(nn%25===0)e.elite=true;r.enemies.push(e);}};
   for(let i=0;i<300;i++){fill();K.step(1/60);}
   const ex={};for(const q of r.parts)ex[q.k||'sq']=(ex[q.k||'sq']||0)+1;const fk={};for(const f of r.fx)fk[f.k]=(fk[f.k]||0)+1;window.__ex=[ex,fk];const P=CanvasRenderingContext2D.prototype,cnt={},sec={cur:'pre'};window.__mk=n=>sec.cur=n;
   for(const fn of ['drawImage','fillRect','fill','setTransform','save','restore','clearRect','translate','rotate','beginPath','stroke'])
     {const o=P[fn];P[fn]=function(){const k=sec.cur;(cnt[k]=cnt[k]||{});cnt[k][fn]=(cnt[k][fn]||0)+1;return o.apply(this,arguments);};}
   let N=0;const st={};for(let i=0;i<60;i++){fill();K.step(1/60);sec.cur='pre';window.__rend();N++;}
   const out={};let tot=0;for(const k in cnt){let s=0;for(const f in cnt[k])s+=cnt[k][f];out[k]=Math.round(s/N)+' '+JSON.stringify(Object.fromEntries(Object.entries(cnt[k]).map(([a,b])=>[a,Math.round(b/N)])));tot+=s;}
   out.mix=JSON.stringify(window.__ex);out.TOTAL=Math.round(tot/N);out.en=r.enemies.length;out.parts=r.parts.length;out.fx=r.fx.length;return out;},map);
 console.log(map);for(const k in r)console.log(k.padEnd(18),r[k]);await b.close();})();
