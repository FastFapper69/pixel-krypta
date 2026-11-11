// 11z2: kdy si hráč postaví první věž (zlato hlavně z komba). node prvniVez.js data.json [mapy] → shrnutí z výstupu hraci.js
const R=JSON.parse(require('fs').readFileSync(process.argv[2]));const g={};
for(const r of R){const k=r.map+' '+r.pov;(g[k]=g[k]||[]).push(r);}
const med=a=>{a=a.filter(x=>x!=null).sort((x,y)=>x-y);return a.length?a[a.length>>1]:null;},f=s=>s==null?'nikdy':Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0');
for(const k of Object.keys(g).sort()){const a=g[k];console.log(k.padEnd(22),'1. věž',f(med(a.map(r=>r.t1))).padEnd(6),' bez věže',a.filter(r=>r.t1==null).length+'/'+a.length,' zlato 1:30',med(a.map(r=>r.c90)),' výhry',a.filter(r=>r.won).length+'/'+a.length);}
