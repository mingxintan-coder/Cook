// ===== 冰箱模式：现有食材 + 口味 → 最好吃的几道菜 =====
const FOOD_WORDS=[['五花','wh'],['里脊','lji'],['通脊','lji'],['猪肉片','lji'],['肉丝','lji'],['瘦肉','lji'],['排骨','pg'],['肉末','rm'],['肉馅','rm'],['绞肉','rm'],['猪蹄','zt'],['猪肝','zg'],['肥肠','fc'],['牛腩','nn'],['牛腱','nn'],['牛肉','nr'],['肥牛','nr'],['羊肉','yr'],['羊排','yr'],['鸡腿','jt'],['鸡块','jt'],['鸡肉','jt'],['鸡胸','jx'],['鸡翅','jc'],['鸡爪','jz'],['鸭','ya'],['鱼','yu'],['虾','xia'],['鱿鱼','yy'],['鸡蛋','jd'],['蛋','jd'],['豆腐皮','gdf'],['干豆腐','gdf'],['豆腐','dfu'],['茄子','qz'],['土豆','td'],['马铃薯','td'],['青菜','qcai'],['小白菜','qcai'],['油菜','bcai'],['菠菜','bcai'],['生菜','bcai'],['白菜','baic'],['包菜','baic'],['圆白菜','baic'],['卷心菜','baic'],['青椒','qjz'],['尖椒','qjz'],['彩椒','qjz'],['辣椒','qjz'],['西红柿','fq'],['番茄','fq'],['香菇','xg'],['蘑菇','xg'],['平菇','xg'],['杏鲍菇','xg'],['金针菇','jzg'],['木耳','mr'],['胡萝卜','hlb'],['萝卜','lb'],['黄瓜','hg'],['西葫芦','hg'],['粉丝','ms'],['粉条','ms'],['豆角','dou'],['四季豆','dou'],['豆芽','dy'],['芹菜','qc'],['蒜苔','qc'],['韭菜','jc2'],['西兰花','xlh'],['菜花','xlh'],['冬瓜','dg'],['南瓜','dg'],['莲藕','ou'],['藕','ou'],['面条','mt'],['年糕','mt'],['米饭','mfan'],['火腿','huot'],['腊肉','huot'],['香肠','huot']];
const SEAS_WORDS=[['洋葱','yc'],['葱','cong'],['姜','jiang'],['蒜','suan'],['小米辣','xmj'],['干辣椒','gla'],['花椒','hj'],['豆瓣','db'],['孜然','zr'],['八角','bj'],['香菜','xcai']];
function parseSeas(text){return SEAS_WORDS.filter(([w])=>String(text||'').includes(w)).map(x=>x[1])}
// 词典：所有食材名、别名（具体的优先），再加旧词表
let DICT=null;
function buildDict(){const L=[];const push=(w,id,pri)=>{w=String(w).trim();if(w.length>=1)L.push([w,id,pri])};
  for(const d of Object.values(FD)){const pri=d.base?2:d.custom?3:1;const parts=d.name.replace(/[（(]([^）)]*)[）)]/g,'/$1').split(/[\/、]/);for(const p of parts)push(p,d.id,pri);for(const a of d.al||[])push(a,d.id,pri)}
  for(const [w,id] of FOOD_WORDS)push(w,id,0);
  L.sort((a,b)=>b[0].length-a[0].length||b[2]-a[2]);const seen=new Set();DICT=L.filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return x[0].length>=2});return DICT}
