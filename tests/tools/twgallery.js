// galerie spritů všech věží (porovnání velikosti a stylu): node twgallery.js out.png
const {chromium}=require('playwright');const out=process.argv[2]||'twgallery.png';
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const url=await p.evaluate(()=>window.__krypta._ev(`(()=>{const ks=Object.keys(TOWERS),S=6,cv=document.createElement('canvas'),W=ks.length*20*S;cv.width=W;cv.height=46*S;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
   g.fillStyle='#3a3448';g.fillRect(0,0,W,cv.height);ks.forEach((k,i)=>{const s=SPR.tower[k];g.drawImage(s.c,(i*20+10-s.w/2)*S,(40-s.h)*S,s.w*S,s.h*S);});return cv.toDataURL();})()`));
 require('fs').writeFileSync(out,Buffer.from(url.split(',')[1],'base64'));await b.close();})();
