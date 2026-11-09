// Návrhy vzhledu menu 09q: node menu_mock3.js <prefix> <smer: base|A|B|C> [cs|en]
// Písma se berou lokálně (npm @fontsource v ~/fonts), protože sandbox nestáhne Google Fonts.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const pre=process.argv[2],dir=process.argv[3]||'base',lang=process.argv[4]||'cs',FD=process.env.FONTS||'/root/fonts/node_modules/@fontsource';
const FAM={'pixelify-sans':['Pixelify Sans',[500,700]],'chakra-petch':['Chakra Petch',[500,600,700]],'jacquard-12':['Jacquard 12',[400]],'jersey-10':['Jersey 10',[400]],'tiny5':['Tiny5',[400]]};
let ff='';for(const [d,[n,ws]] of Object.entries(FAM))for(const w of ws)for(const sub of ['latin','latin-ext']){const f=`${FD}/${d}/files/${d}-${sub}-${w}-normal.woff2`;if(fs.existsSync(f))ff+=`@font-face{font-family:'${n}';font-weight:${w};src:url('file://${f}')}\n`;}
const css=dir==='base'?'':fs.readFileSync(path.join(__dirname,'mock','menu'+dir+'.css'),'utf8');
const js=dir!=='base'&&fs.existsSync(path.join(__dirname,'mock','menu'+dir+'.js'))?fs.readFileSync(path.join(__dirname,'mock','menu'+dir+'.js'),'utf8'):'';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 await p.evaluate(([ff,css])=>{const s=document.createElement('style');s.textContent=ff+css;document.head.appendChild(s);},[ff,css]);
 await p.evaluate(()=>window.__krypta._ev("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;for(const C of CHAPTERS.slice(0,4))for(const m of C.maps)save.cleared[m]=true;persist();openMenu();refreshMenu&&refreshMenu()"));
 if(js)await p.evaluate(js);
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(900);await p.screenshot({path:`${pre}_menu.png`});
 const scr=(process.env.SCR||'select').split(',');
 for(const s of scr){await p.evaluate(s=>window.__krypta._ev(s==='select'?"openMenu();document.getElementById('mPlay').click()":s==='chests'?"openMenu();openChestShop()":s==='hero'?"openMenu();openHero()":"openMenu();openQuests()"),s);await p.waitForTimeout(700);await p.screenshot({path:`${pre}_${s}.png`});}
 console.log(dir,'errors',errs.slice(0,4));await b.close();})();
