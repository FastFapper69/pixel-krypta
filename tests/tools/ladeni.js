// Ladění obtížnosti map boty (11h, 11l dva cíle). Obtížnost má růst stejně jako síla hráče: s účtem, se kterým hráč
// na mapu typicky přijde (ucty.js), má hráč vyhrát zhruba stejně často v každé kapitole.
// 11l: místo průměru všech povah DVA CÍLE a DVĚ PÁKY (rozbor v KAMPAN.md „Dva cíle“):
//  - PRŮMĚRNÝ hráč (Stavitel, Fúzní lovec) má vyhrát CIL(ci,mi) %. Páka = HP nepřátel (hpm), na tyhle hráče působí silně.
//  - NEOPATRNÝ hráč (Agresor, Sběratel) nemá umřít hned: průměrné přežití PREZ(ci,mi) délky mapy (hrdina dojde aspoň do půlky).
//    Páka = síla zásahů (dmm), na přežití působí nejvíc.
//  - ZKUŠENÝ hráč (Opatrný, Expert) se jen zapisuje: uhýbá a od nepřátel skoro nedostává zásahy, žádná globální páka ho
//    nezastaví (měřeno paky.js); smí vyhrávat často, zdí pro něj jsou mechaniky map a bossové.
// Cíl CIL(ci,mi): kapitola I vítá (Hřbitov 85 % → Zvonice 50 %, 11z4), další kapitoly začínají schodem (40 % a −3 body na mapu),
// každá třetí kapitola (III, VI, IX…) je zeď (25 %), finále s bossem je špička (20 %, ve zdi 12 %).
// Smyčka: změří obě skupiny, posune hpm a dmm společně (citlivosti z paky.js, tlumené), opakuje.
// node ladeni.js <c3|vse|mapa,mapa> [kola=3] [běhů na povahu=6]   -> ladeni-last.json, `node ladeni.js zapis` ho zapíše do game.js
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path');
const PRUM=['stavitel','fuzak'],NEOP=['agresor','sberatel'],ZKUS=['opatrny','expert'],POV=[...PRUM,...NEOP,...ZKUS].join(',');
const STENA=ci=>ci%3===2;
function PREZ(ci,mi,fin){return fin||STENA(ci)?.4:ci===0&&mi<2?.65:.5;} // průměrné přežití neopatrného hráče jako díl délky mapy
function CIL(ci,mi,fin){if(fin)return ci===0?25:STENA(ci)?12:ci%10===9?15:20;if(ci===0)return[85,75,60,50][mi]; /* 11z4: nováček prohrával první dvě mapy (uživatel i testeři) → vítá víc */return(STENA(ci)?25:40)-3*mi;}
const logit=p=>Math.log(p/(1-p)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const GAME=path.join(__dirname,'..','..','game.js');
function chapters(){const s=fs.readFileSync(GAME,'utf8'),m=s.match(/const CHAPTERS=\[([\s\S]*?)\]\;/)[1],out=[];let i=0;
 for(const r of m.matchAll(/maps:\[([^\]]*)\]/g))out.push({i:i++,maps:r[1].split(',').map(x=>x.trim().replace(/'/g,''))});return out;}
function current(){ // hpm/dmm/spx tak, jak je hra opravdu dostane (MAP_TIER nebo kitTier)
 const out=execFileSync('node',['-e',`const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
  await p.goto('file://'+${JSON.stringify(__dirname)}+'/off.html');await p.waitForTimeout(400);
  console.log(JSON.stringify(await p.evaluate(()=>{const M=window.__krypta._ev('MAPS'),o={};for(const id in M)o[id]=[M[id].hpm,M[id].dmm||1,M[id].spx||0,M[id].gb||0,M[id].dur];return o;})));await b.close();})();`],{cwd:__dirname}).toString();
 return JSON.parse(out.trim().split('\n').pop());}
function measure(maps,tier,n){
 execFileSync('node',['hraci.js','mapy:'+maps.join(','),String(n),POV],{cwd:__dirname,env:Object.assign({},process.env,{TIER:JSON.stringify(tier),FAZE:'vstup'}),stdio:['ignore','ignore','inherit'],maxBuffer:1e8});
 const R=JSON.parse(fs.readFileSync(path.join(__dirname,'hraci-results.json'),'utf8')),o={};
 for(const m of maps){const L=R.filter(r=>r.map===m),g=G=>L.filter(r=>G.includes(r.pov)),P=g(PRUM),N=g(NEOP),Z=g(ZKUS),dur=DUR[m];
  o[m]={n:P.length,w:P.filter(r=>r.won).length,s:N.length?N.reduce((a,r)=>a+(r.won?1:Math.min(1,r.t/dur)),0)/N.length:null,
   nw:N.filter(r=>r.won).length,nn:N.length,zw:Z.filter(r=>r.won).length,zn:Z.length};}
 fs.appendFileSync(path.join(__dirname,'ladeni-runs.json'),JSON.stringify(R)+'\n');return o;}
let DUR={};
module.exports={CIL,STENA,PREZ};
if(require.main===module&&process.argv[2]==='zapis'){
 const L=JSON.parse(fs.readFileSync(path.join(__dirname,'ladeni-last.json'),'utf8'));let s=fs.readFileSync(GAME,'utf8');
 const mt=s.match(/const MAP_TIER=\{([\s\S]*?)\}; \/\/ [^\n]*\n/)||s.match(/const MAP_TIER=\{([\s\S]*?)\};/);
 let body=mt[1];
 for(const m in L.tier){const [h,d]=L.tier[m],re=new RegExp('(\\b'+m+':\\[)([^\\]]*)(\\])');
  if(re.test(body))body=body.replace(re,(_,a,v,c)=>{const x=v.split(',');x[0]=String(h);x[3]=String(d);if(x.length<4)x.length=4;return a+x.map(y=>y==null||y===''?'1':y).join(',')+c;});
  else{const gb=L.gb&&L.gb[m]||0;body=body.replace(/\s*$/,'')+',\n  '+m+':['+h+','+L.tier[m][2]+','+gb+','+d+']';}}
 s=s.replace(mt[1],body);fs.writeFileSync(GAME,s);console.log('zapsáno do MAP_TIER: '+Object.keys(L.tier).join(', '));process.exit(0);}
if(require.main===module){
const CH=chapters(),arg=process.argv[2]||'vse',K=+(process.argv[3]||3),N=+(process.argv[4]||6);
const maps=arg==='vse'?CH.flatMap(c=>c.maps):/^c\d+$/.test(arg)?CH[+arg.slice(1)-1].maps:arg.split(',');
const info={};for(const m of maps){const C=CH.find(c=>c.maps.includes(m)),mi=C.maps.indexOf(m),fin=mi===C.maps.length-1;info[m]={ci:C.i,mi,fin,cil:CIL(C.i,mi,fin),prez:PREZ(C.i,mi,fin)};}
const cur=current(),tier={},hist={},H0={},mech=new Set();for(const m of maps){tier[m]=[cur[m][0],cur[m][1]];hist[m]=[];DUR[m]=cur[m][4];H0[m]=+(process.env.H0&&JSON.parse(process.env.H0)[m]||cur[m][0]);}
// citlivosti z paky.js (doly, jezero, vrakoviště, 18 běhů na buňku): logit výher průměrného hráče a přežití neopatrného
// na ln(hpm) a ln(dmm). Řešíme 2×2 soustavu, krok tlumíme (šum), páky držíme v rozumných mezích.
const AH=-4.1,AD=-3.9,SH=-.12,SD=-.39,TL=.6;
for(let k=0;k<K;k++){const t0=Date.now(),res=measure(maps,tier,N);
 console.log('\nkolo '+(k+1)+' ('+Math.round((Date.now()-t0)/1000)+' s)');
 for(const m of maps){const r=res[m],I=info[m],w=(r.w+.5)/(r.n+1),tg=I.cil/100;
  hist[m].push({h:tier[m][0],d:tier[m][1],w:r.w/r.n,n:r.n,s:r.s,nw:r.nw,nn:r.nn,zw:r.zw,zn:r.zn});
  // přežití neopatrného je jen spodní hranice: když je nad ní, ladí se výhry samotným HP; pod ní se řeší obě páky naráz
  const okW=Math.abs(logit(clamp(w,.03,.97))-logit(tg))<=.55, // v logitech: u cíle 12 % je pásmo ~7–19 %, u 40 % ~29–52 %
   okS=r.s==null||r.s>=I.prez-.08;
  let x=0,y=0;const dA=okW?0:logit(tg)-logit(clamp(w,.03,.97));
  if(okS){x=dA/AH;const sx=r.s==null?1:r.s+SH*x;if(sx<I.prez-.08){const dS=I.prez-r.s,det=AH*SD-AD*SH;x=(dA*SD-AD*dS)/det;y=(AH*dS-dA*SH)/det;}} // HP by srazilo přežití pod hranici
  else{const dS=I.prez-r.s,det=AH*SD-AD*SH;x=(dA*SD-AD*dS)/det;y=(AH*dS-dA*SH)/det;}
  {const d0=tier[m][1],yc=Math.log(clamp(d0*Math.exp(y),.5,20)/d0);if(Math.abs(yc-y)>1e-6){x=(dA-AD*yc)/AH;y=yc;}} // poškození narazilo na mez: HP dorovná jen výhry
  x=clamp(x*TL,-.5,.5);y=clamp(y*TL,-.5,.5);
  // strop HP (×1,8 proti výchozí hodnotě): mapa, která na HP nereaguje (Vrakoviště, Vír…), by jinak měla nepřátele z houby.
  // Zbytek výher dorovná poškození, jen dokud neopatrný neklesne pod hranici přežití; co nejde, hlásí „mechanika“.
  if(tier[m][0]*Math.exp(x)>H0[m]*1.8){const xc=Math.log(H0[m]*1.8/tier[m][0]),rest=(dA*TL-AH*xc-AD*y);x=xc;
   let yy=y+rest/AD;if(r.s!=null){const lim=(I.prez-.05-r.s-SH*xc)/SD;yy=Math.min(yy,Math.max(y,lim));}y=clamp(yy,-.5,.5);
   if(Math.abs(rest)>.3)mech.add(m);}
  const nh=+clamp(tier[m][0]*Math.exp(x),.3,400).toFixed(2),nd=+clamp(tier[m][1]*Math.exp(y),.5,20).toFixed(2);
  console.log('  '+m.padEnd(12)+('hpm '+tier[m][0]+' dmm '+tier[m][1]).padEnd(22)+('průměrný '+Math.round(r.w/r.n*100)+'/'+I.cil+' %').padEnd(19)+('neopatrný přežije '+(r.s==null?'-':Math.round(r.s*100))+'/'+Math.round(I.prez*100)+' %').padEnd(27)+('zkušený '+Math.round(r.zw/r.zn*100)+' %').padEnd(14)+(okW&&okS?'v cíli':'→ hpm '+nh+', dmm '+nd));
  tier[m]=[nh,nd];}
 fs.writeFileSync(path.join(__dirname,'ladeni-last.json'),JSON.stringify({tier:Object.fromEntries(maps.map(m=>[m,[tier[m][0],tier[m][1],cur[m][2]]])),hist,info,gb:Object.fromEntries(maps.map(m=>[m,cur[m][3]||0]))},null,0));}
if(mech.size)console.log('\nna HP ani poškození nereaguje dost (potřebuje mechaniku): '+[...mech].join(', '));
console.log('\nhotovo: ladeni-last.json (zapiš: node ladeni.js zapis)');}
