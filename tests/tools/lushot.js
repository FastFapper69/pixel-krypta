// Snímky nabídky nové úrovně (nová grafika): node lushot.js <složka> [cs|en] [telefon] [dpr]
// Stavy: běžná nabídka, fúze, čtyři karty s dlouhými názvy, lektvar a měšec, nově odemčená zbraň.
const L=require('./lib.js'),path=require('path');
const out=process.argv[2]||'.',lang=process.argv[3]||'cs',phone=process.argv[4]||'15',dpr=+(process.argv[5]||2);
const show=opts=>"(()=>{const O="+opts+";const lo=levelOptions;levelOptions=()=>O;try{run.luT=0;setState('play');openLevelUp();}finally{levelOptions=lo;}})()";
const ST={
 mix:show("[{k:'w',id:'lightning',lv:1},{k:'w',id:'blade',lv:3},{k:'p',id:'regen',lv:1}]"),
 fuse:"run.W.bolt={lv:5,cd:.4,ang:0,tick:0,mul:1,r:0,pulse:0};run.W.lightning={lv:5,cd:.4,ang:0,tick:0,mul:1,r:0,pulse:0};run.fuseMiss=2;"+show("[{k:'w',id:'fireball',lv:4},{k:'p',id:'haste',lv:2},{k:'p',id:'shield',lv:5}]"),
 four:"delete run.W.bolt;delete run.W.lightning;run.fuseMiss=0;"+show("[{k:'w',id:'fireball',lv:2},{k:'w',id:'bolt',lv:3},{k:'p',id:'eye',lv:3},{k:'w',id:'frost',lv:6}]"),
 last:show("[{k:'heal'},{k:'gold'}]"),
 fresh:"save.wNew=['note'];"+show("[{k:'w',id:'note',lv:1},{k:'p',id:'magnet',lv:4},{k:'p',id:'greed',lv:1}]")};
(async()=>{L.prep();const o=await L.open({phone,lang,save:'late',dpr});
 await o.E("openMenu();startRun('knight','hrbitov',{});for(let i=0;i<300;i++)step(1/30);$('#toast').style.display='none';");
 await o.p.evaluate(()=>document.fonts.ready);
 for(const k of (process.argv[6]||Object.keys(ST).join(',')).split(',')){await o.E(ST[k]);await o.p.waitForTimeout(350);
  const bad=await o.p.evaluate(()=>[...document.querySelectorAll('#luList .k-card')].flatMap(b=>{const r=b.getBoundingClientRect(),o=[];for(const e of b.querySelectorAll('.nm,.st>span,.st>img')){const q=e.getBoundingClientRect();if(q.right>r.right-8||q.bottom>r.bottom-6)o.push(e.textContent||'ikona');}
    const n=b.querySelector('.nm').getBoundingClientRect(),s=b.querySelector('.pips');if(s&&n.right>s.getBoundingClientRect().left-4)o.push('název přes tečky: '+b.querySelector('.nm').textContent);if(r.width%2||r.height%2)o.push('lichý rozměr');return o;}));
  if(bad.length)console.log('PŘETÉKÁ',k,lang,phone,bad);
  await o.p.screenshot({path:path.join(out,'lu_'+k+'_'+lang+'_'+phone+'.png')});}
 console.log(o.errs.length?'CHYBY '+o.errs.slice(0,5).join(' | '):'bez chyb JS ('+lang+', '+phone+')');await o.close();})();
