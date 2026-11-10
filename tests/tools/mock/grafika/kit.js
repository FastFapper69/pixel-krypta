// Stavebnice nové grafiky UI (návrh, viz docs/GRAFIKA.md). 1 pixel kresby = 2 CSS px.
// Každý prvek s data-k="druh" dostane vlastní pixelovou kresbu podle své velikosti (žádné natahování textur).
window.KIT=(()=>{
const U=2;
const rng=s=>{let a=s>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};};
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const PAL={
 gold:{hi:'#fff3b0',l:'#ffd75e',b:'#f2b632',d:'#c8861c',dd:'#8f5a12',o:'#3a2208'},
 slate:{hi:'#8f8c85',l:'#6f6c67',b:'#575550',d:'#3d3c39',dd:'#2a2927',o:'#111010'},
 rune:{hi:'#7f8b96',l:'#5d6872',b:'#47515b',d:'#333b43',dd:'#22282e',o:'#0b0e11'},
 oak:{hi:'#b07a40',l:'#8f5e30',b:'#734824',d:'#523218',dd:'#371f0e',o:'#170c05'},
 dark:{hi:'#6e4a2a',l:'#573820',b:'#432a17',d:'#301d0f',dd:'#201309',o:'#0d0704'},
 danger:{hi:'#b85c4e',l:'#963f35',b:'#742b25',d:'#501c19',dd:'#361110',o:'#150606'},
 bronze:{hi:'#f0c078',l:'#d49a52',b:'#a8703a',d:'#7a4e26',dd:'#523216',o:'#22140a'},
 parch:{hi:'#f8efcf',l:'#eddfb6',b:'#dfcb98',d:'#bfa46c',dd:'#927647',o:'#4a371c'},
 iron:{hi:'#a3a7ad',l:'#787c84',b:'#565a61',d:'#3a3d43',dd:'#25272b',o:'#0e0f11'},
 red:{hi:'#e2655a',l:'#c5413a',b:'#a02c29',d:'#761d1d',dd:'#501214',o:'#1c0607'},
 grey:{hi:'#8a8378',l:'#716a60',b:'#5a544c',d:'#433e38',dd:'#2f2b27',o:'#12100e'},
 moss:{hi:'#8cc468',l:'#5fa046',b:'#3d7434',d:'#26502a',dd:'#18351e',o:'#0a160c'},
 violet:{hi:'#d9a8f2',l:'#b06ad8',b:'#7d44a8',d:'#552d78',dd:'#371c50',o:'#150a20'}};
const RAR=['#b9b4aa','#6fce5e','#5aa8f0','#c479ea','#ffc940'];
function buf(w,h){const d=new Array(w*h).fill(null);return{w,h,d,set(x,y,c){if(x>=0&&y>=0&&x<w&&y<h)d[y*w+x]=c;},get(x,y){return x>=0&&y>=0&&x<w&&y<h?d[y*w+x]:null;}};}
function toCanvas(b){const c=document.createElement('canvas');c.width=b.w;c.height=b.h;const g=c.getContext('2d');for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){const v=b.d[y*b.w+x];if(v){g.fillStyle=v;g.fillRect(x,y,1,1);}}return c;}
// obrys desky: pixelové rohy, u kamene oštípané rohy a zuby v hranách
function mkMask(w,h,R,o){const M=new Uint8Array(w*h).fill(1),off=(x,y)=>{if(x>=0&&y>=0&&x<w&&y<h)M[y*w+x]=0;};
 const corner=(cx,cy,dx,dy)=>{let a,b;if(o.chip){a=1+(R()*3|0);b=1+(R()*3|0);}else a=b=o.cut==null?2:o.cut;
  for(let i=0;i<a;i++){const n=Math.ceil(b*(a-i)/a);for(let j=0;j<n;j++)off(cx+dx*j,cy+dy*i);}};
 corner(0,0,1,1);corner(w-1,0,-1,1);corner(0,h-1,1,-1);corner(w-1,h-1,-1,-1);
 if(o.chip){const n=Math.round(w/34*o.chip);for(let i=0;i<n;i++){const top=R()<.5,x=5+(R()*(w-12)|0),l=2+(R()*3|0);for(let j=0;j<l;j++)off(x+j,top?0:h-1);}
  const m=Math.round(h/30*o.chip);for(let i=0;i<m;i++){const left=R()<.5,y=5+(R()*(h-12)|0),l=1+(R()*2|0);for(let j=0;j<l;j++)off(left?0:w-1,y+j);}}
 if(o.torn){for(let x=2;x<w-2;x++){if(R()<.22)off(x,0);if(R()<.22)off(x,h-1);}for(let y=2;y<h-2;y++){if(R()<.18)off(0,y);if(R()<.18)off(w-1,y);}}
 return M;}
