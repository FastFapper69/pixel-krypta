// iPhone aplikace z plochy: tah od levého okraje vrátí zpět jen herním gestem, pod obrazovkou je vidět menu (ne holá mapa). [snímek.png] node edgeback.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
 await c.addInitScript(()=>{Object.defineProperty(navigator,'standalone',{get:()=>true});});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();openMenu();openHero()");await p.waitForTimeout(400);
 const cd=await c.newCDPSession(p);await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:8,y:400}]});
 for(let k=1;k<=10;k++){await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:8+20*k,y:402}]});await p.waitForTimeout(16);}
 const mid=await p.evaluate(()=>{const v=[...document.querySelectorAll('.scr')].filter(s=>!s.hidden);return v.map(s=>s.id+':'+s.style.transform);});if(process.argv[2])await p.screenshot({path:process.argv[2]});
 await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(500);
 const st=await E('state');console.log('během tahu viditelné obrazovky:',mid.join(' '),'| po tahu:',st,'| chyby',errs);
 await b.close();process.exit(st==='menu'&&mid.length===2&&mid.some(m=>m.startsWith('scr-menu'))&&!errs.length?0:1);})();
