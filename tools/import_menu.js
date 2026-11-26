// 把村驴/隋坡菜单的文字配方转成模拟步骤（构建时运行）
const fs=require('fs');
const E=require('./engine.js');const {IT,FD}=E;Object.assign(global,E,{clamp:(x,a,b)=>x<a?a:x>b?b:x,DN:Object.fromEntries(E.DIMS.concat(E.NEG))});const I=require('./improve.js');
const D=JSON.parse(fs.readFileSync(process.argv[2]||'menu_dishes.json','utf8'));
// 别名表：顺序即优先级（具体的在前）
const A=[
['洋葱粉','ycf'],['大蒜粉','sfen'],['蒜粉','sfen'],['奥尔良','aol'],['新奥尔良','aol'],
// 调味液与酱
['九度米醋','mc'],['9度米醋','mc'],['米醋','mc'],['白醋','bc'],['老陈醋','cc'],['陈醋','cc'],['香醋','xc'],['醋','xc'],
['蒸鱼豉油','zyc'],['味极鲜','lxl'],['鲜味汁','lxl'],['辣鲜露','lxl'],['一品鲜','ls'],['海鲜酱油','ls'],['老抽','lc'],['生抽','ls'],['酱油','ls'],['豉油','zyc'],
['蚝油','hy'],['鱼露','yl'],['味精','wj'],['鸡精','jj'],['鸡粉','jj'],['牛肉粉','nrf'],
['郫县','db'],['豆瓣','db'],['火锅底料','hgdl'],['韩式辣酱','hslj'],['辣酱','hslj'],['柱侯','zhj'],['柱候','zhj'],['海鲜酱','hxj'],['叉烧酱','csj'],['甜面酱','tmj'],['黄酱','hdj'],['大酱','hdj'],['黄豆酱','hdj'],['大豆酱','hdj'],['豆豉','ds'],['腐乳汁','frz'],['腐乳','fr'],['芝麻酱','zmj'],['麻酱','zmj'],['花生酱','hsj'],['番茄沙司','fqj'],['番茄酱','fqj'],['番茄膏','fqj'],
['冰糖','bingt'],['红糖','ht'],['糖色','tangse'],['蜂蜜','fm'],['糖浆','bt'],['白砂糖','bt'],['白糖','bt'],['糖','bt'],
['椒盐','jy'],['盐','salt'],
['料酒','lj'],['黄酒','huj'],['花雕','huj'],['绍酒','huj'],['白酒','baij'],['白兰地','baij'],['啤酒','pij'],['醪糟','lz'],['米酒','lz'],['味淋','ml'],['清酒','qj'],['红酒','huj'],
['葱姜水','cjs'],['葱姜花椒水','cjs'],['花椒水','hjs'],['水淀粉',[['dian',.4],['qs',.6]]],['生粉水',[['dian',.4],['qs',.6]]],['淀粉','dian'],['生粉','dian'],['面粉','mf'],['可乐','kl'],
['海米','xp'],['虾皮','xp'],['虾米','xp'],['蛋清','jdq'],['蛋白','jdq'],
['高汤','gt'],['鸡汤','gt'],['骨头汤','gt'],['牛肉汤','gt'],['肉汤','gt'],['清汤','gt'],['原汤','gt'],
['开水','rs'],['热水','rs'],['白开水','rs'],['温水','qs'],['凉水','qs'],['冷水','qs'],['冰水','qs'],['清水','qs'],['矿泉水','qs'],['凉白开','qs'],
// 油
['花椒油','hjy'],['藤椒油','tjy'],['辣椒油','hyou'],['红油','hyou'],['葱油','cyou'],['料油','lyou'],['材料油','lyou'],['芝麻香油','xyou'],['香油','xyou'],['麻油','xyou'],['芝麻油','xyou'],['猪大油','zy'],['猪油','zy'],['大油','zy'],['黄油','hy2'],['牛油','ny'],['鸡油','jyou'],['菜籽油','cy'],['花生油','hsy'],['豆油','hsy'],['色拉油','hsy'],['橄榄油','hsy'],['明油','hsy'],['熟油','hsy'],['热油','hsy'],['炸油','hsy'],['食用油','hsy'],
// 辣麻
['小米辣','xmj'],['野山椒','pj'],['泡椒','pj'],['泡辣椒','pj'],['剁椒','dj'],['辣椒面','ljm'],['辣椒粉','ljm'],['辣椒碎','ljm'],['干辣椒','gla'],['辣椒段','gla'],['辣椒丝','gla'],['朝天椒','gla'],
['黑胡椒','hhj'],['白胡椒','bhj'],['胡椒','bhj'],
['花椒面','hjm'],['花椒粉','hjm'],['青花椒','qhj'],['青麻椒','qhj'],['麻椒','qhj'],['藤椒','qhj'],['花椒','hj'],
// 葱姜蒜
['葱姜蒜',[['cong',.4],['jiang',.3],['suan',.3]]],['葱、姜、蒜',[['cong',.4],['jiang',.3],['suan',.3]]],['葱姜',[['cong',.5],['jiang',.5]]],['葱、姜',[['cong',.5],['jiang',.5]]],['姜蒜',[['jiang',.5],['suan',.5]]],['姜、蒜',[['jiang',.5],['suan',.5]]],
['蒜苗','sm'],['青蒜','sm'],['蒜苔','qc'],['蒜薹','qc'],['大蒜','suan'],['蒜','suan'],['生姜','jiang'],['姜','jiang'],['洋葱','yc'],['圆葱','yc'],['葱头','yc'],['香葱','cong'],['小葱','cong'],['大葱','cong'],['葱','cong'],['香菜','xcai'],['芫荽','xcai'],
// 香料
['大料','bj'],['八角','bj'],['桂皮','gp'],['肉桂','gp'],['香叶','xy'],['草果','cg'],['丁香','dx'],['小茴香','xhx'],['茴香','xhx'],['陈皮','cp'],['白芷','sn'],['山奈','sn'],['沙姜','sn'],['白蔻','bk'],['豆蔻','bk'],['肉蔻','rdk'],['甘草','gcao'],['香料包','lbao'],['卤料','lbao'],['香料','lbao'],
['孜然','zr'],['五香粉','wxf'],['十三香','ssx'],['咖喱','gl'],['芝麻','zm'],['花生米','hs'],['花生','hs'],['枸杞','gzqi'],['红枣','gzqi'],['小苏打','xs'],['食用碱','xs'],['碱','xs'],['红曲','hqf'],['栀子','hqf'],['酸菜','scai'],
// 食材
['猪前蹄','zt'],['猪前肘','zt'],['猪瘦肉','lji'],['鸡脯肉','jx'],['鸡脯','jx'],['牛腿肉','NR'],['牛上脑','NR'],['笋丝','gbs'],['笋','gbs'],['红绿椒','gcj'],['烧烤料',[['zr',.4],['ljm',.35],['salt',.25]]],['麻辣鲜',[['hjm',.4],['ljm',.3],['wj',.3]]],
['五花','wh'],['肋排','pg'],['排骨','pg'],['脊骨','pg'],['棒骨','pg'],['猪蹄','zt'],['肘子','zt'],['猪肘','zt'],['猪皮','zt'],['肉皮','zt'],['猪肝','zg'],['腰花','zg'],['鸡胗','zg'],['肥肠','fc'],['猪肚','fc'],['大肠','fc'],['牛肚','fc'],
['牛肉馅','rm'],['肉馅','rm'],['肉末','rm'],['里脊','lji'],['通脊','lji'],['外脊','lji'],['梅花肉','lji'],['梅头','lji'],['肥瘦','wh'],['肥肉','wh'],['猪肉','lji'],
['牛腩','nn'],['牛腱','nn'],['牛肋','nn'],['牛筋','nn'],['牛排','nr'],['牛里脊','nr'],['肥牛','nr'],['牛肉','NR'],
['羊排','yr'],['羊蝎子','yr'],['羊肉','yr'],['羊腿','yr'],
['鸡翅','jc'],['鸡爪','jz'],['鸡架','jz'],['鸡胸','jx'],['鸡腿','jt'],['鸡块','jt'],['鸡肉','jt'],['三黄鸡','jt'],['公鸡','jt'],['整鸡','jt'],['鸭','ya'],['鹅','ya'],
['鸡蛋','jd'],['蛋液','jd'],['鸭蛋','jd'],['皮蛋','jd'],['蛋黄','jd'],
['鱿鱼','yy'],['墨鱼','yy'],['虾','xia'],['带鱼','yu'],['鲤鱼','yu'],['鲫鱼','yu'],['草鱼','yu'],['鲈鱼','yu'],['鱼','yu'],
['老豆腐','dfu'],['嫩豆腐','dfu'],['豆腐皮','gdf'],['干豆腐','gdf'],['豆皮','gdf'],['腐竹','gdf'],['豆腐','dfu'],
['茄子','qz'],['土豆','td'],['马铃薯','td'],['红薯','td'],['山药','td'],['小白菜','qcai'],['青菜','qcai'],['油菜','bcai'],['菠菜','bcai'],['茼蒿','bcai'],['生菜','bcai'],['空心菜','bcai'],['娃娃菜','baic'],['白菜','baic'],['包菜','baic'],['卷心菜','baic'],['甘蓝','baic'],
['青椒','qjz'],['尖椒','qjz'],['螺丝椒','qjz'],['线椒','qjz'],['美人椒','qjz'],['红椒','qjz'],['灯笼椒','qjz'],['彩椒','qjz'],['甜椒','qjz'],['杭椒','qjz'],['辣椒','qjz'],
['西红柿','fq'],['番茄','fq'],['金针菇','jzg'],['香菇','xg'],['蘑菇','xg'],['平菇','xg'],['鲜蘑','xg'],['口蘑','xg'],['杏鲍菇','xg'],['木耳','mr'],['胡萝卜','hlb'],['萝卜','lb'],['黄瓜','hg'],['西葫芦','hg'],['粉丝','ms'],['粉条','ms'],['豆角','dou'],['四季豆','dou'],['芸豆','dou'],['豆芽','dy'],['芹菜','qc'],['香芹','qc'],['韭菜','jc2'],['西兰花','xlh'],['菜花','xlh'],['冬瓜','dg'],['南瓜','dg'],['莲藕','ou'],['藕','ou'],['面条','mt'],['年糕','mt'],['米饭','mfan'],['火腿','huot'],['腊肉','huot'],['培根','huot'],['香肠','huot'],['午餐肉','huot'],
['鸡','gzj'],
['油','hsy'],['汤','gt'],['水','qs'],
];
// 新增的具体食材：名称和别名排在通用食材前面
{const extra=[];for(const d of Object.values(FD)){if(!d.base&&!['gclam','gbs'].includes(d.id))continue;const ws=d.name.replace(/[（(]([^）)]*)[）)]/g,'/$1').split(/[\/、]/).concat(d.al||[]).filter(w=>w&&w.length>=2);for(const w of ws)extra.push([w,d.id])}
 extra.sort((a,b)=>b[0].length-a[0].length);const at=A.findIndex(x=>x[0]==='五花');A.splice(at,0,...extra)}
