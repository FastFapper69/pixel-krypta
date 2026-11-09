// 09z4: hra mluví se serverem jen přes my_profile / claim_profile_v2 / save_profile (stub serveru, bez sítě).
// Kontroluje: načtení vlastního profilu, uložení s vizitkou do žebříčku, zamčený a špatný PIN, žebříček bez cizích savů. node cloudstub.js [prefix]
const L=require('./lib');L.prep();
(async()=>{const P=await L.open({save:'mid'});const {p,E,errs}=P;const pre=process.argv[2];
 const r=await p.evaluate(async()=>{const K=window.__krypta,log=[];let claim='bad';
  const q=v=>{const pr=Promise.resolve(v);return {then:(a,b)=>pr.then(a,b),maybeSingle:()=>Promise.resolve({data:Array.isArray(v.data)?v.data[0]||null:v.data,error:v.error})};};
  const sb={rpc:(n,a)=>{log.push(n+(a?' '+Object.keys(a).join(','):''));if(n==='my_profile')return q({data:[{nick:'Tester',save:{coins:77,updated:1},updated_at:'x'}],error:null});
    if(n==='claim_profile_v2')return q({data:claim,error:null});if(n==='save_profile'){K._last=a;return q({data:null,error:null});}return q({data:null,error:{message:'?'}});},
   from:t=>({select:c=>{log.push('select '+t+' '+c);return {order:()=>({limit:()=>Promise.resolve({data:[{id:'a',nick:'Jiny',stats:{wins:3,runs:5,kills:9,card:{av:null,tl:null,cl:7,hc:2}},hidden:false}],error:null})}),eq:()=>({maybeSingle:()=>Promise.resolve({data:null,error:null})})};},upsert:()=>{log.push('UPSERT');return Promise.resolve({error:null});}})};
  K._ev("ON.sb=arguments[0]");return null;}).catch(e=>e.message);
 // ON.sb podstrčit přes window
 await p.evaluate(()=>{});
 const res=await p.evaluate(async()=>{const K=window.__krypta,log=[];let claim='bad';
  const q=v=>{const pr=Promise.resolve(v);return {then:(a,b)=>pr.then(a,b),maybeSingle:()=>Promise.resolve({data:Array.isArray(v.data)?v.data[0]||null:v.data,error:v.error})};};
  window.__sb={rpc:(n,a)=>{log.push(n);if(n==='my_profile')return q({data:[{nick:'Tester',save:{coins:77,updated:1},updated_at:'x'}],error:null});
    if(n==='claim_profile_v2')return q({data:window.__claim,error:null});if(n==='save_profile'){window.__last=a;return q({data:null,error:null});}return q({data:null,error:{message:'?'}});},
   from:t=>({select:c=>{log.push('select '+c);return {order:()=>({limit:()=>Promise.resolve({data:[{id:'a',nick:'Jiny',stats:{wins:3,runs:5,kills:9,card:{av:null,tl:null,cl:7,hc:2}},hidden:false}],error:null})})};},upsert:()=>{log.push('UPSERT');return Promise.resolve({error:null});}})};
  K._ev("ON.sb=window.__sb;ON.me={id:'me'};ON.ready=true;save.nick='Tester';");
  const out={};
  // uložení
  K._ev("ON.dirty=true");await K._ev("cloudFlush()");out.save=window.__last?{keys:Object.keys(window.__last),card:window.__last.p_stats.card}:null;
  // přihlášení: zamčeno, špatně, dobře
  for(const st of ['locked','bad','ok']){window.__claim=st;K._ev("openNick('login')");document.querySelector('#nickInput').value='Tester';document.querySelector('#pinInput').value='1234';await K._ev("saveNick()");
   out[st]=document.querySelector('#nickMsg').textContent+' | stav '+K._ev("state");}
  out.coinsPoLoginu=K._ev("save.coins");
  // 09z7: vynucené přejmenování – nejde přeskočit, závadné jméno neprojde, nové se uloží a příznak zmizí
  K._ev("ON.forceNick=true;openMenu()");out.force={stav:K._ev("state"),zpetSkryte:document.querySelector('#scr-nick [data-back], #nickTitle').parentNode.querySelector('[data-back]').hidden,pin:document.querySelector('#pinWrap').hidden};
  document.querySelector('#nickInput').value='kokot1';await K._ev("saveNick()");out.force.spatne=document.querySelector('#nickMsg').textContent;
  K._ev("openMenu()");out.force.znovu=K._ev("state");
  document.querySelector('#nickInput').value='Novak';await K._ev("saveNick()");out.force.ulozeno=window.__last&&window.__last.p_nick;out.force.po=K._ev("state")+' '+K._ev("ON.forceNick");
  K._ev("openMenu()");out.force.menu=K._ev("state");
  // žebříček
  K._ev("onlineConfigured=()=>true");await K._ev("openBoard()");await new Promise(r=>setTimeout(r,300));out.board=document.querySelector('#scr-board').innerText.includes('Jiny');
  out.log=log;return out;});
 console.log(JSON.stringify(res,null,1));
 const bad=[];if(!res.save||!res.save.card||res.save.keys.join()!=='p_nick,p_save,p_stats')bad.push('uložení');if(!/hodinu/.test(res.locked))bad.push('zámek');if(!/Špatná/.test(res.bad))bad.push('špatný PIN');
 if(res.coinsPoLoginu!==77)bad.push('načtení po přihlášení');
 const F=res.force;if(!(F.stav==='nick'&&F.zpetSkryte&&F.pin&&/povolená/.test(F.spatne)&&F.znovu==='nick'&&F.ulozeno==='Novak'&&F.po==='menu false'&&F.menu==='menu'))bad.push('vynucené přejmenování '+JSON.stringify(F));if(!res.board)bad.push('žebříček');if(res.log.some(l=>/UPSERT|save/.test(l)&&/select/.test(l)||l==='UPSERT'))bad.push('starý způsob přístupu: '+res.log.join(','));
 if(pre)await L.shot(p,pre+'_board.png');
 console.log(bad.length?'✗ '+bad.join(', '):'✓ vše v pořádku','chyby',JSON.stringify(errs));await P.close();process.exit(bad.length?1:0);})();
