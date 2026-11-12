// 12s: značka (pečeť) na Obchodu jen když čeká denní truhla zdarma; po otevření truhly zmizí. node obchod-znacka.js [cs|en] [se|13]
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{const {p,E,errs,close}=await L.open({save:'mid',lang,phone});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 const has=()=>E("$('#mChest').classList.contains('has')");
 await E("save.feat.gear=1;delete save.daily.chest;persist();openMenu();1");await p.waitForTimeout(600);
 ok(await has(),'truhla zdarma čeká → Obchod má značku');
 await p.screenshot({path:'out/obchod-znacka_'+lang+'_'+phone+'_menu.png',clip:{x:0,y:480,width:await E("innerWidth"),height:await E("innerHeight")-480}});
 await E("save.daily.chest=today();persist();openMenu();1");await p.waitForTimeout(400);ok(!(await has()),'truhla vyzvednutá → bez značky');
 await E("delete save.daily.chest;save.feat.gear=0;persist();openMenu();1");await p.waitForTimeout(400);ok(!(await has()),'Obchod ještě zamčený → bez značky');
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
