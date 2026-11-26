// 口味学习：给做过的菜打分 + 反馈 → 学出“我的口味画像” → 用来设计新菜
const FB=[['太咸','salt',-1],['太淡','salt',1],['太甜','sweet',-1],['不够甜','sweet',1],['太酸','sour',-1],['不够酸','sour',1],
 ['太辣','spicy',-1],['不够辣','spicy',1],['太麻','numb',-1],['不够麻','numb',1],['不够鲜','umami',1],['锅气不够','wok',1],
 ['酱味太重','ferment',-1],['香料味太冲','spice',-1],['太油腻','rich',-1],['不够浓郁','rich',1],
 ['肉太老','tex','meat:嫩'],['肉不够烂','tex','meat:烂'],['菜太软','tex','veg:脆'],['菜太生','tex','veg:软']];
const FBMAP=Object.fromEntries(FB.map(x=>[x[0],x]));
const STEP={salt:.7,sweet:1,sour:1,spicy:1.3,numb:1.2,umami:1,wok:1,ferment:1,spice:1,rich:1};
const LDIMS=['salt','sweet','sour','spicy','numb','umami','wok','ferment','spice','rich'];
const DIMN=Object.fromEntries(DIMS);
// 打分时给菜拍个“快照”：模拟出的味道 + 味型/做法/主料
function snapOf(b){const ev=evaluate(simulate(b.steps),b.fin,b.eat);const D={};for(const k of LDIMS)D[k]=+(ev.D[k]||0).toFixed(2);
  let style=b.style||'';if(!style){const m=/(?:AI 设计|冰箱推荐) · ([^ ·]+)/.exec(b.note||'');if(m&&STYLES[m[1]])style=m[1]}
  if(!style){const ft=flavorTypes(ev.D,ev.flags).map(x=>x[0]);style=ft.find(n=>STYLES[n])||''}
  let method=b.method||'';if(!method){const m=/ · [^ ·]+ · ([^ ·]+)/.exec(b.note||'');if(m)method=m[1]}
  const foods=[...new Set(b.steps.filter(s=>s.t==='add'&&FD[s.id]).map(s=>FD[s.id].base||s.id))];return{D,style,method,foods}}
function rateOf(b){return b.rates&&b.rates.length?b.rates[b.rates.length-1]:null}
// 学习：每道菜按最近一次打分；反馈给方向，高分且没反馈的菜说明“这个味道正合适”
function learnProfile(B){const R=B.filter(b=>rateOf(b)&&b.snap);const P={n:R.length,delta:{},style:{},food:{},method:{},meat:'',veg:'',ev:{}};if(!R.length)return P;
  const acc={};for(const k of LDIMS)acc[k]=[0,0];const sty={},fd={},me={};const tex={};const sd={};
  R.forEach((b,idx)=>{const r=rateOf(b),sn=b.snap,s=r.s;const rec=.6+.4*(idx<8?1:.5);// 最近的菜权重大一点（book 最新在前）
    const T=sn.style&&STYLES[sn.style]?styleTarget(sn.style):null;const tagDims=new Set();
    for(const t of r.tags||[]){const f=FBMAP[t];if(!f)continue;if(f[1]==='tex'){const [k,v]=f[2].split(':');tex[k]=tex[k]||{};tex[k][v]=(tex[k][v]||0)+rec;continue}
      const d=f[1];tagDims.add(d);const ideal=sn.D[d]+f[2]*STEP[d]*(s<=2?1.4:1);const ref=T?T[d]:sn.D[d];const x=T?ideal-ref:f[2]*STEP[d];acc[d][0]+=1.5*rec*x;acc[d][1]+=1.5*rec}
    if(s>=4&&T)for(const d of ['salt','sweet','sour','spicy','numb']){if(tagDims.has(d))continue;if((d==='spicy'||d==='numb')&&T[d]<.8&&sn.D[d]<.8)continue;const w=(s-3)*.3*rec;acc[d][0]+=w*(sn.D[d]-T[d]);acc[d][1]+=w}
    if(sn.style)for(const t of r.tags||[]){const f=FBMAP[t];if(!f||f[1]==='tex')continue;const d=f[1];sd[sn.style]=sd[sn.style]||{};const o=sd[sn.style][d]=sd[sn.style][d]||[0,0];o[0]+=f[2]*STEP[d]*(s<=2?1.4:1)*rec;o[1]+=rec}
    const v=(s-3)*rec;const add=(o,k)=>{if(!k)return;o[k]=o[k]||[0,0];o[k][0]+=v;o[k][1]+=1};add(sty,sn.style);add(me,sn.method);for(const f of sn.foods)add(fd,f)});
  for(const k of LDIMS){const [a,w]=acc[k];if(w>0){P.delta[k]=+Math.max(-2.5,Math.min(2.5,a/(w+1.2))).toFixed(2);P.ev[k]=+w.toFixed(1)}}
  P.sdelta={};for(const st in sd){P.sdelta[st]={};for(const d in sd[st]){const [a,w]=sd[st][d];P.sdelta[st][d]=+Math.max(-2,Math.min(2,a/(w+.6)-(P.delta[d]||0)*.5)).toFixed(2)}}
  const sh=(o,c,m)=>{const out={};for(const k in o){const [a,n]=o[k];out[k]=+Math.max(-m,Math.min(m,a/(n+c)*m/2)).toFixed(1)}return out};
  P.style=sh(sty,.6,8);P.method=sh(me,1.5,3);P.food=sh(fd,2,3);
  for(const k of ['meat','veg'])if(tex[k]){const best=Object.entries(tex[k]).sort((a,b)=>b[1]-a[1])[0];if(best[1]>=.9)P[k]=best[0]}return P}
