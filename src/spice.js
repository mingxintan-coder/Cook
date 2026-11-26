// ===== 香料调配引擎 =====
const NOTES=[['anise','茴香甘甜'],['cinna','桂皮木香'],['warm','温辛'],['citrus','柑橘清香'],['cool','樟凉'],['floral','花香'],['herbal','药草香'],['root','根土香'],['seed','籽香'],['roast','焙烤焦香'],['pungent','辛辣'],['spicy','辣'],['numb','麻'],['sweet','回甘'],['bitter','苦涩']];
// 挥发性（每分钟沸煮损失）：前调高、中调中、后调低
const VOL={cool:.03,citrus:.025,floral:.02,pungent:.01,seed:.008,anise:.005,cinna:.005,warm:.005,herbal:.004,root:.003,roast:.004,numb:.004,spicy:0,sweet:0,bitter:0};
const LAYER={cool:'前调',citrus:'前调',floral:'前调',pungent:'前调',anise:'中调',cinna:'中调',warm:'中调',seed:'中调',numb:'中调',spicy:'中调',herbal:'后调',root:'后调',roast:'后调',sweet:'后调',bitter:'后调'};
const SPX={};
function X(id,name,n,o){SPX[id]=Object.assign({id,name,n,kW:.03,kO:.012,win:[110,160],okMin:120,ob:.05,burnT:180,max:5,role:'辅香',tip:'',col:null},o)}
X('bj','八角',{anise:3,sweet:.3,warm:.3},{okMin:120,ob:.03,max:8,role:'主香',tip:'卤、红烧的骨架香；多了发甜发闷'});
X('gp','桂皮',{cinna:2.6,sweet:.3,bitter:.12},{okMin:60,ob:.2,max:6,role:'主香',tip:'木质暖香；久煮出涩，用量是八角的一半左右'});
X('xy','香叶',{herbal:1.5,cool:.8,floral:.3},{okMin:40,ob:.4,max:1.5,role:'辅香',tip:'1 片约 0.3g，40 分钟后捞出，否则发苦'});
X('cg','草果',{cool:1.6,root:.8,pungent:.6,roast:.2},{okMin:90,ob:.2,max:5,role:'去腥',tip:'压牛羊膻味的主力，需拍破去籽减苦'});
X('dx','丁香',{warm:4,numb:.3,bitter:.2},{okMin:60,ob:.5,max:.8,role:'增香',tip:'味极霸道，每公斤肉不超过 1 克'});
X('xhx','小茴香',{anise:1.5,seed:1,sweet:.2},{okMin:120,max:5,role:'辅香',tip:'和八角同属茴香调，更清淡带籽香；压羊膻'});
X('hj','红花椒',{numb:3,citrus:.6,warm:.4},{kO:.02,okMin:90,ob:.1,burnT:170,max:8,role:'麻',tip:'油温超 170°C 发黑发苦'});
X('qhj','青花椒',{numb:3.3,citrus:1.5,floral:.4},{kO:.025,okMin:40,ob:.12,burnT:160,max:8,role:'麻',tip:'清香型麻，怕高温久煮'});
X('cp','陈皮',{citrus:1.4,sweet:.3,bitter:.3,herbal:.3},{okMin:180,ob:.03,max:10,role:'调和',tip:'理气解腻，适合牛肉、鸭、红豆沙'});
X('bz','白芷',{root:2,herbal:1.2,bitter:.3},{okMin:90,ob:.3,max:3,role:'去腥',tip:'增香去腥，多了有明显药味'});
X('sn','山奈(沙姜)',{root:1.5,cool:1,pungent:.8,floral:.4},{max:4,role:'增香',tip:'粤式白卤、盐焗鸡的灵魂'});
X('glj','高良姜(南姜)',{pungent:1.6,root:1,cool:.5},{max:6,role:'增香',tip:'潮汕卤水的主香'});
X('bk','白豆蔻',{cool:2,citrus:.6,floral:.5},{max:3,role:'增香',tip:'清凉芳香，去异味；香气易散'});
X('cdk','草豆蔻',{cool:1.2,root:.6,herbal:.4},{max:3,role:'去腥',tip:'暖胃去腥，常用于火锅底料'});
X('sr','砂仁',{cool:1.8,citrus:.5,herbal:.5},{max:3,role:'增香',tip:'樟凉带柑橘，酱牛肉常用'});
X('rdk','肉豆蔻',{warm:2.2,sweet:.3,bitter:.2},{max:1.5,role:'增香',tip:'含肉豆蔻醚，大量食用有毒性，务必少放'});
X('gc','甘草',{sweet:2,herbal:.3},{okMin:180,ob:0,max:4,role:'回甘',tip:'调和诸香、回甘；多了发甜发腻'});
X('bb','荜拨',{pungent:2,warm:.6},{max:3,role:'增香',tip:'胡椒近亲，辛辣带温香'});
X('xm','香茅',{citrus:2,floral:.5},{max:5,role:'增香',tip:'柠檬样清香，东南亚与粤式常用'});
X('gs','甘松',{herbal:1.6,root:.8,floral:.3,bitter:.1},{max:2,role:'辅香',tip:'带特殊药香，火锅底料常见'});
X('pc','排草/灵草',{herbal:1.2,floral:.8},{max:2,role:'辅香',tip:'卤水用的草本香'});
X('jlx','九里香',{floral:1.2,herbal:.5},{max:2,role:'辅香',tip:'花香型，卤水点缀'});
X('zr','孜然',{seed:3,roast:.4,warm:.3},{kO:.03,burnT:178,max:15,role:'主香',tip:'遇热油或焙香才出味'});
X('yzz','芫荽籽',{seed:1.5,citrus:1,floral:.4},{max:8,role:'辅香',tip:'柑橘籽香，咖喱底料'});
X('bhj','白胡椒',{pungent:3,warm:.3},{okMin:20,ob:.1,max:4,role:'辛辣',tip:'香气易散，粉末后放'});
X('hhj','黑胡椒',{pungent:2.2,warm:.8,roast:.3},{max:5,role:'辛辣',tip:'比白胡椒更香更粗犷'});
X('gla','干辣椒',{spicy:2.5,roast:.6},{kO:.02,win:[115,160],burnT:178,max:40,role:'辣',tip:'油炒成棕红有煳辣香，发黑即苦',col:'red'});
X('gj','干姜',{pungent:2,warm:.5},{max:5,role:'辛辣',tip:'去腥暖身，炖羊肉常用'});
X('jh','姜黄',{root:.8,bitter:.3},{max:5,role:'调色',tip:'咖喱黄色来源，味道微苦土香',col:'yellow'});
X('zc','紫草',{root:.2},{max:3,role:'调色',tip:'油溶性红色，几乎无味',col:'red'});
X('zz','栀子',{bitter:.25},{max:3,role:'调色',tip:'水溶性黄色',col:'yellow'});
X('lhg','罗汉果',{sweet:2.5},{okMin:240,ob:0,max:3,role:'回甘',tip:'清甜，替代部分糖'});
X('dg','当归',{herbal:2.5,sweet:.3,bitter:.3},{max:3,role:'药香',tip:'药膳炖汤，香气浓烈'});
X('gzh','桂枝',{cinna:1,herbal:.3},{max:5,role:'辅香',tip:'比桂皮温和'});
X('zm','白芝麻',{roast:1.2,sweet:.2},{burnT:190,max:20,role:'增香',tip:'焙香后研磨香气最足'});
const SCATS={'主香':['bj','gp','zr','xhx'],'去腥':['cg','bz','cdk','gj','xy'],'增香':['dx','sn','glj','bk','sr','rdk','bb','xm','zm'],'清香':['cp','xm','qhj','yzz','bk'],'药草':['gs','pc','jlx','dg','gzh','bz'],'麻辣':['hj','qhj','gla','bhj','hhj'],'回甘调色':['gc','lhg','jh','zc','zz']};
const METHODS={powder:'研磨成粉直接用（腌/拌/撒）',roast:'干锅焙香后研磨',oil:'热油炸香（炒底料）',water:'炖煮/卤（整粒下水）'};

