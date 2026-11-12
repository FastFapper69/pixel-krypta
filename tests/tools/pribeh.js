// Příběh (11y, 12d komiksy): každé finále má zápis STORY, zápisy jsou krátké, prolog (komiks) se ukáže jen novému hráči a je v Kronice.
// node pribeh.js [složka na snímky, výchozí /tmp/pribeh]
const L=require('./lib'),fs=require('fs');const OUT=process.argv[2]||'/tmp/pribeh',MAX=240;
(async()=>{L.prep();fs.mkdirSync(OUT,{recursive:true});let bad=0;const no=m=>{bad++;console.log('CHYBA: '+m);};
 for(const lang of ['cs','en']){
  const {p,E,errs,close}=await L.open({lang,phone:'se',save:'fresh',prolog:1});
  await p.waitForTimeout(500);const st=await E("({st:Object.fromEntries(Object.entries(STORY)),fin:CHAPTERS.map(C=>C.maps[C.maps.length-1]),vis:!!(CMX.cur&&CMX.cur.id==='prolog'&&!$('#comic').hidden)})");
  for(const f of st.fin)if(!st.st[f])no('finále '+f+' nemá STORY');
  for(const [k,t] of Object.entries(st.st)){const mx=lang==='en'?MAX*1.25:MAX;if(t.length>mx)no(lang+' STORY.'+k+' má '+t.length+' znaků (max '+mx+')');if(lang==='en'&&/[ěščřžýáíéůúťďň]/i.test(t))no('EN STORY.'+k+' není přeložené');}
  if(!st.vis)no(lang+': prolog se novému hráči neukázal');
  await p.waitForTimeout(700);await L.shot(p,OUT+'/prolog-'+lang+'.png');
  // 12d: the prologue is a comic (CMX); Skip closes it and the game goes on
  await p.click('#comic .cm-skip');await p.waitForTimeout(500);if(await E("!!CMX.cur||!$('#comic').hidden"))no(lang+': komiks prologu nejde zavřít');
  await E("openMenu();featShow()");await p.waitForTimeout(300);if(await E("!!CMX.cur"))no(lang+': prolog se ukázal podruhé');
  await E("openCodex()");await p.waitForTimeout(500);if(!await E("!!$('#cxStory .kr')&&$('#cxStory .kr b').textContent.length>3"))no(lang+': prolog chybí v Kronice');
  await E("$('#cxStory').scrollIntoView()");await p.waitForTimeout(300);await L.shot(p,OUT+'/kronika-'+lang+'.png');
  for(const m of ['trun','nicota','korunace']){await E("openMenu();"+(m==='korunace'?"save.heroes=save.heroes||{};":"")+"storyShow('"+m+"')");await p.waitForTimeout(700);
   if(!await E("!!CMX.cur&&CMX.cur.id==='"+m+"'"))no(lang+': po finále '+m+' se nepřehrál komiks');await E("CMX.cur&&(CMX.cur.T=CMX.cur.end-1)");await p.waitForTimeout(300);await L.shot(p,OUT+'/'+m+'-'+lang+'.png');
   await E("CMX.cur&&CMX.cur.finish()");await p.waitForTimeout(500);
   if(m==='korunace'){const o2=await E("(()=>{const c=$('#featPop .fc');if(!c)return null;const r=c.getBoundingClientRect(),b=$('#fcOk').getBoundingClientRect();return{top:r.top,bb:b.bottom,H:innerHeight,vis:!$('#featPop').hidden}})()");if(!o2||!o2.vis)no(lang+': po komiksu konce aktu chybí karta Paladina');else if(o2.top<0||o2.bb>o2.H)no(lang+': karta '+m+' přetéká '+JSON.stringify(o2));await E("$('#featPop').hidden=true");}
   else if(await E("state!=='select'"))no(lang+': po komiksu '+m+' se neotevřela další kapitola');}
  if(errs.length)no(lang+' chyby: '+errs.join(' | '));await close();
  const B=await L.open({lang,phone:'se',save:'mid',prolog:1});await B.E("CMX.cur&&CMX.cur.finish()");await B.p.waitForTimeout(500);await B.E("$('#featPop')&&($('#featPop').hidden=true);save.prolog=0;openMenu();featShow()");await B.p.waitForTimeout(300);if(await B.E("!save.prolog||!!CMX.cur"))no(lang+': prolog se ukázal starému hráči');await B.close();}
 console.log(bad?'pribeh: '+bad+' chyb':'pribeh: OK');process.exit(bad?1:0);})();
