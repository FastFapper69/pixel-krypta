// Ukládání (09r): každý klíč save.X, který hra používá, se načte i pošle do cloudu (kromě nastavení zařízení v LOCAL_KEYS),
// poškozený save se obnoví ze zálohy, save má verzi. node savekeys.js
const {chromium}=require('playwright'),fs=require('fs');
const src=fs.readFileSync(__dirname+'/../../index.html','utf8');
const used=[...new Set([...src.matchAll(/\bsave\.([a-zA-Z_]\w*)/g)].map(m=>m[1]))];
(async()=>{const b=await chromium.launch();const c=await b.newContext();const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+__dirname+'/off.html';await p.goto(url);await p.waitForTimeout(500);
 const r=await p.evaluate(used=>{const K=window.__krypta,E=x=>K._ev(x);const local=E('[...LOCAL_KEYS]');
   const fake={coins:7,heroes:{knight:true},cleared:{},best:{},meta:{}};for(const k of used)if(!local.includes(k)&&!(k in fake))fake[k]={probe:k};
   localStorage.setItem(E('SAVE_KEY'),JSON.stringify(fake));E('loadSave()');
   const notLoaded=used.filter(k=>!local.includes(k)&&!['coins','heroes','cleared','best','meta','version'].includes(k)&&!(E('save')[k]&&E('save')[k].probe===k));
   const sk=E('syncKeys()');const notSynced=used.filter(k=>!local.includes(k)&&!sk.includes(k));
   return {notLoaded,notSynced,ver:E('save.version'),local};},used);
 console.log('nenačítá se:',r.notLoaded,'\nnesynchronizuje se:',r.notSynced,'\nverze:',r.ver,'| jen v zařízení:',r.local.join(','));
 // corrupted main save → backup
 await p.evaluate(()=>{const E=x=>window.__krypta._ev(x);localStorage.setItem(E('SAVE_BAK'),JSON.stringify({coins:4242,heroes:{knight:true},version:1}));localStorage.setItem(E('SAVE_KEY'),'{"coins":1,"heroes":');});
 await p.reload();await p.waitForTimeout(500);const bak=await p.evaluate(()=>window.__krypta._ev('save.coins'));
 console.log('poškozený save → záloha, mince:',bak);
 const bad=r.notLoaded.length||r.notSynced.length||r.ver!==1||bak!==4242||errs.length;console.log('chyby',errs);await b.close();process.exit(bad?1:0);})();
