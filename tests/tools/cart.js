const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.startRun('knight','doly');const R=K.run;
 for(let i=0;i<5;i++)K.step(1/60);const c=R.carts[0];R.p.x=c.x+30;R.p.y=c.y+20;
 // spawn a crowd on the track ahead of cart 0 and let it run
 const before=R.kills;for(let i=0;i<40;i++)K.step(1/60);
 return {kills:R.kills-before,carts:R.carts.map(c=>[c.x|0,c.y|0]),len:Math.round(R.built.rails.len),pools:R.built.pools.length,props:R.built.props.length};});
console.log(JSON.stringify(r));await p.waitForTimeout(200);await p.screenshot({path:'cart.png'});
// player hit test
const h=await p.evaluate(()=>{const K=window.__krypta;K.god=false;const R=K.run;R.p.inv=0;R.p.hp=100;const c=R.carts[1];R.p.x=c.x;R.p.y=c.y;K.step(1/60);return R.p.hp;});
console.log('hp after cart',h,errs);await b.close();})();
