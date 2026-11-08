// po výhře a Pokračovat nesmí zůstat obrazovka výhry na pozadí: node winbg.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.startRun('knight','hrbitov');for(let i=0;i<120;i++)K.step(1/60);K.finish(true);});
await p.waitForTimeout(1500);await p.screenshot({path:pre+'_1win.png'});
await p.evaluate(()=>document.querySelector('#ovAgain').click());await p.waitForTimeout(1200);await p.screenshot({path:pre+'_2next.png'});
const st=await p.evaluate(()=>({state:window.__krypta.state,vis:[...document.querySelectorAll('.scr,.overlay,#ov,[id^=ov]')].filter(e=>getComputedStyle(e).display!=='none'&&e.offsetHeight>0).map(e=>e.id||e.className).slice(0,12)}));
await p.evaluate(()=>{const b=document.querySelector('#scr-select .head button')||document.querySelector('#selBack');b&&b.click();});await p.waitForTimeout(1200);await p.screenshot({path:pre+'_3menu.png'});
console.log(JSON.stringify(st),errs);await b.close();})();
