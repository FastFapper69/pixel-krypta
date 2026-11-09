// Nastavení: posuvníky hlasitosti a otřesů (09r) – ukládají se, mění sběrnice, otřes je plynulý a slábne s posuvníkem. node vols.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:5};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();openMenu();setSheet(true)");await p.waitForTimeout(500);
 await p.evaluate(()=>{const s=document.getElementById('vMus');s.value=40;s.dispatchEvent(new Event('input'));s.dispatchEvent(new Event('change'));const k=document.getElementById('vShk');k.value=50;k.dispatchEvent(new Event('input'));k.dispatchEvent(new Event('change'));});
 await p.waitForTimeout(300);if(pre)await p.screenshot({path:pre+'_set.png'});
 const r=await E("JSON.stringify({vol:save.vol,shk:save.shk,bm:busVol('m'),bs:busVol('s')})");console.log('nastavení',r);
 await p.reload();await p.waitForTimeout(500);console.log('po restartu',await E("JSON.stringify({vol:save.vol,shk:save.shk})"));
 // shake: smooth (small frame-to-frame change), scales with slider, 0 = none
 const sh=await E("(()=>{run={shake:9};const xs=[];const t0=performance.now();for(let i=0;i<5;i++){xs.push(shakeOff().x);}save.shk=0;const z=shakeOff();save.shk=1;run.shake=3;const small=Math.abs(shakeOff().x)+Math.abs(shakeOff().y);run.shake=9;const big=[0,1,2].map(()=>Math.hypot(shakeOff().x,shakeOff().y));run=null;return JSON.stringify({zero:z,small:+small.toFixed(2),big:big.map(v=>+v.toFixed(1))});})()");
 console.log('otřes',sh);console.log('chyby',errs);await b.close();})();
