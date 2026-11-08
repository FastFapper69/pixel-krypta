const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+e.stack.split('\n')[1]));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const out=[];
for(const [ult,parents] of (process.argv[2]?JSON.parse(process.argv[2]):[['vortex',['blade','aura']],['storm',['bolt','lightning']],['meteor',['fireball','axe']],['blizzard',['arrows','frost']]])){
 const row={};
 for(const cfg of ['p5','p6','I','II','III']){
  row[cfg]=await p.evaluate(([ult,parents,cfg])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.startRun('knight','hrbitov');const R=K.run;
   R.W={};if(cfg[0]==='p')parents.forEach(id=>R.W[id]={lv:+cfg[1],cd:.4,ang:0,tick:0});else R.W[ult]={lv:{I:1,II:2,III:3}[cfg],cd:.4,ang:0,tick:0,mul:1};
   const tpl=R.enemies[0];R.enemies.length=0;R.spawnT=1e9;
   let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
   for(let i=0;i<40;i++){const a=rnd()*6.283,d=25+rnd()*110;R.enemies.push(Object.assign({},tpl,{x:R.p.x+Math.cos(a)*d,y:R.p.y+Math.sin(a)*d,hp:1e7,max:1e7,hc:{},dead:false,spd:0,kx:0,ky:0,slowT:0,frz:0,elite:false}));}
   for(let i=0;i<60*30;i++){R.pending=0;R.spawnT=1e9;K.step(1/60);}
   let d=0;for(const e of R.enemies)if(e.max===1e7)d+=1e7-e.hp;return Math.round(d/30);},[ult,parents,cfg]);}
 out.push(ult.padEnd(9)+' DPS  rodiče lv5: '+row.p5+'  lv6: '+row.p6+'  |  I: '+row.I+'  II: '+row.II+'  III: '+row.III+'   (I/rodiče6 = '+(row.I/row.p6).toFixed(2)+'×)');}
console.log(out.join('\n'));console.log(errs.slice(0,5));await b.close();})();
