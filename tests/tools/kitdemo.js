// Zkouška stavebnice kapitol (08y): v prohlížeči přidá 3 zkušební mapy a bosse jen z dílů stavebnice,
// ověří mechaniky (strike/push/pull/slow), bosse (kit), hudbu (songKit) a udělá snímky. Do hry nic nepřidává.
// node kitdemo.js <prefix>
const {chromium}=require('playwright');const pre=process.argv[2]||'kd';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 await p.evaluate(()=>window.__krypta._ev("openLevelUp=function(){run.pending=0;run.chestOpen=false;}"));
 await p.evaluate(()=>window.__krypta._ev(`(()=>{
  Object.assign(KIT_PROPS,{
   kd_stone:{rows:['..aaa.','.awaab','aaaaab','.abbbb'],pal:{a:'#5a5470',b:'#3a3450',w:'#8a84a8'}},
   kd_lamp:{mirror:false,rows:['.yy.','yyyy','.kk.','.kk.','.kk.','.kk.','kkkk'],pal:{y:'#9af0ff',k:'#3a3a54'}},
   kd_tree:{big:1,rows:['...gg...','..gggg..','.gggggg.','gggggggg','.gggggg.','...nn...','...nn...','..nnnn..'],pal:{g:'#3a5a8a',n:'#4a3a5a'}},
   kd_crys:{rows:['..u...','.uiu..','.uiu.u','uuiuuu','.uuuu.'],pal:{u:'#a87aff',i:'#f0e0ff'}}});
  const base={dur:200,size:900,grade:'#8a7aff',gradeA:.18,dark:.35,amb:'#0a0818',ambient:'mote',c1:'#4a4468',speedMul:1,base:1,boss:'kdboss',pools:0,
   spawns:[{e:'skeleton',from:0,w:3},{e:'bat',from:0,w:2},{e:'ghost',from:1,w:2}],elites:[{t:60,e:'golem'}],events:[],hpm:3.3,spx:.9,gb:290,dmm:1.6};
  const common={ground:['#2a2640','#322e4a','#3a3654','#433e5e','#4c4668','#565072'],wall:['#12101c','#1a1626','#221e30','#2a263a'],bits:[['#5a5478','#8a84b0']],spark:'#e8e0ff',shadow:'#0a0814'};
  MAPS.kd1={...base,name:'Zkouška 1',desc:'',seed:901,style:'kit',kit:{...common,path:['#3a3448','#443e54','#4e4860','#58526c'],accent:['#3a4a6a','#44567a'],layout:'paths',
    camp:{k:'kd_lamp',light:{r:40,col:'#9af0ff',a:.7}},props:[{k:['kd_tree'],n:60,tall:1,r:30},{k:['kd_stone','kd_crys'],n:70,r:20,light:{r:24,col:'#a87aff',a:.5},lightEvery:3}],
    mech:[{id:'strike',every:2,from:2,r:30,col:'#a87aff',tip:'Z nebe padají hvězdy!'}]}};
  MAPS.kd2={...base,name:'Zkouška 2',desc:'',seed:902,style:'kit',kit:{...common,tile:['#3a3654','#46405e','#524c6a','#5e5876'],layout:'plaza',R:170,zone:{pal:['#1a2a5a','#203468','#263e76','#2e4a84'],thr:.6},
    camp:{k:'kd_lamp',light:{r:40,col:'#9af0ff',a:.7}},props:[{k:'kd_lamp',n:12,at:'ring',ring:200,tall:1,light:{r:34,col:'#9af0ff',a:.6}},{k:['kd_tree'],n:40,tall:1,r:30},{k:'kd_crys',n:20,at:'zone',r:26}],
    mech:[{id:'slow',slow:.6},{id:'push',period:8,dur:4,from:1,force:30,tip:'Hvězdný vítr!'}]}};
  MAPS.kd3={...base,name:'Zkouška 3',desc:'',seed:903,style:'kit',finale:1,kit:{...common,tile:['#2e2a46','#3a3654','#46405e','#524c6a'],layout:'arena',R:280,
    props:[{k:['kd_crys','kd_lamp'],n:16,at:'ring',ring:300,tall:1,light:{r:30,col:'#a87aff',a:.7}},{k:['kd_tree','kd_stone'],n:40,at:'edge',tall:1,r:30}],
    mech:[{id:'pull',dy:-200,r:240,core:40,col:'#b08aff'}]}};
  BOSS_DEFS.kdboss={name:'Zkušební boss',...kitBoss(5,0,0),spd:22,r:15,pat:'kit',pal:{a:'#6a4ab8',b:'#3a2a78',c:'#c8a8ff'},rows:BOSS_DEFS.slimeking.rows,
    kit:{move:'keep',keep:[100,70],moves:[{on:'beat',every:3,do:'ring',n:12},{on:'bar',every:2,do:'fan',n:5},{on:'bar',every:3,at:1,do:'summon',e:'bat'},{on:'bar',every:4,at:2,do:'strike',n:2}],
      ph2:{at:.5,txt:'Hvězdy hoří!',fast:.6,add:[{on:'beat',every:4,at:2,do:'aimed',n:3}]}}};
  SPR.boss.kdboss=buildSprite(BOSS_DEFS.kdboss.rows,{pal:BOSS_DEFS.kdboss.pal,scale:2});
  BOSS_INTRO.kdboss={line:'Jen zkouška stavebnice.',acc:'#c8a8ff'};
  SONGS.kd1=songKit({bpm:124,root:50,scale:'minor',style:'frost',motif:[0,2,4,null,5,4,2,null]});
  SONGS.kd2=songKit({bpm:130,root:52,scale:'dorian',style:'sea',motif:[4,null,2,0,2,4,5,null]});
  SONGS.kd3=songKit({bpm:138,root:47,scale:'harm',style:'grave',motif:[0,null,4,null,7,6,4,null]});
})()`));
 const res={};
 for(const m of ['kd1','kd2','kd3']){
  res[m]=await p.evaluate(m=>{const K=window.__krypta,E=K._ev;K.save.sound=false;K.save.music=false;K.save.tut=1;K.god=true;K.startRun('knight',m);const r=K.run;r.tut=null;r.t=40;
    const x0=r.p.x,y0=r.p.y;let kst=0,wind=0;for(let i=0;i<900;i++){r.pending=0;K.step(1/60);if(r.kst)kst=Math.max(kst,r.kst.length);if(r.kw&&r.kw.on)wind++;}const hit=(r.qc&&r.qc.kst)||0;
    const out={props:r.built.props.length,lights:r.built.lights.length,zone:r.built.zone?r.built.zone.reduce((a,b)=>a+b,0):0,kst,hit,wind,moved:Math.round(Math.hypot(r.p.x-x0,r.p.y-y0)),
      psp:E("(()=>{const Z=run.built.zone;if(!Z)return 1;const n=run.map.size;for(let i=0;i<Z.length;i+=97)if(Z[i]){const q={x:i%n,y:(i/n)|0};return MF.kit.psp(q);}return 1;})()"),songOk:E("!!SONGS['"+m+"']&&SONGS['"+m+"'].sec.X.lead.length===32&&SONGS['"+m+"'].sec.A.lead.length===32")};
    return out;},m);
  await p.screenshot({path:pre+'_'+m+'.png'});}
 // boss: spawn, skip the intro, let it fight for a while, then phase 2
 res.boss=await p.evaluate(()=>{const K=window.__krypta,E=K._ev;K.startRun('knight','kd1');const r=K.run;r.tut=null;r.t=40;E('spawnBoss();bossIntroSkip()');for(let i=0;i<60;i++)K.step(1/30);
   const b=r.boss;let shots=0,ens=r.enemies.length;for(let i=0;i<600;i++){r.pending=0;K.step(1/60);shots=Math.max(shots,r.eshots.length);}const e1=r.enemies.length;
   const dead=b.dead,over=r.over;b.hp=b.max*.4;for(let i=0;i<120;i++){r.pending=0;K.step(1/60);}return {hp:b.max,dmg:b.dmg,shots,summoned:e1>ens,ph2:!!b.ph2,deadBefore:dead,overBefore:over,state:K.state,kst:(r.kst||[]).length};});
 await p.screenshot({path:pre+'_boss.png'});
 // music renders without errors
 res.music=await p.evaluate(async()=>{const K=window.__krypta;const d=await K.musicRender('kd2',6,{int:()=>2,boss:3});let pk=0;for(const v of d)pk=Math.max(pk,Math.abs(v));return {peak:+pk.toFixed(2),err:String(K.musicErr||'')};});
 res.tier=await p.evaluate(()=>window.__krypta._ev("JSON.stringify([kitTier('vrakoviste'),kitTier('paluba'),kitBoss(5,0,0),kitBoss(5,4,1),kitFoe(5,'grunt')])"));
 console.log(JSON.stringify(res,null,1));console.log('errors',errs.slice(0,5));await b.close();})();
