// Síň slávy s vymyšlenými hráči (bez serveru): node boardshot.js prefix [cs|en] [tab]
const {chromium}=require('playwright');const pre=process.argv[2]||'b',lang=process.argv[3]||'cs',tab=process.argv[4]||'celkem';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 await p.evaluate(tab=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;K.save.newsSeen='2099';
  E("onlineConfigured=()=>true");
  E(`const nicks=['Fappoleon','KryptoKing','Jarda','Majka_77','Bobr','LuckyLuke','Pepa z depa','Zuzka','Nekro','Hrobník'];
   const TT=ACH.find(a=>a.title);ON.ready=true;ON.me={id:'u3'};boardTab='${tab}';
   boardRows=nicks.map((n,i)=>({id:'u'+i,nick:n,stats:{runs:40-i*3,wins:31-i*3,kills:52340-i*4900,tot:{combo:812-i*61},best:{hrbitov:{t:240-i*3,won:1,nm:i<3?2:0,kills:900-i*40,hero:'knight'}},daily:{d:today(),t:300-i*10,won:i%2,kills:700-i*30,hero:i%2?'mage':'bard'}},
     save:{title:i%2?TT.id:undefined,heroes:{knight:1,mage:i<6,bard:i<3,archer:1,builder:i<4},cleared:Object.fromEntries(MAP_IDS.slice(0,25-i*2).map(m=>[m,1])),ach:i%2?{[TT.id]:1}:{}}}));
   setState('board');renderBoard();`);},tab);
 await p.waitForTimeout(300);await p.screenshot({path:pre+'_top.png'});
 await p.evaluate(()=>{document.querySelector('#scr-board').scrollTop=600;});await p.waitForTimeout(200);await p.screenshot({path:pre+'_list.png'});
 console.log(errs);await b.close();})();
