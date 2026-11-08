// pohlednice jen pro vybrané mapy: node thumbgen5.js mapa,mapa  (ostatní soubory v thumbs/ nechá být)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const ids=(process.argv[2]||'').split(',').filter(Boolean);
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
const out=await p.evaluate(ids=>{const K=window.__krypta,o={};for(const id of ids){K.buildMap(id);o[id]=K.mapThumb(id).toDataURL();delete K.mapsBuilt[id];}return o;},ids);
const dir=path.join(__dirname,'..','..','thumbs');for(const id in out)fs.writeFileSync(path.join(dir,id+'.png'),Buffer.from(out[id].split(',')[1],'base64'));
console.log(Object.keys(out).length,'postcards',errs);await b.close();})();
