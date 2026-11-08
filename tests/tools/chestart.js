// truhly zblízka: node chestart.js out.png  (všech 5 vedle sebe, zvětšené)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
const url=await p.evaluate(()=>{const K=window.__krypta,ks=['wood','iron','gold','tower','pet'],c=document.createElement('canvas'),S=6;c.width=ks.length*40*S;c.height=36*S;const g=c.getContext('2d');g.fillStyle='#231d33';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 ks.forEach((k,i)=>{const s=K.SPR.icon['chest_'+k].c;g.drawImage(s,i*40*S+2*S,2*S,s.width*S,s.height*S);});return c.toDataURL();});
require('fs').writeFileSync(process.argv[2],Buffer.from(url.split(',')[1],'base64'));console.log(errs);await b.close();})();