// 计算单一时刻的香气
function blendAt(items,m){
  // items:[{id,g}]  m:{method,kg,oilT,sec,min,lid,form}
  const N={};for(const [k] of NOTES)N[k]=0;const per={};let burnMax=0;const kg=Math.max(.1,+m.kg||1);const col={red:0,yellow:0};
  for(const it of items){const d=SPX[it.id];if(!d||!(it.g>0))continue;const g=it.g/kg;let rel=1,keep={},burn=0,extra={},bit=0;
    for(const [k] of NOTES)keep[k]=1;
    if(m.method==='powder'){rel=1}
    else if(m.method==='roast'){rel=1;for(const k of['cool','citrus','floral'])keep[k]=.75;extra.roast=.18*Object.values(d.n).reduce((a,b)=>a+b,0);bit=.02}
    else if(m.method==='oil'){const T=+m.oilT||140,s=m.sec==null?60:+m.sec;const fT=clamp((T-100)/60,0,1.5);const k=d.kO*(m.form==='powder'?4:1);rel=1-Math.exp(-k*s*fT);
      for(const kk in VOL)keep[kk]=Math.exp(-VOL[kk]*s/60*Math.max(0,(T-60)/60)*2);
      if(T>d.burnT){burn=1-Math.exp(-.05*(T-d.burnT)/20*s*(m.form==='powder'?2:1))}
      if(T>125)extra.roast=Math.min(1,(T-125)/50)*Math.min(1,s/90)*.25*Object.values(d.n).reduce((a,b)=>a+b,0)*(1-burn)}
    else if(m.method==='water'){const t=m.min==null?60:+m.min;const k=d.kW*(m.form==='powder'?4:1);rel=1-Math.exp(-k*t);
      for(const kk in VOL)keep[kk]=Math.exp(-VOL[kk]*t*(m.lid?.3:1));
      if(d.okMin&&d.ob)bit=d.ob*clamp((t*(m.form==='powder'?1.6:1)-d.okMin)/d.okMin,0,2)}
    const contrib={};
    for(const k in d.n){const v=g*d.n[k]*rel*keep[k]*(1-burn);contrib[k]=v}
    for(const k in extra)contrib[k]=(contrib[k]||0)+g*extra[k];
    if(burn>0){contrib.bitter=(contrib.bitter||0)+g*2.5*burn;contrib.roast=(contrib.roast||0)+g*.5*burn}
    if(bit)contrib.bitter=(contrib.bitter||0)+g*bit*1.6;
    for(const k in contrib)N[k]+=contrib[k];per[it.id]=contrib;burnMax=Math.max(burnMax,burn);
    if(d.col)col[d.col]+=g*(m.method==='water'?rel:1)}
  return finishNotes(N,per,burnMax,col)}
