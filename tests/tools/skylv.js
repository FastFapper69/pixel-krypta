// Souhvězdí 09x: úrovně hvězd (zjasnění po dokončení souhvězdí), ceny, bonusy ×úroveň, vrácení bodů, výraznější hvězdy (snímky). node skylv.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'CHYBA ')+m);if(!c)bad++;};
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:40};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;"+
   "for(const C of CHAPTERS)for(const m of C.maps)save.cleared[m]=true;save.nmw={};for(const C of CHAPTERS)for(const m of C.maps)for(let k=1;k<=3;k++)save.nmw[m+'|'+k]=1;skyInit();persist();");
 const earned=await E('skyEarned()');console.log('body k dispozici',earned,'| všech 5 souhvězdí na 1. úrovni = 80, vše na maximum =',await E('SKY.reduce((a,C)=>a+[0,1,2,3,4,5,6].reduce((b,i)=>b+SKY_COST[i]*3+6,0),0)'));
 // draw war fully (rank 1)
 await E("openMenu();openSky();skyCon='war';for(const i of [0,1,2,3,4,5,6])skyBuy('war',i)");
 ok(await E("skyFull('war')"),'Válečník dokončen');ok(await E("!skyCanUp('guard',0)"),'Strážce nejde zjasnit, dokud není dokončený');
 const c1=await E("skyNextCost('war',6)");ok(c1===6,'zjasnění hvězdy 7 na 2. úroveň stojí '+c1+' (4+2)');
 const before=await E("(()=>{const B={lg:{}};skyApply(B);return B.dmg||0})()");
 const sp0=await E('skySpent()');await E("skySel=6;skyUp('war',6)");const sp1=await E('skySpent()');
 const after=await E("(()=>{const B={lg:{}};skyApply(B);return B.dmg||0})()");
 ok(sp1-sp0===6,'utraceno o '+(sp1-sp0)+' ✦ víc');ok(Math.abs(after-before-.04)<1e-9,'poškození '+(before*100).toFixed(0)+' % → '+(after*100).toFixed(0)+' %');
 await E("skyUp('war',6)");ok(await E("skyLv('war',6)")===3,'3. úroveň');await E("skyUp('war',6)");ok(await E("skyLv('war',6)")===3,'víc než 3 nejde');
 await E("skyUp('war',0)");await E("skySel=0;renderSky()");await p.waitForTimeout(500);if(pre)await p.screenshot({path:pre+'_war.png'});
 // guard partly drawn – look of open / affordable / locked stars
 await p.waitForTimeout(1100);await E("$('#skyPop').hidden=true;skyBuy('guard',0);skyCon='guard';skySel=1;renderSky()");await p.waitForTimeout(500);if(pre)await p.screenshot({path:pre+'_guard.png'});
 // respec returns everything incl. levels
 await E("save.sky.rw='';skyRespec()");await p.waitForTimeout(200);await p.click('#skyR');await p.waitForTimeout(200);
 ok(await E('skySpent()')===0&&await E("skyLv('war',6)")===0,'Vrátit body vrátí i úrovně');
 // save round trip
 await E("skyBuy('war',0);persist()");const lsB=await p.evaluate(()=>JSON.parse(localStorage.getItem('pixel-krypta-v1')).sky.lit.war);const ptsB=await E('skyPts()+\'/\'+skyEarned()');
 await p.reload();await p.waitForTimeout(500);const lv=await E("skyLv('war',0)");ok(lv===1,'po restartu zůstane'+(lv===1?'':' (uloženo před restartem: '+lsB+', body '+ptsB+', po: '+await p.evaluate(()=>JSON.parse(localStorage.getItem('pixel-krypta-v1')).sky.lit.war)+')'));
 console.log('chyby',errs);await b.close();process.exit(bad||errs.length?1:0);})();
