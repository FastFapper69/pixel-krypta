// 09z9: měření hudby – hlasitost v klidu/běhu/u bosse a pásmo, které zahraje reproduktor telefonu. node zvuk.js hrbitov,kovarna,majak
// Řádek „před“ = starý mix (o.raw), „po“ = aktuální. Cíl: běh kolem -31 dB u všech stylů, boss o 3–5 dB výš než běh, špička pod -3 dB.
const L=require('./lib');
(async()=>{L.prep();const P=await L.open({save:'late'});const out=[];
 for(const id of (process.argv[2]||'hrbitov,poust,kovarna,jezero,majak,menu').split(','))for(const raw of [true,false]){
  const r=await P.p.evaluate(async([id,raw])=>{const K=window.__krypta;
   const x=await K.musicRender(id,40,{int:t=>t<8?0:t<16?1:t<26?2:3,boss:26,raw});
   const SR=22050,db=v=>+(10*Math.log10(v+1e-12)).toFixed(1);
   const seg=(a,b,f)=>{let s=0,n=0,l=0,h=0;const a1=Math.exp(-2*Math.PI*250/SR),a2=Math.exp(-2*Math.PI*6000/SR);for(let i=a*SR;i<b*SR;i++){const v=x[i];l=a1*l+(1-a1)*v;h=a2*h+(1-a2)*v;const q=f?(h-l):v;s+=q*q;n++;}return db(s/n);};
   let pk=0;for(const v of x)pk=Math.max(pk,Math.abs(v));
   return {id,raw,pk:+(20*Math.log10(pk)).toFixed(1),calm:seg(1,8),run:seg(17,25),boss:seg(29,39),phone:seg(17,25,1),err:String(K.musicErr||'')};},[id,raw]);
  out.push(r);}
 console.log('píseň        verze   špička  klid   běh   boss | telefon(250Hz–6kHz) běh');
 for(const r of out)console.log(r.id.padEnd(12),(r.raw?'před':'po').padEnd(6),String(r.pk).padStart(6),String(r.calm).padStart(6),String(r.run).padStart(6),String(r.boss).padStart(6),' |',String(r.phone).padStart(6),r.err);
 await P.close();})();
