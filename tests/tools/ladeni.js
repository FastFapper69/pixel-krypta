// Ladění obtížnosti map boty na cílovou úspěšnost (11h). Obtížnost má růst stejně jako síla hráče: s účtem, se kterým hráč
// na mapu typicky přijde (ucty.js), má průměrný hráč (5 povah z hraci.js) vyhrát zhruba stejně často v každé kapitole.
// Cíl CIL(ci,mi): kapitola I vítá (Hřbitov 70 % → Zvonice 45 %), další kapitoly začínají schodem (40 % a −3 body na mapu),
// každá třetí kapitola (III, VI, IX…) je zeď (25 %), finále s bossem je špička (20 %, ve zdi 12 %).
// Smyčka: změří výhry, posune HP nepřátel mapy (hpm) podle logistického modelu (dmm = poškození jde s odmocninou), opakuje.
// node ladeni.js <c3|vse|mapa,mapa> [kola=3] [běhů na povahu=4]   -> výsledek ladeni-last.json, `node ladeni.js zapis` ho zapíše do game.js
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path');
const POV='opatrny,agresor,sberatel,stavitel,fuzak',NP=POV.split(',').length;
const STENA=ci=>ci%3===2;
function CIL(ci,mi,fin){if(fin)return ci===0?25:STENA(ci)?12:20;if(ci===0)return[70,60,50,45][mi];return(STENA(ci)?25:40)-3*mi;}
const logit=p=>Math.log(p/(1-p)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const GAME=path.join(__dirname,'..','..','game.js');
function chapters(){const s=fs.readFileSync(GAME,'utf8'),m=s.match(/const CHAPTERS=\[([\s\S]*?)\]\;/)[1],out=[];let i=0;
 for(const r of m.matchAll(/maps:\[([^\]]*)\]/g))out.push({i:i++,maps:r[1].split(',').map(x=>x.trim().replace(/'/g,''))});return out;}
function current(){ // hpm/dmm/spx tak, jak je hra opravdu dostane (MAP_TIER nebo kitTier)
 const out=execFileSync('node',['-e',`const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
  await p.goto('file://'+${JSON.stringify(__dirname)}+'/off.html');await p.waitForTimeout(400);
  console.log(JSON.stringify(await p.evaluate(()=>{const M=window.__krypta._ev('MAPS'),o={};for(const id in M)o[id]=[M[id].hpm,M[id].dmm||1,M[id].spx||0,M[id].gb||0];return o;})));await b.close();})();`],{cwd:__dirname}).toString();
 return JSON.parse(out.trim().split('\n').pop());}
function measure(maps,tier,n){
 execFileSync('node',['hraci.js','mapy:'+maps.join(','),String(n),POV],{cwd:__dirname,env:Object.assign({},process.env,{TIER:JSON.stringify(tier),FAZE:'vstup'}),stdio:['ignore','ignore','inherit'],maxBuffer:1e8});
 const R=JSON.parse(fs.readFileSync(path.join(__dirname,'hraci-results.json'),'utf8')),o={};
 for(const m of maps){const L=R.filter(r=>r.map===m);o[m]={n:L.length,w:L.filter(r=>r.won).length};}return o;}
module.exports={CIL,STENA};
if(require.main===module&&process.argv[2]==='zapis'){
 const L=JSON.parse(fs.readFileSync(path.join(__dirname,'ladeni-last.json'),'utf8'));let s=fs.readFileSync(GAME,'utf8');
 const mt=s.match(/const MAP_TIER=\{([\s\S]*?)\}; \/\/ [^\n]*\n/)||s.match(/const MAP_TIER=\{([\s\S]*?)\};/);
 let body=mt[1];
 for(const m in L.tier){const [h,d]=L.tier[m],re=new RegExp('(\\b'+m+':\\[)([^\\]]*)(\\])');
  if(re.test(body))body=body.replace(re,(_,a,v,c)=>{const x=v.split(',');x[0]=String(h);x[3]=String(d);if(x.length<4)x.length=4;return a+x.map(y=>y==null||y===''?'1':y).join(',')+c;});
  else{const gb=L.gb&&L.gb[m]||0;body=body.replace(/\s*$/,'')+',\n  '+m+':['+h+','+L.tier[m][2]+','+gb+','+d+']';}}
 s=s.replace(mt[1],body);fs.writeFileSync(GAME,s);console.log('zapsáno do MAP_TIER: '+Object.keys(L.tier).join(', '));process.exit(0);}
if(require.main===module){
const CH=chapters(),arg=process.argv[2]||'vse',K=+(process.argv[3]||3),N=+(process.argv[4]||4);
const maps=arg==='vse'?CH.flatMap(c=>c.maps):/^c\d+$/.test(arg)?CH[+arg.slice(1)-1].maps:arg.split(',');
const info={};for(const m of maps){const C=CH.find(c=>c.maps.includes(m)),mi=C.maps.indexOf(m),fin=mi===C.maps.length-1;info[m]={ci:C.i,mi,fin,cil:CIL(C.i,mi,fin)};}
const cur=current(),tier={},hist={};for(const m of maps){tier[m]=cur[m].slice();hist[m]=[];}
const B0=2.5; // předpoklad: HP ×1,5 ubere ~1 logit výher; po druhém kole se sklon odhadne z měření mapy
for(let k=0;k<K;k++){const t0=Date.now(),res=measure(maps,tier,N);
 console.log('\nkolo '+(k+1)+' ('+Math.round((Date.now()-t0)/1000)+' s)');
 for(const m of maps){const r=res[m],w=(r.w+1)/(r.n+2),I=info[m];hist[m].push({h:tier[m][0],d:tier[m][1],w:r.w/r.n,n:r.n});
  let b=B0;const H=hist[m];if(H.length>=2){const a=H[H.length-2],c=H[H.length-1],wa=clamp(a.w,.04,.96),wc=clamp(c.w,.04,.96),dl=Math.log(c.h/a.h);
   if(Math.abs(dl)>.05){const bb=-(logit(wc)-logit(wa))/dl;if(bb>0)b=clamp(bb,1,6);}}
  const tg=I.cil/100,f=clamp(Math.exp((logit(w)-logit(tg))/b),.6,1.7),done=Math.abs(r.w/r.n*100-I.cil)<=10;
  const nh=+(tier[m][0]*(done?1:f)).toFixed(2),nd=+Math.max(1,tier[m][1]*(done?1:Math.sqrt(f))).toFixed(2);
  console.log('  '+m.padEnd(12)+('hpm '+tier[m][0]).padEnd(11)+('výhry '+Math.round(r.w/r.n*100)+' %').padEnd(12)+('cíl '+I.cil+' %').padEnd(10)+(done?'v cíli':'→ hpm '+nh+', dmm '+nd));
  tier[m]=[nh,nd,tier[m][2]];}
 fs.writeFileSync(path.join(__dirname,'ladeni-last.json'),JSON.stringify({tier,hist,info,gb:Object.fromEntries(maps.map(m=>[m,cur[m][3]||0]))},null,0));}
console.log('\nhotovo: ladeni-last.json (zapiš: node ladeni.js zapis)');}
