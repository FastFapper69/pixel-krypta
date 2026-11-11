// Které číslo mapy působí na jaký styl hry (11. 11.): pro vybrané mapy změří povahy botů se základními čísly
// a s jednou změněnou pákou (HP, poškození, spawn, rychlost nepřátel). Pomáhá vybrat páky pro ladeni.js.
// node paky.js [mapy=doly,jezero,vrakoviste] [běhů=6] [povahy=opatrny,expert,stavitel,fuzak,agresor,sberatel]
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path');
const [MAPS='doly,jezero,vrakoviste',N='6',POV='opatrny,expert,stavitel,fuzak,agresor,sberatel']=process.argv.slice(2);
const maps=MAPS.split(','),pov=POV.split(',');
const cur=JSON.parse(execFileSync('node',['-e',`const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
  await p.goto('file://'+${JSON.stringify(__dirname)}+'/off.html');await p.waitForTimeout(400);
  console.log(JSON.stringify(await p.evaluate(()=>{const M=window.__krypta._ev('MAPS'),o={};for(const id in M)o[id]=[M[id].hpm,M[id].dmm||1,M[id].spx||0,M[id].speedMul||1];return o;})));await b.close();})();`],{cwd:__dirname}).toString().trim().split('\n').pop());
const VAR={zaklad:t=>t,'dmm×0,6':t=>[t[0],t[1]*.6,t[2],t[3]],'hpm×1,5':t=>[t[0]*1.5,t[1],t[2],t[3]],'spx+1':t=>[t[0],t[1],t[2]+1,t[3]],'rychlost×1,25':t=>[t[0],t[1],t[2],t[3]*1.25]};
if(process.env.VARS){const X=JSON.parse(process.env.VARS);for(const k in VAR)delete VAR[k];for(const k in X){const [h,d,x,v]=X[k];VAR[k]=t=>[t[0]*h,t[1]*d,t[2]+x,t[3]*v];}} // VARS='{"název":[hpm×,dmm×,spx+,rychlost×]}'
const out={};
for(const v in VAR){const tier={};for(const m of maps)tier[m]=VAR[v](cur[m]);
  execFileSync('node',['hraci.js','mapy:'+MAPS,N,POV],{cwd:__dirname,env:Object.assign({},process.env,{TIER:JSON.stringify(tier),FAZE:'vstup'}),stdio:['ignore','ignore','inherit'],maxBuffer:1e8});
  const R=JSON.parse(fs.readFileSync(path.join(__dirname,'hraci-results.json'),'utf8'));out[v]=R;
  const line=pov.map(k=>{const L=R.filter(r=>r.pov===k);return k.slice(0,5)+' '+String(Math.round(L.filter(r=>r.won).length/L.length*100)).padStart(3)+'% '+String(Math.round(L.reduce((a,r)=>a+r.t,0)/L.length)).padStart(3)+'s';}).join(' | ');
  console.log(v.padEnd(14)+line);}
fs.writeFileSync(path.join(__dirname,'paky-last.json'),JSON.stringify(out));
