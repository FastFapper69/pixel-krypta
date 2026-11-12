// Komiksové cutscény v3 – animovaný prototyp. Kreslí se stejně jako by to dělala hra (canvas, sprity ze SPR),
// snímky po 1/24 s → ffmpeg. 1 art px = 1 CSS px, písmo Jersey v nativní velikosti (ostré), video ×2 nearest.
const L=require(process.env.LIB||'../../lib.js'),fs=require('fs'),path=require('path');
const OUT=process.env.OUT||path.join(__dirname,'frames'),FPS=24,ONLY=process.argv[2];
(async()=>{
const {p,errs,close}=await L.open({phone:'15',dpr:1});
await p.evaluate(()=>Promise.all(['18.6667px "Jersey 10"','27px "Jersey 15"','34px "Jersey 20"'].map(f=>document.fonts.load(f))));
await p.evaluate(()=>{const K=window.__krypta,SPR=K.SPR,MB=K.mapsBuilt;
 const AW=393,AH=852,BEAT=.5;
 const B4=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return [c,g];};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>1-Math.pow(1-clamp(t,0,1),3),snap=v=>Math.round(v/2)*2;
 // ---- dither masks (2px Bayer) for pixel dissolve ----
 const MASK=[];for(let l=0;l<=16;l++){const [c,g]=cv(8,8);g.fillStyle='#000';for(let j=0;j<4;j++)for(let i=0;i<4;i++)if(B4[j*4+i]<l)g.fillRect(i*2,j*2,2,2);MASK.push(c);}
 function dissolve(g,w,h,p){const l=Math.round(clamp(p,0,1)*16);if(l>=16)return;g.save();g.globalCompositeOperation='destination-in';g.fillStyle=g.createPattern(MASK[l],'repeat');g.fillRect(0,0,w,h);g.restore();}
 // ---- drawing helpers ----
 function grad(g,x,y,w,h,cs,off){const b=2;for(let j=0;j<h;j+=b)for(let i=0;i<w;i+=b){const q=((j/b)&3)*4+((i/b)&3),v=(j/h)*(cs.length-1)+(B4[q]/16-.5)*.95+(off||0);g.fillStyle=cs[clamp(Math.round(v),0,cs.length-1)];g.fillRect(x+i,y+j,b,b);}}
 function glow(g,cx,cy,r,col,a){const b=2;cx=snap(cx);cy=snap(cy);g.fillStyle=col;g.globalAlpha=.35;for(let j=-r;j<=r;j+=b)for(let i=-r;i<=r;i+=b){const d=Math.hypot(i,j)/r;if(d>1)continue;const q=(((j/b)&3)*4)+((i/b)&3);if((1-d)*(a==null?1:a)*16>B4[q]+(d>.5?4:0))g.fillRect(cx+i,cy+j,b,b);}g.globalAlpha=1;}
 function silC(s,col){const c=s.c,[t,x]=cv(c.width,c.height);x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,t.width,t.height);return t;}
 const SILC={};function sil(s,col){const k=(s.id||'')+col;return SILC[k]||(SILC[k]=silC(s,col));}
 function spr(g,s,x,y,k,o){o=o||{};let c=o.white?s.f:s.c;if(o.sil)c=silC(s,o.sil);const w=c.width*k,h=c.height*k;
  const dr=(cc,dx,dy)=>{g.save();g.translate(snap(x+dx),snap(y+dy));if(o.flip){g.scale(-1,1);g.drawImage(cc,-w,0,w,h);}else g.drawImage(cc,0,0,w,h);g.restore();};
  if(o.rim){const r=silC(s,o.rim);dr(r,-k,0);dr(r,k,0);dr(r,0,-k);}dr(c,0,0);return [w,h];}
 function crop(g,id,cx,cy,x,y,w,h){if(!MB[id])K.buildMap(id);g.drawImage(MB[id].canvas,cx-w/2,cy-h/2,w,h,x,y,w,h);}
 function tint(g,x,y,w,h,col,a){g.globalAlpha=a;g.fillStyle=col;g.fillRect(x,y,w,h);g.globalAlpha=1;}
 function rng(s){return()=>(s=(s*16807)%2147483647)/2147483647;}
 function stars(g,w,h,n,seed,t){const R=rng(seed);for(let i=0;i<n;i++){const v=R(),x=Math.floor(R()*w/2)*2,y=Math.floor(R()*h/2)*2,tw=Math.sin(t*3+i)>.7;g.fillStyle=tw||v<.12?'#fff6c8':v<.5?'#8a86b8':'#3a3670';g.fillRect(x,y,2,2);}}
 const SH=['....c...','...cwc..','..cwccb.','.ccccbbd','..cbbbd.','...bbd..','....d...'],SHP={c:'#9ad8ff',b:'#4a7ac8',w:'#ffffff',d:'#2a3a78',y:'#f6c744',k:'#3a2408',l:'#c28a10'};
 function shard(g,x,y,k,eye){x=snap(x);y=snap(y);const rows=SH.map(r=>r.split(''));
  for(let j=0;j<7;j++)for(let i=0;i<8;i++)if(rows[j][i]!=='.'){g.fillStyle='#120a10';g.fillRect(x+i*k-2,y+j*k-2,k+4,k+4);}
  for(let j=0;j<7;j++)for(let i=0;i<8;i++){const c=rows[j][i];if(c!=='.'){g.fillStyle=SHP[c];g.fillRect(x+i*k,y+j*k,k,k);}}
  if(eye>0)drawEye(g,x+4*k+(k>=6?0:0),y+3.5*k,k>=6?1:0,eye,arguments[5]||0);}
 // almond eye: lid opens with o (0..1), pupil looks l (-1..1); big=1 for close-ups
 function drawEye(g,cx,cy,big,o,l){const W=big?14:3,Hh=Math.round((big?6:2)*clamp(o,0,1));cx=snap(cx);cy=snap(cy);
  if(!big){g.fillStyle='#f6c744';g.fillRect(cx-2,cy-2,6,4);g.fillStyle='#3a2408';g.fillRect(cx,cy-2,2,4);return;}
  g.fillStyle='#120a10';for(let i=-W-2;i<=W+2;i+=2){const hh=Math.max(2,Math.round(Math.sqrt(Math.max(0,1-(i/(W+2))**2))*(Hh+2)/2)*2);g.fillRect(cx+i,cy-hh,2,hh*2);}
  if(Hh<=0){g.fillStyle='#c28a10';g.fillRect(cx-W,cy-2,W*2+2,2);return;}
  g.fillStyle='#fff0b0';for(let i=-W;i<=W;i+=2){const hh=Math.round(Math.sqrt(Math.max(0,1-(i/W)**2))*Hh/2)*2;if(hh>0)g.fillRect(cx+i,cy-hh,2,hh*2);}
  const px=cx+snap(l*6);g.fillStyle='#f6c744';g.fillRect(px-4,cy-Math.min(Hh,6),10,Math.min(Hh,6)*2);g.fillStyle='#3a2408';g.fillRect(px-2,cy-Math.min(Hh,4),6,Math.min(Hh,4)*2);g.fillStyle='#ffffff';g.fillRect(px+2,cy-Math.min(Hh,4),2,2);}
 // particles made of a sprite's own pixels (crumbling boss)
 function crumble(g,s,x,y,k,t,dur,seed){const c=s.c,w=c.width,h=c.height;if(!s._px){const d=c.getContext('2d').getImageData(0,0,w,h).data,P=[];for(let j=Math.round(h*.2);j<h;j+=2)for(let i=0;i<w;i+=2){const a=d[(j*w+i)*4+3];if(a>100)P.push([i,j,'rgb('+d[(j*w+i)*4]+','+d[(j*w+i)*4+1]+','+d[(j*w+i)*4+2]+')']);}s._px=P;}
  const R=rng(seed||5);for(const [i,j,col] of s._px){const delay=(j/h)*dur*.6+R()*dur*.15,lt=t-delay,vx=(R()-.5)*60,vy=-R()*50;
   if(lt<=0){g.fillStyle=col;g.fillRect(snap(x+i*k),snap(y+j*k),2*k,2*k);continue;}
   if(lt>1.2)continue;g.globalAlpha=1-lt/1.2;g.fillStyle=lt<.08?'#ffffff':col;g.fillRect(snap(x+i*k+vx*lt),snap(y+j*k+vy*lt+160*lt*lt),2,2);g.globalAlpha=1;}}
 // ---- frames: carved bone (or gold) with bevel, rivets and a drop shadow ----
 const FR={bone:['#f4ecd2','#d8ccaa','#8a7e62','#c9a24a'],gold:['#fff0b0','#e0b048','#8a5a10','#fff6d8'],stone:['#a8a4b8','#7a7690','#3e3a50','#c8c4d8'],ice:['#e8f8ff','#a8d8f0','#4a7aa8','#ffffff']};
 function poly(g,P,dx,dy,inf){const cx=P.reduce((a,q)=>a+q[0],0)/P.length,cy=P.reduce((a,q)=>a+q[1],0)/P.length;g.beginPath();P.forEach((q,i)=>{const x=q[0]+dx+Math.sign(q[0]-cx)*inf,y=q[1]+dy+Math.sign(q[1]-cy)*inf;i?g.lineTo(x,y):g.moveTo(x,y);});g.closePath();}
 function frameBack(g,P,st){g.fillStyle='rgba(0,0,0,.6)';poly(g,P,6,8,10);g.fill();g.fillStyle='#120a10';poly(g,P,0,0,10);g.fill();
  const C=FR[st||'bone'],ring=(a,b,dx,dy,col)=>{const p=new Path2D(),add=(inf,ox,oy)=>{const cx=P.reduce((q,v)=>q+v[0],0)/P.length,cy=P.reduce((q,v)=>q+v[1],0)/P.length;P.forEach((q,i)=>{const x=q[0]+ox+Math.sign(q[0]-cx)*inf,y=q[1]+oy+Math.sign(q[1]-cy)*inf;i?p.lineTo(x,y):p.moveTo(x,y);});p.closePath();};add(a,0,0);add(b,dx,dy);g.fillStyle=col;g.fill(p,'evenodd');};
  g.save();poly(g,P,0,0,8);g.clip();g.fillStyle=C[1];poly(g,P,0,0,8);g.fill();
  ring(8,8,2,2,C[0]);ring(8,8,-2,-2,C[2]); // light top/left, shade bottom/right
  // carved notches along the band every 24px (subtle)
  g.restore();g.fillStyle='#120a10';poly(g,P,0,0,2);g.fill();}
 function rivets(g,P,st){const C=FR[st||'bone'],cx=P.reduce((a,q)=>a+q[0],0)/P.length,cy=P.reduce((a,q)=>a+q[1],0)/P.length;
  for(const q of P){const x=snap(q[0]+Math.sign(q[0]-cx)*5)-6,y=snap(q[1]+Math.sign(q[1]-cy)*5)-6;
   g.fillStyle='#120a10';g.fillRect(x-2,y-2,16,16);g.fillStyle=C[2];g.fillRect(x,y,12,12);g.fillStyle=C[1];g.fillRect(x,y,10,10);g.fillStyle=C[0];g.fillRect(x,y,10,2);g.fillRect(x,y,2,10);
   g.fillStyle='#120a10';g.fillRect(x+4,y+4,4,4);g.fillStyle=C[3];g.fillRect(x+4,y+4,2,2);}}
 // ---- text (drawn on the same canvas, native pixel font sizes) ----
 const F={s:'18.6667px "Jersey 10"',m:'27px "Jersey 15"',l:'34px "Jersey 20"'};
 function tw(g,t,f){g.font=f||F.s;return Math.ceil(g.measureText(t).width);}
 function caption(g,x,y,txt,p,o){o=o||{};if(p<=0)return;const full=tw(g,txt)+18,h=26;if(o.right)x-=full;x=snap(x);y=snap(y);
  const n=Math.ceil(txt.length*clamp(p*1.6,0,1)),s=txt.slice(0,n),w=full; // box appears whole, text types in
  const drop=snap((1-ease(p*4))*-8);y+=drop;
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(x+4,y+4,w,h);g.fillStyle='#120a10';g.fillRect(x-2,y-2,w+4,h+4);
  g.fillStyle=o.bg||'#e8d6a4';g.fillRect(x,y,w,h);g.fillStyle=o.hi||'#f6ead0';g.fillRect(x,y,w,2);g.fillStyle=o.lo||'#b89c66';g.fillRect(x,y+h-2,w,2);
  // torn right edge
  g.fillStyle='#120a10';for(let j=0;j<h;j+=4){const d=((j/4)&1)?2:0;g.fillRect(x+w-2+d,y+j,4,4);}g.fillStyle=o.bg||'#e8d6a4';for(let j=0;j<h;j+=4){if((j/4)&1)g.fillRect(x+w-2,y+j,2,4);}
  g.font=F.s;g.fillStyle=o.fg||'#2a1a0c';g.fillText(s,x+9,y+18);}
 function bubble(g,x,y,txt,tx,p,o){o=o||{};if(p<=0)return;const w=tw(g,txt)+20,h=26,bg=o.bg||'#ffffff',ink='#120a10';if(o.right)x-=w;x=snap(x);y=snap(y);
  const pop=p<.12?2:0;x-=pop;y-=pop; // one-frame pop
  const bx=snap(clamp(tx,x+10,x+w-20)),dn=!o.up,by=dn?y+h:y,sd=o.left?-2:2;
  for(let i=0;i<14;i+=2){const ww=Math.max(2,10-Math.round(i*.3)*2),xx=bx+Math.round(i/4)*sd,yy=dn?by+i:by-i-2;g.fillStyle=ink;g.fillRect(xx-2,yy,ww+4,i>=12?4:2);g.fillStyle=bg;g.fillRect(xx,yy,ww,2);}
  g.fillStyle=ink;g.fillRect(x+2,y-2,w-4,h+4);g.fillRect(x-2,y+2,w+4,h-4);g.fillRect(x,y,w,h);g.fillStyle=bg;g.fillRect(x+2,y,w-4,h);g.fillRect(x,y+2,w,h-4);
  const n=Math.ceil(txt.length*clamp(p*1.8,0,1));g.font=F.s;g.fillStyle=o.fg||ink;g.fillText(txt.slice(0,n),x+10,y+18);}
 function sfxWord(g,x,y,txt,col,p){if(p<=0)return;const f=p<.06?F.m:F.l;g.font=f;g.textAlign='center';const j=p<.3?snap(Math.sin(p*90)*2):0;x=snap(x)+j;y=snap(y);
  g.fillStyle='#120a10';for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2],[2,2],[4,4],[-2,-2],[2,-2],[-2,2]])g.fillText(txt,x+dx,y+dy);g.fillStyle=col;g.fillText(txt,x,y);g.textAlign='left';}
 function tag(g,x,y,txt,p){if(p<=0)return;g.font=F.m;g.textAlign='right';const s=txt.slice(0,Math.ceil(txt.length*clamp(p*2,0,1)));
  g.fillStyle='#120a10';for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2],[2,2]])g.fillText(s,x+dx,y+dy);g.fillStyle='#f6c744';g.fillText(s,x,y);g.textAlign='left';}
 // ---- comic player ----
 const top=74,bot=804,X0=14,PW=365;
 const PAGE=(()=>{const [c,g]=cv(AW,AH);g.fillStyle='#0b0810';g.fillRect(0,0,AW,AH);const R=rng(9);for(let i=0;i<900;i++){g.fillStyle=R()<.5?'#100c16':'#09060c';g.fillRect(snap(R()*AW),snap(R()*AH),2,2);}
  for(let j=0;j<AH;j+=2)for(let i=0;i<AW;i+=2){const d=Math.hypot((i-AW/2)/AW,(j-AH/2)/AH)*2;if(d>.8&&B4[((j/2)&3)*4+((i/2)&3)]<(d-.8)*40){g.fillStyle='#040306';g.fillRect(i,j,2,2);}}return c;})();
 // panel = {pts, t0 (beats), st (frame style), from:[dx,dy], draw(g,t,ox,oy,w,h) → in panel-local coords, ov(g,t) overlay text in page coords}
 function frame(C,T){const [c,g]=cv(AW,AH);g.drawImage(PAGE,0,0);const t=T/BEAT;let shake=0;
  for(const P of C.panels){const lt=t-P.t0;if(lt<0)continue;const xs=P.pts.map(q=>q[0]),ys=P.pts.map(q=>q[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
   const enter=clamp(lt/.6,0,1),fr=P.from||[0,24],ox=snap(fr[0]*(1-ease(enter))),oy=snap(fr[1]*(1-ease(enter)));if(lt<.25)shake=Math.max(shake,0);
   if(lt>=.6&&lt<.8)shake=Math.max(shake,P.hit||2);
   const pts=P.pts.map(q=>[q[0]+ox,q[1]+oy]);
   // content into its own canvas, clipped to the panel shape
   const [pc,pg]=cv(w,h);pg.save();pg.beginPath();P.pts.forEach((q,i)=>{i?pg.lineTo(q[0]-x0,q[1]-y0):pg.moveTo(q[0]-x0,q[1]-y0);});pg.closePath();pg.clip();P.draw(pg,lt*BEAT,w,h,lt);pg.restore();
   // older panels dim a little once the next one is on (focus on the newest)
   const next=C.panels.find(q=>q.t0>P.t0),dim=next&&t>next.t0?clamp((t-next.t0)/1,0,1)*.28:0;if(dim){pg.save();pg.globalCompositeOperation='source-atop';pg.globalAlpha=dim;pg.fillStyle='#05030a';pg.fillRect(0,0,w,h);pg.restore();}
   dissolve(pg,w,h,enter*1.4);
   g.save();g.globalAlpha=1;const fa=clamp(enter*2,0,1);if(fa<1){const [fc,fg]=cv(AW,AH);frameBack(fg,pts,P.st);rivets(fg,pts,P.st);dissolve(fg,AW,AH,fa);g.drawImage(fc,0,0);}else{frameBack(g,pts,P.st);rivets(g,pts,P.st);}g.restore();
   g.drawImage(pc,x0+ox,y0+oy);
   if(P.ov)P.ov(g,lt*BEAT,lt);}
  if(C.after)C.after(g,t);
  // tap hint after the last panel settles: arrow nudges right on the beat
  const last=C.panels[C.panels.length-1],lt=T-last.t0*BEAT;if(lt>(C.hint||4)){const b=(Math.floor(T/BEAT)&1)*2,x=AW-36+b,y=AH-34;g.fillStyle='#120a10';for(let i=0;i<8;i++)g.fillRect(x-2,y-2+i*2,4+i*2>16?16-(i-6)*4:4+(i<4?i*4:(7-i)*4),2);g.fillStyle='#f6c744';for(let i=0;i<7;i++){const ww=i<4?i*4:(6-i)*4;if(ww>0)g.fillRect(x,y+i*2,ww,2);}g.fillRect(x,y,2,14);}
  if(shake){const [s2,sg]=cv(AW,AH);sg.drawImage(c,0,0);g.fillStyle='#0b0810';g.fillRect(0,0,AW,AH);g.drawImage(s2,(Math.floor(T*30)&1)?shake:-shake,0);}
  return c;}
 const R=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
 // ================= COMICS =================
 const C={};
 // ---------- PROLOG ----------
 {const H1=212,y1=top,y2=y1+H1+34,H2=212,y3=y2+H2+34;
 C.prolog={len:9.5,panels:[
  {pts:R(X0,y1,PW,H1),t0:0,from:[0,-24],draw(g,s,w,h){grad(g,0,0,w,h,['#05040e','#0c0a24','#18123a','#261a4c']);stars(g,w,h,90,11,s);
    const cx=184,cy=96,crack=s>1.0,pulse=crack?1:.6+.4*Math.sin(s*8);glow(g,cx,cy,crack?40+Math.min(60,(s-1)*80):40+pulse*10,'#ffe9a8',crack?clamp(1.6-(s-1),0,1):pulse);
    if(s>1&&s<1.12){g.fillStyle='#ffffff';g.fillRect(0,0,w,h);}
    const r=14;for(let i=-r;i<=r;i+=2)for(let j=-r;j<=r;j+=2)if(Math.abs(i)+Math.abs(j)<=r){g.fillStyle=Math.abs(i)+Math.abs(j)<=8?'#ffffff':'#fff0b0';g.fillRect(cx+i,cy+j,2,2);}
    const fl=crack?20:24+snap(Math.sin(s*8)*4);g.fillStyle='#f6c744';g.fillRect(cx-fl,cy,fl*2,2);g.fillRect(cx,cy-fl,2,fl*2);
    if(crack){g.fillStyle='#120a10';[[0,-12],[2,-10],[2,-8],[0,-6],[-2,-4],[-2,-2],[0,0],[2,2],[2,4],[4,6],[2,8],[4,10]].forEach(q=>g.fillRect(cx+q[0],cy+q[1],2,2));
     const ft=s-1;[[-130,80],[-80,110],[100,96],[150,30],[44,120],[-160,-10],[160,-50]].forEach((q,i)=>{const pr=ease(ft*.9);const x=cx+q[0]*pr,y=cy+q[1]*pr;for(let k=0;k<8;k++){g.globalAlpha=1-k/8;g.fillStyle=k?'#9ad8ff':'#ffffff';g.fillRect(snap(x-q[0]/18*k*pr),snap(y-q[1]/18*k*pr),k?2:4,k?2:4);}g.globalAlpha=1;});}},
   ov(g,s){sfxWord(g,300,y1+64,'KRAK!','#ffe27a',s>1?s-1:0);caption(g,X0+16,y1+H1-40,'Hvězda se rozbila.',(s-1.4)/1);}},
  {pts:[[X0,y2],[X0+PW,y2],[X0+PW,y2+H2-24],[X0,y2+H2]],t0:6,from:[-24,0],draw(g,s,w,h){grad(g,0,0,w,h,['#1a0614','#3a0e1e','#6a2420','#a8482a']);
    g.fillStyle='#120610';g.fillRect(0,170,w,80);for(let i=0;i<w;i+=6){const hh=6+((i*37)%17);g.fillRect(i,170-hh,6,hh);}
    [['morvan',14,84,'#140818',0],['sphinx',144,64,'#1e0c08',.5],['queen',270,90,'#080c1e',1]].forEach(([id,x,y,c,d])=>{const sp=SPR.boss[id];spr(g,sp,x,y,1,{sil:c,rim:'#ff7a4a'});
     const ex=x+Math.round(sp.c.width/2),lt=s-.4-d*.35,land=lt>.6;
     if(lt>0&&!land){const yy=-20+(y+14+20)*ease(lt/.6);for(let k=0;k<10;k++){g.globalAlpha=1-k/10;g.fillStyle='#9ad8ff';g.fillRect(snap(ex+k*3),snap(yy-k*6),2,2);}g.globalAlpha=1;shard(g,ex-8,yy,2,0);}
     if(land){glow(g,ex,y+28,24,'#9ad8ff',clamp((lt-.6)*3,0,1));shard(g,ex-8,y+14,2,0);g.fillStyle='#ff4a2a';g.fillRect(ex-12,y+40,2,2);g.fillRect(ex+10,y+40,2,2);}});},
   ov(g,s){caption(g,X0+16,y2+H2-64,'Střepy si vzali tyrani.',(s-1.5)/1);}},
  {pts:[[X0,y3+22],[X0+PW,y3],[X0+PW,bot],[X0,bot]],t0:12,from:[0,24],draw(g,s,w,h){g.fillStyle='#0e0c16';g.fillRect(0,0,w,h);
    for(let r=0;r*14<h;r++)for(let c=-1;c*28<w;c++){const bx=c*28+(r&1?14:0),by=r*14,v=((r*7+c*13)%5+5)%5;g.fillStyle=['#24202e','#2a2634','#201c2a','#2e2a3a','#262230'][v];g.fillRect(bx+2,by+2,24,10);g.fillStyle='#34303f';g.fillRect(bx+2,by+2,24,2);}
    const fy=h-58;g.fillStyle='#14111c';g.fillRect(0,fy,w,58);for(let i=0;i<w;i+=32){g.fillStyle='#1c1826';g.fillRect(i+2,fy+4,28,22);g.fillRect(i+18,fy+30,28,22);}
    const wx=164,wy=34;g.fillStyle='#08060e';g.fillRect(wx-4,wy+20,48,64);for(let i=0;i<24;i+=2){const ww=Math.round(Math.sqrt(1-((24-i)/24)**2)*24)*2;g.fillRect(wx+20-ww/2-4,wy+i,ww+8,2);}
    g.fillStyle='#1a2050';g.fillRect(wx,wy+20,40,60);for(let i=4;i<24;i+=2){const ww=Math.round(Math.sqrt(1-((24-i)/24)**2)*20)*2;g.fillRect(wx+20-ww/2,wy+i,ww,2);}g.fillStyle='#fff6c8';g.fillRect(wx+24,wy+14,6,6);g.fillStyle='#08060e';g.fillRect(wx+18,wy+4,4,76);g.fillRect(wx,wy+44,40,4);
    // moonlight shaft with drifting dust
    for(let j=110;j<h;j+=2){const ww=40+(j-110)*1.1,x=184-ww/2+(j-110)*.2;for(let i=0;i<ww;i+=2)if((((i+j)/2)&1)===0){g.globalAlpha=.16;g.fillStyle='#cfe8ff';g.fillRect(snap(x)+i,j,2,2);}}g.globalAlpha=1;
    const Rr=rng(4);for(let i=0;i<14;i++){const x=150+Rr()*80,y=(130+Rr()*150+s*12*(.5+Rr()))%(h-60)+110;g.fillStyle='#e8f4ff';g.fillRect(snap(x+Math.sin(s*2+i)*6),snap(y),2,2);}
    // sarcophagus: lid slides off, the hero rises
    const sx=134,sy=h-70,lid=ease((s-.6)/.8);g.fillStyle='#120a10';g.fillRect(sx-2,sy-2,112,40);g.fillStyle='#5a5466';g.fillRect(sx,sy,108,36);g.fillStyle='#3a3446';g.fillRect(sx,sy+30,108,6);for(let i=8;i<100;i+=16){g.fillStyle='#46404f';g.fillRect(sx+i,sy+10,10,14);g.fillStyle='#6a6474';g.fillRect(sx+i,sy+10,10,2);}
    const hs=SPR.hero.knight,rise=ease((s-1.4)/1);if(s>1.4){glow(g,sx+54,sy-24,56,'#cfe8ff',.8*rise);g.save();g.beginPath();g.rect(0,0,w,sy+6);g.clip();spr(g,hs,sx+54-hs.c.width*1.5,sy+6-hs.c.height*3*rise+(rise>=1?snap(Math.sin(s*4)):0),3);g.restore();}
    g.fillStyle='#120a10';g.fillRect(snap(sx-2+lid*96),snap(sy-14+lid*10),112,14);g.fillStyle='#7a7484';g.fillRect(snap(sx+lid*96),snap(sy-12+lid*10),108,10);g.fillStyle='#8a8494';g.fillRect(snap(sx+lid*96),snap(sy-12+lid*10),108,2);
    if(s>.6&&s<1.6)for(let i=0;i<6;i++){g.fillStyle='#8a8494';g.fillRect(snap(sx+100+i*6+(s-.6)*20),snap(sy-4-((s-.6)*30)%12),2,2);}},
   ov(g,s){sfxWord(g,330,y3+bot-y3-118,'SKŘÍP','#c8c4d8',s>.6&&s<1.6?(s-.6):0);bubble(g,X0+22,y3+72,'…kde to jsem?',150,(s-2.4)/.8);caption(g,X0+PW-16,bot-40,'Jdi si pro ně.',(s-3.3)/.8,{right:1,bg:'#f6c744',hi:'#fff0b0',lo:'#c28a10'});}}]};}
 // ---------- KAPITOLA I ----------
 {const H1=228,y1=top,y2=y1+H1+34,H2=200,y3=y2+H2+34;
 C.c1={len:9.5,panels:[
  {pts:R(X0,y1,PW,H1),t0:0,hit:4,from:[0,-24],draw(g,s,w,h){g.fillStyle='#1a0e24';g.fillRect(0,0,w,h);crop(g,'trun',450,450,0,0,w,h);tint(g,0,0,w,h,'#140620',.55);
    const cx=184,cy=118,hit=s>.5,rot=s*.15;g.globalAlpha=.5;g.fillStyle='#7aff9a';for(let i=0;i<28;i++){const an=i/28*6.283+rot;for(let rr=50;rr<240;rr+=6)g.fillRect(snap(cx+Math.cos(an)*rr),snap(cy+Math.sin(an)*rr),2,2);}g.globalAlpha=1;
    const sp=SPR.boss.morvan;glow(g,cx,cy,64,'#7aff9a',.7);
    if(s<2)spr(g,sp,cx-sp.c.width,cy-sp.c.height+(s>.5&&s<.62?4:0),2,{white:s>.5&&s<.62});else crumble(g,sp,cx-sp.c.width,cy-sp.c.height,2,s-2,1.4,3);
    // the crown (top rows of his sprite) drops to the floor, bounces once, stays
    if(s>=2){const cw=sp.c.width,chh=Math.round(sp.c.height*.2),ft=s-2.3,fy=ft<=0?0:ft<.45?ease(ft/.45)*150:ft<.6?150-Math.sin((ft-.45)/.15*Math.PI)*10:150,y0=cy-sp.c.height;
     g.drawImage(sp.c,0,0,cw,chh,snap(cx-cw),snap(y0+fy),cw*2,chh*2);}
    [[-120,-70],[130,-80],[-150,30],[140,50],[-60,-100],[80,90],[-100,90]].forEach((q,i)=>{if(!hit)return;const pr=ease((s-.5)*1.2),x=cx+q[0]*pr,y=cy+q[1]*pr+Math.max(0,s-1.5)*20*((i%3)+1);g.fillStyle='#120a10';g.fillRect(snap(x)-2,snap(y)-2,16,8);g.fillStyle='#ece6d2';g.fillRect(snap(x),snap(y),12,4);});},
   ov(g,s){sfxWord(g,300,y1+56,'KŘUP!','#7aff9a',s-.5);bubble(g,X0+18,y1+H1-50,'Kosti… si nech…',150,(s-.9)/.9,{up:true});}},
  {pts:[[X0,y2],[X0+PW,y2+20],[X0+PW,y2+H2],[X0,y2+H2]],t0:7,from:[24,0],draw(g,s,w,h){grad(g,0,0,w,h,['#06050f','#0e0b22','#161236']);
    const k=10,sx=144,land=ease(s/.5),sy=snap(-80+(56+80)*land)+(s>.5&&s<.6?4:0);glow(g,sx+40,sy+34,90,'#9ad8ff',s>.5?.8+.15*Math.sin(s*5):.3);
    // the eye opens slowly, then glances left and right – somebody is watching
    const op=s<1.4?0:ease((s-1.4)/.6),look=s<2.4?0:clamp(Math.sin((s-2.4)*2.2)*1.6,-1,1);shard(g,sx,sy,k,op>0?op:0,look);if(op===0)drawEye(g,sx+4*k,sy+3.5*k,1,0,0);
    if(s>.5)for(let i=0;i<12;i++){const an=i/12*6.283+s*.6;g.fillStyle='#cfe8ff';g.fillRect(snap(sx+38+Math.cos(an)*80),snap(sy+34+Math.sin(an)*62),2,2);}},
   ov(g,s){caption(g,X0+16,y2+H2-42,'V prvním střepu je zlaté oko.',(s-2)/1);}},
  {pts:R(X0,y3,PW,bot-y3),t0:14,from:[0,24],draw(g,s,w,h){grad(g,0,0,w,110,['#f8e0a0','#f0c070','#e0a050']);
    const sun=[300,52];glow(g,sun[0],sun[1],50,'#fff0b0',1);g.fillStyle='#fff6d0';for(let i=-14;i<=14;i+=2)for(let j=-14;j<=14;j+=2)if(i*i+j*j<=196)g.fillRect(sun[0]+i,sun[1]+j,2,2);
    // pyramid on the horizon (the Sphinx's gate)
    g.fillStyle='#b06a2a';for(let i=0;i<26;i+=2)g.fillRect(snap(90-i),snap(94-26+i),i*2+2,2);g.fillStyle='#8a4a1a';for(let i=0;i<26;i+=2)g.fillRect(90,snap(94-26+i),i+2,2);
    // three dune bands, parallax
    const band=(y0,amp,col,sp,ph)=>{g.fillStyle=col;for(let x=0;x<w;x+=2){const yy=snap(y0+Math.sin((x+s*sp)/46+ph)*amp+Math.sin((x+s*sp)/17)*2);g.fillRect(x,yy,2,h-yy);}};
    band(96,6,'#e0a860',4,0);band(130,10,'#d09048',10,1);band(176,14,'#b8743a',22,2);
    // the hero walks into the frame from the left, small bob in step
    const hs=SPR.hero.knight,wx=snap(-90+ease(s/2.4)*150),bob=Math.floor(s*6)&1?2:0;spr(g,hs,wx,h-112-bob,3,{rim:'#ffe9a8'});
    // footprints
    for(let i=0;i<6;i++){const fx=wx-20-i*22;if(fx>0){g.fillStyle='#a06030';g.fillRect(fx,h-26+(i&1)*4,4,2);}}},
   ov(g,s){tag(g,X0+PW-18,y3+38,'Kapitola II',(s-1)/.8);caption(g,X0+PW-16,bot-40,'Další leží v poušti.',(s-2)/1,{right:1});}}]};}
 // ---------- KAPITOLA IX – zvrat ----------
 {const H1=206,y1=top,y2=y1+H1+34,H2=170,y3=y2+H2+34;
 C.c9={len:10.5,panels:[
  {pts:R(X0,y1,PW,H1),t0:0,st:'gold',from:[0,-24],draw(g,s,w,h){crop(g,'dvur',470,470,0,0,w,h);tint(g,0,0,w,h,'#1a0c02',.45);
    const sp=SPR.boss.herald,sink=ease((s-.4)/1.4)*30,fl=s>.4&&(Math.floor(s*12)&1)&&s<1.2;spr(g,sp,184-sp.c.width,h-sp.c.height*2-4+sink,2,{white:fl});
    // the golden dust falling off him
    if(s>.4)for(let i=0;i<20;i++){const R=rng(i+1),x=110+R()*150,y=(R()*120+s*40*(.5+R()))%140+60;g.fillStyle='#ffd040';g.fillRect(snap(x),snap(y),2,2);}},
   ov(g,s){bubble(g,236,y1+32,'…Aurel.',224,(s-1.6)/.6);caption(g,X0+16,y1+H1-40,'Herold padl.',(s-.5)/.8);}},
  // memory panel: stone frame, sepia, shards light up one by one and fly to the hand
  {pts:R(X0,y2,PW,H2),t0:6,st:'stone',from:[-24,0],draw(g,s,w,h){grad(g,0,0,w,h,['#2a1804','#4a2c08','#6a4410']);
    const HX=286,HY=22,hk=6,closed=s>2.75;
    const OPEN=['.y.y.y.y....','.yYyYyYy....','.yYyYyYy.y..','.yYyYyYy.yy.','.yYYYYYYyYy.','.yYYYYYYYYy.','..yYYYYYYy..','...yYYYYy...','....yYYy....','....yYYy....'],
     FIST=['............','............','............','..yyyyyyy...','.yYyYyYyYy..','.yYYYYYYYyy.','.yYYYYYYYYy.','..yYYYYYYy..','....yYYy....','....yYYy....'];
    const hand=closed?FIST:OPEN,sq=closed&&s<2.9?2:0;
    hand.forEach((r,j)=>r.split('').forEach((c,i)=>{if(c==='.')return;g.fillStyle='#120a10';g.fillRect(HX+i*hk-2,HY+j*hk-2+sq,hk+4,hk+4);}));hand.forEach((r,j)=>r.split('').forEach((c,i)=>{if(c==='.')return;g.fillStyle=c==='y'?'#c8901a':'#ffd040';g.fillRect(HX+i*hk,HY+j*hk+sq,hk,hk);}));
    if(s>2.75)glow(g,HX+36,HY+40,44,'#ffd040',clamp((s-2.75)*2,0,1)*(.8+.2*Math.sin(s*6)));
    for(let i=0;i<7;i++){const on=s>.3+i*.25;if(!on)continue;const fly=ease((s-2.2-i*.06)/.5),x0=16+i*36,y0=60+(i%2)*14,x=x0+(HX+20-x0)*fly,y=y0+(HY+30-y0)*fly;if(fly>=1)continue;glow(g,x+12,y+12,18,'#9ad8ff',.6);shard(g,x,y,3,1);}
    // film-grain flicker = memory
    if(Math.floor(s*10)%4===0)tint(g,0,0,w,h,'#000000',.08);},
   ov(g,s){caption(g,X0+16,y2+H2-42,'Celou dobu jsi je nosil jemu.',(s-3)/1);}},
  // reveal: darkness, a sun rises behind a silhouette, the eyes open
  {pts:[[X0,y3],[X0+PW,y3+20],[X0+PW,bot],[X0,bot]],t0:14,st:'gold',hit:4,from:[0,24],draw(g,s,w,h){const rise=ease(s/2.2);
    grad(g,0,0,w,h,['#120604','#2a0a04','#5a1a08','#8a3a10'],(1-rise)*-2.5);
    const sx=184,sy=snap(h+40-rise*210);glow(g,sx,sy,110,'#ffe9a8',rise);g.fillStyle='#fff0b0';for(let i=-46;i<=46;i+=2)for(let j=-46;j<=46;j+=2)if(i*i+j*j<=46*46)g.fillRect(sx+i,sy+j,2,2);
    g.globalAlpha=.5*rise;g.fillStyle='#fff6d8';for(let i=0;i<36;i++){const an=i/36*6.283+s*.2;for(let rr=60;rr<300;rr+=6)g.fillRect(snap(sx+Math.cos(an)*rr),snap(sy+Math.sin(an)*rr),2,2);}g.globalAlpha=1;
    const sp=SPR.boss.aurel,ax=184-sp.c.width*1.5,ay=h-sp.c.height*3+20;spr(g,sp,ax,ay,3,{sil:'#140402',rim:s>2?'#ffd040':'#5a2a08'});
    // eyes open on the beat
    if(s>2.6){const op=s<2.75?2:6;g.fillStyle='#fff0b0';g.fillRect(snap(184-36),snap(ay+96-op/2),14,op);g.fillRect(snap(184+22),snap(ay+96-op/2),14,op);glow(g,184-29,ay+96,14,'#ffd040',.8);glow(g,184+29,ay+96,14,'#ffd040',.8);}},
   ov(g,s){bubble(g,X0+18,bot-50,'Děkuji ti, posle.',150,(s-3.2)/.8,{bg:'#1a0604',fg:'#ffe27a',up:true});}}]};}
 window.__cm={C,frame};
});
const names=ONLY?[ONLY]:['prolog','c1','c9'];
for(const n of names){const dir=path.join(OUT,n);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
 const len=await p.evaluate(n=>window.__cm.C[n].panels[window.__cm.C[n].panels.length-1].t0*0.5+ (window.__cm.C[n].tail||5.2),n);
 const N=Math.ceil(len*FPS);
 for(let i=0;i<N;i+=24){const urls=await p.evaluate(([n,a,b,F])=>{const o=[];for(let i=a;i<b;i++)o.push(window.__cm.frame(window.__cm.C[n],i/F).toDataURL());return o;},[n,i,Math.min(N,i+24),FPS]);
  urls.forEach((u,k)=>fs.writeFileSync(path.join(dir,String(i+k).padStart(4,'0')+'.png'),Buffer.from(u.split(',')[1],'base64')));}
 console.log(n,N,'snímků');}
console.log('chyby:',errs.length?errs:'žádné');await close();})();
