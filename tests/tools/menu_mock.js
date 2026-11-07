// Mockup of the redesigned menu rendered inside the real game (live map background, real sprites).
// node menu_mock.js <prefix>   (needs off.html made from index.html, see README)
const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2]||'mock',IP=process.argv[3]==='iphone';
let html=fs.readFileSync(__dirname+'/off.html','utf8').replace('window.__krypta={','window.__krypta={SPR,dataUrl,buildSprite,itemSpr,mapThumb,buildMap,mapsBuilt,');
fs.writeFileSync(__dirname+'/_mock.html',html);
const CSS=`
#mock{position:absolute;inset:0;display:flex;flex-direction:column;z-index:30;pointer-events:none;color:var(--fg)}
#mock .top{display:flex;align-items:center;gap:8px;padding:calc(8px + var(--sat,0px)) 10px 18px;background:linear-gradient(#0c0912d0,#0c091290 55%,#0c091200)}
#mock .who b,#mock .who small{text-shadow:0 2px 0 #000c}
#mock .who{display:flex;flex-direction:column;line-height:1.1;min-width:0;flex:1}
#mock .who b,#mock .who small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mock .who b{font-size:14px}#mock .who small{font-size:11px;color:var(--gold);letter-spacing:.03em}
#mock .cur{display:flex;gap:10px;margin-right:auto;font-size:13px;font-weight:700;white-space:nowrap;padding:4px 8px;clip-path:var(--px);background:#0c0912b0;box-shadow:inset 0 0 0 2px #4b3a6b}
#mock .cur span{display:flex;align-items:center;gap:3px}#mock .cur img{width:18px;height:18px;image-rendering:pixelated}
#mock .ib{position:relative;width:34px;height:34px;display:grid;place-items:center;clip-path:var(--px);
  background:linear-gradient(#3a2f56,#251d38);box-shadow:inset 0 2px 0 #ffffff26,inset 0 -3px 0 #0c0912,inset 0 0 0 2px #4b3a6b}
#mock .ib img{width:22px;height:22px;image-rendering:pixelated}
#mock .dot{position:absolute;top:3px;right:3px;width:7px;height:7px;background:var(--red);box-shadow:0 0 0 2px #2a0a10}
#mock .mid{flex:1;display:flex;flex-direction:column;align-items:center;padding-top:0;min-height:0}
#mock .logo{font-size:54px}
#mock .parade2{display:flex;align-items:flex-end;gap:14px;margin-top:22px;padding:0 18px 4px;border-bottom:3px solid #0c091288;box-shadow:0 3px 0 #ffffff10}
#mock .parade2 img{height:26px;image-rendering:pixelated;filter:drop-shadow(0 2px 0 #0008);animation:bob 1s steps(2) infinite}
#mock .parade2 img:nth-child(3){margin-bottom:12px}
#mock .tag{margin:10px 0 0;font-size:14px;color:var(--muted);text-shadow:0 2px 0 #000a;text-align:center}
#mock .row{display:flex;align-items:flex-end;gap:14px;margin-top:2px}
#mock .slots{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
#mock .slt{width:44px;height:44px;display:grid;place-items:center;clip-path:var(--px);background:#0c0912c8;box-shadow:inset 0 0 0 2px var(--rc,#4b3a6b),inset 0 0 12px #0008}
#mock .slt img{width:30px;height:30px;image-rendering:pixelated}#mock .slt.empty img{opacity:.25;filter:grayscale(1)}
#mock .stage{position:relative;width:220px;height:190px;margin-top:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}
#mock .glow{position:absolute;left:50%;bottom:22px;width:220px;height:170px;transform:translateX(-50%);background:radial-gradient(closest-side,#f6c74455,#c869e022 55%,transparent)}
#mock .hero{position:relative;height:118px;image-rendering:pixelated;filter:drop-shadow(0 4px 0 #0008);margin-bottom:-14px}
#mock .ped{position:relative;width:132px;height:30px;clip-path:var(--px);background:linear-gradient(#7a6e94,#4e4466 55%,#352c4a);
  box-shadow:inset 0 3px 0 #b4a8cc,inset 0 -5px 0 #1e1730,inset 0 0 0 2px #120c1a}
#mock .ped::before{content:'';position:absolute;left:14px;right:14px;top:9px;height:3px;background:repeating-linear-gradient(90deg,#f6c744 0 4px,transparent 4px 10px);opacity:.75}
#mock .plate{display:flex;align-items:center;gap:10px;margin-top:10px}
#mock .plate .nm{padding:4px 14px;clip-path:var(--px);background:#0c0912cc;box-shadow:inset 0 0 0 2px #4b3a6b;font-weight:700;font-size:15px}
#mock .plate .nm small{color:var(--gold);font-weight:700;margin-left:6px}
#mock .arr{width:30px;height:30px;display:grid;place-items:center;font:700 18px var(--font-px);color:var(--gold);clip-path:var(--px);background:#0c0912aa;box-shadow:inset 0 0 0 2px #4b3a6b}
#mock .play{display:flex;gap:10px;width:100%;padding:0 16px;margin-bottom:14px}
#mock .maps{display:flex;gap:8px;margin-top:16px}
#mock .mp{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.04em}
#mock .mp .pc{position:relative;width:98px;height:62px;clip-path:var(--px);background-size:cover;background-position:center;image-rendering:pixelated;box-shadow:inset 0 0 0 3px #4b3a6b}
#mock .mp.on{color:var(--gold)}#mock .mp.on .pc{box-shadow:inset 0 0 0 3px var(--gold),inset 0 0 0 5px #0c0912}
#mock .mp .bd{position:absolute;right:5px;top:5px;padding:1px 5px;font-size:10px;background:var(--gold);color:var(--ink);clip-path:var(--px)}
#mock .mp .ok{position:absolute;left:5px;bottom:4px;width:14px;height:14px;image-rendering:pixelated}
#mock .mp.lk .pc{filter:grayscale(.8) brightness(.45)}#mock .mp .lock{position:absolute;inset:0;display:grid;place-items:center;font:700 22px var(--font-px);color:#ffffffaa}
#mock .diff{display:flex;align-items:center;gap:5px;margin-top:12px;font-size:12px;font-weight:700}
#mock .diff span{color:var(--muted);margin-right:4px;letter-spacing:.06em;text-transform:uppercase;font-size:11px}
#mock .diff b{min-width:30px;padding:5px 7px;text-align:center;clip-path:var(--px);background:#0c0912c8;box-shadow:inset 0 0 0 2px #4b3a6b;color:var(--fg)}
#mock .diff b.on{background:linear-gradient(#ff8a5a,#c8402a);box-shadow:inset 0 2px 0 #ffc0a0,inset 0 -3px 0 #6a1a10;color:#fff}#mock .diff b.lk{color:#ffffff40}
#mock .gap{flex:1;min-height:8px}
#mock .daily{margin-bottom:12px;display:flex;align-items:center;gap:8px;padding:7px 12px;clip-path:var(--px);background:#0c0912c8;box-shadow:inset 0 0 0 2px #a97a14;font-size:14px}
#mock .daily img{width:20px;height:20px;image-rendering:pixelated}#mock .daily b{color:var(--gold)}#mock .daily em{font-style:normal;font-weight:700;color:var(--gold);margin-left:6px}
#mock .sw{filter:drop-shadow(0 6px 0 #0c0912) drop-shadow(0 0 14px #f6c74433)}
#mock .gold{position:relative;flex:1;height:72px;display:flex;align-items:center;justify-content:center;gap:12px;clip-path:var(--px);overflow:hidden;
  background:linear-gradient(180deg,#ffe896 0,#f6c744 42%,#e0a628 70%,#c4861a 100%);
  box-shadow:inset 0 4px 0 #fff6c8,inset 0 -7px 0 #8a5a0a,inset 4px 0 0 #ffe27a,inset -4px 0 0 #b8801a;
  font:700 34px var(--font-px);letter-spacing:.08em;color:#2a1430;text-shadow:0 2px 0 #fff2b0}
#mock .gold::after{content:'';position:absolute;top:-20px;bottom:-20px;left:62%;width:26px;background:#fffbe0;opacity:.45;transform:skewX(-22deg)}
#mock .gold i{width:10px;height:10px;background:#8a5a0a;transform:rotate(45deg);box-shadow:inset 2px 2px 0 #c4861a}
#mock .gold img{width:30px;height:30px;image-rendering:pixelated}
#mock .stone{width:76px;height:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;clip-path:var(--px);
  background:linear-gradient(#433660,#2b2240);box-shadow:inset 0 3px 0 #ffffff2a,inset 0 -6px 0 #0c0912,inset 0 0 0 3px #5a4880;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
#mock .stone .two{display:flex}#mock .stone img{width:24px;height:24px;image-rendering:pixelated;margin:0 -3px}
#mock .stw{filter:drop-shadow(0 6px 0 #0c0912)}
#mock .dock{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:10px 8px max(12px,calc(var(--sab,0px) - 4px));background:linear-gradient(#211a30f2,#130f1cf8);
  box-shadow:0 -3px 0 #0c0912,0 -6px 0 #a97a1466;position:relative}
#mock .dk{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}
#mock .sock{position:relative;width:52px;height:46px;display:grid;place-items:center;clip-path:var(--px);background:linear-gradient(#2d2342,#1a1426);
  box-shadow:inset 0 -3px 0 #ffffff14,inset 0 3px 0 #0c0912,inset 0 0 0 2px #4b3a6b}
#mock .sock img{width:32px;height:32px;image-rendering:pixelated;filter:drop-shadow(0 2px 0 #0008)}
#mock .dk.hot{color:var(--gold)}#mock .dk.hot .sock{box-shadow:inset 0 -3px 0 #ffffff14,inset 0 3px 0 #0c0912,inset 0 0 0 2px var(--gold)}
#mock .sheetbg{position:absolute;inset:0;background:#0c0912b0;display:flex;align-items:flex-end}
#mock .sheet{width:100%;padding:16px 16px calc(20px + var(--sab,0px));background:var(--panel) var(--tex);background-size:32px 32px;clip-path:polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% 100%,0 100%);
  box-shadow:inset 0 3px 0 var(--gold-dk),inset 0 6px 0 #0c0912;display:flex;flex-direction:column;gap:8px}
#mock .sheet h3{margin:4px 0 4px;font:700 26px var(--font-px);color:var(--gold);display:flex;align-items:center;gap:10px}
#mock .sheet h3 img{width:28px;height:28px;image-rendering:pixelated}
#mock .sr{display:flex;align-items:center;gap:10px;padding:10px 12px;clip-path:var(--px);background:#0c0912a0;box-shadow:inset 0 0 0 2px #4b3a6b;font-weight:700}
#mock .sr img{width:22px;height:22px;image-rendering:pixelated}#mock .sr .v{margin-left:auto;color:var(--muted);font-size:14px}
#mock .tg{margin-left:auto;width:52px;height:26px;clip-path:var(--px);background:#0c0912;box-shadow:inset 0 0 0 2px #4b3a6b;position:relative}
#mock .tg i{position:absolute;top:4px;left:4px;width:18px;height:18px;background:#6a5a8a}
#mock .tg.on{background:#2f5a2a;box-shadow:inset 0 0 0 2px var(--green)}#mock .tg.on i{left:30px;background:var(--gold)}
#mock .seg{margin-left:auto;display:flex;gap:4px}#mock .seg b{padding:4px 10px;font-size:13px;clip-path:var(--px);background:#2d2342;color:var(--muted)}#mock .seg b.on{background:var(--gold);color:var(--ink)}
`;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:IP?{width:393,height:852}:{width:390,height:800},deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/_mock.html');await p.waitForTimeout(500);
 for(const sheet of [0,1]){
 await p.evaluate(([CSS,sheet,IP])=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.newsSeen='2099';K.openMenu();
  const S=K.SPR,D=K.dataUrl,bs=K.buildSprite;
  const gear=bs(['.s.ss.s.','.ssssss.','ssSSSSss','.sS..Ss.','.sS..Ss.','ssSSSSss','.ssssss.','.s.ss.s.'],{mirror:false,pal:{s:'#c8c4d8',S:'#7a7690'},shade:false});
  const bell=bs(['...yy...','..yyyy..','.yywyyy.','.ywyyyy.','.yyyyyy.','yyyyyyyy','oooooooo','...oo...'],{mirror:false,pal:{y:'#f6c744',w:'#fff6c8',o:'#a97a14'},shade:false});
  let st=document.getElementById('mockcss');if(!st){st=document.createElement('style');st.id='mockcss';document.head.appendChild(st);}st.textContent=CSS;
  document.querySelector('#scr-menu .wrap').style.visibility='hidden';
  let m=document.getElementById('mock');if(m)m.remove();m=document.createElement('div');m.id='mock';
  const I=k=>D(S.icon[k]);for(const id of ['hrbitov','poust','doly'])if(!K.mapsBuilt[id])K.buildMap(id);const TH={};for(const id of ['hrbitov','poust','doly'])TH[id]=K.mapThumb(id).toDataURL();
  m.innerHTML=`<div class="top">
   <div class="cur"><span><img src="${I('coin')}">1240</span><span><img src="${I('bone')}">36</span><span><img src="${I('amber')}">12</span><span><img src="${I('magma')}">4</span></div>
   <div class="ib"><img src="${D(bell)}"><i class="dot"></i></div><div class="ib"><img src="${I('book')}"></div><div class="ib"><img src="${D(gear)}"></div></div>
  <div class="mid"><div class="gap" style="flex:.55"></div><h1 class="logo">PIXEL<br>KRYPTA</h1><div class="gap" style="flex:.45"></div>
   <div class="stage"><div class="glow"></div><img class="hero" src="${D(S.hero.knight)}"><div class="ped"></div></div>
   <div class="plate"><span class="arr">‹</span><span class="nm">Rytíř<small>úr. 7</small></span><span class="arr">›</span></div>
   <div class="parade2">${["slime","skeleton","bat","zombie","ghost"].map((e,k)=>`<img style="animation-delay:-${k*.3}s" src="${D(S.enemy[e])}">`).join("")}</div>
   <p class="tag">Přežij vlny nepřátel, posiluj se a poraz bosse.</p><div class="gap" style="flex:.55"></div>
   <div class="daily"><img src="${I('candle')}"><span><b>Denní výzva</b> · Prašná poušť</span><em>Hrát ›</em></div><div class="play"><div class="sw" style="flex:1;display:flex"><div class="gold"><i></i><img src="${I('blade')}">HRÁT<i></i></div></div>
    <div class="stw"><div class="stone"><span class="two"><img src="${D(S.hero.knight)}"><img src="${D(S.hero.mage)}"></span>Ve dvou</div></div></div></div>
  <div class="dock"><div class="dk"><span class="sock"><img src="${D(S.hero.knight)}"></span>Hrdina</div><div class="dk"><span class="sock"><img src="${I('chest_gold')}"></span>Obchod</div>
   <div class="dk"><span class="sock"><img src="${I('scroll')}"><i class="dot"></i></span>Nástěnka</div><div class="dk"><span class="sock"><img src="${I('trophy')}"></span>Síň slávy</div></div>`
  +(sheet?`<div class="sheetbg"><div class="sheet"><h3><img src="${D(gear)}">Nastavení</h3>
   <div class="sr"><img src="${D(S.hero.knight)}">FastFapper<small style="color:var(--gold);font-size:12px;margin-left:2px">Dobyvatel krypty</small><span class="v">Změnit ›</span></div>
   <div class="sr"><img src="${I('sound')}">Zvuk<span class="tg on"><i></i></span></div>
   <div class="sr"><img src="${I('music')}">Hudba<span class="tg on"><i></i></span></div>
   <div class="sr"><img src="${I('stick')}">Ovládání<span class="v">V místě dotyku ›</span></div>
   <div class="sr"><img src="${I('news')}">Jazyk<span class="seg"><b class="on">Čeština</b><b>English</b></span></div>
   <div class="sr"><img src="${I('phone')}">Přidat hru na plochu<span class="v">›</span></div>
   <div class="sr" style="background:transparent;box-shadow:none;justify-content:center;color:var(--muted);font-size:12px;font-weight:500">verze 2026-11-07f</div></div></div>`:'');
  document.getElementById('scr-menu').appendChild(m);
  if(IP){const R=document.documentElement.style;R.setProperty('--sat','59px');R.setProperty('--sab','34px');
   if(!document.getElementById('isl')){const d=document.createElement('div');d.id='isl';d.style.cssText='position:fixed;z-index:99;left:50%;top:11px;width:126px;height:37px;margin-left:-63px;border-radius:20px;background:#000';document.body.appendChild(d);
   const sb=document.createElement('div');sb.style.cssText='position:fixed;z-index:99;left:0;right:0;top:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:4px 34px 0 52px;font:600 17px -apple-system,system-ui,sans-serif;color:#fff';
   sb.innerHTML='<span>9:41</span><span style="display:flex;gap:6px;align-items:center"><i style="display:inline-block;width:18px;height:11px;background:linear-gradient(90deg,#fff 0 3px,transparent 3px 5px,#fff 5px 8px,transparent 8px 10px,#fff 10px 13px,transparent 13px 15px,#fff 15px)"></i><i style="display:inline-block;width:16px;height:11px;border-radius:8px 8px 2px 2px;background:#fff"></i><i style="display:inline-block;width:25px;height:12px;border:2px solid #ffffffaa;border-radius:4px;box-shadow:inset 0 0 0 1px #000,inset 17px 0 0 #fff"></i></span>';document.body.appendChild(sb);
   const h=document.createElement('div');h.style.cssText='position:fixed;z-index:99;left:50%;bottom:8px;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#fff';document.body.appendChild(h);}}},[CSS,sheet,IP]);
 await p.waitForTimeout(400);await p.screenshot({path:pre+'_'+sheet+'.png'});}
 console.log(errs);await b.close();fs.unlinkSync(__dirname+'/_mock.html');})();
