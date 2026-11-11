// 11r: hra bez spojení se po události 'online' sama přihlásí a pošle frontu běhů. node offline-navrat.js
const L=require('./lib');L.prep();
(async()=>{const P=await L.open({save:'mid'});const {p,errs}=P;
const r=await p.evaluate(async()=>{const K=window.__krypta;let up=false,calls=0,ins=0;
 window.KRYPTA_ONLINE={url:'x',key:'y'};window.supabase={createClient:()=>{throw 0}};
 const q=v=>({maybeSingle:()=>up?Promise.resolve(v):Promise.reject(new Error('Failed to fetch'))});

 window.__s={auth:{getSession:()=>Promise.resolve({data:{session:{user:{id:'me'}}}})},rpc:n=>{calls++;return q({data:{nick:'T',save:{updated:1},rename_req:false},error:null});},
   from:()=>({insert:rows=>{ins+=rows.length;return Promise.resolve({error:null});}})};
 K._ev("ON.sb=window.__s;ON.ready=false;save.pinSet=true;save.runQ=[{hero:'knight'},{hero:'mage'}]");
 await K._ev("onlineInit()");const a=K._ev("ON.ready");up=true;dispatchEvent(new Event('online'));await new Promise(r=>setTimeout(r,300));
 return {predtim:a,po:K._ev("ON.ready"),fronta:K._ev("save.runQ.length"),ins,calls};});
console.log(JSON.stringify(r),errs);await P.close();})();
