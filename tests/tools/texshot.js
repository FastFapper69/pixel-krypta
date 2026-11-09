// Snímky obrazovek menu pro návrh textur: node texshot.js prefix [cs|en] [obrazovky čárkou]
const {chromium}=require('playwright');const pre=process.argv[2]||'tx',lang=process.argv[3]||'cs';
const ALL={quests:"openQuests()",guide:"openGuide()",shop:"renderShop();setState('shop')",hero:"openHero()",towers:"openTowers()",pets:"openPets()",chests:"openChestShop()",forge:"openForge()",master:"openMaster()",codex:"openCodex()",board:"openBoard&&openBoard()",menu:"openMenu()",select:"show('select')"};
const want=(process.argv[4]||Object.keys(ALL).join(',')).split(',');
const MID="save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats=save.stats||{};save.stats.runs=30;save.cleared=save.cleared||{};for(const C of CHAPTERS.slice(0,4))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};"+
 "for(let i=0;i<10;i++)addItem(makeItem(i%4));twInit();petInit();try{featCheck()}catch(e){};persist();";
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+MID);
 for(const k of want){try{await E("openMenu();"+ALL[k]);}catch(e){console.log(k,'ERR',e.message.slice(0,120));continue;}
  await p.waitForTimeout(600);await p.screenshot({path:`${pre}_${k}.png`});console.log('ok',k);
  if(process.env.SCROLL){const id={hero:'hero',towers:'towers',pets:'pets',chests:'chests',forge:'forge',master:'master',codex:'codex',shop:'shop'}[k];
   for(const f of [.5,1]){await p.evaluate(([id,f])=>{const e=document.getElementById('scr-'+id);e.scrollTop=(e.scrollHeight-e.clientHeight)*f;},[id,f]);await p.waitForTimeout(250);await p.screenshot({path:`${pre}_${k}_s${f*10}.png`});}}}
 console.log('errors',errs.slice(0,5));await b.close();})();
