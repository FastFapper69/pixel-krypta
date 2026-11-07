// čas po sekcích render() (JS + rasterizace, CPU canvas): node secTime.js file.html [map] [ults=1]
const {chromium}=require('playwright');const fs=require('fs');const file=process.argv[2]||'new.html',map=process.argv[3]||'doly',ults=+(process.argv[4]??1);
let src=fs.readFileSync(__dirname+'/'+file,'utf8').replace('function render(){','window.__rend=()=>render();function render(){');
const marks=['// oasis water','// lava pools','// aura','// gems bob','// items','// ground effects','// units sorted','// all enemy shadows','// blades','// vortex of blades','// shots','// storm drop','// steam clouds','// lightning','// falling meteors','// storm chains','// tesla arcs','// particles','// damage numbers','// crystal pointer'];
for(const m of marks)src=src.replace('  '+m,'  window.__mk&&__mk('+JSON.stringify(m.slice(3))+');'+m);
src=src.replace(/\n  renderLight\(g,ox,oy\);\n/,'\n  window.__mk&&__mk("light");renderLight(g,ox,oy);window.__mk&&__mk("over/amb");\n');
src=src.replace("  if(run.map.grade){g.globalCompositeOperation='soft-light'","  window.__mk&&__mk('grade+vig+flash');if(run.map.grade){g.globalCompositeOperation='soft-light'");
src=src.replace("  mfCall('ground',g,ox,oy);","  window.__mk&&__mk('mf ground');mfCall('ground',g,ox,oy);window.__mk&&__mk('after ground');");
src=src.replace("  // oasis water: drifting glints","  window.__mk&&__mk('after mapblit');// oasis");
src=src.replace("  l.globalAlpha=1;g.imageSmoothingEnabled=true;g.globalAlpha=dk","  window.__mk&&__mk('L:mask-js');lctx.getImageData(0,0,1,1);window.__mk&&__mk('L:mask-raster');l.globalAlpha=1;g.imageSmoothingEnabled=true;g.globalAlpha=dk");
src=src.replace("  // (glows are summed","  window.__mk&&__mk('L:composite');// (glows");
src=src.replace("  q.globalAlpha=1;if(ng){","  gctx.getImageData(0,0,1,1);window.__mk&&__mk('L:glowdraw');q.globalAlpha=1;if(ng){");
fs.writeFileSync(__dirname+'/_s.html',src);
(async()=>{const b=await chromium.launch({args:['--disable-accelerated-2d-canvas','--disable-gpu']});const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:3});
 const p=await c.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+__dirname+'/_s.html');await p.waitForTimeout(500);
 const r=await p.evaluate(([map,ults])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.seedRng('bench');K.startRun('builder',map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   const W=ults?['vortex','storm','meteor','blizzard','note','rang']:['fireball','lightning','blade','arrows','axe','aura'];for(const id of W)if(!r.W[id])r.W[id]={lv:ults?3:6,ang:0,mul:1};
   const ids=['skeleton','zombie','bat','slime','ghost','spider'];let nn=0;
   const fill=()=>{let n=0;while(r.enemies.length<180&&n++<40){const a=Math.random()*6.283,d=60+Math.random()*120;const e=K.makeEnemy(ids[nn++%6],r.p.x+Math.cos(a)*d,r.p.y+Math.sin(a)*d*1.6);if(nn%25===0)e.elite=true;r.enemies.push(e);}};
   for(let i=0;i<300;i++){fill();K.step(1/60);}
   const g=document.getElementById('cv').getContext('2d');const T={};let cur='pre',t=0;
   window.__mk=n=>{g.getImageData(0,0,1,1);const now=performance.now();T[cur]=(T[cur]||0)+now-t;cur=n;t=now;};
   const N=60;for(let i=0;i<N;i++){fill();K.step(1/60);cur='pre';t=performance.now();window.__rend();window.__mk('end');}
   const o={};let s=0;for(const k in T){if(k==='end')continue;o[k]=+(T[k]/N).toFixed(2);s+=T[k]/N;}o.SUM=+s.toFixed(2);return o;},[map,ults]);
 for(const k in r)console.log(k.padEnd(20),r[k]);await b.close();})();
