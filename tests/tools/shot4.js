// kapitola IV: snímky lavin, zamrzání, mrazu, nových zbraní a věží: node shot4.js prefix
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const ev=f=>p.evaluate(f);const shot=async n=>{await p.waitForTimeout(120);await p.screenshot({path:pre+'_'+n+'.png'});};
 await ev(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;const st=K.step;K.step=dt=>{if(K.state==='levelup'){const o=K.levelOptions();K.applyOption(o.find(x=>x.k!=='fuse')||o[0]);}st(dt);};});
 // avalanche warning, then the strike
 await ev(()=>{const K=window.__krypta;K.startRun('knight','soutezka');const R=K.run;R.t=60;for(let i=0;i<60*30&&!R.aval.some(q=>!q.hit&&q.t<q.max*.5);i++)K.step(1/60);});await shot('aval_warn');
 await ev(()=>{const K=window.__krypta,R=K.run;for(let i=0;i<60*4&&!R.aval.some(q=>q.hit&&q.sw>.15);i++)K.step(1/60);});await shot('aval_hit');
 // throne frost cycle
 await ev(()=>{const K=window.__krypta;K.startRun('knight','zima');const R=K.run;R.t=R.map.dur-1;for(let i=0;i<300;i++)K.step(1/60);const Q=R.enemies.find(e=>e.boss);Q.hp=Q.max*.45;for(let i=0;i<60*16&&!(R.fcy&&R.fcy.t<R.fcy.max*.5);i++)K.step(1/60);});await shot('frost');
 // taiga cold
 await ev(()=>{const K=window.__krypta;K.startRun('knight','tajga');const R=K.run;R.p.x+=300;K.god=false;for(let i=0;i<60*30;i++){K.step(1/60);R.p.hp=R.p.max;}K.god=true;});await shot('cold');
 // weapons
 await ev(()=>{const K=window.__krypta;K.startRun('warlord','jezero');for(let i=0;i<60*25;i++)K.step(1/60);const R=K.run;for(let i=0;i<120&&!R.fx.some(f=>f.k==='halb'&&f.life>f.max*.5);i++)K.step(1/60);});await shot('halberd');
 await ev(()=>{const K=window.__krypta;K.startRun('tamer','pevnost');for(let i=0;i<60*25;i++)K.step(1/60);const R=K.run;for(let i=0;i<120&&!R.fx.some(f=>f.k==='whip'&&f.life>f.max*.5);i++)K.step(1/60);});await shot('whip');
 // towers: build both next to the hero
 await ev(()=>{const K=window.__krypta;K.startRun('builder','pevnost');const R=K.run;R.coins=999;R.deck=['hearth','icelance','arrow','fire'];for(let i=0;i<60*20;i++)K.step(1/60);
   try{K.buildTower('hearth');R.p.x+=40;K.buildTower('icelance');R.p.x-=20;}catch(e){window.__e=e.message;}for(let i=0;i<60*4;i++)K.step(1/60);});await shot('towers');
 console.log('build err',await ev(()=>window.__e||null),'towers',await ev(()=>window.__krypta.run.towers.map(t=>t.k)));
 console.log('errors',errs.slice(0,5));await b.close();})();
