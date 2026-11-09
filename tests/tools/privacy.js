// 09y: Soukromí a licence – okno, smazání dat (offline: lokálně), filtr přezdívek, nahlášení a skrytí hráče v žebříčku, nic z cizích serverů. node privacy.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[],ext=[];p.on('pageerror',e=>errs.push(e.message));
 p.on('request',r=>{const u=r.url();if(/^https?:/.test(u))ext.push(u);});
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);let bad=0;const ok=(v,m)=>{console.log((v?'ok  ':'CHYBA ')+m);if(!v)bad++;};
 await E("save.tut=1;save.newsSeen=GAME_VER;save.coins=777;featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();openMenu();setSheet(true)");await p.waitForTimeout(400);
 ok(await p.evaluate(()=>!!document.getElementById('mPriv')&&document.getElementById('mPriv').offsetParent!==null),'tlačítko Soukromí a licence v Nastavení');
 await p.click('#mPriv');await p.waitForTimeout(400);ok(await p.evaluate(()=>!document.getElementById('newsPop').hidden&&!!document.querySelector('.priv-body h3')),'okno se zásadami');
 if(pre)await p.screenshot({path:pre+'_priv.png'});
 await p.evaluate(()=>{const e=document.querySelector('.priv-body');e.scrollTop=e.scrollHeight;});await p.waitForTimeout(200);if(pre)await p.screenshot({path:pre+'_priv2.png'});
 await p.click('#prDel');await p.waitForTimeout(300);if(pre)await p.screenshot({path:pre+'_del.png'});
 await p.click('#delYes');await p.waitForTimeout(1600);ok(await E('save.coins')===0,'offline smazání: postup od začátku (mince '+await E('save.coins')+')');
 // leaderboard: hidden by moderator and hidden by me
 await E("save.tut=1;save.newsSeen=GAME_VER;featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();ON.ready=true;ON.me={id:'me'};ON.sb={from:()=>({insert:async o=>{window.__rep=o;return{error:null}}})};onlineConfigured=()=>true;"+
   "boardTab='celkem';boardRows=[{id:'a',nick:'Alena',stats:{runs:5,wins:4,kills:900},save:{}},{id:'b',nick:'Bedřich',stats:{runs:5,wins:3,kills:800},save:{}},{id:'x',nick:'Schovaný',hidden:true,stats:{runs:5,wins:9,kills:999},save:{}},{id:'c',nick:'Cyril',stats:{runs:5,wins:2,kills:700},save:{}},{id:'d',nick:'Dana',stats:{runs:5,wins:1,kills:600},save:{}},{id:'me',nick:'Já',stats:{runs:5,wins:0,kills:10},save:{}}];setState('board');renderBoard()");
 await p.waitForTimeout(300);const names=await p.evaluate(()=>[...document.querySelectorAll('#scr-board strong')].map(s=>s.childNodes[0].textContent));
 ok(!names.includes('Schovaný'),'skrytý moderátorem není v žebříčku ('+names.join(', ')+')');
 await p.evaluate(()=>{const r=[...document.querySelectorAll('#boardList .brow')].find(e=>e.textContent.includes('Dana'));r.click();});await p.waitForTimeout(300);
 if(pre)await p.screenshot({path:pre+'_pm.png'});
 await p.click('#pmRep');await p.waitForTimeout(300);ok((await p.evaluate(()=>window.__rep&&window.__rep.target))==='d','nahlášení odešlo (cíl d)');
 await p.evaluate(()=>{const r=[...document.querySelectorAll('#boardList .brow')].find(e=>e.textContent.includes('Dana'));r.click();});await p.waitForTimeout(200);await p.click('#pmHide');await p.waitForTimeout(300);
 const n2=await p.evaluate(()=>[...document.querySelectorAll('#scr-board strong')].map(s=>s.childNodes[0].textContent));ok(!n2.includes('Dana'),'skrytý hráč zmizel');
 ok(await E("JSON.stringify(save.blk)")==='["d"]','skrytí uložené');
 ok(await E("nickBad('K.u.r.v.a')&&!nickBad('Picasso')"),'filtr přezdívek');
 ok(!ext.length,'žádné požadavky na cizí servery'+(ext.length?': '+ext.slice(0,3).join(' '):''));
 console.log('chyby',errs);await b.close();process.exit(bad||errs.length?1:0);})();
