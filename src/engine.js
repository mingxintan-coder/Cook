// ===== 数据与模拟引擎 =====
const DIMS=[['salt','咸'],['sweet','甜'],['sour','酸'],['umami','鲜'],['spicy','辣'],['numb','麻'],['pungent','辛冲'],['wok','爆香'],['roast','焦香'],['ferment','酱香'],['spice','香料'],['fresh','清香'],['bitter','苦'],['rich','醇厚']];
const NEG=[['off','腥膻'],['burnt','糊味'],['booze','酒气']];
const ALLD=DIMS.concat(NEG).map(d=>d[0]);

// 调料：tas 稳定呈味(每克)，raw 生鲜气味(受热消散)，aroO 油中煸出的香，aroW 水中煮出的味
const IT={};
function S(id,name,cat,o){IT[id]=Object.assign({id,name,cat,kind:'s',wat:0,tas:{},raw:{},rawK:.006,rawT:60,aroO:{},aroW:null,rOil:0,win:[110,160],rWater:0,rCold:null,vol:.0004,burnT:999,bRate:.04,bBit:.2,bBurnt:.3,def:5,tin:22,note:''},o);
  const d=IT[id];if(!d.aroW){d.aroW={};for(const k in d.aroO){if(k!=='wok'&&k!=='roast')d.aroW[k]=d.aroO[k]*.7}}
  if(d.rCold==null)d.rCold=d.rWater*.08;}