// deska s tloušťkou: horní plocha, zkosení, spodní stěna, obrys
function slab(w,h,P,seed,o={}){const R=rng(seed),M=mkMask(w,h,R,o),D=o.depth==null?3:o.depth,B=buf(w,h);
 const m=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&M[y*w+x]===1;
 const edge=(x,y)=>m(x,y)&&!(m(x-1,y)&&m(x+1,y)&&m(x,y-1)&&m(x,y+1));
 const ins=(x,y)=>m(x,y)&&!edge(x,y);
 const face=(x,y)=>ins(x,y)&&ins(x,y+D);
 const inner=(x,y)=>face(x,y)&&face(x-1,y)&&face(x+1,y)&&face(x,y-1)&&face(x,y+1);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!m(x,y))continue;
  if(edge(x,y)){B.set(x,y,o.rim||P.o);continue;}
  if(face(x,y)){let c=P.b;if(!face(x,y-1))c=P.hi;else if(!face(x-1,y))c=P.l;else if(!face(x,y+1))c=P.d;else if(!face(x+1,y))c=P.d;B.set(x,y,c);}
  else B.set(x,y,face(x,y-1)?P.d:P.dd);}
 if(o.tex)o.tex(B,inner,R,P,w,h,D);
 B.face=face;B.inner=inner;B.m=m;return B;}
function texStone(B,inner,R,P,w,h){const n=w*h;
 for(let i=0;i<n*.05;i++){const x=R()*w|0,y=R()*h|0;if(inner(x,y))B.set(x,y,R()<.5?P.l:P.d);}
 for(let i=0;i<n/150;i++){const x=R()*w|0,y=R()*h|0,l=3+(R()*7|0),c=R()<.5?P.l:P.d;for(let j=0;j<l;j++)if(inner(x+j,y))B.set(x+j,y,c);}
 const k=Math.max(1,Math.round(n/2400));for(let i=0;i<k;i++){let x=R()<.5?2:w-3,y=4+(R()*(h-10)|0);const dx=x<w/2?1:-1,l=5+(R()*10|0);
  for(let j=0;j<l;j++){if(inner(x,y)){B.set(x,y,P.dd);if(inner(x,y+1))B.set(x,y+1,P.l);}x+=dx;if(R()<.45)y+=R()<.5?1:-1;}}}
function texGold(B,inner,R,P,w,h,D){const fh=h-D-2;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!inner(x,y))continue;const t=(y-1)/fh;
  B.set(x,y,t<.36?P.l:t<.46?((x+y)&1?P.l:P.b):t<.78?P.b:t<.88?((x+y)&1?P.b:P.d):P.d);}
 // vytepaná linka uvnitř
 if(fh>=14&&w>=40){const a=3,x0=a,x1=w-1-a,y0=a,y1=h-D-1-a;for(let x=x0+1;x<x1;x++){B.set(x,y0,P.d);B.set(x,y1,P.hi);}for(let y=y0+1;y<y1;y++){B.set(x0,y,P.d);B.set(x1,y,P.hi);}}
 // odlesk
 const sx=Math.round(w*.2);for(let y=1;y<fh*.5;y++){for(const k of [0,1,4]){const x=sx-y+k;if(inner(x,y))B.set(x,y,P.hi);}}}