const GRAN=new Set(['salt','bt','wj','jj','nrf','jy','bingt','ht']);const POW=new Set(['dian','mf','ljm','hjm','bhj','hhj','wxf','ssx','zr','gl','zm']);
const PIECE={suan:5,jiang:3,bj:2,xy:.3,gla:.4,gp:3,cg:4,dx:.1,hj:.05,jd:50,xmj:3,qjz:80,td:200,fq:180,yc:200,hlb:150,hg:200,qz:250,lb:500,bingt:6,fr:15,xcai:5,mr:2,xg:15,jdq:30,xc:15,cp:2,sn:2,bk:.5,rdk:3,gcao:1,hhj:.05,xhx:.05,jz:60,jc:50,zt:500,yu:600,xia:20,dfu:300,bcai:30,baic:800,qcai:40,mt:150,gdf:100,huot:100,jx:250,jt:200,yr:500,pg:500,nn:500,zg:200,fc:300,yy:200,dou:10,dy:200,qc:50,jc2:200,xlh:400,dg:500,ou:300,ms:50,mfan:200,hs:1,sm:20,gzqi:3,lbao:20};
function norm(n){return String(n).replace(/[（(][^）)]*[）)]/g,'').replace(/\s+/g,'').trim()}
function alts(n){return n.split(/或/)[0]}
function mapName(nm){for(const [k,v] of A){if(nm.includes(k)){let ids=Array.isArray(v)?v:[[v,1]];return{key:k,ids}}}return null}
function splitCompound(n){const x=alts(norm(n));if(mapName(x)&&/葱姜蒜|葱、姜|姜、蒜|葱、姜、蒜|姜蒜|葱姜/.test(x))return[x];return x.split(/[、，,和]/).map(s=>s.trim()).filter(Boolean)}
function spoon(id){if(GRAN.has(id))return 9;if(POW.has(id))return 5;return 10}
function toGram(q,u,id,nm){if(q==null)return null;if(Array.isArray(q))q=(q[0]+q[1])/2;q=+q;if(!isFinite(q))return null;
  const isF=!!FD[id];
  switch(u){case'g':case'克':case'ml':return q;case'kg':return q*1000;case'斤':return q*500;case'两':return q*50;case'磅':case'lb':return q*453.6;
    case'勺':return q*spoon(id);case'平勺':return q*spoon(id)*.8;case'大勺':return q*spoon(id)*1.3;case'小勺':case'茶勺':case'茶匙':case'小羹匙':return q*spoon(id)/3;case'平茶勺':return q*spoon(id)/3*.8;case'手勺':return q*60;
    case'碗':return q*250;case'杯':return q*240;case'碟':return q*80;case'瓶':return q*330;case'罐':return q*330;case'盒':return q*350;case'袋':return q*300;
    case'捏':return q*1;case'小捏':return q*.5;case'把':return q*(isF?150:10);case'小把':return q*(isF?80:5);
    case'根':case'小根':if(id==='cong')return q*(/大葱/.test(nm)?60:10);return q*(PIECE[id]||(isF?120:5))*(u==='小根'?.6:1);
    case'段':return q*(id==='cong'?15:id==='gla'?.2:(PIECE[id]||10)*.3);case'片':case'小片':case'薄片':case'大片':return q*(id==='jiang'?(u==='小片'?2:3):id==='xy'?.3:(PIECE[id]||5)*.3);
    case'块':case'小块':return q*(id==='jiang'?(u==='小块'?8:15):PIECE[id]||(isF?150:5));
    case'朵':case'小朵':return q*(/干/.test(nm)||(FD[id]&&/干/.test(FD[id].name))?3:isF?(PIECE[id]||20):1)*(u==='小朵'?.6:1);
    default:return q*(PIECE[id]||(isF?150:5))}}
