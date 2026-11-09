// Návod „Přidat na plochu“ podle prohlížeče (09w): Safari, Chrome a Edge na iPhonu, Android bez instalačního okna;
// s instalačním oknem (Android Chrome) se zavolá skutečná instalace. node pwaguide.js prefix [cs|en]
const {chromium}=require('playwright');const pre=process.argv[2],lang=process.argv[3]||'cs';
const UA={safari:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
 chrome:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.41 Mobile/15E148 Safari/604.1',
 edge:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 EdgiOS/141.0 Mobile/15E148 Safari/605.1.15',
 android:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36'};
(async()=>{const b=await chromium.launch();let bad=0;const shots=[];
 for(const [k,ua] of Object.entries(UA)){const c=await b.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:ua});
  await c.addInitScript(l=>localStorage.setItem('pixel-krypta-lang',l),lang);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);
  await E("save.tut=1;save.newsSeen=GAME_VER;featInit();openMenu();setSheet(true)");
  const can=await E("location.protocol==='https:'||true?(!pwaStandalone()&&!inAppUA()&&(!!pwaEvt||isIOS()||isAndroid())):0");
  await E("pwaInstall()");await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{const np=document.getElementById('newsPop');return {open:!np.hidden,steps:[...np.querySelectorAll('.ig-steps li')].map(l=>l.textContent.trim()),arrow:(np.querySelector('.ig-arrow')||{}).className||''};});
  console.log(k,'| tlačítko:',can,'| okno:',r.open,'| šipka:',r.arrow,'\n   '+r.steps.join('\n   '));if(!can||!r.open||r.steps.length!==3)bad++;
  if(pre){await p.screenshot({path:pre+'_'+k+'.png'});shots.push(k);}
  // real install path when the browser offers it
  if(k==='android'){await E("pwaEvt={prompt(){window.__prompted=1},userChoice:Promise.resolve({outcome:'accepted'})};document.getElementById('newsPop').hidden=true;pwaInstall()");
    const pr=await p.evaluate(()=>!!window.__prompted);console.log('   s instalačním oknem prohlížeče: skutečná instalace',pr?'ANO':'NE');if(!pr)bad++;}
  if(errs.length){console.log('chyby',errs);bad++;}await c.close();}
 await b.close();process.exit(bad?1:0);})();
