// Kovárna: výbava, karty věží a hvězdy mazlíčků (08l): node forgeB.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
const r=await p.evaluate(()=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;K.econInit();E('twInit()');E('petInit()');
  for(let i=0;i<3;i++){E('addItem')(K.makeItem(1));}const it=K.save.inv.filter(x=>x.r===1);for(const x of it){x.s='ring';x.set=undefined;}
  for(let i=0;i<3;i++)K.save.tw.cards.push({u:'tf'+i,k:'fire',r:1,lv:i,b:{}});
  for(let i=0;i<3;i++)K.save.pets.cards.push({u:'pw'+i,k:'raven',r:0,lv:i,b:{},pet:1});
  E('openForge()');return document.querySelectorAll('#forgeList .card.chest').length;});
await p.waitForTimeout(400);await p.screenshot({path:pre+'_forge.png'});
const r2=await p.evaluate(()=>{const K=window.__krypta,E=K._ev;const btns=[...document.querySelectorAll('#forgeList .card.chest')];const pb=btns.find(x=>x.textContent.includes('Havran'));pb.querySelector('button').click();return K.state;});
// finish the ritual quickly
await p.evaluate(()=>window.__krypta._ev("FZ.intro=0;FZ.res=['p','g','g','p'];finishFuse()"));await p.waitForTimeout(1600);
const r3=await p.evaluate(()=>{const K=window.__krypta;const rv=K.save.pets.cards.filter(x=>x.k==='raven');return{state:K.state,ravens:rv.length,stars:rv.map(x=>x.st||0),coins:K.save.coins};});
console.log('r3',JSON.stringify(r3));await p.evaluate(()=>{const K=window.__krypta,E=K._ev;E('openPets()');const c=K.save.pets.cards.find(x=>x.k==='raven'&&x.st)||K.save.pets.cards.find(x=>x.k==='raven');E('openPetCard')(c.u);});await p.waitForTimeout(400);await p.screenshot({path:pre+'_pet.png'});
console.log(r,r2,JSON.stringify(r3),errs);await b.close();})();
