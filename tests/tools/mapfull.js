// 11o: celá mapa stavebnice jako jeden obrázek (zem + rekvizity + světla), na kontrolu rozvržení: node mapfull.js mapa,mapa [prefix]
const {chromium}=require('playwright');const maps=(process.argv[2]||'predmesti').split(','),pre=process.argv[3]||'/tmp/full';
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:600,height:600}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 for(const m of maps){const url=await p.evaluate(m=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.tut=1;K.startRun('knight',m);const R=K.run,B=R.built,sz=R.map.size;
   const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(B.canvas,0,0,sz,sz);
   for(const L of B.lights||[]){const gr=g.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r);gr.addColorStop(0,L.col+'55');gr.addColorStop(1,L.col+'00');g.fillStyle=gr;g.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2);}
   const P=(B.props||[]).slice().sort((a,b)=>a.y-b.y);for(const q of P){const s=q.spr;g.drawImage(s.c,Math.round(q.x-s.w/2),Math.round(q.y-s.h),s.w,s.h);}
   return c.toDataURL();},m);
  require('fs').writeFileSync(pre+'_'+m+'.png',Buffer.from(url.split(',')[1],'base64'));}
 console.log('ok',errs.slice(0,3));await b.close();})();
