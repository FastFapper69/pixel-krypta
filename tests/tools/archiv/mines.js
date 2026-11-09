/* ----- lava mines: basalt floor with glowing veins, a rail loop with runaway carts, timber, ore, headframe ----- */
const MN_PROPS={
 headframe:{mirror:false,rows:['....nnnnnnn....','...nwwwwwwwn...','...n.n...n.n...','...nnnnnnnnn...','....n.....n....','....nn...nn....','....n.n.n.n....','....n..n..n....','....n.n.n.n....','....nn...nn....','....n.....n....','...nnnnnnnnn...','...n.n...n.n...','..nn..n.n..nn..','..n....n....n..','.nn...n.n...nn.','nnnnnnnnnnnnnnn','aaaaaaaaaaaaaaa'],pal:{n:'#7a5232',w:'#9a9aa8',a:'#4a3a2a'}},
 winch:{mirror:false,rows:['.aaaa.','abbbba','abwwba','abbbba','.aaaa.','nnnnnn','n....n'],pal:{a:'#5a5a66',b:'#7a7a88',w:'#b0b0c0',n:'#6a4628'}},
 beam:{mirror:false,rows:['cccccccccc','nnnnnnnnnn','.n......n.','.n......n.','.n......n.','.n......n.','.n......n.','.n......n.','.n......n.','.n......n.','nn......nn'],pal:{n:'#6a4628',c:'#8a6238'}},
 lantern:{rows:['..S','.SS','.yy','.yy','.SS','..n','..n','..n','..n','..n','..n','.nn'],pal:{S:'#3a3440',n:'#5a3a22'}},
 ore:{rows:['...o','..oy','..oo','.oao','aooa','aaaa'],pal:{a:'#3a2a30'}},
 ore2:{rows:['..m.','..mi','.mmm','amma','aaaa'],pal:{a:'#3a2a30',m:'#a060e0'}},
 barrel:{rows:['.nn','nnn','ccc','nnn','nnn','ccc','.nn'],pal:{n:'#6a4628',c:'#4a4a56'}},
 crate:{mirror:false,rows:['nnnnnn','ncnncn','nncnnn','nnncnn','ncnncn','nnnnnn'],pal:{n:'#8a6238',c:'#5a3a20'}},
 stalag:{rows:['...a','...a','..ab','..aa','.aab','.aaa','aaab','aaaa'],pal:{a:'#4e3e48',b:'#2e2228'}},
 rubble:{mirror:false,rows:['..aa...','.aaab..','aabaaaa','abbabbb'],pal:{a:'#5a4a52',b:'#3a2e34'}},
 wreck:{mirror:false,rows:['.......','aaaaaa.','abbbbba','abbbbba','aaaaaaa','.k...k.'],pal:{a:'#5a5060',b:'#6a4628'}},
 pick:{mirror:false,rows:['aaaa.','a..n.','...n.','..n..','.n...'],pal:{a:'#9a9aa8',n:'#7a5232'}},
 cart:{rows:['....oy','..ooyo','aaaaaa','abbbbb','abwbbb','aaaaaa','.kk...','.kk...'],pal:{a:'#5e5868',b:'#7a5232',w:'#9a7448'}}
};
const mnSpr={};
const mnSprite=k=>mnSpr[k]||(mnSpr[k]=buildSprite(MN_PROPS[k].rows,{pal:MN_PROPS[k].pal,mirror:MN_PROPS[k].mirror!==false}));
function buildMines(id){
  const def=MAPS[id],size=def.size,rng=mulberry32(def.seed),A=size*Z,C=size/2;
  // closed rail loop, three-lobed so it sweeps close to the centre and out towards the walls
  const ph=rng()*6.283,rp=[];for(let i=0;i<=360;i++){const a=i/360*6.283,rr=size*.3+Math.sin(a*3+ph)*size*.085;rp.push([C+Math.cos(a)*rr,C+Math.sin(a)*rr]);}
  const cum=[0];for(let i=1;i<rp.length;i++)cum.push(cum[i-1]+Math.hypot(rp[i][0]-rp[i-1][0],rp[i][1]-rp[i-1][1]));
  const rails={pts:rp,cum,len:cum[cum.length-1]};
  const railD=(x,y)=>{let b=1e9;for(let i=0;i<rp.length;i+=3){const d=(rp[i][0]-x)**2+(rp[i][1]-y)**2;if(d<b)b=d;}return Math.sqrt(b);};
  // lava pools away from the centre and the track
  const pools=[];for(let t=0;pools.length<def.pools&&t<400;t++){const x=110+rng()*(size-220),y=110+rng()*(size-220),r=14+((rng()*14)|0);
    if(Math.hypot(x-C,y-C)<130||railD(x,y)<r+26||pools.some(p=>Math.hypot(p.x-x,p.y-y)<p.r+r+60))continue;pools.push({x:x|0,y:y|0,r});}
  const N1=noiseField(size,size,90,rng),N2=noiseField(size,size,16,rng);
  const c=document.createElement('canvas');c.width=c.height=A;const g=c.getContext('2d');
  const img=g.createImageData(A,A),Dd=img.data;
  const BS=['#1a1218','#221820','#2a1e28','#332430','#3e2c38','#4a3642'].map(hex2rgb),GV=['#3a2e34','#4a3c42','#5a4a50'].map(hex2rgb);
  const WL=['#120a0e','#1c1218','#261a20','#30222a'].map(hex2rgb),TB=12*Z;
  const heat=(x,y)=>{let h=0;for(const p of pools){const d=Math.hypot(x-p.x,y-p.y)-p.r;if(d<40)h=Math.max(h,1-d/40);}return h;};
  const HT=new Float32Array(size*size);for(const p of pools)for(let y=Math.max(0,p.y-p.r-42);y<Math.min(size,p.y+p.r+42);y++)for(let x=Math.max(0,p.x-p.r-42);x<Math.min(size,p.x+p.r+42);x++)HT[y*size+x]=heat(x,y);
  for(let y=0;y<A;y++){const wy=y>>1;for(let x=0;x<A;x++){const wx=x>>1,i=wy*size+wx,n1=N1[i],n2=N2[i],hn=hashN(x,y,5),b=B4[(y&3)*4+(x&3)]/16,ed=Math.min(x,y,A-1-x,A-1-y);let col;
    if(ed<TB){const v=(hashN(x>>2,y>>2,3)*.5+hashN(x,y>>1,4)*.3+(ed/TB)*.4+(b-.5)*.2);col=WL[clamp(Math.floor(v*WL.length),0,WL.length-1)];}
    else if(n2>.66&&n1>.4)col=GV[clamp(Math.floor((hn*.6+(b-.5)*.4+.4)*GV.length),0,GV.length-1)];
    else{let v=n1*.55+n2*.3+hn*.08+(b-.5)*.22+HT[i]*.25;
      // slab cracks: a coarse cell grid nudged by noise
      const cx=(wx+n2*14)%38,cy=(wy+n1*18)%30;if(cx<1||cy<1)v-=.35;
      col=BS[clamp(Math.floor(v*BS.length),0,BS.length-1)];
      if(HT[i]>.55&&hn>.9-HT[i]*.15)col=hex2rgb(hn>.97?'#ffb040':'#c8401a');}
    const o=(y*A+x)*4;Dd[o]=col[0];Dd[o+1]=col[1];Dd[o+2]=col[2];Dd[o+3]=255;}}
  g.putImageData(img,0,0);
  // glowing magma veins
  const lights=[];
  for(let k=0;k<26;k++){let x=40+rng()*(size-80),y=40+rng()*(size-80);if(Math.hypot(x-C,y-C)<90||railD(x,y)<20)continue;let a=rng()*6.283;const n=30+rng()*60,pts=[];
    for(let s=0;s<n;s++){pts.push([x,y]);a+=(rng()-.5)*.8;x+=Math.cos(a)*1.5;y+=Math.sin(a)*1.5;if(railD(x,y)<14)break;}
    for(const [vx,vy] of pts){const X=Math.round(vx*Z),Y=Math.round(vy*Z);g.fillStyle='#14080c';g.fillRect(X-1,Y-1,4,4);}
    for(const [vx,vy] of pts){const X=Math.round(vx*Z),Y=Math.round(vy*Z);g.fillStyle='#d8481c';g.fillRect(X,Y,2,2);g.fillStyle='#ffb040';if(hashN(X,Y,2)>.6)g.fillRect(X,Y,1,1);}
    if(k%2===0){const m=pts[pts.length>>1];lights.push({x:m[0],y:m[1],r:26,col:'#ff5a1a',a:.6});}}
  // pool rims: cooled crust, then a hot fringe
  pools.forEach(p=>{g.fillStyle='#4a2a26';rowsCircle(g,p.x*Z,p.y*Z,(p.r+6)*Z);g.fillStyle='#2a1418';rowsCircle(g,p.x*Z,p.y*Z,(p.r+4)*Z);
    for(let k=0;k<60;k++){const a=rng()*6.283,rr=(p.r+3+rng()*4)*Z;g.fillStyle=pick(['#6a3a2a','#8a4a2a','#1a0c10']);g.fillRect(Math.round(p.x*Z+Math.cos(a)*rr),Math.round(p.y*Z+Math.sin(a)*rr),2,2);}
    g.fillStyle='#14080c';rowsCircle(g,p.x*Z,p.y*Z,(p.r+2)*Z);});
  // central plank platform with the shaft
  const PW=46*Z;g.fillStyle='#2a1a12';g.fillRect(C*Z-PW-2,C*Z-PW-2,PW*2+4,PW*2+4);
  for(let y=C*Z-PW;y<C*Z+PW;y+=6)for(let x=C*Z-PW;x<C*Z+PW;x+=24){const off=(((y-C*Z)/6)&1)*12,xx=x-off<C*Z-PW?C*Z-PW:x-off,w=Math.min(23,C*Z+PW-xx);
    const t=pick([['#7a5232','#9a6c42','#5a3a22'],['#6e4a2c','#8a623a','#4e321e'],['#86603a','#a87a4c','#644226']]);
    g.fillStyle=t[0];g.fillRect(xx,y,w,5);g.fillStyle=t[1];g.fillRect(xx,y,w,1);g.fillStyle=t[2];g.fillRect(xx,y+5,w,1);g.fillRect(xx+w,y,1,6);g.fillStyle='#3a2416';g.fillRect(xx+2,y+2,1,1);g.fillRect(xx+w-3,y+2,1,1);}
  g.fillStyle='#08040a';g.fillRect(C*Z-14,C*Z-48,28,20);g.fillStyle='#1a1014';g.fillRect(C*Z-14,C*Z-48,28,3);
  // the track: gravel bed, sleepers, two steel rails
  const along=(f)=>{for(let i=0;i<rp.length-1;i++){const [x0,y0]=rp[i],[x1,y1]=rp[i+1],L=Math.hypot(x1-x0,y1-y0);f(x0,y0,(x1-x0)/L,(y1-y0)/L,L,i);}};
  g.lineCap='round';g.lineJoin='round';g.strokeStyle='#2e2428';g.lineWidth=17*Z;g.beginPath();rp.forEach(([x,y],i)=>i?g.lineTo(x*Z,y*Z):g.moveTo(x*Z,y*Z));g.stroke();
  for(let k=0;k<A*9;k++){const i=(rng()*(rp.length-1))|0,t=rng(),[x0,y0]=rp[i],[x1,y1]=rp[i+1],n=(rng()-.5)*16;const L=Math.hypot(x1-x0,y1-y0),nx=-(y1-y0)/L,ny=(x1-x0)/L;
    const X=Math.round((x0+(x1-x0)*t+nx*n)*Z),Y=Math.round((y0+(y1-y0)*t+ny*n)*Z);g.fillStyle=pick(['#4a3c42','#3a2e34','#5e4e56','#241c20']);g.fillRect(X,Y,1,1);}
  let acc=0;along((x0,y0,dx,dy,L)=>{for(let s=(7-acc%7)%7;s<L;s+=7){const x=x0+dx*s,y=y0+dy*s,nx=-dy,ny=dx;
      for(let q=-6;q<=6;q+=.5){const X=Math.round((x+nx*q)*Z),Y=Math.round((y+ny*q)*Z);g.fillStyle='#24140c';g.fillRect(X,Y,3,3);g.fillStyle=Math.abs(q)>5?'#4e321e':'#6a4628';g.fillRect(X,Y,2,2);}}acc+=L;});
  for(const side of [-1,1])along((x0,y0,dx,dy,L)=>{for(let s=0;s<L;s+=.5){const x=x0+dx*s-dy*side*4,y=y0+dy*s+dx*side*4,X=Math.round(x*Z),Y=Math.round(y*Z);
    g.fillStyle='#16101a';g.fillRect(X,Y+1,2,2);g.fillStyle='#7a7888';g.fillRect(X,Y,2,1);g.fillStyle='#c8c8d4';g.fillRect(X,Y,1,1);}});
  // props
  const props=[];const free=(x,y,r)=>!props.some(q=>Math.hypot(q.x-x,q.y-y)<r);
  const shadowAt=(x,y,rx,ry,a)=>{g.globalAlpha=a;g.fillStyle='#000000';g.beginPath();g.ellipse(x*Z,y*Z,rx*Z,ry*Z,0,0,6.283);g.fill();g.globalAlpha=1;};
  const put=(k,x,y,tall,sh)=>{const s=typeof k==='string'?mnSprite(k):k;if(sh!==0)shadowAt(x+s.w*.1,y-.5,s.w*.46,Math.max(1.4,s.h*.08),sh||.35);props.push({isProp:true,x,y,spr:s,tall:!!tall});return s;};
  const clear=(x,y,r)=>Math.abs(x-C)>56||Math.abs(y-C)>56?railD(x,y)>16&&!pools.some(p=>Math.hypot(p.x-x,p.y-y)<p.r+12)&&free(x,y,r):false;
  {const s=put('headframe',C,C-20,true,.4);lights.push({x:C,y:C-s.h+4,r:30,col:'#ffcf80',a:.8});put('winch',C+22,C-18,false,.3);
   for(const [dx,dy] of [[-38,-38],[38,-38],[-38,38],[38,38]]){const s2=put('lantern',C+dx,C+dy,true,.3);lights.push({x:C+dx,y:C+dy-s2.h+3,r:46,col:'#ffb060',a:1});}
   put('barrel',C-30,C+20,false);put('crate',C-22,C+26,false);put('crate',C+28,C+22,false);put('pick',C+20,C+32,false,0);}
  // timber supports and lanterns along the track
  along((x0,y0,dx,dy,L,i)=>{if(i%30!==15)return;const side=(i/30)&1?1:-1,x=x0-dy*side*16,y=y0+dx*side*16;if(!clear(x,y,20))return;
    const s=put('lantern',x,y,true,.3);lights.push({x,y:y-s.h+3,r:44,col:'#ffb060',a:1});});
  for(let k=0;k<70;k++){const x=40+rng()*(size-80),y=40+rng()*(size-80);if(!clear(x,y,40))continue;put('beam',x,y,true,.3);
    if(rng()<.5){put(rng()<.5?'barrel':'crate',x+rng()*14-7,y+8,false);}}
  for(let k=0;k<70;k++){const x=40+rng()*(size-80),y=40+rng()*(size-80);if(!clear(x,y,22))continue;const v=rng()<.25;const s=put(v?'ore2':'ore',x,y,false,.3);
    if(k%3===0)lights.push({x,y:y-s.h*.5,r:22,col:v?'#b070ff':'#ff7a30',a:.75});}
  for(let k=0;k<160;k++){const side=(rng()*4)|0,d=24+rng()*60;const x=side===0?d:side===1?size-d:40+rng()*(size-80),y=side===2?d+12:side===3?size-d:40+rng()*(size-80);
    if(!clear(x,y,16))continue;put('stalag',x,y,true,.3);}
  for(let k=0;k<90;k++){const x=30+rng()*(size-60),y=30+rng()*(size-60);if(!clear(x,y,14))continue;const r=rng();put(r<.55?'rubble':r<.8?'stalag':'wreck',x,y,r>=.55&&r<.8,.3);}
  for(let i=0;i<8;i++){g.fillStyle='rgba(0,0,0,'+(.4-i*.045)+')';g.fillRect(TB,TB+i,A-2*TB,1);g.fillRect(TB+i,TB,1,A-2*TB);}
  props.sort((a,b)=>a.y-b.y);
  return {canvas:c,pools,rails,def,props,lights:lights.slice(0,40)};
}
function railPos(s){const R=run.built.rails;s=((s%R.len)+R.len)%R.len;let lo=0,hi=R.cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(R.cum[m]<=s)lo=m;else hi=m;}
  const t=(s-R.cum[lo])/((R.cum[hi]-R.cum[lo])||1),a=R.pts[lo],b=R.pts[hi];return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,dx:b[0]-a[0],dy:b[1]-a[1]};}