// 中文时长
const CN={'一':1,'两':2,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'半':.5};
function durations(t){const out=[];let m;const re=/(\d+(?:\.\d+)?)(?:\s*[–~\-到至]\s*(\d+(?:\.\d+)?))?\s*(个半小时|个小时|小时|分半钟|分半|分钟|分|秒)/g;
  while(m=re.exec(t)){let a=+m[1],b=m[2]?+m[2]:a;let v=(a+b)/2;const u=m[3];let s=u.includes('小时')?v*3600+(u.includes('半')?1800:0):u.includes('分半')?v*60+30:u.startsWith('分')?v*60:v;out.push(s)}
  if(!out.length){if(/一个半小时/.test(t))out.push(5400);else if(/两个?小时/.test(t))out.push(7200);else if(/一个?小时/.test(t))out.push(3600);else if(/半个?小时/.test(t))out.push(1800);
    else if(/十几分钟/.test(t))out.push(900);else if(/几分钟/.test(t))out.push(180);else if(/一两分钟/.test(t))out.push(90);else if(/半分钟/.test(t))out.push(30);else if(/一分钟/.test(t))out.push(60);else if(/两分钟/.test(t))out.push(120);else if(/三分钟/.test(t))out.push(180);else if(/五分钟/.test(t))out.push(300);else if(/十分钟/.test(t))out.push(600);else if(/几十秒/.test(t))out.push(40);else if(/几秒/.test(t))out.push(5)}
  return out}
const GT={nn:['牛肉','牛腩','牛肋'],nr:['牛肉','牛排'],wh:['五花','肉'],lji:['肉','里脊'],pg:['排骨','骨'],rm:['肉末','肉馅','肉'],yr:['羊肉','羊'],jt:['鸡','鸡肉','鸡块'],jx:['鸡胸','鸡'],jc:['鸡翅','翅'],jz:['鸡架','鸡爪'],yu:['鱼'],xia:['虾'],dfu:['豆腐'],qz:['茄子'],td:['土豆'],jd:['鸡蛋','蛋'],zt:['猪蹄','肘'],
  cong:['葱'],jiang:['姜'],suan:['蒜'],hj:['花椒'],gla:['辣椒'],bj:['八角','大料'],xy:['香叶'],gp:['桂皮'],db:['豆瓣'],ls:['生抽','酱油'],lc:['老抽'],bt:['糖'],bingt:['冰糖','糖'],salt:['盐'],lj:['料酒'],huj:['黄酒','料酒'],dian:['淀粉','芡'],xc:['醋'],cc:['醋'],bc:['醋'],mc:['醋'],xyou:['香油'],hy:['蚝油'],wj:['味精'],jj:['鸡精'],qs:['水'],rs:['开水','热水','水'],gt:['汤'],xcai:['香菜'],ljm:['辣椒面'],hjm:['花椒面']};
// 二选一的做法（“油煎：… / 水煎：…”、“烤箱版 / 空气炸锅版”）只取第一种
function pickAlt(d){const L=d.steps||[];const lab=st=>{const m=/^\s*([^，,。：:]{1,8})[：:]/.exec(st);return m&&/煎|炸|烤|蒸|煮|焖|炖|炒|版|方法|做法|吃法|锅|微波/.test(m[1])?m[1]:null};
  const ctx=[d.tag||'',(d.tips||[]).join(''),L.join('')].join('|');const V=['煎','炸','烤','蒸','煮','焖','炖'];
  const alt=(a,b)=>V.some(v=>a.includes(v)&&b.includes(v))||/版|方法|做法|吃法/.test(a+b)||ctx.includes(a+'或'+b)||ctx.includes(b+'或'+a)||ctx.includes(a+'/'+b);
  let first=null;const out=[];const drop=[];for(const st of L){const l=lab(st);if(l){if(!first)first=l;else if(l!==first&&alt(first,l)){drop.push(l);continue}}
    if(out.length&&/^\s*(配|附|搭配|顺便)(一|上)?[碗份个盘]|^\s*另(做|配|煮)/.test(st)){drop.push('附');continue}out.push(st)}out.drop=drop;return out}
