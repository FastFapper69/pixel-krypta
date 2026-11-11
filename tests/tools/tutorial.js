// 11z4: první běh nového hráče s jednoduchým „hráčem“ (sbírá krystaly, uhýbá, klepne na zvýrazněnou věž).
// Vyfotí každý nový krok tutoriálu a nabídku úrovně. node tutorial.js [cs|en] [se|13] [maxSekund=330] -> /tmp/tut/*.png + výpis
const L=require('./lib');const lang=process.argv[2]||'cs',ph=process.argv[3]||'13',MAX=+(process.argv[4]||330),dir='/tmp/tut';require('fs').mkdirSync(dir,{recursive:true});
(async()=>{const o=await L.open({phone:ph,lang,save:'fresh'});
await o.E("save.tut=0;save.stats={runs:0};persist();openMenu();");await o.p.waitForTimeout(200);
await o.E("$('#mPlay').click()");await o.p.waitForTimeout(300);
console.log('po Hrát:',await o.E("state+' '+(run&&run.mapId)+' věží v liště '+document.querySelectorAll('#buildbar .bb').length"));
let last='',n=0,lu=0;const log=[];
while(true){const r=await o.p.evaluate(()=>{const K=window.__krypta,E=K._ev;
  for(let i=0;i<40;i++){const R=K.run;if(!R||R.over)return{st:'over'};const S=E('state');if(S==='levelup')return{st:S};if(S!=='play')return{st:S};
    const p=R.p;let fx=0,fy=0,bd=1e9,g=null;for(const q of R.gems){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;g=q;}}
    for(const it of R.items)if(it.k==='chest'&&!it.dead){g=it;break;}
    if(g){fx=g.x-p.x;fy=g.y-p.y;const m=Math.hypot(fx,fy)||1;fx/=m;fy/=m;}
    for(const e of R.enemies){if(e.dead)continue;const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)+.01;if(d<26){fx+=dx/d*1.6;fy+=dy/d*1.6;}}
    if(R.boss&&!R.boss.dead){const dx=R.boss.x-p.x,dy=R.boss.y-p.y,d=Math.hypot(dx,dy);if(d>60){fx+=dx/d*.6;fy+=dy/d*.6;}}
    K.force={x:fx,y:fy};const b=document.querySelector('#buildbar .tuton');if(b&&Math.random()<.02)E("buildTower((run.deck||T_BASE)[0])");
    K.step(1/40);}
  const R=K.run,el=document.querySelector('#tut');return{st:'play',t:R.t,txt:el.hidden?'':el.textContent,ok:el.className,lv:R.level,hp:Math.round(R.p.hp),tw:R.towers.length,c:R.coins};});
 if(r.st==='levelup'){if(lu++<1){await o.p.waitForTimeout(300);await o.p.screenshot({path:`${dir}/lu-${lang}.png`});}await o.E("applyOption(levelOptions()[0]);afterOption&&afterOption()").catch(async()=>{await o.p.click('#luCards > *:first-child').catch(()=>{});});await o.p.waitForTimeout(50);continue;}
 if(r.st!=='play'){log.push('konec: '+r.st);break;}
 const key=r.txt+'|'+r.ok;if(r.txt&&key!==last){last=key;n++;await o.p.waitForTimeout(450);await o.p.screenshot({path:`${dir}/s${String(n).padStart(2,'0')}-${lang}.png`});log.push(`${Math.round(r.t)}s ${r.ok?'✓':' '} ${r.txt}  (úr ${r.lv}, hp ${r.hp}, věží ${r.tw}, zlato ${r.c})`);}
 if(r.t>MAX){log.push('limit '+MAX+' s, hp '+r.hp);break;}}
await o.p.waitForTimeout(1800);await o.p.screenshot({path:`${dir}/konec-${lang}.png`});
const end=await o.E("JSON.stringify({won:run.won,t:Math.round(run.t),tut:save.tut,lv:run.level})");
console.log(log.join('\n'));console.log('výsledek',end);console.log(o.errs.join('\n'));await o.close();})();
