// 12j: pečeť Nástěnky v menu svítí jen tehdy, když je na Nástěnce opravdu co vyzvednout a hráč to vidí (i týdenní svíčky při zamčeném Týdnu).
const L=require('./lib');(async()=>{L.prep();const {p,E,errs,close}=await L.open({phone:'15',save:'mid'});let bad=0;const no=m=>{bad++;console.log('CHYBA: '+m);};
 const st=async(setup)=>E(`(()=>{featInit();save.feat=save.feat||{};save.feat.quests=1;delete save.feat.contracts;delete save.feat.weekly;const Q=qEnsure();Q.q.forEach(q=>{q.cl=qStars(q);});Q.ms=[1,1,1];Q.w.st=0;save.qw.ms=[1,1,1];${setup};openMenu();refreshMenu&&refreshMenu();
   const seal=$('#mQuest').classList.contains('has');openQuests();renderQuests();const btn=[...document.querySelectorAll('#qBody [data-ms],#qBody [data-kc],#qBody #qWClaim,#qBody [data-claim]')].some(b=>!b.disabled&&b.offsetParent&&!b.classList.contains('got')&&!b.closest('.done'));
   return {seal,ms:[...document.querySelectorAll('#qBody [data-ms]')].map(b=>b.dataset.ms+':'+b.className).join(' ')};})()`);
 const a=await st("save.qw.c=12;save.qw.ms=[0,0,0]");await p.waitForTimeout(400);await E("(()=>{const s=document.querySelectorAll('#qBody .sec');const l=s[s.length-1];l&&l.scrollIntoView({block:'center'});})()");await p.waitForTimeout(300);await L.shot(p,'/tmp/boardseal.png');
 if(!a.seal)no('týdenní svíčky splněné, ale pečeť nesvítí');if(!/1,0/.test(a.ms))no('týdenní svíčky nejsou vidět na záložce Dnes při zamčeném Týdnu: '+a.ms);
 const b=await st("save.qw.c=0");if(b.seal)no('nic k vyzvednutí, ale pečeť svítí');

 if(errs.length)no('chyby JS '+errs.join(' | '));console.log(bad?'boardseal: '+bad+' chyb':'boardseal: OK');await close();process.exit(bad?1:0);})();
