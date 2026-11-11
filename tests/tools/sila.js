// Měřič síly hráče (11h): z účtu (ucty.js) postaví save, spustí běh a přečte statistiky hrdiny přímo z kódu hry (st po recalc),
// takže započítá všechno, co hra počítá: úroveň hrdiny, Prestiž, talenty, Vylepšení, strom, výbavu, sety, runy, Souhvězdí.
//   útok  U = poškození × rychlost útoků × (1 + krit × (násobek − 1))
//   výdrž V = zdraví × brnění proti typickému zásahu kapitoly / (1 − úhyb) × (1 + druhá šance) + regenerace × 20 s
// Mazlíčci, věže, legendárky a 4kusové sety (efekty v boji) v čísle nejsou – ty ukážou až boti (hraci.js).
// node sila.js [kapitoly=all] [hrdinové=knight]    -> tabulka síly na vstupu, ve finále a po grindu
const U=require('./ucty');
async function measure(p,A,hero,map,hit){
 await p.evaluate(U.setup,[A,hero,777]);
 return p.evaluate(([hero,map,hit])=>{const K=window.__krypta,E=K._ev;K.startRun(hero,map,{});const st=E('st'),R=K.run;
  const cm=st.tal&&st.tal.a20?2:1.6,crit=Math.min(1,st.crit||.1),U=st.dmg/Math.max(.4,st.cdMul)*(1+crit*(cm-1))*(1+.5*(st.fuse||0)*0);
  const armorF=hit/Math.max(1,hit-(st.armor||0)),rv=E('REV_HP')[Math.min(3,(R.meta||K.save.meta).revive||0)]||0;
  const V=st.max*armorF/(1-(st.dodge||0))*(1+rv)+(st.regen||0)*20;
  const o={max:st.max,dmg:+st.dmg.toFixed(3),cd:+st.cdMul.toFixed(3),crit:+crit.toFixed(3),armor:+(st.armor||0).toFixed(1),dodge:st.dodge||0,regen:+(st.regen||0).toFixed(2),rev:rv,U:+U.toFixed(3),V:Math.round(V)};
  K.finish(false);E('openMenu()');return o;},[hero,map,hit]);}
// typický zásah běžného nepřítele mapy ve 3. minutě (bez bossů), podle tabulky spawnů a násobku mapy
function hitOf(p,map){return p.evaluate(m=>{const E=window.__krypta._ev,M=E('MAPS')[m],D=E('ENEMY_DEFS');let w=0,h=0,d=0;
 for(const s of M.spawns){if(s.from>3||(s.to!==undefined&&s.to<3))continue;const e=D[s.e];if(!e)continue;w+=s.w;h+=s.w*e.hp;d+=s.w*e.dmg;}
 return{hp:h/w,dmg:d/w,hit:d/w*(1+3*.08)*(M.dmm||1),hpm:M.hpm,dmm:M.dmm||1,spx:M.spx||0};},map);}
module.exports={measure,hitOf};
if(require.main===module)(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await (await b.newContext()).newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(500);
 const CH=await p.evaluate(()=>window.__krypta._ev('CHAPTERS.map(c=>c.maps)'));const n=CH.length+1;
 const cis=process.argv[2]&&process.argv[2]!=='all'?process.argv[2].split(',').map(Number):[...Array(n).keys()],heroes=(process.argv[3]||'knight').split(',');
 const pad=(s,k)=>String(s).padEnd(k);console.log(pad('kap.',6)+pad('fáze',7)+pad('hrdina',9)+pad('úr.',5)+pad('zdraví',8)+pad('pošk.',7)+pad('rychl.',7)+pad('krit',6)+pad('brn.',6)+pad('útok U',8)+'výdrž V');
 for(const ci of cis)for(const f of ['vstup','fin','grind'])for(const h of heroes){const A=U.ucet(ci,f),map=CH[Math.min(ci,CH.length-1)][0],H=await hitOf(p,map);
  const o=await measure(p,A,h,map,H.hit);console.log(pad(ci+1,6)+pad(f,7)+pad(h,9)+pad(A.hlv+(A.pr?'+'+A.pr:''),5)+pad(o.max,8)+pad(o.dmg,7)+pad((1/o.cd).toFixed(2),7)+pad(o.crit,6)+pad(o.armor,6)+pad(o.U,8)+o.V);}
 console.log('chyby:',errs.slice(0,3));await b.close();})();
