/* ----- desert temple: wind-rippled dunes, sunken causeways, oases with palms, mesas, a giant skeleton ----- */
const DS_PROPS={
 obelisk:{rows:['..a','..a','.aa','.ai','.aa','.ab','.aa','.ai','.aa','.ab','.aa','.aa','aaa','ccc'],pal:{a:'#dcb87c',b:'#a8824c',c:'#8a6a40'}},
 column:{mirror:false,rows:['.aaaaa.','aaaaaaa','ccccccc','.aaaab.','.acaab.','.aaaab.','.acaab.','.aaaab.','.acaab.','.aaaab.','ccccccc','aaaaaaa'],pal:{a:'#d6b07a',b:'#a07a46',c:'#ecd2a0'}},
 stump:{mirror:false,rows:['.a.aa..','.aaaaa.','.acaab.','.aaaab.','.acaab.','ccccccc','aaaaaaa'],pal:{a:'#d6b07a',b:'#a07a46',c:'#ecd2a0'}},
 fallen:{mirror:false,rows:['.cccccccccc.','caaaaaaaaaab','caacaacaaaab','caaaaaaaaaab','.bbbbbbbbbb.'],pal:{a:'#d6b07a',b:'#a07a46',c:'#ecd2a0'}},
 brazier:{rows:['..y','.oy','ooo','nnn','.nn','..n','..n','.nn','nnn'],pal:{n:'#6a4a2e'}},
 cactus:{mirror:false,rows:['....g....','...ggg...','...ggg...','.g.ggg...','.g.ggg.g.','.g.ggg.g.','.gggggg..','...gggg..','...ggg...','...ggg...','...ggg...','...ggg...'],pal:{g:'#5a9a44'}},
 cactus2:{mirror:false,rows:['...g...','..ggg..','..ggg.g','g.ggg.g','g.ggggg','ggggg..','..ggg..','..ggg..','..ggg..'],pal:{g:'#4f8e40'}},
 barrel:{rows:['..m','.gg','ggg','ggg','.gg'],pal:{g:'#6aa04a'}},
 urn:{rows:['.aa','..a','.aa','aaa','aab','aab','.aa'],pal:{a:'#c47040',b:'#8a4422'}},
 scrub:{rows:['.c.c','cbcb','bbbb','.bbb'],pal:{b:'#8a7a3a',c:'#b0a050'}},
 bones:{mirror:false,rows:['b..b....','.bb.....','.bb..bbb','b..b.b.b','.....bbb'],pal:{b:'#eadcc0'}},
 skull:{rows:['...bbb','.bbbbb','bbbbbb','bbkkbb','bbbkbb','.bbbbb','..bbbb','...b.b','....bb'],pal:{b:'#e6d6b4',k:'#3a2618'}},
 rib:{rows:['....bb','..bb..','.b....','b.....','b.....','b.....','b.....','.b....','.b....','.b....'],pal:{b:'#e6d6b4'}},
 rock:{rows:['..aa','.aac','aaaa','aaab','bbbb'],pal:{a:'#b47a4c',b:'#7a4a2c',c:'#d8a070'}}
};
const dsSpr={};
const dsSprite=k=>dsSpr[k]||(dsSpr[k]=buildSprite(DS_PROPS[k].rows,{pal:DS_PROPS[k].pal,mirror:DS_PROPS[k].mirror!==false}));
// layered sandstone butte / boulder, lit from the upper left
function makeMesa(seed,big){
  const r=mulberry32(seed),W=big?72:30,H=big?60:24,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
  const m=new Uint8Array(W*H),topY=big?6+((r()*6)|0):4,cap=big?Math.floor(H*.32):Math.floor(H*.4);
  for(let y=topY;y<H-1;y++){const t=(y-topY)/(H-topY);
    const hw=(big?W*.3+t*W*.17:W*.28+Math.sin(t*3)*W*.14)+(hashN(1,y>>1,seed)-.5)*3;
    for(let x=1;x<W-1;x++)if(Math.abs(x-W/2+(hashN(2,y>>2,seed)-.5)*2)<hw)m[y*W+x]=1;}
  const d=distField((x,y)=>!!m[y*W+x],W,H,8),D=(x,y)=>(x<0||y<0||x>=W||y>=H)?0:d[y*W+x];
  const STR=['#7a3e24','#8e4c2c','#a65e36','#b87040','#c8844c','#d89a5c','#e8b474'];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!m[y*W+x])continue;
    const top=y<topY+cap*.3&&big;const hx=D(x+1,y)-D(x-1,y);
    let v=top?.85:(.45-hx*.18+Math.sin(y*.9+hashN(x>>3,0,seed)*2)*.12+(hashN(x>>1,y,seed+4)-.5)*.18-(y/H)*.25);
    if(!top&&((y+((hashN(x>>2,1,seed)*2)|0))%(big?7:5))===0)v-=.22; // strata
    v+=(B4[(y&3)*4+(x&3)]/16-.5)*.16;g.fillStyle=STR[clamp(Math.floor(v*STR.length),0,STR.length-1)];g.fillRect(x,y,1,1);}
  g.fillStyle='#3a1a10';
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(m[y*W+x])continue;if((x>0&&m[y*W+x-1])||(x<W-1&&m[y*W+x+1])||(y>0&&m[(y-1)*W+x])||(y<H-1&&m[(y+1)*W+x]))g.fillRect(x,y,1,1);}
  return {c:cv,w:W/Z,h:H/Z};
}
function makePalm(seed){
  const r=mulberry32(seed),W=52,H=70,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
  const lean=(r()-.5)*14;let tx=W/2,ty=H-1;const topX=W/2+lean,topY=18;
  for(let i=0;i<=40;i++){const t=i/40,x=W/2+lean*t*t,y=H-1-(H-1-topY)*t,w=4-t*1.2;
    for(let k=-w;k<=w;k++){const sh=k<-w+1.5?'#c89a5a':k>w-1.5?'#5a3a20':'#8a6034';g.fillStyle=(Math.floor(y)%4===0)?'#4a3018':sh;g.fillRect(Math.round(x+k),Math.round(y),1,1);}tx=x;ty=y;}
  const FR=['#1e4a22','#2a6028','#3a7a30','#4e9238','#6aaa44'];
  const n=7+((r()*2)|0);
  for(let f=0;f<n;f++){const a=f/n*6.283+r()*.4,len=17+r()*7,dx=Math.cos(a),dy=Math.sin(a)*.5;
    for(let s=0;s<len;s++){const t=s/len,x=topX+dx*s,y=topY+dy*s+t*t*13-3,wid=Math.max(1,3.4*Math.sin(t*3.1));
      for(let k=-wid;k<=wid;k++){const px=Math.round(x+k*-dy*.6),py=Math.round(y+k*.8);if(px<1||py<1||px>=W-1||py>=H-1)continue;
        const lit=k<0&&dy<.2;g.fillStyle=FR[clamp(Math.floor((lit?.75:.35)*FR.length+(1-t)*1.2+(hashN(px,py,seed)-.5)*1.4),0,FR.length-1)];g.fillRect(px,py,1,1);}}}
  g.fillStyle='#6a3a1a';g.fillRect(topX-3,topY,2,2);g.fillRect(topX+1,topY+1,2,2);g.fillStyle='#9a5a2a';g.fillRect(topX-3,topY,1,1);g.fillRect(topX+1,topY+1,1,1);
  const id=g.getImageData(0,0,W,H),dd=id.data,full=i=>dd[i*4+3]>0;
  g.fillStyle='#10200e';
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(full(i))continue;if((x>0&&full(i-1))||(x<W-1&&full(i+1))||(y>0&&full(i-W))||(y<H-1&&full(i+W)))g.fillRect(x,y,1,1);}
  return {c:cv,w:W/Z,h:H/Z};
}
function buildDesert(id){
  const def=MAPS[id],size=def.size,rng=mulberry32(def.seed),A=size*Z,C=size/2,PH=70,RW=13;
  // oases on three of the four diagonals, the giant skeleton on the fourth
  const diag=[0,1,2,3].map(k=>Math.PI/4+k*Math.PI/2).sort(()=>rng()-.5);
  const oases=diag.slice(0,3).map(a=>{a+=(rng()-.5)*.35;const d=270+rng()*50;return{x:C+Math.cos(a)*d,y:C+Math.sin(a)*d,r:22+rng()*8};});
  const skA=diag[3],SK={x:C+Math.cos(skA)*250,y:C+Math.sin(skA)*250};
  const N1=noiseField(size,size,110,rng),N2=noiseField(size,size,18,rng),N3=noiseField(size,size,64,rng);
  const onRoad=(x,y)=>(Math.abs(x-C)<RW&&Math.abs(y-C)>PH-2)||(Math.abs(y-C)<RW&&Math.abs(x-C)>PH-2);
  const onPlaza=(x,y)=>Math.abs(x-C)<PH&&Math.abs(y-C)<PH;
  const oasisD=(x,y)=>{let b=9;for(const o of oases){const n=(N2[((y|0)*size+(x|0))]||.5)-.5,dd=Math.hypot((x-o.x)/(o.r*1.35),(y-o.y)/o.r)+n*.25;if(dd<b)b=dd;}return b;};
  const c=document.createElement('canvas');c.width=c.height=A;const g=c.getContext('2d');
  const img=g.createImageData(A,A),Dd=img.data;
  const SA=['#b4793e','#c2884a','#cf9856','#dba864','#e6b872','#efc886','#f6d89c'].map(hex2rgb);
  const CL=['#8e5632','#9c623a','#aa6e42','#b87c4c'].map(hex2rgb),PK=['#b07a48','#bc8652','#c8925c'].map(hex2rgb);
  const WA=['#1a4a6a','#22607e','#2c7890','#3a90a4','#6cc0c8'].map(hex2rgb),WET=['#8a5a32','#9a683a'].map(hex2rgb),GRS=['#4a6a2a','#5a7e30','#6e9238','#86a444'].map(hex2rgb);
  for(let y=0;y<A;y++){const wy=y>>1;for(let x=0;x<A;x++){const wx=x>>1,i=wy*size+wx,n1=N1[i],n2=N2[i],n3=N3[i],hn=hashN(x,y,7),b=B4[(y&3)*4+(x&3)]/16;
    let col;const od=Math.abs(wx-C)<size&&oases.length?(Math.abs(wx-oases[0].x)<90&&Math.abs(wy-oases[0].y)<90)||(Math.abs(wx-oases[1].x)<90&&Math.abs(wy-oases[1].y)<90)||(Math.abs(wx-oases[2].x)<90&&Math.abs(wy-oases[2].y)<90)?oasisD(wx,wy):9:9;
    if(od<1){const v=(1-od)*.9+n2*.25+(b-.5)*.25+(hashN(x>>2,y,3)>.93?.4:0);col=WA[clamp(Math.floor((1-v*.9)*WA.length),0,WA.length-1)];if(od>.86)col=WA[4];}
    else if(od<1.12)col=WET[(hn+b*.5)>.8?1:0];
    else if(od<1.55&&n2+hn*.3>.45+ (od-1.12)*1.2){col=GRS[clamp(Math.floor((n1*.5+hn*.5+(b-.5)*.3)*GRS.length),0,GRS.length-1)];}
    else if(onRoad(wx,wy)||onPlaza(wx,wy))col=PK[clamp(Math.floor((n2*.6+hn*.25+(b-.5)*.3)*PK.length),0,PK.length-1)];
    else if(n3>.66&&n1<.55){const v=n2*.5+hn*.3+(b-.5)*.3;col=CL[clamp(Math.floor(v*CL.length),0,CL.length-1)];}
    else{const rip=Math.sin((wx*.82+wy*.36)*.62+n1*22+n2*3);
      let v=n1*.62+n2*.22+hn*.06+(b-.5)*.2;if(rip>.8)v-=.2;else if(rip<-.86)v+=.12;
      col=SA[clamp(Math.floor(v*SA.length*1.05-.05),0,SA.length-1)];}
    const o=(y*A+x)*4;Dd[o]=col[0];Dd[o+1]=col[1];Dd[o+2]=col[2];Dd[o+3]=255;}}
  g.putImageData(img,0,0);
  const sandAt=(x,y)=>!onRoad(x,y)&&!onPlaza(x,y)&&oasisD(x,y)>1.6;
  // dried-mud cracks on the clay pans
  for(let k=0;k<A*A/3000;k++){let x=rng()*A,y=rng()*A;const wx=x>>1,wy=y>>1;if(!(N3[(wy|0)*size+(wx|0)]>.68&&N1[(wy|0)*size+(wx|0)]<.53))continue;
    let a=rng()*6.283;const n=8+rng()*14;for(let s=0;s<n;s++){g.fillStyle='#6e3e22';g.fillRect(x|0,y|0,1,1);g.fillStyle='#c8905a';g.fillRect((x|0)+1,(y|0)+1,1,1);a+=(rng()-.5)*1.2;x+=Math.cos(a);y+=Math.sin(a);}}
  // sandstone slabs: plaza and the four causeways, half buried by drifting sand
  const SL=[['#d8b47e','#eccb98','#a8824e'],['#ccaa74','#e2c08c','#9c7846'],['#e0be88','#f2d6a4','#b08a54']];
  const slab=(px,py,w,h,s)=>{const t=SL[(hashN(px,py,9)*3)|0];g.fillStyle='#7a5a34';g.fillRect(px,py,w+1,h+1);g.fillStyle=t[0];g.fillRect(px,py,w,h);
    g.fillStyle=t[1];g.fillRect(px,py,w-1,1);g.fillRect(px,py,1,h-1);g.fillStyle=t[2];g.fillRect(px+1,py+h-1,w-1,1);g.fillRect(px+w-1,py+1,1,h-1);
    if(hashN(px,py,s)>.8){g.fillStyle=t[2];let cx=px+2+((hashN(px,py,4)*(w-4))|0),cy=py+1;while(cy<py+h-1){g.fillRect(cx,cy,1,1);cy++;cx+=hashN(cx,cy,5)>.5?1:0;}}};
  const buried=(wx,wy,f)=>{const n=N1[(wy|0)*size+(wx|0)]*.7+N2[(wy|0)*size+(wx|0)]*.5;return n>f;};
  const P0=(C-PH)*Z,P1=(C+PH)*Z;
  for(let y=P0;y<P1;y+=12){const off=((y-P0)/12&1)*8;for(let x=P0-off;x<P1;x+=16){const ax=Math.max(P0,x),aw=Math.min(x+15,P1)-ax;
    const wx=(ax>>1)+4,wy=(y>>1)+3,edge=Math.max(Math.abs(wx-C),Math.abs(wy-C))/PH;if(aw<3||buried(wx,wy,1.02-edge*.32))continue;slab(ax,y,aw,11,6);}}
  // inner ring of blue rune tiles around the crystal
  for(let k=0;k<40;k++){const a=k/40*6.283,rr=30*Z;const x=Math.round(C*Z+Math.cos(a)*rr),y=Math.round(C*Z+Math.sin(a)*rr*.9);
    g.fillStyle='#3a5a78';g.fillRect(x-2,y-2,5,5);g.fillStyle=k%5===0?'#bfeaff':'#5a8ab0';g.fillRect(x-1,y-1,3,3);}
  for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){
    for(let s=PH;s<size/2-12;s+=7){const cx=C+dx*s,cy=C+dy*s;
      for(let q=-RW;q<RW;q+=(dx?6:8)){const wx=dx?cx:cx+q,wy=dy?cy:cy+q;if(buried(wx,wy,.62+.2*(1-s/(size/2))))continue;
        if(dx)slab(Math.round(wx*Z),Math.round(wy*Z),13,11,7);else slab(Math.round(wx*Z),Math.round(wy*Z),15,13,7);}}}
  // sand ripples drifting over the edges of the stonework
  for(let k=0;k<A*A/90;k++){const x=(rng()*A)|0,y=(rng()*A)|0,wx=x>>1,wy=y>>1;if(!(onRoad(wx,wy)||onPlaza(wx,wy)))continue;
    if(N2[wy*size+wx]*.8+N1[wy*size+wx]*.6<.62)continue;g.fillStyle=pick(['#dba864','#e6b872','#cf9856']);g.fillRect(x,y,rng()<.5?3:2,1);}
  // wind specks and pebbles on open sand, snake trails
  for(let k=0;k<A*A/70;k++){const x=(rng()*A)|0,y=(rng()*A)|0;if(!sandAt(x>>1,y>>1))continue;g.fillStyle=rng()<.5?'#f8e0a8':'#a86e36';g.fillRect(x,y,1,1);}
  for(let k=0;k<A*A/2200;k++){const x=(rng()*A)|0,y=(rng()*A)|0;if(!sandAt(x>>1,y>>1))continue;const w=rng()<.5?2:3;
    g.fillStyle='#6a4228';g.fillRect(x,y+1,w,1);g.fillStyle='#a8784c';g.fillRect(x,y,w,1);g.fillStyle='#d8a874';g.fillRect(x,y,1,1);}
  for(let k=0;k<14;k++){let x=rng()*A,y=rng()*A;const a=rng()*6.283,ph=rng()*6;if(!sandAt(x>>1,y>>1))continue;
    for(let s=0;s<90;s++){const ox=Math.cos(a)*s,oy=Math.sin(a)*s,w=Math.sin(s*.22+ph)*4;const px=x+ox-Math.sin(a)*w,py=y+oy+Math.cos(a)*w;
      if(px<30||py<30||px>A-30||py>A-30)break;g.fillStyle='#a87038';g.fillRect(px|0,py|0,1,1);g.fillStyle='#f2d496';g.fillRect(px|0,(py|0)-1,1,1);}}
  const props=[],lights=[];
  const free=(x,y,r)=>!props.some(q=>Math.hypot(q.x-x,q.y-y)<r);
  const shadowAt=(x,y,rx,ry,a)=>{g.globalAlpha=a;g.fillStyle='#5a2e14';g.beginPath();g.ellipse(x*Z,y*Z,rx*Z,ry*Z,0,0,6.283);g.fill();g.globalAlpha=1;};
  const put=(k,x,y,tall,sh)=>{const s=typeof k==='string'?dsSprite(k):k;if(sh!==0)shadowAt(x+s.w*.12,y-.5,s.w*.46,Math.max(1.4,s.h*.08),sh||.3);props.push({isProp:true,x,y,spr:s,tall:!!tall});return s;};
  // temple: obelisks on the plaza corners, braziers flanking each causeway
  for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=C+sx*(PH-10),y=C+sy*(PH-10);const s=put('obelisk',x,y,true,.32);lights.push({x,y:y-s.h+5,r:22,col:'#7ad8ff',a:.7});}
  for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]])for(const sd of [-1,1]){const x=C+dx*(PH+4)+(dy?sd*(RW+6):0),y=C+dy*(PH+4)+(dx?sd*(RW+6):0)+(dy>0?6:0);
    const s=put('brazier',x,y,false,.28);lights.push({x,y:y-s.h+1,r:40,col:'#ffa040',a:1});}
  // broken colonnades along the causeways
  for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]])for(let s=PH+40;s<size/2-50;s+=46+rng()*18)for(const sd of [-1,1]){if(rng()<.25)continue;
    const x=C+dx*s+(dy?sd*(RW+7):0),y=C+dy*s+(dx?sd*(RW+7):0);const r=rng();
    if(r<.3){const k=put('fallen',x+(dy?sd*8:0),y+(dx?sd*6:0),false,.25);}else put(r<.62?'column':'stump',x,y,r<.62,.3);}
  // oases: palms, reeds and a cool light
  for(const o of oases){
    for(let k=0;k<5;k++){const a=k/5*6.283+rng()*.6,x=o.x+Math.cos(a)*(o.r*1.35+6+rng()*8),y=o.y+Math.sin(a)*(o.r+5+rng()*6);if(!free(x,y,10))continue;
      put(makePalm(def.seed*77+props.length),x,y,true,.3);}
    for(let k=0;k<70;k++){const a=rng()*6.283,d=.95+rng()*.2,x=(o.x+Math.cos(a)*o.r*1.35*d)*Z,y=(o.y+Math.sin(a)*o.r*d)*Z;
      g.fillStyle=pick(['#3a6a28','#4e8434','#6aa040']);g.fillRect(x|0,(y|0)-3,1,4);g.fillRect((x|0)+2,(y|0)-2,1,3);if(rng()<.3){g.fillStyle='#8a5a2a';g.fillRect(x|0,(y|0)-4,1,2);}}
    lights.push({x:o.x,y:o.y,r:o.r*1.6,col:'#5ad0e0',a:.55});}
  // the giant skeleton: skull, spine and a row of half-buried ribs
  {const dir=Math.atan2(C-SK.y,C-SK.x),ux=Math.cos(dir),uy=Math.sin(dir);
    for(let k=0;k<7;k++){const x=SK.x-ux*k*12,y=SK.y-uy*k*12;g.fillStyle='#d8c8a4';rowsCircle(g,Math.round(x*Z),Math.round(y*Z),3);g.fillStyle='#8a6a48';g.fillRect(Math.round(x*Z)-3,Math.round(y*Z)+2,7,1);}
    for(let k=1;k<6;k++){const x=SK.x-ux*k*12,y=SK.y-uy*k*12;put('rib',x,y+2,true,.25);}
    put('skull',SK.x+ux*14,SK.y+uy*14+4,false,.3);
    for(let k=0;k<5;k++)put('bones',SK.x+(rng()-.5)*70,SK.y+(rng()-.5)*60,false,0);}
  // mesas hug the walls, boulders scatter in the open
  const mesas=[0,1,2,3].map(i=>makeMesa(def.seed*13+i,true)),rocks=[0,1,2].map(i=>makeMesa(def.seed*29+i,false));
  const clear=(x,y,r)=>Math.hypot(x-C,y-C)>PH*1.5&&!onRoad(x,y)&&!onRoad(x,y-10)&&oasisD(x,y)>1.9&&Math.hypot(x-SK.x,y-SK.y)>70&&free(x,y,r);
  for(let k=0;k<160;k++){const side=(rng()*4)|0,d=30+rng()*70;const x=side===0?d:side===1?size-d:40+rng()*(size-80),y=side===2?d+20:side===3?size-d:40+rng()*(size-80);
    if(!clear(x,y,38))continue;put(pick(mesas),x,y,true,.32);}
  for(let k=0;k<10;k++){const x=120+rng()*(size-240),y=120+rng()*(size-240);if(!clear(x,y,60))continue;put(pick(mesas),x,y,true,.32);}
  for(let k=0;k<80;k++){const x=30+rng()*(size-60),y=30+rng()*(size-60);if(!clear(x,y,22))continue;put(pick(rocks),x,y,false,.3);}
  for(let k=0;k<110;k++){const x=30+rng()*(size-60),y=30+rng()*(size-60);if(!clear(x,y,18))continue;const r=rng();
    put(r<.35?'cactus':r<.55?'cactus2':r<.75?'barrel':'scrub',x,y,r<.55,.26);}
  for(let k=0;k<40;k++){const x=30+rng()*(size-60),y=30+rng()*(size-60);if(!clear(x,y,14))continue;put(rng()<.6?'bones':'rock',x,y,false,0);}
  for(let k=0;k<26;k++){const a=rng()*6.283,d=PH+8+rng()*60,x=C+Math.cos(a)*d,y=C+Math.sin(a)*d;if(onRoad(x,y)||onPlaza(x,y)||!free(x,y,12))continue;put('urn',x,y,false,.25);}
  // sandstone cliff around the arena, in strata
  const T=12*Z;
  for(let y=0;y<A;y++)for(let x=0;x<A;x++){if(x>=T&&y>=T&&x<A-T&&y<A-T){x=A-T-1;continue;}
    const band=Math.floor((Math.min(x,y,A-1-x,A-1-y)+((hashN(x>>3,y>>3,2)*3)|0))/4);g.fillStyle=['#8a4a2a','#a85e36','#c27444','#9a5430','#b86a3c','#d08850'][band%6];
    if(hashN(x,y,1)>.9)g.fillStyle='#6a3420';g.fillRect(x,y,1,1);}
  g.fillStyle='#f0c088';g.fillRect(T,T-1,A-2*T,1);g.fillRect(T-1,T,1,A-2*T);
  for(let i=0;i<8;i++){g.fillStyle='rgba(60,20,8,'+(.34-i*.04)+')';g.fillRect(T,T+i,A-2*T,1);g.fillRect(T+i,T,1,A-2*T);}
  props.sort((a,b)=>a.y-b.y);
  return {canvas:c,pools:[],oases,def,props,lights};
}
