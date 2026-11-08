# econsim.py [param=hodnota …]: dlouhodobá simulace ekonomiky 2.0 (zlato, Úlomky, Esence). Hráč hraje běhy a kupuje nejlevnější další krok; výpis po hodinách. Výchozí čísla = varianta nasazená v 08b: sh_run=70 it_sh=6 reforge_sh=150 meta_sh=2
# NEW economy v2: richer sinks (5 heroes, chests with daily limits, item replacement, pets/tower cards, reforge as endless sink, material cap)
import random,sys
P=dict(
 meta_g=1.115, meta_sh=2, hero_g=45, hero_g2=90, hero_sh=10, hero_es0=10,
 it_g=24, it_sh=6, it_es=1,
 sh_run=70, sh_cap=6000, es_first=[25,35,50,70], es_rep=[4,6,8,10], fin_day=3, endl_rate=.4, endl_cap=20,
 chest_iron=750, chest_gold=2000, iron_day=4, gold_day=2,
 reforge_g=600, noitems=0, seed=1, reforge_sh=150, reforge_grow=1.25,
)
for a in sys.argv[1:]:
    k,v=a.split('=');P[k]=eval(v)
RUN_MIN=6.5
def chapter_of(h):return 1 if h<4 else 2 if h<10 else 3 if h<20 else 4 if h<35 else 5 if h<55 else 6
GOLD_RUN={1:520,2:640,3:780,4:900,5:1020,6:1150}
BASES={'hp':30,'dmg':45,'spd':35,'mag':25,'xp':40,'build':40}
def meta_cost(b,L):
    g=round(b*P['meta_g']**L);sh=0 if L<10 else round((3+(L-10))*P['meta_sh']*b/35);es=0 if L<20 else 2+(L-20)
    return dict(gold=g,sh=sh,es=es)
def hero_cost(L):
    g=P['hero_g']*L+(P['hero_g2']*(L-9) if L>=10 else 0);sh=P['hero_sh']*L
    es=0 if L<10 else 2+(L-10)+(P['hero_es0'] if L+1 in (15,20) else 0)
    return dict(gold=g,sh=sh,es=es)
def up_cost(r,lv):
    return dict(gold=P['it_g']*(lv+1)*(r+1),sh=P['it_sh']*(lv+1)*(r+1),es=0 if lv<5 else P['it_es']*(lv-4)*(r+1))
ODDS_IRON=[35,40,20,5,0];ODDS_GOLD=[0,30,45,20,5]
def roll(o):
    x=random.random()*100
    for i,p in enumerate(o):
        x-=p
        if x<0:return i
    return 4
def sim(hours=200,seed=1,rep=(3,10,20,40,70,100,150,200)):
    random.seed(seed)
    W=dict(gold=0,sh=0,es=0);meta={k:0 for k in BASES};HE=5
    hl=[1]*HE;used=[0,1]  # main heroes used most
    # equipment slots: 5 heroes x 4 + pet + 4 tower cards
    slots=[[0,0] for _ in range(HE*4+5)]  # rarity, lv
    reforges=0;day=-1;fin_today=endl_today=iron=gold=0;firsts=set();t=0;out=[];lost=0
    stat=dict(gold_in=0,sh_in=0,es_in=0)
    while t<hours*60:
        h=t/60;ch=chapter_of(h);d=int(t//90)
        if d!=day:day=d;fin_today=endl_today=iron=gold=0
        win=random.random()<.7;fin=random.random()<.2;nm=min(3,int(h//30))
        g=GOLD_RUN[ch]*(1.25 if fin else 1)*(1 if win else .55);s=P['sh_run']*(1+.15*(ch-1))*(1 if win else .5);e=0
        if fin and win:
            key=(ch,nm)
            if key not in firsts:firsts.add(key);e+=P['es_first'][nm]
            elif fin_today<P['fin_day']:fin_today+=1;e+=P['es_rep'][nm]
        if h>15 and random.random()<.15:
            x=7*P['endl_rate'];full=min(x,max(0,P['endl_cap']-endl_today));e+=full+.25*(x-full);endl_today+=x
        W['gold']+=g;W['sh']+=s;W['es']+=e;stat['gold_in']+=g;stat['sh_in']+=s;stat['es_in']+=e
        if W['sh']>P['sh_cap']:lost+=W['sh']-P['sh_cap'];W['sh']=P['sh_cap']
        t+=RUN_MIN
        for _ in range(80):
            opts=[]
            for k,b in BASES.items():
                if meta[k]<30:opts.append((meta[k]*1.0,('m',k),meta_cost(b,meta[k])))
            for i in range(HE):
                if hl[i]<20:opts.append(((hl[i]*1.6) if i in used else hl[i]*3+8,('h',i),hero_cost(hl[i])))
            for j,(r,lv) in enumerate(slots):
                main=(j//4 in used) or j>=HE*4
                if lv<10 and not P.get('noitems'):opts.append(((lv*2.2+ (0 if main else 6)),('u',j),up_cost(r,lv)))
            if iron<P['iron_day']:opts.append((9,('ci',),dict(gold=P['chest_iron'])))
            if gold<P['gold_day'] and h>8:opts.append((14,('cg',),dict(gold=P['chest_gold'])))
            opts.append((40+reforges*.2,('rf',),dict(gold=int(P['reforge_g']*P['reforge_grow']**(reforges%12)),sh=int(P['reforge_sh']*P['reforge_grow']**(reforges%12)))))
            ok=[o for o in opts if all(W.get(k,0)>=v for k,v in o[2].items())]
            if not ok:break
            ok.sort(key=lambda o:o[0]);_,w,c=ok[0]
            for k,v in c.items():W[k]-=v
            if w[0]=='m':meta[w[1]]+=1
            elif w[0]=='h':hl[w[1]]+=1
            elif w[0]=='u':slots[w[1]][1]+=1
            elif w[0] in('ci','cg'):
                r=roll(ODDS_IRON if w[0]=='ci' else ODDS_GOLD)
                if w[0]=='ci':iron+=1
                else:gold+=1
                # replace weakest-rarity slot if better (main first); refund half invest roughly via sh
                cand=sorted(range(len(slots)),key=lambda j:(slots[j][0],slots[j][1]))
                j=cand[0]
                if r>slots[j][0]:
                    old=slots[j];W['sh']+=sum(up_cost(old[0],l)['sh'] for l in range(old[1]))*.5;W['gold']+=sum(up_cost(old[0],l)['gold'] for l in range(old[1]))*.5
                    slots[j]=[r,0]
            else:reforges+=1
        if rep and h>=rep[0]:
            out.append((rep[0],{k:int(v) for k,v in W.items()},round(sum(meta.values())/6,1),hl[:],round(sum(lv for r,lv in slots[:8])/8,1),round(sum(r for r,lv in slots[:8])/8,1),reforges,int(lost)));rep=rep[1:]
    return out,stat
out,stat=sim(seed=P.get('seed',1))
for h,w,m,hl,il,ir,rf,lost in out:
    print(f'{h:>4}h stock g{w["gold"]:>7} sh{w["sh"]:>5} es{w["es"]:>4} | meta {m:>4} heroes {hl} main items +{il} rar {ir} | reforges {rf} sh_lost {lost}')
