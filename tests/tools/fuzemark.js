// 10p: odznak fúze na kartě nové úrovně + kroužek rytmu pod hrdinou. node fuzemark.js <složka> [cs|en] [telefon]
// Kontroluje: odznak jen když hráč nese druhou půlku receptu, „připraveno“ jen když obě zbraně dosáhnou 5, tajný recept až po ukutí,
// odznak nepřekrývá název ani čísla, kroužek jde vypnout posuvníkem. Snímky karet a čtyř fází kroužku.
const L=require('./lib.js'),path=require('path');
const out=process.argv[2]||'.',lang=process.argv[3]||'cs',phone=process.argv[4]||'se';let bad=0; require('fs').mkdirSync(out,{recursive:true});
const ok=(c,t)=>{if(!c){bad++;console.log('✗',t);}else console.log('✓',t);};
const W=lv=>"{lv:"+lv+",cd:.4,ang:0,tick:0,mul:1,r:0,pulse:0}";
const show=opts=>"(()=>{const O="+opts+";const lo=levelOptions;levelOptions=()=>O;try{run.luT=0;setState('play');openLevelUp();}finally{levelOptions=lo;}})()";
(async()=>{L.prep();const o=await L.open({phone,lang,save:'late'});
 await o.E("openMenu();startRun('knight','hrbitov',{});for(let i=0;i<300;i++)step(1/30);$('#toast').style.display='none';");
 await o.p.evaluate(()=>document.fonts.ready);
 const H=(id,lv)=>o.E("JSON.stringify(fuseHint('"+id+"',"+lv+"))").then(JSON.parse);
 await o.E("run.W={blade:"+W(3)+"};run.fused={};");
 ok((await H('aura',1))?.[0]?.id==='vortex'&&!(await H('aura',1))[0].rdy,'aura k čepeli → Vír ostří, ještě ne připraveno');
 ok(await H('bolt',1)===null,'zbraň bez partnera odznak nemá');
 await o.E("run.W={blade:"+W(5)+",aura:"+W(4)+"};");
 ok((await H('aura',5))?.[0]?.rdy===true,'obě na úrovni 5 → připraveno');
 await o.E("run.W={fireball:"+W(3)+"};delete save.codex.f.steam;");
 ok(!(await H('frost',1)||[]).some(f=>f.id==='steam'),'tajný recept se neprozradí');
 await o.E("save.codex.f.steam=true;");
 ok((await H('frost',1)||[]).some(f=>f.id==='steam'),'po ukutí se tajný recept ukazuje');
 await o.E("save.feat.fuse=0;save.cheat=false;");ok(await H('frost',1)===null,'bez odemčených fúzí nic');await o.E("save.feat.fuse=1;");
 // snímky karet
 const ST={a:"run.W={blade:"+W(5)+",aura:"+W(4)+",fireball:"+W(2)+"};"+show("[{k:'w',id:'aura',lv:5},{k:'w',id:'frost',lv:1},{k:'p',id:'regen',lv:1}]"),
  b:"run.W={arrows:"+W(3)+",blade:"+W(2)+",bolt:"+W(5)+"};"+show("[{k:'w',id:'frost',lv:1},{k:'w',id:'lightning',lv:1},{k:'w',id:'arrows',lv:4},{k:'p',id:'eye',lv:3}]")};
 for(const k in ST){await o.E(ST[k]);await o.p.waitForTimeout(350);
  const r=await o.p.evaluate(()=>[...document.querySelectorAll('#luList .k-card')].flatMap(b=>{const R=b.getBoundingClientRect(),o=[];for(const z of b.querySelectorAll('.fzb')){const q=z.getBoundingClientRect();
    if(q.left<R.left||q.bottom>R.bottom-4)o.push('odznak mimo kartu');for(const e of b.querySelectorAll('.nm,.st>span')){const t=e.getBoundingClientRect();if(q.right+2>t.left&&q.left<t.right&&q.bottom>t.top+3&&q.top<t.bottom-3)o.push('odznak přes text: '+e.textContent);}}return o;}));
  ok(!r.length,'karty '+k+' '+lang+' '+phone+(r.length?' – '+r.join(', '):''));
  await o.p.screenshot({path:path.join(out,'fz_'+k+'_'+lang+'_'+phone+'.png')});}
 // kroužek rytmu: čtyři fáze, pak vypnuto
 await o.E("run.luT=0;setState('play');run.W={blade:"+W(1)+"};run.enemies.length=0;run.p.inv=99;");
 // snímek přímo z plátna ve stejném kroku jako render (smyčka hry mezitím fázi neposune); výřez kolem hrdiny 4× zvětšený
 const fs=require('fs');
 const fr=async(n,bp)=>{const u=await o.E("(()=>{M.acc=0;M.step=1+Math.round("+bp+"*4);M.beatPos="+bp+";M.pulse=0;run.p.inv=0;run.p.flash=0;render();const c=$('#cv'),k=c.width/VW,q=document.createElement('canvas');q.width=q.height=280;const g=q.getContext('2d');g.imageSmoothingEnabled=false;"+
   "g.drawImage(c,(VW/2-35)*k,(VH/2-35)*k,70*k,70*k,0,0,280,280);return q.toDataURL();})()");fs.writeFileSync(path.join(out,'bt_'+n+'_'+phone+'.png'),Buffer.from(u.split(',')[1],'base64'));};
 await fr('1_doba1',4.02);await fr('2_pul',5.5);await fr('3_pred1',7.9);await fr('4_doba3',6.05);
 await o.E("save.bt=0;");await fr('5_vyp',4.02);await o.E("save.bt=null;");
 ok(!o.errs.length,'bez chyb JS'+(o.errs.length?': '+o.errs.slice(0,3).join(' | '):''));await o.close();process.exit(bad?1:0);})();
