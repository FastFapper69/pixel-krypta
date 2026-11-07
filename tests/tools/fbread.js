// read player feedback (and run telemetry) from Supabase for the developer:
//   KRYPTA_DEV_KEY=<klíč> node fbread.js [feedback|runs|done id,id] [dní=30] [all]
// needs network access to mpxfppuigwvwlfhsnbgr.supabase.co (claude.ai → Settings → Capabilities → allowed domains)
const URL='https://mpxfppuigwvwlfhsnbgr.supabase.co/rest/v1/rpc/',KEY='sb_publishable_X7rB8j45EHq79TnlzSxxsw_slxNAD8G',dev=process.env.KRYPTA_DEV_KEY;
const what=process.argv[2]||'feedback',days=+(process.argv[3]||30),all=process.argv[4]==='all';
if(!dev){console.error('chybí KRYPTA_DEV_KEY');process.exit(1);}
const call=(fn,body)=>fetch(URL+fn,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify(body)}).then(async r=>{const t=await r.text();if(!r.ok)throw new Error(r.status+' '+t);return JSON.parse(t);});
(async()=>{const since=new Date(Date.now()-days*864e5).toISOString();
  if(what==='done'){console.log(await call('feedback_done',{p_key:dev,p_ids:(process.argv[3]||'').split(',').map(Number)}));return;}
  if(what==='runs'){const R=await call('runs_export',{p_key:dev,p_since:since});console.log(JSON.stringify(R));return;}
  const F=await call('feedback_export',{p_key:dev,p_since:since,p_open_only:!all});
  for(const f of F)console.log(['#'+f.id,f.created_at.slice(0,16).replace('T',' '),f.nick||'?',f.kind,f.rating?f.rating+'★':'',f.ver,f.lang,JSON.stringify(f.ctx)].join(' | ')+'\n  '+f.msg.replace(/\n/g,'\n  '));
  console.log(F.length+' zpráv');})().catch(e=>{console.error(e.message);process.exit(1);});
