// ===== 菜谱卡：简洁、好操作、不漏关键步骤 =====
const PIECEW={cong:[15,'根'],sm:[15,'根'],xcai:[5,'根'],suan:[5,'瓣'],jiang:[3,'片'],bj:[2,'颗'],xy:[.3,'片'],gp:[3,'块'],cg:[4,'个'],jd:[50,'个'],xmj:[3,'个'],dx:[.1,'粒'],gla:[.4,'个']};
const CUTW={'液':'打散','整':'洗净','整条':'整条','末':'剁末','大块':'切大块'};const cutTxt=c=>CUTW[c]||('切'+c);
const fmtG=g=>g>=100?String(Math.round(g)):g>=10?String(Math.round(g*2)/2).replace(/\.0$/,''):String(Math.round(g*10)/10);
function measure(id,g){const d=IT[id];if(!d)return'';if(PIECEW[id]){const [w,u]=PIECEW[id];const n=g/w;if(n>=.5&&n<=40)return`${Math.round(n*2)/2} ${u}`}
  if(d.water||d.oil&&g>=60)return g>=50?`${Math.round(g/10)*10}ml`:'';
  const gran=['salt','bt','wj','jj','nrf','bingt','ht','jy'].includes(id),pow=['dian','mf','ljm','hjm','bhj','hhj','wxf','ssx','zr','gl'].includes(id);
  const sp=gran?9:pow?5:10;const ts=sp/3;
  if(g>=sp*.8){const n=g/sp;return`${Math.round(n*2)/2} 勺`}if(g>=ts*.4){const n=g/ts;return`${Math.round(n*2)/2} 茶勺`}if(g<1)return'少许';return''}
function dur(s){s=Math.round(s);if(s<60)return`${Math.max(5,Math.round(s/5)*5)} 秒`;if(s<600){const m=Math.floor(s/60),r=s%60;return r>=20&&r<=40?`${m} 分半`:`${Math.round(s/60)} 分钟`}
  if(s<3600)return`${Math.round(s/300)*5} 分钟`;const h=Math.floor(s/3600),m=Math.round((s%3600)/300)*5;return m?`${h} 小时 ${m} 分`:`${h} 小时`}
