// 10b: rozbor všech skladeb – po taktech, jak zní melodické nástroje (melodie+arpeggio+akordy) vůči bicím+base přes reproduktor telefonu.
// node skladby.js [skladby,odd,carkou | c6 = celá kapitola] [json_vystup]
// Na konci řádek VERDIKT: propady 0, klid −2 až −6 dB pod během, boss +3 až +5 dB nad během (pravidla skillu zvuk-a-hudba).
// Průběh jako ve hře, jen zhuštěný: klid 0–20 s, běh 20–50 s, vrchol 50–75 s, boss 75–95 s.
// Hluché místo = takt, kde melodické nástroje na telefonu hrají o víc než 10 dB tišeji než bicí s basou (nebo úplně chybí).
const L=require('./lib'),fs=require('fs');
const want=(process.argv[2]||'').split(',').filter(Boolean),OUT=process.argv[3];
(async()=>{L.prep();const P=await L.open({save:'late'});
 const ids=!want.length?await P.E('Object.keys(SONGS)'):/^c\d+$/.test(want[0])?await P.E(`CHAPTERS.find(c=>c.id==='${want[0]}').maps`):want;const all={};let fails=0;
 for(const id of ids){
  const r=await P.p.evaluate(async id=>{const K=window.__krypta,sr=16000,secs=95,boss=75,int=t=>t<20?0:t<50?1:t<boss?2:3;
   const bpm=K._ev("SONGS['"+id+"'].bpm"),bar=60/bpm*4;
   // highpass 300 Hz 4. řádu (reproduktor telefonu) – dva biquady
   const hp=x=>{const f0=300,Q=[.5412,1.3066];let y=x;for(const q of Q){const w=2*Math.PI*f0/sr,al=Math.sin(w)/(2*q),c=Math.cos(w),a0=1+al,
     b0=(1+c)/2/a0,b1=-(1+c)/a0,b2=(1+c)/2/a0,a1=-2*c/a0,a2=(1-al)/a0,o=new Float32Array(y.length);let x1=0,x2=0,y1=0,y2=0;
     for(let i=0;i<y.length;i++){const v=y[i],u=b0*v+b1*x1+b2*x2-a1*y1-a2*y2;x2=x1;x1=v;y2=y1;y1=u;o[i]=u;}y=o;}return y;};
   const db=(x,a,b)=>{let s=0;for(let i=a;i<b;i++)s+=x[i]*x[i];return 10*Math.log10(s/Math.max(1,b-a)+1e-12);};
   const go=async solo=>hp(await K.musicRender(id,secs,{sr,boss,int,solo}));
   const mel=await go(['lead','arp','pad']),fu=await go(null);
   const bars=[];for(let t=0;t+bar<=secs-.6;t+=bar){const a=Math.floor(t*sr),b=Math.floor((t+bar)*sr);
     bars.push({t:+t.toFixed(1),I:int(t),mel:+db(mel,a,b).toFixed(1),full:+db(fu,a,b).toFixed(1)});}
   // sekce v čase (stejná logika jako songPos)
   return {bpm,style:K._ev("SONGS['"+id+"'].style"),bars,err:String(K._ev('M.err')||'')};},id);
  // názvy sekcí po taktech
  const names=await P.p.evaluate(([id,n,boss])=>{const K=window.__krypta;return K._ev(`(()=>{const keep={song:M.song,bb:M.bossBar};setSong('${id}');const out=[];const bar=60/M.song.bpm*4;
    const bb=Math.ceil(${boss}/bar-1e-9);for(let b=0;b<${n};b++){M.bossBar=b>=bb?bb:null;out.push(songPos(b*16).id);}
    M.song=keep.song;M.bossBar=keep.bb;return out;})()`);},[id,r.bars.length,75]);
  r.bars.forEach((b,i)=>b.sec=names[i]);all[id]=r;
  // propad = takt, který na telefonu hraje o víc než 6 dB (v klidu 9 dB) tišeji než medián běhu (I1–I2)
  const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];},run=med(r.bars.filter(b=>b.I===1||b.I===2).map(b=>b.full)),
    boss=med(r.bars.filter(b=>b.I===3).map(b=>b.full)),calm=med(r.bars.filter(b=>b.I===0).map(b=>b.full));
  const dip=r.bars.filter(b=>b.full<run-(b.I===0?9:6));Object.assign(r,{run,boss,calm,dip:dip.length});
  console.log(id.padEnd(11),r.style.padEnd(7),'běh',run.toFixed(1),' klid',(calm-run).toFixed(1),' boss +'+(boss-run).toFixed(1),
    ' propady',String(dip.length).padStart(2)+'/'+r.bars.length,' ',dip.map(b=>b.sec+'@'+Math.round(b.t)+'s(I'+b.I+','+(b.full-run).toFixed(0)+')').join(' '),r.err);
  const bad=[];if(r.dip)bad.push('propady');const cd=r.calm-r.run,bd=r.boss-r.run;if(cd>-2||cd<-6)bad.push('klid '+cd.toFixed(1));if(bd<3||bd>5.5)bad.push('boss +'+bd.toFixed(1));
  if(bad.length){fails++;console.log('   MIMO CÍL '+id+': '+bad.join(', ')+(bd<3&&!r.dip?'  → nejdřív hustší melodie/akordy v boss sekcích, jinak SONGS.'+id+'.bossDb:'+(4-bd).toFixed(1):''));}
 }
 console.log(fails?'\nVERDIKT: '+fails+' skladeb mimo cíl':'\nVERDIKT: vše v cíli');
 if(OUT)fs.writeFileSync(OUT,JSON.stringify(all));await P.close();process.exitCode=fails?1:0;})();
