// 09z5: oslava nového hrdiny a zbraně + zvýraznění nově odemčené zbraně v nabídce úrovně. node celeb.js prefix [cs|en]
const L=require('./lib');L.prep();const pre=process.argv[2]||'celeb',lang=process.argv[3]||'cs';
(async()=>{const P=await L.open({lang,save:'mid'});const {p,E,errs}=P;
 await E("openMenu();$('#mPlay').click();save.coins=5000");await p.waitForTimeout(400);
 await E("confirmHero('smith')");await p.waitForTimeout(300);await p.click('#buyYes');
 await p.waitForTimeout(260);await L.shot(p,pre+'_hero_a.png');await p.waitForTimeout(1300);await L.shot(p,pre+'_hero_b.png');
 const sel=await E("$('#fcGo').click();sel.hero");
 await E("save.hlv.smith=7;save.coins=99999;for(const m of MAT_IDS)save.mats[m]=9999;openHero()");await p.waitForTimeout(300);
 const lv=await E("heroLv('smith')");await E("weaponCelebrate('hammer')");await p.waitForTimeout(1400);await L.shot(p,pre+'_weap.png');await E("$('#fcOk').click()");
 await E("save.hlv.smith=8;openMenu();startRun('knight','hrbitov')");await p.waitForTimeout(2900);await L.shot(p,pre+'_toast.png');
 const offered=await E("const o=levelOptions().filter(x=>x.id==='hammer').length;o");
 // nabídky úrovně, dokud nepadne nově odemčená zbraň (ukáže se jen jednou)
 let tries=0;for(;tries<40;tries++){await E("setState('play');openLevelUp()");await p.waitForTimeout(80);if(await E("!!document.querySelector('#scr-levelup .card.fresh')"))break;}
 await p.waitForTimeout(500);await L.shot(p,pre+'_lvl.png');const left=await E("(save.wNew||[]).join(',')");
 console.log(JSON.stringify({sel,offered,tries,wNewPo:left}),'chyby',JSON.stringify(errs));await P.close();})();
