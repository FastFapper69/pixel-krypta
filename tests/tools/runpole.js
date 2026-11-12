// 12l: kolize krátkých jmen na `run` (run.kg = mechanika růstu/propastí i počítadlo zabití v 12d, pak run.kn = lucerna
// Posledního světla i počítadlo v 12e–12k → lucerna se po prvním zabití změnila na řetězec a tma zabíjela za pár sekund).
// Statická kontrola: žádné pole na `run` nesmí být zároveň číselné počítadlo a objekt. node runpole.js
const L=require('./lib'),s=L.src();const num=new Set(),obj=new Set();
for(const m of s.matchAll(/run\.([A-Za-z_]\w*)=\(run\.\1\|\|0\)\s*[+-]/g))num.add(m[1]);
for(const m of s.matchAll(/run\.([A-Za-z_]\w*)\+\+/g))num.add(m[1]);
for(const m of s.matchAll(/run\.([A-Za-z_]\w*)=(?:run\.\1\|\|)?[{[]/g))obj.add(m[1]);
const bad=[...num].filter(k=>obj.has(k));
console.log((bad.length?'✗ ':'✓ ')+'pole run: počítadla '+num.size+', objekty '+obj.size+(bad.length?' | KOLIZE: '+bad.join(', '):''));process.exit(bad.length?1:0);
