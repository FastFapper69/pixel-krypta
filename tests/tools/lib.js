// Společný základ pro testy a snímky (audit 2026-11-09): jeden způsob, jak připravit stránku, iPhone, okraje, jazyk a účet.
// Použití:
//   const L=require('./lib');
//   L.prep();                                   // off.html + game.js + krypta.css + lang-en.js + symlinky (thumbs, fonts, vendor, licenses, ikony)
//   const {b,p,E,errs,close}=await L.open({lang:'en',phone:'se',save:'late'});
//   await E("openHero()");await L.shot(p,'out.png');console.log(errs);await close();
// Telefony: se 375×667 (okraje 20/0), 13 390×844, 15 393×852 (59/34), 16 402×874 (62/34), max 430×932 (59/34), small 360×640.
// Účty: fresh = nový hráč; mid = kapitoly I–III vyhrané, výbava; late = I–IV, vše odemčené vč. Souhvězdí.
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const DIR=__dirname,ROOT=path.join(DIR,'..','..');
const PHONES={se:[375,667,20,0],small:[360,640,20,0],13:[390,844,47,34],15:[393,852,59,34],16:[402,874,62,34],max:[430,932,59,34]};
const SAVES={
 fresh:"",
 mid:"save.coins=939;save.mats.shard=698;save.mats.ess=27;save.stats=save.stats||{};save.stats.runs=30;for(const C of CHAPTERS.slice(0,3))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};for(let i=0;i<6;i++)addItem(makeItem(i%4));twInit();petInit();featCheck();",
 late:"save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats=save.stats||{};save.stats.runs=60;for(const C of CHAPTERS.slice(0,4))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};for(let i=0;i<10;i++)addItem(makeItem(i%4));twInit();petInit();featCheck();featInit();save.feat.sky=1;save.feat.pets=1;"};
// obrazovky menu: název -> kód, který ji otevře
const SCREENS={menu:"openMenu()",select:"openMenu();$('#mPlay').click()",hero:"openHero()",towers:"openTowers()",pets:"openPets()",chests:"openChestShop()",forge:"openForge()",shop:"renderShop();setState('shop')",
 quests:"openQuests()",master:"openMaster()",codex:"openCodex()",board:"openBoard&&openBoard()",guide:"openGuide()",sky:"openSky()",settings:"openMenu();$('#mSet').click()",news:"openMenu();openNews()",
 coop:"openMenu();$('#mCoop').click()",confirm:"openMenu();$('#mPlay').click();confirmHero('mage')"};
// 09z7: hra je rozdělená na index.html (kostra) + krypta.css (styly) + game.js (kód). src() je vrátí jako jeden „starý“ index.html
// s vloženými <style>/<script>, takže statické kontroly (regexy nad zdrojákem) fungují beze změny.
function src(){const h=fs.readFileSync(path.join(ROOT,'index.html'),'utf8'),r=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
 return h.replace(/<link rel="stylesheet" href="krypta\.css[^"]*">/,()=>'<style>\n'+r('krypta.css')+'</style>').replace(/<script src="game\.js[^"]*"><\/script>/,()=>'<script>\n'+r('game.js')+'</script>');}
function prep(){
 const h=fs.readFileSync(path.join(ROOT,'index.html'),'utf8').replace(/url:'https:\/\/mpxfppuigwvwlfhsnbgr\.supabase\.co',key:'[^']*'/,"url:'',key:''");
 fs.writeFileSync(path.join(DIR,'off.html'),h);fs.copyFileSync(path.join(ROOT,'lang-en.js'),path.join(DIR,'lang-en.js'));
 for(const f of ['game.js','krypta.css'])fs.copyFileSync(path.join(ROOT,f),path.join(DIR,f)); // kopie, ne symlink: testy smí běžet i nad upravenou kopií
 for(const d of ['thumbs','fonts','vendor','licenses','icon-192.png','icon-512.png','icon-180.png','manifest.webmanifest']){const t=path.join(DIR,d);if(!fs.existsSync(t)&&fs.existsSync(path.join(ROOT,d)))fs.symlinkSync(path.join('..','..',d),t);}
}
async function open(o={}){
 const [W,H,top,bot]=PHONES[o.phone||'15'];const b=o.browser||await chromium.launch();
 const c=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:o.dpr||2,isMobile:true,hasTouch:true});
 await c.addInitScript(([l,t,bt])=>{try{localStorage.setItem('pixel-krypta-lang',l);}catch(_){}document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=':root{--sat:'+t+'px!important;--sab:'+bt+'px!important}';document.head.appendChild(s);});},[o.lang||'cs',top,bot]);
 const p=await c.newPage(),errs=[];
 p.on('pageerror',e=>errs.push('JS: '+e.message+' @ '+((e.stack||'').split('\n')[1]||'').trim()));
 p.on('console',m=>{if(m.type()==='error'&&!/supabase|Failed to fetch|ERR_INTERNET|net::ERR_NAME/.test(m.text()))errs.push('console: '+m.text().slice(0,200));});
 p.on('requestfailed',r=>{const u=r.url();if(u.startsWith('file:'))errs.push('soubor chybí: '+u.split('/tests/tools/')[1]);});
 await p.goto('file://'+path.join(DIR,'off.html'));await p.waitForTimeout(600);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+(((o.save||'fresh') in SAVES)?SAVES[o.save||'fresh']:o.save)+"save.featNew=[];save.featSum=0;save.storyNew=null;persist();");
 return {b,c,p,E,errs,close:async()=>{if(o.browser)await c.close();else await b.close();}};
}
async function shot(p,file,clip){await p.screenshot(clip?{path:file,clip}:{path:file});}
module.exports={src,prep,open,shot,PHONES,SAVES,SCREENS,DIR,ROOT};
