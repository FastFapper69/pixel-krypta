// Souhvězdí: tlačítko Vrátit body a okno potvrzení. node skyrs.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();save.feat.sky=1;save.featSum=0;save.mats.ess=40;for(const C of CHAPTERS.slice(0,6))for(const m of C.maps){save.cleared[m]=true;}save.fin={};save.nmw={};for(const C of CHAPTERS.slice(0,3))for(const m of C.maps)save.nmw[m+'|1']=1;skyInit();save.sky.lit={war:7,guard:3};persist();openMenu();openSky()");
 await p.waitForTimeout(600);await p.screenshot({path:pre+'_a.png'});await p.click('#skyRs');await p.waitForTimeout(400);await p.screenshot({path:pre+'_b.png'});await b.close();})();
