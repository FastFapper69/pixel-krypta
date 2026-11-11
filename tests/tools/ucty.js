// Účty hráče podle postupu kampaní (11h). Společné pro hraci.js (boti), sila.js (měřič síly) a krivka.js (obtížnost podle síly).
// Účet = co má typický hráč, když vstupuje do kapitoly (index ci, 0 = I): úroveň hrdiny, Vylepšení, strom, výbava, sety, runy,
// Souhvězdí, mazlíček, věže a odemčené funkce (talenty, fúze, mazlíčci… se zapínají výhrou na mapě, viz FEATS ve hře).
// Kalibrace 8. 11. podle nejdál postoupeného hráče (kapitola III: hrdina 16–18, Vylepšení ~15/30, výbava ve 4 slotech rarity 1–3 na +0 až +3).
// Kapitoly za tabulkou se dopočítají (ucet(ci) pro ci >= UCTY.length) – nová kapitola tak dostane účet sama.
// Až budou hráči dál, přepočítej tabulku z profiles (save.hlv, save.meta, save.eq/inv) a pusť krivka.js.
const UCTY=[
 {hlv:1,meta:0,rev:0,tiers:0,tlv:0,gear:null,slots:0,sets:null,pet:['wolf',0],tw:[['arrow',0],['fire',0],['frost',0],['tesla',0]]},
 {hlv:8,meta:7,rev:1,tiers:0,tlv:0,gear:[1,1],slots:3,sets:['bone',1],pet:['wolf',3],tw:[['arrow',0],['fire',0],['frost',0],['tesla',0],['crypt',0]]},
 {hlv:16,meta:14,rev:1,tiers:1,tlv:2,gear:[2,2],slots:4,sets:['bone',2],pet:['owl',3],tw:[['arrow',1],['fire',1],['frost',1],['tesla',1],['obelisk',0]]},
 {hlv:19,meta:17,rev:2,tiers:2,tlv:3,gear:[2,3],slots:5,sets:['forge',2],pet:['fox',4],tw:[['arrow',1],['fire',1],['frost',1],['tesla',1],['forge',1]]},
 {hlv:22,meta:20,rev:2,tiers:3,tlv:3,gear:[2,4],slots:6,sets:['frost',2],pet:['salamander',3],tw:[['arrow',1],['fire',2],['frost',1],['tesla',2],['hearth',1]]},
 {hlv:25,meta:22,rev:2,tiers:4,tlv:4,gear:[3,4],slots:6,sets:['tide',2],pet:['drake',4],tw:[['arrow',2],['fire',2],['frost',2],['tesla',2],['icelance',1]],runes:[['fire',1],['ward',1]]},
 {hlv:29,meta:25,rev:3,tiers:5,tlv:5,gear:[3,5],slots:6,sets:['tide',4],pet:['drake',5],tw:[['arrow',2],['fire',2],['frost',2],['tesla',2],['cannon',1]],runes:[['fire',2],['ward',1],['haste',1]]},
 {hlv:33,meta:28,rev:3,tiers:5,tlv:6,gear:[3,6],slots:6,sets:['star',4],pet:['drake',5],tw:[['arrow',2],['fire',2],['frost',2],['tesla',2],['gwell',1]],runes:[['fire',3],['ward',2],['haste',2]]}]; // VII: řádek z druhého chatu (11h)
// kapitola za tabulkou: +3 úrovně hrdiny (nad 40 Prestiž), +3 Vylepšení (nad 30 mistrovství), výbava +1, runy o stupeň, Souhvězdí +6 hvězd
// mi = pořadí mapy v kapitole (0–4): hráč během kapitoly sílí (kapitola I rychle z nuly, další o ~2 úrovně do finále); faze 'fin' = mapa 4
function ucet(ci,faze,mi){
 let A;if(ci<UCTY.length)A=JSON.parse(JSON.stringify(UCTY[ci]));
 else{const L=UCTY[UCTY.length-1],k=ci-(UCTY.length-1);A=JSON.parse(JSON.stringify(L));
  const hl=L.hlv+3*k;A.hlv=Math.min(40,hl);A.pr=Math.max(0,hl-40);const me=L.meta+3*k;A.meta=Math.min(30,me);A.mast=Math.max(0,me-30)*2;
  A.tlv=Math.min(10,L.tlv+k);A.gear=[Math.min(4,L.gear[0]+(k>=2?1:0)),Math.min(10,L.gear[1]+k)];A.rev=3;
  A.pet=[L.pet[0],Math.min(10,L.pet[1]+k)];A.tw=L.tw.map(([t,r])=>[t,Math.min(4,r+(k>=2?1:0))]);
  A.runes=L.runes.map(([t,l])=>[t,Math.min(5,l+k)]).concat(k>=2?[['life',k]]:[]);}
 // Souhvězdí se otevře až výhrou finále kapitoly VI (zatmeni): pak 6 hvězd za kapitolu (Válečník, Strážce, …)
 A.sky=ci>=6?3+(ci-6)*6:0;
 if(faze==='fin')mi=4;mi=mi||0;if(mi){const k=ci===0?1.5:.6;A.hlv=Math.min(40,A.hlv+Math.round(mi*k));A.meta=Math.min(30,A.meta+Math.round(mi*k));if(ci===0&&mi>=2){A.gear=[1,0];A.slots=Math.max(A.slots||0,mi-1);}}
 if(faze==='grind'){A.hlv=Math.min(40,A.hlv+4);A.meta=Math.min(30,A.meta+3);A.gear=A.gear?[Math.min(3,A.gear[0]+1),A.gear[1]+2]:[1,2];
  A.slots=Math.min(6,(A.slots||0)+1)||3;A.sets=A.sets?[A.sets[0],Math.min(4,A.sets[1]+2)]:null;A.tlv=Math.min(10,A.tlv+2);A.grind=1;}
 A.ci=ci;A.faze=faze||'vstup';return A;}
