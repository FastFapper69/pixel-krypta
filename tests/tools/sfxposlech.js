// 12g: poslech nových efektů (bedny, boss, kovárna, nákup) se skutečnou hudbou hry – nahraje výstup v reálném čase,
// vypíše špičku každého efektu nad hudbou (dB) a chyby uvnitř sfx (KRYPTA_SFXDBG). node sfxposlech.js [vystup=sfx] [skladba=hrbitov]
// → <vystup>.wav + <vystup>.json; rozbor zvuku dál: python3 poslech.py <vystup>
const L=require('./lib'),fs=require('fs');const [OUT='sfx',SONG='hrbitov']=process.argv.slice(2);
const SEQ=[['chestdrop'],['chestopen'],['hop',0,'riser',1.2],['hop',1],['hop',2],['open',0],['open',1],['open',2],['open',3],['open',4],['elite'],['bossdie'],['anvil'],['equip'],['buy']];
(async()=>{L.prep();const b=await require('playwright').chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const P=await L.open({browser:b,save:'late'});const E=P.E;await P.p.evaluate(()=>{window.KRYPTA_SFXDBG=1;});
 await E("save.sound=true;save.music=true;save.vol={m:.8,s:1};audioInit();setBuses()");await P.p.waitForTimeout(300);
 await P.p.evaluate(()=>{const K=window.__krypta,ac=K._ev('ac'),M=K._ev('M');window.__rec={L:[],R:[],t0:0};
  const sp=ac.createScriptProcessor(4096,2,2);sp.onaudioprocess=e=>{const r=window.__rec;if(!r.on)return;if(!r.t0)r.t0=e.playbackTime;r.L.push(Array.from(e.inputBuffer.getChannelData(0)));r.R.push(Array.from(e.inputBuffer.getChannelData(1)));};
  const z=ac.createGain();z.gain.value=0;M.master.connect(sp);sp.connect(z);z.connect(ac.destination);window.__sr=ac.sampleRate;});
 await E(`window.__krypta.god=true;startRun('knight','${SONG}');M.log=[];run.enemies.length=0;`);await P.p.evaluate(()=>{window.__rec.on=true;});await P.p.waitForTimeout(2500);
 for(const s of SEQ){await E("M.log.push([ac.currentTime,'SFX:"+s[0]+(s[1]!=null?s[1]:'')+"']);sfx('"+s[0]+"',"+(s[1]!=null?s[1]:'undefined')+")"+(s[2]?";sfx('"+s[2]+"',"+s[3]+")":""));
  await P.p.waitForTimeout(s[0]==='bossdie'?4200:s[0]==='hop'?450:s[0]==='open'?2400:1800);
  await E("run.enemies.length=0;if(state!=='play')state='play'");}
 const r=await P.p.evaluate(()=>{const r=window.__rec;r.on=false;const M=window.__krypta._ev('M');return {L:r.L.flat(),R:r.R.flat(),t0:r.t0,sr:window.__sr,log:M.log,bpm:M.song&&M.song.bpm};});
 const n=r.L.length,buf=Buffer.alloc(44+n*4);buf.write('RIFF',0);buf.writeUInt32LE(36+n*4,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);
 buf.writeUInt32LE(r.sr,24);buf.writeUInt32LE(r.sr*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.L[i]*32767))),44+i*4);buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.R[i]*32767))),46+i*4);}
 fs.writeFileSync(OUT+'.wav',buf);const ev=r.log.map(([t,k])=>[+(t-r.t0).toFixed(3),k]);fs.writeFileSync(OUT+'.json',JSON.stringify({events:ev,bpm:r.bpm,sr:r.sr,errs:P.errs}));
 // špička efektu (0,0–1,2 s po spuštění) proti hudbě (RMS 1 s před ním), mono
 const m=i=>(r.L[i]+r.R[i])/2,db=v=>20*Math.log10(Math.max(1e-6,v)),out=[];
 for(const [t,k] of ev){if(!String(k).startsWith('SFX:'))continue;const a=Math.round(t*r.sr),pre=Math.max(0,a-r.sr);let s=0;for(let i=pre;i<a;i++)s+=m(i)**2;const rms=Math.sqrt(s/Math.max(1,a-pre));
  let pk=0,ps=0,c=0;for(let i=a;i<Math.min(n,a+r.sr*1.2);i++){pk=Math.max(pk,Math.abs(m(i)));ps+=m(i)**2;c++;}out.push(k.slice(4).padEnd(10)+' špička '+db(pk).toFixed(1)+' dB, RMS '+db(Math.sqrt(ps/c)).toFixed(1)+' dB, hudba '+db(rms).toFixed(1)+' dB → +'+(db(Math.sqrt(ps/c))-db(rms)).toFixed(1)+' dB');}
 console.log(out.join('\n'));console.log('chyby:',P.errs.length?P.errs:'žádné');await P.close();await b.close();})();
