// Štítky rarity na kartách Arzenálu (09u): skutečné vykreslení + fitCards, všechny rarity a nejdelší jména –
// nic se neořízne, čip je vycentrovaný, bez stínu, celá řada stejně velká. node rplabel.js [cs|en]
const {chromium}=require('playwright');const lang=process.argv[2]||'cs';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:393,height:852},isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
 await E("save.tut=1;featInit();for(const F of FEATS)save.feat[F.id]=1;twInit();openMenu();openTowers()");await p.waitForTimeout(300);
 await p.evaluate(()=>{const E=x=>window.__krypta._ev(x);const ks=E('Object.keys(TOWERS).sort((a,b)=>TOWERS[b].name.length-TOWERS[a].name.length)');
   [...document.querySelectorAll('#scr-towers .tdeck .tslot')].forEach((t,i)=>{const r=i%5,k=ks[i%ks.length];t.className='tslot r'+r;
     t.innerHTML='<img alt="" src="'+E("dataUrl(SPR.tower['"+k+"'])")+'"><b>'+E("TOWERS['"+k+"'].name")+'</b><small class="rp" style="--rc:'+E('RAR['+r+'].col')+'">'+E('RAR['+r+'].name')+'</small>'+(i%2?'<i class="tlv">+'+i+'</i>':'');});});
 await E("fitCards(document.getElementById('scr-towers'))");await p.waitForTimeout(300);
 const m=await p.evaluate(()=>[...document.querySelectorAll('#scr-towers .tdeck .tslot')].map(t=>{const el=t.querySelector('small.rp'),n=t.querySelector('b'),a=el.getBoundingClientRect(),c=t.getBoundingClientRect();
   return {t:el.textContent,over:el.scrollWidth>el.clientWidth+.5||n.scrollWidth>n.clientWidth+.5,off:Math.abs((a.left+a.width/2)-(c.left+c.width/2)),ts:getComputedStyle(el).textShadow,fs:getComputedStyle(el).fontSize,w:Math.round(c.width)};}));
 const bad=m.filter(x=>x.over||x.off>2||x.ts!=='none');const sizes=new Set(m.map(x=>x.fs)),widths=new Set(m.map(x=>x.w));
 console.log(bad.length||sizes.size>1||widths.size>1?'PROBLÉM '+JSON.stringify({bad,sizes:[...sizes],widths:[...widths]}):'ok: '+m.map(x=>x.t).join(', ')+' | velikost '+[...sizes]+' | šířka karet '+[...widths]);
 console.log('chyby',errs);await b.close();process.exit(bad.length||sizes.size>1||widths.size>1||errs.length?1:0);})();
