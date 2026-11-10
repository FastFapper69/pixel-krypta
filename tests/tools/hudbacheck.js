// 10f: rychlá kontrola hudebních pravidel (bez renderu, pár sekund). Pravidla a jejich důvody: hudba-pravidla.js.
// node hudbacheck.js            -> všechny kapitoly
// node hudbacheck.js c6         -> jedna kapitola (stejné volá chapcheck.js)
// node hudbacheck.js hrbitov,menu -> vybrané skladby
// Potom pro novou kapitolu vždy změř hlasitost po taktech: node skladby.js c6 (cíl: propady 0, klid −2 až −6, boss +3 až +5 dB).
const L=require('./lib'),{musicCheck}=require('./hudba-pravidla');
(async()=>{L.prep();const P=await L.open({save:'late'});const a=process.argv[2]||'all';
 const groups=a==='all'?await P.E('CHAPTERS.map(c=>[c.id,c.maps])'):/^c\d+$/.test(a)?[[a,await P.E(`CHAPTERS.find(c=>c.id==='${a}').maps`)]]:[['skladby',a.split(',')]];
 let bad=0;
 for(const [g,ids] of groups){const r=await musicCheck(P.p,ids);console.log('\n== '+g);
  for(const w of r.warn)console.log('  pozor  '+w);
  for(const id of ids){const o=r.songs[id];console.log('  '+id.padEnd(11)+(o.style||'').padEnd(7)+' pestrost '+String(o.shapes).padStart(2)+(o.issues.length?'':' OK'));
   for(const i of o.issues)console.log('    CHYBA  '+i);for(const w of o.warn)console.log('    pozor  '+w);bad+=o.issues.length;}}
 console.log(bad?'\nCelkem chyb: '+bad:'\nHudba v pořádku.');await P.close();process.exitCode=bad?1:0;})();
