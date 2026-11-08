// strom vylepšení (08g): screenshoty obrazovky (nový / pokročilý hráč), detail uzlu, nákup a účinky v běhu: node tree.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{localStorage.setItem('pixel-krypta-lang','cs');if(!sessionStorage.getItem('adv'))return;const cl={};for(const m of ['hrbitov','bazina','kostnice','zvonice','trun','poust','kanon','karavana','hrobka','brana'])cl[m]=true;
  localStorage.setItem('pixel-krypta-v1',JSON.stringify({coins:30000,mats:{shard:2000,ess:120},heroes:{knight:true},cleared:cl,stats:{runs:40},tut:1,newsSeen:99,ch:1,econV:2,metaV:2,meta:{dmg:30,build:30,hp:22,spd:12,revive:2,mag:8,xp:5,a1:1,a2:1,d1:1,l1:1,ma:4}}));});
const shot=async n=>{await p.waitForTimeout(350);await p.screenshot({path:pre+'_'+n+'.png'});};
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(700);
await p.evaluate(()=>window.__krypta._ev("save.coins=900;persist();openForge()"));await p.waitForTimeout(200);await p.evaluate(()=>document.querySelector('#scr-forge [data-to=shop]').click());await shot('new');
await p.evaluate(()=>sessionStorage.setItem('adv','1'));await p.reload();await p.waitForTimeout(800);
await p.evaluate(()=>{window.__krypta._ev("openForge()");document.querySelector('#scr-forge [data-to=shop]').click();});await shot('adv');
await p.evaluate(()=>document.querySelector('#scr-shop').scrollTo?document.querySelector('#scr-shop').scrollTo(0,9999):0);await p.evaluate(()=>window.scrollTo(0,9999));await shot('adv_bottom');
await p.evaluate(()=>document.querySelector('.tn[data-id=a3]').click());await shot('pop');
const r=await p.evaluate(()=>{const K=window.__krypta,o={};o.before=!!K.save.meta.a3;document.querySelector('#tnBuy').click();o.after=!!K.save.meta.a3;o.coins=K.save.coins;
  document.querySelector('.tn[data-id=d5]').click();o.d5lock=document.querySelector('#tnBuy').disabled;document.querySelector('#tnClose').click();
  // run effects
  K.save.sound=false;K.save.music=false;K.startRun('knight','hrbitov');const R=K.run;o.startLv=R.W.blade.lv;o.shield=R.p.sh;o.opts=K.levelOptions().length;
  K.god=false;R.enemies.length=0;const hp=R.p.hp;K._ev("hurtPlayer(20,'t')");o.shieldAbsorbed=R.p.hp===hp&&!R.p.sh;return o;});
console.log(JSON.stringify(r),'errors',errs.slice(0,4));await b.close();})();