// 咸鲜酱料
S('salt','盐','咸鲜',{tas:{salt:1},def:3,note:'1% 左右的咸度最适口'});
S('ls','生抽','咸鲜',{liq:1,wat:.7,tas:{salt:.16,umami:.12,sweet:.03,ferment:.1},aroO:{ferment:.12,roast:.08},rOil:.06,win:[140,200],burnT:215,bBit:.15,vol:.0008,col:{brown:.2},def:10,note:'沿锅边烹入有酱香；收干后继续烧会糊'});
S('lc','老抽','咸鲜',{liq:1,wat:.65,tas:{salt:.13,sweet:.08,ferment:.08,umami:.04},aroO:{roast:.06},rOil:.03,win:[150,200],burnT:210,col:{brown:1.2},def:5,note:'主要上色，多了发黑发苦'});
S('hy','蚝油','咸鲜',{liq:1,wat:.6,tas:{salt:.09,umami:.35,sweet:.12,rich:.04},vol:.0003,burnT:190,bBit:.2,def:10,note:'久煮鲜味会钝，宜中后段下'});
S('wj','味精','咸鲜',{tas:{umami:3},msg:1,def:1,note:'需配合盐才鲜；高温干锅久炒会分解'});
S('jj','鸡精','咸鲜',{tas:{umami:1.6,salt:.35},msg:1,def:2});
S('yl','鱼露','咸鲜',{liq:1,wat:.7,tas:{salt:.22,umami:.3,off:.04},def:5});
S('db','郫县豆瓣','咸鲜',{wat:.4,tas:{salt:.15,spicy:.08,ferment:.12,umami:.05},aroO:{ferment:.45,spicy:.2,wok:.1,roast:.05},aroW:{ferment:.18,spicy:.15},raw:{bitter:.02},rawT:100,rOil:.012,win:[95,145],rWater:.0025,burnT:168,bRate:.03,bBit:.35,bBurnt:.4,col:{red:1},def:20,note:'中小火用油炒出红油才香；直接下汤有生酱味'});
S('ds','豆豉','咸鲜',{wat:.3,tas:{salt:.1,ferment:.3,umami:.12},aroO:{ferment:.4,roast:.1},rOil:.015,win:[100,150],rWater:.002,burnT:172,bBit:.3,def:6});
S('hdj','黄豆酱','咸鲜',{wat:.5,tas:{salt:.12,ferment:.3,umami:.1,sweet:.03},aroO:{ferment:.3,roast:.05},rOil:.015,win:[100,150],rWater:.002,burnT:165,bBit:.3,col:{brown:.3},def:15});
S('tmj','甜面酱','咸鲜',{wat:.45,tas:{salt:.08,sweet:.15,ferment:.25},aroO:{ferment:.25,roast:.1},rOil:.015,win:[95,140],rWater:.002,burnT:158,bRate:.05,bBit:.35,col:{brown:.5},def:20,note:'含糖高，最易炒糊，需小火'});
S('fr','红腐乳','咸鲜',{wat:.45,tas:{salt:.1,ferment:.35,umami:.2,sweet:.05},col:{red:.4},def:10});
S('zmj','芝麻酱','咸鲜',{wat:.05,tas:{rich:.35,roast:.18,bitter:.008},def:15});
S('fqj','番茄酱','咸鲜',{liq:.4,wat:.7,tas:{sweet:.12,sour:.06,salt:.03,umami:.05},raw:{sour:.03},rawT:90,aroO:{roast:.05,wok:.02},rOil:.01,win:[100,150],burnT:165,col:{red:.8},def:30,note:'下油炒一下能去生酸味、出红油'});
S('gt','高汤','咸鲜',{wat:.97,tas:{umami:.025,rich:.02,salt:.002},water:1,def:200});
S('qs','清水','咸鲜',{wat:1,water:1,def:200});
S('rs','热水','咸鲜',{wat:1,water:1,tin:90,def:400,note:'炖肉加热水，肉不易紧缩'});
S('kl','可乐','咸鲜',{wat:.89,water:1,tas:{sweet:.032,sour:.004},sugar:.106,col:{brown:.02},def:330});
// 甜
S('bt','白糖','甜',{tas:{sweet:.3},sugar:1,def:10,note:'干锅 150°C 以上焦化成焦香，190°C 以上发苦'});
S('bingt','冰糖','甜',{tas:{sweet:.27,rich:.03},sugar:1,def:20,note:'炒糖色、红烧收汁出亮'});
S('ht','红糖','甜',{tas:{sweet:.24,roast:.03},sugar:1,col:{brown:.3},def:10});
S('fm','蜂蜜','甜',{wat:.18,tas:{sweet:.26,fresh:.02},sugar:1.2,def:10});
// 酸
S('xc','香醋','酸',{liq:1,wat:.9,tas:{sour:.15,umami:.02,sweet:.02,ferment:.03},tv:.0008,tvd:['sour','ferment'],acid:1,col:{brown:.15},def:15,note:'久煮酸味挥发；出锅前沿锅边淋最显'});
S('cc','陈醋','酸',{liq:1,wat:.88,tas:{sour:.19,ferment:.06},tv:.0007,tvd:['sour'],acid:1,col:{brown:.2},def:15});
S('bc','白醋','酸',{liq:1,wat:.92,tas:{sour:.17},tv:.001,tvd:['sour'],acid:1,def:10});
S('nm','柠檬汁','酸',{liq:1,wat:.9,tas:{sour:.25},raw:{fresh:.3},rawK:.02,acid:1,def:10});
S('pj','泡椒','酸',{wat:.8,tas:{salt:.05,sour:.04,spicy:.1},raw:{fresh:.05},aroO:{wok:.08,spicy:.06},rOil:.015,win:[105,150],rWater:.002,burnT:175,col:{red:.6},def:25,note:'鱼香味的灵魂'});
S('scai','酸菜','酸',{liq:.15,wat:.9,tas:{sour:.025,salt:.02,umami:.01},aroO:{ferment:.04,wok:.02},aroW:{ferment:.035},rOil:.01,win:[100,160],rWater:.002,def:150});
S('dj','剁椒','酸',{wat:.6,tas:{salt:.1,spicy:.2,sour:.02},aroO:{wok:.05},rOil:.02,win:[100,150],col:{red:.7},def:30});
// 辣
S('gla','干辣椒段','辣',{tas:{spicy:.03},aroO:{spicy:.22,roast:.12,wok:.04},aroW:{spicy:.15},rOil:.02,win:[115,160],rWater:.0015,burnT:178,bRate:.04,bBit:.3,bBurnt:.45,col:{red:.6},whole:1,hula:1,def:8,note:'130–160°C 油温炸至棕红出煳辣香，发黑即苦'});
S('xmj','小米辣','辣',{wat:.85,tas:{spicy:.4},raw:{fresh:.1,pungent:.05},aroO:{wok:.05},rOil:.02,def:8});
S('ljm','辣椒面','辣',{tas:{spicy:.22},aroO:{roast:.25,wok:.08,spicy:.15},rOil:.08,win:[105,150],rWater:.004,burnT:165,bRate:.06,bBit:.3,bBurnt:.4,col:{red:1},def:5,note:'泼热油（约 180°C）最香'});
S('hyou','红油','辣',{oil:1,tas:{spicy:.12,roast:.1,rich:.05},col:{red:1},def:15});
S('bhj','白胡椒粉','辣',{tas:{spicy:.5},raw:{pungent:.8,spice:.2},rawK:.004,def:1,note:'香气易散，出锅前放'});
S('hhj','黑胡椒碎','辣',{tas:{spicy:.4},raw:{pungent:.4,spice:.4},rawK:.004,aroO:{spice:.3,roast:.05},rOil:.02,win:[100,150],def:2});
S('qjiao','青红椒','辣',{wat:.92,tas:{spicy:.02,sweet:.01},raw:{fresh:.08},aroO:{wok:.03,roast:.02},rOil:.01,win:[120,200],burnT:220,def:50,note:'作配料；作主料请在食材里选'});
// 麻
S('hj','红花椒','麻',{aroO:{numb:1.1,spice:.25,wok:.05},aroW:{numb:.9,spice:.15},rOil:.02,win:[105,150],rWater:.0018,rCold:.0003,burnT:170,bRate:.05,bBit:.4,bBurnt:.3,whole:1,def:3,note:'油温过 170°C 发黑变苦'});
S('hjm','花椒面','麻',{tas:{numb:.9},raw:{spice:.3},aroO:{spice:.2,roast:.05},rOil:.1,win:[100,140],rWater:.004,burnT:160,bRate:.06,bBit:.3,def:2});
S('qhj','青花椒','麻',{aroO:{numb:1.2,fresh:.5},aroW:{numb:.95,fresh:.3},rOil:.03,win:[100,140],rWater:.002,vol:.003,burnT:160,bRate:.06,bBit:.35,whole:1,def:5,note:'藤椒清香，怕高温'});
S('tjy','藤椒油','麻',{oil:1,tas:{numb:.6},raw:{fresh:.4},rawK:.01,rawT:70,def:5});
S('hjy','花椒油','麻',{oil:1,tas:{numb:.8},raw:{spice:.1},def:5});
// 辛香
S('cong','葱','辛香',{wat:.9,raw:{pungent:.05,fresh:.1},rawK:.012,aroO:{wok:.25,sweet:.02},aroW:{fresh:.02,sweet:.02},rOil:.03,win:[110,150],rWater:.002,rCold:.0004,burnT:175,bRate:.05,bBit:.1,bBurnt:.3,def:20,note:'葱白炝锅出香，葱花出锅撒保留清香'});
S('jiang','姜','辛香',{wat:.85,raw:{pungent:.2,fresh:.03},rawK:.01,aroO:{wok:.15,pungent:.05},aroW:{pungent:.07,spice:.03},rOil:.02,win:[110,165],rWater:.002,rCold:.0004,burnT:185,bBit:.15,def:10,note:'去腥压膻'});
S('suan','蒜','辛香',{wat:.65,raw:{pungent:.35},rawK:.015,aroO:{wok:.4,sweet:.02},aroW:{sweet:.03,umami:.02},rOil:.03,win:[105,150],rWater:.002,rCold:.0005,burnT:163,bRate:.07,bBit:.5,bBurnt:.5,def:12,note:'生蒜辛辣；油温超 165°C 易糊苦'});
S('yc','洋葱','辛香',{wat:.89,raw:{pungent:.05},aroO:{wok:.08,sweet:.06,roast:.03},aroW:{sweet:.05},rOil:.01,win:[110,170],burnT:190,def:80});
S('xcai','香菜','辛香',{wat:.9,raw:{fresh:.25},rawK:.02,rawT:55,def:10,note:'遇热香气很快散失'});
S('sm','蒜苗/青蒜','辛香',{wat:.9,raw:{fresh:.08,pungent:.06},rawK:.01,aroO:{wok:.15,sweet:.02},rOil:.02,win:[110,160],burnT:180,def:50});
// 香料
const SP=(o)=>{o.aroW=Object.assign({},o.aroO);return Object.assign({vol:.00015,rOil:.004,win:[100,160],rWater:.0007,burnT:180,bRate:.03,bBit:.3,whole:1},o)};
S('bj','八角','香料',SP({aroO:{spice:1.0,sweet:.03},ob:.04,okMin:120,def:4,note:'1 颗约 2g'}));
S('gp','桂皮','香料',SP({aroO:{spice:.9,sweet:.04},ob:.15,okMin:60,def:3,note:'久煮发苦发涩'}));
S('xy','香叶','香料',SP({aroO:{spice:1.2},ob:.3,okMin:45,def:.6,note:'1 片约 0.3g，30 分钟后捞出'}));
S('cg','草果','香料',SP({aroO:{spice:.9},ob:.15,okMin:90,def:4,note:'压羊肉牛肉腥膻，需拍破'}));
S('dx','丁香','香料',SP({aroO:{spice:2.4,numb:.1},ob:.3,okMin:60,def:.3,note:'味极冲，几粒即可'}));
S('xhx','小茴香','香料',SP({aroO:{spice:1.1},rOil:.01,ob:.05,okMin:120,def:2}));
S('cp','陈皮','香料',SP({aroO:{spice:.4,fresh:.35,bitter:.01},ob:.02,okMin:180,def:3}));
S('sn','山奈/白芷','香料',SP({aroO:{spice:1.3},ob:.15,okMin:60,def:1}));
S('zr','孜然','香料',{aroO:{spice:1.3,roast:.3},raw:{spice:.5},rOil:.03,win:[110,165],rWater:.003,burnT:178,bBit:.3,zr:1,def:6,note:'遇热油才爆出香'});
S('wxf','五香粉','香料',{raw:{spice:.6},aroO:{spice:.9},rOil:.05,win:[100,150],rWater:.005,rCold:.001,burnT:165,bBit:.3,def:2});
S('ssx','十三香','香料',{raw:{spice:.7},aroO:{spice:1.0},rOil:.05,win:[100,150],rWater:.005,rCold:.001,burnT:165,bBit:.3,def:2});
S('gl','咖喱粉','香料',{raw:{spice:.4},aroO:{spice:1.1,spicy:.15,roast:.1},rOil:.04,win:[100,150],rWater:.004,burnT:165,bBit:.3,curry:1,col:{yellow:1},def:15});
S('zm','熟芝麻','香料',{tas:{roast:.25,rich:.05},def:5});
S('hs','油酥花生','香料',{tas:{roast:.12,rich:.04},def:40});
// 酒
S('lj','料酒','酒',{liq:1,wat:.85,alc:.12,tas:{umami:.02,sweet:.02},aroO:{ferment:.02},def:10,note:'热锅烹入，酒精带走腥味'});
S('huj','黄酒/花雕','酒',{liq:1,wat:.82,alc:.15,tas:{sweet:.04,umami:.03,ferment:.04},def:20});
S('baij','白酒','酒',{liq:1,wat:.5,alc:.5,def:5});
S('lz','醪糟','酒',{liq:.6,wat:.75,alc:.03,tas:{sweet:.04,sour:.01,ferment:.03},sugar:.12,def:20});
S('pij','啤酒','酒',{wat:.92,alc:.04,water:1,tas:{bitter:.004,sweet:.01},def:330});
// 油
S('cy','菜籽油','油',{oil:1,raw:{off:.012,bitter:.006},rawT:125,rawK:.05,aroO:{wok:.02},rOil:.01,win:[150,250],tas:{rich:.02},def:30,note:'需烧熟去生油味，川菜常用'});
S('hsy','花生油','油',{oil:1,tas:{rich:.03},aroO:{wok:.02},rOil:.01,win:[150,250],def:30});
S('zy','猪油','油',{oil:1,tas:{rich:.12},aroO:{wok:.05},rOil:.02,win:[100,220],def:20});
S('xyou','香油','油',{oil:1,raw:{roast:.3,rich:.02},rawT:90,rawK:.012,def:3,note:'受热香气散，出锅淋'});
S('sfen','蒜粉','辛香',{raw:{pungent:.6},rawK:.01,aroO:{wok:.5,sweet:.03},aroW:{sweet:.05,umami:.03},rOil:.05,win:[100,145],rWater:.004,rCold:.002,burnT:155,bRate:.08,bBit:.5,bBurnt:.5,def:2,al:['大蒜粉','蒜粉'],note:'1g 约等于 3g 鲜蒜，适合腌料'});
S('ycf','洋葱粉','辛香',{raw:{pungent:.2},aroO:{wok:.35,sweet:.3,roast:.15},aroW:{sweet:.3,umami:.05},rOil:.04,win:[100,150],rWater:.004,rCold:.002,burnT:160,bRate:.06,def:2,note:'1g 约等于 8g 鲜洋葱'});
S('aol','奥尔良腌料','香料',{tas:{salt:.35,sweet:.3,spicy:.08,umami:.1},raw:{spice:.3},aroO:{spice:.5,roast:.3,sweet:.1},rOil:.04,win:[100,150],rWater:.004,rCold:.002,burnT:160,bRate:.06,def:20,note:'咸甜微辣，自带盐和糖'});
S('dian','淀粉','其他',{starch:1,def:5,note:'上浆护嫩；水淀粉勾芡挂汁'});
S('jdq','蛋清','其他',{liq:.5,wat:.88,starch:.4,tas:{umami:.01},def:15});
S('xs','小苏打','其他',{tas:{bitter:.1},soda:1,def:1,note:'嫩肉，多了发涩'});
S('zhj','柱候酱','咸鲜',{wat:.4,tas:{salt:.1,ferment:.3,sweet:.1,umami:.1},aroO:{ferment:.25,roast:.05},rOil:.015,win:[100,150],rWater:.002,burnT:165,bBit:.3,col:{brown:.3},def:20,note:'粤式焖牛腩的灵魂酱'});
S('hsj','花生酱','咸鲜',{wat:.02,tas:{rich:.35,roast:.18,sweet:.05},burnT:170,def:15});
S('hxj','海鲜酱','咸鲜',{wat:.4,tas:{sweet:.25,salt:.08,ferment:.2,umami:.1},burnT:160,col:{brown:.3},def:15});
S('csj','叉烧酱','咸鲜',{wat:.35,tas:{sweet:.3,salt:.08,ferment:.1,roast:.05},sugar:.3,burnT:160,col:{red:.6},def:30});
S('zyc','蒸鱼豉油','咸鲜',{liq:1,wat:.7,tas:{salt:.12,umami:.18,sweet:.05,ferment:.06},col:{brown:.15},def:20});
S('lxl','辣鲜露/鲜味汁','咸鲜',{liq:1,wat:.7,tas:{salt:.1,umami:.3,spicy:.02},def:8});
S('frz','腐乳汁','咸鲜',{liq:1,wat:.8,tas:{salt:.07,ferment:.2,umami:.1},col:{red:.3},def:15});
S('hslj','韩式辣酱','咸鲜',{wat:.4,tas:{sweet:.2,spicy:.15,ferment:.15,salt:.08},col:{red:.8},def:20});
S('hgdl','火锅底料','咸鲜',{oil:1,tas:{spicy:.25,numb:.25,salt:.1,ferment:.1,rich:.1},aroO:{spice:.4,roast:.1},rOil:.02,win:[90,150],rWater:.003,burnT:170,col:{red:1},def:50,note:'含大量牛油和盐'});
S('nrf','牛肉粉','咸鲜',{tas:{umami:1,salt:.4},msg:1,def:3});
S('xp','海米/虾皮','咸鲜',{tas:{salt:.08,umami:.35,off:.02},aroO:{roast:.1,wok:.05},rOil:.02,win:[100,160],rWater:.003,def:15});
S('jy','椒盐','咸鲜',{tas:{salt:.5,numb:.3,spice:.1,umami:.2},def:3});
S('tangse','糖色','甜',{liq:.4,wat:.4,tas:{sweet:.12,roast:.3,bitter:.02},col:{brown:1.5},def:15,note:'提前炒好的焦糖水'});
S('mc','米醋(9度)','酸',{liq:1,wat:.88,tas:{sour:.3,ferment:.02},tv:.001,tvd:['sour'],acid:1,def:15});
S('ml','味淋','酒',{liq:1,wat:.5,alc:.1,tas:{sweet:.2,umami:.03},def:15});
S('qj','清酒','酒',{liq:1,wat:.82,alc:.15,tas:{umami:.03,sweet:.02},def:15});
S('cjs','葱姜水','辛香',{water:1,wat:1,raw:{pungent:.02,fresh:.01},def:50,note:'去腥，馅料常用'});
S('hjs','花椒水','麻',{water:1,wat:1,tas:{numb:.08},def:50});
S('hy2','黄油','油',{oil:1,tas:{rich:.2,sweet:.02},aroO:{wok:.08,roast:.05},rOil:.02,win:[100,170],burnT:175,bBit:.2,def:20});
S('ny','牛油','油',{oil:1,tas:{rich:.2},aroO:{wok:.04},rOil:.01,win:[100,220],def:30});
S('jyou','鸡油','油',{oil:1,tas:{rich:.15,umami:.02},aroO:{wok:.04},rOil:.01,win:[100,220],def:15});
S('cyou','葱油','油',{oil:1,tas:{rich:.03,wok:.3},def:10});
S('lyou','料油','油',{oil:1,tas:{rich:.03,spice:.12,wok:.06},def:10});
S('mf','面粉','其他',{starch:.6,def:30});
S('hqf','红曲粉/栀子','其他',{col:{red:1},def:1,note:'只调色'});
S('gcao','甘草','香料',{tas:{sweet:.4,spice:.08},whole:1,def:2});
S('bk','白蔻','香料',{vol:.00015,rOil:.004,win:[100,160],rWater:.0007,burnT:180,bBit:.3,whole:1,aroO:{spice:.9,fresh:.3},aroW:{spice:.9,fresh:.3},ob:.1,okMin:90,def:2});
S('rdk','肉蔻','香料',{vol:.00015,rOil:.004,win:[100,160],rWater:.0007,burnT:180,bBit:.3,whole:1,aroO:{spice:1.4,sweet:.03},aroW:{spice:1.4},ob:.15,okMin:90,def:1});
S('lbao','卤料包','香料',{vol:.00015,rOil:.004,win:[100,160],rWater:.0007,burnT:180,bBit:.3,whole:1,aroO:{spice:1.0,numb:.2,sweet:.03},aroW:{spice:1.0,numb:.15},ob:.1,okMin:90,def:15,note:'八角桂皮香叶草果等组合'});
S('gzqi','枸杞/红枣','甜',{tas:{sweet:.25},def:10});
const CATS=['咸鲜','甜','酸','辣','麻','辛香','香料','酒','油','其他'];