function texOak(B,inner,R,P,w,h,D,ph){ph=ph||8;const fh=h-D;
 for(let y=0;y<fh;y++){const row=Math.floor(y/ph),gap=y%ph===ph-1,base=row%2?P.b:mix(P.b,P.l,.35);
  for(let x=0;x<w;x++){if(!inner(x,y))continue;B.set(x,y,gap?P.dd:(y%ph===0&&y>0)?P.l:base);}}
 const n=Math.round(w*fh/26);for(let i=0;i<n;i++){const y=R()*fh|0;if(y%ph===ph-1)continue;let x=R()*w|0;const l=4+(R()*12|0),c=R()<.7?P.d:P.l;for(let j=0;j<l;j++)if(inner(x+j,y)&&y%ph!==0)B.set(x+j,y,c);}
 const kn=Math.round(w*fh/1400);for(let i=0;i<kn;i++){const x=6+(R()*(w-12)|0),y=2+(R()*(fh-5)|0);if(y%ph>=ph-3||y%ph<1)continue;for(const [a,b,c] of [[0,0,P.dd],[1,0,P.dd],[-1,0,P.d],[2,0,P.d],[0,-1,P.d],[1,-1,P.d],[0,1,P.d],[1,1,P.d]])if(inner(x+a,y+b))B.set(x+a,y+b,c);}}
function texParch(B,inner,R,P,w,h){for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!inner(x,y))continue;const e=Math.min(x,y,w-1-x,h-1-y);B.set(x,y,e<3?((x+y)&1?P.b:P.l):P.l);}
 const n=w*h;for(let i=0;i<n*.03;i++){const x=R()*w|0,y=R()*h|0;if(inner(x,y))B.set(x,y,R()<.6?P.b:P.hi);}
 for(let i=0;i<n/900;i++){const cx=R()*w|0,cy=R()*h|0,r=2+(R()*3|0);for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r&&inner(cx+x,cy+y)&&((x+y)&1))B.set(cx+x,cy+y,P.b);}}
function mix(a,b,t){const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),A=p(a),Bc=p(b);return'#'+A.map((v,i)=>Math.round(v+(Bc[i]-v)*t).toString(16).padStart(2,'0')).join('');}
// vytesané runy (karty nové úrovně); vybraná karta je rozsvítí
const RUNES=[['#...#','#..#.','#.#..','##...','#.#..','#..#.','#...#'],['..#..','.###.','#.#.#','..#..','..#..','..#..','..#..'],['#...#','#...#','.#.#.','..#..','..#..','..#..','..#..'],
 ['#....','##...','#.#..','#..#.','#.#..','##...','#....'],['#...#','##.##','#.#.#','#...#','#...#','#...#','#...#'],['..#..','.#.#.','#...#','.#.#.','..#..','.#.#.','#...#'],['#....','#.#..','#..#.','#.#..','##...','#.#..','#..#.']];
function runes(B,x0,y0,n,R,P,glow){for(let i=0;i<n;i++){const G=RUNES[R()*RUNES.length|0],x=x0+i*8;
  for(let y=0;y<7;y++)for(let c=0;c<5;c++)if(G[y][c]==='#'){B.set(x+c,y0+y,glow||P.dd);if(!glow&&(y===6||G[y+1][c]!=='#')&&B.inner(x+c,y0+y+1))B.set(x+c,y0+y+1,P.hi);}}}