function oilCue(T){return T<140?'三四成热，筷子周围冒小泡':T<170?'五成热，筷子周围冒密集小泡':T<195?'六成热，油面微微晃动':T<215?'七成热，微冒青烟':'冒烟'}
const short=n=>n.replace(/[（(].*?[）)]/g,'').split('/')[0];
const PASTE=['db','tmj','hdj','ds','zhj','fqj','hgdl','dj','pj','csj','hxj'],CHILI=['gla','hj','qhj','hjm','ljm','zr'],AROMA=['cong','jiang','suan','yc','sm','xmj'],SUGAR=['bt','bingt','ht','fm'];
function recipeCard(steps0,opts){opts=opts||{};const k=opts.scale||1;const steps=JSON.parse(JSON.stringify(steps0));const sim=simulate(steps);const M=sim.marks;
  const name=id=>short((FD[id]||IT[id]||{name:'?'}).name);
  const lastHeat=steps.reduce((a,s,i)=>s.t==='heat'?i:a,-1);const pourIdx=c=>steps.findIndex(s=>s.t==='pour'&&s.from===c&&(s.to||'pot')==='pot');
  const groups={'主料':[],'腌料':[],'碗汁':[],'调料':[],'出锅时':[]};const seen={};const uses={};
  steps.forEach((s,i)=>{if(s.t!=='add')return;uses[s.id]=(uses[s.id]||0)+1;const d=FD[s.id]||IT[s.id];if(!d)return;let g='调料';
    if(FD[s.id])g='主料';else if(s.c==='A'&&pourIdx('A')>i)g='腌料';else if(s.c==='B'&&pourIdx('B')>i)g='碗汁';else if(i>lastHeat&&lastHeat>=0)g='出锅时';
    const key=g+'|'+s.id;if(seen[key]){seen[key][1]+=s.g*k;return}const row=[d.name,s.g*k,s.id,(FD[s.id]?cutTxt(s.cut||d.cut):'')+(s.est?(FD[s.id]?'，':'')+'估':'')];seen[key]=row;groups[g].push(row)});
  const ing=Object.entries(groups).filter(([,r])=>r.length).map(([t,rows])=>({t,rows:rows.map(r=>({name:short(r[0]),g:fmtG(r[1]),m:FD[r[2]]?'':measure(r[2],r[1]),note:r[3]}))}));
  const nm=s=>{const n=name(s.id);return uses[s.id]>1&&!FD[s.id]?`${n} ${fmtG(s.g*k)}g`:n};
  const list=a=>a.length<=1?a.join(''):a.slice(0,-1).join('、')+'和'+a[a.length-1];
  // 备料
  const prep=[];const foods=steps.filter(s=>s.t==='add'&&FD[s.id]);
  const cutL=[...new Map(foods.map(s=>[s.id,s])).values()].map(s=>`${name(s.id)}${cutTxt(s.cut||FD[s.id].cut)}`);
  if(cutL.length)prep.push({t:'切配',x:cutL.join('，')});
  const bl=foods.filter(s=>s.prep==='blanch'),pb=foods.filter(s=>s.prep==='preboil');
  if(bl.length)prep.push({t:'焯水',x:`${list(bl.map(s=>name(s.id)))}冷水下锅，水开后撇去浮沫再煮 1–2 分钟，捞出用温水洗净`,key:1});
  if(pb.length)prep.push({t:'预煮',x:`${list(pb.map(s=>name(s.id)))}冷水下锅煮到筷子能扎透，捞出放凉${pb.some(s=>['片','丝','丁'].includes(s.cut))?'再切':''}`,key:1});
  const used=new Set();let prepRest=0;
  for(const c of['A','B']){const pi=pourIdx(c);if(pi<0)continue;if(steps.slice(0,pi).some(x=>x.t==='pour'&&x.to===c&&x.from==='pot'))continue;const adds=steps.map((s,i)=>[s,i]).filter(([s,i])=>s.t==='add'&&s.c===c&&i<pi);if(!adds.length)continue;adds.forEach(([,i])=>used.add(i));
    const egg=s=>FD[s.id]&&(FD[s.id].egg||(FD[FD[s.id].base||'']||{}).egg);const hasMain=adds.some(([s])=>FD[s.id]&&!egg(s));const fs=adds.filter(([s])=>FD[s.id]&&!(hasMain&&egg(s))).map(([s])=>name(s.id)),ss=adds.filter(([s])=>!FD[s.id]||(hasMain&&egg(s))).map(([s])=>FD[s.id]?name(s.id):nm(s));
    if(c==='A'||fs.length){let rest=0,cold=0;steps.forEach((s,i)=>{if(s.t==='rest'&&i<pi&&i<steps.findIndex(x=>x.t==='heat'||x.t==='pour')+1){rest+=s.s;prepRest+=s.s;if(s.cold)cold=1;used.add(i)}});prep.push({t:'腌制',x:`${list(fs)||'食材'}加${list(ss)}抓匀${rest?(rest>=21600?'，盖保鲜膜冷藏腌一夜（8 小时以上）':`，${cold?'冷藏':''}腌 ${dur(rest)}`):''}`,key:rest>=3600?1:0})}
    else prep.push({t:'调碗汁',x:`${list(ss)}放一碗搅匀备用`})}
  // C 盘里只放了预处理食材、之后倒进锅：算备料
  const pc=pourIdx('C');const cPrep=pc>=0&&!steps.slice(0,pc).some(x=>x.t==='pour'&&x.to==='C');let cFoods=[];
  if(cPrep){steps.forEach((x,i)=>{if(i<pc&&x.t==='add'&&x.c==='C'&&FD[x.id]){used.add(i);cFoods.push(name(x.id))}})}
  // 做法
  // 每一步时锅里有哪些食材（判断“煎”：大片/大块的肉，少油、不带汤）
  const potAt=[];{const C={pot:new Set(),A:new Set(),B:new Set(),C:new Set()};steps.forEach((s,i)=>{if(s.t==='add'&&FD[s.id])(C[s.c||'pot']||C.pot).add(s);if(s.t==='pour'){const to=s.to||'pot';for(const x of C[s.from])C[to].add(x);C[s.from]=new Set()}if(s.t==='remove')for(const x of [...C[s.c||'pot']])if(x.id===s.id)C[s.c||'pot'].delete(x);potAt[i]=[...C.pot]})}
  const BIG=['厚片','块','大块','整','整条'];const bigPieces=i=>(potAt[i]||[]).some(x=>BIG.includes(x.cut||FD[x.id].cut)&&!['液'].includes(x.cut));
  const fryCue=(i,ad)=>{const eg=x=>FD[x.id]&&(FD[x.id].egg||(FD[FD[x.id].base||'']||{}).egg);if(ad&&ad.length&&ad.some(x=>FD[x.id])&&ad.filter(x=>FD[x.id]).every(eg))return'把蛋液摊开，等基本凝固再翻面';const fs=potAt[i]||[];if(fs.length&&fs.every(x=>(x.cut||FD[x.id].cut)==='液'||FD[x.id].egg))return'摊开煎至底面定型，再翻面或划散';return bigPieces(i)?'煎至两面金黄、中间熟透，中途翻一次面':'煎至表面微黄，翻动几次'};
  const batch=i=>bigPieces(i)&&(potAt[i]||[]).reduce((a,x)=>a+x.g,0)>600?'（量多就分几批煎，别叠着）':'';const isFry=(i,p)=>{const fs=potAt[i]||[];const h=steps[i].how;if(h==='煎')return fs.length&&!p.wet&&(p.oil||0)<150;if(h)return false;if(steps.some(x=>x.how))return false;return fs.length&&!p.wet&&(p.oil||0)<90&&fs.every(x=>['厚片','整条'].includes(x.cut||FD[x.id].cut)||!MEATC.includes(FD[x.id].cat))&&fs.some(x=>['厚片','整条'].includes(x.cut||FD[x.id].cut))&&fs.some(x=>BIG.includes(x.cut||FD[x.id].cut)&&MEATC.concat(['蛋']).includes(FD[x.id].cat))&&fs.every(x=>BIG.includes(x.cut||FD[x.id].cut)||!MEATC.includes(FD[x.id].cat))};
  const cook=[];let buf=[];const potState=i=>{const m=M[i+1];return sim.potLog[Math.max(0,(m?m.t:sim.t)-1)]||{}};
  const firstHeat=steps.findIndex(x=>x.t==='heat');const prev0=()=>cook[cook.length-1];
  steps.forEach((s,i)=>{if(used.has(i))return;if(s.t==='rest'&&i<firstHeat&&!buf.length)return;
    if(s.t==='rest'&&i<firstHeat&&buf.length){const fs=buf.filter(a=>FD[a.id]).map(a=>name(a.id)),ss=buf.filter(a=>!FD[a.id]).map(nm);buf=[];
      const st=steps.slice(i+1).find(x=>x.t==='heat');cook.push({t:'腌制',x:`${list(fs)||'食材'}${st&&st.m==='steam'?'放进蒸盘，铺上':'加'}${list(ss)}，腌 ${dur(s.s)}`});return}
    if(s.t==='add'){buf.push(s);return}
    if(s.t==='heat'){const side=buf.filter(a=>a.c&&a.c!=='pot');const adds=buf.filter(a=>!a.c||a.c==='pot');buf=[];
      if(side.length)cook.push({t:'调味',x:`${list(side.map(a=>FD[a.id]?name(a.id):nm(a)))}放在菜上`});
      const p=potState(i);const f=['','小火','中火','大火'][+s.f||2];const d0=s._ran!=null?s._ran:s.s;
      const ids=adds.map(a=>a.id);const onlyOil=adds.length&&adds.every(a=>IT[a.id]&&IT[a.id].oil);
      let t='下料',x='',key=0;
      if(!adds.length&&!(potAt[i]||[]).length&&!(p.oil>2)&&!p.wet&&!s.u&&s.m!=='steam'&&s.m!=='press'&&!(sim.cs&&0)){const pv=cook[cook.length-1];if(!(pv&&/碗汁|下料|调味/.test(pv.t))){cook.push({t:'烧锅',x:`空锅${f}烧到冒烟（约 ${dur(d0)}）`});return}}const addTxt=adds.length?(onlyOil?`锅烧热倒入${list(adds.map(nm))}`:`下${list(adds.map(a=>FD[a.id]?name(a.id):nm(a)))}`):'';
      const pre=addTxt?addTxt+'，':'';
      if(s.m==='steam'){t='蒸';x=`${pre}水开后上锅${f}蒸 ${dur(d0)}`;key=1}
      else if(s.m==='bake'){t='烤';const pv=cook[cook.length-1];const spray=adds.some(a=>IT[a.id]&&IT[a.id].oil)?'，表面喷一层油':'';const sprinkle=adds.filter(a=>!(IT[a.id]&&IT[a.id].oil));const addB=sprinkle.length?`撒上${list(sprinkle.map(a=>FD[a.id]?name(a.id):nm(a)))}`:'';if(pv&&pv.t==='下锅'&&!sprinkle.length){pv.t='烤';pv.key=1;pv.x=pv.x.replace('下腌好的料，迅速划散','把腌好的料铺进空气炸锅或烤盘')+`${spray}，${['',150,190,230][+s.f||2]} 度烤 ${dur(d0)}`;return}if(pv&&pv.t==='烤'){pv.x+=`，翻面${addB?addB+'，':''}${spray?'再喷点油，':''}${['',150,190,230][+s.f||2]} 度再烤 ${dur(d0)}`;return}if(pv&&pv.t==='下锅'&&!addTxt){pv.t='烤';pv.key=1;pv.x=pv.x.replace('下腌好的料，迅速划散','把腌好的料铺进空气炸锅或烤盘')+`，${['',150,190,230][+s.f||2]} 度烤 ${dur(d0)}`;return}const deg=['',150,190,230][+s.f||2];if(pv&&pv.t==='烤'&&!addTxt){pv.x+=`，翻面再${deg} 度烤 ${dur(d0)}`;return}x=`${pre}铺进空气炸锅或烤盘，${deg} 度烤 ${dur(d0)}`;key=1}
      else if(s.m==='press'){t='压';x=`${pre}盖好高压锅，上汽后转小火压 ${dur(d0)}（电压力锅选牛羊肉档），自然泄压再开盖`;key=1}
      else if(s.u==='temp'){t='热油';x=`${addTxt||'把油'}${addTxt?'，':''}${f}烧到${oilCue(+s.v||160)}`;key=1}
      else if(s.u==='boil'){t='烧开';x=`${pre}大火烧开${d0>120?`（约 ${dur(d0)}）`:''}，撇去浮沫`}
      else if(s.u==='reduce'){t='收汁';x=`${pre}开盖大火收汁，边收边翻，汤汁浓稠挂勺即可`;key=1}
      else if(p.wet&&!(potAt[i]||[]).length&&!addTxt&&prev0()&&prev0().t==='倒碗汁'){prev0().x=`碗汁搅匀后倒进锅里，${f}不停搅拌熬 ${dur(d0)}，熬到微稠`;return}
      else if(p.wet){if(s.lid&&d0>=600){t='炖煮';x=`${pre}盖盖${f}炖 ${dur(d0)}`;key=1}else if(ids.includes('dian')){t='勾芡';x=`${pre}${f}翻匀至汤汁浓稠`}else{t=addTxt?'下料':'煮';x=`${pre}${f}煮 ${dur(d0)}`}}
      else if(onlyOil){t='热油';x=`${addTxt}，${f}烧到${oilCue(p.T||160)}`;key=1}
      else if(!(potAt[i]||[]).length&&adds.length&&!onlyOil&&(()=>{const nx=steps.slice(i+1).find(x=>x.t!=='add');return nx&&nx.t==='pour'&&nx.from==='pot'&&nx.what!=='foods'})()){t='熬酱';x=`${list(adds.map(nm))}放小锅里拌匀，${f}边搅边煮（约 ${dur(d0)}），快开锅就关火`}
      else if(ids.some(id=>SUGAR.includes(id))&&!p.food&&d0>=90){t='炒糖色';x=`${addTxt}，${f}慢炒至枣红色、冒细密小泡（约 ${dur(d0)}），别炒黑`;key=1}
      else if(ids.some(id=>CHILI.includes(id))&&!adds.some(a=>FD[a.id])&&!p.food){t='炝锅';x=`${addTxt}，${f}炸出香味、颜色变深即可（约 ${dur(d0)}），别炸黑`;key=1}
      else if(ids.some(id=>PASTE.includes(id))&&!adds.some(a=>FD[a.id])){t='炒酱';x=`${addTxt}，${f}慢炒${ids.includes('db')?'出红油':'出香味'}（约 ${dur(d0)}）`;key=1}
      else if(adds.length&&adds.every(a=>AROMA.includes(a.id)||CHILI.includes(a.id)||IT[a.id]&&IT[a.id].oil)){t='爆香';x=`${addTxt}，${f}爆香（约 ${dur(d0)}）`}
      else if(prev0()&&prev0().t==='倒碗汁'&&!addTxt){prev0().x=`碗汁搅匀后沿锅边倒入，${f}快速翻匀，汁裹满即可（约 ${dur(d0)}）`;return}
      else if(isFry(i,p)&&s.u!=='temp'){const prev=cook[cook.length-1];
        if(prev&&prev.t==='煎'&&!addTxt){prev.x=prev.x.replace(/（[^）]*）$/,'')+`，翻面再${f}煎 ${dur(d0)}，两面金黄`;return}
        if(prev&&prev.t==='下锅'&&!addTxt){prev.t='煎';prev.key=1;prev.x=prev.x.replace('，迅速划散',(bigPieces(i)?'，一片片平铺在锅里':'，摊平')+batch(i))+`，${f}${fryCue(i)}（共约 ${dur(d0)}）`;return}
        t='煎';key=1;x=`${pre}${batch(i)}${f}${fryCue(i,adds)}（共约 ${dur(d0)}）`}
      else if(p.oil>150&&p.food){t='炸';x=`${pre}${f}炸至金黄（约 ${dur(d0)}）`;key=1}
      else{const af=adds.filter(a=>FD[a.id]);const meat=af.some(a=>['肉','禽','水产'].includes(FD[a.id].cat));const bean=af.some(a=>FD[a.id].bean);
        t=af.length?(meat?'滑炒':'炒'):'翻炒';const cue=bean?'煸至表皮起皱、彻底熟透':meat?'炒至变色':af.length?'炒至断生':(p.food?'翻炒':'翻匀');x=`${pre}${f}${cue}（约 ${dur(d0)}）`;if(bean)key=1}
      if(s.lid&&!/盖盖/.test(x))x=x.replace(/(小火|中火|大火)/,'盖盖$1');
      const prev=cook[cook.length-1];
      if(p.wet&&!s.lid&&+s.f===3&&!addTxt&&prev&&prev.t==='炖煮'&&!s.u){cook.push({t:'收汁',x:`开盖大火收汁约 ${dur(d0)}，汤汁浓稠挂勺即可`,key:1});return}
      if(prev&&prev.t==='烧开'&&t==='炖煮'&&!addTxt){prev.x+=`，转${x}`;prev.t='炖煮';prev.key=1;return}
      if(t==='炸'&&!addTxt&&prev&&['下锅','回锅'].includes(prev.t)){prev.t=prev.t==='回锅'?'复炸':'炸';prev.key=1;prev.x=prev.x.replace('，迅速划散','，分散下锅')+`，${f}炸至${prev.t==='复炸'?'金黄酥脆':'定型、表面起小泡'}（约 ${dur(d0)}）`;return}
      if(!addTxt&&prev&&['下锅','回锅'].includes(prev.t)&&!p.wet&&!s.u&&s.m!=='steam'&&s.m!=='press'&&s.m!=='bake'){prev.x+=`，${f}翻炒${prev.t==='下锅'?'至变色':'均匀'}（约 ${dur(d0)}）`;return}
      if(adds.length&&adds.every(a=>IT[a.id]&&IT[a.id].alc)&&!p.wet){cook.push({t:'烹酒',x:`沿锅边淋入${list(adds.map(nm))}，${f}翻炒去腥（约 ${dur(d0)}）`});return}
      if(prev&&prev.t==='下料'&&/大火煮 (\d+ 秒|\d+ 分[钟半]?)$/.test(prev.x)&&t==='炖煮'&&!addTxt){prev.x=prev.x.replace(/大火煮 [^，]*$/,'大火烧开')+`，转${x}`;prev.t='炖煮';prev.key=1;return}
      if(prev&&prev.t==='炖煮'&&t==='炖煮'&&!addTxt&&prev.rm){prev.x+=`，再${x.replace('盖盖','')}`;return}
      if(prev&&prev.t===t&&!addTxt&&['滑炒','炒','翻炒','煮','炸'].includes(t)){const vb={'炸':'复炸','煮':'煮'}[t]||'炒';prev.x+=`，再${f}${vb} ${dur(d0)}`;return}
      cook.push({t,x,key});return}
    if(s.t==='remove'){const prev=cook[cook.length-1];const n=name(s.id);if(prev&&prev.t==='炖煮'){if(!prev.rm){prev.rm=[n];prev.x+=`，捞出${n}`}else{prev.rm.push(n);prev.x=prev.x.replace(/捞出[^，]*$/,`捞出${list(prev.rm)}`)}}else cook.push({t:'捞出',x:`捞出${n}`});return}
    const adds=buf;buf=[];const lastT=cook.length?cook[cook.length-1].t:'';const toA=adds.length&&adds.every(a=>a.c==='A')&&cook.some(x=>x.t==='捞出')&&!cook.some(x=>x.t==='拌料');if(toA&&s.t!=='rest'){cook.push({t:'拌料',x:`加${list(adds.map(a=>FD[a.id]?name(a.id):nm(a)))}抓匀`})}if(adds.length&&!toA){const pot=adds.filter(a=>!a.c||a.c==='pot');const other=adds.filter(a=>a.c&&a.c!=='pot');if(pot.length)cook.push({t:'下料',x:`下${list(pot.map(a=>FD[a.id]?name(a.id):nm(a)))}`});if(other.length)cook.push({t:'调味',x:`${list(other.map(a=>FD[a.id]?name(a.id):nm(a)))}放在菜上`})}
    if(s.t==='pour'){const from=s.from,to=s.to||'pot';
      if(from==='A'&&to==='pot')cook.push({t:'下锅',x:'下腌好的料，迅速划散'});
      else if(from==='B'&&to==='pot')cook.push({t:'倒碗汁',x:'碗汁搅匀后沿锅边倒入，快速翻匀',key:1});
      else if(from==='pot'&&to==='A'&&s.what==='foods')cook.push({t:'捞出',x:'捞出控干，放进大碗'});
      else if(from==='pot'&&s.what==='foods'){const more=steps.slice(i+1).some(x=>x.t==='heat');const big=(potState(i-1).oil||0)>150;cook.push(more?{t:'盛出',x:big?'捞出控油备用':'盛出备用，锅里留底油'}:{t:'出锅',x:big?'捞出控油，装盘':'盛出装盘'})}
      else if(from==='C'&&to==='pot')cook.push(cPrep&&i===pc&&cFoods.length?{t:'下锅',x:`下处理好的${list(cFoods)}`}:{t:'回锅',x:'倒回盛出的料'});
      else if(from==='pot'&&!sim.cs.pot.foods.length&&cook.length&&cook[cook.length-1].t==='热油'){const pr=cook.pop();cook.push({t:'泼油',x:pr.x.replace(/^锅烧热倒入/,'另起锅烧热')+'，趁热浇在菜上',key:1})}
      else if(from==='pot'&&['A','B'].includes(to))cook.push({t:'盛出',x:to==='B'?'盛出备用（刷酱用）':'盛出备用'});
      else cook.push({t:'装盘',x:'盛进盘里'})}
    else if(s.t==='drain'&&s.kind==='all'){const pb=potState(i-1);const hasF=(potAt[i]||[]).length;cook.push(!hasF&&(pb.oil||0)>100?{t:'倒油',x:'倒出炸油，把锅擦干'}:!hasF?{t:'倒掉',x:'倒掉锅里的汤水，把锅擦干'}:{t:'倒掉',x:'连汤带料倒掉，只留食材'})}
    else if(s.t==='drain')cook.push({t:s.kind==='water'?'倒汤':'控油',x:s.kind==='water'?(+s.keep?`倒掉多余汤汁，留约 ${s.keep}g`:'倒掉蒸出来的汤汁'):`倒出多余的油，锅里留约 ${s.keep}g`});
    else if(s.t==='rest'&&adds.length&&adds.every(a=>a.c==='A')&&cook.some(x=>x.t==='捞出')){cook.push({t:'拌料',x:`加${list(adds.map(a=>FD[a.id]?name(a.id):nm(a)))}抓匀，腌 ${dur(s.s)}`})}
    else if(s.t==='rest')cook.push({t:'静置',x:`${s.lid?'盖盖':''}静置 ${dur(s.s)}${['B','C'].includes(steps[i-1]&&steps[i-1].c)?'入味':''}`})});
  if(buf.length&&buf.every(a=>a.c&&a.c!=='pot')&&cook.length&&['装盘','出锅'].includes(cook[cook.length-1].t)){cook.push({t:'点缀',x:`撒上${list(buf.map(a=>FD[a.id]?name(a.id):nm(a)))}点缀`})}
  else if(buf.length){const v=buf.some(a=>['xyou','hjy','tjy','hyou','cyou'].includes(a.id));cook.push({t:'出锅',x:`${cook.length?'出锅前':''}${v?'淋入':'放入'}${list(buf.map(a=>FD[a.id]?name(a.id):nm(a)))}，翻匀出锅`})}
  else if(cook.length&&!['出锅','装盘','泼油','静置','点缀'].includes(cook[cook.length-1].t))cook[cook.length-1].x+='，出锅';
  for(const c of prep.concat(cook))if(!/[。！]$/.test(c.x))c.x+='。';
  return{ing,prep,cook,steps:prep.concat(cook).map(s=>`【${s.t}】${s.x}`),total:sim.t-prepRest,ahead:prepRest}}
