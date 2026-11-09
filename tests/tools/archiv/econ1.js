const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const K=window.__krypta,S=K.save;S.sound=false;S.music=false;const out={};const _ls=localStorage.setItem.bind(localStorage);localStorage.setItem=()=>{};
 // 1) chest odds over 3000 opens per chest (gold is free here), pity
 S.coins=1e9;for(const id of ['wood','iron','gold']){const cnt=[0,0,0,0,0];let maxGap=0,gap=0;S.pity={iron:0,gold:0};
   for(let i=0;i<3000;i++){if(S.inv.length>150)S.inv.length=0;const it=K.openChest(id);cnt[it.r]++;const pr={iron:3,gold:4}[id];if(pr!==undefined){if(it.r>=pr){maxGap=Math.max(maxGap,gap+1);gap=0;}else gap++;}}
   out[id]=cnt.map(n=>Math.round(n/30)+'%').join(' ')+(maxGap?' | pity max '+maxGap:'');}
 S.inv=[];
 // 2) items: stat ranges, upgrade, bonus
 const it=K.makeItem(3,'amulet',1);out.epicAmulet=JSON.stringify(it.st);
 S.mats={bone:9999,amber:9999,magma:9999};for(let i=0;i<10;i++)K.upgradeItem(it.u)||0;
 S.inv.push(it);for(let i=0;i<10;i++)K.upgradeItem(it.u);out.upgraded=it.lv;
 S.eq={knight:{amulet:it.u}};const B=K.heroBonus('knight');out.bonusDmg=+B.dmg.toFixed(3);
 // 3) hero levels to 20
 for(let i=0;i<25;i++)K.heroUp('knight');out.knightLv=S.hlv.knight;const B2=K.heroBonus('knight');out.tal=Object.keys(B2.tal).join(',');out.hpPct=+B2.hpPct.toFixed(2);
 // 4) in-run effect: blade gets +1 (k10), armor +1 (k5), hp*1.53
 K.startRun('knight','hrbitov');out.run={blades:K.run.W.blade.xn,maxHp:K.st.max,armor:K.st.armor,dmg:+K.st.dmg.toFixed(2),crit:+K.st.crit.toFixed(3)};
 // 5) solo stats with no gear are unchanged
 S.eq={};S.hlv={};K.startRun('knight','hrbitov');out.plain={maxHp:K.st.max,armor:K.st.armor,dmg:K.st.dmg,crit:K.st.crit,speed:K.st.speed};
 return out;});
console.log(JSON.stringify(r,null,1));console.log(errs);await b.close();})();
