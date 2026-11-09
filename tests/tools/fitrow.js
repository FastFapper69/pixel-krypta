// Arzenál: nejdelší jména věží a všechny rarity na šířce displeje W – nic oříznuté, zvětšený výřez. node fitrow.js W cs|en [snímek.png]
const {chromium}=require('playwright');const W=+process.argv[2],lang=process.argv[3]||'cs',shot=process.argv[4];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:W,height:800},deviceScaleFactor:3,isMobile:true});await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;featInit();for(const F of FEATS)save.feat[F.id]=1;twInit();openMenu();openTowers()");
 await p.evaluate(()=>{const E=x=>window.__krypta._ev(x);const ks=E('Object.keys(TOWERS).sort((a,b)=>TOWERS[b].name.length-TOWERS[a].name.length)');
   [...document.querySelectorAll('#scr-towers .tdeck .tslot')].forEach((t,i)=>{t.className='tslot r'+i;t.innerHTML='<img alt="" src="'+E('dataUrl(SPR.tower["'+ks[i]+'"])')+'"><b>'+E('TOWERS["'+ks[i]+'"].name')+'</b><small class="rp" style="--rc:'+E('RAR['+i+'].col')+'">'+E('RAR['+i+'].name')+'</small>'+(i%2?'<i class="tlv">+'+i+'</i>':'');});});
 await E("fitCards(document.getElementById('scr-towers'))");await p.waitForTimeout(700);
 const r=await p.evaluate(()=>[...document.querySelectorAll('#scr-towers .tdeck .tslot')].map(t=>{const b=t.querySelector('b'),s=t.querySelector('small');return {n:b.textContent,nf:parseFloat(getComputedStyle(b).fontSize),no:b.scrollWidth>b.clientWidth+.5,sf:parseFloat(getComputedStyle(s).fontSize),so:s.scrollWidth>s.clientWidth+.5};}));
 const over=r.filter(x=>x.no||x.so);console.log(lang,W,over.length?'OŘÍZNUTO: '+over.map(x=>x.n).join(','):'ok','| jména',Math.min(...r.map(x=>x.nf))+'–'+Math.max(...r.map(x=>x.nf))+'px | čipy',r[0].sf+'px');
 if(shot){const box=await p.evaluate(()=>{const q=document.querySelector('#scr-towers .tdeck').getBoundingClientRect();return {x:q.x,y:q.y,width:q.width,height:q.height};});await p.screenshot({path:shot,clip:box});}
 await b.close();process.exit(over.length?1:0);})();