// 食材：wr 最大失水比例，coll 胶原软化所需分钟，cook 断生分钟(丁大小)
const FD={};
function F(id,name,cat,o){FD[id]=Object.assign({id,name,cat,kind:'f',wr:.25,fat:0,umami:.004,off:0,sweet:0,sour:0,fresh:0,spicy:0,cook:1.5,coll:0,oab:0,cut:'片',tin:12,lean:0,mustCook:1},o)}
F('wh','五花肉','肉',{fat:.35,umami:.011,off:.004,cook:3,coll:40,wr:.2,cut:'块'});
F('lji','猪里脊','肉',{fat:.05,umami:.012,off:.003,cook:1.4,lean:1,wr:.28,cut:'丝'});
F('pg','排骨','肉',{fat:.2,umami:.012,off:.005,cook:4,coll:30,wr:.22,cut:'块'});
F('rm','猪肉末','肉',{fat:.2,umami:.012,off:.004,cook:1,wr:.25,cut:'末'});
F('nr','牛里脊','肉',{fat:.06,umami:.015,off:.005,cook:1.1,lean:1,wr:.28,cut:'片'});
F('nn','牛腱/牛腩','肉',{fat:.12,umami:.016,off:.006,cook:4,coll:60,wr:.3,cut:'大块'});
F('yr','羊肉','肉',{fat:.15,umami:.014,off:.011,cook:1.4,coll:55,wr:.27,cut:'片'});
F('jt','鸡腿肉','禽',{fat:.1,umami:.013,off:.004,cook:2,coll:20,wr:.22,cut:'丁'});
F('jx','鸡胸肉','禽',{fat:.02,umami:.011,off:.003,cook:1.3,lean:1,wr:.3,cut:'丁'});
F('jc','鸡翅','禽',{fat:.16,umami:.012,off:.004,cook:2.5,coll:15,wr:.2,cut:'整'});
F('ya','鸭肉','禽',{fat:.25,umami:.013,off:.01,cook:3,coll:45,wr:.2,cut:'块'});
F('yu','鱼(鲈/草鱼)','水产',{fat:.04,umami:.014,off:.006,cook:1,lean:1,fish:1,wr:.22,cut:'片'});
F('xia','虾','水产',{fat:.01,umami:.02,sweet:.004,off:.004,cook:.5,lean:1,fish:1,wr:.2,cut:'整'});
F('dfu','豆腐','豆制品',{umami:.004,off:.0015,cook:1,wr:.15,tofu:1,cut:'块'});
F('jd','鸡蛋','蛋',{fat:.1,umami:.012,off:.0015,cook:1.2,lean:1,egg:1,wr:.1,cut:'液'});
F('qz','茄子','蔬菜',{umami:.002,sweet:.003,cook:2.5,oab:.3,wr:.2,soft:1,cut:'条',mustCook:0});
F('td','土豆','蔬菜',{umami:.002,sweet:.002,cook:6,wr:.08,starchy:1,cut:'丝',mustCook:1});
F('qcai','青菜','蔬菜',{umami:.003,sweet:.002,fresh:.006,cook:.4,wr:.45,leaf:1,cut:'整',mustCook:0});
F('qjz','青椒','蔬菜',{umami:.001,sweet:.003,fresh:.008,spicy:.003,cook:.9,wr:.2,cut:'块',mustCook:0});
F('fq','番茄','蔬菜',{umami:.006,sweet:.004,sour:.006,cook:1,wr:.35,soft:1,cut:'块',mustCook:0});
F('xg','香菇/蘑菇','菌菇',{umami:.02,cook:1.5,wr:.35,cut:'片',mustCook:1});
F('dou','四季豆','蔬菜',{umami:.002,sweet:.003,fresh:.004,cook:4,wr:.15,bean:1,cut:'段'});
F('mr','木耳','菌菇',{umami:.003,cook:.8,wr:.05,cut:'丝'});
F('hlb','胡萝卜','蔬菜',{sweet:.007,cook:1.5,wr:.1,cut:'丝',mustCook:0});
F('hg','黄瓜','蔬菜',{fresh:.012,sweet:.002,cook:.5,wr:.3,cut:'条',mustCook:0});
F('ms','粉丝','其他',{cook:1,wr:-.5,cut:'整',mustCook:1});
F('lb','萝卜','蔬菜',{umami:.002,sweet:.006,cook:4,wr:.3,soft:1,cut:'块',mustCook:0});
F('baic','白菜/包菜','蔬菜',{umami:.003,sweet:.005,fresh:.004,cook:1.2,wr:.45,leaf:1,cut:'片',mustCook:0});
F('dy','豆芽','蔬菜',{umami:.002,fresh:.004,cook:.8,wr:.25,cut:'整',mustCook:1});
F('qc','芹菜/蒜苔','蔬菜',{fresh:.012,cook:1,wr:.2,cut:'段',mustCook:0});
F('jc2','韭菜','蔬菜',{fresh:.01,spicy:.001,cook:.4,wr:.3,leaf:1,cut:'段',mustCook:0});
F('xlh','西兰花','蔬菜',{umami:.003,sweet:.003,cook:1.5,wr:.15,cut:'块',mustCook:0});
F('bcai','菠菜/油菜','蔬菜',{umami:.004,fresh:.006,cook:.4,wr:.5,leaf:1,cut:'整',mustCook:0});
F('dg','冬瓜/南瓜','蔬菜',{sweet:.004,cook:2.5,wr:.3,soft:1,cut:'块',mustCook:0});
F('ou','莲藕','蔬菜',{sweet:.004,cook:3,wr:.1,cut:'片',mustCook:0});
F('jzg','金针菇','菌菇',{umami:.012,cook:1,wr:.35,cut:'整'});
F('zt','猪蹄/猪皮','肉',{fat:.25,umami:.01,off:.006,cook:6,coll:90,wr:.15,cut:'块'});
F('jz','鸡爪/鸡架','禽',{fat:.12,umami:.012,off:.005,cook:3,coll:35,wr:.15,cut:'整'});
F('zg','猪肝/腰花','肉',{fat:.04,umami:.014,off:.012,cook:.8,lean:1,wr:.25,cut:'片'});
F('fc','肥肠/肚','肉',{fat:.3,umami:.01,off:.02,cook:4,coll:60,wr:.15,cut:'段'});
F('yy','鱿鱼/墨鱼','水产',{umami:.016,off:.005,cook:.6,lean:1,fish:1,wr:.2,cut:'条'});
F('mt','面条/年糕','主食',{cook:2,wr:-.3,cut:'整',mustCook:1});
F('mfan','米饭','主食',{sweet:.002,cook:.5,wr:0,cut:'整',mustCook:0});
F('huot','火腿/腊肉','肉',{fat:.25,umami:.025,salt:.03,cook:.5,wr:.05,cut:'片',mustCook:0});
F('gdf','干豆腐/豆皮','豆制品',{umami:.005,off:.001,cook:.8,wr:.05,tofu:1,cut:'丝'});
F('xhs','西红柿(大块炖)','蔬菜',{umami:.006,sweet:.004,sour:.006,cook:2,wr:.4,soft:1,cut:'块',mustCook:0});
// ===== 更多食材：在基础食材上改参数 =====
function V(id,name,base,o){const b=FD[base];const c=Object.assign({},b);delete c.al;delete c.id;delete c.name;delete c.kind;Object.assign(c,{base,lean:b.lean,coll:b.coll},o||{});F(id,name,c.cat||b.cat,c)}
F('gclam','蛤蜊','水产',{umami:.03,off:.006,cook:.4,lean:1,fish:1,wr:.2,cut:'整',al:['花甲','蛤']});
F('gbs','竹笋','蔬菜',{umami:.006,sweet:.002,cook:3,wr:.1,cut:'片',mustCook:1,al:['笋','冬笋','春笋','笋片']});
// 猪
V('gmhr','梅花肉','lji',{fat:.18,al:['猪颈肉','梅头肉','梅肉']});
V('gzer','猪耳朵','zt',{coll:60,fat:.1,cut:'片',al:['猪耳']});
V('gzwe','猪尾巴','zt',{coll:80,al:['猪尾']});
V('gzsh','猪舌','zg',{coll:40,lean:0,cook:3,cut:'片',al:['口条']});
V('gzx','猪心','zg',{off:.008});
V('gzxue','猪血','dfu',{umami:.006,off:.004,cook:.6,tofu:1,al:['鸭血','血豆腐','毛血旺']});
V('gzdg','猪大骨','pg',{coll:120,fat:.1,cut:'大块',al:['大骨','棒骨','筒骨','脊骨','猪骨']});
V('gzlp','猪肋排','pg',{fat:.25,al:['肋排','精排','小排','仔排']});
V('gzrw','肉丸','rm',{cut:'整',cook:3,al:['丸子','狮子头','贡丸']});
V('gpg','培根','huot',{fat:.4,salt:.025,al:['烟肉']});
V('gxc','香肠','huot',{fat:.3,salt:.03,sweet:.01,al:['腊肠','广式香肠','火腿肠']});
V('gwcr','午餐肉','huot',{fat:.25,salt:.02,al:['罐头肉','Spam']});
V('gzpi','猪皮','zt',{coll:100,fat:.05,cut:'条',al:['肉皮']});
// 牛
V('gnlt','牛肋条','nn',{coll:70,fat:.25,al:['牛肋','肋条','牛肋肉']});
V('gnj','牛腱子','nn',{coll:90,fat:.06,al:['牛腱','腱子']});
V('gnn','牛腩','nn',{coll:60,fat:.18,al:['带筋牛腩']});
V('gnjin','牛筋','nn',{coll:180,fat:.02,al:['蹄筋','牛蹄筋']});
V('gnwe','牛尾','nn',{coll:150,fat:.2,al:['牛尾巴']});
V('gnsh','牛舌','nn',{coll:80,fat:.15,cut:'片'});
V('gnp','牛排','nr',{fat:.15,cut:'大块',cook:1.2,al:['西冷','眼肉','菲力','牛扒']});
V('gfn','肥牛卷','nr',{fat:.25,cook:.4,cut:'片',al:['肥牛','雪花肥牛','牛肉卷']});
V('gnrw','牛肉丸','rm',{umami:.015,cut:'整',cook:3,al:['牛丸','牛筋丸']});
V('gmd','毛肚','fc',{coll:0,lean:1,cook:.15,fat:.02,off:.008,cut:'片',al:['牛百叶','百叶']});
V('gnd','牛肚','fc',{coll:90,fat:.05,al:['金钱肚']});
V('gnw','牛蛙','jx',{cat:'水产',off:.005,cook:1,cut:'块',al:['田鸡']});
// 羊
V('gyp','羊排','yr',{coll:60,fat:.25,cut:'块',al:['羊肋排','羊肋']});
V('gyt','羊腿肉','yr',{coll:50,fat:.1,al:['羊腿']});
V('gyj','羊肉卷','yr',{cook:.4,coll:0,lean:1,cut:'片',al:['羊肉片','涮羊肉']});
V('gyxz','羊蝎子','yr',{coll:90,fat:.15,cut:'大块',al:['羊脊骨']});
// 禽
V('gzj','整鸡','jt',{coll:40,fat:.15,cut:'块',al:['三黄鸡','土鸡','走地鸡','柴鸡','公鸡','母鸡','鸡块']});
V('gwj','乌鸡','jt',{coll:60,fat:.08,cut:'块',al:['乌骨鸡']});
V('gjz2','鸡胗','zg',{coll:40,lean:0,cook:2,off:.005,al:['鸡肫','胗']});
V('gjx2','鸡心','zg',{off:.006,cook:1,cut:'整'});
V('gjtg','去骨鸡腿','jt',{al:['鸡腿排','琵琶腿','鸡腿']});
V('gyt2','鸭腿','ya',{coll:40,al:['鸭肉']});
V('gyx','鸭胸','ya',{coll:0,lean:1,fat:.2,cook:1.5,al:['鸭脯']});
V('ge','鹅肉','ya',{coll:70,fat:.3,al:['鹅','大鹅']});
V('gge','鸽子','jt',{coll:40,fat:.08,cut:'整',al:['乳鸽']});
V('gyz','鸭掌','jz',{coll:50,al:['鸭爪','鸭脖','鸭翅']});
// 蛋
V('gacd','鹌鹑蛋','jd',{cut:'整',cook:3,al:['鹌鹑']});
V('gyd','鸭蛋','jd',{off:.003,al:['咸鸭蛋']});
V('gpd','皮蛋','jd',{cook:.1,mustCook:0,umami:.015,off:.004,cut:'块',al:['松花蛋']});
// 鱼虾蟹贝
V('gcy','草鱼','yu',{al:['鲩鱼']});V('gly','鲈鱼','yu',{off:.004,al:['海鲈','加州鲈']});V('gly2','鲤鱼','yu',{off:.009});V('gjy','鲫鱼','yu',{off:.008,al:['鲫']});
V('ghy','黑鱼','yu',{off:.006,al:['乌鱼','生鱼']});V('gxy','鳕鱼','yu',{off:.003,fat:.02,al:['银鳕鱼','鳕']});V('gswy','三文鱼','yu',{fat:.13,off:.003,al:['鲑鱼']});
V('gdy','带鱼','yu',{fat:.08,off:.008,cut:'段'});V('ghhy','黄花鱼','yu',{off:.006,al:['小黄鱼','黄鱼']});V('gcy2','鲳鱼','yu',{fat:.07,al:['平鱼']});
V('glly','龙利鱼','yu',{off:.003,al:['巴沙鱼','鱼柳','鱼片']});V('gmy','鳗鱼','yu',{fat:.2,al:['鳝鱼','黄鳝']});V('gyt3','鱼头','yu',{coll:25,fat:.08,lean:0,cut:'大块',al:['胖头鱼','鳙鱼','花鲢','鲢鱼']});
V('gyw','鱼丸','rm',{cat:'水产',umami:.012,cut:'整',cook:2,mustCook:0,al:['墨鱼丸','虾滑']});
V('gxr','虾仁','xia',{cut:'整',cook:.4});V('gdx','大虾','xia',{cook:.7,al:['基围虾','明虾','对虾','白虾','河虾','鲜虾']});V('gxlx','小龙虾','xia',{off:.008,cook:1.5,al:['龙虾']});
V('gppx','皮皮虾','xia',{cook:.8,al:['濑尿虾','虾爬子']});V('gpx','螃蟹','xia',{cook:2,off:.005,umami:.025,al:['大闸蟹','梭子蟹','蟹','花蟹']});
V('gsb','扇贝','gclam',{al:['贝']});V('gsh','生蚝','gclam',{fat:.02,al:['牡蛎','蚝']});V('ghl','海螺','gclam',{cook:2,al:['螺','田螺','螺蛳']});V('gcz','蛏子','gclam',{al:['蛏']});
V('gzy','章鱼','yy',{al:['八爪鱼','小章鱼','墨鱼仔']});V('ghs','海参','yy',{umami:.008,off:.002,cook:2,coll:30,lean:0});
V('ghd','海带','gbs',{cat:'水产',umami:.012,sweet:0,cook:3,al:['海带结','海带丝','昆布']});V('gzc','紫菜','gbs',{cat:'水产',umami:.02,cook:.1,mustCook:0,al:['海苔']});
// 豆制品
V('gndf','嫩豆腐','dfu',{wr:.2,al:['内酯豆腐','日本豆腐','南豆腐']});V('gldf','老豆腐','dfu',{wr:.1,al:['北豆腐','卤水豆腐']});
V('gddf','冻豆腐','dfu',{wr:-.3,al:['冻豆腐块']});V('gydf','油豆腐','dfu',{fat:.15,wr:-.2,al:['豆泡','豆腐泡','油豆泡']});
V('gfz','腐竹','gdf',{cook:3,wr:-.3,al:['豆腐竹']});V('gqz','千张','gdf',{al:['百叶结','豆腐丝']});V('gxg','香干','gdf',{cook:.8,al:['豆干','茶干','白干','五香干']});
V('gsj','素鸡','gdf',{fat:.05});V('gmj','面筋','gdf',{umami:.004,wr:-.3,al:['烤麸','油面筋']});
// 叶菜
V('gth','茼蒿','bcai',{fresh:.015,cook:.3,al:['蓬蒿','春菊','蒿子杆']});V('gbcai','菠菜','bcai',{});V('gshq','上海青','bcai',{al:['油菜','小油菜','青江菜']});
V('gxbc','小白菜','qcai',{});V('gsc','生菜','bcai',{cook:.2,mustCook:0,al:['油麦菜','莴苣叶','罗马生菜']});V('gkxc','空心菜','bcai',{cook:.3,al:['通菜','蕹菜']});
V('gxc2','苋菜','bcai',{cook:.4});V('gcx','菜心','qcai',{cook:.5,al:['菜苔','广东菜心']});V('gjl','芥蓝','qcai',{cook:.8,fresh:.01});
V('gwwc','娃娃菜','baic',{cook:1,al:['宝宝菜']});V('gdbc','大白菜','baic',{cook:1.5,al:['白菜','黄芽白']});V('gbx','圆白菜','baic',{cook:1,al:['包菜','卷心菜','洋白菜','甘蓝','手撕包菜']});
V('gzgl','紫甘蓝','baic',{cook:.8,mustCook:0});V('gjh','韭黄','jc2',{fresh:.008});V('gsm','蒜苗','jc2',{fresh:.012,al:['青蒜']});V('gst','蒜薹','qc',{cook:1.5,al:['蒜苔']});
V('gqc','芹菜','qc',{al:['西芹','药芹','香芹']});V('ghxm','茴香苗','bcai',{fresh:.02,al:['茴香菜']});V('gdm','豌豆苗','bcai',{cook:.3,al:['豆苗','龙须菜']});
V('gjc','荠菜','bcai',{fresh:.015,al:['地菜']});V('gyc','洋葱','qjz',{sweet:.008,spicy:0,fresh:.004,cook:1.5,cut:'丝',al:['圆葱','洋葱头']});
// 根茎
V('ghs2','红薯','td',{sweet:.012,cook:5,al:['地瓜','番薯','紫薯']});V('gsy','山药','td',{cook:3,sweet:.003,al:['铁棍山药','淮山']});V('gyt4','芋头','td',{cook:5,al:['芋艿','香芋','毛芋']});
V('gbl','白萝卜','lb',{});V('gwsu','莴笋','hg',{cook:1,mustCook:0,al:['莴苣','青笋']});V('gjb','茭白','gbs',{cook:1.5,sweet:.004,al:['茭笋']});
V('gbq','荸荠','ou',{sweet:.008,cook:1,mustCook:0,al:['马蹄']});V('gnb','牛蒡','ou',{cook:3});V('gmy2','魔芋','gdf',{umami:0,wr:-.2,cook:2,al:['魔芋丝','魔芋结','魔芋豆腐']});
V('gtd2','小土豆','td',{cut:'整',cook:8,al:['土豆仔']});
// 瓜果
V('gsg','丝瓜','dg',{cook:1,al:['胜瓜']});V('gkg','苦瓜','hg',{bitter:.012,cook:1.2,al:['凉瓜']});V('gfsg','佛手瓜','hg',{cook:1.2});V('gng','南瓜','dg',{sweet:.012,cook:3,al:['倭瓜','贝贝南瓜']});
V('gxhl','西葫芦','hg',{cook:1});V('gyqz','圆茄子','qz',{al:['长茄子','紫茄子']});V('gqk','秋葵','qjz',{cook:1,spicy:0});
V('gjj','尖椒','qjz',{spicy:.01,al:['螺丝椒','线椒','杭椒','二荆条','薄皮椒','青尖椒']});V('gcj','彩椒','qjz',{spicy:0,sweet:.006,al:['甜椒','红椒','黄椒','灯笼椒']});
V('gym','玉米','td',{sweet:.012,cook:5,cut:'段',al:['甜玉米','玉米棒']});V('gymz','玉米粒','td',{sweet:.012,cook:2,cut:'整',mustCook:0});
V('gwd','豌豆','dou',{bean:0,cook:2,sweet:.006,cut:'整',al:['青豆']});V('gmd2','毛豆','dou',{bean:0,cook:4,cut:'整',al:['毛豆仁']});
V('gcd','长豆角','dou',{al:['豇豆']});V('gbd','扁豆','dou',{al:['芸豆','架豆','油豆角']});V('ghld','荷兰豆','dou',{bean:0,cook:.8,mustCook:0,al:['甜豆','蜜豆']});
V('gcand','蚕豆','dou',{bean:0,cook:3,al:['胡豆']});V('ghdy','黄豆芽','dy',{cook:2});V('glds','绿豆芽','dy',{cook:.5,al:['银芽']});
V('gjsc','金丝瓜','hg',{cook:1});
// 菌菇
V('gpg2','平菇','xg',{});V('gxbg','杏鲍菇','xg',{cook:2,umami:.016});V('gkm','口蘑','xg',{al:['白蘑菇','蘑菇']});V('gxwg','蟹味菇','xg',{al:['海鲜菇','白玉菇','鸡腿菇']});
V('gcsg','茶树菇','xg',{cook:2.5,umami:.018});V('gjc2','鸡枞','xg',{umami:.025});V('gngj','牛肝菌','xg',{umami:.025});V('gsr','松茸','xg',{umami:.025});
V('ghtg','猴头菇','xg',{cook:3});V('gyer','银耳','mr',{cook:20,al:['白木耳']});V('gzs','竹荪','mr',{cook:3});V('gxg2','干香菇','xg',{umami:.04,cook:3,al:['花菇','冬菇']});
// 主食
V('gwd2','乌冬面','mt',{});V('gym2','意面','mt',{cook:8,al:['意大利面','通心粉']});V('gmx','米线','mt',{cook:1.5,al:['米粉','河粉','粿条']});
V('gkf','宽粉','ms',{cook:4,al:['粉条','红薯粉','土豆粉','苕粉']});V('gmt2','馒头','mfan',{mustCook:0,al:['花卷','包子']});V('gjz3','饺子','mt',{cook:5,al:['水饺','馄饨','云吞']});
V('gfbm','方便面','mt',{cook:2,al:['泡面','拉面']});V('gnt','年糕','mt',{cook:3,al:['年糕条','炒年糕']});
// 果子与其他
V('glz','栗子','td',{sweet:.015,cook:10,cut:'整',al:['板栗']});V('gpg3','苹果','fq',{sour:.003,sweet:.02,mustCook:0,al:['梨','菠萝','凤梨']});
V('gls','芦笋','qc',{cook:1,fresh:.01,al:['露笋']});V('gxch','香椿','bcai',{fresh:.03,cook:.3,al:['香椿芽']});V('gjc3','蕨菜','gbs',{cook:2,al:['蕨根']});
V('ghhc','黄花菜','gbs',{cook:3,al:['金针菜']});V('gbh','百合','ou',{sweet:.006,cook:1,al:['鲜百合']});V('glzi','莲子','ou',{cook:15,cut:'整'});
V('gxyc','西洋菜','bcai',{al:['豆瓣菜']});V('gmec','木耳菜','bcai',{al:['落葵','软浆叶']});V('gjcai','芥菜','bcai',{fresh:.012,al:['雪里蕻','雪菜']});
V('gmlh','马兰头','bcai',{fresh:.015,al:['马兰']});V('gdj','豆角丝','dou',{al:['豆角']});
V('gyg','腰果','huot',{cat:'其他',salt:0,fat:.45,umami:.004,cook:.5,cut:'整',al:['核桃','杏仁','坚果']});

