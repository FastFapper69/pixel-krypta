// in-page mock of supabase-js: auth/db no-ops, realtime broadcast via BroadcastChannel (other tabs only = self:false)
window.__mockSB=true;
window.supabase={createClient(){const q=()=>{const o={select:()=>o,eq:()=>o,order:()=>o,limit:()=>o,update:()=>o,upsert:()=>o,insert:()=>o,
  maybeSingle:async()=>({data:{nick:'Test'+(Math.random()*99|0),save:{pinSet:true}},error:null}),then:(res)=>res({data:[],error:null})};return o;};
 return{auth:{getSession:async()=>({data:{session:{user:{id:'u'+Math.random()}}}}),signInAnonymously:async()=>({data:{session:{user:{id:'x'}}}})},
  from:q,rpc:async()=>({data:null,error:null}),
  channel(name){const bc=new BroadcastChannel(name),hs=[];const lat=window.__lat||0,loss=window.__loss||0;
   const ch={on(t,f,cb){hs.push([f.event,cb]);return ch;},subscribe(cb){bc.onmessage=m=>{if(Math.random()<loss&&m.data.event==='g'&&m.data.payload.o&&(m.data.payload.o.t==='s'||m.data.payload.o.t==='in'))return;
       setTimeout(()=>{for(const [ev,f2] of hs)if(ev===m.data.event)f2({payload:m.data.payload});},lat);};setTimeout(()=>cb('SUBSCRIBED'),60);return ch;},
    send(m){window.__sent=(window.__sent||0)+1;bc.postMessage({event:m.event,payload:m.payload});return Promise.resolve('ok');},unsubscribe(){try{bc.close()}catch(e){}}};return ch;}};}};
try{localStorage.setItem('pixel-krypta-v1',JSON.stringify({sound:false,music:false,pinSet:true,nick:'T',heroes:{knight:true,mage:true,archer:true,builder:true},cleared:{hrbitov:true,poust:true}}));}catch(e){}
