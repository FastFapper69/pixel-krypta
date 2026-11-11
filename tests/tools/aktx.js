// 11p konec aktu I: úvod finále aktu (prasknutí obrazovky), karta Konec aktu s Paladinem, oslava hrdiny a zamčený Paladin v okně hrdiny
// node aktx.js prefix [cs|en] [telefon]
const L=require('./lib');const pre=process.argv[2]||'aktx',lang=process.argv[3]||'cs',phone=process.argv[4]||'se';
(async()=>{const {p,E,errs,close}=await L.open({lang,phone,save:'late'});
 await E("delete save.heroes.paladin;openMenu();$('#mPlay').click();confirmHero('paladin')");await p.waitForTimeout(300);await L.shot(p,pre+'_lock.png');
 await E("$('#buyNo').click();save.sound=false;save.music=false;startRun('knight','korunace');run.t=run.map.dur-1;");
 const st=async n=>{for(let i=0;i<n;i++)await E("for(let k=0;k<6;k++)window.__krypta.step(1/60)");};
 await st(4);await L.shot(p,pre+'_crack.png');await st(14);await L.shot(p,pre+'_card.png');
 await E("finish(true)");await p.waitForTimeout(400);const own=await E("!!save.heroes.paladin");
 await E("openMenu();storyShow('korunace')");await p.waitForTimeout(700);await L.shot(p,pre+'_end.png');
 await E("$('#fcOk').click()");await p.waitForTimeout(900);await L.shot(p,pre+'_hero.png');
 console.log('paladin owned',own,'errors',errs);await close();})();