const CUTS={'末':.25,'丝':.35,'液':.4,'片':.5,'条':.7,'丁':.8,'厚片':.9,'段':.8,'块':1.6,'整':2.4,'大块':2.8,'整条':3.5};
const FCATS=['肉','禽','水产','蛋','豆制品','蔬菜','菌菇','主食','其他'];

function clamp(x,a,b){return x<a?a:x>b?b:x}
function mkC(id,name){return{id,name,items:[],foods:[],T:22,water:0,oil:0,lid:0,isPot:id==='pot',hot:0,maxT:22}}
const MEATC=['肉','禽','水产'];
function heatCap(c){let C=c.isPot?400:150;C+=c.water*4.18+c.oil*2;for(const f of c.foods)C+=(f.g-f.wl+f.oa)*3.4;for(const e of c.items){const d=IT[e.id];if(!d.oil&&!d.water)C+=e.g*2.5}return C}
function foodMass(c){let m=0;for(const f of c.foods)m+=Math.max(0,f.g-f.wl+f.oa);return m}

function addTo(c,id,g,cut,prep){
  const C0=heatCap(c);let tin;
  if(FD[id]){const d=FD[id];cut=cut||d.cut;const f={id,g,cut,sf:CUTS[cut]||1,done:0,over:0,tender:0,brown:0,burnt:0,wl:0,wa:0,fr:0,off:1,abs:0,oa:0,coated:0};
    if(prep==='blanch'){f.off=.45;f.done=.25;f.tender=d.coll?.08:0;f.wl=g*.05}
    if(prep==='preboil'){f.off=.35;f.done=1;f.over=.3;f.tender=d.coll?.5:0;f.wl=g*.12;f.abs=.05}
    c.foods.push(f);tin=prep?40:d.tin}
  else{const d=IT[id];c.items.push({id,g,ro:0,rw:0,rawLeft:1,lost:0,tl:0,burn:0,car:0,alc:g*(d.alc||0),gel:0,wetSec:0,msgDeg:0});
    if(d.water)c.water+=g*d.wat; else if(d.liq)c.water+=g*d.wat*d.liq;
    if(d.oil)c.oil+=g; tin=d.tin}
  const C1=heatCap(c);c.T=(C0*c.T+(C1-C0)*tin)/C1;
  flash(c);
}
function flash(c){ // 热锅遇水瞬间汽化
  if(c.T>100&&c.water>0){const C=heatCap(c);const ev=Math.min(c.water,(c.T-100)*C/2260);c.water-=ev;c.T-=ev*2260/C;}
}
function sizzle(src,dst){ // 泼油：热油浇在料上瞬间激香
  let T=src.T;const oilHot=src.oil>8&&src.foods.length===0&&src.water<5&&T>120;if(!oilHot)return 0;
  for(let i=0;i<25;i++){for(const e of dst.items){const d=IT[e.id];if(!d.rOil)continue;const free=Math.max(0,1-e.ro-e.rw);
      if(T>=d.win[0]){const fr=Math.min(1.5,(T-d.win[0])/(d.win[1]-d.win[0])+.3);e.ro+=d.rOil*fr*free*Math.min(1,src.oil/30)}
      if(T>d.rawT)e.rawLeft*=Math.exp(-d.rawK*Math.min(3,(T-d.rawT)/40));if(T>d.burnT)e.burn+=.25*d.bRate*(T-d.burnT)/20*(1-e.burn)}
    T=100+(T-100)*Math.exp(-1/3)}
  dst.sizzled=1;return 1}
