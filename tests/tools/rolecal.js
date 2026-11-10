// 10f: kalibrace hlasitosti nástrojů nového stylu (STYLE_ROLE) – sólo každé role v běhu, rozdíl proti bicím.
// node rolecal.js <skladby nového stylu> [referenční skladby, výchozí jezero,majak]
// Cíl = poměry nástrojů vůči bicím, jak je mají odposlouchané hotové styly (frost, sea). Absolutní čísla ze skillu
// (basa −3, melodie −4…) se měřila jinou metodou a tímhle měřením nesedí ani na hotové styly – nepoužívat.
// Vypíše návrh řádku STYLE_ROLE; hotovo, když odchylka vyjde do ±1,5 dB.
const L=require('./lib');
const ids=(process.argv[2]||'hvezdarna').split(','),refs=(process.argv[3]||'jezero,majak').split(','),TGT={};
(async()=>{L.prep();const P=await L.open({save:'late'});const sum={},cur={};let style;
 const meas=id=>P.p.evaluate(async id=>{const K=window.__krypta,out={},sr=16000,secs=36;
   const db=x=>{let s=0,n=0;for(let i=8*sr;i<x.length;i++){s+=x[i]*x[i];n++;}return 10*Math.log10(s/n+1e-12);};
   for(const k of ['drums','bass','lead','arp','pad'])out[k]=db(await K.musicRender(id,secs,{sr,int:()=>1,solo:k}));return out;},id);
 const rs=[];for(const id of refs)rs.push(await meas(id));
 for(const k of ['bass','lead','arp','pad'])TGT[k]=rs.reduce((a,o)=>a+o[k]-o.drums,0)/rs.length;
 console.log('cíl (průměr '+refs.join(',')+'):',Object.entries(TGT).map(([k,v])=>k+' '+v.toFixed(1)).join('  '));
 for(const id of ids){
  const r=await P.p.evaluate(async id=>{const K=window.__krypta,out={},sr=16000,secs=36;
   const db=x=>{let s=0,n=0;for(let i=8*sr;i<x.length;i++){s+=x[i]*x[i];n++;}return 10*Math.log10(s/n+1e-12);};
   for(const k of ['drums','bass','lead','arp','pad'])out[k]=db(await K.musicRender(id,secs,{sr,int:()=>1,solo:k}));
   return{out,style:K._ev("SONGS['"+id+"'].style"),cur:K._ev("JSON.stringify(STYLE_ROLE[SONGS['"+id+"'].style]||{})"),err:String(K._ev('M.err')||'')};},id);
  style=r.style;Object.assign(cur,JSON.parse(r.cur));
  const row=[];for(const k in TGT){const d=r.out[k]-r.out.drums;(sum[k]=sum[k]||[]).push(d);row.push(k+' '+d.toFixed(1));}
  console.log(id.padEnd(11),r.style.padEnd(7),row.join('  '),r.err);}
 const sug={};let worst=0;
 for(const k in TGT){const d=sum[k].reduce((a,b)=>a+b,0)/sum[k].length,off=TGT[k]-d;worst=Math.max(worst,Math.abs(off));sug[k]=+((cur[k]||0)+off).toFixed(1);}
 console.log('\nstyl',style,'– nejvyšší odchylka od cíle',worst.toFixed(1),'dB',worst<=1.5?'(OK)':'(UPRAVIT)');
 console.log('návrh: '+style+':'+JSON.stringify(sug).replace(/"/g,''));
 await P.close();process.exitCode=worst<=1.5?0:1;})();
