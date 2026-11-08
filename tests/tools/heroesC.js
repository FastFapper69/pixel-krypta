// heroesC.js: Zbrojmistr (6 weapon slots, 2nd weapon from level 10) and Krotitel (two pets, pet talents) + screenshots
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2,locale:'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
const r=JSON.parse(await E(`(()=>{save.sound=false;save.music=false;window.__krypta.god=true;save.heroes.warlord=save.heroes.tamer=true;
 const o={};startRun('warlord','hrbitov');o.maxW=maxW();o.w1=Object.keys(run.W);save.hlv.warlord=10;startRun('warlord','hrbitov');o.w10=Object.keys(run.W);
 // fill weapons through level-ups: count max offered slots
 for(const w of ['blade','bolt','arrows','fireball','frost','lightning','aura'])if(!run.W[w]&&nWeapons()<maxW())addWeapon(w);o.nW=nWeapons();o.newW=levelOptions().filter(x=>x.k==='w'&&x.lv===1).length;
 startRun('knight','hrbitov');o.maxWknight=maxW();
 petInit();const a=petRoll('wolf',.5),b2=petRoll('drake',.5);save.pets.cards.push(a,b2);save.pets.sel=a.u;save.pets.sel2=b2.u;
 startRun('tamer','hrbitov');o.tamerPets=[run.pet&&run.pet.k,run.pet2&&run.pet2.k];const dm1=run.pet.S.dm;for(let i=0;i<60*25;i++)tick(1/60);o.hits=[run.pet.hits,run.pet2.hits];
 save.hlv.tamer=20;startRun('tamer','hrbitov');o.dmT20=+(run.pet.S.dm/dm1).toFixed(2);
 startRun('knight','hrbitov');o.knightPets=[!!run.pet,!!run.pet2];
 return JSON.stringify(o);})()`));
console.log(JSON.stringify(r));
await E("save.coins=5000;save.cleared.trun=true;delete save.heroes.warlord;renderSelect();setState('select')");await p.waitForTimeout(400);await p.screenshot({path:'/tmp/c-select.png'});
await E("save.heroes.warlord=true;openPets()");await p.waitForTimeout(400);await p.screenshot({path:'/tmp/c-pets.png'});
await E("heroSel='warlord';openHero()");await p.waitForTimeout(400);await p.screenshot({path:'/tmp/c-hero.png'});
await E("startRun('tamer','hrbitov');for(let i=0;i<60*12;i++)tick(1/60);render()");await p.waitForTimeout(300);await p.screenshot({path:'/tmp/c-run.png'});
console.log(JSON.stringify(errs));await b.close();})();
