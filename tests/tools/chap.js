// chapters smoke test: every map runs, the boss spawns and fights for a while (god mode), no errors; screenshots of the boss
// node chap.js [maps,comma] [outdir]
const {chromium}=require('playwright');
const maps=(process.argv[2]||'bazina,kostnice,zvonice,trun,kanon,karavana,hrobka,brana').split(','),out=process.argv[3]||'.';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
for(const m of maps){const r=await p.evaluate(m=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.startRun('mage',m);
  const R=()=>K.run2;let mxE=0;for(let i=0;i<600;i++){K.step(1/60);mxE=Math.max(mxE,R().enemies.length);}
  R().t=R().map.dur-1;for(let i=0;i<240;i++)K.step(1/60);const boss=R().boss;
  // walk around the boss for a while so it uses its moves
  for(let i=0;i<1500;i++){const bb=R().boss;if(bb){const a=i/120;K.force={x:Math.cos(a),y:Math.sin(a)};}K.step(1/60);if(R().over)break;}K.force=null;
  const bb=R().boss;return{m,boss:boss&&boss.id,alive:!!bb,bossHp:bb?Math.round(bb.hp/bb.max*100):0,jars:R().jars,arena:R().arena&&Math.round(R().arena.r),en:R().enemies.length,mxE,over:R().over,curse:R().curse>0};},m);
  await p.waitForTimeout(80);await p.screenshot({path:out+'/boss-'+m+'.png'});console.log(JSON.stringify(r));}
console.log('errors',errs.slice(0,8));await b.close();})();
