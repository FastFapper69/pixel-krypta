// 11t: hlídá krátké Novinky (přání uživatele 11. 11.: moc textu, hlavní body nebyly to hlavní).
// Od verze 2026-11-11k: nejvýš 3 hlavní body, nadpis bodu ≤ 28 znaků, popis bodu jedna krátká věta ≤ 50 znaků, drobnost ≤ 70 znaků (CZ i EN).
// node novinky.js
const L=require('./lib');L.prep();
(async()=>{const o=await L.open({save:'late'});
 const r=await o.p.evaluate(()=>{const K=window.__krypta,N=K.NEWS,plain=t=>String(t).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' '),EN=window.KRYPTA_EN||{},bad=[];
  for(const n of N){if(n.v<'2026-11-11k')break;const hl=n.hl||[];if(hl.length>3)bad.push(n.v+': '+hl.length+' hlavních bodů (max 3)');
   for(const h of hl){if(plain(h.t).length>28)bad.push(n.v+' nadpis: '+plain(h.t));if(plain(h.d).length>50)bad.push(n.v+' popis ('+plain(h.d).length+'): '+plain(h.d));}
   for(const i of n.items||[])if(plain(i).length>70)bad.push(n.v+' drobnost ('+plain(i).length+'): '+plain(i));}
  return bad;});
 // anglické texty stejné meze
 const o2=await L.open({save:'late',lang:'en'});
 const r2=await o2.p.evaluate(()=>{const N=window.__krypta.NEWS,plain=t=>String(t).replace(/<[^>]+>/g,''),bad=[];
  for(const n of N){if(n.v<'2026-11-11k')break;for(const h of n.hl||[]){if(plain(h.t).length>32)bad.push('EN '+n.v+' nadpis: '+plain(h.t));if(plain(h.d).length>55)bad.push('EN '+n.v+' popis: '+plain(h.d));}
   for(const i of n.items||[])if(plain(i).length>80)bad.push('EN '+n.v+' drobnost: '+plain(i));}return bad;});
 const all=r.concat(r2);console.log(all.length?'✗ '+all.join('\n✗ '):'✓ Novinky krátké',o.errs.concat(o2.errs));await o.close();await o2.close();process.exit(all.length?1:0);})();