// vyhloubené lůžko pro ikonu
function socket(w,h,P,seed,o={}){const B=buf(w,h),R=rng(seed),bg=o.bg||'#14161a';
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=Math.min(x,y,w-1-x,h-1-y);
  if((x===0||x===w-1)&&(y===0||y===h-1))continue;
  if(e===0)B.set(x,y,(y===0||x===0)?P.dd:P.hi);
  else if(e===1)B.set(x,y,P.o);
  else if(y===2||x===2)B.set(x,y,mix(bg,'#000000',.45));
  else B.set(x,y,R()<.06?mix(bg,'#ffffff',.06):bg);}
 if(o.rar){for(let x=2;x<w-2;x++){B.set(x,1,o.rar);B.set(x,h-2,mix(o.rar,'#000000',.35));}for(let y=2;y<h-2;y++){B.set(1,y,o.rar);B.set(w-2,y,mix(o.rar,'#000000',.35));}}
 return B;}
// koryto s tekutinou (HP, XP, čas, postup)
const LIQ={hp:['#ff8a78','#e2453a','#a81f1c','#5c0f10'],xp:['#b8ecff','#62c8f0','#2f8fd0','#17507e'],time:['#fff3b0','#ffd75e','#d9981f','#7a4c0c'],goal:['#c8f59a','#76c84e','#3f8a34','#1f4d22']};
function gauge(w,h,kind,frac,seed){const B=buf(w,h),P=PAL.slate,L=LIQ[kind]||LIQ.hp,R=rng(seed);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=Math.min(x,y,w-1-x,h-1-y);if((x===0||x===w-1)&&(y===0||y===h-1))continue;
  B.set(x,y,e===0?((y===0||x===0)?P.dd:P.l):e===1?P.o:'#0b0c0e');}
 const iw=w-4,fw=Math.round(iw*Math.max(0,Math.min(1,frac)));
 for(let x=0;x<fw;x++)for(let y=2;y<h-2;y++){const t=y-2,n=h-4;let c=L[1];if(t===0)c=L[0];else if(t>=n-1)c=L[3];else if(t>=n-2-(n>6?1:0))c=L[2];
  if(x===fw-1&&fw<iw)c=L[0];B.set(x+2,y,c);}
 if(h>=8)for(let i=0;i<fw/9;i++){const x=2+(R()*Math.max(1,fw-3)|0),y=4+(R()*Math.max(1,h-8)|0);B.set(x,y,L[0]);}
 return B;}
// prapor na tyči (záložky)
function flag(w,h,P,seed,o={}){const B=buf(w,h),R=rng(seed),ph=R()*6,cx=(w-1)/2;
 for(let x=0;x<w;x++){const notch=Math.max(0,7-Math.round(Math.abs(x-cx)*.55)),yb=h-1-notch;
  const f=Math.sin(x/w*Math.PI*1.7+ph);
  for(let y=0;y<=yb;y++){let c=f>.75?P.l:f<-.75?P.d:P.b;if(y<2)c=P.dd;else if(y===2)c=P.d;
   if(x===0||x===w-1||y===yb)c=P.o;else if(x===1)c=P.l;else if(x===w-2)c=P.d;
   if(o.trim&&(y===yb-3||y===yb-2)&&x>1&&x<w-2)c=y===yb-3?o.trim:mix(o.trim,'#000000',.4);
   B.set(x,y,c);}
  if(x%4===1)B.set(x,1,P.l);}
 return B;}
// markýza stánku
function awning(w,h){const B=buf(w,h),A=PAL.red,C={hi:'#fff8e0',l:'#f1e6c4',b:'#d9c9a0',d:'#a8946a',o:'#3a2a16'};
 for(let x=0;x<w;x++){const st=Math.floor(x/9),P=st%2?C:A,lx=x%9,sc=h-1-(lx===0||lx===8?3:lx===1||lx===7?1:0);
  for(let y=0;y<=sc;y++){let c=y<2?PAL.oak.d:y===2?PAL.oak.o:y===3?P.hi||P.l:y>sc-3?P.d:P.b;if(y===sc)c=P.o;if((lx===0)&&y>2)c=P.d;if(P===A&&y>3&&y<=sc-3&&lx===1)c=A.l;B.set(x,y,c);}}
 return B;}
