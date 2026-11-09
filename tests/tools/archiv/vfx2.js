// close-up VFX frames: explosion, lightning, kill shatter, crit numbers, towers firing (node vfx2.js <prefix>)
const {chromium}=require('playwright');const pre=process.argv[2]||'z';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2});
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
 await p.goto('file://'+__dirname+'/off.html');await p.waitForTimeout(400);
 await p.evaluate(()=>{const K=window.__krypta;K.save.sound=false;K.save.music=false;K.god=true;K.save.tut=1;K.startRun('builder','hrbitov');const r=K.run;r.coins=9999;r.t=30;r.tut=null;
   for(const k of ['fire','frost','tesla'])K.buildTower(k);r.towers.forEach((t,i)=>{t.lv=1+(i%3);t.born=-9;});for(let i=0;i<20;i++)K.step(1/60);});
 const shot=async(n,f,steps)=>{await p.evaluate(([f,steps])=>{const K=window.__krypta,r=K.run2;if(f)(new Function('K','r',f))(K,r);for(let i=0;i<steps;i++)K.step(1/60);},[f,steps]);
   await p.waitForTimeout(60);await p.screenshot({path:pre+'_'+n+'.png',clip:{x:95,y:250,width:200,height:250}});};
 const SP="for(let i=0;i<6;i++){const e=K.spawnEnemy(['zombie','skeleton','slime'][i%3]);if(e){e.x=r.p.x+30+i*6;e.y=r.p.y-30+i*10;e.spd=0;}}";
 await shot('boom',SP+"K.explode(r.p.x+40,r.p.y-10,26,1);",4);
 await shot('boom2','',10);
 await shot('bolt',"r.fx.push({k:'bolt',x:r.p.x-30,y:r.p.y+20,life:.18,seed:3});",2);
 await shot('kill',"for(const e of r.enemies.slice(0,4))K.hurtEnemy(e,999,20,0);",5);
 await shot('kill2','',14);
 await shot('towers',"for(const t of r.towers)t.kick=1;",1);
 await shot('burn',"r.fx.push({k:'burn',x:r.p.x,y:r.p.y+30,r:16,life:2.4,max:2.4,tick:0,dmg:0});",20);
 console.log(errs);await b.close();})();
