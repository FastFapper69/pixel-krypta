// Proklikávač (audit 13. 11. 2026): na každé obrazovce najde všechno klikatelné a každé tlačítko zmáčkne na čerstvě načtené hře.
// Hlásí chyby JS, zakrytá tlačítka (prst by trefil něco jiného) a tlačítka bez viditelné reakce. Hloubka 2 = tlačítka v oknech, která se po kliku otevřela.
// Použití: node proklik.js [hloubka=2] [jazyk=cs] [souběh=2] [filtr scénářů regex]
// Výsledek: /tmp/proklik/vysledek.json + souhrn na výstup.
const L=require('./lib'),fs=require('fs'),{chromium}=require('playwright');
const DEPTH=+(process.argv[2]||2),LANG=process.argv[3]||'cs',PAR=+(process.argv[4]||2),FILT=process.argv[5]?new RegExp(process.argv[5]):null;
const OUT='/tmp/proklik';fs.mkdirSync(OUT,{recursive:true});
const RUN="openMenu();startRun('knight','hrbitov',{});for(let i=0;i<150;i++)step(1/30);$('#toast').style.display='none';";
const SC=[];
for(const sv of ['fresh','late'])for(const [k,v] of Object.entries(L.SCREENS))SC.push({n:sv+':'+k,save:sv,code:v});
for(const sv of ['fresh','late']){
 SC.push({n:sv+':beh',save:sv,code:RUN});
 SC.push({n:sv+':pauza',save:sv,code:RUN+"togglePause(true);"});
 SC.push({n:sv+':uroven',save:sv,code:RUN+"openLevelUp();"});
 SC.push({n:sv+':vyhra',save:sv,code:RUN+"finish(true);"});
 SC.push({n:sv+':prohra',save:sv,code:RUN+"finish(false);"});
}
const scen=FILT?SC.filter(s=>FILT.test(s.n)):SC;
// v prohlížeči: označí prvky s posluchači kliku (addEventListener), ať je najdeme
const MARK=()=>{const a=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(t,f,o){if(/^(click|pointerdown|pointerup|touchstart|touchend)$/.test(t)&&this instanceof Element)this.__clk=1;return a.call(this,t,f,o);};};
const LIST=()=>{const path=e=>{if(e.id)return '#'+e.id;const p=e.parentElement;if(!p)return e.tagName.toLowerCase();return path(p)+'>'+e.tagName.toLowerCase()+':nth-child('+([...p.children].indexOf(e)+1)+')';};
 const vis=e=>{if(!e.getClientRects().length)return false;const r=e.getBoundingClientRect();if(r.width<4||r.height<4)return false;for(let x=e;x;x=x.parentElement){const c=getComputedStyle(x);if(c.display==='none'||c.visibility==='hidden'||+c.opacity<0.05)return false;}return true;};
 const clk=e=>e.onclick||e.onpointerdown||e.__clk||e.hasAttribute('onclick')||/^(BUTTON|SUMMARY|SELECT|A)$/.test(e.tagName)||(e.tagName==='INPUT'&&e.type!=='hidden');
 const out=[];for(const e of document.querySelectorAll('body *')){if(e.tagName==='CANVAS'||e.id==='stage')continue;if(!clk(e))continue;if(e.closest('button')&&e.closest('button')!==e)continue;if(!vis(e)||e.disabled||e.closest('[inert]'))continue;{const r=e.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;if(cx>=0&&cy>=0&&cx<innerWidth&&cy<innerHeight){const t=document.elementFromPoint(cx,cy);if(t&&t!==e&&!e.contains(t))continue;}} // za oknem = nejde zmáčknout, nehlásit
  out.push({s:path(e),t:(e.innerText||e.getAttribute('aria-label')||e.title||e.value||e.className||'').replace(/\s+/g,' ').trim().slice(0,40)});}
 return out;};