// runaway mine carts: crush enemies (big score), hurt and shove the player
function updateCarts(dt){
  const R=run.built.rails;if(!R)return;
  if(!run.carts){run.carts=[0,1,2].map(k=>({s:R.len*k/3,x:0,y:0,dir:1}));}
  const p=run.p;
  for(const c of run.carts){c.s+=dt*74;const q=railPos(c.s);c.x=q.x;c.y=q.y;c.dir=q.dx>=0?1:-1;
    if(Math.random()<dt*14&&run.parts.length<400)run.parts.push({x:c.x+rnd(-5,5),y:c.y+2,vx:rnd(-30,30),vy:rnd(-50,-15),life:.25,col:pick(['#ffd060','#ff8a30']),sz:1,g:0});
    for(const e of run.enemies){if(e.dead||Math.abs(e.x-c.x)>14||Math.abs(e.y-c.y)>14)continue;const d=Math.hypot(e.x-c.x,e.y-c.y);if(d>8+e.r)continue;
      if(e.boss){if((e.cartT||0)>run.t)continue;e.cartT=run.t+.8;hurtEnemy(e,90/Math.max(.2,st.dmg),(e.x-c.x)/d*60,(e.y-c.y)/d*60);}
      else hurtEnemy(e,(e.hp+e.elite*0+10)/Math.max(.2,st.dmg)*(e.elite?.5:1.1),(e.x-c.x)/(d||1)*120,(e.y-c.y)/(d||1)*120);}
    const dp=Math.hypot(p.x-c.x,p.y-c.y);
    if(dp<10){if(!run.cartTip){run.cartTip=true;toast('Pozor na vozíky! Drtí i nepřátele',2600);}
      if(p.inv<=0){hurtPlayer(16);const n=dp||1;p.x=clamp(p.x+(p.x-c.x)/n*14,14,run.map.size-14);p.y=clamp(p.y+(p.y-c.y)/n*14,14,run.map.size-14);run.shake=6;}}
    else if(dp<70&&!run.cartTip&&run.t>3){run.cartTip=true;toast('Pozor na vozíky! Drtí i nepřátele',2600);}}
}
