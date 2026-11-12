// Maketa komiksových cutscén v2: 1 art px = 1 CSS px jako ve hře; sprity a mapy ze hry, bez otáčení (rozbíjí pixely)
const L=require('../../lib.js');
(async()=>{
const {p,errs,close}=await L.open({phone:'15',dpr:3});
await p.evaluate(()=>Promise.all(['18.6667px "Jersey 10"','27px "Jersey 15"','34px "Jersey 20"'].map(f=>document.fonts.load(f))));
const pages=await p.evaluate(()=>{const K=window.__krypta,SPR=K.SPR,MB=K.mapsBuilt;
 const AW=393,AH=852,D=3;
 const B4=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 function page(draw){const a=document.createElement('canvas');a.width=AW;a.height=AH;const g=a.getContext('2d');g.imageSmoothingEnabled=false;
  const out=document.createElement('canvas');out.width=AW*D;out.height=AH*D;const o=out.getContext('2d');o.imageSmoothingEnabled=false;
  const T=[];draw(g,T);o.drawImage(a,0,0,out.width,out.height);for(const t of T)t(o);return out.toDataURL();}
 // dithered gradient in 2px blocks (same feel as map art)
 function grad(g,x,y,w,h,cs){const b=2;for(let j=0;j<h;j+=b)for(let i=0;i<w;i+=b){const q=((j/b)&3)*4+((i/b)&3),v=j/h*(cs.length-1)+(B4[q]/16-.5)*.95;g.fillStyle=cs[Math.max(0,Math.min(cs.length-1,Math.round(v)))];g.fillRect(x+i,y+j,b,b);}}
 function sil(s,col){const c=s.c,t=document.createElement('canvas');t.width=c.width;t.height=c.height;const x=t.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,t.width,t.height);return t;}
 function spr(g,s,x,y,k,o){o=o||{};let c=o.white?s.f:s.c;if(o.sil)c=sil(s,o.sil);const w=c.width*k,h=c.height*k;
  if(o.rim){const r=sil(s,o.rim);for(const [dx,dy] of [[-k,0],[k,0],[0,-k]])draw(r,dx,dy);}draw(c,0,0);
  function draw(cc,dx,dy){g.save();g.translate(Math.round(x+dx),Math.round(y+dy));if(o.flip)g.scale(-1,1);g.drawImage(cc,o.flip?-w:0,0,w,h);g.restore();}return [w,h];}
 function busy(id,w,h){const bm=MB[id]||K.buildMap(id),Z=2,sz=K.MAPS[id].size;let bx=sz/2,by=sz/2,best=-1;for(let yy=h/4;yy<=sz-h/4;yy+=20)for(let xx=w/4;xx<=sz-w/4;xx+=20){let sc=0;for(const q of bm.props)if(Math.abs(q.x-xx)<w/4&&Math.abs(q.y-yy)<h/4)sc+=q.tall?2:1;for(const q of bm.lights)if(Math.abs(q.x-xx)<w/4&&Math.abs(q.y-yy)<h/4)sc+=3;if(sc>best){best=sc;bx=xx;by=yy;}}return [bx*Z,by*Z];}
 function crop(g,id,cx,cy,x,y,w,h){if(!MB[id])K.buildMap(id);const c=MB[id].canvas;if(cx==null){[cx,cy]=busy(id,w,h);}g.drawImage(c,cx-w/2,cy-h/2,w,h,x,y,w,h);}
 function tint(g,x,y,w,h,col,a){g.globalAlpha=a;g.fillStyle=col;g.fillRect(x,y,w,h);g.globalAlpha=1;}
 function glow(g,cx,cy,r,col,a){const b=2;for(let j=-r;j<=r;j+=b)for(let i=-r;i<=r;i+=b){const d=Math.hypot(i,j)/r;if(d>1)continue;const q=((j/b)&3)*4+((i/b)&3);if((1-d)*(a||1)*16>B4[q]+(d>.5?4:0)){g.globalAlpha=.35;g.fillStyle=col;g.fillRect(cx+i,cy+j,b,b);}}g.globalAlpha=1;}
 function stars(g,x,y,w,h,n,seed){let r=seed;const R=()=>(r=(r*16807)%2147483647)/2147483647;for(let i=0;i<n;i++){const v=R();g.fillStyle=v<.15?'#fff6c8':v<.5?'#8a86b8':'#4a4680';const s=v<.08?2:1;g.fillRect(x+Math.floor(R()*w),y+Math.floor(R()*h),s,s);}}
 function rays(g,cx,cy,r0,r1,n,col,a){g.globalAlpha=a;g.fillStyle=col;for(let i=0;i<n;i++){const an=i/n*6.283+.1;for(let rr=r0;rr<r1;rr+=4)g.fillRect(Math.round(cx+Math.cos(an)*rr),Math.round(cy+Math.sin(an)*rr),2,2);}g.globalAlpha=1;}
 // pixel line (2px pen) for frames
 function pline(g,x1,y1,x2,y2,col){g.fillStyle=col;const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/2;for(let s=0;s<=n;s++)g.fillRect(Math.round((x1+(x2-x1)*s/n)/2)*2,Math.round((y1+(y2-y1)*s/n)/2)*2,2,2);}
 function panel(g,pts,fn){g.save();g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(const q of pts.slice(1))g.lineTo(q[0],q[1]);g.closePath();g.clip();fn();g.restore();
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];pline(g,a[0],a[1],b[0],b[1],'#ece6d2');}}
 const R=(x,y,w,h)=>[[x,y],[x+w-2,y],[x+w-2,y+h-2],[x,y+h-2]];
 const F20='18.6667px "Jersey 10"';
 function tw(g,txt,font){g.font=font||F20;return Math.ceil(g.measureText(txt).width);}
 // caption = parchment strip (game's parchment), text without shadow
 function cap(g,T,x,y,txt,o){o=o||{};const w=tw(g,txt)+16,h=26;if(o.right)x=x-w;g.fillStyle='#120a08';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle=o.bg||'#e8d6a4';g.fillRect(x,y,w,h);g.fillStyle=o.bg2||'#c9b07a';g.fillRect(x,y+h-2,w,2);g.fillRect(x+w-2,y,2,h);
  T.push(c=>{c.font=(18.6667*D)+'px "Jersey 10"';c.fillStyle=o.fg||'#2a1a0c';c.textBaseline='alphabetic';c.fillText(txt,(x+8)*D,(y+18)*D);});return w;}
 function bubble(g,T,x,y,txt,tx,ty,o){o=o||{};const w=tw(g,txt)+18,h=26,bg=o.bg||'#ffffff',ink='#120a10';if(o.right)x=x-w;
  const bx=Math.round(Math.max(x+10,Math.min(x+w-20,tx))/2)*2,down=ty>y,by=down?y+h:y,sd=tx>bx?2:-2;
  for(let i=0;i<14;i+=2){const ww=Math.max(2,10-Math.round(i*.6/2)*2),xx=bx+Math.round(i/4)*sd,yy=down?by+i:by-i-2;g.fillStyle=ink;g.fillRect(xx-2,yy,ww+4,i>=12?4:2);g.fillStyle=bg;g.fillRect(xx,yy,ww,2);}
  g.fillStyle=ink;g.fillRect(x+2,y-2,w-4,h+4);g.fillRect(x-2,y+2,w+4,h-4);g.fillRect(x,y,w,h);g.fillStyle=bg;g.fillRect(x+2,y,w-4,h);g.fillRect(x,y+2,w,h-4);
  T.push(c=>{c.font=(18.6667*D)+'px "Jersey 10"';c.fillStyle=o.fg||ink;c.fillText(txt,(x+9)*D,(y+18)*D);});}
 function sfxWord(T,x,y,txt,col){T.push(c=>{c.font=(34*D)+'px "Jersey 20"';c.textAlign='center';c.lineJoin='miter';c.lineWidth=4*D;c.strokeStyle='#120a10';c.strokeText(txt,x*D,y*D);c.fillStyle=col;c.fillText(txt,x*D,y*D);c.textAlign='left';});}
 function tag(T,x,y,txt){T.push(c=>{c.font=(27*D)+'px "Jersey 15"';c.textAlign='right';c.lineJoin='miter';c.lineWidth=3*D;c.strokeStyle='#120a10';c.strokeText(txt,x*D,y*D);c.fillStyle='#f6c744';c.fillText(txt,x*D,y*D);c.textAlign='left';});}
 // big shard: the game's shard rows, each design px = k px, optional gold eye on the same grid
 const SH=['....c...','...cwc..','..cwccb.','.ccccbbd','..cbbbd.','...bbd..','....d...'],SHP={c:'#9ad8ff',b:'#4a7ac8',w:'#ffffff',d:'#2a3a78',y:'#f6c744',k:'#3a2408',o:'#120a10'};
 function shard(g,x,y,k,eye){const rows=SH.map(r=>r.split(''));if(eye){rows[3][3]='y';rows[3][4]='k';rows[3][5]='y';rows[2][4]='y';rows[4][4]='y';}
  for(let j=0;j<rows.length;j++)for(let i=0;i<8;i++){const c=rows[j][i];if(c==='.')continue;g.fillStyle='#120a10';g.fillRect(x+i*k-2,y+j*k-2,k+4,k+4);}
  for(let j=0;j<rows.length;j++)for(let i=0;i<8;i++){const c=rows[j][i];if(c==='.')continue;g.fillStyle=SHP[c];g.fillRect(x+i*k,y+j*k,k,k);}}
 const top=66,bot=812,X0=12,PW=369; // iPhone 15 safe area (59 / 34) + margin
 const out={};
 // ================= PROLOG =================
 out.prolog=page((g,T)=>{g.fillStyle='#07050a';g.fillRect(0,0,AW,AH);
  let y=top,h=236;panel(g,R(X0,y,PW,h),()=>{grad(g,X0,y,PW,h,['#05040e','#0c0a24','#18123a','#261a4c']);stars(g,X0,y,PW,h,160,11);
   const cx=196,cy=y+96;glow(g,cx,cy,70,'#ffe9a8',.9);
   for(let i=-14;i<=14;i+=2)for(let j=-14;j<=14;j+=2)if(Math.abs(i)+Math.abs(j)<=14){g.fillStyle=Math.abs(i)+Math.abs(j)<=8?'#ffffff':'#fff0b0';g.fillRect(cx+i,cy+j,2,2);}
   g.fillStyle='#f6c744';g.fillRect(cx-30,cy,60,2);g.fillRect(cx,cy-30,2,60);
   g.fillStyle='#120a10';[[0,-12],[2,-10],[2,-8],[0,-6],[-2,-4],[-2,-2],[0,0],[2,2],[2,4],[4,6],[2,8],[4,10]].forEach(q=>g.fillRect(cx+q[0],cy+q[1],2,2));
   [[-120,70],[-70,96],[90,84],[136,30],[40,110],[-150,-10],[150,-40]].forEach(q=>{const x=cx+q[0],yy=cy+q[1];for(let t=0;t<9;t++){g.globalAlpha=1-t/9;g.fillStyle=t?'#9ad8ff':'#ffffff';g.fillRect(Math.round((x-q[0]/16*t)/2)*2,Math.round((yy-q[1]/16*t)/2)*2,t?2:4,t?2:4);}g.globalAlpha=1;});});
  sfxWord(T,300,y+64,'KRAK!','#ffe27a');cap(g,T,X0+12,y+h-40,'Hvězda se rozbila.');
  y+=h+10;h=236;panel(g,[[X0,y],[X0+PW-2,y],[X0+PW-2,y+h-26],[X0,y+h-2]],()=>{grad(g,X0,y,PW,h,['#1a0614','#3a0e1e','#6a2420','#a8482a']);
   // ruined horizon
   g.fillStyle='#120610';g.fillRect(X0,y+170,PW,70);for(let i=0;i<PW;i+=6){const hh=6+((i*37)%17);g.fillRect(X0+i,y+170-hh,6,hh);}
   [['morvan',24,y+84,'#140818'],['sphinx',156,y+66,'#1e0c08'],['queen',282,y+92,'#080c1e']].forEach(([id,x,yy,c])=>{const s=SPR.boss[id];spr(g,s,x,yy,1,{sil:c,rim:'#ff7a4a'});
    const ex=x+Math.round(s.c.width*.5);glow(g,ex,yy+28,24,'#9ad8ff',1);shard(g,ex-8,yy+14,2,false);});});
  cap(g,T,X0+12,y+h-62,'Střepy si vzali tyrani.');
  y+=h+10;h=bot-y;panel(g,[[X0,y+24],[X0+PW-2,y],[X0+PW-2,y+h-2],[X0,y+h-2]],()=>{const B4b=B4;g.fillStyle='#0e0c16';g.fillRect(X0,y,PW,h);
   for(let r=0;r*14<h;r++)for(let c=-1;c*28<PW;c++){const bx=X0+c*28+(r&1?14:0),by=y+r*14;const v=((r*7+c*13)%5);g.fillStyle=['#24202e','#2a2634','#201c2a','#2e2a3a','#262230'][v];g.fillRect(bx+2,by+2,24,10);g.fillStyle='#34303f';g.fillRect(bx+2,by+2,24,2);}
   // floor
   const fy=y+h-58;g.fillStyle='#14111c';g.fillRect(X0,fy,PW,58);for(let i=0;i<PW;i+=32){g.fillStyle='#1c1826';g.fillRect(X0+i+2,fy+4,28,22);g.fillRect(X0+i+18,fy+30,28,22);}
   // arched window with the night sky
   const wx=176,wy=y+40;g.fillStyle='#08060e';g.fillRect(wx-4,wy+20,48,64);for(let i=0;i<24;i+=2){const ww=Math.round(Math.sqrt(1-((24-i)/24)**2)*24)*2;g.fillRect(wx+20-ww/2-4,wy+i,ww+8,2);}
   g.fillStyle='#1a2050';g.fillRect(wx,wy+20,40,60);for(let i=4;i<24;i+=2){const ww=Math.round(Math.sqrt(1-((24-i)/24)**2)*20)*2;g.fillRect(wx+20-ww/2,wy+i,ww,2);}
   g.fillStyle='#fff6c8';g.fillRect(wx+24,wy+14,6,6);g.fillStyle='#8a86b8';g.fillRect(wx+8,wy+34,2,2);g.fillRect(wx+30,wy+50,2,2);g.fillStyle='#08060e';g.fillRect(wx+18,wy+4,4,76);g.fillRect(wx,wy+44,40,4);
   // open stone sarcophagus
   const sx=146,sy=y+h-70;g.fillStyle='#120a10';g.fillRect(sx-2,sy-2,112,40);g.fillStyle='#5a5466';g.fillRect(sx,sy,108,36);g.fillStyle='#8a8494';g.fillRect(sx,sy,108,4);g.fillStyle='#3a3446';g.fillRect(sx,sy+30,108,6);for(let i=8;i<100;i+=16){g.fillStyle='#46404f';g.fillRect(sx+i,sy+10,10,14);g.fillStyle='#6a6474';g.fillRect(sx+i,sy+10,10,2);}
   g.fillStyle='#120a10';g.fillRect(sx+92,sy-26,48,14);g.fillStyle='#7a7484';g.fillRect(sx+94,sy-24,44,10);g.fillStyle='#5a5464';g.fillRect(sx+94,sy-16,44,2);
   const hs=SPR.hero.knight;glow(g,sx+54,sy-30,60,'#cfe8ff',.8);spr(g,hs,sx+54-hs.c.width*1.5,sy-hs.c.height*3+24,3);});
  bubble(g,T,X0+18,y+60,'…kde to jsem?',150,y+140);
  cap(g,T,X0+PW-14,bot-40,'Jdi si pro ně.',{right:1,bg:'#f6c744',bg2:'#c28a10'});
 });
 // ================= KAPITOLA I =================
 out.c1=page((g,T)=>{g.fillStyle='#07050a';g.fillRect(0,0,AW,AH);
  let y=top,h=250;panel(g,R(X0,y,PW,h),()=>{crop(g,'trun',450,450,X0,y,PW,h);tint(g,X0,y,PW,h,'#140620',.55);rays(g,196,y+120,40,220,28,'#7aff9a',.5);
   const s=SPR.boss.morvan;glow(g,196,y+120,60,'#7aff9a',.7);spr(g,s,196-s.c.width,y+120-s.c.height,2);
   [[-120,-70],[130,-80],[-150,30],[140,50],[-60,-100],[80,90],[-100,90]].forEach(q=>{const x=196+q[0],yy=y+120+q[1];g.fillStyle='#120a10';g.fillRect(x-2,yy-2,16,8);g.fillStyle='#ece6d2';g.fillRect(x,yy,12,4);g.fillRect(x-2,yy-2,4,4);g.fillRect(x+10,yy+2,4,4);});});
  sfxWord(T,310,y+56,'KŘUP!','#7aff9a');bubble(g,T,X0+14,y+h-50,'Kosti… si nech…',130,y+h-82);
  y+=h+10;h=232;panel(g,[[X0,y],[X0+PW-2,y+20],[X0+PW-2,y+h-2],[X0,y+h-2]],()=>{grad(g,X0,y,PW,h,['#06050f','#0e0b22','#161236']);glow(g,196,y+108,90,'#9ad8ff',.8);
   const k=10,sx=156,sy=y+46;glow(g,sx+40,sy+34,96,'#9ad8ff',.9);shard(g,sx,sy,k,true);
   for(let i=0;i<10;i++){const an=i/10*6.283;g.fillStyle='#cfe8ff';g.fillRect(Math.round((sx+38+Math.cos(an)*76)/2)*2,Math.round((sy+34+Math.sin(an)*60)/2)*2,2,2);}});
  cap(g,T,X0+12,y+h-40,'V prvním střepu je zlaté oko.');
  y+=h+10;h=bot-y;panel(g,R(X0,y,PW,h),()=>{crop(g,'poust',480,500,X0,y,PW,h);tint(g,X0,y,PW,h,'#ff9a3a',.12);
   glow(g,300,y+52,50,'#ffd27a',1);g.fillStyle='#fff0b0';for(let i=-14;i<=14;i+=2)for(let j=-14;j<=14;j+=2)if(i*i+j*j<=196)g.fillRect(300+i,y+52+j,2,2);
   const hs=SPR.hero.knight;spr(g,hs,56,y+h-128,3);tint(g,X0,y,PW,h,'#3a1a08',.0);});
  tag(T,X0+PW-14,y+34,'Kapitola II');cap(g,T,X0+PW-14,bot-40,'Další leží v poušti.',{right:1});
 });
 // ================= KAPITOLA IX – zvrat =================
 out.c9=page((g,T)=>{g.fillStyle='#07050a';g.fillRect(0,0,AW,AH);
  let y=top,h=226;panel(g,R(X0,y,PW,h),()=>{crop(g,'dvur',470,470,X0,y,PW,h);tint(g,X0,y,PW,h,'#1a0c02',.45);
   const s=SPR.boss.herald;spr(g,s,196-s.c.width,y+h-s.c.height*2-4,2);});
  bubble(g,T,262,y+34,'…Aurel.',240,y+80,{});cap(g,T,X0+12,y+h-40,'Herold padl.');
  y+=h+10;h=170;panel(g,R(X0,y,PW,h),()=>{grad(g,X0,y,PW,h,['#2a1804','#4a2c08','#7a4e10']);
   for(let i=0;i<7;i++){const x=24+i*40,yy=y+34+(i%2)*16;glow(g,x+12,yy+12,22,'#9ad8ff',.7);shard(g,x,yy,4,true);}
   // Aurel's golden hand waiting at the end
   const hx=318,hy=y+26,k=5,HA=['.y.y.y.y..','.y.y.y.y..','.yyyyyyy..','yYYYYYYYy.','yYYYYYYYYy','yYYYYYYYy.','.yYYYYYy..','..yyyyy...'];
   HA.forEach((r,j)=>r.split('').forEach((ch,i)=>{if(ch==='.')return;g.fillStyle='#120a10';g.fillRect(hx+i*k-2,hy+j*k-2,k+4,k+4);}));
   HA.forEach((r,j)=>r.split('').forEach((ch,i)=>{if(ch==='.')return;g.fillStyle=ch==='y'?'#c8901a':'#ffd040';g.fillRect(hx+i*k,hy+j*k,k,k);}));});
  cap(g,T,X0+12,y+h-40,'Celou dobu jsi je nosil jemu.');
  y+=h+10;h=bot-y;panel(g,[[X0,y],[X0+PW-2,y+20],[X0+PW-2,y+h-2],[X0,y+h-2]],()=>{grad(g,X0,y,PW,h,['#fff0b0','#ffd060','#f0a030','#b0581a','#5a1a08']);rays(g,196,y+150,50,260,36,'#fff6d8',.7);
   const s=SPR.boss.aurel;spr(g,s,196-s.c.width*1.5,y+40,3);});
  bubble(g,T,X0+14,bot-46,'Děkuji ti, posle.',120,bot-90,{bg:'#1a0604',fg:'#ffe27a'});
 });
 return out;});
const fs=require('fs');for(const k in pages)fs.writeFileSync(__dirname+'/'+k+'.png',Buffer.from(pages[k].split(',')[1],'base64'));
console.log('chyby:',errs.length?errs:'žádné');await close();})();
