// English localization check.
// 1) static: every _t('…') key has a translation in lang-en.js, and no Czech string literal is left unwrapped
// 2) live (needs off.html + lang-en.js next to it): opens all screens in English and lists visible text with Czech letters
//    sed "s#url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'[^']*'#url:'',key:''#" ../../index.html > off.html; cp ../../lang-en.js .
//    node i18n.js            (static only: node i18n.js static)
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
global.window={};eval(fs.readFileSync(path.join(root,'lang-en.js'),'utf8'));const EN=window.KRYPTA_EN;
const CZ=/[ěščřžýáíéůúňťďĚŠČŘŽÝÁÍÉŮÚŇŤĎ]/;
let acorn,walk;for(const d of ['/opt/node-tools/node_modules/','/opt/npm-tools/node_modules/','']){try{acorn=require(d+'acorn');walk=require(d+'acorn-walk');break;}catch(e){}}
const s=html.indexOf('<script>\n(()=>{')+8,e=html.lastIndexOf('</script>');const ast=acorn.parse(html.slice(s,e),{ecmaVersion:2022,locations:true});
const missing=new Set(),bare=[];
walk.fullAncestor(ast,(n,anc)=>{if(n.type!=='Literal'||typeof n.value!=='string')return;const p=anc[anc.length-2];
  const wrapped=p&&p.type==='CallExpression'&&p.callee.name==='_t';
  if(wrapped&&EN[n.value]==null)missing.add(n.value);
  if(!wrapped&&CZ.test(n.value))bare.push(n.loc.start.line+html.slice(0,s).split('\n').length-1+': '+n.value.slice(0,70));});
console.log('static: missing translations',missing.size,[...missing].slice(0,30));
console.log('static: Czech literals not wrapped in _t()',bare.length,bare.slice(0,30));
if(process.argv[2]==='static')process.exit(0);
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});
 await c.addInitScript(()=>localStorage.setItem('pixel-krypta-lang','en'));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 const found=new Map();
 const grab=async(where)=>{const t=await p.evaluate(()=>{const o=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
   while((n=w.nextNode())){const el=n.parentElement;if(!el||el.closest('[hidden]')||el.closest('script,style'))continue;const v=n.nodeValue.trim();if(v)o.push(v);}return o;});
   for(const v of t)if(/[ěščřžýáíéůúňťďĚŠČŘŽÝÁÍÉŮÚŇŤĎ]/.test(v)&&!found.has(v))found.set(v,where);};
 const K='window.__krypta';
 const shots=[['menu','K.openMenu()'],['news','K.openNews(true)'],['hero','K.openHero()'],['chests','K.openChestShop()'],['codex','K.openCodex()'],['quests','K.openQuests()'],['master','K.openMaster()'],['board','K.openBoard()'],['coop','K.openCoop()']];
 await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.save.coins=99999;});
 for(const [n,f] of shots){try{await p.evaluate('(()=>{const K='+K+';'+f+'})()');await p.waitForTimeout(150);await grab(n);await p.evaluate(()=>{const n=document.getElementById('newsPop');if(n)n.hidden=true;});}catch(e){errs.push(n+': '+e.message)}}
 await p.evaluate(()=>{const K=window.__krypta;K.openMenu();document.getElementById('mPlay').click();});await p.waitForTimeout(150);await grab('select');
 await p.evaluate(()=>{const K=window.__krypta;K.god=true;K.startRun('builder','poust');for(let i=0;i<400;i++)K.step(1/60);});await grab('run');
 await p.evaluate(()=>{const K=window.__krypta;K.run.xp=1e6;for(let i=0;i<30;i++)K.step(1/60);});await grab('levelup');
 await p.evaluate(()=>{document.getElementById('btnPause')&&document.getElementById('btnPause').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));});await p.waitForTimeout(100);await grab('pause');
 await p.evaluate(()=>{const K=window.__krypta;K.finish(true);});await p.waitForTimeout(200);await grab('over');
 console.log('live: visible Czech texts',found.size);for(const [v,w] of found)console.log('  ['+w+'] '+v.slice(0,90));
 console.log('errors',errs);await b.close();})();