// police: tmavá zadní stěna, dole prkno
function shelf(w,h,seed){const B=buf(w,h),R=rng(seed),D=PAL.dark,O=PAL.oak;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if((x===0||x===w-1)&&(y===0||y===h-1))continue;const e=Math.min(x,y,w-1-x,h-1-y);
  let c=x%14===13?D.dd:(x%14===0?D.l:D.b);if(e===0)c=D.o;else if(y===1)c=D.dd;
  const by=h-1-y;if(by<7&&e>0)c=by===6?O.hi:by===5?O.l:by>=3?O.b:by===2?O.d:O.dd;B.set(x,y,c);}
 for(let i=0;i<w*h/40;i++){const x=1+(R()*(w-2)|0),y=2+(R()*(h-10)|0),l=2+(R()*5|0);if(x%14===13||x%14===0)continue;for(let j=0;j<l;j++)if(y+j<h-8)B.set(x,y+j,R()<.6?D.d:D.l);}
 for(let i=0;i<w/5;i++){const x=2+(R()*(w-8)|0),l=3+(R()*8|0);for(let j=0;j<l;j++)B.set(x+j,h-4,O.d);}
 return B;}
// kovárna: tři oltáře, žlábky a kovadlina
function forgeScene(w,h,seed,lit){const B=buf(w,h),R=rng(seed),P=PAL.rune,G=lit?'#fff3b0':'#9fe6f5',Gm=lit?'#ffd75e':'#4fb4cc',Gd=lit?'#8f5a12':'#1f4a5a';
 const ped=cx=>{for(let y=0;y<12;y++){const hw=y<3?19:y<9?15:18;for(let x=-hw;x<=hw;x++){let c=y===0?P.hi:y<3?P.l:y<9?P.b:y===9?P.hi:P.d;if(x===-hw||x===hw||y===11||y===2)c=P.o;else if(y>2&&y<9&&(x===-hw+1))c=P.l;else if(y>2&&y<9&&x===hw-1)c=P.d;else if(y>2&&y<9&&R()<.1)c=P.d;B.set(cx+x,32+y,c);}}};
 const xs=[Math.round(w/2)-58,Math.round(w/2),Math.round(w/2)+58],mid=xs[1];
 const gr=(x,y,ver)=>{for(let k=-1;k<=2;k++){const X=ver?x+k:x,Y=ver?y:y+k;B.set(X,Y,(k===-1||k===2)?'#0b0e11':((x+y)%4===0?G:(x+y)%4===2?Gm:Gd));}};
 xs.forEach(ped);
 for(const cx of xs)for(let y=44;y<=58;y++)gr(cx,y,1);
 for(let x=xs[0]-1;x<=xs[2]+2;x++)gr(x,58,0);
 for(let y=60;y<=68;y++)gr(mid,y,1);
 const A=['......oooooooooooooooooooooooooooooo........','oooooohhhhhhhhhhhhhhhhhhhhhhhhhhhhhhooooooo.','ohhhhhlllllllllllllllllllllllllllllllllllldo','ollllllbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddo','.oolllbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddo.','...ooolbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddoo..','......oooolbbbbbbbbbbbbbbbbbbbbbddoooo......','..........ooolbbbbbbbbbbbbbbbddoo...........','.............olbbbbbbbbbbbbbdo..............','.............olbbbbbbbbbbbbbdo..............','.............olbbbbbbbbbbbbbdo..............','............oolbbbbbbbbbbbbbddo.............','..........oollbbbbbbbbbbbbbbbddoo...........','........oolllbbbbbbbbbbbbbbbbbbddoo.........','.......ohhhhhhhhhhhhhhhhhhhhhhhhhhdo........','.......olllbbbbbbbbbbbbbbbbbbbbbdddo........','.......oddddddddddddddddddddddddddo.........','.......oooooooooooooooooooooooooooo.........'],I=PAL.iron,M={o:I.o,h:I.hi,l:I.l,b:I.b,d:I.d};
 A.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(M[r[x]])B.set(mid-21+x,70+y,M[r[x]]);});
 if(lit)for(let i=0;i<10;i++){const x=mid-12+(R()*26|0),y=62+(R()*8|0);B.set(x,y,i%2?'#fff3b0':'#ffb347');}
 return B;}