function cardHTML(card){const li=L=>L.map(s=>`<li${s.key?' class="key"':''}><b>${s.t}</b>${s.key?'<span class="kb">关键</span>':''} ${esc(s.x)}</li>`).join('');
  return `<div class="ing">${card.ing.map(g=>`<p><b>${g.t}</b>　${g.rows.map(x=>`<span class="it">${esc(x.name)} ${x.g}g${x.m?`<span class="note">（${x.m}）</span>`:''}${/估/.test(x.note)?'<span class="note">·估</span>':''}</span>`).join('')}</p>`).join('')}</div>`+
   (card.prep.length?`<h3>备料</h3><ol class="csteps">${li(card.prep)}</ol>`:'')+`<h3>做法 <span class="note">约 ${dur(card.total)}${card.ahead>=3600?`（另需提前腌${card.ahead>=21600?'一夜':' '+dur(card.ahead)}）`:''}</span></h3><ol class="csteps">${li(card.cook)}</ol>`}
function cardText(name,card,extra){let t=`【${name}】\n`;if(extra)t+=extra+'\n';t+='\n用料\n';for(const g of card.ing){t+=`· ${g.t}：`+g.rows.map(r=>`${r.name} ${r.g}g${r.m?'（'+r.m+'）':''}`).join('，')+'\n'}
  if(card.prep.length)t+='\n备料\n'+card.prep.map((s,i)=>`${i+1}. ${s.t}：${s.x}`).join('\n')+'\n';
  t+=`\n做法（约 ${dur(card.total)}${card.ahead>=3600?`，另需提前腌${card.ahead>=21600?'一夜':' '+dur(card.ahead)}`:''}）\n`+card.cook.map((s,i)=>`${i+1}. ${s.key?'★':''}${s.t}：${s.x}`).join('\n');return t}
if(typeof module!=='undefined')module.exports={recipeCard,cardText};
