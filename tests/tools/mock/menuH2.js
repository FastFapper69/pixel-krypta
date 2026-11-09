(()=>{const K=window.__krypta;K._ev("qTexInit()");K._ev(window.__PROPS);
 const st=document.getElementById('mStack');if(!st||document.getElementById('cards2'))return;
 const it=[['mHero','armor','Vybavení',''],['mForge','anvil','Kovárna','new'],['mChest','chest','Obchod',''],['mQuest','board','Nástěnka','dot']];
 const g=document.createElement('div');g.id='cards2';
 g.innerHTML=it.map(([id,k,t,b])=>'<button class="arch a-'+k+'" data-go="'+id+'"><span class="door"></span><img alt="" src="'+K._ev("dataUrl(HUBP."+k+")")+'"><b>'+t+'</b>'+(b==='new'?'<i class="pnew">Nové</i>':b==='dot'?'<i class="pdot"></i>':'')+'</button>').join('');
 st.querySelectorAll('.row2').forEach(r=>r.style.display='none');st.insertBefore(g,document.getElementById('mCoop'));
})();
