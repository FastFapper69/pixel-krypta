// „Poslech“ hry: nahraje skutečný zvukový výstup (hudba + efekty) z běžící hry v reálném čase a zapíše WAV + časy událostí.
// node poslech.js [mapa=hrbitov] [hrdina=knight] [sekund=60] [boss_od=35] [vystup=poslech]
//   → <vystup>-<mapa>.wav (stereo 44,1 kHz), <vystup>-<mapa>.json (sfx a ultimátky s časem, beaty, BPM)
// Rozbor: python3 poslech.py <vystup>-<mapa>   (spektrogram, hlasitost, stereo, telefon, rytmus)
const L=require('./lib'),fs=require('fs');
const [MAP='hrbitov',HERO='knight',SECS='60',BOSS='35',OUT='poslech']=process.argv.slice(2);
(async()=>{L.prep();
 const b=await require('playwright').chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const P=await L.open({browser:b,save:'late'});const E=P.E;
 await E("save.sound=true;save.music=true;save.vol={m:.8,s:1};audioInit();setBuses()");await P.p.waitForTimeout(300);
 await P.p.evaluate(()=>{const K=window.__krypta,ac=K._ev('ac'),M=K._ev('M');window.__rec={L:[],R:[],t0:0};
  const sp=ac.createScriptProcessor(4096,2,2);sp.onaudioprocess=e=>{const r=window.__rec;if(!r.on)return;if(!r.t0)r.t0=e.playbackTime;
   r.L.push(Array.from(e.inputBuffer.getChannelData(0)));r.R.push(Array.from(e.inputBuffer.getChannelData(1)));};
  const z=ac.createGain();z.gain.value=0;M.master.connect(sp);sp.connect(z);z.connect(ac.destination);window.__sr=ac.sampleRate;});
 await P.p.evaluate(()=>{window.__krypta.god=true;});await E(`startRun('${HERO}','${MAP}');M.log=[];`);
 await P.p.evaluate(()=>{window.__rec.on=true;});
 // pohyb: kruh kolem středu + občas změna směru, ať se sbírají krystaly a zabíjí
 const keys=['KeyW','KeyD','KeyS','KeyA'];let k=0,bossDone=false;const t0=Date.now();
 while(Date.now()-t0<+SECS*1000){const sec=(Date.now()-t0)/1000;
  await P.p.keyboard.down(keys[k%4]);await P.p.waitForTimeout(700);await P.p.keyboard.up(keys[k%4]);k++;
  if(!bossDone&&sec>=+BOSS){bossDone=true;await E("spawnBoss();M.log.push([ac.currentTime,'BOSS'])");}
  const st=await E("state");if(st==='levelup')await E("document.querySelector('#luList button')&&document.querySelector('#luList button').click()");
  else if(st!=='play'&&st!=='fuse')await E("state='play'");}
 const r=await P.p.evaluate(()=>{const r=window.__rec;r.on=false;const M=window.__krypta._ev('M');
  return {L:r.L.flat(),R:r.R.flat(),t0:r.t0,sr:window.__sr,log:M.log,bpm:M.song&&M.song.bpm,step:M.stepDur,err:String(M.err||'')};});
 // WAV 16 bit stereo
 const n=r.L.length,buf=Buffer.alloc(44+n*4);buf.write('RIFF',0);buf.writeUInt32LE(36+n*4,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);
 buf.writeUInt32LE(r.sr,24);buf.writeUInt32LE(r.sr*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.L[i]*32767))),44+i*4);buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.R[i]*32767))),46+i*4);}
 fs.writeFileSync(OUT+'-'+MAP+'.wav',buf);
 fs.writeFileSync(OUT+'-'+MAP+'.json',JSON.stringify({map:MAP,hero:HERO,bpm:r.bpm,step:r.step,sr:r.sr,events:r.log.map(([t,k])=>[+(t-r.t0).toFixed(4),k]),musicErr:r.err,errs:P.errs}));
 console.log('nahráno',(n/r.sr).toFixed(1),'s,',r.log.length,'událostí, BPM',r.bpm,P.errs.length?'CHYBY '+P.errs:'');
 await P.close();await b.close();})();