// 腌制时长：“一夜/过夜”优先，忽略“翻拌 1 分钟”这类搅拌时间
function marTime(st){const cold=/冷藏|冰箱/.test(st);if(/一夜|过夜|隔夜|一晚|一宿/.test(st))return{s:28800,cold:1};
  const cl=st.split(/[，,；;。]/).filter(c=>/腌|冷藏|静置|入味|放置|醒/.test(c)&&!/(拌|抓|揉|搅|翻)\s*\d/.test(c));let dd=[];for(const c of cl)dd=dd.concat(durations(c));
  if(!dd.length)dd=durations(st).filter(x=>x>=300);return{s:Math.min(43200,Math.round(dd.length?Math.max(...dd):(cold?7200:600))),cold}}
const CUTRE=[[/厚片|片成\s*\d\s*[–\-~到至]?\s*\d?\s*片|每块片|片\s*\d\s*[–\-~]\s*\d\s*片|切大片|排$/,'厚片'],[/切.{0,3}丝|丝$|丝\)/,'丝'],[/切.{0,3}片|片$|薄片|切片|片开/,'片'],[/切.{0,3}丁|丁$/,'丁'],[/切.{0,3}条|条$/,'条'],
  [/切.{0,3}段|段$/,'段'],[/剁.{0,2}(碎|末|泥)|切.{0,2}末|末$|肉馅|馅/,'末'],[/大块|切.{0,2}大块/,'大块'],[/切.{0,3}块|剁.{0,3}块|斩.{0,2}(块|件)|块$/,'块'],[/整只|整条|不切|整颗|整个|整根/,'整']];
function cutOf(it,d){const ok=c=>c&&(CUTS[c]||c==='厚片');const meat=['肉','禽','水产'].includes(FD[it.id].cat);
  if(FD[it.id].egg||FD[FD[it.id].base||'']&&FD[FD[it.id].base].egg)return FD[it.id].cut;
  const note0=it.note;it={...it,note:note0.replace(/(炒|煮|蒸|炸|煎|卤|烤)(熟|好|老|透|完)?(后|再|了)?.{0,3}(切|改刀).*/,'')};
  {const m=/(\d+(?:\.\d+)?)\s*(厘米|cm|公分|毫米|mm)\s*厚/.exec(it.note);if(m&&/片|排|整|块|厚/.test(it.note)){let v=+m[1];if(/毫米|mm/.test(m[2]))v/=10;return v<=.4?'片':v<=1.5?(meat?'厚片':'片'):v<=2.5?'块':'大块'}}
  const fix=c=>c==='厚片'&&!meat?'片':c;
  const tryT=t=>{for(const [re,c] of CUTRE)if(re.test(t))return fix(c);return null};
  if(it.note){const c=tryT(it.note.replace(/可用.*/,''));if(ok(c))return c}
  const toks=[it.nm,it.key].concat(GT[it.id]||[]).filter(t=>t&&t.length>=1);
  for(const st of d.steps||[])for(const cl of st.split(/[，,；;。]/)){if(!/切|片|剁|斩|撕|掰/.test(cl))continue;const p=toks.map(t=>cl.indexOf(t)).filter(x=>x>=0);if(!p.length)continue;
    const c=tryT(cl.slice(Math.min(...p)));if(ok(c))return c}
  const nm=d.name||'';for(const t of toks){const i=nm.indexOf(t.replace(/肉$/,''));if(i<0)continue;const after=nm.slice(i+t.replace(/肉$/,'').length,i+t.length+2);
    const m=/^肉?(丝|片|丁|块|条|段|末|排)/.exec(after);if(m)return fix(m[1]==='排'?'厚片':m[1])}
  if(meat&&/(鸡|猪|牛|羊)排/.test(nm)&&!/排骨|肋排|小排|羊排/.test(nm))return'厚片';
  return FD[it.id].cut}
function isBakery(d){const t=JSON.stringify(d.groups)+d.steps.join('');return /酵母|泡打粉|烤箱|面团|擀|发酵|饺子皮|包子|馅饼|烙饼|蛋糕|吐司|面包|披萨|淡奶油|奶油奶酪/.test(t)}

