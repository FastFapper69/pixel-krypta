// textures for direction A (warm carved stone, soot) + sentence case labels
(()=>{const K=window.__krypta;K._ev("qTexInit()");
 const R=document.documentElement.style,px=(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x,y,1,1)};
 const T=(w,h,fn,seed)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};fn(g,r,w,h);return 'url('+c.toDataURL()+')'};
 R.setProperty('--tx-wst',T(32,32,(g,r,w,h)=>{const P=['#3d352e','#433a32','#38302a','#4a4037'];for(let y=0;y<h;y++)for(let x=0;x<w;x++)px(g,x,y,P[(r()*4)|0]);
   for(let i=0;i<4;i++){let x=(r()*w)|0,y=(r()*h)|0;for(let k=0;k<7;k++){px(g,x,y,'#2a231e');x+=r()<.5?1:0;y+=1}}for(let i=0;i<12;i++)px(g,(r()*w)|0,(r()*h)|0,'#574b40')},7));
 R.setProperty('--tx-soot',T(32,32,(g,r,w,h)=>{for(let y=0;y<h;y++){const row=y>>3,off=row&1?8:0;for(let x=0;x<w;x++){const m=y%8===7||(x+off)%16===15;px(g,x,y,m?'#0d0907':['#1b1410','#1e1612','#191310','#211814'][(r()*4)|0])}}},11));
const h=document.querySelector(".logo");if(h)h.innerHTML="Pixel<br>Krypta";
})();
