// Souhvězdí (09m): body jen za výkony, rozsvěcení hvězd, bonusy v heroBonus, dokončené souhvězdí, zhasnutí, tlačítko v menu.
// node sky.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2]||'sk',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:40,wins:30,kills:30000,best:{}};featInit();save.feat={};for(const F of FEATS)if(F.id!=='sky')save.feat[F.id]=1;"+
   "for(const C of CHAPTERS)for(const m of C.maps)save.cleared[m]=true;save.nmw={};for(const C of CHAPTERS.slice(0,3))for(const m of C.maps){save.nmw['1|'+m]=1;}save.mats.ess=30;persist();");
 console.log('before unlock: button hidden',await E("openMenu();$('#mSky').hidden"));
 await E("featCheck();save.featNew=[];featUi()");console.log('feat',await E("featOn('sky')"),'button hidden',await E("$('#mSky').hidden"));
 await p.waitForTimeout(300);await p.screenshot({path:`${pre}_menu.png`});
 console.log('points',await E("JSON.stringify({earned:skyEarned(),src:skySrc().map(s=>s.n+'x'+s.per)})"));
 await E("openSky()");await p.waitForTimeout(600);await p.screenshot({path:`${pre}_0.png`});
 const hb0=await E("JSON.stringify((B=>({dmg:B.dmg,crit:B.crit,lg:B.lg.skyW||0}))(heroBonus('knight')))");
 for(let i=0;i<7;i++){await E("skySel="+i+";renderSky()");const bb=await p.$('#skyBuy');if(bb&&!(await bb.isDisabled()))await bb.click();await p.waitForTimeout(250);}
 await p.waitForTimeout(1300);await p.screenshot({path:`${pre}_full.png`});
 console.log('war lit',await E("save.sky.lit.war"),'pts left',await E("skyPts()"),'bonus before',hb0,'after',await E("JSON.stringify((B=>({dmg:B.dmg,crit:B.crit,lg:B.lg.skyW||0}))(heroBonus('knight')))"));
 await E("$('#skyPop').hidden=true;skyCon='build';skySel=0;renderSky()");await p.waitForTimeout(100);
 // tap on star 0 of Stavitel via canvas
 const box=await (await p.$('#skyCv')).boundingBox();const [sx,sy]=await p.evaluate(()=>window.__krypta._ev("skyXY(SKY_OF.build,2)"));
 await p.mouse.click(box.x+sx/128*box.width,box.y+sy/128*box.height);console.log('tap select',await E("skySel"));
 await E("skySel=0;renderSky()");await (await p.$('#skyBuy')).click();await p.waitForTimeout(250);await E("skySel=2;renderSky()");await p.waitForTimeout(700);await p.screenshot({path:`${pre}_build.png`,fullPage:true});
 await (await p.$('#skyRs')).click();await p.waitForTimeout(300);await p.screenshot({path:`${pre}_respec.png`});await (await p.$('#skyR')).click();
 console.log('after respec',await E("JSON.stringify(save.sky)"),'pts',await E("skyPts()"));
 console.log('errors',errs.slice(0,5));await b.close();})();
