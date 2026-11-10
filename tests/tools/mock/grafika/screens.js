// Návrhy obrazovek v nové grafice. Běží uvnitř stránky hry, data bere ze hry přes __krypta._ev.
window.KMOCK=(()=>{
const E=x=>window.__krypta._ev(x),K=window.KIT;
const ico=k=>E("dataUrl(SPR.icon['"+k+"'])");
const I=(k,s)=>'<img alt="" class="ic" src="'+ico(k)+'"'+(s?' style="width:'+s+'px;height:'+s+'px"':'')+'>';
const pips=(lv,max)=>'<span class="pips">'+Array.from({length:max},(_,i)=>K.img(i<lv-1?'pipOn':i===lv-1?'pipNext':'pipOff')).join('')+'</span>';
const stat=a=>a.map(([v,l])=>'<b>'+v+'</b> '+l).join('<span class="k-sep"></span>');
function mount(html){let m=document.getElementById('kmock');if(m)m.remove();m=document.createElement('div');m.id='kmock';const ox=Math.floor((innerWidth-392)/4)*2;m.innerHTML='<div id="kstage" style="position:absolute;top:0;bottom:0;left:'+ox+'px;width:392px">'+html+'</div>';document.getElementById('app').appendChild(m);K.paint(m);return m;}
function card(c,i){return'<button class="k-card'+(c.sel?' sel':'')+'" data-k="card" data-s="'+i+'"'+(c.sel?' data-sel="1"':'')+(c.fuse?' data-fuse="1"':'')+' style="position:absolute;left:16px;top:'+c.y+'px">'+
  '<span class="sock" data-k="socket" data-s="'+i+'"'+(c.fuse?' data-bg="#1c1026"':'')+'>'+I(c.icon)+'</span>'+
  '<span class="nm'+(c.fuse?' vio':'')+'">'+c.name+'</span>'+
  (c.eq?'<span class="st k-eq" style="top:46px">'+I(c.eq[0],44)+K.img('plus')+I(c.eq[1],44)+'</span>':'<span class="st">'+stat(c.stats)+'</span>')+
  (c.isNew?'<span class="seal" data-k="seal" data-s="'+i+'">'+K.img('sealStar')+'</span>':c.max?pips(c.lv,c.max):'')+'</button>';}
function levelup(o){o=o||{};const W=k=>E("WEAPONS['"+k+"'].name"),P=k=>E("PASSIVES['"+k+"'].name");
  let cards=o.fuse?[
    {icon:'storm',name:W('storm'),fuse:1,eq:['bolt','lightning']},
    {icon:'blade',name:W('blade'),lv:3,max:6,stats:[['+1','Čepel'],['+2','Dosah']]},
    {icon:'haste',name:P('haste'),lv:2,max:5,stats:[['+8 %','Rychlost útoků']]}]:[
    {icon:'lightning',name:W('lightning'),isNew:1,stats:[['18','Poškození'],['1','Cíl']]},
    {icon:'blade',name:W('blade'),lv:3,max:6,stats:[['+1','Čepel'],['+2','Dosah']],sel:o.sel},
    {icon:'regen',name:P('regen'),lv:1,max:5,stats:[['+0,4','Zdraví/s']]}];
  if(o.en)cards=o.fuse?[{icon:'storm',name:W('storm'),fuse:1,eq:['bolt','lightning']},{icon:'blade',name:W('blade'),lv:3,max:6,stats:[['+1','Blade'],['+2','Range']]},{icon:'haste',name:P('haste'),lv:2,max:5,stats:[['+8%','Attack speed']]}]
    :[{icon:'lightning',name:W('lightning'),isNew:1,stats:[['18','Damage'],['1','Target']]},{icon:'blade',name:W('blade'),lv:3,max:6,stats:[['+1','Blade'],['+2','Range']],sel:o.sel},{icon:'regen',name:P('regen'),lv:1,max:5,stats:[['+0.4','Health/s']]}];
  const top=Math.round((innerHeight-(88+3*112))/2/2)*2+36;cards.forEach((c,i)=>c.y=top+88+i*112);
  const sp=(x,y,d)=>'<span class="k-abs" style="left:'+x+'px;top:'+(top+y)+'px;opacity:'+d+'">'+K.img('spark')+'</span>';
  return mount('<div class="k-dim"></div>'+sp(52,6,1)+sp(326,22,.8)+sp(84,44,.5)+sp(300,-12,.5)+
    '<div class="k-big k-abs" style="left:0;right:0;top:'+top+'px">'+(o.en?'Level up!':'Nová úroveň!')+'</div>'+
    '<div class="k-abs" data-k="gauge" data-g="time" data-v=".72" style="left:76px;top:'+(top+56)+'px;width:240px;height:16px"></div>'+
    cards.map(card).join(''));}
const A=(x,y,w,h,ex)=>'style="position:absolute;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px'+(ex?';'+ex:'')+'"';
function pause(o){o=o||{};const en=o.en,W=k=>E("WEAPONS['"+k+"'].name"),sat=SAT(),sab=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab'))||0,y0=sat-59,H=innerHeight;
  const rows=[{id:'blade',lv:3,p:'aura',u:'vortex',have:0},{id:'bolt',lv:5,p:'lightning',u:'storm',have:1},{id:'lightning',lv:2,p:'bolt',u:'storm',have:1},{id:'frost',lv:1,p:'arrows',u:'blizzard',have:0}];
  const pas=[['heart',2],['haste',1],['magnet',3],['regen',1]];
  const row=r=>'<div class="k-wrow"><span class="wi">'+I(r.id)+'</span><span class="wn">'+W(r.id)+'</span>'+pips(r.lv+1,6).replace('pipNext','pipOn')+
    '<span class="k-eq">'+K.img('plus')+'<span class="'+(r.have?'':'k-off')+'">'+I(r.p,44)+'</span>'+K.img('arrow')+'<span class="'+(r.have&&r.lv>=5?'':'k-off')+'">'+I(r.u,44)+'</span></span></div>';
  const tabs=en?['Gear','Hero','Quests']:['Výbava','Hrdina','Úkoly'];
  // spodní blok se kotví ke spodku, seznam zbraní zabere zbytek (na malém telefonu se posouvá)
  const by=H-Math.max(sab,12)-56-8,py=by-12-64,sy=py-12-48,bedY=y0+328,bedH=Math.min(256,Math.floor((sy-12-bedY)/2)*2);
  let h='<div class="k-dim"></div>';
  h+='<div data-k="chain" '+A(104,0,8,Math.ceil((y0+78)/2)*2)+'></div><div data-k="chain" '+A(280,0,8,Math.ceil((y0+78)/2)*2)+'></div>';
  h+='<div class="k-sign" data-k="sign" '+A(76,y0+72,240,64)+'>'+I('skull')+(en?'Paused':'Pauza')+'</div>';
  [['clock','03:12'],['up','5'],['skull','87']].forEach(([ic,v],i)=>{h+='<div class="k-tile" data-k="slab" data-m="slate" data-chip=".7" data-d="2" data-s="t'+i+'" '+A(16+i*124,y0+152,112,52)+'>'+K.img(ic)+v+'</div>';});
  h+='<div data-k="gauge" data-g="hp" data-v=".66" class="k-num" '+A(16,y0+216,360,28)+'>95/145</div>';
  h+='<div data-k="rod" '+A(12,y0+258,368,10)+'></div>';
  tabs.forEach((t,i)=>{h+='<div class="k-flag" data-k="flag" data-s="f'+i+'"'+(i===0?' data-on="1"':'')+' '+A(20+i*120,y0+266,112,i===0?52:44)+'>'+t+'</div>';});
  h+='<div data-k="bed" '+A(16,bedY,360,bedH,'padding-top:8px;overflow:hidden')+'>'+rows.map(row).join('')+'</div>';
  pas.forEach(([k,lv],i)=>{h+='<div class="k-ps" data-k="socket" data-m="slate" data-s="p'+i+'" style="left:'+(16+i*56)+'px;top:'+sy+'px">'+I(k)+'<b>'+lv+'</b></div>';});
  h+='<button class="k-btn" data-k="btn" data-m="gold" '+A(16,py,360,64)+'>'+(en?'Continue':'Pokračovat')+'</button>';
  h+='<button class="k-ibtn" data-k="btn" data-m="slate" data-s="g" '+A(16,by,56,56)+'>'+K.img('gear')+'</button>';
  h+='<button class="k-btn" data-k="btn" data-m="danger" '+A(84,by,292,56)+'>'+(en?'Quit run':'Ukončit běh')+'</button>';
  return mount(h);}
const SAT=()=>parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat'))||0;
const CLS=['cSword','cWand','cHammer','cHarp','cBow'];
// inventář: mřížka lůžek 6 na řádek, prázdná lůžka zůstávají vidět
function grid(inv,gy,rows,hot){let h='<div data-k="bed" data-bg="#17191d" '+A(16,gy,360,rows*60+12)+'></div>';
  for(let i=0;i<rows*6;i++){const it=inv[i],x=22+(i%6)*58,yy=gy+8+Math.floor(i/6)*60;
   h+='<div class="k-slot'+(it&&hot&&hot(it)?' hot':'')+'" data-k="socket" data-s="i'+i+'"'+(it?' data-rar="'+K.RAR[it.r]+'"':' data-bg="#121316"')+' style="left:'+x+'px;top:'+yy+'px">'+(it?'<img alt="" class="it" src="'+it.src+'"><span class="cls">'+K.img(CLS[i%5])+'</span>':'')+'</div>';}
  return h;}
function head(title,y){const cur=E("JSON.stringify([save.coins,save.mats.shard,save.mats.ess])");const [g,sh,es]=JSON.parse(cur);
  document.querySelectorAll('#app .scr').forEach(e=>e.style.visibility='hidden');return'<div class="k-dim" style="background:#0a090cd8"></div>'+
   '<button class="k-ibtn" data-k="btn" data-m="slate" data-s="bk" '+A(16,y+6,44,44)+'>'+K.img('back')+'</button>'+
   '<div class="k-title" style="left:72px;top:'+(y+6)+'px">'+title+'</div>'+
   '<button class="k-ibtn" data-k="btn" data-m="slate" data-s="hp" '+A(332,y+6,44,44)+'>'+K.img('help')+'</button>'+
   '<div class="k-cur" style="left:18px;top:'+(y+62)+'px"><span>'+K.img('coin')+g+'</span><span>'+K.img('shard')+sh+'</span><span>'+K.img('ess')+es+'</span></div>';}
function shop(o){o=o||{};const en=o.en,y=SAT()+4,RC=K.RAR;
  const ch=JSON.parse(E("JSON.stringify(ECON.chests.map(C=>({id:C.id,name:C.name,cost:{gold:C.cost},odds:C.odds,pity:C.pity?{r:C.pity.r,n:C.pity.n-(save.pity[C.id]||0)}:null,lim:CH_LIMIT[C.id]?[chLeft(C.id),CH_LIMIT[C.id]]:null})).concat([{id:'tower',name:_t('Stavitelova bedna'),cost:TW_CHEST_COST,odds:TW_CHEST.odds,pity:{r:TW_CHEST.pity.r,n:TW_CHEST.pity.n-(save.pity.tower||0)},lim:[chLeft('tower'),CH_LIMIT.tower]},{id:'pet',name:_t('Kouzelný košík'),cost:PET_CHEST.cost,odds:PET_CHEST.odds,pity:{r:PET_CHEST.pity.r,n:PET_CHEST.pity.n-(save.pity.pet||0)},lim:[chLeft('pet'),CH_LIMIT.pet]}]))"));
  const rows=[{id:'wood',name:en?'Daily chest':'Denní truhla',free:1,lim:[1,1]}].concat(ch);
  let h=head(en?'Shop':'Obchod',y)+'<div data-k="awning" '+A(8,y+92,378,28)+'></div>';
  rows.forEach((C,i)=>{const yy=y+126+i*98,two=C.cost&&Object.keys(C.cost).length>1;
   h+='<div class="k-chest" data-k="shelf" data-s="c'+i+'" style="top:'+yy+'px;height:92px">'+
    '<img alt="" class="ci" src="'+ico('chest_'+C.id)+'">'+'<span class="cn">'+C.name+'</span>'+
    (C.odds?'<span class="od">'+C.odds.map((v,r)=>v?'<span style="color:'+RC[r]+'">'+v+'</span>':'').join('')+'<span class="mut">%</span></span>':'')+
    '<span class="bd"'+(C.odds?'':' style="top:46px"')+'>'+(C.pity?'<span>'+K.img('hour')+K.img('gem',RC[C.pity.r])+C.pity.n+'</span>':'')+(C.lim?'<span>'+K.img('sun')+C.lim[0]+'/'+C.lim[1]+'</span>':'')+'</span>'+
    (C.free?'<button class="k-btn sm" data-k="btn" data-m="gold" data-s="o" '+A(246,34,104,48)+'>'+(en?'Open':'Otevřít')+'</button>'
      :'<button class="k-tag" data-k="slab" data-m="parch" data-s="p'+i+'" style="width:'+(two?124:84)+'px"><span>'+K.img('coin')+C.cost.gold+'</span>'+(two?'<span>'+K.img('shard')+C.cost.shard+'</span>':'')+'</button>')+'</div>';});
  return mount(h);}
function forge(o){o=o||{};const en=o.en,y=SAT()+4,RC=K.RAR;
  const inv=JSON.parse(E("JSON.stringify(save.inv.slice(0,12).map(i=>({r:i.r,s:i.s,src:itIcon(i)})))"));
  const fill=o.fill,tabs=en?['Forge','Runes','Upgrades']:['Kování','Runy','Vylepšení'],cls=['cSword','cWand','cHammer','cHarp','cBow'];
  let h=head(en?'Smithy':'Kovárna',y);
  h+='<div data-k="rod" '+A(12,y+92,368,10)+'></div>';
  tabs.forEach((t,i)=>{h+='<div class="k-flag" data-k="flag" data-s="f'+i+'"'+(i===0?' data-on="1"':'')+' '+A(20+i*120,y+100,112,i===0?52:44)+'>'+t+'</div>';});
  const sy=y+176;h+='<div data-k="forge" '+(fill?'data-lit="1" ':'')+A(16,sy,360,180)+'></div>';
  const same=inv.filter(i=>i.r===inv[0].r).slice(0,3);
  [0,1,2].forEach(i=>{const it=fill?inv[0]:null;h+='<div class="k-slot" data-k="socket" data-s="a'+i+'"'+(it?' data-rar="'+RC[it.r]+'"':'')+' style="left:'+(52+i*116)+'px;top:'+(sy+4)+'px">'+(it?'<img alt="" class="it" src="'+it.src+'">':'')+'</div>';});
  if(fill)h+='<div class="k-slot" data-k="socket" data-rar="'+RC[Math.min(4,inv[0].r+1)]+'" data-s="res" style="left:168px;top:'+(sy+90)+'px"><span class="t40 sh" style="color:'+RC[Math.min(4,inv[0].r+1)]+'">?</span></div><button class="k-btn" data-k="btn" data-m="gold" '+A(16,sy+192,360,64)+'>'+(en?'Merge':'Sloučit')+'</button>';
  else h+='<div class="k-hint" style="top:'+(sy+192)+'px">'+(en?'Pick 3 items':'Vyber 3 předměty')+'</div>';
  const gy=sy+(fill?272:228),rows=Math.floor((innerHeight-34-gy-12)/60);h+=grid(fill?inv.slice(1):inv,gy,rows,i=>!fill&&i.r===inv[0].r);
  return mount(h);}
function hero(o){o=o||{};const en=o.en,y=SAT()+4,RC=K.RAR;
  const inv=JSON.parse(E("JSON.stringify(save.inv.slice(0,12).map(i=>({r:i.r,s:i.s,src:itIcon(i)})))"));
  const sil=JSON.parse(E("JSON.stringify(SLOT_IDS.map(s=>[s,dataUrl(itemSpr(s,0))]))")),hs=E("dataUrl(SPR.hero.knight)"),hn=E("HEROES.knight.name");
  const tabs=en?['Hero','Towers','Pets']:['Hrdina','Věže','Mazlíčci'];
  let h=head(en?'Loadout':'Vybavení',y);
  h+='<div data-k="rod" '+A(12,y+92,368,10)+'></div>';
  tabs.forEach((t,i)=>{h+='<div class="k-flag" data-k="flag" data-s="f'+i+'"'+(i===0?' data-on="1"':'')+' '+A(20+i*120,y+100,112,i===0?52:44)+'>'+t+'</div>';});
  const py=y+164;h+='<div data-k="slab" data-m="dark" data-d="0" data-ph="12" '+A(16,py,360,196)+'></div>';
  const eq={helm:inv.find(i=>i.s==='helm'),boots:inv.find(i=>i.s==='boots'),gloves:inv.find(i=>i.s==='gloves')};
  sil.forEach(([s,src],i)=>{const it=eq[s],x=i<3?28:308,yy=py+10+(i%3)*60;h+='<div class="k-slot" data-k="socket" data-m="oak" data-s="e'+i+'"'+(it?' data-rar="'+RC[it.r]+'"':'')+' style="left:'+x+'px;top:'+yy+'px">'+(it?'<img alt="" class="it" src="'+it.src+'">':'<img alt="" class="it sil" src="'+src+'">')+'</div>';});
  const hz=JSON.parse(E("JSON.stringify([SPR.hero.knight.c.width,SPR.hero.knight.c.height])"));h+='<img alt="" src="'+hs+'" style="position:absolute;left:'+(196-hz[0])+'px;top:'+(py+118-hz[1]*2)+'px;width:'+hz[0]*2+'px;height:'+hz[1]*2+'px">';
  h+='<div class="t30 gold sh" style="position:absolute;left:96px;right:96px;top:'+(py+124)+'px;text-align:center">'+hn+'</div>';
  h+='<div class="k-lv" data-k="gauge" data-g="xp" data-v=".3" '+A(104,py+160,184,24)+'>12/40</div>';
  const st=en?[['heart','Health','145'],['cSword','Damage','+12 %'],['cHammer','Armor','2']]:[['heart','Zdraví','145'],['cSword','Poškození','+12 %'],['cHammer','Brnění','2']];
  const sy=py+208;h+='<div data-k="bed" '+A(16,sy,360,96)+'></div>';
  st.forEach(([ic,n,v],i)=>{h+='<div class="k-statrow" style="top:'+(sy+6+i*28)+'px">'+K.img(ic)+n+'<b>'+v+'</b></div>';});
  const gy=sy+108,rows=Math.floor((innerHeight-34-gy-12)/60);h+=grid(inv.filter(i=>!Object.values(eq).includes(i)),gy,rows);
  return mount(h);}
return{mount,levelup,pause,shop,forge,hero,head,A,I,ico,stat,pips};})();
