// Příběh (11y): každé finále má zápis STORY, zápisy jsou krátké, prolog se ukáže jen novému hráči a je v Kronice.
// node pribeh.js [složka na snímky, výchozí /tmp/pribeh]
const L=require('./lib'),fs=require('fs');const OUT=process.argv[2]||'/tmp/pribeh',MAX=240;
(async()=>{L.prep();fs.mkdirSync(OUT,{recursive:true});let bad=0;const no=m=>{bad++;console.log('CHYBA: '+m);};
 for(const lang of ['cs','en']){
  const {p,E,errs,close}=await L.open({lang,phone:'se',save:'fresh',prolog:1});
  await p.waitForTimeout(500);const st=await E("({st:Object.fromEntries(Object.entries(STORY)),fin:CHAPTERS.map(C=>C.maps[C.maps.length-1]),vis:!!($('#featPop')&&!$('#featPop').hidden),h:$('#featPop')?$('#featPop').querySelector('small').textContent:''})");
  for(const f of st.fin)if(!st.st[f])no('finále '+f+' nemá STORY');
  for(const [k,t] of Object.entries(st.st)){const mx=lang==='en'?MAX*1.25:MAX;if(t.length>mx)no(lang+' STORY.'+k+' má '+t.length+' znaků (max '+mx+')');if(lang==='en'&&/[ěščřžýáíéůúťďň]/i.test(t))no('EN STORY.'+k+' není přeložené');}
  if(!st.vis)no(lang+': prolog se novému hráči neukázal');
  await p.waitForTimeout(700);await L.shot(p,OUT+'/prolog-'+lang+'.png');
  const of=await E("(()=>{const c=$('#featPop .fc'),r=c.getBoundingClientRect(),b=$('#fcOk').getBoundingClientRect();return{top:r.top,bot:r.bottom,bb:b.bottom,sw:c.scrollWidth>c.clientWidth+1,H:innerHeight}})()");
  if(of.top<0||of.bb>of.H)no(lang+': karta prologu přetéká '+JSON.stringify(of));
  await p.click('#fcOk');await p.waitForTimeout(400);if(await E("!$('#featPop').hidden"))no(lang+': prolog nejde zavřít');
  await E("openMenu();featShow()");await p.waitForTimeout(300);if(await E("!$('#featPop').hidden"))no(lang+': prolog se ukázal podruhé');
  await E("openCodex()");await p.waitForTimeout(500);if(!await E("!!$('#cxStory .kr')&&$('#cxStory .kr b').textContent.length>3"))no(lang+': prolog chybí v Kronice');
  await E("$('#cxStory').scrollIntoView()");await p.waitForTimeout(300);await L.shot(p,OUT+'/kronika-'+lang+'.png');
  for(const m of ['trun','nicota','korunace']){await E("openMenu();"+(m==='korunace'?"save.heroes=save.heroes||{};":"")+"storyShow('"+m+"')");await p.waitForTimeout(700);await L.shot(p,OUT+'/'+m+'-'+lang+'.png');
   const o2=await E("(()=>{const c=$('#featPop .fc'),r=c.getBoundingClientRect(),b=$('#fcOk').getBoundingClientRect();return{top:r.top,bb:b.bottom,H:innerHeight}})()");if(o2.top<0||o2.bb>o2.H)no(lang+': karta '+m+' přetéká '+JSON.stringify(o2));await E("$('#featPop').hidden=true");}
  if(errs.length)no(lang+' chyby: '+errs.join(' | '));await close();
  const B=await L.open({lang,phone:'se',save:'mid',prolog:1});await B.E("$('#featPop')&&($('#featPop').hidden=true);save.prolog=0;openMenu();featShow()");await B.p.waitForTimeout(300);if(await B.E("!save.prolog||!!($('#featPop')&&!$('#featPop').hidden)"))no(lang+': prolog se ukázal starému hráči');await B.close();}
 console.log(bad?'pribeh: '+bad+' chyb':'pribeh: OK');process.exit(bad?1:0);})();