// v prohlížeči: nastaví save podle účtu. Volej p.evaluate(setup,[A,hrdina,seed]). Vrací nic; pak K.startRun(hrdina,mapa).
function setup([A,h,seed]){const K=window.__krypta,E=K._ev,S=K.save;K.god=false;S.sound=false;S.music=false;S.cheat=false;S.tut=1;K.lastRun=null;
 let s=seed||12345;Math.random=()=>((s=(s*16807)%2147483647)/2147483647);
 E('econInit()');
 // odemčené funkce = co hráč vyhrál: všechny mapy kapitol před ci (grind: + finále na NM I)
 S.cleared={};S.unl={};S.nmw={};S.stats=S.stats||{};S.stats.runs=Math.max(1,A.ci*25);const CH=E('CHAPTERS');
 for(let c=0;c<Math.min(A.ci,CH.length);c++)for(const m of CH[c].maps){S.cleared[m]=true;if(A.grind)S.nmw['1|'+m]=1;}
 S.feat={};E('featCheck()');
 S.heroes[h]=true;S.hlv={};S.hlv[h]=A.hlv;S.hpr={};if(A.pr)S.hpr[h]=A.pr;S.htal={};if(A.hlv>=25){S.htal[h]={25:0,30:0,35:1,40:0};}
 S.meta={treeV:2};S.metaV=2;for(const id of ['hp','dmg','spd','mag','xp','build'])S.meta[id]=A.meta;S.meta.revive=A.rev;
 if(A.mast){S.meta.ma=A.mast;S.meta.md=A.mast;}
 const br=['a','d','l'];for(let t=0;t<A.tiers;t++)for(const x of br)S.meta[x+(t+1)]=A.tlv;
 S.inv=[];S.eq={};S.eq[h]={};const setS=A.sets?E("setSlots('"+A.sets[0]+"')").slice(0,A.sets[1]):[];
 const order=[...setS,...E('SLOT_IDS').filter(x=>!setS.includes(x))].slice(0,Math.max(A.slots||0,setS.length));
 const rq=(A.runes||[]).slice();
 if(A.gear)for(const sl of order){const it=setS.includes(sl)?E("makeSetItem('"+A.sets[0]+"','"+sl+"',"+A.gear[0]+",.6)"):K.makeItem(A.gear[0],sl,.6);it.lv=A.gear[1];
  const n=E('runeSlots')(it);if(n&&rq.length){it.rn=[];for(let i=0;i<n&&rq.length;i++){const [t,l]=rq.shift();it.rn.push(t+l);}}
  E('addItem')(it);S.eq[h][sl]=it.u;}
 const pc=E('petRoll')(A.pet[0],.6);pc.lv=A.pet[1];S.pets={v:1,cards:[pc],sel:pc.u};
 if(h==='tamer'){const p2=E('petRoll')(A.pet[0]==='wolf'?'owl':'wolf',.6);p2.lv=A.pet[1];S.pets.cards.push(p2);S.pets.sel2=p2.u;}
 S.tw={v:2,cards:[],deck:[]};for(const [k,r] of A.tw){const c=E('twRoll')(k,r,.6);c.lv=Math.min(10,A.gear?A.gear[1]:0);S.tw.cards.push(c);S.tw.deck.push(c.u);}
 // Souhvězdí: hvězdy po řadě Válečník, Strážce, Hudebník, Krotitel, Stavitel (útok a výdrž první, jako by hráč volil)
 E('skyInit()');for(const id of ['war','guard','music','tame','build']){S.sky.lit[id]=0;S.sky.rk[id]=[0,0,0,0,0,0,0];}
 let n=A.sky||0;for(const id of ['war','guard','music','tame','build'])for(let i=0;i<7&&n>0;i++,n--)S.sky.lit[id]|=1<<i;
}
module.exports={UCTY,ucet,setup};
