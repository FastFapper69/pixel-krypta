// Křivka obtížnosti proti síle hráče (11h).
// Pro každou mapu: síla typického účtu na vstupu do její kapitoly (ucty.js + sila.js: útok U, výdrž V, čteno z kódu hry),
// a nepřátelé mapy ve 3. minutě (průměrné zdraví a zásah podle tabulky spawnů). Index mapy:
//   kH = hpm × zdraví nepřátel / U      (kolik útoku mapa chce proti tomu, co hráč má)
//   kD = dmm × zásah nepřátel / V × 100 (jak rychle bere zdraví proti tomu, co hráč vydrží)
// Mapy vyladěné boty (ladeni.js) určují, jak má kH a kD vypadat. Z nich se spočítá blok PWR v game.js,
// podle kterého kitTier() dá obtížnost každé mapě, která nemá vlastní řádek v MAP_TIER – tedy i nové kapitole.
// node krivka.js            -> tabulka všech map, odchylky od modelu
// node krivka.js cN         -> jen kapitola N a vzorec pro ni (volá chapcheck.js)
// node krivka.js zapis      -> přepočítá PWR (síla po kapitolách + tvar) a zapíše ho do game.js
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),U=require('./ucty'),S=require('./sila'),{CIL}=require('./ladeni');
const GAME=path.join(__dirname,'..','..','game.js'),med=a=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[a.length>>1]:0;};
async function power(p,ci,mi,map,hit){const o=[];for(const h of ['knight','mage','archer']){o.push(await S.measure(p,U.ucet(ci,'vstup',mi),h,map,hit));}
 return{U:o.reduce((a,x)=>a+x.U,0)/o.length,V:o.reduce((a,x)=>a+x.V,0)/o.length};}
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+__dirname+'/'+(process.env.F||'off.html'));await p.waitForTimeout(500);
 const CH=await p.evaluate(()=>window.__krypta._ev('CHAPTERS.map(c=>({id:c.id,i:c.i,maps:c.maps}))'));
 const own=await p.evaluate(()=>Object.keys(window.__krypta._ev('MAP_TIER')));
 const arg=process.argv[2]||'',only=/^c\d+$/.test(arg)?+arg.slice(1)-1:null,rows=[];
 for(const C of CH){if(only!=null&&C.i!==only)continue;
  let P=null;for(const [mi,m] of C.maps.entries()){const fin=mi===C.maps.length-1,H=await S.hitOf(p,m);if(!P)P=await power(p,C.i,0,m,H.hit); // síla na VSTUPU kapitoly; růst během kapitoly je v tvaru sm
   rows.push({ci:C.i,mi,m,fin,own:own.includes(m),hpm:H.hpm,dmm:H.dmm,hp:+H.hp.toFixed(1),hit:+(H.hit/H.dmm).toFixed(2),U:+P.U.toFixed(3),V:Math.round(P.V),
    kH:+(H.hpm*H.hp/P.U).toFixed(2),kD:+(H.dmm*H.hit/H.dmm/P.V*100).toFixed(3)});}}
 // model pro mapy bez vlastního řádku: poslední dvě vyladěné kapitoly, každá mapa přepočtená na cíl 40 % (první mapa běžné kapitoly)
 // přes cílovou křivku (ladeni.js CIL) a sklon b (HP ×e^(1/b) = −1 logit výher, odhad z ladění); finále zvlášť (má bosse)
 const B=2.67,lg=q=>Math.log(q/(1-q)),g=(ci,mi,fin)=>Math.exp((lg(.4)-lg(CIL(ci,mi,fin)/100))/B);
 const tuned=[...new Set(rows.filter(r=>r.own).map(r=>r.ci))].filter(ci=>rows.filter(r=>r.ci===ci).every(r=>r.own)).sort((a,b)=>a-b).slice(-2);
 const T=rows.filter(r=>tuned.includes(r.ci)),R=T.filter(r=>!r.fin),Fn=T.filter(r=>r.fin);
 const kh=med(R.map(r=>r.kH/g(r.ci,r.mi,r.fin))),khf=med(Fn.map(r=>r.kH/g(r.ci,r.mi,r.fin)))||kh*1.2;
 const kd=med(R.map(r=>r.kD/Math.sqrt(g(r.ci,r.mi,r.fin)))),kdf=med(Fn.map(r=>r.kD/Math.sqrt(g(r.ci,r.mi,r.fin))))||kd;
 const pad=(s,k)=>String(s).padEnd(k);
 console.log(pad('kap',4)+pad('mapa',12)+pad('hpm',6)+pad('dmm',6)+pad('zdr.',7)+pad('zásah',7)+pad('útok',7)+pad('výdrž',7)+pad('kH',8)+pad('model',8)+'kD');
 for(const r of rows){const mod=(r.fin?khf:kh)*g(r.ci,r.mi,r.fin),dev=r.kH/mod;
  console.log(pad(r.ci+1,4)+pad(r.m+(r.fin?'*':'')+(r.own?'':' ~'),12)+pad(r.hpm,6)+pad(r.dmm,6)+pad(r.hp,7)+pad(r.hit,7)+pad(r.U,7)+pad(r.V,7)+pad(r.kH,8)+pad(Math.round(mod*10)/10+(Math.abs(dev-1)>.35?(dev>1?' ▲':' ▼'):''),8)+r.kD);}
 console.log('\nmodel z kapitol '+tuned.map(c=>c+1).join(', ')+': kh '+kh.toFixed(1)+' (finále '+khf.toFixed(1)+') · kd '+kd.toFixed(2)+' (finále '+kdf.toFixed(2)+') · sklon '+B);
 console.log('~ = mapa bez vlastního řádku v MAP_TIER (dostane vzorec kitTier). ▲▼ = o víc než 35 % mimo model (mechanika mapy, nebo ladit: node ladeni.js mapa)');
 if(arg==='zapis'){
  // síla po kapitolách (vstup, mapa 0) i pro kapitoly, které ještě nejsou, ať je vzorec připravený
  // síla na vstupu každé kapitoly; výdrž proti zásahu té kapitoly (budoucí kapitoly: zásah ×1,1 za kapitolu jako kitFoe)
  const u=[],v=[];let hit=0;for(let ci=0;ci<CH.length+4;ci++){const m0=CH[Math.min(ci,CH.length-1)].maps[0],H0=await S.hitOf(p,m0);hit=ci<CH.length?H0.hit:hit*1.1;
   const P=await power(p,ci,0,m0,hit);u.push(+P.U.toFixed(3));v.push(Math.round(P.V));}
  const blk='const PWR={u:'+JSON.stringify(u)+',v:'+JSON.stringify(v)+',kh:'+kh.toFixed(2)+',khf:'+khf.toFixed(2)+',kd:'+kd.toFixed(3)+',kdf:'+kdf.toFixed(3)+',b:'+B+'};';
  let s=fs.readFileSync(GAME,'utf8');s=s.replace(/const PWR=\{[^\n]*\};/,blk);fs.writeFileSync(GAME,s);console.log('\nzapsáno do game.js:\n'+blk);}
 fs.writeFileSync(path.join(__dirname,'krivka-last.json'),JSON.stringify(rows));
 if(errs.length)console.log('chyby:',errs.slice(0,3));await b.close();})();
