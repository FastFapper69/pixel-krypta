// Každý klíč save.X, který hra používá, se musí načíst (loadSave) a synchronizovat (SYNC_KEYS). node savekeys.js
const s=require('fs').readFileSync(__dirname+'/../../index.html','utf8');
const used=new Set([...s.matchAll(/\bsave\.([a-zA-Z_]\w*)/g)].map(m=>m[1]));
const lo=s.match(/for\(const k of \[([^\]]*)\]\)if\(s\[k\]/)[1],sy=s.match(/const SYNC_KEYS=\[([\s\S]*?)\];/)[1];
const q=t=>new Set([...t.matchAll(/'(\w+)'/g)].map(m=>m[1]));
const SPECIAL=['coins','heroes','cleared','best','meta','sound','music','tipTower','stick','cheat','pinSet','stats','nick','updated'];
const LOCAL_ONLY=['cheat','lastMap','music','nick','pinSet','sound','stick','tipTower','treeBack']; // nastavení zařízení a přechodné příznaky
const L=new Set([...q(lo),...SPECIAL]),Y=q(sy);
const nl=[...used].filter(k=>!L.has(k)&&k!=='treeBack'),ns=[...used].filter(k=>!Y.has(k)&&!LOCAL_ONLY.includes(k));
console.log('nenačítá se:',nl,'\nnesynchronizuje se:',ns);process.exit(nl.length||ns.length?1:0);
