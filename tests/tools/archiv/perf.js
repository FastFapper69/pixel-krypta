const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
console.log(JSON.stringify(await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;
 let t=performance.now();K.startRun('archer','poust');const build=performance.now()-t;const R=K.run,o=R.built.oases[0];
 R.p.x=o.x;R.p.y=o.y;R.p.hp=50;K.god=true;for(let i=0;i<120;i++){R.enemies.length=0;K.step(1/60);}const healed=R.p.hp-50;
 R.p.x=480;R.p.y=520;K.god=false;let rt=0,n=0;
 for(let i=0;i<60*40;i++){K.force={x:Math.cos(i/90),y:Math.sin(i/70)};K.step(1/60);if(i%10===0){const a=performance.now();window.__render&&0;rt+=0;}}
 return {build:Math.round(build),props:R.built.props.length,lights:R.built.lights.length,healed,enemies:R.enemies.length,crystal:R.crystal.hp,hp:R.p.hp,state:K.state,w:document.documentElement.scrollWidth};})));
// real frame timing over 3s of rAF
const fps=await p.evaluate(()=>new Promise(r=>{let n=0,t0=performance.now();const f=()=>{n++;if(performance.now()-t0<3000)requestAnimationFrame(f);else r(n/3);};requestAnimationFrame(f);}));
console.log('fps',Math.round(fps),errs);await p.screenshot({path:'fight.png'});await b.close();})();
