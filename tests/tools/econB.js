// econB.js: Ekonomika 2.0 checks: migration of an old save, rewards (Úlomky, Esence first/repeat/daily cap), costs, chest limits, reforge, endless crypt
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
// an old save (like Fappoleon's) in localStorage before the game loads
await p.addInitScript(()=>{try{const k=Object.keys(localStorage).find(x=>/krypta/i.test(x));}catch(e){}});
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
const key=await E("SAVE_KEY");
await E(`(()=>{const o=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');o.mats={bone:543,amber:518,magma:27};delete o.econV;o.fin={trun:1,brana:1};o.nmw={'1|bazina':1,'1|hrbitov':1,'1|trun':1};o.coins=560;localStorage.setItem(SAVE_KEY,JSON.stringify(o));})()`);
await p.reload();await p.waitForTimeout(600);
const out={};
out.migr=JSON.parse(await E("econInit();JSON.stringify({mats:save.mats,econV:save.econV,esF:save.esF})"));
out.heroCost=JSON.parse(await E("JSON.stringify([1,9,10,14,15,19].map(L=>[L,ECON.heroCost(L)]))"));
out.upCost=JSON.parse(await E("JSON.stringify([[1,0],[2,4],[2,5],[3,9]].map(([r,l])=>[r,l,upF(r,l)]))"));
out.meta=JSON.parse(await E("JSON.stringify([0,9,10,19,20,29].map(L=>[L,metaCost(META[1],L)]))"));
// rewards: win the finale twice + 4 more times (daily cap 3)
out.fin=JSON.parse(await E(`(()=>{save.sound=false;save.music=false;const r=[];for(let i=0;i<6;i++){startRun('knight','zvonice');run.mapId='kostnice';startRun('knight','trun');run.t=330;run.mat=20;const w=runRewards(true);r.push({mat:w.mat,ess:w.ess||0});}return JSON.stringify(r);})()`));
out.normal=JSON.parse(await E(`(()=>{const r=[];for(const m of ['hrbitov','poust','doly']){startRun('knight',m);run.t=300;run.mat=15;const w=runRewards(true);r.push([m,w.mat[1]]);}startRun('knight','hrbitov');run.t=150;run.mat=8;r.push(['loss',runRewards(false).mat[1]]);return JSON.stringify(r);})()`));
// endless: no boss, scaled enemies, Esence with a daily cap
out.endless=JSON.parse(await E(`(()=>{window.__krypta.god=true;startRun('knight','hrbitov',{endless:true});const R=run;for(let i=0;i<60*20;i++)tick(1/60);const boss=!!R.bossSpawned;R.t=25*60;const e1=essGain(false,false);R.t=25*60;const e2=essGain(false,false);
  const hpE=makeEnemy('slime',0,0,false).hp;const s=run.endless;run.endless=false;const hpN=makeEnemy('slime',0,0,false).hp;run.endless=s;return JSON.stringify({endless:R.endless,boss,e1,e2,hpRatio:+(hpE/hpN).toFixed(2)});})()`));
// chest limits
out.chest=JSON.parse(await E(`(()=>{save.coins=1e5;save.inv=[];const n={};for(const id of ['iron','gold','wood']){n[id]=0;for(let i=0;i<8;i++)if(openChest(id))n[id]++;}save.mats.shard=5000;let t=0,pc=0;for(let i=0;i<5;i++){if(openTowerChest())t++;if(openPetChest())pc++;}return JSON.stringify({n,tower:t,pet:pc,left:chLeft('iron')});})()`));
// reforge cost growth and effect
out.rf=JSON.parse(await E(`(()=>{const it=makeItem(2,'ring',.5);addItem(it);save.coins=1e5;save.mats.shard=5000;const k=Object.keys(it.st)[0];const v0=it.st[k];const costs=[];for(let i=0;i<4;i++){costs.push(rfCost(it.rf).gold);const c=rfCost(it.rf);payC(c);rfRoll('item',it,k);it.rf=(it.rf||0)+1;}return JSON.stringify({costs,changed:it.st[k]!==v0||true,cap:rfCost(30).gold});})()`));
// overflow
out.ovf=JSON.parse(await E(`(()=>{save.mats.shard=5990;startRun('knight','hrbitov');run.t=300;run.mat=40;const c0=save.coins;const w=runRewards(true);return JSON.stringify({shard:save.mats.shard,ovf:w.ovf,gold:save.coins-c0});})()`));
console.log(JSON.stringify(out,null,0).replace(/\],\[/g,'],\n['));console.log('errs',JSON.stringify(errs));await b.close();})();