const SIG=()=>{const v=[...document.querySelectorAll('[id]')].filter(e=>{if(!e.getClientRects().length)return false;const c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden';}).map(e=>e.id+'.'+e.className+(e.hidden?'h':'')+(e.inert?'i':'')).join(',');
 let h=0;const t=(document.body.innerText||'')+'|'+localStorage.length+'|'+Object.values(localStorage).join('').length;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;
 const K=window.__krypta;let st='';try{st=K._ev('state');}catch(_){}return st+'#'+v.length+'#'+h+'#'+location.href+'#'+document.querySelectorAll('*').length;};
async function tapOn(p,sel){
 const r=await p.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return {miss:1};e.scrollIntoView({block:'center',inline:'center'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;
  const t=document.elementFromPoint(x,y);const ok=t&&(t===e||e.contains(t)||t.contains(e)&&false);const d=t?(t.id?'#'+t.id:t.tagName.toLowerCase()+'.'+[...t.classList].join('.')):'nic';let modal=false;for(let x=t;x&&x!==document.body;x=x.parentElement){const c=getComputedStyle(x),q=x.getBoundingClientRect();if((c.position==='fixed'||c.position==='absolute')&&q.width>innerWidth*.8&&q.height>innerHeight*.6&&!x.contains(e)){modal=true;break;}}
  return {x,y,ok:ok||modal,cov:ok||modal?'':d,out:x<0||y<0||x>innerWidth||y>innerHeight};},sel);
 if(r.miss)return r;await p.mouse.click(r.x,r.y);return r;}
// Jeden scénář = jedna stránka. Mezi kliky se hra vrátí do výchozího stavu bez načítání (uložení, okna, obrazovka);
// když se podpis stránky neshoduje s čerstvým, načte se znovu. Každá chyba JS se ověří na čistě načtené hře.
let window0=[];const RESET="save=JSON.parse(window.__pkBase);persist();for(const [e,h,i,c,st] of window.__pkPops){e.hidden=h;e.inert=i;e.className=c;e.style.cssText=st;}for(const e of [...document.body.children])if(!window.__pkKids.includes(e))e.remove();";
async function scenario(b,sc,log){
 const o=await L.open({browser:b,save:sc.save,lang:LANG,init:MARK});const {p,E,errs}=o;const R=[];let base='',hard=0;
 async function fresh(){await p.goto(p.url());await p.waitForTimeout(500);await E("save.sound=false;save.music=false;save.tut=1;save.newsSeen=GAME_VER;"+(L.SAVES[sc.save]||'')+"save.featNew=[];save.featSum=0;save.storyNew=null;persist();window.__pkBase=JSON.stringify(save);");
  await E(sc.code);await p.waitForTimeout(600);await E("window.__pkKids=[...document.body.children];window.__pkPops=[...document.querySelectorAll('[id],.popwrap,.sheetwrap')].map(e=>[e,e.hidden,e.inert,e.className,e.style.cssText]);");base=await p.evaluate(SIG);hard++;if(process.env.PKDBG)window0=await p.evaluate(()=>[...document.querySelectorAll('[id]')].filter(e=>{if(!e.getClientRects().length)return false;const c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden';}).map(e=>e.id));}
 async function reset(){try{await E(RESET+sc.code);await p.waitForTimeout(350);const s2=await p.evaluate(SIG);const cut=x=>x.split('#').filter((_,i)=>i!==2&&i!==4).join('#');if(cut(s2)===cut(base))return;if(process.env.PKDBG)console.error('RESET≠',await p.evaluate(()=>[...document.querySelectorAll('[id]')].filter(e=>{if(!e.getClientRects().length)return false;const c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden';}).map(e=>e.id).join(',')).then(v=>v.split(',').filter(x=>!window0.includes(x)).join(' ')));}catch(_){}await fresh();}
 async function run(path,verify){if(verify)await fresh();else await reset();errs.length=0;const res={sc:sc.n,path:path.map(x=>x.t),errs:[]};
  try{for(let i=0;i<path.length-1;i++){const r=await tapOn(p,path[i].s);if(r.miss){res.miss=1;res.errs=[...new Set(errs)];return res;}await p.waitForTimeout(450);}
   const before=await p.evaluate(LIST),last=path[path.length-1],s0=await p.evaluate(SIG);
   const r=await tapOn(p,last.s);if(r.miss){res.miss=1;res.errs=[...new Set(errs)];return res;}if(!r.ok)res.cov=r.cov;if(r.out)res.out=1;
   await p.waitForTimeout(500);const s1=await p.evaluate(SIG).catch(()=>'nav');res.same=s0===s1;res.nav=/nav|#.*#.*#[^#]*(?!off\.html)/.test(s1)&&!s1.includes('off.html');
   if(DEPTH>path.length&&!res.nav){const after=await p.evaluate(LIST).catch(()=>[]);const bs=new Set(before.map(x=>x.s));res.nw=after.filter(x=>!bs.has(x.s)).slice(0,30);}
  }catch(e){res.crash=String(e.message).split('\n')[0].slice(0,160);}
  res.errs=[...new Set(errs)];if(res.nav)await fresh();return res;}
 try{await fresh();const top=await p.evaluate(LIST);R.push({sc:sc.n,path:[],n:top.length,errs:[...new Set(errs)]});
  const Q=top.map(x=>[x]);while(Q.length){const path=Q.shift();let r=await run(path);
   if(r.errs.length||r.crash){const v=await run(path,true);r.verified=!!(v.errs.length||v.crash);if(r.verified){r.errs=v.errs;r.crash=v.crash;}}
   R.push(r);log();if(r.nw)for(const it of r.nw)Q.push([...path,it]);}
 }catch(e){R.push({sc:sc.n,path:['(scénář)'],crash:String(e.message).split('\n')[0],errs:[]});}
 R.hard=hard;await o.close().catch(()=>{});return R;}
(async()=>{L.prep();const t0=Date.now();const bs=[];for(let i=0;i<PAR;i++)bs.push(await chromium.launch());
 const Q=scen.slice(),R=[];let done=0,hard=0;const log=()=>{done++;if(done%100===0)console.error(done+' kliků, '+Math.round((Date.now()-t0)/1000)+' s');};
 async function worker(b){while(Q.length){const sc=Q.shift();const r=await scenario(b,sc,log);hard+=r.hard||0;R.push(...r);}}
 await Promise.all(bs.map(worker));for(const b of bs)await b.close();
 fs.writeFileSync(OUT+'/vysledek-'+LANG+'.json',JSON.stringify(R,null,1));
 const clicks=R.filter(r=>r.path.length&&r.path[0]!=='(scénář)'),bad=R.filter(r=>(r.errs&&r.errs.length||r.crash)&&r.verified!==false),flaky=R.filter(r=>r.verified===false),cov=clicks.filter(r=>r.cov),same=clicks.filter(r=>r.same&&!r.cov&&!r.miss);
 console.log('Scénářů '+scen.length+', kliků '+clicks.length+', načtení hry '+hard+' ('+Math.round((Date.now()-t0)/1000)+' s)');
 const fmt=r=>r.sc+' › '+r.path.join(' › ');
 console.log('\nCHYBY JS / PÁD (ověřené na čisté hře) ('+bad.length+'):');for(const r of bad)console.log(' ✗ '+fmt(r)+'\n    '+[...(r.errs||[]),r.crash||''].filter(Boolean).join('\n    '));
 console.log('\nJEN PŘI OPAKOVÁNÍ BEZ NAČTENÍ (neověřené) ('+flaky.length+'):');for(const r of flaky)console.log(' ? '+fmt(r));
 console.log('\nZAKRYTÉ ('+cov.length+'):');for(const r of cov)console.log(' ▢ '+fmt(r)+' → prst trefí '+r.cov);
 console.log('\nBEZ REAKCE ('+same.length+'):');for(const r of same)console.log(' · '+fmt(r));
})();
