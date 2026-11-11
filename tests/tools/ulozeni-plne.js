// Plné úložiště telefonu: persist() smaže pohlednice pk-th-*, zkusí znovu; když to nejde, jednou varuje (audit 11. 11.)
// node ulozeni-plne.js [cs|en]
const L=require('./lib');(async()=>{const {p,E,errs,close}=await L.open({lang:process.argv[2]||'cs',phone:'se',save:'mid'});
const r=await p.evaluate(()=>{const K=window.__krypta,o=Storage.prototype.setItem;let full=true;
  localStorage.setItem('pk-th-test-1','x'.repeat(100));
  Storage.prototype.setItem=function(k,v){if(full&&!k.startsWith('pk-th-')&&localStorage.getItem('pk-th-test-1')!==null)throw new Error('QuotaExceeded');return o.call(this,k,v);};
  K.save.coins=12345;K._ev('persist()');const a={thumbGone:localStorage.getItem('pk-th-test-1')===null,saved:JSON.parse(localStorage.getItem(K._ev('SAVE_KEY'))).coins===12345};
  // úplně plno: varování jen jednou
  Storage.prototype.setItem=function(){throw new Error('QuotaExceeded');};K._ev('persist()');const t1=(document.querySelector('#note')||{}).textContent||'';
  document.querySelector('#note')&&(document.querySelector('#note').textContent='');K._ev('persist()');const t2=(document.querySelector('#note')||{}).textContent||'';
  Storage.prototype.setItem=o;return {...a,warn:t1,warnTwice:!!t2};});
console.log(JSON.stringify(r),'chyby:',JSON.stringify(errs));
const ok=r.thumbGone&&r.saved&&r.warn.length>10&&!r.warnTwice&&!errs.length;console.log(ok?'OK':'CHYBA');await close();process.exit(ok?0:1);})();
