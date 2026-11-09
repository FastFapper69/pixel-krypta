// Povinná kontrola hlavního menu před nasazením (poučení z 09z): node menucheck.js
// Hlídá: materiály v liště, každý popisek tlačítka je vidět (nic ho nepřekrývá), nic nepřetéká víc než dřív,
// lišta je pod rozmazáním iOS u horního okraje, plátna rámů jsou v pixelech displeje.
const {chromium}=require('playwright');
const SIZES=[[360,640,20,0,'cs'],[375,667,20,0,'en'],[393,852,59,34,'cs'],[402,874,62,34,'en'],[430,932,59,34,'cs']];
const MAXOVF={640:20,667:0};
(async()=>{const b=await chromium.launch();let bad=[];
for(const fresh of [0,1])for(const [W,H,t,bt,lang] of SIZES){const c=await b.newContext({viewport:{width:W,height:H},isMobile:true,hasTouch:true,deviceScaleFactor:3});const p=await c.newPage();
 await c.addInitScript(([t,bt,l])=>{localStorage.setItem('pixel-krypta-lang',l);document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=':root{--sat:'+t+'px!important;--sab:'+bt+'px!important}';document.head.appendChild(s);});},[t,bt,lang]);
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 await p.evaluate(f=>window.__krypta._ev("save.tut=1;save.newsSeen=GAME_VER;save.sound=false;save.music=false;"+(f?"":"save.mats.shard=698;save.mats.ess=27;for(const C of CHAPTERS.slice(0,4))for(const m of C.maps)save.cleared[m]=true;featCheck();featInit();save.feat.sky=1;")+"save.featNew=[];save.featSum=0;openMenu()"),fresh);
 await p.waitForTimeout(900);
 const r=await p.evaluate(([t,f])=>{const out=[];const s=document.getElementById('scr-menu');
  const ovf=s.scrollHeight-s.clientHeight;
  const mats=document.querySelectorAll('#mCur .mt').length,want=f?1:3;if(mats<want)out.push('materiály v liště: '+mats+' z '+want);
  for(const btn of document.querySelectorAll('#mStack .btn,#mTop .btn')){if(btn.hidden||!btn.offsetWidth)continue;
   for(const n of btn.childNodes)if(n.nodeType===3&&n.textContent.trim())out.push(btn.id+': holý text "'+n.textContent.trim()+'" (překryje ho rám)');
   const l=btn.querySelector('.lbl,img');if(!l)continue;const q=l.getBoundingClientRect();const x=q.left+q.width/2,y=q.top+q.height/2;
   if(y<0||y>innerHeight)continue;const hit=document.elementFromPoint(x,y);if(!hit||!(hit===l||l.contains(hit)||hit===btn))out.push(btn.id+': popisek překrytý ('+(hit&&(hit.className||hit.tagName))+')');
   if(btn.querySelector('.lbl')&&btn.querySelector('.lbl').scrollWidth>btn.clientWidth-12)out.push(btn.id+': popisek se nevejde');}
  const top=document.querySelector('#mTop .btn').getBoundingClientRect().top;if(top<t+26)out.push('lišta moc u horního okraje (iOS rozmazání): '+top+' < '+(t+26));
  for(const cv of document.querySelectorAll('canvas.bart')){const q=cv.getBoundingClientRect(),d=devicePixelRatio;{const ex=Math.max(Math.abs(q.left*d-Math.round(q.left*d)),Math.abs(q.top*d-Math.round(q.top*d)));if(ex>.06||cv.width!==Math.round(q.width*d))out.push('rám '+cv.parentElement.id+' není na celém pixelu (odchylka '+ex.toFixed(3)+' px displeje)');}}
  return {ovf,out};},[t,fresh]);
 const lim=MAXOVF[H]??0;if(r.ovf>lim)r.out.push('menu přetéká o '+r.ovf+' px (limit '+lim+')');
 if(errs.length)r.out.push('chyby JS: '+errs.join('; ').slice(0,200));
 const tag=W+'×'+H+' '+lang+(fresh?' nový účet':'');console.log((r.out.length?'✗ ':'✓ ')+tag+(r.out.length?'\n   '+r.out.join('\n   '):''));bad=bad.concat(r.out);await c.close();}
await b.close();if(bad.length){console.log('NEPROŠLO – nenasazovat');process.exit(1);}else console.log('vše v pořádku');})();
