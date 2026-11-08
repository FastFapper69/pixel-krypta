// renders music + an ultimate drop (riser in the bar before) into WAV files for listening: node droprender.js <outdir> [map] [ids]
const {chromium}=require('playwright');const fs=require('fs');
const out=process.argv[2]||'.',map=process.argv[3]||'hrbitov',ids=(process.argv[4]||'storm,meteor,vortex,blizzard,echo,arcane,flamering,steam').split(',');
function wav(f32,sr){const n=f32.length,b=Buffer.alloc(44+n*2);b.write('RIFF',0);b.writeUInt32LE(36+n*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);
 b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);for(let i=0;i<n;i++)b.writeInt16LE(Math.max(-1,Math.min(1,f32[i]))*32767|0,44+i*2);return b;}
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(400);
 for(const id of ids){
  const r=await p.evaluate(async([map,id])=>{const K=window.__krypta;K.save.sound=true;K.save.music=true;K.save.tut=1;K.startRun('knight',map);K.run.W={};K.run.W[id]={lv:3,mul:1};K.run.t=200;
   return await K._ev(`(async()=>{const sr=22050,secs=11,oac=new OfflineAudioContext(1,sr*secs,sr),keep={ac,mb:M.musicBus,sb:M.sfxBus,song:M.song,noise:M.noise};
     ac=oac;M.offline=true;const comp=oac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(oac.destination);
     M.musicBus=oac.createGain();M.musicBus.gain.value=.3;M.musicBus.connect(comp);M.sfxBus=oac.createGain();M.sfxBus.gain.value=.5;M.sfxBus.connect(comp);
     {const bb=oac.createBuffer(1,sr,sr),d=bb.getChannelData(0);for(let i=0;i<sr;i++)d[i]=Math.random()*2-1;M.noise=bb;}
     setSong('${map}');M.int=2;const sd=M.stepDur,n=Math.floor((secs-1)/sd);
     try{for(let s=0;s<n;s++){const tt=s*sd+.02;M.step=s+1;M.lastAudio=tt;playStep(s,tt);
       if(s%64===48)ultRiser();if(s%64===0&&s>0)ultDropSfx('${id}',true);}}finally{ac=keep.ac;M.musicBus=keep.mb;M.sfxBus=keep.sb;M.offline=false;M.noise=keep.noise;}
     const buf=await oac.startRendering();const d=buf.getChannelData(0);let pk=0;for(const v of d)pk=Math.max(pk,Math.abs(v));return {pk,data:Array.from(d.subarray(0,d.length))};})()`);},[map,id]);
  fs.writeFileSync(out+'/drop_'+id+'.wav',wav(Float32Array.from(r.data),22050));console.log(id,'peak',r.pk.toFixed(2));}
 console.log(errs.slice(0,3));await b.close();})();