const GUESS=[[/虾/,'xia'],[/蟹/,'gpx'],[/贝|蛤|蚝|螺|蛏|蚌/,'gclam'],[/鱿|墨鱼|章鱼|乌贼/,'yy'],[/鱼/,'yu'],[/牛.*(腩|腱|肋|筋|尾|骨)/,'nn'],[/牛/,'nr'],[/羊/,'yr'],[/鸡胸/,'jx'],[/鸡翅/,'jc'],[/鸡爪|鸡架/,'jz'],[/蛋/,'jd'],[/鸡|鸽|鹌鹑/,'jt'],[/鸭|鹅/,'ya'],[/排骨|骨/,'pg'],[/蹄|肘/,'zt'],[/肝|腰|胗|心|舌/,'zg'],[/肠|肚/,'fc'],[/肉末|肉馅|馅/,'rm'],[/肉/,'lji'],[/腐竹|豆皮|千张|豆干|干子/,'gdf'],[/豆腐|豆花/,'dfu'],[/菇|蘑|菌|蕈/,'xg'],[/耳/,'mr'],[/笋/,'gbs'],[/薯|芋|山药/,'td'],[/藕/,'ou'],[/萝卜/,'lb'],[/茄/,'qz'],[/冬瓜|南瓜/,'dg'],[/瓜/,'hg'],[/椒/,'qjz'],[/芽/,'dy'],[/豆/,'dou'],[/菜|苗|蒿|苋|薹|芥|叶|蕨/,'bcai'],[/面|粉|米|饼|馒|糕|饭|饺/,'mt'],[/番茄|柿/,'fq'],[/果|梨|桃|莓|橙|柚|蕉|枣/,'gpg3']];
function guessBase(w){for(const [re,id] of GUESS)if(re.test(w))return id;return null}
let CFOODS=[];try{CFOODS=JSON.parse(localStorage.getItem('tw.cfoods')||'[]')}catch(e){}
function addCustomFood(name,base,cut){if(!FD[base])return null;const ex=Object.values(FD).find(d=>d.name===name);if(ex)return ex.id;let h=0;for(const ch of name)h=(h*31+ch.charCodeAt(0))>>>0;const id='u'+h.toString(36);
  V(id,name,base,{custom:1,al:[]});if(cut&&CUTS[cut])FD[id].cut=cut;if(!CFOODS.some(c=>c.id===id)){CFOODS.push({id,name,base,cut:FD[id].cut});try{localStorage.setItem('tw.cfoods',JSON.stringify(CFOODS))}catch(e){}}DICT=null;return id}