// 应用：调目标味道
function learnTarget(T,L,style){if(!L||!L.n)return T;const D=Object.assign({},L.delta);const S=style&&L.sdelta&&L.sdelta[style];if(S)for(const k in S)D[k]=(D[k]||0)+S[k];for(const k in D){if((k==='spicy'||k==='numb')&&(T[k]||0)<.6)continue;T[k]=Math.max(0,Math.min(9.5,(T[k]||0)+D[k]))}return T}
// 应用：给味型 / 主料 / 做法加减分
function learnBonus(L,style,foods,method){if(!L||!L.n)return 0;let s=(L.style[style]||0);if(method)s+=L.method[method]||0;let f=0;for(const id of foods)f+=L.food[FD[id]&&FD[id].base||id]||0;s+=Math.max(-4,Math.min(4,f));
  for(const k of ['spicy','sweet','sour','numb']){const d=L.delta[k]||0;if(Math.abs(d)<.5)continue;const tg=STYLE_TASTE[style]||{};if(tg[k])s+=Math.sign(d)*Math.min(3,Math.abs(d)*1.5)*tg[k]}return Math.max(-10,Math.min(10,s))}
const STYLE_TASTE={'麻辣':{spicy:1,numb:1},'宫保':{spicy:.6,sweet:.5,numb:.4},'鱼香':{sweet:.6,sour:.6,spicy:.4},'酸辣':{sour:1,spicy:.8},'家常':{spicy:.7},'糖醋':{sweet:1,sour:1},'红烧':{sweet:.5},'茄汁':{sweet:.6,sour:.6},'孜然':{spicy:.5}};
// 把画像翻译成人话
function profileText(L){if(!L||!L.n)return{lines:[],likes:[],dislikes:[]};const lines=[];
  const word={salt:['偏淡','偏咸'],sweet:['少甜','偏甜'],sour:['少酸','偏酸'],spicy:['少辣','更辣'],numb:['少麻','更麻'],umami:['','更鲜'],wok:['','锅气更足'],ferment:['酱味轻些','酱香更浓'],spice:['香料轻些','香料更足'],rich:['清爽些','更浓郁']};
  for(const k of LDIMS){const d=L.delta[k]||0;if(Math.abs(d)<.3)continue;const w=word[k][d>0?1:0];if(!w)continue;lines.push({k,w,d,strong:Math.abs(d)>=1})}
  const st=Object.entries(L.style).filter(x=>x[1]!==0).sort((a,b)=>b[1]-a[1]);const likes=st.filter(x=>x[1]>=1).slice(0,4).map(x=>x[0]);const dislikes=st.filter(x=>x[1]<=-1).slice(-3).map(x=>x[0]);
  const fl=Object.entries(L.food).filter(x=>x[1]>=1).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>FD[x[0]]?FD[x[0]].name.split('/')[0]:x[0]);
  return{lines,likes,dislikes,foods:fl,meat:L.meat,veg:L.veg}}
// 按一次打分改良这道菜：反馈 → improve() 的口味方向
function rateToPrefs(r){const P={delta:{},meat:'',veg:'',cons:{},missing:[]};const k=r.s<=2?2:1;
  for(const t of r.tags||[]){const f=FBMAP[t];if(!f)continue;if(f[1]==='tex'){const [a,v]=f[2].split(':');P[a]=v}else P.delta[f[1]]=f[2]*k}return P}
if(typeof module!=='undefined')module.exports={FB,learnProfile,learnTarget,learnBonus,profileText,snapOf,rateOf,rateToPrefs};
