# addtr.py <json file>: add Czech→English pairs to lang-en.js (skips keys that already exist)
import json,sys
T=json.load(open(sys.argv[1],encoding='utf-8'))
p='lang-en.js';l=open(p,encoding='utf-8').read()
add=''
for k,v in T.items():
    if json.dumps(k,ensure_ascii=False)+':' in l:continue
    add+=json.dumps(k,ensure_ascii=False)+':'+json.dumps(v,ensure_ascii=False)+',\n'
i=l.rindex('};');body=l[:i].rstrip()
if not body.endswith(',') and not body.endswith('{'):body+=','
l=body+'\n'+add+l[i:]
open(p,'w',encoding='utf-8').write(l);print('added',add.count('\n'))
