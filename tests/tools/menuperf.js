// menu smoothness: frame times (CPU throttled like a phone) while idling in the menu and opening/closing screens
// node menuperf.js [throttle=4]
const {chromium}=require('playwright');const thr=+(process.argv[2]||4);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:3,locale:'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('pixel-krypta-v1',JSON.stringify({coins:900,heroes:{knight:true},cleared:{hrbitov:true},stats:{runs:5},tut:1,newsSeen:'2026-11-07z',ch:1,unl:{}}));}catch(e){}});
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(1500);
const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
const measure=async(label,act,ms)=>{const r=await p.evaluate(([act,ms])=>new Promise(res=>{const T=[];let last=performance.now();const t0=last;
  const f=t=>{T.push(t-last);last=t;if(t-t0<ms)requestAnimationFrame(f);else{T.sort((a,b)=>a-b);res({n:T.length,fps:Math.round(T.length/(ms/1000)),p50:+T[T.length>>1].toFixed(1),p95:+T[Math.floor(T.length*.95)].toFixed(1),worst:+T[T.length-1].toFixed(1)});}};
  requestAnimationFrame(f);if(act)setTimeout(()=>{(new Function(act))();},30);}),[act,ms]);console.log(label.padEnd(16),JSON.stringify(r));};
await measure('menu idle',null,1500);
await measure('open settings',"document.querySelector('#mSet').click()",700);
await measure('close settings',"document.querySelector('#setClose').click()",700);
await measure('open play',"document.querySelector('#mPlay').click()",900);
await measure('select idle',null,1000);
await measure('back to menu',"document.querySelector('#scr-select [data-back]').click()",700);
await measure('open shop',"document.querySelector('#mChest').click()",700);
await measure('open hero',"document.querySelector('#scr-chests [data-back]').click();document.querySelector('#mHero').click()",700);
await measure('open news',"document.querySelector('#scr-hero [data-back]').click();document.querySelector('#mNews').click()",700);
console.log(errs.slice(0,3));await b.close();})();
