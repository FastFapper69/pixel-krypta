// Audit „popisek sedí k režimu“: konce běhů ve všech režimech + obrazovky Kovárna, Obchod, Nástěnka, Co-op, menu s denní výzvou.
// node modeaudit.js prefix [cs|en] [new|mid]   (fotky celé stránky)
const {chromium}=require('playwright');const pre=process.argv[2]||'ma',lang=process.argv[3]||'cs',acc=process.argv[4]||'mid';
const MID="save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats=save.stats||{};save.stats.runs=12;save.cleared=save.cleared||{};for(const C of CHAPTERS.slice(0,2))for(const m of C.maps)save.cleared[m]=true;save.fin=save.fin||{};"+
 "for(let i=0;i<8;i++)addItem(makeItem(i%4));twInit();petInit();persist();";
const END={
 normal_first:"startRun('knight','bazina');run.t=600;finish(true)",
 normal_again:"save.cleared.hrbitov=1;startRun('knight','hrbitov');run.t=600;finish(true)",
 normal_death:"startRun('knight','hrbitov');run.t=140;finish(false)",
 nm_win:"startRun('knight','hrbitov',{nm:1});run.t=600;finish(true)",
 endless:"startRun('knight','trun',{endless:true});run.t=520;finish(false)",
 daily_ok:"{const d=dailyInfo();save.daily.chal='';startRun('knight',d.map,{mod:d.mod.id});run.t=200;finish(false)}",
 daily_fail:"{const d=dailyInfo();save.daily.chal='';startRun('knight',d.map,{mod:d.mod.id});run.t=90;finish(false)}",
 daily_again:"{const d=dailyInfo();save.daily.chal=today();startRun('knight',d.map,{mod:d.mod.id});run.t=200;finish(false)}",
 coop_win:"startRun('knight','hrbitov');run.coop=true;run.t=600;finish(true)",
};
const SCR={menu:"openMenu()",forge:"openForge()",chests:"openChestShop()",quests:"openQuests()",coop:"openCoop()"};
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 await p.evaluate(m=>window.__krypta._ev("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+m),acc==='mid'?MID:"save.stats=save.stats||{};save.stats.runs=1;");
 const snap=async(n,code)=>{await p.evaluate(x=>window.__krypta._ev(x),"try{"+code+"}catch(e){console.error(e)}");await p.waitForTimeout(2600);
   const txt=await p.evaluate(()=>{const s=[...document.querySelectorAll('.scr')].find(x=>!x.hidden);return s?s.innerText.replace(/\n+/g,' | '):''});
   console.log('\n### '+n+'\n'+txt.slice(0,1500));await p.screenshot({path:`${pre}_${n}.png`,fullPage:true});};
 for(const k in SCR)await snap(k,SCR[k]);
 for(const k in END){await snap(k,END[k]+";setState('over')");await p.evaluate(()=>window.__krypta._ev("openMenu()"));}
 console.log('\nerrors',errs.slice(0,5));await b.close();})();
