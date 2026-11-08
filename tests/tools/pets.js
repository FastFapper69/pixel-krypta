// pets.js [prefix]: every pet in a run (no errors, damage dealt), then screenshots of the Pets screen and chests
const {chromium}=require('playwright');const pre=process.argv[2]||'pet';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},locale:'cs-CZ',hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
const res=await p.evaluate(()=>{const K=window.__krypta,out=[];K.save.sound=false;K.save.music=false;K.god=true;
 for(const k of K.PET_IDS){const c=K.petRoll(k,.5);K.save.pets={v:1,cards:[c],sel:c.u};
  K.startRun('knight','hrbitov');const r=K.run;let kills0=0;for(let i=0;i<60*40;i++){K.step(1/60);}
  out.push({k,kills:r.kills,hits:r.pet.hits,hp:Math.round(r.p.hp),fire:(r.pfire||[]).length});}
 return out;});
console.log(JSON.stringify(res));
// screenshots with a few pets side by side in a run
for(const k of ['wolf','drake','owl']){await p.evaluate(k=>{const K=window.__krypta;const c=K.petRoll(k,.5);K.save.pets={v:1,cards:[c],sel:c.u};K.startRun('knight','hrbitov');for(let i=0;i<60*25;i++)K.step(1/60);},k);await p.waitForTimeout(200);await p.screenshot({path:`/tmp/${pre}-run-${k}.png`});}
await p.evaluate(()=>{const K=window.__krypta;K.save.coins=5000;K.save.mats.magma=300;K.save.pets={v:1,cards:[],sel:null};K.petInit();for(const k of K.PET_IDS)K.save.pets.cards.push(K.petRoll(k));K.openPets();});
await p.waitForTimeout(300);await p.screenshot({path:`/tmp/${pre}-screen.png`,fullPage:true});
await p.evaluate(()=>{const K=window.__krypta;K.openPetCard(K.save.pets.cards[6].u);});await p.waitForTimeout(200);await p.screenshot({path:`/tmp/${pre}-card.png`});
await p.evaluate(()=>{window.__krypta.openChestShop();});await p.waitForTimeout(300);await p.screenshot({path:`/tmp/${pre}-chests.png`,fullPage:true});
await p.evaluate(()=>{const K=window.__krypta;K.save.coins=5000;K.save.mats.magma=300;const c=K.openPetChest();window.__c=c;});
console.log('chest ok',await p.evaluate(()=>window.__c&&window.__c.k),'errs',JSON.stringify(errs));await b.close();})();
