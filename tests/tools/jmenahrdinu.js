// 10f: jména hrdinů v dlaždici (pás hrdinů v Přípravě, #heroList, i zamčení) – vejdou se v plné velikosti písma (12 px)
// na nejužším telefonu (360 px)? Dlaždice má na jméno 58 px; limit MAX = 85 % = 49 px, ať zbude vzduch po stranách.
// Dřív se dlouhé jméno zmenšovalo (Armsmaster) nebo bylo na těsno – uživatel to nechce, proto se jména drží krátká (CZ i EN).
// node jmenahrdinu.js [hero:id]   -> CZ i EN. Volá ho i chapcheck.js hero:id / all. Dlouhé celé jméno jde zkrátit přes sname.
const L=require('./lib'),MAX=85;
async function measureNames(only){const rows=[];
 for(const lang of ['cs','en']){const P=await L.open({lang,phone:'small',save:'late'});
  const r=await P.E(`(()=>{openMenu();$('#mPlay').click();const out=[];for(const sp of document.querySelectorAll('#heroList .co-pick>span')){const id=sp.parentNode.dataset.h,keep=sp.style.fontSize;
    sp.style.fontSize='12px';const w=sp.scrollWidth,cw=sp.parentNode.clientWidth-4;sp.style.fontSize=keep;out.push({id,t:sp.textContent,w,cw});}return out;})()`);
  for(const o of r)if(!only||o.id===only){o.lang=lang;o.pct=Math.round(o.w/o.cw*100);o.ok=o.pct<=MAX;rows.push(o);}
  await P.close();}
 return rows;}
module.exports={measureNames,MAX};
if(require.main===module)(async()=>{L.prep();const a=process.argv[2]||'';const rows=await measureNames(a.startsWith('hero:')?a.slice(5):null);let bad=0;
 for(const o of rows){if(!o.ok)bad++;console.log(o.lang,o.id.padEnd(9),('„'+o.t+'“').padEnd(18),String(o.w).padStart(3)+'/'+o.cw+' px',String(o.pct).padStart(3)+' %',o.ok?'OK':'PŘÍLIŠ DLOUHÉ (limit '+MAX+' %)');}
 console.log(bad?'\nCelkem příliš dlouhých jmen: '+bad:'\nJména se vejdou.');process.exitCode=bad?1:0;})();