function finishNotes(N,per,burnMax,col){
  // 感知：回甘压苦，辣麻掩盖细香
  const raw=Object.assign({},N);
  N.bitter*=1-.35*Math.min(1,N.sweet/6);
  const heat=N.spicy*.5+N.numb*.3;for(const k of['floral','citrus','herbal','cool'])N[k]*=1-.3*Math.min(1,heat/12);
  const D={};for(const [k] of NOTES)D[k]=+(10*(1-Math.exp(-N[k]/9))).toFixed(2);
  return{D,N,raw,per,burnMax,col}}

function blendInfo(items,m){return decorate(blendAt(items,m))}
function decorate(r){const tot={};let all=0;
  for(const id in r.per){const v=Object.entries(r.per[id]).filter(([k])=>k!=='bitter').reduce((a,[,b])=>a+b,0);tot[id]=v;all+=v}
  const share=Object.entries(tot).map(([id,v])=>[id,all?v/all:0]).sort((a,b)=>b[1]-a[1]);
  const top=NOTES.map(([k,n])=>[k,n,r.D[k]]).filter(x=>x[0]!=='bitter').sort((a,b)=>b[2]-a[2]);
  const layers={'前调':[],'中调':[],'后调':[]};for(const [k,n,v] of top)if(v>=1.2)layers[LAYER[k]].push([n,v]);
  const aroma=top.reduce((a,x)=>a+x[2],0);
  return Object.assign(r,{share,top,layers,aroma})}

// 时间曲线：总香气与苦涩
function blendCurve(items,m){const pts=[];
  if(m.method==='water'){const T=Math.max(120,(+m.min||60)*1.6);for(let t=0;t<=T;t+=Math.max(1,Math.round(T/80))){const r=blendAt(items,Object.assign({},m,{min:t}));pts.push([t,sumAroma(r.D),r.D.bitter])}return{pts,unit:'分钟'}}
  if(m.method==='oil'){const T=Math.max(180,(+m.sec||60)*1.6);for(let t=0;t<=T;t+=Math.max(2,Math.round(T/80))){const r=blendAt(items,Object.assign({},m,{sec:t}));pts.push([t,sumAroma(r.D),r.D.bitter])}return{pts,unit:'秒'}}
  return null}
