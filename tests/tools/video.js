// 12o: krátké video ze hry na výšku pro TikTok / Reels / Shorts (plán práce #5).
// node video.js [mapa=zvonice] [hrdina=mage] [sekund=24] [boss_od=13] [vystup=out/video] [jazyk=cs]
//   → <vystup>-<mapa>.mp4 (1080×1920, 30 fps, se zvukem hry) a <vystup>-<mapa>.gif (270×480, 10 s, bez zvuku, pro Reddit)
// Natáčí skutečnou hru v reálném čase (Playwright video) a zároveň nahrává zvukový výstup hry (jako poslech.js).
// Hrdina je nesmrtelný, pohyb řídí jednoduchý bot (uhýbá davu, sbírá krystaly), karty vybírá první, věže staví sám.
const L=require('./lib'),fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const [MAP='zvonice',HERO='mage',SECS='24',BOSS='13',OUT='out/video',LANG='cs']=process.argv.slice(2);
(async()=>{L.prep();fs.mkdirSync(path.dirname(OUT),{recursive:true});
 const vdir='/tmp/krypta-video';fs.rmSync(vdir,{recursive:true,force:true});
 const b=await require('playwright').chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 // 9:16 – 360×640 CSS px = velikost videa (Playwright nahrává v CSS px), pak přesně ×3 bez rozmazání na 1080×1920
 const c=await b.newContext({viewport:{width:360,height:640},deviceScaleFactor:1,isMobile:true,hasTouch:true,recordVideo:{dir:vdir,size:{width:360,height:640}}});
 await c.addInitScript(l=>{try{localStorage.setItem('pixel-krypta-lang',l);}catch(_){}},LANG);
 const P=await (async()=>{const p=await c.newPage();await p.goto('file://'+path.join(__dirname,'off.html'));await p.waitForTimeout(800);
   const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);await E("save.sound=false;save.music=false;save.tut=1;"+L.SAVES.late+"save.featNew=[];save.featSum=0;save.storyNew=null;persist();");return {p,E};})();
 const {p,E}=P;
 await E("save.sound=true;save.music=true;save.vol={m:.8,s:1};audioInit();setBuses()");await p.waitForTimeout(300);
 await p.evaluate(()=>{const K=window.__krypta,ac=K._ev('ac'),M=K._ev('M');window.__rec={L:[],R:[]};
  const sp=ac.createScriptProcessor(4096,2,2);sp.onaudioprocess=e=>{const r=window.__rec;if(!r.on)return;r.L.push(Array.from(e.inputBuffer.getChannelData(0)));r.R.push(Array.from(e.inputBuffer.getChannelData(1)));};
  const z=ac.createGain();z.gain.value=0;M.master.connect(sp);sp.connect(z);z.connect(ac.destination);window.__sr=ac.sampleRate;});
 await p.evaluate(()=>{window.__krypta.god=true;});
 await E(`startRun('${HERO}','${MAP}');run.t=Math.min(run.map.dur*.55,Math.max(0,run.map.dur-60));for(let i=0;i<22;i++){const o=levelOptions();const w=o.find(x=>x.k==='w')||o[0];if(w)applyOptCore(w);run.level++;}`); // rovnou do hustší části mapy a se silnou výbavou běhu
 const tStart=Date.now();await p.evaluate(()=>{window.__rec.on=true;});
 // bot: síla od nepřátel, tah ke krystalům a ke středu, plynule (každých 80 ms)
 await p.evaluate(()=>{const K=window.__krypta;window.__botT=setInterval(()=>{const R=K.run;if(!R||R.over)return;const q=R.p;let fx=0,fy=0;
   for(const e of R.enemies){if(e.dead)continue;const dx=q.x-e.x,dy=q.y-e.y,d=Math.hypot(dx,dy)+.01;if(d<70){const k=(70-d)/70*(e.boss?2.5:1);fx+=dx/d*k;fy+=dy/d*k;}}
   let g=null,gd=1e9;for(const i of R.items||[]){if(i.dead)continue;const d=Math.hypot(i.x-q.x,i.y-q.y);if(d<gd){gd=d;g=i;}}
   if(g&&gd<160){fx+=(g.x-q.x)/gd*.8;fy+=(g.y-q.y)/gd*.8;}
   const cx=R.map.size/2-q.x,cy=R.map.size/2-q.y,cd=Math.hypot(cx,cy)||1;if(cd>R.map.size*.3){fx+=cx/cd;fy+=cy/cd;}
   const t=performance.now()/1000;fx+=Math.cos(t*.7)*.35;fy+=Math.sin(t*.9)*.35;const L=Math.hypot(fx,fy);K.force=L>.1?{x:fx/L,y:fy/L}:null;},80);});
 let bossDone=false,built=0;
 while(Date.now()-tStart<+SECS*1000){const sec=(Date.now()-tStart)/1000;
  if(!bossDone&&sec>=+BOSS){bossDone=true;await E("run.bossSpawned||spawnBoss()");} // dvojí boss = dvojí úvodní karta a zamrzlý obraz
  const st=await E("state");if(process.env.VDBG)console.log(sec.toFixed(1),st,await E("run.t.toFixed(1)"));
  if(st==='levelup')await E("(()=>{const b=[...document.querySelectorAll('#luList button')];const f=b.find(x=>/fúz|fusion|ult/i.test(x.textContent))||b[0];f&&f.click();})()");
  else if(st==='fuse')await E("try{fuseTap()}catch(_){}");
  else if(st!=='play')await E("state==='pause'?togglePause(true):0");
  if(built<4&&sec>1+built*2.5){built++;await E("try{const R=run,T=(R.deck||[])[0];if(T){R.coins=Math.max(R.coins,500);buildTower(T);}}catch(_){}");}
  await p.waitForTimeout(150);}
 const r=await p.evaluate(()=>{clearInterval(window.__botT);const r=window.__rec;r.on=false;return {L:r.L.flat(),R:r.R.flat(),sr:window.__sr};});
 const n=r.L.length,buf=Buffer.alloc(44+n*4);buf.write('RIFF',0);buf.writeUInt32LE(36+n*4,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);
 buf.writeUInt32LE(r.sr,24);buf.writeUInt32LE(r.sr*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.L[i]*32767))),44+i*4);buf.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(r.R[i]*32767))),46+i*4);}
 const wav=vdir+'/zvuk.wav';fs.writeFileSync(wav,buf);
 const vid=await p.video().path();await c.close();await b.close();
 // video začíná načtením stránky: uřízneme začátek tak, aby sedělo se zvukem (nahrávka zvuku = posledních n vzorků)
 const vlen=parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${vid}"`).toString()),alen=n/r.sr,ss=Math.max(0,vlen-alen-.15);
 const mp4=`${OUT}-${MAP}.mp4`,gif=`${OUT}-${MAP}.gif`;
 execSync(`ffmpeg -y -loglevel error -ss ${ss.toFixed(2)} -i "${vid}" -i "${wav}" -vf "scale=1080:1920:flags=neighbor,fps=30" -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p -af loudnorm=I=-14:TP=-1.5 -c:a aac -b:a 160k -shortest -movflags +faststart "${mp4}"`);
 execSync(`ffmpeg -y -loglevel error -ss ${(ss+1).toFixed(2)} -t 10 -i "${vid}" -vf "fps=10,scale=270:480:flags=neighbor,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=none" "${gif}"`);
 console.log('hotovo',mp4,(fs.statSync(mp4).size/1e6).toFixed(1)+' MB',gif,(fs.statSync(gif).size/1e6).toFixed(1)+' MB','zvuk',alen.toFixed(1)+' s');})();
