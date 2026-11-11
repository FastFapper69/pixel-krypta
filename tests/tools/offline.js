// 11r: běhy offline – fronta v zařízení (save.runQ), odeslání po připojení, starý server bez nových sloupců,
// výpadek sítě, sloučení statistik se starší/novější verzí z cloudu, fronta přežije znovunačtení. node offline.js
const L=require('./lib');L.prep();
(async()=>{const P=await L.open({save:'mid'});const {p,errs}=P;
 const res=await p.evaluate(async()=>{const K=window.__krypta,out={},sent=[];let mode='old';
  window.__sb={from:t=>({insert:rows=>{sent.push({t,how:'insert',rows});return Promise.resolve({error:null});},
    upsert:(rows,o)=>{if(mode==='old')return Promise.resolve({error:{code:'PGRST204',message:"Could not find the 'offline' column"}});
      if(mode==='down')return Promise.reject(new Error('Failed to fetch'));sent.push({t,how:'upsert',o,rows});return Promise.resolve({error:null});}}),rpc:()=>Promise.resolve({error:null})};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  K._ev("ON.ready=false;ON.me=null;ON.sb=null;save.runQ=[];save.cheat=false");
  const play=end=>{K.startRun('knight','hrbitov',{});for(let i=0;i<30;i++)K.step(1/30);K._ev("tmSend('"+end+"')");};
  play('death');play('quit');
  out.fronta=K._ev("save.runQ.length");out.offline=K._ev("save.runQ.every(r=>r.offline&&r.rid&&r.played_at)");
  out.vLocal=JSON.parse(localStorage.getItem(K._ev("SAVE_KEY"))).runQ.length;
  out.sync=K._ev("syncKeys().includes('runQ')");
  // připojení, server ještě bez nových sloupců → pošle bez nich
  K._ev("ON.sb=window.__sb;ON.me={id:'me'};ON.ready=true;ON.runsOld=0;ON.noRuns=0");await K._ev("runsFlush()");
  out.stary={zbylo:K._ev("save.runQ.length"),poslano:sent.map(s=>s.how+':'+s.rows.length).join(),bezRid:sent.every(s=>s.rows.every(r=>!('rid' in r)&&r.uid==='me'))};
  // nový server: upsert s rid
  sent.length=0;mode='new';K._ev("ON.runsOld=0");play('win');await wait(50);
  out.novy={zbylo:K._ev("save.runQ.length"),poslano:sent.map(s=>s.how+':'+s.rows.length+':'+s.o.onConflict).join(),online:sent[0]&&sent[0].rows[0].offline===false};
  // výpadek sítě: běh zůstane ve frontě, po návratu odejde
  sent.length=0;mode='down';play('death');await wait(50);out.vypadek=K._ev("save.runQ.length");
  mode='new';await K._ev("runsFlush()");out.poNavratu=K._ev("save.runQ.length")+'/'+sent.length;
  // sloučení statistik: offline lepší výsledek na mapě a víc běhů, cloud novější s jiným rekordem
  K._ev("save.stats={runs:9,wins:2,kills:500,tot:{combo:40},best:{hrbitov:{t:300,kills:200,won:true,lv:10,nm:1},poust:{t:100,kills:20,won:false,lv:3,nm:0}}}");
  const mine=K._ev("save.stats");
  K._ev("save.stats={runs:7,wins:3,kills:450,tot:{combo:60},best:{hrbitov:{t:310,kills:250,won:true,lv:11,nm:0},bazina:{t:200,kills:90,won:true,lv:8,nm:0}}}");
  out.zmena=K._ev("statsMerge")(mine);out.slouceno=K._ev("save.stats");
  out.znovu=K._ev("statsMerge")(K._ev("JSON.parse(JSON.stringify(save.stats))"));
  // fronta přežije znovunačtení
  K._ev("ON.sb=null;ON.ready=false");play('death');return out;});
 await p.reload();await p.waitForTimeout(1500);
 res.poReloadu=await p.evaluate(()=>window.__krypta._ev("(save.runQ||[]).length"));
 console.log(JSON.stringify(res,null,1));
 const s=res.slouceno||{},b=[];
 if(!(res.fronta===2&&res.offline&&res.vLocal===2&&!res.sync))b.push('fronta');
 if(!(res.stary.zbylo===0&&res.stary.poslano==='insert:2'&&res.stary.bezRid))b.push('starý server');
 if(!(res.novy.zbylo===0&&res.novy.poslano==='upsert:1:rid'&&res.novy.online))b.push('nový server');
 if(!(res.vypadek===1&&res.poNavratu==='0/1'))b.push('výpadek');
 if(!(res.zmena&&s.runs===9&&s.wins===3&&s.kills===500&&s.tot.combo===60&&s.best.hrbitov.nm===1&&s.best.poust&&s.best.bazina&&res.znovu===false))b.push('sloučení');
 if(res.poReloadu!==1)b.push('po znovunačtení');
 console.log(b.length?'✗ '+b.join(', '):'✓ vše v pořádku','chyby',JSON.stringify(errs));await P.close();process.exit(b.length?1:0);})();