function convert(d){
  // 主料重量
  let base=d.unit==='g'?d.base:null;
  const items=[];let mappedW=0,totW=0;const unm=[];
  for(const [gname,list] of d.groups||[]){const role=/腌|码味|上浆|挂浆/.test(gname)?'mar':(/碗汁|料汁|汁|芡|调料汁|酱汁/.test(gname)&&!/汤汁/.test(gname))||(/^.{0,3}(酱|酱料|调料|味汁)$/.test(gname)&&!list.some(x=>{const m=mapName(norm(x[0]));return m&&FD[m.ids[0][0]]}))?'sauce':/糊/.test(gname)?'batter':/出锅|最后|装盘|蘸|拌料|浇汁/.test(gname)?'fin':'main';
    for(const it of list){const parts=splitCompound(it[0]);const nparts=parts.length;
      for(const p of parts){const mp=mapName(p);const isWater=/^(清?水|开水|热水|凉水|温水|冷水)$/.test(p);const w=mp&&FD[mp.ids[0][0]==='NR'?'nr':mp.ids[0][0]]?2:1;totW+=w;
        if(!mp){unm.push(p);continue}mappedW+=w;
        for(let [id,frac] of mp.ids){if(id==='NR')id=/炖|焖|卤|烧|煲|酱/.test(d.name+d.steps.join(''))?'nn':'nr';
          let g=toGram(it[1]!=null?it[1]/nparts:null,it[2],id,p);const est=g==null;
          const little=/少许|少量|一点|适量点缀|几片|几根/.test(it[3]||'')&&g==null;
          items.push({nm:p,key:mp.key,id,g:g!=null?g*frac:(little?(FD[id]?30:1):null),est,role,food:!!FD[id],added:false,isWater,side:/配菜|配料|点缀/.test(gname),note:String(it[3]||''),gname})}}}}
  // 主料重量估计
  const foodsKnown=items.filter(i=>i.food&&i.g!=null);const foodsAll=items.filter(i=>i.food);
  const mainNm=norm(d.main||'');const mm=mapName(mainNm);const mainId=mm?(mm.ids[0][0]==='NR'?null:mm.ids[0][0]):null;
  const isMain=i=>(mainNm&&(i.nm.includes(mainNm)||mainNm.includes(i.nm)))||(mainId&&i.id===mainId)||foodsAll.length===1;
  if(!base){const mk=foodsKnown.find(isMain);base=mk?mk.g:(foodsKnown.length?Math.max(400,foodsKnown.reduce((a,i)=>a+i.g,0)):450);if(d.unit==='只')base=1000}
  for(const i of items)if(i.g==null){
    if(i.food){i.g=isMain(i)?base:i.side?Math.min(120,base*.25):Math.min(250,base*.5)}
    else if(IT[i.id].oil&&/炸用|炸油|宽油|^炸$|炸制/.test(i.note+'|'+i.gname))i.g=Math.max(500,base*1.2);
    else if(IT[i.id].oil&&(/薄|喷|刷一层|少许|抹/.test(i.note)||/煎/.test(i.gname)))i.g=Math.round(Math.max(6,Math.min(20,base*.012)));
    else if(IT[i.id].oil&&/煎/.test(d.name+i.gname)&&!/炸/.test(d.steps.join('')))i.g=Math.round(Math.max(10,Math.min(40,base*.03)));
    else{const def=IT[i.id].def;const sc=Math.pow(Math.max(150,base)/400,.8);i.g=IT[i.id].water?Math.max(200,base*.8):Math.round(def*sc*10)/10}}
  for(const i of items)i.g=Math.round(Math.min(i.food?3000:(IT[i.id]&&IT[i.id].water?4000:400),i.g)*10)/10;
  const cov=totW?mappedW/totW:0;
  // 切法：先看用料备注，再看步骤里提到这样食材的句子，最后看菜名（青椒肉丝 → 丝）
  const ST=pickAlt(d);{const dipG=new Set(items.filter(i=>/化开成|化成|调成盐水/.test(i.note)).map(i=>i.gname));for(let k=items.length-1;k>=0;k--){const it=items[k];if(!it.food&&(/化开成|化成|调成盐水|蘸|刷在|刷到/.test(it.note)||/蘸/.test(it.gname)||(it.isWater&&it.est&&dipG.has(it.gname))))items.splice(k,1)}}
  {const dip=items.findIndex(i=>i.food===false&&i.isWater&&i.est);if(dip>=0&&!items.some((i,k)=>k!==dip&&i.isWater)&&/蘸.{0,3}盐水|盐水.{0,3}蘸/.test(ST.join('')))items.splice(dip,1)}if(ST.drop.length){const dg=g=>ST.drop.some(l=>g.includes(l)||l.includes(g))||ST.drop.includes('附')&&/汤|附|配/.test(g)&&!/汤/.test(d.name.replace(/[（(].*$/,''));for(let k=items.length-1;k>=0;k--)if(items[k].gname!=='主料'&&dg(items[k].gname))items.splice(k,1)}
  for(const it of items)if(it.food)it.cut=cutOf(it,d);
  // 步骤
  const S=[];const add=(it,c,prep)=>{if(it.added)return;it.added=true;const s={t:'add',c,id:it.id,g:+(+it.g).toFixed(1)};if(it.est)s.est=1;if(it.food){s.cut=it.cut||FD[it.id].cut;if(prep||it.prep)s.prep=prep||it.prep}S.push(s)};
  let oil=false,fire=3,lid=0,potEmptied=false,curHow=null;const where={};let anyHeat=false;let Bused=false,Aused=false,Cfoods=false,sauceStep=false,Apoured=false;
  const tok=it=>[it.nm,it.key,it.nm&&it.nm.length>2?it.nm.replace(/^(干|鲜|新鲜|嫩|老)/,''):''].concat(GT[it.id]||[]);
  const RO={mar:['mar','main','batter'],sauce:['sauce','main','fin'],cook:['main','fin','batter','mar','sauce']};
  const mention=(text,ctx)=>{ctx=ctx||'cook';const byId=new Map();
    for(const it of items){if(it.added)continue;if(ctx==='cook'&&((it.role==='sauce'&&sauceStep)||(it.role==='mar'&&Aused)))continue;if(ctx==='mar'&&it.role==='sauce')continue;
      let pos=-1;for(const t of tok(it)){if(!t)continue;let p=text.indexOf(t);while(p>=0&&it.food&&/^骨|^架/.test(text.slice(p+t.length))&&!/骨|架|排/.test(FD[it.id].name))p=text.indexOf(t,p+1);if(p>=0&&(pos<0||p<pos))pos=p}if(pos<0)continue;
      const pr=RO[ctx].indexOf(it.role);const cur=byId.get(it.id);if(!cur||pr<cur[2])byId.set(it.id,[pos,it,pr])}
    return [...byId.values()].sort((a,b)=>a[0]-b[0]).map(x=>x[1])};
  const ensureOil=(text,big)=>{if(oil)return;const oi=items.find(i=>!i.added&&IT[i.id]&&IT[i.id].oil&&!['xyou','hjy','tjy','hyou','cyou','lyou'].includes(i.id));
    if(oi){if(big&&oi.g<300)oi.g=500;add(oi,'pot')}else S.push({t:'add',c:'pot',id:'hsy',g:big?500:30});oil=true};
  const heat=(sec,f,extra)=>{if(extra&&extra.m==='steam'&&Aused&&!Apoured){S.push({t:'pour',from:'A',to:'pot',what:'all'});Apoured=true}const s=Object.assign({t:'heat',f:f||fire,s:Math.round(sec)},extra||{});if(curHow&&!s.u&&s.m!=='steam')s.how=curHow;if(lid)s.lid=1;S.push(s);anyHeat=true};
  // 腌料组：开头放 A 碗
  const marG=items.filter(i=>i.role==='mar');
  const sgn=(d.groups||[]).filter(g=>items.some(i=>i.gname===g[0]&&i.role==='sauce')).map(g=>g[0]);
  for(const st0 of ST){const st=st0.replace(/(留着?|留作|用来|用于|待会儿?|后面|以后)[^，,。；;]{0,10}/g,'').replace(/^\s*分.{0,3}(锅|次|批|份)[^：:，,]{0,4}[：:，,]/,'');
    const clauses=st.split(/[，,；;。！]/).filter(c=>c.trim());
    const cooking=/炒|煸|爆|炸|煎|烧|炖|焖|煮|卤|蒸|收汁|收到|收浓|收干|熬|烹|下锅|入锅|开火|翻匀|翻面|金黄|变色|焯|汆|煲|淋油|浇油|泼/.test(st);
    const isMar=/腌(?!料|制品|菜|肉|鱼|笃)|码味|上浆|抓匀|拌匀|抓到|抓一|抓至|封一层油/.test(st)&&!/锅|炒|煮/.test(st)&&!(sgn.some(g=>st.includes(g))&&!/腌|码味|上浆/.test(st));
    const isBlanch=/焯|冷水下锅|汆烫|飞水/.test(st)&&!/(炒|煸|爆)/.test(st);
    const isSauce=((/碗汁|料汁|调汁|调成汁|调匀|兑|调好|调.{0,6}汁/.test(st))||(sgn.some(g=>st.includes(g))&&/拌匀|搅匀|调匀|混合|全部/.test(st)&&!cooking))&&!/锅|炒|煮/.test(st);
    if(!cooking&&!isMar&&!isSauce){continue}
    if(isBlanch){const pb=/煮到|煮熟|煮至|扎透|断生后|煮\s*\d+\s*分钟/.test(st);for(const it of mention(st))if(it.food)it.prep=pb&&!FD[it.id].leaf?'preboil':'blanch';continue}
    if(isMar){const ms=mention(st,'mar');const mg=items.filter(i=>!i.added&&i.role==='mar'&&(i.food||(marG.some(x=>x.food)&&!i.isWater)||i.isWater&&marG.some(x=>x.food)));let L=[...new Set([...mg,...ms])];if(L.length&&!L.some(i=>i.food)&&!Aused&&/腌|码味|上浆|挂糊|糊浆|挂匀/.test(st)){let mainF=items.filter(i=>i.food&&!i.added&&i.role==='main'&&isMain(i));if(!mainF.length){const f0=items.find(i=>i.food&&!i.added&&i.role==='main'&&['肉','禽','水产'].includes(FD[i.id].cat));if(f0)mainF=[f0]}if(mainF.length)L=mainF.slice(0,1).concat(L)}if(!L.length){if(Aused&&!Apoured&&/腌(?!料)|冷藏|静置|入味/.test(st)){const mr=marTime(st);const lr=[...S].reverse().find(x=>x.t==='rest');if(lr&&mr.s>lr.s){lr.s=mr.s;if(mr.cold)lr.cold=1}}continue}
      for(const it of L){add(it,'A');where[it.id]='A'}Aused=true;
      const mr=marTime(st);S.push(Object.assign({t:'rest',s:mr.s},mr.cold?{cold:1}:{}));continue}
    if(isSauce){const grp=items.filter(i=>i.role==='sauce'&&!i.added);const ms=mention(st,'sauce').filter(i=>!i.food);const L=grp.length?grp:ms;for(const it of L){add(it,'B')}if(L.length){Bused=true;sauceStep=true}continue}
    for(const c of clauses){curHow=/煎(?!好|过的|饼)/.test(c)&&!/炸/.test(c)?'煎':'o';
      if(/大火|旺火|猛火|中大火/.test(c))fire=3;else if(/中小火|中火/.test(c))fire=2;else if(/小火|最小火|微火|文火|转小/.test(c))fire=1;
      if(/开盖|揭盖|打开盖/.test(c))lid=0;
      if(/关火/.test(c)&&!/(浸|泡|焖)/.test(c)&&!durations(c).length)S.push({t:'rest',s:20});
      if(/捞出|挑出|捞掉|夹出/.test(c)){const added=items.filter(i=>i.added&&!i.food&&IT[i.id]&&(IT[i.id].whole||['hj','gla','cong','jiang','suan','qhj'].includes(i.id)));const hit=added.filter(i=>tok(i).some(t=>t&&c.includes(t)));for(const i of hit)S.push({t:'remove',c:'pot',id:i.id})}
      const steam=/蒸/.test(c)&&!/蒸发|蒸汽/.test(c);
      // 油
      const bigOil=/炸(到|至|成|制|透|定型|金黄|酥|好|熟|一下|\s*\d)|复炸|宽油|过油|油炸|下锅炸|入锅炸/.test(st)&&!/炸香|炸出香/.test(st);
      if(/宽油|炸/.test(c)&&!oil)ensureOil(c,true);
      else if(bigOil&&!oil&&/油/.test(c))ensureOil(c,true);
      else if(potEmptied&&oil&&/(锅中|锅里|另起锅|重新)?(放|倒|加|下)(点|些|少许|一勺)?(豆|花生|色拉|食用)?油/.test(c)&&!/底油|余油|留.{0,2}油/.test(c)){const ex=items.find(i=>!i.added&&IT[i.id]&&IT[i.id].oil&&!['xyou','hjy','tjy','hyou','cyou','lyou'].includes(i.id));if(ex)add(ex,'pot');else S.push({t:'add',c:'pot',id:'hsy',g:20,est:1});potEmptied=false}
      else if(/(放|倒|下|加|起|烧|热|凉|冷)油|油热|热锅|烧热|食用油|猪油|油温|锅里放油|锅中放油|冷油|凉油|油铺|底油|油烧/.test(c)||(/油/.test(c)&&/烧|热|冒烟/.test(c)))ensureOil(c,false);
      const m3x=c.match(/([三四五六七八九])([三四五六七八九])?成(半)?(热|时|左右|油温)/);let tempDone=false;
      if(m3x&&oil&&!(S.length&&S[S.length-1].t==='heat'&&S[S.length-1].u==='temp')){const v=m3x[2]?(CN[m3x[1]]+CN[m3x[2]])/2:CN[m3x[1]];heat(240,3,{u:'temp',v:v*30+(m3x[3]?15:0)});tempDone=true}
      // 碗汁、回锅
      if((/汁.{0,8}(淋入|倒入|下入|烹入)/.test(c)&&!/汤汁|收汁/.test(c))||/(倒|淋|烹|下|加|入|搅匀).{0,4}(碗汁|料汁|糖醋汁|酱汁|调好的汁|芡汁|兑好的|宫保汁|鱼香汁|.{0,3}汁)/.test(c)&&!/汤汁|收汁/.test(c)){const rest=items.filter(i=>i.role==='sauce'&&!i.added);if(Bused)S.push({t:'pour',from:'B',to:'pot',what:'all'});for(const it of rest)add(it,'pot');Bused=false}
      if(Cfoods&&items.some(i=>i.added&&i.food&&i.inC&&tok(i).some(t=>t&&t.length>=1&&c.includes(t)))&&/下|放|倒|回/.test(c)){S.push({t:'pour',from:'C',to:'pot',what:'all'});Cfoods=false;items.forEach(i=>i.inC=false)}
      if(Cfoods&&(/回锅|倒回|回鸡蛋|放回|再下|下入炸好|下肉|倒入炸好|炸好的|铺在|码上|放上|煎好的|盛出的|全部下锅|复炸|重新下锅|再下锅/.test(c)||/(倒入|放入|下入|加入|放|下|倒)(炸好的|滑好的|煎好的|滑过的)?(肉|鸡|鱼|虾|牛|羊|排骨)/.test(c))){S.push({t:'pour',from:'C',to:'pot',what:'all'});Cfoods=false}
      // A 碗里的食材被提到，或者“下锅”且 A 里有食材 → 整碗倒入
      if(Aused&&!Apoured){const Af=items.filter(i=>i.added&&where[i.id]==='A'&&i.food);const hit=Af.some(i=>tok(i).some(t=>t&&t.length>=1&&c.includes(t)))||(/(下|放入|入锅|倒入)/.test(c)&&!/油/.test(c)&&/(炒|煎|炸|煸|滑|锅|划散|大排|肉|鸡|鱼|虾)/.test(c)&&!mention(c).some(i=>i.food));
        if(hit&&Af.length){if(!oil)ensureOil(c,false);S.push({t:'pour',from:'A',to:'pot',what:'all'});Apoured=true}}
      const ms=mention(c);
      for(const it of ms){if(it.role==='mar'&&!it.food&&!Aused)continue;
        if(where[it.id]==='A'){}
        if(it.food&&marG.length&&!it.added&&!Aused&&/腌/.test(JSON.stringify(d.groups))){}
        if(!oil&&!it.food&&IT[it.id]&&!IT[it.id].water&&!IT[it.id].oil&&/炒|煸|爆|炸/.test(c))ensureOil(c,false);
        add(it,'pot')}
      if(/盖盖|加盖|盖上|盖严|盖好/.test(c))lid=1;
      // 加热
      const dd=durations(c);const m3=tempDone?null:c.match(/([三四五六七八九])成(半)?热/);
      if(m3&&oil){heat(240,3,{u:'temp',v:CN[m3[1]]*30+(m3[2]?15:0)});}
      else if(/冒(青|浓|白|大)?烟/.test(c)&&oil&&!dd.length&&!tempDone)heat(240,3,{u:'temp',v:200});
      else if(/(油热|烧热|热锅|油温|烧到|烧至).{0,4}/.test(c)&&oil&&!dd.length&&!/(收|煮|炖)/.test(c)&&S.length&&S[S.length-1].t==='add'&&IT[S[S.length-1].id]&&IT[S[S.length-1].id].oil)heat(180,3,{u:'temp',v:165});
      else if(dd.length){const sec=dd.reduce((a,b)=>a+b,0);
        if(/关火|浸泡|泡着|焖着/.test(c)&&!/(炖|煮|烧)/.test(c))S.push({t:'rest',s:Math.min(3600,Math.round(sec)),lid:lid||undefined});
        else if(steam)heat(sec,3,{m:'steam'});else if(/腌|冷藏|静置|醒/.test(c))S.push(Object.assign({t:'rest',s:Math.min(43200,Math.round(sec))},/冷藏/.test(c)?{cold:1}:{}));else heat(sec)}
      else if(/烧开|煮开|水开|开锅|烧沸|煮沸|大火烧开/.test(c))heat(900,3,{u:'boil'});
      else if(/收汁|收干|收浓|收到/.test(c)){lid=0;heat(900,3,{u:"reduce"})}
      else if(steam)heat(600,3,{m:'steam'});
      else if(/焖干|焖至收干|焖到水干/.test(c))heat(120,fire,{lid:1});
      else if(/炖|焖|煨|卤/.test(c))heat(/焖/.test(c)?900:1800,fire===3?1:fire,{lid:1});
      else if(/煮/.test(c))heat(300,2);else if(/熬/.test(c))heat(300,1);
      else if(/炸/.test(c))heat(150,2);else if(/煎/.test(c))heat(120,2);else if(/煸/.test(c))heat(/香/.test(c)?40:120,2);
      else if(/炒香|爆香|炸香|煸香|出香|炒出红油/.test(c))heat(/红油/.test(c)?60:25,/红油/.test(c)?1:2);
      else if(/翻匀|炒匀|拌匀|炒散|颠匀|翻炒均匀/.test(c))heat(30,3);
      else if(/划散|滑散|爆散|炒散|划开|划成|滑熟|滑至|滑油|变白|断生|爆一下|爆至/.test(c)&&oil)heat(45,fire);
      else if(/爆熟|爆炒|煸熟|炒熟/.test(c)&&oil)heat(60,3);
      else if(/金黄|变色|定型|翻面|上色/.test(c)&&oil)heat(90,2);
      else if(/炒/.test(c))heat(60,3);else if(/红烧|小火烧|烧入味|焖烧/.test(c))heat(600,1,{lid:1});
      if(/盛出|捞出|盛起/.test(c)&&S.length&&S[S.length-1].t==='pour'&&S[S.length-1].from==='A')heat(45,fire);
      if(/倒出.*油|留底油|控油|沥油/.test(c)&&oil&&!/捞出控油|捞出沥油/.test(c))S.push({t:'drain',c:'pot',kind:'oil',keep:20});
      if(/盛出|捞出|出锅备用|盛起/.test(c)&&st0!==ST[ST.length-1]&&(S.some(s=>s.t==='add'&&s.c==='pot'&&FD[s.id])||Apoured)&&!/捞出.{0,4}(葱|姜|蒜|花椒|辣椒|料渣|香料|大料|八角)|捞净/.test(c)){S.push({t:'pour',from:'pot',to:'C',what:'foods'});Cfoods=true;potEmptied=true;items.forEach(i=>{if(i.added&&i.food)i.inC=true})}
    }
  }
  // 没被提到的料：腌料进 A，碗汁进 B，其余放进第一次下食材之后
  const rest=items.filter(i=>!i.added&&!i.isWater);
  const mkS=it=>{it.added=true;const s={t:'add',c:'pot',id:it.id,g:+(+it.g).toFixed(1)};if(it.est)s.est=1;if(it.food){s.cut=it.cut||FD[it.id].cut;if(it.prep)s.prep=it.prep}return s};
  const potIdx=f=>S.findIndex(f);
  // 食材：放在第一次下食材后；没有则放在第一段加热前（油之后）
  for(const it of rest.filter(i=>i.food)){let i=potIdx(s=>s.t==='add'&&s.c==='pot'&&FD[s.id]);if(i<0){i=potIdx(s=>s.t==='heat'&&(s.s>=60||s.u));if(i<0)i=S.length;S.splice(i,0,mkS(it))}else S.splice(i+1,0,mkS(it))}
  // 整粒香料：随第一次加水；其他调料：最后一段加热前
  for(const it of rest.filter(i=>!i.food)){const d=IT[it.id];
    if(d.whole){let i=potIdx(s=>s.t==='add'&&s.c==='pot'&&IT[s.id]&&IT[s.id].water);if(i<0)i=potIdx(s=>s.t==='add'&&s.c==='pot'&&FD[s.id]);S.splice(i<0?S.length:i+1,0,mkS(it))}
    else if(d.oil&&!['xyou','hjy','tjy','hyou','cyou','lyou'].includes(it.id)){let i=potIdx(s=>s.t==='add');S.splice(Math.max(0,i),0,mkS(it))}
    else{let li=-1;for(let k=S.length-1;k>=0;k--)if(S[k].t==='heat'){li=k;break}if(['xyou','xcai','hjm','zm'].includes(it.id))li=-1;S.splice(li<0?S.length:li,0,mkS(it))}}
  if(Bused)S.push({t:'pour',from:'B',to:'pot',what:'all'},{t:'heat',f:3,s:30});
  if(Aused&&!Apoured)S.push({t:'pour',from:'A',to:'pot',what:'all'},{t:'heat',f:3,s:90});
  let fin='pot';if(Cfoods){const lastHeat=S.map(x=>x.t).lastIndexOf('heat');const lastToC=S.findLastIndex(x=>x.t==='pour'&&x.to==='C');if(lastToC>lastHeat)fin='C';else S.push({t:'pour',from:'C',to:'pot',what:'all'})}
  const eat=/卤|酱牛|酱肘|白切|盐水|浸/.test(d.name)?'drain':'all';
  const bakery=isBakery(d);const cold=/拌|凉|腌/.test(d.name);
  const ok=cov>=.6&&!bakery&&(anyHeat||cold)&&S.some(s=>s.t==='add'&&FD[s.id]);
  return{steps:S,fin,eat,cov:Math.round(cov*100),unm,ok,bakery}}

const out=[];let nOk=0;const t0=Date.now();const errs=[];const times=[];
for(const d of D){let r;try{r=convert(d)}catch(e){errs.push([d.name,String(e)]);continue}
  if(r.ok){const t1=Date.now();try{let fx=I.fixCooking(r.steps,r.fin,r.eat,40);r.steps=fx.steps;r.fixlog=fx.log;
    // 估计用量的咸味料按咸度校准
    for(let k=0;k<4;k++){const ev0=E.evaluate(E.simulate(r.steps),r.fin,r.eat);const sd=ev0.D.salt;if(sd>=3.5&&sd<=6.8)break;
      const est=r.steps.filter(s=>s.t==='add'&&s.est&&IT[s.id]&&(IT[s.id].tas.salt||0)>=.05);if(!est.length)break;const f=Math.max(.3,Math.min(2.5,Math.pow(5.4/Math.max(.5,sd),1.6)));for(const s of est)s.g=Math.round(s.g*f*10)/10;r.salted=1}
    if(r.salted){fx=I.fixCooking(r.steps,r.fin,r.eat,10);r.steps=fx.steps;r.fixlog.push(...fx.log)}
    const sim=E.simulate(r.steps);const ev=E.evaluate(sim,r.fin,r.eat);if(!isFinite(ev.D.salt))throw 'nan';r.t=sim.t;r.salt=ev.D.salt}catch(e){errs.push([d.name,'sim '+e]);r.ok=false}times.push(Date.now()-t1)}
  if(r.ok){const ev=E.evaluate(E.simulate(r.steps),r.fin,r.eat);const W=E.warnings(E.simulate(r.steps),ev);const sv=W.filter(w=>w[0]>=2).length,mid=W.filter(w=>w[0]===1).length;r.feas=sv?'低':mid>2?'中':'高';nOk++}
  out.push({id:d.id,name:d.name,chef:d.chef||'村驴',main:d.main,base:d.base,unit:d.unit,tag:d.tag,groups:d.groups,steps:d.steps,tips:d.tips,src:d.src,sim:r.ok?{steps:r.steps,fin:r.fin,eat:r.eat,fix:(r.fixlog||[]).length,feas:r.feas}:null,cov:r.cov,unm:r.unm,why:r.ok?'':(r.bakery?'面点/烘焙/西点':r.cov<60?'用料识别率低':'步骤无法转换')})}
const fz={};for(const o of out)if(o.sim)fz[o.sim.feas]=(fz[o.sim.feas]||0)+1;console.error('feas',fz);console.error('ok',nOk,'/',D.length,'errors',errs.length,errs.slice(0,5),'simtime max',Math.max(...times),'avg',(times.reduce((a,b)=>a+b,0)/times.length).toFixed(1));
fs.writeFileSync(process.argv[3]||'recipes.json',JSON.stringify(out));
module.exports={convert};
