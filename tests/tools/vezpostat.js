// 10q: vylepšení věže postáním u ní. node vezpostat.js <složka> [cs|en] [telefon]
// Pravidla: 2 doby u věže → úroveň +1 (stojí zlato jako tlačítko), rychlý průběh nic, čerstvá věž 4 s klid, bez zlata nic,
// úr. 3 se jen opraví, jen nejbližší věž, co-op snímek nese průběh. Snímky teček kolem paty věže.
const L=require('./lib.js'),path=require('path'),fs=require('fs');
const out=process.argv[2]||'.',lang=process.argv[3]||'cs',phone=process.argv[4]||'se';let bad=0;
const ok=(c,t)=>{if(!c){bad++;console.log('✗',t);}else console.log('✓',t);};
(async()=>{L.prep();const o=await L.open({phone,lang,save:'late'});
 await o.E("openMenu();startRun('knight','hrbitov',{});for(let i=0;i<60;i++)step(1/30);$('#toast').style.display='none';run.p.inv=1e9;run.p.hp=run.p.max=1e6;");
 const E=o.E,J=async x=>JSON.parse(await E("JSON.stringify("+x+")"));
 const clear="run.enemies.length=0;run.eshots&&(run.eshots.length=0);";
 const stay=(sec,x,y)=>E("for(let i=0;i<"+Math.round(sec*30)+";i++){"+clear+"run.p.x="+x+";run.p.y="+y+";run.p.inv=1e9;step(1/30);}");
 // věž mimo hráče, ať ji postavení nespustí
 await E(clear+"run.coins=1000;run.towers.length=0;const T=addTower('arrow',run.p.x+60,run.p.y);T.born=run.t-10;window.__T=T;");
 const T="window.__T",tx=await J(T+".x"),ty=await J(T+".y"),bd=await J("dwTime()");
 const c0=await J("run.coins"),cost=await J("towerUpCost("+T+")");
 await stay(bd*0.6,tx+8,ty);ok(await J(T+".lv")===1&&await J(T+".dwA")===true,'po 0,6 doby čeká a ukazuje tečky');
 await stay(bd*0.5,tx+8,ty);ok(await J(T+".lv")===2&&await J("run.coins")===c0-cost,'po 2 dobách úr. 2 a stálo '+cost+' zlata');
 // rychlý průběh středem kruhu základní rychlostí hrdiny (58 j/s) při nejrychlejší skladbě (142 BPM)
 await E("M.stepDur=60/142/4;run.p.x="+(tx-40)+";run.p.y="+ty+";step(1/30);");
 await E("for(let i=0;i<45;i++){"+clear+"run.p.x+=58/30;step(1/30);}");
 ok(await J(T+".lv")===2,'rychlý průběh kolem věže nic neutratí');
 await E("run.coins=0;");await stay(bd*1.5,tx+5,ty);ok(await J(T+".lv")===2&&await J(T+".dwA")===false,'bez zlata nic a bez teček');
 await E("run.coins=1000;");await stay(bd*2.2,tx+5,ty);ok(await J(T+".lv")===3,'úr. 3 po dalších 2 dobách');
 await E(T+".hp=10;");await stay(bd*1.1,tx+5,ty);ok(await J(T+".hp")===await J(T+".max"),'úr. 3 poškozená se opraví');
 await stay(bd*1.2,tx+5,ty);ok(await J(T+".dwA")===false,'plná úr. 3 už tečky neukazuje');
 // čerstvě postavená věž
 await E("run.towers.length=0;run.p.x="+tx+";run.p.y="+ty+";buildTower(run.deck[0]);window.__N=run.towers[0];");
 const lvN=await J("window.__N.lv");await stay(2.5,await J("window.__N.x")+6,await J("window.__N.y"));ok(await J("window.__N.lv")===lvN,'čerstvá věž se 4 s nevylepší');
 await stay(3.5,await J("window.__N.x")+6,await J("window.__N.y"));ok(await J("window.__N.lv")===lvN+1,'pak ano');
 // dvě věže vedle sebe: jen nejbližší
 await E("run.towers.length=0;const a=addTower('arrow',"+tx+","+ty+"),b=addTower('fire',"+(tx+30)+","+ty+");a.born=b.born=run.t-10;window.__A=a;window.__B=b;");
 await stay(bd*1.1,tx+12,ty);ok(await J("[__A.lv,__B.lv]+''")==='2,1','vylepší se jen nejbližší věž');
 // co-op snímek nese průběh
 await stay(bd*0.4,tx+3,ty);const pk=await J("(()=>{const t=__A;return [t.dwA,t.dwA?1+Math.round(t.dwk*8):0];})()");ok(pk[0]&&pk[1]>1,'snímek pro kamaráda: '+pk);
 // snímky teček: 0, půlka, skoro hotovo, oprava
 await E("run.towers.length=0;const a=addTower('arrow',"+tx+","+ty+");a.born=run.t-10;window.__A=a;run.coins=1000;");
 const snap=async(n,x,y)=>{const u=await E("(()=>{"+clear+"render();const c=$('#cv'),k=c.width/VW,q=document.createElement('canvas');q.width=q.height=240;const g=q.getContext('2d');g.imageSmoothingEnabled=false;"+
   "const sx=__A.x-run.cam.x,sy=__A.y-run.cam.y;g.drawImage(c,(sx-30)*k,(sy-36)*k,60*k,60*k,0,0,240,240);return q.toDataURL();})()");fs.writeFileSync(path.join(out,'vp_'+n+'.png'),Buffer.from(u.split(',')[1],'base64'));};
 const camOk=await J("!!(run.cam&&run.cam.x!=null)");if(!camOk)console.log('pozn.: run.cam chybí, výřez podle středu');
 await stay(bd*.1,tx+14,ty+4);await snap('1_zacatek');await stay(bd*.45,tx+14,ty+4);await snap('2_pulka');await stay(bd*.37,tx+14,ty+4);await snap('3_skoro');
 await E("__A.lv=3;__A.hp=__A.max*.4;__A.dw=0;");await stay(bd*.5,tx+14,ty+4);await snap('4_oprava');
 ok(!o.errs.length,'bez chyb JS'+(o.errs.length?': '+o.errs.slice(0,3).join(' | '):''));await o.close();process.exit(bad?1:0);})();
