// sprite sheet of enemies and bosses (zoomed) for a visual check: node sprites.js out.png [ids,comma]
const {chromium}=require('playwright');
const out=process.argv[2]||'sprites.png',only=(process.argv[3]||'').split(',').filter(Boolean);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/off.html');await p.waitForTimeout(600);
await p.evaluate(only=>{const K=window.__krypta,S=K.SPR,c=document.createElement('canvas');c.width=900;c.height=900;Object.assign(c.style,{position:'fixed',left:0,top:0,zIndex:99999,background:'#3a3448'});document.body.appendChild(c);
 const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#3a3448';g.fillRect(0,0,900,900);let x=10,y=10,rowH=0;
 const list=[];for(const id in S.enemy)list.push([id,S.enemy[id],4]);for(const id in S.boss)list.push([id,S.boss[id],3]);
 for(const [id,sp,k] of list){if(only.length&&!only.includes(id))continue;const w=sp.c.width*k/2*1,h=sp.c.height*k/2;if(x+w>890){x=10;y+=rowH+22;rowH=0;}
  g.drawImage(sp.c,x,y,w,h);g.drawImage(sp.c2,x+w+4,y,w,h);g.fillStyle='#fff';g.font='11px monospace';g.fillText(id,x,y+h+12);x+=w*2+20;rowH=Math.max(rowH,h);}},only);
await p.screenshot({path:out});console.log(errs);await b.close();})();
