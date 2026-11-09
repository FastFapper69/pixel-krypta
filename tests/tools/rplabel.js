// Štítek rarity na kartách věží a mazlíčků v Arzenálu: bez stínu, jeden řádek, nejdelší text se vejde. node rplabel.js [prefix] [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;twInit();persist();openMenu();openTowers()");await p.waitForTimeout(400);
 let bad=0;
 for(const r of [0,1,2,3,4])for(const lv of [0,1,3]){
  const m=await p.evaluate(([r,lv])=>{const el=document.querySelector('#scr-towers .tslot:not(.empty) small.rp');if(!el)return null;el.textContent=window.__krypta._ev('RAR['+r+'].name'); // úroveň je zvlášť jako odznak .tlv v rohu
    const cs=getComputedStyle(el);return {t:el.textContent,over:el.scrollWidth>el.clientWidth+1,h:el.offsetHeight,ts:cs.textShadow};},[r,lv]);
  if(!m){console.log('žádná karta');bad++;break;}
  if(m.over||m.h>16||m.ts!=='none'){bad++;console.log('PROBLÉM',m);}}
 console.log(bad?'chyb: '+bad:'všechny rarity a úrovně se vejdou na jeden řádek, bez stínu');
 if(pre){await E("renderTowers()");await p.evaluate(()=>{const t=document.querySelector('#scr-towers .tslot:not(.empty)');if(t&&!t.querySelector('.tlv')){const i=document.createElement('i');i.className='tlv';i.textContent='+2';t.appendChild(i);}});await p.waitForTimeout(300);await p.screenshot({path:pre+'.png'});}
 console.log('chyby',errs);await b.close();process.exit(bad?1:0);})();
