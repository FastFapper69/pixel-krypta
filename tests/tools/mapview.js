// map check: node mapview.js <map> <prefix> [x,y;x,y...] -> <prefix>-over.png (whole map with props) + <prefix>-N.png in-game shots
const {chromium}=require('playwright');
const map=process.argv[2]||'bazina',pre=process.argv[3]||'mv',spots=(process.argv[4]||'').split(';').filter(Boolean).map(s=>s.split(',').map(Number));
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(500);
const info=await p.evaluate(map=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;const t=performance.now();K.startRun('knight',map);const bt=performance.now()-t;
 for(let i=0;i<60;i++)K.step(1/60);return{bt:Math.round(bt),size:K.run2.map.size};},map);
// overview
const ov=await p.evaluate(()=>{const K=window.__krypta,R=K.run2,bm=R.built,sz=R.map.size,o=document.createElement('canvas'),S=760/sz;o.width=o.height=760;const g=o.getContext('2d');
 g.drawImage(bm.canvas,0,0,sz*2,sz*2,0,0,760,760);for(const q of bm.props){const s=q.spr;g.drawImage(s.c,(q.x-s.w/2)*S,(q.y-s.h+1)*S,s.w*S,s.h*S);}
 g.globalCompositeOperation='lighter';for(const q of bm.lights){const gr=g.createRadialGradient(q.x*S,q.y*S,0,q.x*S,q.y*S,q.r*S);gr.addColorStop(0,q.col||'#ffb060');gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.5;g.fillStyle=gr;g.fillRect(q.x*S-q.r*S,q.y*S-q.r*S,q.r*2*S,q.r*2*S);}
 return o.toDataURL();});
const fs=require('fs');fs.writeFileSync(pre+'-over.png',Buffer.from(ov.split(',')[1],'base64'));
let i=0;for(const [x,y] of (spots.length?spots:[[info.size/2,info.size/2+20]])){await p.evaluate(([x,y])=>{const K=window.__krypta,R=K.run2;R.p.x=x;R.p.y=y;for(let i=0;i<30;i++)K.step(1/60);},[x,y]);
 await p.waitForTimeout(120);await p.screenshot({path:pre+'-'+(i++)+'.png'});}
console.log(JSON.stringify(info),errs.slice(0,5));await b.close();})();
