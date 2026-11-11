// 11z4: běh opuštěný zavřením aplikace se zapíše jako end='left' při dalším spuštění (save.runPend). node opusteny.js
const L=require('./lib');
(async()=>{const o=await L.open({phone:'13',save:'mid'});let ok=true;const chk=(c,m)=>{console.log((c?'OK  ':'CHYBA ')+m);if(!c)ok=false;};
await o.E("save.runQ=[];persist();startRun('knight','hrbitov',{});for(let i=0;i<600;i++)window.__krypta.step(1/60);");
await o.p.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
chk(await o.E("!!(save.runPend&&save.runPend.end==='left'&&save.runPend.t>=9)"),'snímek běhu při skrytí aplikace');
await o.p.reload();await o.p.waitForTimeout(800);
const q=JSON.parse(await o.E("JSON.stringify((save.runQ||[]).map(r=>[r.end,r.map,r.t]))"));
chk(q.some(r=>r[0]==='left'&&r[1]==='hrbitov'),'po novém spuštění je ve frontě běh „left“: '+JSON.stringify(q));
chk(!(await o.E("!!save.runPend")),'snímek je po přesunu pryč');
// běh, který hráč dohraje po návratu, se nezapíše dvakrát
await o.E("save.runQ=[];startRun('knight','hrbitov',{});for(let i=0;i<300;i++)window.__krypta.step(1/60);");
await o.p.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
await o.E("finish(false)");
chk(!(await o.E("!!save.runPend")),'dohraný běh smaže snímek');
console.log(o.errs.join('\n'));await o.close();process.exit(ok?0:1);})();
