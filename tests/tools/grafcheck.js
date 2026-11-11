// Grafická kontrola celé hry (11. 11. 2026): projde obrazovky, okna a stavy běhu a hledá chyby,
// které uživatel opakovaně hlásil: rozmazané písmo (jiná velikost/řez než tři povolené), tmavý text
// s tmavým stínem (zdvojené písmo), text přes okraj, překrývající se texty, nevykreslená kresba stavebnice,
// stránka širší než displej. Vše najednou: node grafcheck.js [složka se snímky] [cs|en] [telefon]
// Bez složky jen vypíše nálezy. Konec: řádek „NÁLEZŮ n“.
const L=require('./lib.js'),path=require('path'),fs=require('fs');
const out=process.argv[2]||'',lang=process.argv[3]||'cs',phone=process.argv[4]||'15';
const RUN="openMenu();startRun('knight','hrbitov',{});for(let i=0;i<400;i++)step(1/30);$('#toast').style.display='none';";
const ST=Object.assign({},L.SCREENS,{
 select_ch1:"openMenu();$('#mPlay').click();chSel=0;renderSelect();document.querySelector('.mnode').click()",
 hero_down:"openHero();document.querySelector('#scr-hero').scrollTop=600",
 forge_runes:"openForge();[...document.querySelectorAll('#scr-forge .sectabs button')][1].click()",
 forge_tree:"openForge();[...document.querySelectorAll('#scr-forge .sectabs button')].pop().click()",
 quests_week:"featInit();save.feat.quests=1;save.feat.contracts=1;save.feat.wanted=1;openQuests();document.querySelector('[data-qt=week]').click()",
 quests_wk:"openQuests();document.querySelector('[data-qt=wk]')&&document.querySelector('[data-qt=wk]').click()",
 quests_down:"openQuests();document.querySelector('[data-qt=day]')&&document.querySelector('[data-qt=day]').click();document.querySelector('#scr-quests').scrollTop=2000",
 master_ach:"openMaster();[...document.querySelectorAll('#scr-master .sectabs button')].pop().click()",
 help_chests:"openChestShop();document.querySelector('#scr-chests .k-helpb').click()",
 item:"openHero();document.querySelector('#scr-hero .itile').click()",
 chest_open:"openChestShop();openChest('wood',true)",
 nick:"openMenu();openNick('av')",
 feedback:"openMenu();openFeedback()",
 privacy:"openMenu();openPrivacy()",
 run_hud:RUN,
 run_levelup:RUN+"run.luT=0;openLevelUp()",
 run_pause:RUN+"togglePause(true)",
 run_pause_hero:RUN+"togglePause(true);document.querySelector('[data-pt=hero]').click()",
 run_over:RUN+"finish(true)",
 run_lost:RUN+"finish(false)",
});
// v každém stavu: nálezy na viditelných prvcích
function scan(){const R=[],vw=innerWidth,vh=innerHeight,OK={'18.6667':24,'27':31,'34':40};
 const lum=c=>{const m=c.match(/[\d.]+/g);if(!m)return 1;const [r,g,b]=m.map(Number);return (0.2126*r+0.7152*g+0.0722*b)/255;};
 const vis=e=>{if(e.closest('[hidden]'))return false;const s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0)return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw;};
 const top=e=>{const r=e.getBoundingClientRect();const x=Math.min(vw-1,Math.max(0,r.left+r.width/2)),y=Math.min(vh-1,Math.max(0,r.top+Math.min(r.height/2,10)));const h=document.elementFromPoint(x,y);return !!h&&(h===e||e.contains(h)||h.contains(e));};
 const name=e=>(e.id?'#'+e.id:e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):''))+' „'+(e.textContent||'').trim().slice(0,22)+'“';
 // listy s vlastním textem
 const texts=[...document.querySelectorAll('#app *,#newsPop *,#kHelp *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&vis(e)&&top(e));
 const seen=new Set();const add=(k,m)=>{if(!seen.has(k)){seen.add(k);R.push(m);}};
 for(const e of texts){const s=getComputedStyle(e),fam=s.fontFamily,sz=(+parseFloat(s.fontSize).toFixed(4)).toString(),lh=parseFloat(s.lineHeight);
  if(e.closest('canvas,.logo,#scr-privacy,.privacy'))continue;
  if(/Jersey/.test(fam)){if(!(sz in OK))add('fs'+sz+name(e),'ROZMAZANÉ PÍSMO '+s.fontSize+' '+fam.split(',')[0]+': '+name(e));
   else if(!isNaN(lh)&&Math.abs((OK[sz]-lh)%2)>.01&&e.getBoundingClientRect().height<lh*1.5)add('lh'+name(e),'VÝŠKA ŘÁDKU '+lh+' (má být '+OK[sz]+'): '+name(e));}
  else if(!/Chakra/.test(fam))add('ff'+name(e),'JINÉ PÍSMO '+fam.split(',')[0]+': '+name(e));
  if(s.fontWeight>=600)add('fw'+name(e),'TUČNÉ: '+name(e));
  const ts=s.textShadow;if(ts&&ts!=='none'){const cols=ts.match(/rgba?\([^)]*\)/g)||[];const dark=cols.filter(c=>lum(c)<.25&&!/,\s*0(\.\d+)?\)$/.test(c)).length;
   if(lum(s.color)<.35&&dark)add('sh'+name(e),'TMAVÝ TEXT S TMAVÝM STÍNEM: '+name(e));}
  const r=e.getBoundingClientRect();if((r.right>vw+1||r.left<-1)&&![...function*(){for(let a=e.parentElement;a;a=a.parentElement)yield a}()].some(a=>/auto|scroll/.test(getComputedStyle(a).overflowX)))add('vw'+name(e),'MIMO DISPLEJ: '+name(e));
  if(e.scrollWidth>e.clientWidth+2&&/hidden|clip/.test(s.overflowX)&&s.textOverflow!=='ellipsis')add('ow'+name(e),'USEKNUTÝ TEXT: '+name(e));
  const p=e.closest('button,.card,.kq,.kc,.k-card,.itile,.ttile,.tcard,.slot');if(p&&p!==e){const q=p.getBoundingClientRect();if(r.right>q.right+2||r.left<q.left-2)add('pp'+name(e),'TEXT PŘES OKRAJ RÁMU: '+name(e));}}
 // překrývající se texty (různé rodiče, ne vnořené)
 const boxes=texts.filter(e=>!e.closest('canvas,.qburst,.fc-rays,.stamp,.nwt,.badge,.newtag')).map(e=>{let rr=[...e.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom}));for(let a=e.parentElement;a;a=a.parentElement){const o=getComputedStyle(a);if(/auto|scroll|hidden|clip/.test(o.overflowY+o.overflowX)){const c=a.getBoundingClientRect();rr=rr.map(r=>({left:Math.max(r.left,c.left),right:Math.min(r.right,c.right),top:Math.max(r.top,c.top),bottom:Math.min(r.bottom,c.bottom)}));}}return {e,rr};});
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const A=boxes[i],B=boxes[j];if(A.e.contains(B.e)||B.e.contains(A.e))continue;
  for(const a of A.rr)for(const b of B.rr){const ox=Math.min(a.right,b.right)-Math.max(a.left,b.left),oy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
   if(ox>4&&oy>6){add('ov'+name(A.e)+name(B.e),'PŘEKRYV TEXTŮ: '+name(A.e)+' × '+name(B.e));}}}
 // kresba stavebnice
 for(const e of document.querySelectorAll('[data-k]'))if(vis(e)&&['btn','slab','card','socket','gauge','flag','seal','rod','sign','chain','crypt','astro','forge2','niche'].includes(e.dataset.k)&&!/url\(/.test(e.style.backgroundImage))add('kp'+name(e),'NEVYKRESLENÝ PRVEK ('+e.dataset.k+'): '+name(e));
 if(document.documentElement.scrollWidth>vw+1)add('doc','STRÁNKA ŠIRŠÍ NEŽ DISPLEJ');
 return R;}
(async()=>{L.prep();const o=await L.open({phone,lang,save:'late',dpr:out?2:1});let n=0;
 await o.E("featInit();for(const k in save.feat)save.feat[k]=1;persist();");
 for(const k of Object.keys(ST)){try{await o.E("(()=>{const p=document.getElementById('newsPop');if(p)p.hidden=true;const h=document.getElementById('kHelp');if(h)h.hidden=true;})()");await o.E(ST[k]);}catch(e){console.log(k,'NEJDE OTEVŘÍT',e.message.slice(0,90));continue;}
  await o.p.waitForTimeout(450);const R=await o.p.evaluate(scan);if(R.length){console.log('— '+k+' ('+lang+', '+phone+')');R.slice(0,12).forEach(x=>console.log('   '+x));if(R.length>12)console.log('   … a dalších '+(R.length-12));n+=R.length;}
  if(out)await o.p.screenshot({path:path.join(out,k+'_'+lang+'_'+phone+'.png')});}
 if(o.errs.length){console.log('CHYBY JS',o.errs.slice(0,5));n+=o.errs.length;}
 console.log('NÁLEZŮ',n);await o.close();})();
