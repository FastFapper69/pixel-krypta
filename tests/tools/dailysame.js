// Denní a týdenní výzva: stejný seed = stejné nepřátele a nabídky úrovní, i když se hraje na jinak rychlém telefonu
// a vznikne jinak částic (simulace: jiný krok dt a navíc spotřeba náhody efekty). node dailysame.js
const {chromium}=require('playwright');
async function play(p,dt,noise,wk){await p.reload();await p.waitForTimeout(400);return p.evaluate(([dt,noise,wk])=>{const K=window.__krypta,E=x=>K._ev(x);
  E("save.sound=false;save.music=false;save.tut=1;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0");
  const di=E('dailyInfo?dailyInfo():null');
  if(wk)E("startRun('knight',wkInfo().map,{wk:1})");else E("startRun('knight',dailyInfo().map,{mod:dailyInfo().mod.id})");
  const sp=[],ups=[];const se=E('spawnEnemy');window.__sp=sp;
  // zaznamenat jen vlny z režiséra spawnů (ne nepřátele vyvolané mechanikami nebo dělením, ty závisí na hraní)
  E("(()=>{const u=updateSpawns0,c=chooseEnemy;let on=0;updateSpawns0=function(dt){on=1;try{return u(dt)}finally{on=0}};chooseEnemy=function(){const r=c();if(on)window.__sp.push(r);return r;};})()");
  E("(()=>{const o=levelOptions;levelOptions=function(){const r=o.apply(this,arguments);window.__ups.push(r.map(x=>(x.k||'')+':'+(x.id||x.f&&x.f.id||'')).join(','));return r;};})()");window.__ups=ups;
  E("run.p.hp=run.p.maxHp=1e9");
  for(let t=0;t<120;t+=dt){if(noise)for(let i=0;i<noise;i++)Math.random();E('tick('+dt+')');if(E("state")==='levelup'){E("(()=>{const b=document.querySelector('#luList button');if(b)b.click();})()");}
    if(E("state")==='fuse'){E("try{fuseSkip&&fuseSkip()}catch(_){}");}}
  const r={sp:sp.slice(0,80).join(' '),ups:ups.slice(0,6)};E('openMenu()');return r;},[dt,noise,wk]);}
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);let bad=0;
 for(const wk of [0,1]){const A=await play(p,1/60,0,wk),B=await play(p,1/40,7,wk);
  // počet nepřátel a úrovní se smí lišit (jinak rychlé zabíjení), pořadí musí být stejné
  const a0=A.sp.split(' '),b0=B.sp.split(' '),n=Math.min(a0.length,b0.length,60),nu=Math.min(A.ups.length,B.ups.length);
  const sameSp=a0.slice(0,n).join(' ')===b0.slice(0,n).join(' '),sameUp=JSON.stringify(A.ups.slice(0,nu))===JSON.stringify(B.ups.slice(0,nu));
  console.log(wk?'týdenní':'denní','| nepřátelé stejní:',sameSp,'| nabídky stejné:',sameUp,'| porovnáno nepřátel',n,'nabídek',nu);
  if(!sameSp){const a=A.sp.split(' '),c=B.sp.split(' ');const i=a.findIndex((x,k)=>x!==c[k]);console.log('  liší se od',i,':',a.slice(i,i+5).join(' '),'vs',c.slice(i,i+5).join(' '));}
  if(!sameUp)console.log('  ',A.ups[0],'|',B.ups[0]);if(!sameSp||!sameUp)bad++;}
 console.log('chyby',errs.slice(0,3));await b.close();process.exit(bad?1:0);})();
