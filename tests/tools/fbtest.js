// feedback window: open from Settings, write, send (stubbed server), reward once per day; node fbtest.js <prefix> [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2]||'fb',lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2,locale:lang==='en'?'en-US':'cs-CZ'});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{localStorage.setItem('pixel-krypta-lang',l);localStorage.setItem('pixel-krypta-v1',JSON.stringify({coins:100,heroes:{knight:true},cleared:{hrbitov:true},stats:{runs:5},tut:1,newsSeen:'2026-11-07z',ch:1,unl:{},nick:'Tester'}));},lang);
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(900);
await p.evaluate(()=>{const K=window.__krypta;K.ON.ready=true;K.ON.me={id:'u1'};window.__sent=[];K.ON.sb={from:t=>({insert:async row=>{window.__sent.push([t,row]);return{error:null};}})};});
await p.click('#mSet');await p.waitForTimeout(400);await p.screenshot({path:pre+'-1.png'});
await p.click('#mFb');await p.waitForTimeout(400);
await p.click('#fbKind button[data-fk="balanc"]');await p.click('#fbStars button[data-r="4"]');
await p.click('#fbText');await p.keyboard.type('Kostnice je super, ale zvonice je moc tezka.');await p.waitForTimeout(200);await p.screenshot({path:pre+'-2.png'});
await p.click('#fbSend');await p.waitForTimeout(600);
const r1=await p.evaluate(()=>{const K=window.__krypta;return{coins:K.save.coins,fb:K.save.fb,sent:window.__sent.map(s=>[s[0],s[1].kind,s[1].rating,s[1].msg.length,s[1].ver]),pop:document.querySelector('#newsPop').hidden};});
await p.click('#mFb');await p.waitForTimeout(300);await p.fill('#fbText','Druhý názor ve stejný den, bez odměny.');await p.click('#fbSend');await p.waitForTimeout(500);
const r2=await p.evaluate(()=>({coins:window.__krypta.save.coins,n:window.__sent.length}));
await p.waitForTimeout(400);await p.screenshot({path:pre+'-3.png'});
const typed=await p.evaluate(()=>window.__sent[0]&&window.__sent[0][1].msg);console.log('typed:',typed);console.log(JSON.stringify(r1),JSON.stringify(r2),errs);await b.close();})();
