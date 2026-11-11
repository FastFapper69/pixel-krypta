// Souhrn hrdinů z výsledků hraci.js (11h): výhry, medián přežití a zabití podle hrdiny, napříč povahami (každá povaha hraje každého hrdinu).
// node herostat.js [hraci-results.json …]
const fs=require('fs'),files=process.argv.slice(2).length?process.argv.slice(2):['hraci-results.json'];
const R=files.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')));
const H=[...new Set(R.map(r=>r.hero))],pad=(s,n)=>String(s).padEnd(n),med=a=>{a=a.slice().sort((x,y)=>x-y);return a[a.length>>1]||0;};
const all=R.filter(r=>r.won).length/R.length;
console.log(pad('hrdina',10)+pad('běhů',6)+pad('výhry',8)+pad('proti Ø',9)+pad('přežití',9)+pad('zabití/min',11)+'podle povahy');
const rows=H.map(h=>{const L=R.filter(r=>r.hero===h),w=L.filter(r=>r.won).length/L.length,P=[...new Set(L.map(r=>r.pov))].map(p=>{const Q=L.filter(r=>r.pov===p);return p.slice(0,4)+' '+Math.round(Q.filter(r=>r.won).length/Q.length*100);});
 return{h,n:L.length,w,t:med(L.map(r=>r.t)),kpm:med(L.map(r=>r.kills/Math.max(1,r.t/60))),P};}).sort((a,b)=>b.w-a.w);
for(const r of rows)console.log(pad(r.h,10)+pad(r.n,6)+pad(Math.round(r.w*100)+' %',8)+pad((r.w>=all?'+':'')+Math.round((r.w-all)*100),9)+pad(Math.floor(r.t/60)+':'+String(r.t%60).padStart(2,'0'),9)+pad(Math.round(r.kpm),11)+r.P.join('  '));
console.log('průměr '+Math.round(all*100)+' %');
