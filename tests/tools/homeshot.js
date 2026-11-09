// Snímek hlavního menu (iPhone, simulované okraje): node homeshot.js prefix [cs|en] [šířka] [výška]
// env ZOOM=1 přidá zvětšený výřez tlačítek, PRESS=1 snímek se stisknutým HRÁT
const {chromium}=require('playwright');const pre=process.argv[2]||'home',lang=process.argv[3]||'cs',W=+(process.argv[4]||393),H=+(process.argv[5]||852);
const MID="save.coins=939;save.mats.shard=698;save.mats.ess=27;save.stats=save.stats||{};save.stats.runs=30;save.cleared=save.cleared||{};for(const C of CHAPTERS.slice(0,3))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};"+
 "for(let i=0;i<6;i++)addItem(makeItem(i%4));twInit();petInit();try{featCheck()}catch(e){};save.featNew=[];save.featSum=0;save.storyNew=[];persist();";
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:3,isMobile:true,hasTouch:true});
 await c.addInitScript(l=>{localStorage.setItem('pixel-krypta-lang',l);const s=document.createElement('style');s.textContent=':root{--sat:47px!important;--sab:34px!important}';document.addEventListener('DOMContentLoaded',()=>document.head.appendChild(s));},lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+(process.env.FRESH?"":MID));
 if(process.env.SKY)await E("featInit();save.feat.sky=1");await E("openMenu()");await p.evaluate(()=>document.querySelectorAll(".featpop,#featPop,#scr-feat").forEach(e=>e.remove()));await p.waitForTimeout(1800);
 await p.screenshot({path:`${pre}.png`});
 if(process.env.ZOOM){const r=await p.evaluate(()=>{const b=document.querySelector('#mStack').getBoundingClientRect();return {x:0,y:Math.max(0,b.top-24),width:innerWidth,height:Math.min(innerHeight,b.bottom+12)-Math.max(0,b.top-24)}});
  await p.screenshot({path:`${pre}_z.png`,clip:r});
  await p.screenshot({path:`${pre}_top.png`,clip:{x:0,y:0,width:W,height:110}});}
 if(process.env.PRESS){const b=await p.$('#mHero');const bb=await b.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(150);
  await p.screenshot({path:`${pre}_press.png`,clip:{x:0,y:bb.y-30,width:W,height:bb.height+60}});await p.mouse.up();}
 console.log('errors',JSON.stringify(errs.slice(0,5)));await b.close();})();