for(const c of CFOODS){try{if(!FD[c.id]&&FD[c.base]){V(c.id,c.name,c.base,{custom:1,al:[]});if(c.cut)FD[c.id].cut=c.cut}}catch(e){}}
// 返回 {ids, guessed:[[词,id]], unknown:[词]}
function parseFoodsX(text){const D=DICT||buildDict();let t=String(text||'');const out=[];
  const via=[];for(const [w,id] of D){if(t.includes(w)){if(!out.includes(id))out.push(id);if(!FD[id].name.split(/[\/（(]/).includes(w))via.push([w,id]);t=t.split(w).join(' ')}}
  const rest=t.split(/[\s,，、;；。.和与跟及\/]+/).map(x=>x.replace(/[0-9a-zA-Z克斤两个只条块片根把g]+/g,'').trim()).filter(x=>x&&/[一-鿿]/.test(x)&&!SEAS_WORDS.some(([w])=>x===w||x.includes(w)));
  const guessed=[],unknown=[];for(const w of rest){const b=guessBase(w);if(b){const id=addCustomFood(w,b);if(id){out.push(id);guessed.push([w,b])}}else unknown.push(w)}
  return{ids:[...new Set(out)],guessed,unknown,via}}
function parseFoods(text){return parseFoodsX(text).ids}
const FIT={
 '鱼香':{qz:1,lji:1,rm:.9,jt:.7,jx:.7,dfu:.6,xia:.6,jd:.6,td:.5,mr:.6,hlb:.5},
 '宫保':{jt:1,jx:1,xia:1,lji:.7,dfu:.6,td:.6,qjz:.6,hg:.5},
 '麻辣':{dfu:1,nr:1,yu:1,xia:.8,nn:.7,dou:.8,ou:.6,td:.6,bcai:.5,dy:.6,rm:.7},
 '家常':{wh:1,dfu:.9,dou:.9,rm:.8,qjz:.7,qz:.7,gdf:.8,huot:.7},
 '红烧':{wh:1,pg:1,nn:1,jt:.9,yu:.9,jc:.9,zt:.9,ya:.8,td:.7,qz:.6,dfu:.6,xg:.6,lb:.7},
 '糖醋':{pg:1,lji:1,yu:.9,xia:.7,ou:.6,baic:.5,td:.5},
 '酸辣':{td:1,baic:1,dy:1,ou:.8,yu:.6,hg:.6,mt:.6,bcai:.5,qcai:.5},
 '孜然':{yr:1,nr:1,jt:.7,td:.6,qz:.5,xg:.6},
 '葱爆':{yr:1,nr:1,lji:.7,jd:.6},
 '茄汁':{fq:1,jd:.95,nn:.7,xia:.7,dfu:.6,td:.5,xhs:1},
 '蒜香':{bcai:1,qcai:1,xlh:1,xia:1,qz:.8,hg:.9,dy:.7,ou:.6,xg:.7,ms:.7},
 '五香卤':{nn:1,zt:1,jz:1,jd:.8,dfu:.6,gdf:.7},
 '咸鲜':{jd:1,xia:1,yu:1,qcai:.8,xlh:.8,xg:.8,baic:.7,jx:.6,dfu:.7,fq:.9,mt:.6,hg:.6,dg:.7,jzg:.7}};
const PAIRS=[['fq','jd'],['qjz','lji'],['qjz','rm'],['td','nr'],['td','nn'],['td','jt'],['qz','rm'],['mr','jd'],['hg','jd'],['xg','jt'],['dou','rm'],['dfu','rm'],['baic','rm'],['lb','nn'],['lb','pg'],['hlb','lji'],['mr','lji'],['yc','nr'],['qc','lji'],['jc2','jd'],['dy','rm'],['xlh','xia'],['ms','rm'],['xg','qcai'],['qjz','jd'],['ou','pg'],['dg','pg'],['fq','nn'],['td','pg'],['jzg','nr'],['qjz','nr'],['bcai','xia'],['qjz','xia'],['qjz','jt'],['hg','xia'],['xg','lji'],['td','wh'],['qz','qjz'],['td','qjz'],['qjz','wh'],['qc','wh'],['baic','dfu'],['xg','dfu'],['hlb','jt'],['dou','wh'],['ms','baic'],['jd','xia'],['fq','dfu']];
const PAIRSET=new Set(PAIRS.map(p=>p.slice().sort().join('+')));
const WHY={'茄汁':'番茄炒出沙，酸甜带鲜，最家常','鱼香':'鱼香汁咸甜酸辣，最下饭','宫保':'煳辣荔枝味，鸡丁虾仁最经典','麻辣':'麻辣鲜香，重口首选','家常':'豆瓣酱香，家常下饭','红烧':'小火慢炖，软糯入味','糖醋':'酸甜开胃，老少都爱','酸辣':'酸辣爽脆，快手开胃','孜然':'孜然焦香，西北风味','葱爆':'大火爆葱，香而不腻','蒜香':'蒜香清爽，突出本味','五香卤':'香料卤透，冷热都能吃','咸鲜':'咸鲜本味，清淡不腻'};
const SPICY_STYLES=['宫保','麻辣','家常','酸辣','孜然','鱼香'];
const HALL={'茄汁':['bt'],'鱼香':['pj'],'宫保':['gla','hj'],'麻辣':['db'],'家常':['db'],'孜然':['zr'],'五香卤':['bj'],'糖醋':['bt'],'酸辣':['bc'],'红烧':['ls'],'葱爆':['cong']};
const BASIC=['salt','hsy','cy','qs','rs'];
const PANTRY=['ls','lc','hy','bt','bingt','xc','bc','lj','dian','cong','jiang','suan','gla','hj','hjm','ljm','db','pj','dj','xmj','bj','gp','xy','zr','fqj','xyou','wj','tmj','ds','hs','zm','yc','xcai','bhj','zyc'];
const isMeatId=id=>['肉','禽','水产'].includes(FD[id].cat);
const rootOf=id=>{let x=id;while(FD[x]&&FD[x].base&&FD[FD[x].base])x=FD[x].base;return x};
const isPair=(a,b)=>PAIRSET.has([a,b].sort().join('+'))||PAIRSET.has([rootOf(a),rootOf(b)].sort().join('+'))||PAIRSET.has([rootOf(a),b].sort().join('+'))||PAIRSET.has([a,rootOf(b)].sort().join('+'));
function pairScore(ids){if(ids.length<2)return 0;let s=0;for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){if(isPair(ids[i],ids[j]))s+=8;
    const a=FD[ids[i]],b=FD[ids[j]];if(a.fish&&isMeatId(ids[j])&&!b.fish||b.fish&&isMeatId(ids[i])&&!a.fish)s-=8;else if(isMeatId(ids[i])&&isMeatId(ids[j])&&ids[i]!=='jd'&&ids[j]!=='jd')s-=5}
  return Math.max(-10,Math.min(12,s))}
