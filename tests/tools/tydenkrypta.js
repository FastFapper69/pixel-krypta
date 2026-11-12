// 12m: Týden v kryptě – deska 7 dní za návrat. node tydenkrypta.js [cs|en] [se|15]
// Ověří: nováček (< 3 běhy) desku nevidí; v menu vyskočí sama; vyzvednutí jen jednou denně; vynechaný den nic nemaže;
// 7 dní za sebou pro všechna témata (truhly, karta věže, mazlíček, esence); 4. týden = profilový obrázek; snímky desky.
const L=require('./lib');const lang=process.argv[2]||'cs',phone=process.argv[3]||'se';
(async()=>{const {p,E,errs,close}=await L.open({save:'mid',lang,phone,lw:1});let bad=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)bad++;};
 // nováček
 await E("save.stats.runs=2;delete save.lw;1");ok(!(await E("lwDue()")),'nováček se 2 běhy desku nemá');
 await E("save.stats.runs=5;save.inv=[];delete save.lw;1");ok(await E("lwDue()"),'po 3 bězích je odměna připravená');
 // vyskočí v menu sama
 await E("openMenu();1");await p.waitForTimeout(1200);
 ok(await E("!!document.querySelector('#featPop:not([hidden]) .lw')"),'deska vyskočila v menu');
 await p.screenshot({path:'out/tyden_'+lang+'_1.png'});
 // den 1 tlačítkem
 const g0=await E("save.coins");await p.click('#lwGo');await p.waitForTimeout(500);
 ok(await E("save.lw.n===1&&save.lw.d===today()&&save.coins>"+g0),'den 1: zlato připsané, deska posunutá');
 ok(!(await E("lwDue()"))&&!(await E("lwClaim(null)")),'podruhé ve stejný den nic');
 await p.screenshot({path:'out/tyden_'+lang+'_2.png'});
 // vynechané dny nic nemažou (jen se změní datum)
 await E("save.lw.d='2000-01-01';1");ok(await E("lwDue()&&save.lw.n===1"),'po vynechaných dnech pokračuje dnem 2');
 // celý týden pro každé téma (bez UI, odhalení předmětu se zavře)
 const sum=await E(`(()=>{const out=[];const L=save.lw;save.feat=Object.assign(save.feat||{},{arsenal:1,pets:1});
   L.n=0;L.wk=0;L.tid='';for(let w=0;w<8;w++){const T=lwTheme().id,got=[];for(let d=0;d<7;d++){L.d='x';save.inv=[];const pc=(save.pets.cards||[]).length,tc=(save.tw.cards||[]).length,ic=save.inv.length,es=save.mats.ess||0,av=L.av.length;
       const rw=lwDays()[L.n];if(!lwClaim(null))got.push('CHYBA');else got.push((rw.chest?'truhla:'+rw.chest:'')+(rw.tower?((save.tw.cards||[]).length>tc?'věž':'věž?'):'')+(rw.pet?((save.pets.cards||[]).length>pc?'mazlíček':'mazlíček?'):'')+(rw.ess?'esence':'')+(rw.av?(L.av.length>av?'obrázek':'obrázek?'):'')+(rw.g?'zlato':'')+(rw.m?'úlomky':'')+(rw.c?'svíčky':''));
       document.querySelectorAll('#lwRv,#chestPop').forEach(x=>x.hidden=true);}
     out.push((w+1)+'. '+T+': '+got.join(', '));}
   return {out,wk:L.wk,av:L.av.slice(),avOk:avAll().filter(a=>a.sec==='week'&&a.ok).length};})()`);
 sum.out.forEach(x=>console.log('   '+x));
 ok(!sum.out.join().includes('?')&&!sum.out.join().includes('CHYBA'),'všech 8 týdnů: každá odměna opravdu přišla');
 ok(sum.wk===8&&sum.av.length===2&&sum.avOk===2,'4. a 8. týden: profilové obrázky ('+sum.av.join(', ')+')');
 // snímek: 4. týden (obrázek na 7. dni), dnešek = den 5
 await E("save.lw.wk=3;save.lw.n=4;save.lw.tid='tower';save.lw.d='x';document.querySelectorAll('#lwRv').forEach(x=>x.hidden=true);lwShow();1");await p.waitForTimeout(600);
 await p.screenshot({path:'out/tyden_'+lang+'_3.png'});
 // plný inventář: truhla se nevyzvedne a nic se neposune
 await E("save.lw.n=2;save.lw.d='x';save.inv=Array.from({length:INV_MAX},()=>makeItem(0));1");ok(!(await E("lwClaim(null)"))&&await E("save.lw.n===2"),'plný inventář: truhla počká');
 ok(!errs.length,'bez chyb JS '+errs.slice(0,2).join(' | '));await close();process.exit(bad?1:0);})();
