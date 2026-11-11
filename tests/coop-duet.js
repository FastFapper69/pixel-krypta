// 11j přes síť: Duetní fúze (oba vyberou kartu, každý ťuká svou půlku) a společné shrnutí u kamaráda.
// python3 -m http.server 8765 v kořeni repa → node tests/coop-duet.js [složka]
const {chromium}=require('playwright');let bad=0;const ok=(c,m)=>{console.log((c?'OK   ':'CHYBA ')+m);if(!c)bad++;};const dir=process.argv[2]||'/tmp';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await ctx.addInitScript({path:__dirname+'/supabase-mock.js'});await ctx.route('**/vendor/supabase-*.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await ctx.addInitScript(()=>{try{localStorage.setItem('pixel-krypta-lang','cs');}catch(e){}});
 const H=await ctx.newPage(),G=await ctx.newPage(),errs=[];for(const p of [H,G])p.on('pageerror',e=>errs.push(e.message));const X=(p,s)=>p.evaluate(s=>window.__krypta._ev(s),s);
 await H.goto('http://127.0.0.1:8765/index.html');await H.waitForTimeout(600);await X(H,"coHostStart()");await H.waitForFunction(()=>window.__krypta.NET.ch&&window.__krypta.NET.code);
 const code=await X(H,"NET.code");await G.goto('http://127.0.0.1:8765/index.html');await G.waitForTimeout(600);await X(G,"openCoop('"+code+"')");
 await G.waitForFunction(()=>window.__krypta.NET.open,null,{timeout:20000});await H.waitForTimeout(800);await X(H,"coHostGo()");
 await G.waitForFunction(()=>window.__krypta.state==='play'&&window.__krypta.run&&window.__krypta.run.coop,null,{timeout:8000});await H.evaluate(()=>{window.__krypta.god=true;});
 const F=await X(H,"(()=>{const F=FUSIONS.find(f=>!WEAPONS[f.id].secret);run.W={};run.W[F.a]={lv:5,cd:0,ang:0,tick:0};const g=run.pls[1];g.W={};g.W[F.b]={lv:5,cd:0,ang:0,tick:0};run.duetMiss=2;run.pending=1;return F;})()");
 await H.waitForFunction(()=>window.__krypta.state==='levelup',null,{timeout:6000});await G.waitForFunction(()=>window.__krypta.state==='levelup',null,{timeout:6000});
 const gc=await G.$$eval('#luList .k-card',e=>e.map(x=>x.querySelector('h3').textContent));ok(gc[0]===await X(H,"WEAPONS['"+F.id+"'].name"),'kamarád má duet jako první kartu: '+gc[0]);
 await G.screenshot({path:dir+'/coopnet_duet_karta.png'});
 console.log('host karty',await H.$$eval('#luList .k-card',e=>e.map(x=>x.querySelector('h3').textContent)),await X(H,'state'),await X(H,'!!run.duet'));await X(H,"document.querySelector('#luList .k-card').click()");console.log('host po kliku',await X(H,'state'),await X(H,'!!FZ'));await X(G,"document.querySelector('#luList .k-card').click()");await G.waitForTimeout(300);
 ok(await X(G,"FZ&&FZ.only&&FZ.only.join()")==='1,3','kamarád ťuká doby 2 a 4');
 await X(H,"FZ.res=['p','x','g','x'];finishFuse()");await X(G,"FZ.res=['x','p','x','p'];finishFuse()");
 await H.waitForFunction(()=>window.__krypta.state==='play',null,{timeout:8000});await H.waitForTimeout(1200);
 const w=await X(H,"({h:Object.keys(run.W),g:Object.keys(run.pls[1].W),m:run.W['"+F.id+"']&&run.W['"+F.id+"'].mul})");ok(w.h.includes(F.id)&&w.g.includes(F.id),'ultimátku mají oba, síla ×'+w.m);
 ok(await G.evaluate(()=>window.__krypta.state)==='play','kamarád hraje dál');
 await X(H,"coSt().k=[50,70];coSt().r=[1,0];finish(true)");await G.waitForFunction(()=>window.__krypta.state==='over'||document.querySelector('#scr-over:not([hidden])'),null,{timeout:8000});await G.waitForTimeout(2500);
 const rows=await G.$$eval('#ovTable tr',e=>e.map(r=>r.textContent));const i=rows.findIndex(r=>r.trim().startsWith('Ty'));ok(i>=0&&/70/.test(rows[i]),'u kamaráda je „Ty“ s jeho 70 zabitími: '+rows[i]);
 await G.screenshot({path:dir+'/coopnet_konec_kamarad.png'});ok(!errs.length,'chyby JS: '+JSON.stringify(errs.slice(0,4)));await b.close();process.exit(bad?1:0);})();
