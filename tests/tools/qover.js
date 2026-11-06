const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;const Q=K.qEnsure();
  Q.q[0]={id:'kills',d:0,seq:0,v:250,done:0,cl:0,p:{},n:300,ico:'skull',t:'Krveprolití',x:'Zabij celkem 300 nepřátel',mat:'bone'};
  Q.q[1]={id:'combo',d:1,seq:0,v:0,done:0,cl:0,p:{},n:45,ico:'music',t:'V rytmu',x:'Dosáhni komba 45',mat:'bone'};
  K.startRun('knight','hrbitov');for(let i=0;i<60*40;i++)K.step(1/60);
  const pin=document.querySelector('#qPin').textContent;K.run.t=K.run.map.dur+1;let n=0;while(!K.run.boss&&n<400){K.step(1/60);n++;}if(K.run.boss)K.run.boss.hp=1;n=0;while(!K.run.over&&n<1200){K.step(1/60);n++;}
  return {pin,kills:K.run.kills,q:Q.q.map(q=>q.v+'/'+q.n)};});
console.log(JSON.stringify(r));await p.waitForTimeout(1300);await p.screenshot({path:'q_over.png'});
await p.evaluate(()=>window.__krypta.openMenu());await p.waitForTimeout(300);await p.screenshot({path:'q_menu.png'});
console.log(errs);await b.close();})();
