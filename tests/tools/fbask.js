// 11s (+12o rytmus): rychlá otázka na konci běhu – kdy se ukáže, odpověď do fronty save.fbQ a odeslání, snímky CZ/EN.
// node fbask.js [složka] [telefon]
const L=require('./lib');L.prep();const dir=process.argv[2]||'/tmp',phone=process.argv[3]||'se';
(async()=>{const bad=[];for(const lang of ['cs','en']){const o=await L.open({phone,lang,save:'mid'});
 const r=await o.p.evaluate(async()=>{const K=window.__krypta,out={},sent=[];
  K._ev("onlineConfigured=()=>true;save.fbAsk=null;save.fbQ=[];ON.sb=null;ON.ready=false");
  const end=(won,runs)=>{K._ev("save.stats=save.stats||{};save.stats.runs="+(runs-1));K.startRun('knight','hrbitov',{});for(let i=0;i<40;i++)K.step(1/30);K._ev("finish("+won+")");};
  end(false,2);await new Promise(r=>setTimeout(r,900));out.run2=!!document.querySelector('#ovAsk');
  end(false,3);await new Promise(r=>setTimeout(r,900));out.run3=!!document.querySelector('#ovAsk');return out;});
 const el=await o.p.$('#ovAsk');if(el)await el.scrollIntoViewIfNeeded();await o.p.waitForTimeout(300);await o.p.screenshot({path:dir+'/fbask_'+lang+'_a.png'});
 const r2=await o.p.evaluate(async()=>{const K=window.__krypta,out={};
  document.querySelector('#ovAsk [data-r="4"]').click();out.poHvezde=K._ev("save.fbQ.length");
  document.querySelector('#ovAsk [data-dq="hard"]').click();out.poObtiznosti=K._ev("save.fbQ.length");
  document.querySelector('#ovAsk [data-rh="bad"]').click();out.fronta=K._ev("save.fbQ.length");out.row=K._ev("save.fbQ[0]");out.diky=!!document.querySelector('#ovAsk .ok');
  return out;});
 await o.p.waitForTimeout(300);await o.p.screenshot({path:dir+'/fbask_'+lang+'_b.png'});
 const r3=await o.p.evaluate(async()=>{const K=window.__krypta,out={},sent=[];
  document.querySelector('#ovAskMore').click();await new Promise(r=>setTimeout(r,200));out.vic=!document.querySelector('#newsPop').hidden&&document.querySelectorAll('#fbStars button.on').length;
  out.kind=(document.querySelector('#fbKind button.on')||{}).dataset.fk;
  window.__sb={from:t=>({insert:o=>{if(t==='feedback')sent.push(o);return Promise.resolve({error:null});}})};
  K._ev("ON.sb=window.__sb;ON.me={id:'me'};ON.ready=true");await K._ev("fbqFlush()");out.poslano=sent.length;out.zbylo=K._ev("save.fbQ.length");out.kindSent=sent[0]&&sent[0].kind;
  // stejný den se už neptá; jen hvězdy a odchod = odešle se taky
  K._ev("save.stats.runs=8");K.startRun('knight','hrbitov',{});for(let i=0;i<40;i++)K.step(1/30);K._ev("finish(true)");await new Promise(r=>setTimeout(r,1500));out.znovu=!!document.querySelector('#ovAsk');
  K._ev("save.fbAsk=null;save.stats.runs=8");K.startRun('knight','hrbitov',{});for(let i=0;i<40;i++)K.step(1/30);K._ev("finish(true)");await new Promise(r=>setTimeout(r,1500));
  document.querySelector('#ovAsk [data-r="5"]').click();K._ev("openMenu()");await new Promise(r=>setTimeout(r,100));out.odchod=sent.length;
  return out;});
 const R=Object.assign({},r,r2,r3);console.log(lang,JSON.stringify(R));
 if(!(!R.run2&&R.run3&&R.poHvezde===0&&R.fronta===1&&R.diky&&R.row.rating===4&&R.poObtiznosti===0&&R.row.ctx.diff==='hard'&&R.row.ctx.rh==='bad'&&R.row.ctx.rid&&R.vic===4&&R.kind==='balanc'&&R.poslano===1&&R.zbylo===0&&R.kindSent==='rychle'&&!R.znovu&&R.odchod===2))bad.push(lang);
 if(o.errs.length)bad.push(lang+' chyby '+o.errs.join());await o.close();}
 console.log(bad.length?'✗ '+bad.join(', '):'✓ vše v pořádku');process.exit(bad.length?1:0);})();
