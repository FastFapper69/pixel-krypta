// Příprava: ťuknutí na zamčeného hrdinu vždy otevře detail (co umí) – s důvodem zámku nebo s tím, kolik zlata chybí. node heroprev.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};save.coins=100;featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;persist();openMenu();document.getElementById('mPlay').click()");await p.waitForTimeout(500);
 const ids=await E("HERO_IDS.filter(id=>!heroOwned(id))");const out=[];let shots=0,bad=0;
 for(const id of ids){await E("document.getElementById('newsPop').hidden=true");
  await p.evaluate(id=>{const b=document.querySelector('#heroList [data-h="'+id+'"]');if(b)b.click();else window.__noBtn=(window.__noBtn||0)+1;},id);await p.waitForTimeout(250);
  const r=await p.evaluate(()=>{const np=document.getElementById('newsPop');return {open:!np.hidden,title:(np.querySelector('h2')||{}).textContent,buy:!!np.querySelector('#buyYes'),lock:(np.querySelector('.hlock')||{}).textContent||'',miss:(np.querySelector('li.miss')||{}).textContent||'',weap:!!np.querySelector('.hweap')};});
  out.push(id+': '+(r.open?'otevřeno':'NEOTEVŘENO')+' | '+r.title+' | '+(r.lock||r.miss||(r.buy?'koupit':'')));if(!r.open||!r.weap||r.buy)bad++;
  if(pre&&shots<2&&(r.lock&&shots===0||r.miss&&shots===1)){await p.screenshot({path:pre+'_'+shots+'.png'});shots++;}}
 console.log(out.join('\n'));const nb=await p.evaluate(()=>window.__noBtn||0);if(nb){console.log('karta hrdiny nenalezena:',nb);bad++;}
 // with enough gold the buy button is there
 await E("save.coins=99999;document.getElementById('newsPop').hidden=true");const buyable=await E("HERO_IDS.find(id=>!heroOwned(id)&&!heroLock(id))");
 if(buyable){await E("confirmHero('"+buyable+"')");const ok=await p.evaluate(()=>!!document.querySelector('#buyYes'));console.log('se zlatem:',buyable,ok?'tlačítko Koupit je':'CHYBÍ Koupit');if(!ok)bad++;}
 console.log('chyby',errs);await b.close();process.exit(bad||errs.length?1:0);})();