// vosková pečeť
// vosková pečeť
function seal(w,h,P,seed){const B=buf(w,h),R=rng(seed),cx=(w-1)/2,cy=(h-1)/2,r=Math.min(w,h)/2-.5;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=x-cx,dy=y-cy,d=Math.sqrt(dx*dx+dy*dy)+(R()-.5)*.9;if(d>r)continue;
  let c=P.b;if(d>r-1.2)c=P.o;else if(d>r-2.4)c=(dx+dy<0)?P.l:P.d;else if(d<r-3.2&&d>r-4.4)c=(dx+dy<0)?P.d:P.l;B.set(x,y,c);}
 return B;}
// malé obrázky kreslené ručně (znaky = barvy)
const PIX={
 back:{c:{'#':'#f4ecd6','.':'#2a2927'},r:['...#....','..##....','.#######','########','.#######','..##....','...#....']},
 help:{c:{'#':'#f4ecd6'},r:['.####.','##..##','....##','...##.','..##..','......','..##..']},
 plus:{c:{'#':'#d9a8f2'},r:['..##..','..##..','######','######','..##..','..##..']},
 arrow:{c:{'#':'#d9a8f2'},r:['....#...','....##..','....###.','########','########','....###.','....##..','....#...']},
 pipOn:{c:{'#':'#ffd75e','o':'#8f5a12','h':'#fff3b0'},r:['.oo.','oh#o','o##o','.oo.']},
 pipNext:{c:{'#':'#fff3b0','o':'#ffd75e'},r:['.oo.','o##o','o##o','.oo.']},
 pipOff:{c:{'o':'#3d3c39','#':'#1a1a19'},r:['.oo.','o##o','o##o','.oo.']},
 gem:{c:{'#':'C','h':'H','d':'D','o':'#111010'},r:['..ooo..','.ohh#o.','ohh###o','o####do','.o##do.','..odo..','...o...']},
 sun:{c:{'#':'#ffd75e','h':'#fff3b0','o':'#8f5a12'},r:['...#...','.#...#.','..o#o..','#.#h#.#','..o#o..','.#...#.','...#...']},
 hour:{c:{'#':'#e9e2d0','s':'#ffd75e'},r:['#######','.#sss#.','..#s#..','...#...','..#.#..','.#sss#.','#######']},
 lock:{c:{'#':'#8f8c85','d':'#3d3c39','k':'#111010'},r:['.###.','#...#','#...#','#####','##k##','##k##','#####']},
 coin:{c:{'#':'#ffd75e','h':'#fff3b0','d':'#c8861c','o':'#3a2208'},r:['.oooo.','oh###o','o#dd#o','o#dd#o','o###do','.oooo.']},
 star:{c:{'#':'#ffd75e','h':'#fff3b0'},r:['...#...','...#...','.#####.','#######','.##h##.','.##.##.','#.....#']},
 skull:{c:{'#':'#e9e2d0','d':'#b9b09a','k':'#1a1410'},r:['.#####.','#######','#kk#kk#','#kk#kk#','###k###','.#####.','.#d#d#.']},
 clock:{c:{'#':'#e9e2d0','h':'#ffd75e','k':'#1a1a19'},r:['..###..','.#kkk#.','#kkhkk#','#kkhhk#','#kkkkk#','.#kkk#.','..###..']},
 ess:{c:{'#':'#c479ea','h':'#ecc8ff','d':'#7d44a8','o':'#150a20'},r:['..ooo..','.oh##o.','oh###do','o###ddo','.o#ddo.','..ooo..']},
 shard:{c:{'#':'#5aa8f0','h':'#cfe8ff','d':'#2f6fb8','o':'#0b1a30'},r:['...o...','..oho..','.oh#do.','oh##ddo','.o#ddo.','..odo..','...o...']},
 anv:{c:{'#':'#787c84','h':'#a3a7ad','d':'#3a3d43','o':'#0e0f11'},r:['oooooooo..','ohhhhhhhoo','.o######do','..oo##doo.','...o#do...','..oo##doo.','.o######do','.oooooooo.']},
 up:{c:{'#':'#62c8f0','h':'#b8ecff'},r:['...h...','..h##..','.h####.','h######','..###..','..###..','..###..']},
 heart:{c:{'#':'#e2453a','h':'#ff8a78','d':'#a81f1c'},r:['.##.##.','#h####d','#######','######d','.####d.','..##d..','...d...']},
 sealStar:{c:{'#':'#ffd9b0','d':'#5c0f10'},r:['..#..','..#..','#####','.###.','#.#.#']},
 spark:{c:{'#':'#fff3b0'},r:['..#..','..#..','#####','..#..','..#..']},
 gear:{c:{'#':'#e9e2d0'},r:['.#.#.#.','#######','.##.##.','##...##','.##.##.','#######','.#.#.#.']},
 exit:{c:{'#':'#f4d6cf'},r:['#.....#','##...##','.##.##.','..###..','.##.##.','##...##','#.....#']},
 // odznáčky tříd 8×8
 cHarp:{c:{'#':'#ffd75e','s':'#fff3b0','o':'#3a2208'},r:['.##.....','#..#...#','#.s.#.##','#.s.s#.#','#.s.s.##','#.s.s.#.','.#.s.#..','..###...']},
 cWand:{c:{'#':'#8f5e30','s':'#b8ecff','h':'#ffffff'},r:['......s.','.....shs','......s.','....#...','...#....','..#.....','.#......','#.......']},
 cHammer:{c:{'#':'#a3a7ad','d':'#565a61','w':'#8f5e30'},r:['.#####..','.#####..','.##d##..','...w....','...w....','...w....','...w....','...w....']},
 cSword:{c:{'#':'#d7dbe0','d':'#787c84','w':'#8f5e30','g':'#ffd75e'},r:['......##','.....##.','....##..','...##...','g.##....','.g#.....','.wg.....','w..g....']},
 cBow:{c:{'#':'#8f5e30','s':'#e9e2d0'},r:['..##....','...#s...','....#s..','....#.s.','....#.s.','....#s..','...#s...','..##....']}};
