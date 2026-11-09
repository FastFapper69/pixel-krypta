const {chromium}=require('playwright');
const ALL={hero:"openHero()",towers:"openTowers()",pets:"openPets()",chests:"openChestShop()",forge:"openForge()",master:"openMaster()",codex:"openCodex()"};
const MID="save.coins=6000;save.mats.shard=900;save.mats.ess=40;save.stats=save.stats||{};save.stats.runs=30;save.cleared=save.cleared||{};for(const C of CHAPTERS.slice(0,4))for(const m of C.maps)save.cleared[m]=true;save.fin={trun:1};for(let i=0;i<10;i++)addItem(makeItem(i%4));twInit();petInit();try{featCheck()}catch(e){};persist();";
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(600);
 const E=x=>p.evaluate(x=>window.__krypta._ev(x),x);await E("save.sound=false;save.music=false;save.tut=1;"+MID);
 for(const k of (process.argv[2]||Object.keys(ALL).join(',')).split(',')){await E("openMenu();"+ALL[k]);await p.waitForTimeout(300);
  const s=await p.evaluate(k=>{const id={hero:'hero',towers:'towers',pets:'pets',chests:'chests',forge:'forge',master:'master',codex:'codex'}[k];
   const walk=(n,d)=>{if(d>7)return '';let o='';for(const c of n.children){if(c.tagName==='svg')continue;const cl=c.className&&typeof c.className==='string'?'.'+c.className.trim().split(/\s+/).join('.'):'';
     o+=' '.repeat(d)+c.tagName.toLowerCase()+(c.id?'#'+c.id:'')+cl+'\n'+walk(c,d+1);}return o;};
   const lines=walk(document.getElementById('scr-'+id),0).split('\n');const seen={};return lines.filter(l=>{const t=l.trim();seen[l]=(seen[l]||0)+1;return seen[l]<=2;}).join('\n');},k);
  console.log('=== '+k+'\n'+s.slice(0,2500));}
 await b.close();})();
