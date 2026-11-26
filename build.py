# 把 src/ 拼成单文件 index.html：python3 build.py
import re
def strip(f):
    return re.sub(r"\nif\(typeof module!=='undefined'\)module\.exports=.*\n?","\n",open('src/'+f,encoding='utf-8').read())
h=open('src/head.html',encoding='utf-8').read()
order=['engine.js','dishes.js','spice.js','improve.js','card.js','common.js','library.js','ui.js','improveui.js','stove.js','spiceui.js','router.js']
js="\n".join(strip(f) for f in order)
open('index.html','w',encoding='utf-8').write(h+"<script>\n"+js+"\n</script>\n</body></html>\n")
