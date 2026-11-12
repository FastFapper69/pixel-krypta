// 12h: odměna z truhly v jiném okně (Nástěnka #qPop) po dřívějším otevření v Obchodě (#chestPop) – tlačítko Super musí jít zmáčknout
// a truhla se musí kreslit do vlastního plátna (dřív $('#rvOk') / $('#rvCv') chytly staré prvky ze skrytého okna obchodu).
const L=require('./lib');(async()=>{L.prep();const {p,E,errs,close}=await L.open({phone:'15',save:'late'});let bad=0;const no=m=>{bad++;console.log('CHYBA: '+m);};
 await E("econInit();openChestShop();revealItem(makeItem(1),'wood')");await p.waitForTimeout(2200);await p.click('#chestPop #rvOk');await p.waitForTimeout(300);
 if(!await E("$('#chestPop').hidden"))no('obchod: Super nezavřel okno');
 await E("openQuests();window.__done=0;revealItem(makeItem(1),'iron',null,{pop:$('#qPop'),done:()=>{window.__done=1;}})");await p.waitForTimeout(800);
 const px=await E("(()=>{const c=$('#qPop canvas');if(!c)return -1;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i])n++;return n})()");
 if(px<=0)no('Nástěnka: truhla se nekreslí do vlastního plátna ('+px+')');
 await p.waitForTimeout(1600);await L.shot(p,'/tmp/revealpop.png');await p.click('#qPop #rvOk');await p.waitForTimeout(300);
 if(!await E("$('#qPop').hidden&&window.__done===1"))no('Nástěnka: Super nejde zmáčknout / nezavolal pokračování');
 if(errs.length)no('chyby JS '+errs.join(' | '));console.log(bad?'revealpop: '+bad+' chyb':'revealpop: OK');await close();process.exit(bad?1:0);})();
