# Rozbor nahrávky z poslech.js – „poslech očima“.  python3 poslech.py <prefix>   (prefix.wav + prefix.json)
# Výstup: <prefix>.png (spektrogram s událostmi, hlasitost v čase, telefon vs. plný zvuk, stereo) a souhrn v textu.
import sys, json, numpy as np, scipy.signal as sg, scipy.io.wavfile as wf
import pyloudnorm as pyln
from PIL import Image, ImageDraw, ImageFont
pre=sys.argv[1]; sr,x=wf.read(pre+'.wav'); x=x.astype(np.float32)/32768; J=json.load(open(pre+'.json'))
L,R=x[:,0],x[:,1]; mono=(L+R)/2; dur=len(mono)/sr
meter=pyln.Meter(sr)
def lufs(sig):
    try: return meter.integrated_loudness(sig)
    except Exception: return -70.0
# telefon: malý reproduktor ~ highpass 4. řádu 300 Hz, rezonance 1 kHz, pokles nad 10 kHz, mono
hp=sg.butter(4,300,'hp',fs=sr,output='sos'); lp=sg.butter(2,10000,'lp',fs=sr,output='sos')
phone=sg.sosfilt(lp,sg.sosfilt(hp,mono))
res=dict(dur=round(dur,1), lufs=round(lufs(x),1), lufs_phone=round(lufs(phone),1),
         peak_db=round(20*np.log10(np.abs(x).max()+1e-9),1), clip=int((np.abs(x)>.99).sum()))
# krátkodobá hlasitost po 1 s (okno 3 s)
st=[]; 
for t in np.arange(0,dur-3,1.0):
    a,b=int(t*sr),int((t+3)*sr); st.append((t+1.5,lufs(x[a:b]),lufs(phone[a:b])))
st=np.array(st)
ev=J['events']; bossT=next((t for t,k in ev if k=='BOSS'),None)
def seg(a,b): m=(st[:,0]>=a)&(st[:,0]<b); return round(float(np.median(st[m,1])),1) if m.any() else None
res['hlasitost_zacatek']=seg(0,12); res['hlasitost_beh']=seg(15,bossT or dur); res['hlasitost_boss']=seg((bossT or dur)+2,dur)
# pásma
f,P=sg.welch(mono,sr,nperseg=8192); tot=P.sum()
band=lambda a,b: round(float(P[(f>=a)&(f<b)].sum()/tot*100),1)
res['pasma_%']={'<100':band(0,100),'100-300':band(100,300),'300-2k':band(300,2000),'2k-6k':band(2000,6000),'>6k':band(6000,sr/2)}
res['telefon_ztrata_dB']=round(res['lufs']-res['lufs_phone'],1)
# stereo
mid,side=(L+R)/2,(L-R)/2
res['stereo_korelace']=round(float(np.corrcoef(L,R)[0,1]),2); res['sirka_side/mid_dB']=round(10*np.log10((side**2).mean()/(mid**2).mean()+1e-12),1)
# rytmus hudby (pozor: bicí mají synkopy, absolutní číslo nic neříká – porovnej poslech.js s poslech-offline.js téže skladby;
# offline render má dokonalé časování, takže rozdíl mezi nimi = kolísání ve skutečné hře): nástupy basového bubnu (obálka 40–120 Hz) vs. mřížka osmin
bd=sg.sosfilt(sg.butter(4,[40,120],'bp',fs=sr,output='sos'),mono); env=np.abs(sg.hilbert(bd)) if len(bd)<4_000_000 else np.abs(bd)
env=sg.sosfilt(sg.butter(2,30,'lp',fs=sr,output='sos'),env); hop=sr//1000; e=env[::hop]
# nástup = začátek náběhu obálky (ne vrchol, ten se posouvá s délkou tónu); mřížka = šestnáctiny, fáze vůči mediánu
de=np.diff(e,prepend=e[0]); pk,_=sg.find_peaks(de,height=de.max()*.25,distance=int(J['step']*1000*.8)); on=pk/1000
grid=J['step']
if len(on)>8:
    ph=(on/grid)%1; c=np.angle(np.exp(2j*np.pi*ph).mean())/(2*np.pi); ph=(ph-c+.5)%1-.5; ph=ph*grid*1000
    res['rytmus_odchylka_ms']={'median_abs':round(float(np.median(np.abs(ph))),1),'p95':round(float(np.percentile(np.abs(ph),95)),1),'nad_10ms_%':round(float((np.abs(ph)>10).mean()*100),1),'uderu':len(on)}
