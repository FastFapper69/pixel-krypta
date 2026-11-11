// Weapon gallery: one fight per weapon (only that weapon, max level), crops around the hero, two frames each
// node wgallery.js <prefix> [id,id,...] [map]   -> <prefix>_<id>.png (two frames side by side)
const {chromium}=require('playwright');
const pre=process.argv[2]||'wg',map=process.argv[4]||'hrbitov';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 await p.evaluate(n=>{window.__N=n},+process.env.N||14);
 await p.evaluate(()=>window.__krypta._ev("openLevelUp=function(){run.pending=0;run.chestOpen=false;}"));
 const ids=process.argv[3]?process.argv[3].split(','):[];
 const all=ids.length?ids:['bolt','blade','lightning','fireball','axe','aura','arrows','frost','note','rang','hammer','icicle','anchor','stars','halberd','whip','vortex','storm','meteor','blizzard','echo','steam','thunder','frostblade','arcane','flamering'];
 for(const id of all){
  await p.evaluate(([id,map])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('knight',map);const r=K.run;r.tut=null;const ids=['skeleton','zombie','bat','slime','ghost','spider'];let nn=0;window.__fill=()=>{let n=0;while(r.enemies.length<(window.__N||14)&&n++<30){const a=Math.random()*6.283,d=40+Math.random()*110;r.enemies.push(K.makeEnemy(ids[nn++%6],r.p.x+Math.cos(a)*d,r.p.y+Math.sin(a)*d*1.5));}};
    r.W={};r.W[id]={lv:K._ev('WEAPONS')[id].lv.length,ang:0,mul:1};r.t=150;
    for(let i=0;i<600;i++){r.pending=0;r.xp=0;window.__fill();K.step(1/60);}r.p.hp=r.p.max;},[id,map]);
  for(let k=0;k<3;k++){await p.evaluate(n=>{const K=window.__krypta;const r=K.run;for(let i=0;i<n;i++){r.pending=0;r.xp=0;window.__fill();K.step(1/60);}},k?9:0);
   await p.screenshot({path:pre+'_'+id+'_'+k+'.png',clip:process.env.CLIP?JSON.parse(process.env.CLIP):{x:80,y:290,width:230,height:230}});}
 }
 console.log('errors',errs.slice(0,5));await b.close();})();
