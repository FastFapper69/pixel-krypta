// Co-op end-to-end test: two pages, mock Supabase (BroadcastChannel), real WebRTC.
// Serve the repo root: python3 -m http.server 8765  →  node tests/coop-test.js [nortc]
const {chromium}=require('playwright');
const noRtc=process.argv[2]==='nortc';
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
await ctx.addInitScript({path:__dirname+'/supabase-mock.js'});
await ctx.route('**/vendor/supabase-*.js',r=>r.fulfill({body:'',contentType:'text/javascript'})); // 11j: vlastní Supabase hry by přepsal mock
const H=await ctx.newPage(),G=await ctx.newPage();for(const p of [H,G]){p.errs=[];p.on('pageerror',e=>p.errs.push(e.message+' '+(e.stack||'').split('\n')[1]));}
if(noRtc){await G.addInitScript(()=>{delete window.RTCPeerConnection;window.__lat=60;window.__loss=.05;});await H.addInitScript(()=>{window.__lat=60;window.__loss=.05;});}
await H.goto('http://127.0.0.1:8765/index.html');await H.waitForTimeout(500);
await H.click('#mCoop');await H.click('#coHost');await H.waitForFunction(()=>window.__krypta.NET.code&&window.__krypta.NET.ch);
const code=await H.evaluate(()=>window.__krypta.NET.code);
await G.goto('http://127.0.0.1:8765/index.html');await G.waitForTimeout(500);
// manual join through the form this time
await G.click('#mCoop');await G.fill('#coCode',code.toLowerCase());await G.click('#coJoin');
const t0=Date.now();await G.waitForFunction(()=>window.__krypta.NET.open,null,{timeout:20000});
console.log('spojeno za',Date.now()-t0,'ms, režim',await G.evaluate(()=>window.__krypta.NET.mode));
await H.waitForTimeout(800);
// host picks the mines (cheat unlock) to test carts too
await H.evaluate(()=>{const K=window.__krypta;K.save.cheat=true;});
await H.evaluate(()=>{window.__krypta.LO.map='doly';});await H.click('#coGo');
await G.waitForFunction(()=>window.__krypta.state==='play'&&window.__krypta.run&&window.__krypta.run.coop,null,{timeout:8000});
await H.evaluate(()=>{window.__krypta.god=true;});
const R=async(p,f)=>p.evaluate(f);
// 1) guest builds a tower (costs shared gold)
await G.evaluate(()=>window.__krypta.buildTower('arrow'));await H.waitForTimeout(400);
console.log('věž postavená kamarádem: host věží',await R(H,()=>window.__krypta.run.towers.length),'zlato',await R(H,()=>window.__krypta.run.coins),'| guest vidí věží',await R(G,()=>window.__krypta.run.towers.length));
// 2) guest pauses -> both pause, guest resumes -> both play
await G.dispatchEvent('#btnPause','pointerdown');await H.waitForTimeout(400);
console.log('pauza: host',await R(H,()=>window.__krypta.state),'guest',await R(G,()=>window.__krypta.state));
await G.click('#pResume');await H.waitForTimeout(400);
console.log('po pauze: host',await R(H,()=>window.__krypta.state),'guest',await R(G,()=>window.__krypta.state));
// 3) prepare a fusion for the GUEST (mage-less knight: blade+aura) and trigger a level-up
await H.evaluate(()=>{const K=window.__krypta,R=K.run,m=R.pls[1];m.W.blade.lv=5;m.W.aura={lv:5,cd:.4,ang:0,tick:0};m.fuseMiss=2;R.pending=1;});
await G.waitForFunction(()=>window.__krypta.state==='levelup',null,{timeout:5000});
const cards=await G.$$eval('#luList .k-card',els=>els.map(e=>e.className+':'+e.querySelector('h3').innerText));console.log('karty kamaráda',cards);
// host picks a normal card -> waits for the guest
await H.waitForFunction(()=>window.__krypta.state==='levelup');await H.evaluate(()=>{const c=document.querySelector('#luList .k-card:not(.fuse)');c.click();});
await H.waitForTimeout(200);console.log('host po výběru:',await R(H,()=>window.__krypta.state),await H.textContent('#waitTxt'));
await G.click('#luList .k-card.fuse');
const res=await G.evaluate(()=>new Promise(r=>{const K=window.__krypta;const loop=()=>{const F=K.FZ;if(!F){r('no FZ');return;}const b=K.audioBeat(),i=F.res.findIndex(x=>x===null);
  if(i>=0&&b>=F.targets[i])K.fuseTap();if(F.done){r(F.res.join(''));return;}requestAnimationFrame(loop);};requestAnimationFrame(loop);}));
console.log('rituál kamaráda',res);
await H.waitForFunction(()=>window.__krypta.state==='play',null,{timeout:6000});await G.waitForFunction(()=>window.__krypta.state==='play',null,{timeout:6000});
console.log('po fúzi: host vidí zbraně partnera',await R(H,()=>JSON.stringify(Object.fromEntries(Object.entries(window.__krypta.run.pls[1].W).map(([k,v])=>[k,[v.lv,v.mul]])))),
  '| guest HUD',await G.$$eval('#items .it',els=>els.map(e=>e.className+':'+e.innerText).join(' ')));
await H.waitForTimeout(3000);await G.screenshot({path:'net3_g.png'});await H.screenshot({path:'net3_h.png'});
// 4) end: host dies with god off and the guest down -> both see the end screen
await H.evaluate(()=>{const K=window.__krypta,R=K.run;K.god=false;for(const q of K.players()){q.hp=1;q.inv=0;}R.revived=true;R.pls[1].revived=true;
  for(const q of K.players())R.eshots.push({x:q.x,y:q.y,vx:0,vy:0,dmg:99,r:3,life:1});});
await H.waitForTimeout(2500);
console.log('konec: host',await R(H,()=>window.__krypta.state),await H.textContent('#ovTitle'),'| guest',await R(G,()=>window.__krypta.state),await G.textContent('#ovTitle'),await G.textContent('#ovSub'));
console.log('mince host',await R(H,()=>window.__krypta.save.coins),'guest',await R(G,()=>window.__krypta.save.coins),'| žebříček sólo nezměněn (best):',await R(H,()=>JSON.stringify(window.__krypta.save.best)));
console.log('chyby host',H.errs.slice(0,5),'guest',G.errs.slice(0,5));
await b.close();})();