function moveAll(src,dst,what){
  sizzle(src,dst);
  const C0=heatCap(dst),Cs=heatCap(src),T0=dst.T,Ts=src.T;
  dst.bound=0;src.bound=0;
  if(what==='foods'){const mf=foodMass(src),tot=mf+src.water+src.oil+1;const fr=Math.min(.9,mf/tot+.15);
    dst.foods.push(...src.foods);src.foods=[];
    for(const e of src.items){const n=Object.assign({},e);n.g=e.g*fr;n.alc=e.alc*fr;e.g*=1-fr;e.alc*=1-fr;dst.items.push(n)}
    const w=src.water*fr*.5,o=src.oil*.25;dst.water+=w;src.water-=w;dst.oil+=o;src.oil-=o;}
  else{dst.foods.push(...src.foods);dst.items.push(...src.items);dst.water+=src.water;dst.oil+=src.oil;src.foods=[];src.items=[];src.water=0;src.oil=0;}
  const C1=heatCap(dst);dst.T=(C0*T0+(C1-C0)*Ts)/Math.max(1,C1);dst.maxT=Math.max(dst.maxT,dst.T);flash(dst);
}

function tick(c,fire,mode,lid,dt){
  const T0=c.T;const mf=foodMass(c);const C=heatCap(c);
  let wet=c.water>Math.max(4,.1*mf);const steam=fire>0&&mode==='steam';
  if(fire>0){
    if(steam){c.T+=(100-c.T)*dt/50;c.water+=.03*dt;wet=true}
    else{const P=[0,900,1700,3000][fire];const base=(mode==='bake'?[0,160,200,240]:[0,175,210,250])[fire];
      if(wet){ if(c.T<100){c.T+=(P-3*(c.T-25))*dt/C;if(c.T>100)c.T=100}
               if(c.T>=100){c.T=100;const ev=[0,.12,.35,.9][fire]*(lid?.12:1)*(mode==='bake'?.6:1)*dt;c.water=Math.max(0,c.water-ev)} }
      else{let Q=P*(base-c.T)/(base-25);if(c.T>100)Q-=.08*mf*(c.T-100);
        if(c.water>0){const ev=Math.min(c.water,Math.max(0,Q)*.8/2260*dt);c.water-=ev;Q-=ev*2260/dt}
        c.T+=Q*dt/C;}}
  }else{c.T+=(25-c.T)*(c.isPot?3:6)*dt/C}
  c.maxT=Math.max(c.maxT,c.T);
  const T=c.T;
  // 腌制：没开火的碗里，肉慢慢吸水（盐、小苏打让它吸得更多），淀粉把水挂成浆裹在料上
  if(fire===0&&!c.isPot&&c.water>0&&c.foods.length&&T0<45){const meatG=c.foods.reduce((a,f)=>a+(MEATC.includes(FD[f.id].cat)?f.g:0),0);
    if(meatG>0){const soda=c.items.reduce((a,e)=>a+(IT[e.id].soda?e.g:0),0),salt=c.items.reduce((a,e)=>a+e.g*((IT[e.id].tas||{}).salt||0),0);
      const capF=.05+Math.min(.16,soda/meatG*28)+Math.min(.04,salt/meatG*4);
      for(const f of c.foods){if(!MEATC.includes(FD[f.id].cat))continue;const cap=f.g*capF;if(f.wa>=cap)continue;const x=Math.min(c.water*.95,(cap-f.wa)*dt/(2400*Math.max(.4,f.sf)));f.wa+=x;f.wl-=x;c.water-=x;if(soda>0)f.soda=Math.max(f.soda||0,Math.min(1,soda/meatG*200))}}
    const st=c.items.reduce((a,e)=>a+(IT[e.id].starch?e.g*IT[e.id].starch:0),0);const mf0=foodMass(c);
    if(st>0&&mf0>0){const want=Math.min(st*1.4,mf0*.25)-(c.bound||0);if(want>0){const x=Math.min(c.water,want*Math.min(1,dt/60));c.bound=(c.bound||0)+x;c.water-=x;for(const f of c.foods){const sh=x*Math.max(0,f.g-f.wl)/mf0;f.wl-=sh;f.wa+=sh*.0}}}}
  // 食材
  for(const f of c.foods){const d=FD[f.id];
    let r=T<55?0:T<100?Math.pow((T-55)/45,1.5):1+(T-100)/60;
    const dd=r/(60*d.cook*Math.pow(f.sf,1.3))*dt;
    if(f.done<1){f.done+=dd;if(f.done>1){f.over+=f.done-1;f.done=1}}else f.over+=dd*(f.coated?.5:1)*(1-.45*(f.soda||0));
    if(d.coll&&T>80)f.tender+=(wet?1:.4)*Math.min(1,(T-80)/15)*dt/(60*d.coll*Math.sqrt(f.sf));
    if(!wet&&T>125){const sug=c.items.some(e=>IT[e.id].sugar&&e.g>3)?1.3:1;f.brown+=(T-125)/60*.011*dt/Math.pow(f.sf,.3)*sug*(d.leaf?.6:1);
      if(f.brown>1.5&&T>140)f.burnt+=.004*(T-140)/40*dt}
    {const so=f.soda||0;const lim=f.g*d.wr*(1-.5*so)-(f.wa||0)*(.4+.35*so);if(T>65&&d.wr>0&&f.wl<lim){const x=Math.min(lim-f.wl,f.g*d.wr*.0015*(T>100?1.6:1)*(1-.4*so)*dt/Math.pow(f.sf,.7));f.wl+=x;c.water+=x}}
    if(d.wr<0&&c.water>0&&T>60){const x=Math.min(c.water,f.g*.01*dt);if(f.wl>f.g*d.wr){f.wl-=x;c.water-=x}}
    if(d.fat>0&&T>95&&f.fr<f.g*d.fat*.55){const x=f.g*d.fat*.0008*dt*(wet?.6:1.5)/Math.sqrt(f.sf);f.fr+=x;c.oil+=x}
    if(d.oab&&T>100&&c.oil>2&&f.oa<f.g*d.oab){const x=Math.min(c.oil-1,f.g*d.oab*.02*dt);f.oa+=x;c.oil-=x}
    if(T>90)f.off*=Math.exp(-(steam?.0012:lid?.0001:(wet?.0006:.0015))*dt);
    const liq=c.water>2||(fire===0&&!c.isPot&&((c.bound||0)>2||(f.wa||0)>1));const k=(liq?(T>80?.0007:.00025):.00008)*dt/f.sf;f.abs+=k*(1-f.abs);
    if(!f.coated&&f.done<.2&&c.items.some(e=>IT[e.id].starch&&e.g>=2))f.coated=1;
  }
  // 调料
  for(const e of c.items){const d=IT[e.id];const free=Math.max(0,1-e.ro-e.rw);
    if(!wet&&!steam&&T>=d.win[0]&&c.oil>2&&d.rOil){const fr=Math.min(1.5,(T-d.win[0])/(d.win[1]-d.win[0])+.3);e.ro+=d.rOil*fr*dt*free}
    else if((wet)&&T>40&&d.rWater){const fr=Math.min(1,(T-40)/55);e.rw+=d.rWater*fr*dt*free*(steam?.6:1);if(T>90)e.wetSec+=dt}
    else if(c.water>1&&d.rCold){e.rw+=d.rCold*dt*free}
    if(T>d.rawT)e.rawLeft*=Math.exp(-d.rawK*Math.min(3,(T-d.rawT)/40)*dt);
    const lf=T<60?.05:(T-50)/50;e.lost+=d.vol*lf*(lid?.3:1)*dt*(1-e.lost);
    if(d.tv&&T>=95)e.tl+=d.tv*(lid?.25:1)*(T>110?3:1)*dt*(1-e.tl);
    if(T>d.burnT)e.burn+=d.bRate*(T-d.burnT)/20*dt*(1-e.burn);
    if(d.sugar&&!wet&&T>150)e.car=Math.min(1.7,e.car+.012*(T-150)/30*dt);
    if(e.alc>0){const k=T<50?.0002:T<78?.003:(lid?.004:.03)*(T>100?1.5:1);const da=e.alc*k*dt;e.alc-=da;
      if(T>=70&&mf>0)for(const f of c.foods)f.off*=Math.exp(-60*da/mf*(lid?.5:1));}
    if(d.starch&&T>65&&c.water>0)e.gel=1;
    if(d.msg&&!wet&&T>140)e.msgDeg+=.002*dt;
  }
  c.lid=lid;
}

