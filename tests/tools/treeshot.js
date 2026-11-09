// Strom Vylepšení s částečně koupenými uzly (spojnice mezi uzly). node treeshot.js prefix [scroll 0..1]
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.coins=9000;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;metaInit();TREE.forEach((T,i)=>{T.stats.slice(0,i+1).forEach(id=>save.meta[id]=3);});persist();openMenu();renderShop();setState('shop')");
 await p.waitForTimeout(700);await p.screenshot({path:pre+'_a.png'});
 await p.evaluate(()=>{const e=document.getElementById('scr-shop');e.scrollTop=e.scrollHeight;});await p.waitForTimeout(300);await p.screenshot({path:pre+'_b.png'});await b.close();})();
