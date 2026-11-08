// shotB.js: screenshots of the economy 2.0 screens (chests with limits, item with reforge, reforge popup, Příprava with ∞, Kovárna upgrades, endless result)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2,locale:'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);const shot=async n=>{await p.waitForTimeout(450);await p.screenshot({path:'/tmp/b-'+n+'.png'});};
await E("save.sound=false;save.music=false;save.coins=8000;save.mats.shard=1088;save.mats.ess=85;for(const C of CHAPTERS.slice(0,2))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1,brana:1};save.inv=[];const it=makeItem(2,'ring',.6);it.lv=5;addItem(it);save.eq={knight:{ring:it.u}};persist();");
await E("openChestShop()");await p.evaluate(()=>{const e=document.querySelector('#scr-chests .wrap')||document.scrollingElement;});await shot('chests');
await E("openHero();openItem(save.inv[0].u)");await shot('item');
await E("$('#itemPop').hidden=true;openReforge('item',save.inv[0],null);document.querySelector('#newsPop [data-k]').click()");await shot('reforge');
await E("$('#newsPop').hidden=true;sel.map='hrbitov';sel.endless=true;chSel=0;renderSelect();setState('select')");await p.evaluate(()=>{for(const e of document.querySelectorAll('.scr:not([hidden]) *'))if(e.scrollHeight>e.clientHeight+20&&getComputedStyle(e).overflowY!=='visible')e.scrollTop=330;});await shot('select');
await E("save.meta.dmg=19;save.meta.hp=20;setState('shop');renderShop()");await shot('shop');
await E("window.__krypta.god=true;startRun('knight','hrbitov',{endless:true});run.t=12*60+31;run.coins=500;finish(false)");await p.waitForTimeout(3500);await shot('over');
console.log(JSON.stringify(errs));await b.close();})();
