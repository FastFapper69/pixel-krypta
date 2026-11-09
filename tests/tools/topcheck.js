// 09z5: nic důležitého v pruhu, který iOS 26 rozmazává (od horního okraje do --sat + 26 px): hlavička obrazovek, HUD ve hře, menu.
// node topcheck.js [prefix pro snímky]
const L=require('./lib');L.prep();
(async()=>{const b=await require('playwright').chromium.launch();const bad=[];
for(const ph of ['se','15','16']){const P=await L.open({browser:b,phone:ph,save:'late'});const sat=L.PHONES[ph][2],lim=sat+26;
 const top=async sel=>P.p.evaluate(s=>{let m=1e9;for(const e of document.querySelectorAll(s)){const r=e.getBoundingClientRect();if(r.width&&r.height&&getComputedStyle(e).visibility!=='hidden')m=Math.min(m,r.top);}return m;},sel);
 for(const k of ['select','hero','chests','forge','quests','master','guide','sky']){await P.E("openMenu();"+L.SCREENS[k]);await P.p.waitForTimeout(250);const t=await top('#scr-'+(k==='chests'?'chests':k)+' .head h2, #scr-'+k+' .head .btn');if(t<lim)bad.push(ph+' '+k+': hlavička '+Math.round(t)+' px < '+lim);}
 await P.E("openMenu()");await P.p.waitForTimeout(250);{const t=await top('#mTop .btn,#mCur');if(t<lim)bad.push(ph+' menu: lišta '+Math.round(t));}
 await P.E("startRun('knight','hrbitov')");await P.p.waitForTimeout(600);{const t=await top('#hpBar,#time,#btnPause');if(t<lim)bad.push(ph+' HUD: '+Math.round(t)+' px < '+lim);}
 if(process.argv[2]){await L.shot(P.p,process.argv[2]+'_'+ph+'_hud.png');await P.E("openMenu();"+L.SCREENS.select);await P.p.waitForTimeout(400);await L.shot(P.p,process.argv[2]+'_'+ph+'_select.png');}
 if(P.errs.length)bad.push(ph+' chyby: '+P.errs.join(' | '));await P.close();}
await b.close();console.log(bad.length?'✗ '+bad.join('\n✗ '):'✓ horní okraj v pořádku');process.exit(bad.length?1:0);})();