function drainC(c,kind,keep){
  if(kind==='water'){if(c.water>keep){const r=keep/c.water;for(const e of c.items){const d=IT[e.id];if(!d.oil){e.g*=r+(1-r)*.25}}for(const f of c.foods)f.off*=.85;c.water=keep}}
  else{if(c.oil>keep){const r=keep/c.oil;for(const e of c.items){if(IT[e.id].oil)e.g*=r; else if(e.ro>0){e.g*=r+(1-r)*.6}}c.oil=keep}}}
function liveNew(){const cs={pot:mkC('pot','炒锅'),A:mkC('A','A 碗'),B:mkC('B','B 碗'),C:mkC('C','C 盘')};
  return{cs,hist:[{t:0,T:22,w:0,o:0}],marks:[],potLog:[],t:0,steps:[],errs:[],cur:null}}
function liveRec(L){const p=L.cs.pot;L.hist.push({t:L.t,T:p.T,w:p.water,o:p.oil})}
function liveRun(L,sec,fire,mode,lid,record){const cs=L.cs;
  for(let i=0;i<sec;){const dt=fire===0&&i>=120&&sec-i>=30?30:1;tick(cs.pot,fire,mode,lid,dt);for(const k of['A','B','C'])tick(cs[k],0,'wok',0,dt);
    const pl={fire,mode,lid,T:cs.pot.T,wet:cs.pot.water>Math.max(4,.1*foodMass(cs.pot)),oil:cs.pot.oil,food:cs.pot.foods.length,items:cs.pot.items.some(e=>!IT[e.id].oil)};
    for(let j=0;j<dt;j++){L.t++;L.potLog.push(pl);if(L.t%3===0)liveRec(L)}i+=dt}
  if(record&&sec>0){const t=fire>0?'heat':'rest';const c=L.cur;
    if(c&&c.t===t&&(t==='rest'||(c.f===fire&&(c.m||'wok')===mode))&&!!c.lid===!!lid)c.s+=sec;
    else{const s={t,s:sec};if(t==='heat'){s.f=fire;if(mode!=='wok')s.m=mode}if(lid)s.lid=1;L.marks.push({t:L.t-sec,i:L.steps.length});L.steps.push(s);L.cur=s}}}
function liveApply(L,s,record){const cs=L.cs;
  if(record){L.marks.push({t:L.t,i:L.steps.length});L.steps.push(s);L.cur=null}
  if(s.t==='add'){if(!IT[s.id]&&!FD[s.id]){L.errs.push(L.steps.length-1);return}const c=cs[s.c||'pot'];addTo(c,s.id,+s.g||0,s.cut,s.prep);c.maxT=Math.max(c.maxT,c.T);liveRec(L)}
  else if(s.t==='heat'){const sec=Math.round(+s.s||0);
    if(s.u){const p=cs.pot;let i=0;const done=()=>s.u==='boil'?(p.T>=99.5&&p.water>3):s.u==='temp'?p.T>=(+s.v||160):s.u==='reduce'?p.water<=Math.max(15,.15*foodMass(p)):true;
      while(i<sec&&!done()){liveRun(L,1,+s.f||2,s.m||'wok',s.lid?1:0,false);i++}s._ran=i}
    else liveRun(L,sec,+s.f||2,s.m||'wok',s.lid?1:0,false)}
  else if(s.t==='remove'){const c=cs[s.c||'pot'];c.items=c.items.filter(e=>e.id!==s.id);liveRec(L)}
  else if(s.t==='rest')liveRun(L,Math.round(+s.s||0),0,'wok',s.lid?1:0,false);
  else if(s.t==='pour'){if(s.from!==(s.to||'pot'))moveAll(cs[s.from],cs[s.to||'pot'],s.what||'all');liveRec(L)}
  else if(s.t==='drain'){drainC(cs[s.c||'pot'],s.kind,+s.keep||0);liveRec(L)}}
function simulate(steps){const L=liveNew();steps.forEach((s,i)=>{L.marks.push({t:L.t,i});liveApply(L,s,false)});L.marks.push({t:L.t,i:steps.length});L.steps=steps;return L}
function zero(){const o={};for(const k of ALLD)o[k]=0;return o}
function disp(x){return x<=0?0:10*(1-Math.exp(-x/6.5))}

