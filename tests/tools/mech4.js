// kapitola IV: mechaniky map (led, mráz, laviny, zamrzání arény), věže a zbraně nových hrdinů: node mech4.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:393,height:852}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const K=window.__krypta,o={};K.save.sound=false;K.save.music=false;K.save.tut=1;const step=n=>{for(let i=0;i<n;i++)K.step(1/60);};
 // ice: push right for 1 s on ice, then let go: the hero keeps sliding
 K.startRun('knight','jezero');let R=K.run,B=R.built,pt=null;for(let y=60;y<B.def.size-60&&!pt;y+=8)for(let x=60;x<B.def.size-60;x+=8){let ok=true;for(let d=-60;d<=60;d+=10)if(!B.ice[y*B.def.size+x+d]){ok=false;break;}if(ok){pt=[x,y];break;}}
 R.p.x=pt[0];R.p.y=pt[1];K.god=true;R.enemies.length=0;K.force={x:1,y:0};step(10);const x0=R.p.x;step(50);const vRun=(R.p.x-x0)/(50/60);K.force={x:0,y:0};const x1=R.p.x;step(30);o.ice={pushSpeed:Math.round(vRun),slideAfterRelease:Math.round(R.p.x-x1)};
 // off ice: no slide
 R.p.x=R.map.size/2;R.p.y=R.map.size/2;K.force={x:1,y:0};step(40);K.force={x:0,y:0};const x2=R.p.x;step(30);o.ice.slideOffIce=Math.round(R.p.x-x2);K.force=null;
 // taiga: cold fills away from fire, slows, hurts; a fire warms you back
 K.god=false;K.startRun('knight','tajga');R=K.run;R.enemies.length=0;R.p.x=R.map.size/2+300;R.p.y=R.map.size/2;R.p.hp=R.p.max;const hp0=R.p.hp;
 for(let i=0;i<60*45;i++){K.step(1/60);R.enemies.length=0;R.spawnT=99;}
 o.taiga={cold:+R.p.cold.toFixed(2),hpLost:hp0-R.p.hp};const f=R.built.fires[0];R.p.x=f.x+20;R.p.y=f.y;step(60*3);o.taiga.coldAtFire=+R.p.cold.toFixed(2);
 // gorge: avalanches appear and hit
 K.god=true;K.startRun('knight','soutezka');R=K.run;R.t=60;let maxA=0;for(let i=0;i<60*20;i++){K.step(1/60);maxA=Math.max(maxA,R.aval.length);}o.gorge={avalSeen:maxA,qc:R.qc&&R.qc.aval||0};
 // throne: the queen below half → frost cycle with active runes
 K.startRun('knight','zima');R=K.run;R.t=R.map.dur-1;step(300);const Q=R.enemies.find(e=>e.boss);o.throne={boss:Q&&Q.id};if(Q){Q.hp=Q.max*.45;let seen=0;for(let i=0;i<60*16;i++){K.step(1/60);if(R.fcy)seen=1;}o.throne.frz2=R.frz2;o.throne.cycle=seen;}
 // new weapons
 K.startRun('warlord','hrbitov');R=K.run;o.warlord=Object.keys(R.W);let k0=R.kills;step(60*20);o.warlord.push('kills20s='+(R.kills-k0));
 K.startRun('tamer','hrbitov');R=K.run;o.tamer=Object.keys(R.W);k0=R.kills;step(60*20);o.tamer.push('kills20s='+(R.kills-k0));
 // new towers
 K.startRun('builder','tajga');R=K.run;for(const k of ['hearth','icelance']){try{K.save.tw.cards.push({u:'t'+k,k,r:2,lv:0,b:{}});}catch(e){}}
 return o;});
console.log(JSON.stringify(r,null,1));console.log('errors',errs.slice(0,5));await b.close();})();
