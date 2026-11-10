// Rychlá varianta poslechu: jen hudba, offline render ve stereu (pár sekund místo minuty). Rozbor stejně: python3 poslech.py <prefix>
// node poslech-offline.js [skladba=hrbitov] [sekund=40] [boss_od=26] [vystup=poslech-off]
const L=require('./lib'),fs=require('fs');
const [ID='hrbitov',SECS='40',BOSS='26',OUT='poslech-off']=process.argv.slice(2);
(async()=>{L.prep();const P=await L.open({save:'late'});
 const r=await P.p.evaluate(async([id,secs,boss])=>{const K=window.__krypta,sr=44100;
  const [l,rr]=await K.musicRender(id,secs,{sr,ch:2,boss,int:t=>t<8?0:t<16?1:t<boss?2:3});
  return {L:Array.from(l),R:Array.from(rr),sr,bpm:K._ev('SONGS[\''+id+'\'].bpm'),err:String(K._ev('M.err')||'')};},[ID,+SECS,+BOSS]);
 const n=r.L.length,buf=Buffer.alloc(44+n*4);buf.write('RIFF',0);buf.writeUInt32LE(36+n*4,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);
 buf.writeUInt32LE(r.sr,24);buf.writeUInt32LE(r.sr*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.L[i]*32767))),44+i*4);buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.R[i]*32767))),46+i*4);}
 fs.writeFileSync(OUT+'-'+ID+'.wav',buf);
 fs.writeFileSync(OUT+'-'+ID+'.json',JSON.stringify({map:ID,hero:'(offline)',bpm:r.bpm,step:60/r.bpm/4,sr:r.sr,events:[[+BOSS,'BOSS']],musicErr:r.err}));
 console.log('render',(n/r.sr).toFixed(1),'s',r.err);await P.close();})();