# efekty vs hudba: hlasitost 200 ms po efektu vs. medián hudby
rms=lambda a,b: 10*np.log10((mono[a:b]**2).mean()+1e-12)
base=np.median([rms(int(t*sr),int((t+.2)*sr)) for t in np.arange(1,dur-1,.37)])
cnt={}; lvl={}
for t,k in ev:
    k=k.split(':')[0]; cnt[k]=cnt.get(k,0)+1
    if 0<t<dur-.3: lvl.setdefault(k,[]).append(rms(int(t*sr),int((t+.2)*sr))-base)
res['efekty']={k:{'pocet':cnt[k],'nad_hudbou_dB':round(float(np.median(v)),1)} for k,v in lvl.items()}
res['efektu_za_s']=round(len(ev)/dur,1)
# obrázek
W,H=1400,820; im=Image.new('RGB',(W,H),(14,15,20)); d=ImageDraw.Draw(im)
import glob
_f=(glob.glob('/usr/share/fonts/**/DejaVuSans.ttf',recursive=True)+glob.glob('/usr/share/fonts/**/NotoSans-Regular.ttf',recursive=True)+glob.glob('../../fonts/*.ttf'))
FNT=ImageFont.truetype(_f[0],14) if _f else None
_t=d.text; d.text=lambda xy,t,fill=None,**k:_t(xy,t,fill=fill,font=FNT,**k)
ff,tt,S=sg.spectrogram(mono,sr,nperseg=2048,noverlap=1536); S=10*np.log10(S+1e-12)
fmin,fmax=30,16000; ys=np.geomspace(fmin,fmax,360)[::-1]; idx=np.searchsorted(ff,ys).clip(0,len(ff)-1)
Sp=S[idx]; Sp=np.clip((Sp-(Sp.max()-80))/80,0,1)
cm=np.stack([np.clip(1.5*Sp-.2,0,1),np.clip(1.6*Sp-.6,0,1)**.8,np.clip(3*Sp*(1-Sp)+Sp**4,0,1)],-1)
spec=Image.fromarray((cm*255).astype(np.uint8)).resize((W-80,360)); im.paste(spec,(60,20))
X=lambda t:60+int(t/dur*(W-80)); Yf=lambda fr:20+int((np.log(fmax)-np.log(fr))/(np.log(fmax)-np.log(fmin))*360)
for fr,lab in [(100,'100'),(300,'300 Hz – telefon'),(1000,'1k'),(4000,'4k'),(10000,'10k')]:
    d.line([(60,Yf(fr)),(W-20,Yf(fr))],fill=(90,90,110) if fr!=300 else (230,120,60)); d.text((2,Yf(fr)-6),lab[:6],fill=(200,200,210))
cols={'BOSS':(255,80,80),'ULT':(255,210,60),'level':(120,220,255),'boss':(255,120,120)}
for t,k in ev:
    kk=k.split(':')[0]
    if kk in cols: d.line([(X(t),20),(X(t),380)],fill=cols[kk],width=2 if kk in('BOSS','ULT') else 1); d.text((X(t)+2,22 if kk!='level' else 34),k[:10],fill=cols[kk])
for t,k in ev:  # malé značky všech efektů
    if ':' not in k and k not in cols: d.line([(X(t),382),(X(t),390)],fill=(150,150,160))
# hlasitost v čase
y0=420; d.text((60,y0-16),'hlasitost (LUFS, okno 3 s): bílá = plný zvuk, oranžová = reproduktor telefonu',fill=(220,220,230))
Yl=lambda v:y0+int((-14-v)/40*180)
for v in (-20,-30,-40,-50): d.line([(60,Yl(v)),(W-20,Yl(v))],fill=(50,52,62)); d.text((20,Yl(v)-6),str(v),fill=(160,160,170))
for c,col in ((1,(240,240,240)),(2,(240,140,60))):
    pts=[(X(t),Yl(max(-54,v))) for t,*vv in st for v in [vv[c-1]]]; d.line(pts,fill=col,width=3)
# stereo v čase (korelace)
y1=640; d.text((60,y1-16),'stereo: korelace L/P po 1 s (1 = mono, 0 = široké)',fill=(220,220,230))
for t in np.arange(0,dur-1,1):
    a,b=int(t*sr),int((t+1)*sr); c=np.corrcoef(L[a:b],R[a:b])[0,1]; d.rectangle([X(t),y1+int((1-c)*0)+int(c*0),X(t+1)-2,y1+150-int(c*150)],fill=(110,170,255))
d.text((60,H-28),f"{J['map']} · {J['hero']} · {J['bpm']} BPM · {dur:.0f} s · LUFS {res['lufs']} · telefon {res['lufs_phone']} · špička {res["peak_db"]:.1f} dB",fill=(250,210,90))
im.save(pre+'.png'); print(json.dumps(res,ensure_ascii=False,indent=1,default=float))
