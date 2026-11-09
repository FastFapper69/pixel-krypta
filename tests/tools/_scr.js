// snímky obrazovek: node scr.js outprefix lang screens(comma)
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
const ALL={menu:"openMenu()",select:"openMenu();$('#mPlay').click()",hero:"openHero()",towers:"openTowers()",pets:"openPets()",chests:"openChestShop()",forge:"openForge()",shop:"renderShop();setState('shop')",quests:"openQuests()",master:"openMaster()",codex:"openCodex()",board:"openBoard&&openBoard()",guide:"openGuide()",sky:"openSky()",settings:"openMenu();$('#mSet').click()",coop:"openMenu();$('#mCoop').click()",confirm:"openMenu();$('#mPlay').click();confirmHero('mage')",feat:"openMenu();save.featNew=['gear'];featShow&&featShow()",news:"openMenu();openNews()"};
const want=(process.argv[4]||Object.keys(ALL).join(',')).split(',');
const MID="save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats=save.stats||{};save.stats.runs=30;for(const C of CHAPTERS.slice(0,4))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};for(let i=0;i<10;i++)addItem(makeItem(i%4));twInit();petInit();featCheck();featInit();save.feat.sky=1;save.featNew=[];save.featSum=0;save.tut=1;save.newsSeen=GAME_VER;save.sound=false;save.music=false;persist();";
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>{localStorage.setItem('pixel-krypta-lang',l);document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=':root{--sat:59px!important;--sab:34px!important}';document.head.appendChild(s);});},lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);await E(MID);
 for(const k of want){try{await E("openMenu();"+ALL[k]);}catch(e){console.log(k,'ERR',e.message.slice(0,100));continue;}
  await p.waitForTimeout(700);await p.screenshot({path:`${pre}_${k}.png`});}
 console.log('errors',errs.slice(0,3));await b.close();})();
