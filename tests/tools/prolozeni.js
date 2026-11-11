// Konečná čísla map z ladění na dva cíle (11m): proloží VŠECHNA měření mapy (všechna kola, všechny průchody), ne jen poslední
// kolo – jedno kolo je 12 běhů na skupinu a šum je ±15 bodů. Model (citlivosti z paky.js jako výchozí):
//   logit(výhry průměrného) = a + bH·ln(hpm) + AD·ln(dmm)     (bH se odhadne z mapy, když se hpm dost měnilo, jinak AH)
//   přežití neopatrného      = c + SH·ln(hpm) + SD·ln(dmm)
// Pak spočítá hpm a dmm pro cíl: výhry = CIL, přežití ≥ PREZ, HP nejvýš 1,8× výchozí (H0); co nejde, hlásí „mechanika“.
// node prolozeni.js h0.json hist1.json hist2.json …   -> ladeni-last.json (zapiš: node ladeni.js zapis) + tabulka
const fs=require('fs'),path=require('path'),{CIL,PREZ}=require('./ladeni');
const AH=-4.1,AD=-3.9,SH=-.12,SD=-.39,lg=p=>Math.log(p/(1-p)),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const [h0f,...files]=process.argv.slice(2),H0=JSON.parse(fs.readFileSync(h0f,'utf8'));
const pts={},info={},gb={};
for(const f of files){const d=JSON.parse(fs.readFileSync(f,'utf8'));Object.assign(info,d.info||{});Object.assign(gb,d.gb||{});
 for(const m in d.hist||{})for(const q of d.hist[m]){(pts[m]=pts[m]||[]).push(q);}}
const out={},mech=[],rows=[];
for(const m in pts){const P=pts[m].filter(q=>q.n>0),I=info[m];if(!P.length||!I)continue;
 const tg=I.cil/100,pz=I.prez;
 // sklon HP z mapy: jen když se ln(hpm) mezi měřeními dost lišilo, a jen v rozumných mezích
 const lh=P.map(q=>Math.log(q.h)),mh=lh.reduce((a,b)=>a+b,0)/lh.length,vh=lh.reduce((a,b)=>a+(b-mh)**2,0)/lh.length;
 let bH=AH;if(vh>.02){const y=P.map(q=>lg(cl((q.w*q.n+.5)/(q.n+1),.03,.97))-AD*Math.log(q.d)),my=y.reduce((a,b)=>a+b,0)/y.length;
  let cov=0;for(let i=0;i<P.length;i++)cov+=(lh[i]-mh)*(y[i]-my);cov/=P.length;bH=cl(cov/vh,-6,-2.5);} // plochý sklon je skoro vždy šum: s ním by výpočet ujel daleko mimo změřené hodnoty
 // úsek a: maximální věrohodnost binomie s pevnými sklony (Newton)
 let a=P.reduce((s,q)=>s+lg(cl((q.w*q.n+.5)/(q.n+1),.03,.97))-bH*Math.log(q.h)-AD*Math.log(q.d),0)/P.length;
 for(let it=0;it<60;it++){let g=0,h=0;for(const q of P){const z=a+bH*Math.log(q.h)+AD*Math.log(q.d),p=1/(1+Math.exp(-z));g+=q.w*q.n+.25-(q.n+.5)*p;h+=(q.n+.5)*p*(1-p);}a+=cl(g/Math.max(h,1e-3),-1,1);}
 const S=P.filter(q=>q.s!=null),c=S.length?S.reduce((s,q)=>s+q.s-SH*Math.log(q.h)-SD*Math.log(q.d),0)/S.length:null;
 const last=P[P.length-1];let ld=Math.log(last.d),lh2=(lg(tg)-a-AD*ld)/bH,note='';
 const cap=Math.log(1.8*H0[m]),sOf=(x,y)=>c==null?1:c+SH*x+SD*y;
 if(sOf(lh2,ld)<pz){ // přežití pod hranicí: poškození dolů, HP dorovná výhry
  const det=bH*SD-AD*SH;lh2=((lg(tg)-a)*SD-AD*(pz-c))/det;ld=(bH*(pz-c)-(lg(tg)-a)*SH)/det;}
 if(lh2>cap){lh2=cap;let y=(lg(tg)-a-bH*cap)/AD;if(c!=null)y=Math.min(y,Math.max(ld,(pz-.05-c-SH*cap)/SD));ld=y;
  const zz=a+bH*cap+AD*ld;if(Math.abs(zz-lg(tg))>.4){mech.push(m);note='mechanika';}}
 // nevěřit vzorci daleko za změřeným rozsahem: nejvýš o 30 % mimo hodnoty, které boti opravdu hráli
 const Hs=P.map(q=>q.h),Ds=P.map(q=>q.d);lh2=cl(lh2,Math.log(Math.min(...Hs)/1.3),Math.min(cap,Math.log(Math.max(...Hs)*1.3)));ld=cl(ld,Math.log(Math.min(...Ds)/1.3),Math.log(Math.max(...Ds)*1.3));
 if(!note&&Math.abs(a+bH*lh2+AD*ld-lg(tg))>.4){mech.push(m);note='mechanika';}
 const h=+cl(Math.exp(lh2),.3,400).toFixed(2),d=+cl(Math.exp(ld),.5,20).toFixed(2);
 const pw=1/(1+Math.exp(-(a+bH*Math.log(h)+AD*Math.log(d)))),ps=sOf(Math.log(h),Math.log(d));
 out[m]=[h,d,0];rows.push([m,P.reduce((s,q)=>s+q.n,0),bH.toFixed(1),h,d,Math.round(pw*100)+'/'+I.cil,Math.round(cl(ps,0,1)*100)+'/'+Math.round(pz*100),note]);}
// spx se nemění: vezmi ho z posledního souboru
for(const f of files){const d=JSON.parse(fs.readFileSync(f,'utf8'));for(const m in d.tier||{})if(out[m])out[m][2]=d.tier[m][2];}
console.log('mapa         běhů sklon  hpm     dmm   výhry(model)/cíl  přežití/hranice');
for(const r of rows)console.log(String(r[0]).padEnd(12)+String(r[1]).padStart(5)+String(r[2]).padStart(6)+String(r[3]).padStart(8)+String(r[4]).padStart(6)+'   '+String(r[5]).padEnd(16)+String(r[6]).padEnd(10)+r[7]);
if(mech.length)console.log('\nčísla nestačí (potřebuje mechaniku): '+mech.join(', '));
fs.writeFileSync(path.join(__dirname,'ladeni-last.json'),JSON.stringify({tier:out,gb,info,hist:pts}));