function sumAroma(D){let s=0;for(const [k] of NOTES)if(k!=='bitter'&&k!=='spicy'&&k!=='numb')s+=D[k];return s}
function bestTime(curve){let best=null;for(const [t,a,b] of curve.pts){const sc=a-2.2*b;if(!best||sc>best[1]+.05)best=[t,sc]}return best?best[0]:0}

// 经典复合香料
const BLENDS=[
 {id:'wxf',name:'五香粉',m:{method:'powder',kg:1},it:{bj:3,gp:2,xhx:2,dx:.5,hj:1.5},dishes:['五香熏鱼','粉蒸肉','五香卤蛋','五香花生','五香牛肉'],use:'腌肉每公斤 3–5g，或出锅前撒'},
 {id:'ssx',name:'十三香',m:{method:'powder',kg:1},it:{bj:2,gp:1.5,xhx:1.5,hj:1.5,dx:.3,sr:.5,bk:.5,cg:.5,rdk:.3,sn:.5,bz:.5,gj:.5,cp:.5},dishes:['十三香小龙虾','饺子/包子馅','卤肉','家常炖菜'],use:'馅料每公斤 3–5g'},
 {id:'hl',name:'川式红卤',m:{method:'water',kg:1,min:120,lid:1},it:{bj:5,gp:3,xy:1,cg:3,xhx:2,hj:3,gla:4,dx:.5,cp:2,bz:1,sn:1,gc:1},dishes:['卤牛肉','卤猪蹄','卤鸡爪','卤豆干','卤藕'],use:'每 2L 卤水配 1kg 料，小火卤 1–2 小时'},
 {id:'bl',name:'粤式白卤/沙姜',m:{method:'water',kg:1,min:40,lid:1},it:{sn:4,bj:2,gc:1,cg:1,xy:.5,cp:1,gp:1},dishes:['白卤鸡','盐焗鸡','沙姜猪手','白切鸡蘸料'],use:'浸卤 30–40 分钟后关火浸泡'},
 {id:'cs',name:'潮汕卤水',m:{method:'water',kg:1,min:90,lid:1},it:{glj:6,bj:3,gp:3,gc:2,dx:.5,xm:2,cp:2,hj:1},dishes:['潮汕卤鹅','卤水拼盘','卤大肠'],use:'南姜为主，配老抽冰糖'},
 {id:'hg',name:'火锅/麻辣香料',m:{method:'oil',kg:1,oilT:130,sec:600,form:'whole'},it:{bj:3,gp:2,xy:1,cg:2,xhx:2,bk:1.5,sr:1,sn:1.5,dx:.3,gs:.5,hj:8,gla:30},dishes:['重庆火锅','冒菜','麻辣香锅','水煮肉片','毛血旺'],use:'牛油小火慢炒 10–20 分钟'},
 {id:'xj',name:'新疆烧烤料',m:{method:'roast',kg:1},it:{zr:15,gla:6,yzz:2,zm:3,hhj:1},dishes:['羊肉串','孜然羊肉','烤茄子','烤馕','烤鸡翅'],use:'烤至七成熟时撒，每串约 1g'},
 {id:'db',name:'东北炖肉料',m:{method:'water',kg:1,min:60,lid:1},it:{bj:3,gp:2,xy:1,hj:2,gj:1},dishes:['小鸡炖蘑菇','猪肉炖粉条','酸菜白肉','排骨炖豆角'],use:'整粒入锅，炖 1 小时'},
 {id:'ys',name:'羊肉去膻料',m:{method:'water',kg:1,min:90,lid:0},it:{cg:4,bz:1.5,xhx:2,cp:2,hj:2,sr:1,gj:2},dishes:['清炖羊肉','羊蝎子','手抓羊肉','羊肉汤'],use:'先开盖炖 20 分钟散膻，再加盖'},
 {id:'jn',name:'北京酱牛肉料',m:{method:'water',kg:1,min:150,lid:1},it:{bj:4,gp:3,hj:2,xhx:3,dx:.5,bz:1,sr:1,cg:2,cp:1},dishes:['酱牛肉','酱肘子','酱猪蹄'],use:'配黄酱，小火 2.5 小时'},
 {id:'gl',name:'中式咖喱底料',m:{method:'oil',kg:1,oilT:130,sec:60,form:'powder'},it:{jh:4,yzz:4,zr:2,hhj:1,gj:1,gp:1,dx:.2,xhx:1,gla:1},dishes:['咖喱鸡','咖喱牛腩','咖喱鱼蛋','咖喱土豆'],use:'小火油炒 1 分钟出香再加汤'},
 {id:'hs',name:'红烧香料',m:{method:'water',kg:1,min:60,lid:1},it:{bj:2,gp:1.5,xy:.5},dishes:['红烧肉','红烧排骨','红烧牛腩','红烧鸡块'],use:'少而精，突出酱香糖色'},
 {id:'lr',name:'腊肉腌料',m:{method:'powder',kg:1},it:{hj:4,bj:1,gp:1,bhj:1},dishes:['四川腊肉','腊肠','咸肉'],use:'配盐 30–40g/kg 干腌 5–7 天'},
 {id:'yt',name:'药膳炖汤料',m:{method:'water',kg:1,min:90,lid:1},it:{dg:3,gc:1,cp:1,gj:1,lhg:.5},dishes:['当归羊肉汤','药膳鸡汤','当归鸭'],use:'清汤小火 1.5 小时'},
 {id:'tj',name:'藤椒/青花椒风味',m:{method:'oil',kg:1,oilT:120,sec:30},it:{qhj:8,xm:1},dishes:['藤椒鸡','青花椒鱼','藤椒钵钵鸡'],use:'低油温淋泼，保持清香'},
];
function vecOf(D){return NOTES.map(([k])=>D[k])}
function cos(a,b){let s=0,x=0,y=0;for(let i=0;i<a.length;i++){s+=a[i]*b[i];x+=a[i]*a[i];y+=b[i]*b[i]}return x&&y?s/Math.sqrt(x*y):0}
const blendCache={};
function blendProfile(b){if(!blendCache[b.id]){const items=Object.entries(b.it).map(([id,g])=>({id,g}));blendCache[b.id]=blendInfo(items,b.m)}return blendCache[b.id]}
function matchBlends(info){const v=vecOf(info.D);return BLENDS.map(b=>{const p=blendProfile(b);const c=cos(v,vecOf(p.D));const ia=info.aroma,ib=p.aroma;const ratio=ia&&ib?Math.min(ia,ib)/Math.max(ia,ib):0;
  return{b,score:Math.round(100*Math.max(0,c)*(.8+.2*ratio)),c}}).sort((a,b)=>b.score-a.score)}
