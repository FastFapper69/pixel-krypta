// shotA.js <prefix> [screens] : iPhone screenshots of menu screens with a test save (items incl. sets, towers, pets)
// screens: menu,hero,towers,chests,shop,forge,select,over,merge  (comma separated)
const {chromium}=require('playwright');const pre=process.argv[2]||'a',list=(process.argv[3]||'menu,hero,towers,chests,shop,select,over').split(',');
const SETUP=`(()=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;
 E("save.coins=12000;save.mats=save.mats||{};for(const m of MAT_IDS)save.mats[m]=900;save.heroes.bard=save.heroes.builder=save.heroes.mage=true;"+
   "save.cleared=save.cleared||{};for(const C of CHAPTERS.slice(0,2))for(const m of C.maps)save.cleared[m]=true;save.fin=save.fin||{};save.fin.trun=1;save.chT={};"+
   "for(let i=0;i<10;i++)addItem(makeItem(i%4));for(const sid of SET_IDS.slice(0,2))for(let i=0;i<2;i++)addItem(makeSetItem(sid));"+
   "save.eq.knight={helm:save.inv.find(i=>i.s==='helm').u};twInit();persist();");})()`;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2,locale:'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);await p.evaluate(SETUP);
const go={menu:"openMenu()",hero:"openHero()",towers:"openTowers()",chests:"openChestShop()",shop:"setState('shop')",forge:"(typeof openForge==='function'?openForge():setState('chests'))",
 select:"renderSelect();setState('select')",over:"startRun('knight','hrbitov');run.coins=900;finish(true);setState('over')",merge:"for(let i=0;i<3;i++)addItem(makeItem(1,'ring'));for(let i=0;i<3;i++)addItem(makeSetItem('bone','helm',2));openForge()"};
for(const s of list){await p.evaluate(x=>window.__krypta._ev(x),go[s]);await p.waitForTimeout(700);await p.screenshot({path:`/tmp/${pre}-${s}.png`,fullPage:s!=='over'&&s!=='menu'});}
console.log(JSON.stringify(errs));await b.close();})();
