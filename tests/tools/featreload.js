// Karta Cesta mechanik se po zavření a novém načtení hry neukáže znovu; runy, Souhvězdí a týdenní výzva přežijí restart. node featreload.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+__dirname+'/off.html';await p.goto(url);await p.waitForTimeout(700);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 // starý hráč bez save.feat (jako před 09h)
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:20};delete save.feat;delete save.featSum;save.runes={fire2:3};save.sky={lit:{war:3},wg:1,rw:''};save.wk={w:'x',got:[1,0,0],cl:[0,0,0],best:null};persist();");
 const vis=async()=>p.evaluate(()=>{const f=document.getElementById('featPop');return !!(f&&!f.hidden);});
 for(let i=0;i<3;i++){await p.reload();await p.waitForTimeout(1500);const v=await vis();
   const st=await E("JSON.stringify({sum:save.featSum,feat:!!save.feat,runes:save.runes,sky:save.sky&&save.sky.lit,wk:save.wk&&save.wk.got})");
   console.log('spuštění',i+1,'karta:',v,st);if(v){await p.click('#fcOk');await p.waitForTimeout(400);}}
 console.log('chyby',errs);await b.close();})();
