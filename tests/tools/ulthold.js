// 09z5: nabídka nové úrovně nesebere úder ultimátky – při náběhu počká na úder, jinak se otevře hned. node ulthold.js
const L=require('./lib');L.prep();
(async()=>{const P=await L.open({save:'mid'});const r=await P.p.evaluate(()=>{const K=window.__krypta,E=K._ev,out={};K.god=true;
 E("startRun('knight','hrbitov');addWeapon('vortex');recalc();");for(let i=0;i<60*4;i++){K.step(1/60);if(E('state')!=='play')E("setState('play')");}
 // 1) mimo náběh: otevře se hned
 E("run.pending=1");K.step(1/60);out.mimo=E('state');E("run.pending=0;setState('play')");
 // 2) v náběhu: čeká až do úderu, pak se otevře
 let guard=0;while(E('M.step%64')!==50&&guard++<4000)K.step(1/120);
 E("run.pending=1;run.dropAt=-1");let fr=0,st0=E('M.step');while(E('state')==='play'&&fr<400){K.step(1/60);fr++;}
 out.vNabehu=E('state');out.cekalo_s=(fr/60).toFixed(2);out.uderProbehl=E('run.dropAt')>=0;return out;});
 console.log(JSON.stringify(r),P.errs);const ok=r.mimo==='levelup'&&r.vNabehu==='levelup'&&r.uderProbehl&&+r.cekalo_s<3.1;
 console.log(ok?'✓ úder ultimátky proběhne před nabídkou':'✗ nesedí');await P.close();process.exit(ok?0:1);})();
