// Boss jako třetí páka (11s). Na mapách, kde průměrný hráč (Stavitel, Fúzní lovec) dojde k bossovi skoro vždy, HP vln
// o výhře nerozhoduje: rozhoduje boss. Neopatrný hráč k bossovi skoro nedojde, takže násobek HP bosse (`bhm`, 5. číslo
// v MAP_TIER) srazí výhry průměrného a přežití neopatrného nezmění. Pusť až po ladeni.js + prolozeni.js + zapis.
// node bossladeni.js mapa,mapa [běhů na povahu=8] [b1=1.5] [b2=2.5]   -> bossladeni-last.json + návrh bhm
// node bossladeni.js zapis                                            -> zapíše bhm do MAP_TIER (5. číslo)
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path'),{CIL}=require('./ladeni');
const GAME=path.join(__dirname,'..','..','game.js'),OUT=path.join(__dirname,'bossladeni-last.json');
const lg=p=>Math.log(p/(1-p)),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
if(process.argv[2]==='zapis'){const B=JSON.parse(fs.readFileSync(OUT,'utf8')).bhm;let s=fs.readFileSync(GAME,'utf8');
 for(const m in B){const re=new RegExp('(\\b'+m+':\\[)([^\\]]*)(\\])');s=s.replace(re,(_,a,v,c)=>{const x=v.split(',').slice(0,4);while(x.length<4)x.push('0');if(B[m]>1.001)x.push(String(B[m]));return a+x.join(',')+c;});}
 fs.writeFileSync(GAME,s);console.log('zapsáno bhm: '+Object.entries(B).map(([m,b])=>m+' '+b).join(', '));process.exit(0);}
const maps=(process.argv[2]||'').split(',').filter(Boolean),N=+(process.argv[3]||8),bs=[+(process.argv[4]||1.5),+(process.argv[5]||2.5)];
if(!maps.length){console.log('node bossladeni.js mapa,mapa [běhů] [b1] [b2]');process.exit(1);}
const s=fs.readFileSync(GAME,'utf8'),CH=[...s.match(/const CHAPTERS=\[([\s\S]*?)\]\;/)[1].matchAll(/maps:\[([^\]]*)\]/g)].map(r=>r[1].split(',').map(x=>x.trim().replace(/'/g,'')));
const cur={};for(const m of maps){const v=s.match(new RegExp('\\b'+m+':\\[([^\\]]*)\\]'))[1].split(',').map(Number);cur[m]=v;}
const res={};for(const m of maps)res[m]=[];
for(const b of bs){const T={};for(const m of maps)T[m]=[cur[m][0],cur[m][3],null,null,b];
 execFileSync('node',['hraci.js','mapy:'+maps.join(','),String(N),'stavitel,fuzak'],{cwd:__dirname,env:Object.assign({},process.env,{TIER:JSON.stringify(T),FAZE:'vstup'}),stdio:['ignore','ignore','inherit'],maxBuffer:1e8});
 const R=JSON.parse(fs.readFileSync(path.join(__dirname,'hraci-results.json'),'utf8'));
 for(const m of maps){const L=R.filter(r=>r.map===m);res[m].push({b,n:L.length,w:L.filter(r=>r.won).length,boss:L.filter(r=>r.boss).length});}}
const bhm={};console.log('mapa         cíl  '+bs.map(b=>('bhm '+b).padEnd(16)).join('')+'→ bhm');
for(const m of maps){const ci=CH.findIndex(c=>c.includes(m)),mi=CH[ci].indexOf(m),tg=CIL(ci,mi,mi===CH[ci].length-1)/100,P=res[m];
 const pts=P.map(q=>[Math.log(q.b),lg(cl((q.w+.5)/(q.n+1),.03,.97))]);
 // sklon ze dvou bodů, ale ne plošší než −1,5 (šum) a ne strmější než −6
 const sl=cl((pts[1][1]-pts[0][1])/(pts[1][0]-pts[0][0]),-6,-1.5),a=pts[0][1]-sl*pts[0][0],b=+cl(Math.exp((lg(tg)-a)/sl),1,40).toFixed(2);
 bhm[m]=b;console.log(m.padEnd(12)+String(Math.round(tg*100)).padStart(4)+'  '+P.map(q=>(Math.round(q.w/q.n*100)+' % (boss '+q.boss+'/'+q.n+')').padEnd(16)).join('')+'→ '+b);}
fs.writeFileSync(OUT,JSON.stringify({bhm,res}));console.log('\nhotovo: bossladeni-last.json (zapiš: node bossladeni.js zapis)');
