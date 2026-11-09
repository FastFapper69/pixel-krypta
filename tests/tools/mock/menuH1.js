(()=>{const K=window.__krypta;K._ev("qTexInit()");K._ev(window.__PROPS);
 const st=document.getElementById('mStack');if(!st||document.getElementById('hub'))return;
 const it=[['mHero','armor','Vybavení',''],['mForge','anvil','Kovárna','new'],['mChest','chest','Obchod',''],['mQuest','board','Nástěnka','dot']];
 const hub=document.createElement('div');hub.id='hub';
 hub.innerHTML='<div class="floor"></div>'+it.map(([id,k,t,b])=>'<button class="prop p-'+k+'" data-go="'+id+'"><span class="glow"></span><img alt="" src="'+K._ev("dataUrl(HUBP."+k+")")+'"><b>'+t+'</b>'+(b==='new'?'<i class="pnew">Nové</i>':b==='dot'?'<i class="pdot"></i>':'')+'</button>').join('');
 st.querySelectorAll('.row2').forEach(r=>r.style.display='none');
 const coop=document.getElementById('mCoop');st.insertBefore(hub,coop);
 hub.querySelectorAll('.prop').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.go).click());
})();
