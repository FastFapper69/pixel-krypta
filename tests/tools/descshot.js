// Map descriptions with bold mechanics: map select (selected map) and the guide's world tab.
// node descshot.js <prefix> [cs|en] [mapId]
const {chromium}=require('playwright');const pre=process.argv[2]||'ds',lang=process.argv[3]||'cs',mid=process.argv[4]||'kostnice';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 await p.evaluate(m=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.newsSeen='2099';
  K._ev("for(const id of MAP_IDS)save.cleared[id]=1;sel.map='"+m+"';sel.nm=0;sel.endless=false;renderSelect();setState('select')");},mid);
 await p.waitForTimeout(300);
 await p.evaluate(()=>{const e=document.querySelector('.mnode.sel');if(e)e.scrollIntoView({block:'center'});});await p.waitForTimeout(150);
 await p.screenshot({path:pre+'_select.png'});
 await p.evaluate(()=>window.__krypta._ev("setState('menu')"));await p.waitForTimeout(150);
 await p.click('#mGuide');await p.waitForTimeout(200);await p.click('#gdTabs [data-g="world"]');await p.waitForTimeout(150);
 await p.evaluate(()=>{const s=[...document.querySelectorAll('#scr-guide .gd small b')].find(x=>/lavin|avalanche/i.test(x.textContent));if(s)s.scrollIntoView({block:'center'});});await p.waitForTimeout(120);
 await p.screenshot({path:pre+'_guide.png'});
 console.log(lang,'bold in guide',await p.evaluate(()=>document.querySelectorAll('#scr-guide .gd small b').length),errs);await b.close();})();
