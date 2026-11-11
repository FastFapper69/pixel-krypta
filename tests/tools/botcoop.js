// Co-op s botem: lobby (snímky), start, bot se drží v poutu, vybírá karty, oživí hráče, nechá se oživit, neutrácí zlato.
// Spuštění: node botcoop.js [složka snímků=/tmp] [cs|en] [telefon=15]
const L=require('./lib');const out=process.argv[2]||'/tmp',lang=process.argv[3]||'cs',phone=process.argv[4]||'15';
(async()=>{L.prep();const {p,E,errs,close}=await L.open({phone,lang,save:'late'});let bad=0;const ok=(c,m)=>{console.log((c?'OK   ':'CHYBA ')+m);if(!c)bad++;};
await E("save.heroes.mage=1;save.heroes.archer=1;openMenu();$('#mCoop').click()");await p.waitForTimeout(500);await L.shot(p,out+'/botcoop-1-'+lang+'.png');
ok(await E("!$('#coBot').disabled&&$('#coBot').offsetWidth>100"),'tlačítko Hrát s botem je vidět i offline');
await p.click('#coBot');await p.waitForTimeout(400);await L.shot(p,out+'/botcoop-2-'+lang+'.png');
ok(await E("$('#coCodeShow').hidden&&$('#coShare').hidden&&!$('#coGo').disabled&&$('#coBotHeroes').children.length>=3"),'místnost bota: bez kódu, výběr hrdiny bota, Začít jde');
await E("$('#coBotHeroes').children[1].click()");await p.click('#coGo');await p.waitForTimeout(300);
ok(await E("!!(run&&run.coop&&run.bot&&run.pls&&state==='play')"),'běh s botem běží');
// 60 s hry: hráč stojí/chodí v kruhu, bot se má držet v dosahu pouta a žít
const r=await E(`(()=>{const K=window.__krypta;let inB=0,n=0,lv=0,maxD=0;const c0=run.coins;K.god=true;
 for(let i=0;i<40*60;i++){if(state==='levelup'){document.querySelector('#luList button').click();lv++;continue;}if(state!=='play')break;
  const a=run.t*.5;K.force={x:Math.cos(a),y:Math.sin(a)};K.step(1/40);const q=run.pls[1].p,d=Math.hypot(q.x-run.p.x,q.y-run.p.y);n++;if(d>=40&&d<=200)inB++;maxD=Math.max(maxD,d);}
 const pl=run.pls[1];return{inB:inB/n,maxD:Math.round(maxD),lv,st:state,w:Object.keys(pl.W).length,wl:Object.values(pl.W).reduce((a,w)=>a+w.lv,0),hp:pl.p.hp,down:!!pl.p.down,t:run.t|0,spent:run.spent||0};})()`);
console.log(JSON.stringify(r));
ok(r.st==='play'&&r.t>=55,'hra doběhla 60 s bez zaseknutí (žádné čekání na výběr bota)');
ok(r.inB>.85,'bot je v dosahu pouta '+Math.round(r.inB*100)+' % času (max vzdálenost '+r.maxD+')');
ok(r.lv>0&&r.wl>=1+Math.min(r.lv,3)-1,'bot si vybírá karty (zbraně '+r.w+', součet úrovní '+r.wl+', úrovní '+r.lv+')');
ok(!r.spent,'bot neutrácí společné zlato');
await L.shot(p,out+'/botcoop-3-'+lang+'.png');
// hráč padne → bot ho oživí
const rv=await E(`(()=>{const K=window.__krypta;K.god=false;run.enemies.length=0;run.p.inv=0;run.revived=9;run.pet=null;run.skyG=1;hurtPlayer(99999,'test');if(!run.p.down)return{err:'hráč nepadl'};K.god=true;
 let t=0;K.force={x:0,y:0};while(run.p.down&&t<20){if(state==='levelup'){document.querySelector('#luList button').click();continue;}if(state!=='play')return{err:state};run.enemies.length=0;K.step(1/40);t+=1/40;}return{t:+t.toFixed(1),down:run.p.down,hp:run.p.hp};})()`);
console.log(JSON.stringify(rv));ok(rv.down===false,'bot oživil hráče za '+rv.t+' s');
// bot padne → jako duch přijde k hráči a ten ho oživí stáním
const rb=await E(`(()=>{const K=window.__krypta,pl=run.pls[1];pl.revived=9;pl.pet=null;pl.p.inv=0;K.god=false;withPl(pl,()=>{run.skyG=1;hurtPlayer(99999,'test');});K.god=true;if(!pl.p.down)return{err:'bot nepadl'};
 let t=0;K.force={x:0,y:0};while(pl.p.down&&t<25){if(state==='levelup'){document.querySelector('#luList button').click();continue;}if(state!=='play')return{err:state};run.enemies.length=0;K.step(1/40);t+=1/40;}return{t:+t.toFixed(1),down:pl.p.down};})()`);
console.log(JSON.stringify(rb));ok(rb.down===false,'padlý bot přišel k hráči a byl oživen za '+rb.t+' s');
// konec běhu: odměna, návrat do lobby bota
await E("window.__krypta.finish(true)");await p.waitForTimeout(1400);await L.shot(p,out+'/botcoop-4-'+lang+'.png');
ok(await E("state==='over'"),'konec běhu se ukázal');
console.log('chyby JS:',errs);if(errs.length)bad++;await close();process.exit(bad?1:0);})();
