// 12z1: milníky Kovárny (MILES) se propíšou do st, okno statistiky a přerozdělení bodů (vrácení, nic nezůstane). Snímky /tmp/kmil-*.png, /tmp/kres*-*.png
const L=require('./lib');(async()=>{
for(const lang of ['cs','en']){const o=await L.open({phone:'se',lang,save:'late'});const {p,E}=o;
 // milníky ve statistikách: dmg na 30, hp na 30
 await E("save.meta.dmg=30;save.meta.hp=20;save.meta.xp=20;persist()");
 await E("startRun(save.sel||'knight','hrbitov');");
 console.log(lang,await E("JSON.stringify({crit:st.crit,fuse:st.fuse,ms:st.ms,armor:st.armor})"));
 await E("run=null;state='menu';openMenu()");await p.waitForTimeout(400);
 await E("spotOff(true);renderShop();setState('shop');1");await p.waitForTimeout(900);
 await E("document.querySelector('#shopList .tn[data-id=\"dmg\"]').click()");await p.waitForTimeout(500);
 await p.screenshot({path:'/tmp/kmil-'+lang+'.png'});
 await E("$('#newsPop').hidden=true");
 const before=await E("JSON.stringify({c:save.coins,s:save.mats.shard,e:save.mats.ess,dmg:save.meta.dmg,rev:save.meta.revive,ma:save.meta.ma})");
 await E("document.querySelector('#treeRespec').scrollIntoView({block:'center'})");await p.waitForTimeout(300);
 await p.screenshot({path:'/tmp/kres-'+lang+'.png'});
 await E("document.querySelector('#treeRespec').click()");await p.waitForTimeout(400);
 await p.screenshot({path:'/tmp/kres2-'+lang+'.png'});
 await E("document.querySelector('#trYes').click()");await p.waitForTimeout(400);
 console.log(before,'->',await E("JSON.stringify({c:save.coins,s:save.mats.shard,e:save.mats.ess,dmg:save.meta.dmg,rev:save.meta.revive,ma:save.meta.ma,a1:save.meta.a1})"));
 console.log('errs',o.errs);await o.close();}})();