function evaluate(sim,final,eat){
  const c=sim.cs[final]||sim.cs.pot;
  const S=zero(),Fo=zero(),src={};for(const k of ALLD)src[k]=[];
  const addS=(k,v,name)=>{if(!v)return;S[k]+=v;src[k].push([name,v,'s'])};
  const addF=(k,v,name)=>{if(!v)return;Fo[k]+=v;src[k].push([name,v,'f'])};
  let starchG=0,anyGel=0,ssol=0;const flags={};const col={red:0,brown:0,yellow:0};
  for(const e of c.items){const d=IT[e.id],g=e.g;
    if(!d.oil&&!d.water&&!d.whole)ssol+=g*(1-(d.wat||0));
    for(const k in d.tas){let v=g*d.tas[k];if(d.tvd&&d.tvd.includes(k))v*=1-e.tl;if(k==='umami'&&d.msg)v*=1-.4*Math.min(1,e.msgDeg);addS(k,v,d.name)}
    for(const k in d.raw)addS(k,g*d.raw[k]*e.rawLeft,d.name);
    const keep=(1-e.lost)*(1-e.burn);
    for(const k of new Set(Object.keys(d.aroO).concat(Object.keys(d.aroW)))){addS(k,g*((d.aroO[k]||0)*e.ro+(d.aroW[k]||0)*e.rw)*keep,d.name)}
    if(e.burn>.02){addS('burnt',g*d.bBurnt*e.burn,d.name+'(焦)');addS('bitter',g*d.bBit*e.burn,d.name+'(焦)')}
    if(d.sugar){const sg=g*d.sugar;addS('roast',sg*.2*Math.min(1,e.car),d.name+'(焦糖)');const sb=Math.max(0,(e.car-1)/.6);if(sb>0){addS('burnt',sg*.3*sb,d.name+'(炒过头)');addS('bitter',sg*.25*sb,d.name+'(炒过头)');addS('sweet',-sg*.3*.5*sb,d.name)}col.brown+=sg*Math.min(1,e.car)*.6}
    if(d.okMin){const over=clamp((e.wetSec/60-d.okMin)/d.okMin,0,2);if(over>0)addS('bitter',g*d.ob*over,d.name+'(久煮)')}
    if(e.alc>0)addS('booze',e.alc*3,d.name);
    if(d.starch){starchG+=g*d.starch;if(e.gel)anyGel=1}
    if(d.col){col.red+=(d.col.red||0)*g*(d.oil?1:Math.min(1,e.ro+e.rw*.5+(d.tas.spicy?.3:0)));col.brown+=(d.col.brown||0)*g;col.yellow+=(d.col.yellow||0)*g}
    if(d.hula&&e.ro>.25&&e.burn<.35)flags.hula=1;
    if(e.id==='pj')flags.pj=1;if(d.zr)flags.zr=1;if(d.curry)flags.curry=1;if(e.id==='zmj')flags.zmj=1;if(e.id==='db'&&e.ro>.3)flags.db=1;if(e.id==='cp')flags.cp=1;
    if(e.id==='suan'&&e.rawLeft>.6)flags.rawGarlic=(flags.rawGarlic||0)+g*e.rawLeft;
    if(e.id==='tmj'||e.id==='hdj')flags.jiang=1;if(e.id==='hyou'||(e.id==='ljm'&&e.ro>.3))flags.hongyou=1;
  }
  addS('rich',c.oil*.03,'锅中油脂');
  let mf=0,hasFish=0,absW=0;const tex=[];
  for(const f of c.foods){const d=FD[f.id],g=f.g,m=Math.max(0,g-f.wl+f.oa);mf+=m;absW+=f.abs*m;if(d.fish)hasFish=1;
    const dn=Math.min(1,f.done);
    addF('umami',.7*g*d.umami*(.4+.6*dn)*(1+.4*Math.min(1,f.brown)),d.name);
    addF('sweet',g*d.sweet*(.6+.4*dn),d.name);addF('sour',g*d.sour*dn,d.name);
    addF('fresh',g*d.fresh*(1-.7*dn),d.name);if(d.salt)addF('salt',g*d.salt,d.name);if(d.bitter)addF('bitter',g*d.bitter*(.5+.5*dn),d.name);addF('spicy',g*d.spicy,d.name);
    addF('off',g*d.off*f.off*(dn<.6?1.3:1),d.name);
    addF('rich',g*d.fat*.06*(1-.5*f.fr/(g*d.fat+.01))+(d.coll?g*.006*Math.min(1.5,f.tender):0)+f.oa*.05,d.name);
    addF('roast',g*.025*Math.min(1.3,f.brown),d.name+'(焦化)');
    if(f.burnt>.05){addF('burnt',g*.04*f.burnt,d.name+'(焦糊)');addF('bitter',g*.02*f.burnt,d.name+'(焦糊)')}
    col.brown+=g*.004*Math.min(1.3,f.brown);
    tex.push(texture(f,d));
  }
  let cling=0;if(anyGel&&c.water>3)cling=Math.min(1,starchG/(c.water*.04+1));
  addS('rich',cling*starchG*.25,'勾芡');
  const water=c.water,oil=c.oil;let sSc,fSc;
  if(eat==='drain'){const M2=Math.max(60,mf+water+ssol);const a=mf>0?absW/mf:0;sSc=500/M2*(a*.85+.2+.15*cling);fSc=500/Math.max(60,mf)}
  else{const M=Math.max(60,mf+water+.35*oil+ssol);sSc=500/M*(1+.15*cling);fSc=500/M}
  const x=zero();for(const k of ALLD)x[k]=S[k]*sSc+Fo[k]*fSc;
  for(const k of ALLD)for(const r of src[k])r[1]*=r[2]==='s'?sSc:fSc;
  // 感知交互
  x.umami*=.45+.55*Math.min(1,x.salt/3);
  x.salt*=1+.06*Math.min(1,x.umami/6)+.06*Math.min(1,x.sour/5);
  const s0=x.sweet,a0=x.sour;x.sour=a0*(1-.3*Math.min(1,s0/8));x.sweet=s0*(1-.2*Math.min(1,a0/8));x.bitter*=1-.35*Math.min(1,s0/8);
  x.spicy*=(1+.15*Math.min(1,x.numb/5))*(1-.12*Math.min(1,x.rich/8));
  x.umami*=1-.25*Math.min(1,x.spicy/10);
  const mask=x.spice+.5*x.pungent+.4*x.wok+.3*x.spicy+.3*x.ferment+.2*x.roast+.3*x.numb;
  x.off*=Math.exp(-mask/12);if(hasFish)x.off*=Math.exp(-x.sour/10);
  const D={};for(const k of ALLD)D[k]=+disp(Math.max(0,x[k])).toFixed(2);
  for(const k of ALLD)src[k].sort((a,b)=>b[1]-a[1]);
  const M=Math.max(60,mf+water+.35*oil+ssol);
  const color=colorOf(col,M);
  const sauce=water<5?(oil>40?'油润':'干香'):water<0.15*mf?(cling>.3?'亮芡裹汁':'少量汤汁'):water<0.6*mf?(cling>.3?'浓汁':'有汤汁'):'汤菜';
  return{D,x,src,tex,mf,water,oil,cling,sauce,color,flags,c,absAvg:mf?absW/mf:0};
}
function colorOf(col,M){const r=col.red*500/M,b=col.brown*500/M,y=col.yellow*500/M;
  let name,hex;if(b>32){name='酱黑';hex='#3b2214'}else if(r>8&&b>4){name='红亮酱色';hex='#8e2a17'}else if(r>8){name='红亮';hex='#c8321e'}else if(b>6){name='酱红';hex='#7a3f1d'}else if(r>3){name='微红';hex='#d9683f'}else if(y>8){name='金黄';hex='#d9a321'}else if(b>2.5){name='浅酱/金黄';hex='#b9803c'}else{name='本色清爽';hex='#e8dcc0'}return{name,hex,r,b}}
function texture(f,d){const dn=f.done;let lab;
  if(dn<.6)lab=d.mustCook?'生':'生脆';else if(dn<.97)lab=d.mustCook?'未熟透':'七八成熟';
  else if(d.fat>=.2&&f.sf<1.2&&!(d.coll&&f.tender<.15&&f.over<1)){lab=f.brown>.6?'起灯盏窝·干香':f.over<2?'软嫩':'干香'}
  else if(d.coll&&(f.sf>=1.2||(d.coll>=40&&f.sf>=.8))){const need=f.sf<.6?.25:1;const t=f.tender/need;lab=t<.4?'硬韧嚼不动':t<1?'偏韧':t<1.8?'软糯':'酥烂脱骨'}
  else if(d.lean||d.coll){const o=d.coll?f.over/2:f.over;lab=o<1?'滑嫩':o<3?'刚好':o<6?'偏老':(d.fish?'老散':'柴老')}
  else if(false){lab=f.over<.6?'滑嫩':f.over<1.6?'刚好':f.over<3?'偏老':(d.fish?'老散':'柴老')}
  else if(d.tofu)lab=f.over<6?'嫩滑':'起孔入味';
  else if(d.leaf)lab=f.over<1?'脆嫩':f.over<3?'软':'黄软';
  else if(d.soft)lab=f.over<1?'断生':f.over<3?'软':'软烂入味';
  else if(d.bean)lab=f.over<2?'脆嫩':'皱皮软香';
  else if(d.starchy)lab=f.sf<.5?(f.over<1?'爽脆':f.over<2.5?'软':'软塌'):(f.over<2?'断生':'软糯起沙');
  else lab=f.over<1.2?'爽脆':f.over<3?'软':'软烂';
  let surf='';if(f.burnt>.3)surf='焦糊';else if(f.brown>1)surf=d.leaf||d.cat==='蔬菜'?'虎皮焦边':'金黄焦香';else if(f.brown>.4)surf='微焦';
  return{id:f.id,name:FD[f.id].name,cut:f.cut,lab,surf,done:dn,over:f.over,tender:f.tender,abs:f.abs,off:f.off,brown:f.brown,burnt:f.burnt,coated:f.coated,must:d.mustCook,bean:d.bean,cat:d.cat}}

