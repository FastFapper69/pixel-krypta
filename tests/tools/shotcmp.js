// screenshot těžkého boje (stejný seed) pro porovnání vzhledu: node shotcmp.js file.html out.png [map] [ults]
const {chromium}=require('playwright');const [file,out,map='doly',ults='1']=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/'+file);await p.waitForTimeout(500);
 await p.evaluate(([map,ults])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.seedRng('bench');K.startRun('builder',map);const r=K.run;r.coins=99999;r.t=200;
   for(const k of ['arrow','fire','frost','tesla','fire','tesla'])try{K.buildTower(k)}catch(e){}
   const W=+ults?['vortex','storm','meteor','blizzard','note','rang']:['fireball','lightning','blade','arrows','axe','aura'];for(const id of W)if(!r.W[id])r.W[id]={lv:+ults?3:6,ang:0,mul:1};
   const ids=['skeleton','zombie','bat','slime','ghost','spider'];let nn=0;
   const fill=()=>{let n=0;while(r.enemies.length<180&&n++<40){const a=Math.random()*6.283,d=60+Math.random()*120;const e=K.makeEnemy(ids[nn++%6],r.p.x+Math.cos(a)*d,r.p.y+Math.sin(a)*d*1.6);if(nn%25===0)e.elite=true;r.enemies.push(e);}};
   for(let i=0;i<400;i++){fill();K.step(1/60);}K.state='play';},[map,ults]);
 await p.waitForTimeout(300);await p.screenshot({path:out});console.log(out,errs);await b.close();})();