// 规则：按主导香型推荐食材与菜
function dishRules(info){const D=info.D,R=[];const s=(k)=>D[k]||0;
  if(s('anise')+s('cinna')>9)R.push(['猪肉、牛腩红烧或卤','茴桂暖香和酱油糖色最搭']);
  if(s('cool')+s('root')>7)R.push(['牛羊肉炖煮','樟凉与根土香压膻去腥']);
  if(s('seed')>4)R.push(['烧烤、干煸、烤羊肉','籽香需要高温油脂激发']);
  if(s('citrus')+s('floral')>5)R.push(['禽类、鱼、白卤','清香型怕重酱色，宜清淡做法']);
  if(s('numb')>4&&s('spicy')>4)R.push(['火锅、水煮、麻辣香锅','麻辣为主的川渝做法']);
  else if(s('numb')>4)R.push(['椒麻鸡、腊肉、花椒鸡','突出麻香']);
  if(s('herbal')>4)R.push(['炖汤、药膳','药草香适合长时间清炖']);
  if(s('pungent')>4)R.push(['汤、羊肉、腌料','辛辣去腥暖身']);
  if(s('roast')>4)R.push(['撒料、蘸碟','焙烤香适合最后撒']);
  if(!R.length)R.push(['清淡炖菜或蘸料','香气较轻，可加量或换主香']);
  return R.slice(0,4)}
