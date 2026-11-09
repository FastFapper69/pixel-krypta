// Strom Vylepšení: předěl „Nové schopnosti“ (snímek s koupenými uzly). node treesep.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;metaInit();TREE.forEach((T,i)=>{T.stats.forEach(id=>save.meta[id]=6);});persist();openMenu();renderShop();setState('shop')");
 await p.waitForTimeout(500);await p.evaluate(()=>{const t=document.querySelector('#scr-shop .tsep');const sc=document.getElementById('scr-shop');sc.scrollTop=t.getBoundingClientRect().top+sc.scrollTop-330;});await p.waitForTimeout(300);
 const m=await p.evaluate(()=>[...document.querySelectorAll('#scr-shop .tsep')].map(t=>({w:t.offsetWidth,col:t.parentElement.offsetWidth,h:t.offsetHeight})));console.log(m);
 await p.screenshot({path:pre+'.png'});console.log('chyby',errs);await b.close();})();
