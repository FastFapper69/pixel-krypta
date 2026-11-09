// nové fúze (08k): nabídka fúze z rodičů a snímky v boji: node fuse4.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
for(const [u,a,bb] of [['thunder','axe','lightning'],['frostblade','blade','frost'],['arcane','bolt','arrows'],['flamering','aura','fireball']]){
  const r=await p.evaluate(([u,a,bb])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight','kostnice');const R=K.run;
    R.W={};R.W[a]={lv:5,cd:.4,ang:0,tick:0};R.W[bb]={lv:5,cd:.4,ang:0,tick:0};const f=K.fusable().map(x=>x.id);
    R.W={};R.W[u]={lv:3,cd:.4,ang:0,tick:0,mul:1};R.t=120;for(let i=0;i<60*12;i++){K.step(1/60);if(K.state==='levelup'){K.applyOption(K.levelOptions()[0]);}}
    return{offer:f,kills:R.kills};},[u,a,bb]);
  await p.waitForTimeout(150);await p.screenshot({path:pre+'_'+u+'.png'});console.log(u,JSON.stringify(r));}
console.log('errors',errs.slice(0,4));await b.close();})();