function fitScore(style,ids){const f=FIT[style]||{};const v=ids.map(id=>{let x=id;for(let k=0;k<3&&x;k++){if(f[x]!=null)return f[x];x=FD[x]&&FD[x].base}return .3});return ids.length===1?v[0]:v[0]*.65+v.slice(1).reduce((a,b)=>a+b,0)/(v.length-1)*.35}
function canStyle(style,pantry){if(!pantry)return true;for(const id of HALL[style]||[]){if(pantry.has(id)||BASIC.includes(id))continue;const subs=(SUBS[id]||[]).filter(([s])=>pantry.has(s));if(!subs.length)return false}return true}
function defaultG(id,ids){const d=FD[id];if(id==='jd')return 150;const meat=isMeatId(id);const n=ids.length;if(meat)return n>1?250:400;if(d.coll)return 600;return n>1?(ids.some(isMeatId)?250:250):400}
function combos(foods){const ids=foods.map(f=>f.id);const M=ids.filter(isMeatId),V=ids.filter(i=>!isMeatId(i));const C=[];
  for(const i of ids)C.push([i]);for(const m of M)for(const v of V)C.push([m,v]);
  for(let a=0;a<V.length;a++)for(let b=a+1;b<V.length;b++)if(isPair(V[a],V[b])||(rootOf(V[a])==='jd'||rootOf(V[b])==='jd'))C.push([V[a],V[b]]);
  for(const m of M)for(let a=0;a<V.length;a++)for(let b=a+1;b<V.length;b++)C.push([m,V[a],V[b]]);
  if(M.includes('jd'))for(const v of V)C.push(['jd',v]);
  const seen=new Set();return C.filter(c=>{const k=c.slice().sort().join('+');if(seen.has(k))return false;seen.add(k);return true})}
function prefTarget(T,pref){const P=pref||{};const sp={'不辣':-9,'微辣':-1,'中辣':0,'重辣':1.5}[P.spicy||'中辣']||0;if(sp<-5)T.spicy=0;else T.spicy=Math.max(0,Math.min(9,T.spicy+sp*1.2));
  if(P.sweet==='爱甜')T.sweet=Math.min(9,T.sweet+1.2);if(P.sweet==='不爱甜')T.sweet=Math.max(0,T.sweet-1.5);
  if(P.sour==='爱酸')T.sour=Math.min(9,T.sour+1.2);if(P.numb==='怕麻')T.numb=Math.min(T.numb,1);if(P.numb==='爱麻')T.numb=Math.min(9,T.numb+1.5);
  if(P.heavy==='清淡'){T.salt=Math.max(3.8,T.salt-1);T.rich=Math.max(0,(T.rich||0)-1)}if(P.heavy==='重口')T.salt=Math.min(6.6,T.salt+.4);return T}
