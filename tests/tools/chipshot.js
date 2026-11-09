// Arzenál věží a mazlíčků: karty ve všech raritách (s úrovní i bez) – zvětšený výřez na kontrolu vzhledu štítků. node chipshot.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:3,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;save.newsSeen=GAME_VER;save.stats={runs:30};featInit();for(const F of FEATS)save.feat[F.id]=1;save.featSum=0;twInit();petInit();persist();openMenu();openTowers()");await p.waitForTimeout(400);
 // fill the 5 slots with real deck cards of each rarity, two of them with a level
 await p.evaluate(()=>{const K=window.__krypta,E=x=>K._ev(x);const sl=[...document.querySelectorAll('#scr-towers .tdeck .tslot')];const ks=E('Object.keys(TOWERS).sort((a,b)=>TOWERS[b].name.length-TOWERS[a].name.length)');
   sl.forEach((t,i)=>{const r=i%5,k=ks[(i*3)%ks.length];t.className='tslot r'+r;t.innerHTML='<img alt="" src="'+E("dataUrl(SPR.tower['"+k+"'])")+'"><b>'+E("TOWERS['"+k+"'].name")+'</b><small class="rp" style="--rc:'+E('RAR['+r+'].col')+'">'+E('RAR['+r+'].name')+'</small>'+(i%2?'<i class="tlv">+'+i+'</i>':'');});});
 await E("fitCards(document.getElementById('scr-towers'))");await p.waitForTimeout(300);const box=await p.evaluate(()=>{const r=document.querySelector('#scr-towers .tdeck').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
 await p.screenshot({path:pre+'_tw.png',clip:box});
 const m=await p.evaluate(()=>[...document.querySelectorAll('#scr-towers .tdeck .tslot small.rp')].map(el=>{const a=el.getBoundingClientRect(),c=el.parentElement.getBoundingClientRect();const n=el.parentElement.querySelector('b');return {t:el.textContent,fs:el.style.fontSize,name:n.textContent,nameOver:n.scrollWidth>n.clientWidth+.5,nfs:n.style.fontSize,off:Math.round((a.left+a.width/2)-(c.left+c.width/2)),over:el.scrollWidth>el.clientWidth+1,bottomGap:Math.round(c.bottom-a.bottom)};}));
 console.log(JSON.stringify(m));
 await E("openPets()");await p.waitForTimeout(400);const pb=await p.evaluate(()=>{const e=document.querySelector('#scr-pets .ptslot');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
 if(pb)await p.screenshot({path:pre+'_pet.png',clip:pb});console.log('chyby',errs);await b.close();})();
