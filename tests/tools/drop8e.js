// 08e: kampaň dá předmět jen za první výhru mapy na každé NM, legendárky z běhů nepadají: node drop8e.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.econInit();K.save.cheat=true;const o=[];
 for(const nm of [1,1,3,3,3,3,3,3]){K.startRun('knight','kostnice',{nm});const x=K.runRewards(true);o.push([nm,x.item?x.item.r:null]);}
 return o;});
console.log(JSON.stringify(r),'errors',errs);await b.close();})();
