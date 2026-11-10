// Snímky návrhů nové grafiky: node gshot.js <složka> [obrazovka,…] [cs|en] [telefon] [dpr]
const L=require('../../lib.js'),fs=require('fs'),path=require('path');
const out=process.argv[2]||'.',which=(process.argv[3]||'levelup').split(','),lang=process.argv[4]||'cs',phone=process.argv[5]||'15',dpr=+(process.argv[6]||2);
const RUN="openMenu();startRun('knight','hrbitov',{});for(let i=0;i<500;i++)step(1/30);$('#toast').hidden=true;$('#toast').style.display='none';$('#hud').style.visibility='hidden';";
const RUN0="openMenu();startRun('knight','hrbitov',{});for(let i=0;i<500;i++)step(1/30);$('#toast').style.display='none';";
const SC={levelup:[RUN,"window.KMOCK.levelup({en:EN})"],levelup_sel:[RUN,"window.KMOCK.levelup({sel:1,en:EN})"],levelup_fuse:[RUN,"window.KMOCK.levelup({fuse:1,en:EN})"],
  pause:[RUN,"window.KMOCK.pause({en:EN})"],shop:["openChestShop()","window.KMOCK.shop({en:EN})"],forge:["openForge()","window.KMOCK.forge({en:EN})"],forge_fill:["openForge()","window.KMOCK.forge({en:EN,fill:1})"],hero:["openHero()","window.KMOCK.hero({en:EN})"],
  old_levelup:[RUN0+"openLevelUp()","0"],old_pause:[RUN0+"togglePause(true)","0"],old_shop:["openChestShop()","0"],old_forge:["openForge()","0"],old_hero:["openHero()","0"]};
(async()=>{L.prep();const o=await L.open({phone,lang,save:'late',dpr});
 await o.p.addStyleTag({content:fs.readFileSync(path.join(__dirname,'kit.css'),'utf8')});
 await o.p.addScriptTag({content:fs.readFileSync(path.join(__dirname,'kit.js'),'utf8')});
 await o.p.addScriptTag({content:fs.readFileSync(path.join(__dirname,'screens.js'),'utf8')});
 o.p.on('console',m=>{if(/KIT/.test(m.text()))console.log(m.text());});
 for(const k of which){const [pre,build]=SC[k];await o.p.evaluate(()=>{const m=document.getElementById('kmock');if(m)m.remove();document.querySelectorAll('#app .scr').forEach(e=>e.style.visibility='');document.getElementById('hud').style.visibility='';});await o.E(pre);await o.p.waitForTimeout(300);await o.p.evaluate(b=>Promise.all(["20px 'Jersey 10'","30px 'Jersey 15'","40px 'Jersey 20'"].map(f=>document.fonts.load(f,'Žluťoučký kůň 0123'))).then(()=>window.__krypta._ev(b)),build);
  await o.p.waitForTimeout(300);await o.p.screenshot({path:path.join(out,k+'_'+lang+'_'+phone+'.png')});}
 if(o.errs.length)console.log('CHYBY',o.errs.slice(0,5));await o.close();})();