function blendWarnings(items,m,info){const W=[];const kg=Math.max(.1,+m.kg||1);let tot=0;
  for(const it of items){const d=SPX[it.id];if(!d)continue;if(!['gla','hj','qhj','zm'].includes(it.id))tot+=it.g;const per=it.g/kg;
    if(per>d.max*1.3)W.push([2,`${d.name}每公斤 ${per.toFixed(1)}g，超过常用上限约 ${d.max}g：${d.tip}`]);
    else if(per>d.max)W.push([1,`${d.name}偏多（${per.toFixed(1)}g/kg，常用 ≤${d.max}g）。`]);
    if(m.method==='water'&&d.okMin&&d.ob>=.15&&(+m.min||0)>d.okMin*1.2)W.push([1,`${d.name}煮 ${m.min} 分钟会出苦涩，约 ${d.okMin} 分钟后捞出。`]);
    if(m.method==='oil'&&(+m.oilT||0)>d.burnT)W.push([2,`油温 ${m.oilT}°C 超过${d.name}的焦化点（约 ${d.burnT}°C），会发黑发苦。`]);
    if(it.id==='rdk'&&per>1.5)W.push([2,'肉豆蔻用量过大可能引起不适，请减少。'])}
  const tp=tot/kg;const lim=m.method==='powder'||m.method==='roast'?[2,30]:[3,40];
  if(items.length&&tp<lim[0])W.push([0,`香料总量（不含辣椒花椒）${tp.toFixed(1)}g/kg 偏轻，香气可能不明显。`]);
  if(tp>lim[1])W.push([1,`香料总量（不含辣椒花椒）${tp.toFixed(1)}g/kg 偏重，容易药味盖过肉香。`]);
  if(info.share.length>2&&info.share[0][1]>.6)W.push([0,`${SPX[info.share[0][0]].name}占了 ${Math.round(info.share[0][1]*100)}% 的香气，其他香料几乎被盖住。`]);
  if(info.D.bitter>3)W.push([2,`苦涩明显（${info.D.bitter.toFixed(1)}）：检查焦化、久煮或苦味香料用量。`]);
  if(m.method==='powder'&&items.some(i=>['zr','zm'].includes(i.id)))W.push([0,'孜然、芝麻生粉香气弱，焙香后研磨更香。']);
  const seen=new Set();return W.filter(w=>!seen.has(w[1])&&seen.add(w[1]))}
function describe(info){const t=info.top.filter(x=>x[2]>=1.2);if(!t.length)return'香气很淡。';
  const w=v=>v>7?'浓郁的':v>4.5?'明显的':'淡淡的';let s=`以${w(t[0][2])}${t[0][1]}为主调`;
  if(t[1])s+=`，${t[1][1]}${t[2]?'与'+t[2][1]:''}托底`;const fr=t.slice(3).filter(x=>LAYER[x[0]]==='前调');if(fr.length)s+=`，${fr.map(x=>x[1]).join('、')}提亮`;
  if(info.D.bitter>2)s+='，尾韵带苦';else if(info.D.sweet>3)s+='，回口带甘';return s+'。'}
// 转成模拟器调料
function blendToSeasoning(name,items,m,info){
  const kg=Math.max(.1,+m.kg||1);const tg=items.reduce((a,i)=>a+(+i.g||0),0);if(!tg)return null;
  const per={};const pw=blendAt(items,{method:'powder',kg:1}).raw;for(const k in pw)per[k]=pw[k]/tg;
  const ar=['anise','cinna','warm','cool','floral','herbal','root','seed','pungent'].reduce((a,k)=>a+per[k],0);
  const aroO={spice:ar*.33,numb:per.numb*.37,spicy:per.spicy*.09,fresh:per.citrus*.25+per.floral*.1,roast:per.roast*.2,sweet:per.sweet*.02};
  const powder=m.method==='powder'||m.method==='roast';
  const okMins=items.map(i=>SPX[i.id]).filter(d=>d&&d.ob>=.15).map(d=>d.okMin);
  return{name:'自配·'+name,cat:'香料',aroO,raw:powder?{spice:ar*.12}:{},rOil:powder?.05:.005,win:[100,155],rWater:powder?.005:.0007,burnT:powder?165:180,bBit:.3,vol:powder?.0004:.00015,whole:powder?0:1,okMin:okMins.length?Math.min(...okMins):0,ob:okMins.length?.15:0,items:items.map(i=>({id:i.id,g:i.g/kg})),def:Math.round(tg/kg*.5*10)/10,note:`自配复合香料（${items.length} 种）：${describe(info)}`}}
