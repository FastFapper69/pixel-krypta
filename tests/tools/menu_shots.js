// New main menu: screenshots of the menu, Settings, Shop and Hall of Fame tabs. node menu_shots.js <prefix> [cs|en] [iphone]
// iphone = 393x852 with simulated safe areas (59/34 px), Dynamic Island and status bar drawn on top.
const {chromium}=require('playwright');const pre=process.argv[2]||'mn',lang=process.argv[3]||'cs',IP=process.argv[4]==='iphone';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:IP?{width:393,height:852}:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 await p.evaluate(IP=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.newsSeen='2000';K.save.coins=1240;K.econInit();K.save.mats={bone:36,amber:12,magma:4};
  if(IP){const R=document.documentElement.style;R.setProperty('--sat','59px');R.setProperty('--sab','34px');
   const sb=document.createElement('div');sb.style.cssText='position:fixed;z-index:99;left:0;right:0;top:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:4px 34px 0 52px;font:600 17px -apple-system,system-ui,sans-serif;color:#fff;pointer-events:none';
   sb.innerHTML='<span>9:41</span><span>▮▮▮ ◗ ▭</span>';document.body.appendChild(sb);
   const isl=document.createElement('div');isl.style.cssText='position:fixed;z-index:99;left:50%;top:11px;width:126px;height:37px;margin-left:-63px;border-radius:20px;background:#000;pointer-events:none';document.body.appendChild(isl);
   const h=document.createElement('div');h.style.cssText='position:fixed;z-index:99;left:50%;bottom:8px;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#fff;pointer-events:none';document.body.appendChild(h);}
  K.openMenu();},IP);
 await p.waitForTimeout(300);await p.screenshot({path:pre+'_menu.png'});
 await p.click('#mSet');await p.waitForTimeout(300);await p.screenshot({path:pre+'_set.png'});
 await p.click('#setClose');await p.click('#mChest');await p.waitForTimeout(200);await p.screenshot({path:pre+'_chests.png'});
 await p.click('#scr-chests .sectabs [data-to=shop]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_shop.png'});
 await p.click('#scr-shop [data-back]');await p.click('#mBoard');await p.waitForTimeout(400);await p.screenshot({path:pre+'_board.png'});
 await p.click('#scr-board .sectabs [data-to=master]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_master.png'});
 await p.click('#scr-master .sectabs [data-to=codex]');await p.waitForTimeout(200);await p.screenshot({path:pre+'_codex.png'});
 await p.click('#scr-codex [data-back]');await p.waitForTimeout(100);
 const w=await p.evaluate(()=>[document.documentElement.scrollWidth,window.__krypta.state,document.querySelector('#scr-menu').scrollHeight,document.querySelector('#scr-menu').clientHeight]);
 console.log(lang,IP?'iphone':'android','width/state/scroll',w,errs);await b.close();})();
