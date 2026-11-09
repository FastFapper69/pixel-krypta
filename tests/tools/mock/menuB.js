(()=>{const K=window.__krypta;K._ev("qTexInit()");
 const R=document.documentElement.style,px=(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x,y,1,1)};
 const T=(w,h,fn,seed)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};fn(g,r,w,h);return 'url('+c.toDataURL()+')'};
 // weathered grey-green planks for signposts
 R.setProperty('--tx-sign',T(32,16,(g,r,w,h)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const b=y===0||y===8?'#1e2622':(Math.sin(x*.45+y*2.3)+r()*.8>1.1?'#56584a':'#4a4c40');px(g,x,y,b)}
   for(let i=0;i<6;i++){const x=(r()*w)|0,y=1+((r()*6)|0)+((r()*2)|0)*8;px(g,x,y,'#3a3c32');px(g,(x+1)%w,y,'#3a3c32')}for(let i=0;i<5;i++)px(g,(r()*w)|0,(r()*h)|0,'#6a7a4a')},5));
 R.setProperty('--tx-night',T(32,32,(g,r,w,h)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++)px(g,x,y,['#0d1615','#0f1918','#0c1413','#111c1a'][(r()*4)|0])},3));
 const h=document.querySelector(".logo");if(h)h.innerHTML="Pixel<br>Krypta";
 R.setProperty('--moon',T(40,40,(g,r,w,h)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const d=Math.hypot(x-19.5,y-19.5);if(d<17){const c=['#f2eed8','#e4e0c6','#d4d0b4'];let k=d<9?0:d<14?1:2;if(r()<.08)k=Math.min(2,k+1);px(g,x,y,c[k]);}}
 for(const [cx,cy,cr] of [[13,14,3],[24,22,4],[16,26,2],[25,11,2]])for(let y=-cr;y<=cr;y++)for(let x=-cr;x<=cr;x++)if(x*x+y*y<=cr*cr)px(g,cx+x,cy+y,'#c4c0a2');},9));
 const lb=document.querySelector('.logobox');if(lb&&!lb.querySelector('.moon')){const m=document.createElement('i');m.className='moon';lb.prepend(m);}
})();