if(typeof module!=='undefined')module.exports={potAroma,NOTES,SPX,BLENDS,blendInfo,blendCurve,bestTime,matchBlends,dishRules,blendWarnings,describe,blendToSeasoning,SCATS,METHODS};

// ===== 锅里的香料 → 复合香味 =====
// 模拟器调料 id → 香料库 id（系数=每克相当于多少克该香料）
const IT2SPX={bj:[['bj',1]],gp:[['gp',1]],xy:[['xy',1]],cg:[['cg',1]],dx:[['dx',1]],xhx:[['xhx',1]],cp:[['cp',1]],sn:[['sn',.6],['bz',.4]],zr:[['zr',1]],
  hj:[['hj',1]],qhj:[['qhj',1]],gla:[['gla',1]],bhj:[['bhj',1]],hhj:[['hhj',1]],zm:[['zm',1]],ljm:[['gla',1]],hjm:[['hj',1]],jiang:[['gj',.05]],
  hyou:[['gla',.25]],hjy:[['hj',.3]],tjy:[['qhj',.3]],hs:[['zm',.3]]};
const POWDERY=new Set(['wxf','ssx','gl','ljm','hjm','bhj','hhj','zm']);
function blendParts(id){const b=BLENDS.find(x=>x.id===id);const t=Object.values(b.it).reduce((a,v)=>a+v,0);return Object.entries(b.it).map(([k,v])=>[k,v/t])}
function spxOf(id){if(IT2SPX[id])return IT2SPX[id];if(id==='wxf')return blendParts('wxf');if(id==='ssx')return blendParts('ssx');if(id==='gl')return blendParts('gl');
  const d=IT[id];if(d&&d.mix&&Array.isArray(d.items)){const t=d.items.reduce((a,i)=>a+i.g,0)||1;return d.items.filter(i=>SPX[i.id]).map(i=>[i.id,i.g/t])}return null}
function potAroma(c){
  const mf=foodMass(c);const kg=mf>50?mf/1000:1;const N={};for(const [k] of NOTES)N[k]=0;const per={};const col={red:0,yellow:0};let burnMax=0,totalG=0,heated=0;const used=[];
  for(const e of c.items){const parts=spxOf(e.id);if(!parts)continue;const d=IT[e.id];
    const pw=POWDERY.has(e.id)||(d.mix&&!d.whole);
    let eff=Math.min(1,e.ro+e.rw)*(1-e.lost);if(pw)eff+=Math.max(0,1-e.ro-e.rw)*.85*e.rawLeft;eff=Math.min(1,eff)*(1-e.burn);
    totalG+=e.g;used.push([d.name,e.g]);if(e.ro+e.rw>.05)heated=1;burnMax=Math.max(burnMax,e.burn);
    for(const [sid,f] of parts){const sp=SPX[sid];if(!sp)continue;const g=e.g*f/kg;const contrib={};let sum=0;
      for(const k in sp.n){contrib[k]=g*sp.n[k]*eff;sum+=sp.n[k]}
      if(e.ro>.05)contrib.roast=(contrib.roast||0)+g*sum*.2*Math.min(1,e.ro)*(1-e.burn);
      if(e.burn>.02){contrib.bitter=(contrib.bitter||0)+g*2.5*e.burn;contrib.roast=(contrib.roast||0)+g*.5*e.burn}
      if(sp.okMin&&sp.ob){const over=clamp((e.wetSec/60-sp.okMin)/sp.okMin,0,2);if(over>0)contrib.bitter=(contrib.bitter||0)+g*sp.ob*over*1.6}
      for(const k in contrib)N[k]+=contrib[k];
      const p=per[sid]||(per[sid]={});for(const k in contrib)p[k]=(p[k]||0)+contrib[k];
      if(sp.col)col[sp.col]+=g*eff}}
  if(!used.length||!c.items.some(e=>spxOf(e.id)&&!['jiang','hs','zm'].includes(e.id)&&e.g>=.3))return null;
  const info=decorate(finishNotes(N,per,burnMax,col));
  const near=matchBlends(info).slice(0,3);const b0=near[0].b;const per1=Object.values(b0.it).reduce((a,v)=>a+v,0);
  return{info,near,kg,mf,totalG,heated,used,supportKg:totalG/per1}}
