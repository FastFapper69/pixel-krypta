// Přejetí prstem mezi záložkami (09s) a žádné záznamy historie v iPhone aplikaci z plochy. node tabswipe.js
const {chromium}=require('playwright');
async function swipe(p,x0,x1,y){const c=await p.context().newCDPSession(p);
  await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y}]});
  for(let k=1;k<=8;k++){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*k/8,y}]});await p.waitForTimeout(16);}
  await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(450);}
(async()=>{const b=await chromium.launch();let bad=0;
 for(const sa of [false,true]){const c=await b.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
  if(sa)await c.addInitScript(()=>{Object.defineProperty(navigator,'standalone',{get:()=>true});});
  const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
  const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
  await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();openMenu()");
  const h0=await p.evaluate(()=>history.length);await E("openForge()");await p.waitForTimeout(400);const h1=await p.evaluate(()=>history.length);
  if(!sa){
   await swipe(p,300,120,420);const a=await E('state');await swipe(p,120,320,420);const c2=await E('state');
   await E("openHero()");await p.waitForTimeout(300);await swipe(p,300,100,600);const d=await E('state');await swipe(p,300,100,600);const e=await E('state');await swipe(p,300,100,600);const f=await E('state');
   // vertical scroll must not switch
   await E("openForge()");await p.waitForTimeout(300);await swipe(p,200,215,500);const g=await E('state');
   console.log('Kovárna ← :',a,'| → :',c2,'| Vybavení ←←← :',d,e,f,'| skoro svisle:',g);
   if(a!=='shop'||c2!=='forge'||d!=='towers'||e!=='pets'||f!=='pets'||g!=='forge')bad++;
   console.log('prohlížeč: záznam historie přidán',h1>h0);if(!(h1>h0))bad++;}
  else{console.log('iPhone aplikace z plochy: záznam historie přidán',h1>h0);if(h1>h0)bad++;}
  if(errs.length){console.log('chyby',errs);bad++;}await c.close();}
 await b.close();console.log(bad?'CHYBA '+bad:'ok');process.exit(bad?1:0);})();
