const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:260}});await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const src=fs.readFileSync(__dirname+'/mock/props.js','utf8');await p.evaluate(s=>window.__krypta._ev(s),src);
 await p.evaluate(()=>{const H=window.__krypta._ev('HUBP');document.body.innerHTML='<div id=s style="background:#2a2638;display:flex;gap:20px;padding:20px"></div>';for(const k of ['anvil','armor','board','chest']){const i=document.createElement('img');i.src=window.__krypta._ev("dataUrl(HUBP."+k+")");i.style.cssText='width:180px;height:'+(k==='chest'?160:180)+'px;image-rendering:pixelated';document.getElementById('s').appendChild(i);}});
 await p.waitForTimeout(300);await p.screenshot({path:process.argv[2]});await b.close();})();
