// Novinky: node newsshot.js prefix [cs|en] [od verze]  (vyfotí začátek a posune dolů)
// 11f: přes lib.open (malý iPhone, účet „late“, bez vyskakovacích karet) – dřív na novém menu zůstal jen snímek menu, Novinky se neotevřely.
const L=require('./lib');const pre=process.argv[2]||'n',lang=process.argv[3]||'cs',from=process.argv[4]||'2026-11-08n',phone=process.argv[5]||'se';
(async()=>{const o=await L.open({phone,lang,save:'late'});
 await o.E("save.newsSeen='"+from+"';openMenu();openNews();");await o.p.waitForTimeout(500);
 for(let i=0;i<4;i++){await o.p.screenshot({path:pre+'_'+i+'.png'});await o.p.evaluate(()=>{const n=document.querySelector('#newsPop .nl')||document.querySelector('#newsPop');if(n)n.scrollTop+=420;});await o.p.waitForTimeout(150);}
 const open=await o.p.evaluate(()=>{const n=document.querySelector('#newsPop');return !!n&&getComputedStyle(n).display!=='none';});
 console.log(open?'Novinky otevřené':'POZOR: Novinky se neotevřely',o.errs);await o.close();})();
