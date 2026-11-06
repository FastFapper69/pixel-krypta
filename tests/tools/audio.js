const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
await p.tap('#mPlay');await p.waitForTimeout(200);await p.evaluate(()=>window.__krypta.startRun('knight','hrbitov'));await p.waitForTimeout(500);
const st=()=>p.evaluate(()=>({state:window.__krypta.ac.state,t:+window.__krypta.ac.currentTime.toFixed(2)}));
console.log('1) hraje:',JSON.stringify(await st()));
// lock: the OS stops the context; count notes queued meanwhile
await p.evaluate(()=>{const K=window.__krypta;window.__osc=0;const a=K.ac,o=a.createOscillator.bind(a);a.createOscillator=()=>{window.__osc++;return o();};return a.suspend();});
await p.waitForTimeout(1500);console.log('2) zamčeno 1,5 s:',JSON.stringify(await st()),'| naplánovaných not během zámku:',await p.evaluate(()=>window.__osc));
await p.tap('#stage',{position:{x:200,y:400}});await p.waitForTimeout(300);
console.log('3) po ťuknutí:',JSON.stringify(await st()));
// stuck context: resume does nothing (the iOS bug) -> watchdog flags it, next tap rebuilds
const old=await p.evaluate(()=>{const a=window.__krypta.ac;window.__old=a;a.resume=()=>Promise.resolve();return a.suspend().then(()=>a.state);});
console.log('4) zaseklý zvuk:',old);
await p.tap('#stage',{position:{x:200,y:400}});await p.waitForTimeout(1100);
await p.tap('#stage',{position:{x:200,y:400}});await p.waitForTimeout(400);
console.log('5) po dalším ťuknutí:',JSON.stringify(await st()),'| nový zvukový kontext:',await p.evaluate(()=>window.__krypta.ac!==window.__old));
await p.waitForTimeout(600);console.log('6) čas zvuku běží:',JSON.stringify(await st()),errs);
await b.close();})();
