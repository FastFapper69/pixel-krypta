// 08i: v detailu předmětu, karty věže a mazlíčka už není tlačítko Přebroušení: node norf.js <png>
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));
await p.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
await p.evaluate(()=>{const K=window.__krypta;K.econInit();const it=K.makeItem(3);K._ev('addItem')(it);K.openHero();K._ev('openItem')(it.u);});await p.waitForTimeout(400);
await p.screenshot({path:process.argv[2]});
const r=await p.evaluate(()=>{const K=window.__krypta,q=s=>!!document.querySelector(s),out={item:q('#ipRf')};K._ev('openTowers()');const tc=K.save.tw.cards[0];if(tc){K._ev('openTwCard')(tc.u);out.tw=q('#twRf');}
  K._ev('petInit()');K._ev('openPets()');const pc=K.save.pets.cards[0];if(pc){K._ev('openPetCard')(pc.u);out.pet=q('#ptRf');}return out;});console.log(r,e);await b.close();})();