function pic(name,sub){const k=name+'|'+(sub||'');if(pic.c[k])return pic.c[k];const p=PIX[name],w=p.r[0].length,h=p.r.length,B=buf(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ch=p.r[y][x];if(ch==='.'&&!p.c['.'])continue;let c=p.c[ch];if(c==='C')c=sub;else if(c==='H')c=mix(sub,'#ffffff',.5);else if(c==='D')c=mix(sub,'#000000',.4);if(c)B.set(x,y,c);}
 return pic.c[k]={url:toCanvas(B).toDataURL(),w:w*U,h:h*U};}
pic.c={};
function img(name,sub,cls){const p=pic(name,sub);return'<img alt="" class="kp'+(cls?' '+cls:'')+'" src="'+p.url+'" style="width:'+p.w+'px;height:'+p.h+'px">';}
// kresba podle druhu prvku
function draw(kind,w,h,el){const seed=hash(kind+'|'+w+'|'+h+'|'+(el.dataset.s||'')),m=el.dataset.m;
 if(kind==='btn'){const P=PAL[m||'slate'];return slab(w,h,P,seed,m==='gold'||m==='bronze'?{cut:2,depth:3,tex:texGold}:m==='oak'?{cut:1,depth:3,tex:texOak}:{chip:.6,depth:3,tex:texStone});}
 if(kind==='slab'){const P=PAL[m||'slate'];return slab(w,h,P,seed,m==='oak'||m==='dark'?{cut:1,depth:+(el.dataset.d||2),tex:(B,i,R,P2,w2,h2,D)=>texOak(B,i,R,P2,w2,h2,D,+(el.dataset.ph||9))}:m==='parch'?{torn:1,cut:1,depth:0,tex:texParch}:{chip:+(el.dataset.chip||1),depth:+(el.dataset.d||3),tex:texStone});}
 if(kind==='card'){const P=el.dataset.fuse?{...PAL.rune,o:'#2a1240'}:PAL.rune,B=slab(w,h,P,seed,{chip:1,depth:4,tex:texStone,rim:el.dataset.sel?'#ffd75e':null});runes(B,w-10-4*8,h-4-12,4,rng(seed+7),P,el.dataset.sel?'#ffe9a0':el.dataset.fuse?'#b06ad8':null);return B;}
 if(kind==='socket')return socket(w,h,PAL[m||'rune'],seed,{rar:el.dataset.rar,bg:el.dataset.bg});
 if(kind==='gauge')return gauge(w,h,el.dataset.g||'hp',+(el.dataset.v||0),seed);
 if(kind==='flag')return flag(w,h,PAL[el.dataset.on?'red':'grey'],seed,{trim:el.dataset.on?'#ffd75e':null});
 if(kind==='seal')return seal(w,h,PAL[m||'red'],seed);
 if(kind==='chain'){const I=PAL.iron,B=buf(w,h),G=['.##.','#..#','#..#','.##.','.##.','.##.'];for(let y=0;y<h;y++)for(let x=0;x<4&&x<w;x++){const ch=G[y%6][x];if(ch==='#')B.set(x,y,(y%6<4)?(x<2?I.l:I.d):I.b);}return B;}
 if(kind==='sign'){return slab(w,h,PAL.oak,seed,{cut:2,depth:3,tex:(B,i,R,P2,w2,h2,D)=>{texOak(B,i,R,P2,w2,h2,D,10);for(let x=3;x<w2-3;x++){if(i(x,2))B.set(x,2,P2.dd);if(i(x,h2-D-3))B.set(x,h2-D-3,P2.dd);}for(let y=2;y<h2-D-2;y++){if(i(2,y))B.set(2,y,P2.dd);if(i(w2-3,y))B.set(w2-3,y,P2.dd);}}});}
 if(kind==='bed')return socket(w,h,PAL.slate,seed,{bg:el.dataset.bg||'#1c1e22'});
 if(kind==='awning')return awning(w,h);
 if(kind==='shelf')return shelf(w,h,seed);
 if(kind==='forge')return forgeScene(w,h,seed,el.dataset.lit);
 if(kind==='rod'){const P=PAL.oak,B=buf(w,h);for(let x=0;x<w;x++)for(let y=0;y<h;y++){const end=x<3||x>w-4;if(end){B.set(x,y,(y===0||y===h-1||x===0||x===w-1)?P.o:y===1?P.hi:P.l);}else if(y>=1&&y<h-1)B.set(x,y,y===1?P.o:y===2?P.hi:y===h-2?P.o:y===h-3?P.d:P.b);}return B;}
 return null;}
function paint(root){(root||document).querySelectorAll('[data-k]').forEach(el=>{const W=el.offsetWidth,H=el.offsetHeight;if(!W||!H)return;
  if(W%2||H%2)console.warn('KIT lichý rozměr',el.className,W,H);
  const B=draw(el.dataset.k,Math.round(W/U),Math.round(H/U),el);if(!B)return;
  el.style.backgroundImage='url('+toCanvas(B).toDataURL()+')';el.style.backgroundSize='100% 100%';el.style.backgroundRepeat='no-repeat';el.style.imageRendering='pixelated';});}
return{paint,pic,img,PAL,RAR,mix};})();
