// Mockup v2: the original menu buttons, fewer of them (Hrát, Ve dvou, Hrdina, Obchod, Nástěnka, Síň slávy)
// plus a top bar with currencies and small icon buttons (Novinky, Průvodce, Nastavení). node menu_mock2.js <prefix> [iphone]
const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2]||'mock2',IP=process.argv[3]==='iphone';
fs.writeFileSync(__dirname+'/_mock.html',fs.readFileSync(__dirname+'/off.html','utf8').replace('window.__krypta={','window.__krypta={SPR,dataUrl,buildSprite,'));
const CSS=`
#mtop{position:absolute;left:0;right:0;top:0;z-index:25;display:flex;align-items:center;gap:8px;padding:calc(8px + var(--sat,0px)) 12px 16px;background:linear-gradient(#0c0912d0,#0c091280 60%,#0c091200)}
#mtop .cur{display:flex;gap:10px;margin-right:auto;padding:5px 10px;font-size:14px;font-weight:700;white-space:nowrap;clip-path:var(--px);background:#0c0912c0;box-shadow:inset 0 0 0 2px var(--line)}
#mtop .cur span{display:flex;align-items:center;gap:4px}#mtop .cur span:first-child{color:var(--gold)}#mtop .cur img{width:18px;height:18px;image-rendering:pixelated}
#mtop .btn.ic{width:42px;height:42px;min-height:0;padding:0;position:relative}#mtop .btn.ic img{width:24px;height:24px;image-rendering:pixelated}
#mtop .dot,.mdot{position:absolute;top:5px;right:5px;width:8px;height:8px;background:var(--red);box-shadow:0 0 0 2px #2a0a10}
#scr-menu .wrap{gap:14px;min-height:100%;margin:0}#scr-menu .wrap>.sp{flex:1}
#scr-menu .btn.big .bi img{width:30px;height:30px}
#mGrid .btn{min-height:64px;font-size:18px;white-space:nowrap;padding:10px 8px}#mGrid .btn .lbl{letter-spacing:.02em}#mGrid .btn .bi{margin-right:8px}
#mGrid .btn .bi img{width:30px;height:30px}
.sheetbg{position:absolute;inset:0;z-index:40;background:#0c0912b0;display:flex;align-items:flex-end}
.sheet{width:100%;padding:16px 16px calc(18px + var(--sab,0px));background:var(--panel) var(--tex);background-size:32px 32px;clip-path:polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% 100%,0 100%);box-shadow:inset 0 3px 0 var(--gold-dk),inset 0 6px 0 #0c0912;display:flex;flex-direction:column;gap:8px}
.sheet h3{margin:4px 0;font:700 26px var(--font-px);color:var(--gold)}
.sheet .row3{margin-top:2px}.sheet .ver{text-align:center;color:var(--muted);font-size:12px;margin-top:4px}
`;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:IP?{width:393,height:852}:{width:390,height:800},deviceScaleFactor:2});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','cs'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/_mock.html');await p.waitForTimeout(500);
 for(const sheet of [0,1]){
 await p.evaluate(([CSS,sheet,IP])=>{const K=window.__krypta,S=K.SPR,D=K.dataUrl,bs=K.buildSprite,$=q=>document.querySelector(q);
  K.save.sound=true;K.save.music=true;K.save.newsSeen='2099';K.save.coins=1240;K.openMenu();
  if(IP){const R=document.documentElement.style;R.setProperty('--sat','59px');R.setProperty('--sab','34px');}
  if(!$('#mockcss')){const st=document.createElement('style');st.id='mockcss';st.textContent=CSS;document.head.appendChild(st);}
  const gear=bs(['.s.ss.s.','.ssssss.','ssSSSSss','.sS..Ss.','.sS..Ss.','ssSSSSss','.ssssss.','.s.ss.s.'],{mirror:false,pal:{s:'#c8c4d8',S:'#7a7690'},shade:false});
  const bell=bs(['...yy...','..yyyy..','.yywyyy.','.ywyyyy.','.yyyyyy.','yyyyyyyy','oooooooo','...oo...'],{mirror:false,pal:{y:'#f6c744',w:'#fff6c8',o:'#a97a14'},shade:false});
  const I=k=>D(S.icon[k]);
  if(!$('#mtop')){
   for(const q of ['#mShop','#mCodex','#mMaster','#mGuide','#mNews','#scr-menu .row3','#mLang','#mVer','#scr-menu .coins.pill','#mNick'])$(q).style.display='none';
   document.querySelectorAll('#scr-menu .wrap > .hint:not(#mWarn)').forEach(e=>e.style.display='none');
   document.querySelectorAll('#scr-menu .stack .row2').forEach(e=>e.style.display='none');
   const g=document.createElement('div');g.id='mGrid';g.style.cssText='display:flex;flex-direction:column;gap:10px';
   const r1=document.createElement('div');r1.className='row2';r1.append($('#mHero'),$('#mChest'));
   const r2=document.createElement('div');r2.className='row2';r2.append($('#mQuest'),$('#mBoard'));g.append(r1,r2);
   $('#mCoop').after(g);$('#mBoard .lbl').textContent='Síň slávy';
   $('#mPlay').classList.add('big');$('#mPlay').style.minHeight='64px';$('#mPlay').style.fontSize='24px';
   const t=document.createElement('div');t.id='mtop';
   t.innerHTML=`<div class="cur"><span><img src="${I('coin')}">1240</span><span><img src="${I('bone')}">36</span><span><img src="${I('amber')}">12</span><span><img src="${I('magma')}">4</span></div>
    <button class="btn alt ic"><img src="${D(bell)}"><i class="dot"></i></button><button class="btn alt ic"><img src="${I('book')}"></button><button class="btn alt ic"><img src="${D(gear)}"></button>`;
   $('#scr-menu').prepend(t);const sp1=document.createElement('div');sp1.className='sp';const sp2=document.createElement('div');sp2.className='sp';$('#scr-menu .logobox').before(sp1);$('#scr-menu .paradebox').after(sp2);
   $('#scr-menu').style.paddingTop='calc(64px + var(--sat,0px))';
   if(IP){const sb=document.createElement('div');sb.style.cssText='position:fixed;z-index:99;left:0;right:0;top:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:4px 34px 0 52px;font:600 17px -apple-system,system-ui,sans-serif;color:#fff';
    sb.innerHTML='<span>9:41</span><span style="display:flex;gap:6px;align-items:center"><i style="display:inline-block;width:18px;height:11px;background:linear-gradient(90deg,#fff 0 3px,transparent 3px 5px,#fff 5px 8px,transparent 8px 10px,#fff 10px 13px,transparent 13px 15px,#fff 15px)"></i><i style="display:inline-block;width:16px;height:11px;border-radius:8px 8px 2px 2px;background:#fff"></i><i style="display:inline-block;width:25px;height:12px;border:2px solid #ffffffaa;border-radius:4px;box-shadow:inset 0 0 0 1px #000,inset 17px 0 0 #fff"></i></span>';document.body.appendChild(sb);
    const isl=document.createElement('div');isl.style.cssText='position:fixed;z-index:99;left:50%;top:11px;width:126px;height:37px;margin-left:-63px;border-radius:20px;background:#000';document.body.appendChild(isl);
    const h=document.createElement('div');h.style.cssText='position:fixed;z-index:99;left:50%;bottom:8px;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#fff';document.body.appendChild(h);}
  }
  const old=$('.sheetbg');if(old)old.remove();
  if(sheet){const sh=document.createElement('div');sh.className='sheetbg';
   sh.innerHTML=`<div class="sheet"><h3>Nastavení</h3><button class="btn alt sm">${'<span class="bi"><img src="'+D(S.hero.knight)+'"></span>'}FastFapper · Dobyvatel krypty</button>
    <div class="row3"><button class="btn alt sm"><span class="bi"><img src="${I('sound')}"></span>Zvuk</button><button class="btn alt sm"><span class="bi"><img src="${I('music')}"></span>Hudba</button><button class="btn alt sm"><span class="bi"><img src="${I('stick')}"></span>Ovládání</button></div>
    <div class="tabs langsw"><button class="on">Čeština</button><button>English</button></div>
    <button class="btn alt sm"><span class="bi"><img src="${I('phone')}"></span>Přidat hru na plochu</button><p class="ver">verze 2026-11-07f</p></div>`;$('#scr-menu').appendChild(sh);}
 },[CSS,sheet,IP]);
 await p.waitForTimeout(400);await p.screenshot({path:pre+'_'+sheet+'.png'});}
 console.log(errs);await b.close();fs.unlinkSync(__dirname+'/_mock.html');})();
