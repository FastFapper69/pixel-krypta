const {chromium}=require('playwright');
const map=process.argv[2]||'poust',out=process.argv[3]||'map.png',file=process.argv[4]||'off.html',moves=process.argv[5]||'';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/'+file);await p.waitForTimeout(500);
const t0=Date.now();
const info=await p.evaluate(([map,moves])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;const t=performance.now();K.startRun('knight',map);const bt=performance.now()-t;
 for(const mv of moves.split(';').filter(Boolean)){const [x,y,n]=mv.split(',').map(Number);K.force={x,y};for(let i=0;i<n;i++)K.step(1/60);}
 K.force=null;for(let i=0;i<90;i++)K.step(1/60);
 return {bt:Math.round(bt),hp:K.run.p.hp,px:Math.round(K.run.p.x),py:Math.round(K.run.p.y),w:document.documentElement.scrollWidth};},[map,moves]);
await p.waitForTimeout(300);await p.screenshot({path:out});console.log(JSON.stringify(info),errs);await b.close();})();
