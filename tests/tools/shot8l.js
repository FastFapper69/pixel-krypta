// 08l: Novinky, koupě hrdiny, štítky nasazených kusů, Síň slávy Kombo: node shot8l.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(800);const E=f=>p.evaluate(f);const shot=async n=>{await p.waitForTimeout(400);await p.screenshot({path:pre+'_'+n+'.png'});};
await E(()=>{const K=window.__krypta;K.save.coins=5000;K._ev('openNews(true)');});await shot('news');
await E(()=>{document.querySelector('#newsOk').click();window.__krypta._ev("confirmHero('mage')");});await shot('hero');
await E(()=>{const K=window.__krypta,E2=K._ev;document.querySelector('#buyNo').click();K.econInit();for(let i=0;i<10;i++)E2('addItem')(K.makeItem(i%4));const it=K.save.inv[7];K.save.eq.knight=K.save.eq.knight||{};K.save.eq.knight[it.s]=it.u;K.openHero();document.querySelector('#invGrid').scrollIntoView({block:'center'});});await shot('inv');
await E(()=>{const K=window.__krypta;K._ev('openTowers()');});await shot('towers');
await E(()=>{const K=window.__krypta;K._ev('petInit()');for(let i=0;i<3;i++)K.save.pets.cards.push({u:'pq'+i,k:'owl',r:1,lv:0,b:{},st:i,pet:1});K._ev('openPets()');});await shot('pets');
await E(()=>{const K=window.__krypta;K._ev("boardTab='kombo'");K._ev('setState("board")');K.setBoardRows&&K.setBoardRows([{id:'a',nick:'Fappoleon',stats:{runs:9,wins:4,kills:900,tot:{combo:312}},save:{heroes:{knight:1},cleared:{hrbitov:1}}},{id:'b',nick:'Jakub',stats:{runs:5,wins:2,kills:500,tot:{combo:188}},save:{heroes:{knight:1,mage:1},cleared:{}}},{id:'c',nick:'Tester',stats:{runs:2,wins:0,kills:90,tot:{combo:40}},save:{}}]);K._ev('renderBoard()');});await shot('board');
console.log('errors',errs);await b.close();})();