function flavorTypes(D,fl){const L=[];const g=k=>D[k];
  if(fl.hula&&g('sweet')>2&&g('sour')>1.8&&g('spicy')>1.5)L.push(['煳辣荔枝味','宫保系：煳辣香+小荔枝（甜酸近）']);
  if(fl.pj&&g('sweet')>2&&g('sour')>2&&g('wok')>2)L.push(['鱼香味','泡椒+葱姜蒜+糖醋，咸甜酸辣兼备']);
  if(g('numb')>3&&g('spicy')>3.5)L.push(['麻辣味','花椒的麻与辣椒的辣叠加']);
  if(g('sweet')>2.5&&g('sour')>2.5&&g('salt')>2&&g('spicy')>2.5&&g('numb')>2.5&&fl.zmj)L.push(['怪味','咸甜麻辣酸鲜香七味调和']);
  if(fl.db&&g('spicy')>2.5&&g('ferment')>3&&g('numb')<3.5)L.push(['家常味','郫县豆瓣炒香为底，咸鲜微辣']);
  if(fl.hongyou&&g('spicy')>3&&g('sweet')>1)L.push(['红油味','红油的香辣+咸甜']);
  if(!fl.pj&&!fl.hula&&g('sweet')>4.5&&g('sour')>3.5&&g('spicy')<2)L.push(['糖醋味','甜酸为主，咸味托底']);
  else if(!fl.pj&&!fl.hula&&g('sweet')>2.5&&g('sour')>2.2&&g('spicy')<2)L.push(['荔枝味','酸甜接近，入口酸后回甜']);
  if(g('sour')>3&&g('spicy')>3&&g('sweet')<2.5)L.push(['酸辣味','醋酸与辣椒辣并重']);
  if(g('numb')>3&&g('fresh')>2.5&&g('spicy')<2.5)L.push(['椒麻/藤椒味','花椒麻+葱或青花椒清香']);
  if(g('spicy')>4&&g('roast')>3&&g('numb')<3&&!fl.hula)L.push(['香辣味','辣香与焦香']);
  if(fl.hula&&g('numb')>2.5&&g('spicy')>3&&g('sweet')<2)L.push(['煳辣味','干辣椒花椒炝出的煳香']);
  if(fl.zr&&g('spice')>3)L.push(['孜然味','西北风味，孜然遇热油爆香']);
  if(fl.curry)L.push(['咖喱味','咖喱香料复合']);
  if(fl.jiang&&g('ferment')>4.5&&g('sweet')>2)L.push(['酱香味','甜面酱/黄酱炒香']);
  if(fl.cp&&g('fresh')>2)L.push(['陈皮味','陈皮甘香']);
  if(g('salt')>3&&g('sweet')>3&&g('roast')>1.2&&g('ferment')>2&&g('spicy')<2&&g('sour')<2.5)L.push(['咸甜味(红烧)','酱油糖色，咸中带甜']);
  if(g('spice')>4.5&&!fl.zr&&!fl.curry)L.push(['五香/卤香味','八角桂皮等香料长时间煮出']);
  if(fl.rawGarlic>8&&g('pungent')>3.5)L.push(['蒜泥味','生蒜辛香']);
  if(g('wok')>4&&g('spicy')<2.5&&g('sweet')<3&&g('sour')<2)L.push(['葱姜蒜香(爆炒)','镬气足，咸鲜为主']);
  if(!L.length){if(g('salt')>2.5&&g('umami')>2.5)L.push(['咸鲜味','以盐、酱油、鲜味为主，突出本味']);else if(g('salt')<2)L.push(['清淡','调味很轻']);else L.push(['复合味','不属于典型味型'])}
  return L.slice(0,3)}

function detectMethods(sim){const L=[];const log=sim.potLog;let seg=null;
  const lab=p=>{if(p.fire===0)return null;if(p.mode==='steam')return'蒸';if(p.mode==='bake')return'烤';
    if(!p.food){if(p.wet)return'熬汤/煮汁';return p.items&&p.T>100?'炝锅/炒料':null}
    if(p.wet)return p.lid?'焖/炖':'烧/煮';if(p.oil>250&&p.T>140)return'炸';if(p.T>150)return'大火爆炒';if(p.T>115)return'煸炒';return'中低温炒'};
  for(const p of log){const l=lab(p);if(!l)continue;if(seg&&seg.l===l)seg.n++;else{seg={l,n:1};L.push(seg)}}
  const out=[];for(const s of L){if(s.n<8)continue;let nm=s.l;if(nm==='烧/煮'&&s.n>900)nm='长时间烧煮';if(nm==='焖/炖'&&s.n>1500)nm='慢炖';
    if(out.length&&out[out.length-1].l===nm)out[out.length-1].n+=s.n;else out.push({l:nm,n:s.n})}
  for(const k of['A','B','C'])if(sim.cs[k].sizzled)out.push({l:'泼油',n:0});
  const last=log[log.length-1];if(out.length&&last&&!last.wet&&out.some(o=>/烧|炖|焖/.test(o.l)))out.push({l:'收汁',n:0});
  return out;}

function warnings(sim,ev){const W=[];const add=(lv,t)=>W.push([lv,t]);const c=ev.c;const D=ev.D;
  const allItems=[];for(const k in sim.cs)for(const e of sim.cs[k].items)allItems.push(e);
  for(const e of c.items){const d=IT[e.id];
    if(e.burn>.25)add(2,`${d.name}炒糊了（焦化 ${Math.round(e.burn*100)}%）：锅温超过 ${d.burnT}°C。可降火或晚点下。`);
    if(d.sugar&&e.car>1.15)add(2,`${d.name}焦化过度发苦：糖在干锅里超过 190°C 会由焦香变苦。`);
    if(d.okMin&&e.wetSec/60>d.okMin*1.3)add(e.wetSec/60>d.okMin*2?1:0,`${d.name}煮了 ${Math.round(e.wetSec/60)} 分钟，超过约 ${d.okMin} 分钟会出苦涩味，宜中途捞出。`);
    if(d.tv&&e.tl>.4)add(1,`${d.name}久煮挥发了约 ${Math.round(e.tl*100)}% 的酸味，想要酸感明显可在出锅前再淋。`);
    if(e.id==='xyou'&&e.rawLeft<.5)add(1,'香油受热太久，芝麻香散失大半，应出锅前淋。');
    if((e.id==='xcai'||e.id==='cong')&&e.rawLeft<.3&&e.ro<.2&&e.rw<.3)add(0,`${d.name}的清香在高温里散了，想留香可出锅前撒。`);
    if(e.id==='db'&&e.rw>e.ro&&e.rw>.15)add(1,'豆瓣酱没用油炒就进了汤，酱香和红油出不来，带生酱味。先中小火炒 1–2 分钟出红油。');
    if((e.id==='hj'||e.id==='gla'||e.id==='zr')&&e.ro+e.rw<.25&&e.g>1)add(1,`${d.name}的味没出来（释放 ${Math.round((e.ro+e.rw)*100)}%）：需要热油煸或长时间煮。`);
    if(e.id==='cy'&&e.rawLeft>.6&&e.g>10)add(1,'菜籽油没烧熟（未到 150°C 以上），会有生油味。');
    if(d.msg&&e.msgDeg>.3)add(0,'味精在干锅高温下久炒会部分分解，出锅前放更鲜。');
    if(e.id==='xs'&&e.g>2)add(1,'小苏打放多了会发涩有碱味。');
  }
  if(D.booze>2)add(1,'酒气没挥发：料酒要在热锅中烹入，或开盖煮一会儿。');
  if(D.off>3.5)add(2,`腥膻味明显（${D.off.toFixed(1)}）：可焯水、热锅烹料酒、多放姜葱或香料、炖时先开盖。`);else if(D.off>2)add(1,`有些许腥膻（${D.off.toFixed(1)}）。`);
  if(D.burnt>3)add(2,'整体有明显糊味。');
  for(const t of ev.tex){
    if(t.must&&t.done<.97)add(2,`${t.name}没熟（熟度 ${Math.round(t.done*100)}%）${t.bean?'：四季豆不熟透含皂素和凝集素，可能引起中毒！':'，需延长加热。'}`);
    if(t.lab==='柴老'||t.lab==='老散')add(1,`${t.name}${t.lab}：加热过度${t.coated?'':'；下锅前上浆（淀粉/蛋清）能护嫩'}。`);
    if(t.lab==='偏老')add(0,`${t.name}略老，可缩短时间或提高火力快炒。`);
    if(t.lab.startsWith('硬韧'))add(1,`${t.name}炖得不够，胶原还没软化（软化度 ${Math.round(t.tender*100)}%），需要小火加盖长时间炖。`);
    if(t.surf==='焦糊')add(2,`${t.name}表面焦糊了。`);
  }
  const salt=D.salt;if(ev.mf<=50){}else if(salt>8)add(2,`太咸了（咸度 ${salt.toFixed(1)}）。`);else if(salt>6.8)add(1,`偏咸（${salt.toFixed(1)}）。`);else if(salt<2.5&&D.sweet<4)add(1,`偏淡（咸度 ${salt.toFixed(1)}）。`);
  if(D.bitter>3)add(1,`苦味突出（${D.bitter.toFixed(1)}），查看哪种调料糊了或久煮。`);
  // 炒菜出水
  const pl=sim.potLog;let wetStir=0,dryHot=0;for(const p of pl){if(p.fire>0&&p.mode==='wok'&&p.food&&!p.lid){if(p.wet&&p.T>=99)wetStir++;if(!p.wet&&p.T>150)dryHot++}}
  if(dryHot<30&&wetStir>90&&wetStir<500&&pl.length<900)add(0,'这是在"煮"而不是"炒"：火力小或一次下料太多，食材出水降温，镬气不足。');
  if(ev.mf>0&&D.spicy<1&&c.items.some(e=>e.id==='gla'&&e.g>3)&&ev.oil<5)add(0,'辣椒素是脂溶性的，油太少辣香出不来。');
  const seen=new Set();return W.filter(w=>!seen.has(w[1])&&seen.add(w[1]));}

const WT={salt:1.5,sweet:1.2,sour:1.2,umami:.8,spicy:1.2,numb:1.2,pungent:.6,wok:.8,roast:.7,ferment:.8,spice:.8,fresh:.5,bitter:.8,rich:.5,off:.8,burnt:1,booze:.6};
const FIX={salt:['盐/生抽','少放盐或生抽'],sweet:['糖','糖'],sour:['醋（出锅前淋）','醋，或早点下醋让它挥发'],umami:['蚝油/味精，并保证咸度','鲜味料'],spicy:['干辣椒/豆瓣/小米辣','辣椒'],numb:['花椒','花椒'],pungent:['生蒜/姜/胡椒','生蒜生姜，或让它们多加热'],wok:['葱姜蒜用热油煸香','葱姜蒜'],roast:['提高火力煎香/炒糖色','焦香：降火或缩短干煸'],ferment:['豆瓣/甜面酱/生抽并炒香','酱料'],spice:['八角桂皮等香料，或延长炖煮','香料'],fresh:['出锅撒葱花香菜/青花椒','清香料'],bitter:['','苦味：检查是否糊了或香料久煮'],rich:['油/勾芡/延长炖煮','油量']};
function compare(D,T){let s=0,w=0;const diffs=[];for(const k in WT){const d=(D[k]||0)-(T[k]||0);s+=WT[k]*d*d;w+=WT[k];if(Math.abs(d)>.8)diffs.push([k,d])}
  const rms=Math.sqrt(s/w);diffs.sort((a,b)=>Math.abs(b[1])*WT[b[0]]-Math.abs(a[1])*WT[a[0]]);return{score:Math.round(clamp(100*(1-rms/4.5),0,100)),diffs:diffs.slice(0,4),rms}}

if(typeof module!=='undefined')module.exports={texture,foodMass,liveNew,liveRun,liveApply,S,CATS,FCATS,IT,FD,DIMS,NEG,simulate,evaluate,warnings,flavorTypes,detectMethods,compare,CUTS};
