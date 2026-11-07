// renders the map postcards into ../../thumbs/<map>.png (shipped with the game, so phones never build maps just for previews)
// run after changing any map's look, then bump MAP_ART in index.html: node thumbgen.js
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
const out=await p.evaluate(()=>{const K=window.__krypta,o={};for(const C of K.CHAPTERS)for(const id of C.maps){K.buildMap(id);o[id]=K.mapThumb(id).toDataURL();delete K.mapsBuilt[id];}return o;});
const dir=path.join(__dirname,'..','..','thumbs');fs.mkdirSync(dir,{recursive:true});
for(const id in out){fs.writeFileSync(path.join(dir,id+'.png'),Buffer.from(out[id].split(',')[1],'base64'));}
console.log(Object.keys(out).length,'postcards',errs);await b.close();})();
