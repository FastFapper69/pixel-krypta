// arch předmětů a ikon zvětšený: node itemsheet.js out.png [klíče oddělené čárkou, jinak výbava]
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
const url=await p.evaluate(keys=>{const K=window.__krypta,E=K._ev;const list=keys?keys.split(','):E("[...SLOT_IDS.flatMap(s=>[0,1,2,3].map(r=>s+':'+r)),...Object.keys(BASES).map(b=>'b:'+b)]");
 const spr=k=>{const [a,c]=k.split(':');if(a==='b')return E("itemSpr(BASES['"+c+"'].s,3,null,'"+c+"')");if(c!==undefined&&E("!!SLOTS['"+a+"']"))return E("itemSpr('"+a+"',"+c+")");if(a==='boss')return K.SPR.boss[c];if(a==='hero')return K.SPR.hero[c];return K.SPR.icon[a];};
 const S=5,C=8,cw=24*S,rows=Math.ceil(list.length/C),cv=document.createElement('canvas');cv.width=C*cw;cv.height=rows*(cw+16);const g=cv.getContext('2d');g.fillStyle='#231d33';g.fillRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;g.font='12px sans-serif';g.fillStyle='#fff';
 list.forEach((k,i)=>{const s=spr(k);const x=(i%C)*cw,y=Math.floor(i/C)*(cw+16);if(s){const sc=Math.min((cw-10)/s.c.width,(cw-10)/s.c.height);g.drawImage(s.c,x+5,y+5,s.c.width*sc,s.c.height*sc);}g.fillStyle='#fff';g.fillText(k,x+4,y+cw+12);});
 return cv.toDataURL();},process.argv[3]||'');
require('fs').writeFileSync(process.argv[2],Buffer.from(url.split(',')[1],'base64'));console.log(errs);await b.close();})();