function prefScore(style,pref,D){const P=pref||{};let s=5;const spicy=SPICY_STYLES.includes(style);
  if(P.spicy==='不辣')s+=spicy?-10:3;if(P.spicy==='重辣')s+=spicy?4:-3;
  if(P.sweet==='爱甜'&&['糖醋','红烧','鱼香'].includes(style))s+=3;if(P.sweet==='不爱甜'&&['糖醋','红烧'].includes(style))s-=4;
  if(P.sour==='爱酸'&&['酸辣','糖醋','鱼香'].includes(style))s+=3;if(P.numb==='怕麻'&&['麻辣','宫保'].includes(style))s-=4;if(P.numb==='爱麻'&&['麻辣','宫保'].includes(style))s+=3;
  if(P.heavy==='清淡'&&['咸鲜','蒜香'].includes(style))s+=3;if(P.heavy==='重口'&&['麻辣','家常','红烧','孜然'].includes(style))s+=3;
  return Math.max(-10,Math.min(10,s))}
// 主流程：分两轮，第一轮快速筛，第二轮细调
function fridgePlan(input){const foods=input.foods.filter(f=>FD[f.id]);if(!foods.length)return[];const pantry=input.pantryOnly?new Set(input.pantry.concat(BASIC)):null;
  const missing=pantry?Object.keys(IT).filter(id=>!pantry.has(id)&&!IT[id].mix):[];
  const gOf=Object.fromEntries(foods.map(f=>[f.id,f.g]));const jobs=[];
  for(const c of combos(foods))for(const style of Object.keys(STYLES)){
    if(input.pref&&input.pref.spicy==='不辣'&&['麻辣','宫保','酸辣','家常'].includes(style))continue;
    if(!canStyle(style,pantry))continue;if(style==='茄汁'&&(!c.includes('fq')||c.length<2))continue;const fit=fitScore(style,c);if(fit<.55)continue;
    const spec={foods:c.map(id=>({id,g:gOf[id]||defaultG(id,c)})),style,method:'自动',meat:'',veg:'',cons:Object.assign({},input.cons||{},input.pref&&input.pref.spicy==='不辣'?{noSpicy:true}:{}),missing,pref:input.pref};
    jobs.push({spec,fit,pair:pairScore(c),ps:prefScore(style,input.pref)})}
  return{jobs,missing}}
function quickEval(job){const spec=Object.assign({},job.spec);spec.method=autoMethod(spec.foods,spec.style);const T=prefTarget(designTarget(spec),spec.pref);
  const fin=spec.method==='蒸'?'C':spec.method==='凉拌'?'B':'pot';const eat=spec.style==='五香卤'?'drain':'all';
  const S=buildSteps(spec,{});const r=runEval(S,fin,eat);const L=designScore(r,T,spec);job.q=Math.max(0,100-L*3);job.t=r.sim.t;job.total=tasty(job,job.q);return job}
function tasty(job,perfect){return Math.round(Math.max(0,Math.min(100,perfect*.55+job.fit*28+job.pair+job.ps+2)))}
function pickTop(jobs,n){const L=jobs.filter(j=>j.total>=55).sort((a,b)=>b.total-a.total);const out=[];const perCombo={},perFood={},perStyle={};
  for(const j of L){const ids=j.spec.foods.map(f=>f.id);const ck=ids.slice().sort().join('+');const st=j.spec.style;
    if((perCombo[ck]||0)>=2||(perStyle[st]||0)>=2||ids.some(i=>(perFood[i]||0)>=3))continue;
    if(out.some(o=>o.spec.foods.map(f=>f.id).slice().sort().join('+')===ck&&o.spec.style===st))continue;
    perCombo[ck]=(perCombo[ck]||0)+1;perStyle[st]=(perStyle[st]||0)+1;ids.forEach(i=>perFood[i]=(perFood[i]||0)+1);out.push(j);if(out.length>=n)break}
  return out}
function reason(job){const fn=job.spec.foods.map(f=>FD[f.id].name.split('/')[0].replace(/\(.*\)/,''));let s=WHY[job.spec.style]||'';
  const ids=job.spec.foods.map(f=>f.id);for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(isPair(ids[i],ids[j]))s=`${fn[i]}配${fn[j]}是经典搭配；`+s;
  if(fitScore(job.spec.style,[ids[0]])>=1)s+=`，${fn[0]}最适合这个味型`;return s}
if(typeof module!=='undefined')module.exports={parseFoodsX,pickTop,parseSeas,parseFoods,fridgePlan,quickEval,tasty,reason,PANTRY};
