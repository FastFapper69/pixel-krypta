// 11j návrat po odpojení: dvě stránky, mock Supabase (BroadcastChannel), skutečné WebRTC.
// 1) kamarádovi vypadne spojení (stránka žije) → oba se do 30 s znovu spojí, kamarád má svého hrdinu i zbraně
// 2) kamarád zavře stránku a připojí se znovu kódem → stejné
// 3) kamarád se nevrátí → hostitel po limitu hraje sám
// Spusť server v kořeni repa: python3 -m http.server 8765  →  node tests/coop-navrat.js
const {chromium}=require('playwright');let bad=0;const ok=(c,m)=>{console.log((c?'OK   ':'CHYBA ')+m);if(!c)bad++;};
(async()=>{const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 await ctx.addInitScript({path:__dirname+'/supabase-mock.js'});
 // the game ships its own Supabase build (vendor/) – swap it for nothing so the mock stays in window.supabase
 await ctx.route('**/vendor/supabase-*.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));await ctx.addInitScript(()=>{try{localStorage.setItem('pixel-krypta-lang','cs');}catch(e){}});
 const H=await ctx.newPage();let G=await ctx.newPage();const errs=[];for(const p of [H,G])p.on('pageerror',e=>errs.push(e.message));
 const X=(p,s)=>p.evaluate(s=>window.__krypta._ev(s),s);
 await H.goto('http://127.0.0.1:8765/index.html');await H.waitForTimeout(600);
 await X(H,"coHostStart()");await H.waitForFunction(()=>window.__krypta.NET.code&&window.__krypta.NET.ch);
 const code=await H.evaluate(()=>window.__krypta.NET.code);
 const join=async p=>{await p.goto('http://127.0.0.1:8765/index.html');await p.waitForTimeout(600);await X(p,"openCoop('"+code+"')");
   await p.waitForFunction(()=>window.__krypta.NET.open,null,{timeout:20000});};
 await join(G);await H.waitForTimeout(800);await X(H,"coHostGo()");
 await G.waitForFunction(()=>window.__krypta.state==='play'&&window.__krypta.run&&window.__krypta.run.coop,null,{timeout:8000});
 await H.evaluate(()=>{window.__krypta.god=true;});await X(H,"save.sound=false;save.music=false;run.pls[1].W.bolt={lv:4,cd:.4,ang:0,tick:0}");await H.waitForTimeout(1500);
 const gw0=await G.evaluate(()=>JSON.stringify(Object.keys(window.__krypta.run.W)));
 // 1) connection drops, page alive
 let t0=Date.now();await X(G,"netLost()");
 await H.waitForFunction(()=>window.__krypta.run&&window.__krypta.run.away,null,{timeout:12000});ok(true,'hostitel čeká na kamaráda (za '+(Date.now()-t0)+' ms)');
 await H.waitForFunction(()=>window.__krypta.run&&window.__krypta.run.pls&&!window.__krypta.run.away,null,{timeout:30000});
 await G.waitForFunction(()=>window.__krypta.run&&!window.__krypta.run.reconn&&window.__krypta.state==='play',null,{timeout:10000});
 await H.waitForTimeout(1500);const gw1=await G.evaluate(()=>JSON.stringify(Object.keys(window.__krypta.run.W)));
 ok(gw1===gw0&&gw1.includes('bolt'),'1) po výpadku zpátky za '+((Date.now()-t0)/1000).toFixed(1)+' s, zbraně kamaráda '+gw1);
 // 2) page closed, rejoin with the code
 t0=Date.now();await G.close();G=await ctx.newPage();G.on('pageerror',e=>errs.push(e.message));
 await H.waitForFunction(()=>window.__krypta.run&&window.__krypta.run.away,null,{timeout:15000});
 await join(G);await G.waitForFunction(()=>window.__krypta.state==='play'&&window.__krypta.run&&window.__krypta.run.coop,null,{timeout:10000});
 await H.waitForTimeout(1500);const gw2=await G.evaluate(()=>JSON.stringify(Object.keys(window.__krypta.run.W)));
 ok(gw2.includes('bolt'),'2) po zavření stránky zpátky přes kód za '+((Date.now()-t0)/1000).toFixed(1)+' s, zbraně '+gw2);
 ok(await H.evaluate(()=>window.__krypta.run.pls.length===2),'hostitel má zase dva hrdiny');
 // 3) friend never comes back (limit shortened)
 await G.close();await H.waitForFunction(()=>window.__krypta.run&&window.__krypta.run.away,null,{timeout:15000});await X(H,"run.away.t=.5");
 await H.waitForFunction(()=>window.__krypta.run&&!window.__krypta.run.away,null,{timeout:5000});
 {const r=await H.evaluate(()=>({pls:!!window.__krypta.run.pls,st:window.__krypta.state,over:window.__krypta.run.over}));ok(!r.pls&&['play','pause'].includes(r.st)&&!r.over,'3) bez návratu hraje hostitel dál sám '+JSON.stringify(r));}
 ok(!errs.length,'chyby JS: '+JSON.stringify(errs.slice(0,4)));await b.close();process.exit(bad?1:0);})();
