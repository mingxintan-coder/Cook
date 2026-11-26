// ===== 经典菜预设（标准做法即该菜的目标味道） =====
const a=(c,id,g,cut,prep)=>{const s={t:'add',c,id,g};if(cut)s.cut=cut;if(prep)s.prep=prep;return s};
const h=(f,s,lid,m)=>{const o={t:'heat',f,s};if(lid)o.lid=1;if(m)o.m=m;return o};
const r=(s)=>({t:'rest',s});
const p=(from,to,what)=>({t:'pour',from,to:to||'pot',what:what||'all'});
const dr=(c,kind,keep)=>({t:'drain',c,kind,keep});
const DISHES=[
{id:'gbjd',name:'宫保鸡丁',cz:'川菜',eat:'all',fin:'pot',desc:'煳辣荔枝味：干辣椒花椒炸至棕红，碗汁糖醋比例近 1:1。',steps:[
 a('A','jt',300,'丁'),a('A','salt',1.5),a('A','ls',5),a('A','lj',5),a('A','dian',5),
 a('B','bt',14),a('B','xc',15),a('B','ls',10),a('B','salt',.5),a('B','dian',4),a('B','qs',30),r(600),
 a('pot','cy',35),h(3,35),a('pot','gla',8),a('pot','hj',2),h(1,25),p('A'),h(3,70),
 a('pot','cong',30,'段'),a('pot','jiang',6),a('pot','suan',10),h(3,25),p('B'),h(3,20),a('pot','hs',40)]},
{id:'yxrs',name:'鱼香肉丝',cz:'川菜',eat:'all',fin:'pot',desc:'鱼香味：泡椒、葱姜蒜、糖醋，无鱼而有鱼香。',steps:[
 a('A','lji',250,'丝'),a('A','salt',1.5),a('A','lj',5),a('A','dian',6),
 a('B','bt',15),a('B','xc',16),a('B','ls',10),a('B','dian',3),a('B','qs',30),r(600),
 a('pot','cy',40),h(3,40),p('A'),h(3,45),a('pot','pj',25),h(2,30),a('pot','jiang',8),a('pot','suan',12),h(2,20),
 a('pot','mr',60,'丝'),a('pot','hlb',60,'丝'),h(3,60),p('B'),h(3,20),a('pot','cong',15)]},
{id:'mpdf',name:'麻婆豆腐',cz:'川菜',eat:'all',fin:'pot',desc:'麻辣烫嫩酥香：豆瓣炒出红油，三次勾芡，出锅撒花椒面。',steps:[
 a('C','dfu',400,'块','blanch'),a('pot','cy',45),h(2,40),a('pot','rm',80,'末'),h(3,70),a('pot','db',25),h(1,90),
 a('pot','ds',6),a('pot','ljm',4),a('pot','jiang',5),a('pot','suan',8),h(1,30),a('pot','gt',200),p('C'),h(3,60),
 a('pot','ls',5),a('pot','bt',2),h(2,240),a('pot','dian',8),h(2,40),a('pot','sm',30),h(2,15),a('pot','hjm',2)]},
{id:'hgr',name:'回锅肉',cz:'川菜',eat:'all',fin:'pot',desc:'家常味：煮熟的五花片煸成灯盏窝，豆瓣甜面酱炒香。',steps:[
 a('pot','wh',300,'片','preboil'),a('pot','cy',10),h(2,180),a('pot','db',15),h(1,60),a('pot','tmj',8),a('pot','ds',4),h(1,20),
 a('pot','bt',3),a('pot','ls',3),a('pot','sm',120),h(3,60)]},
{id:'hsr',name:'红烧肉',cz:'本帮/湘',eat:'all',fin:'pot',desc:'炒糖色上色，加热水小火慢炖一小时，大火收汁。',steps:[
 a('C','wh',500,'块','blanch'),a('pot','cy',10),a('pot','bingt',25),h(1,210),p('C'),h(2,90),
 a('pot','lj',20),h(3,20),a('pot','ls',20),a('pot','lc',8),a('pot','jiang',12),a('pot','cong',20,'段'),a('pot','bj',4),a('pot','gp',3),a('pot','xy',.6),
 a('pot','rs',450),h(3,120),h(1,3600,1),h(3,330)]},
{id:'tcpg',name:'糖醋排骨',cz:'江浙',eat:'all',fin:'pot',desc:'排骨焯水煎香，糖醋酱油焖软后大火收汁。',steps:[
 a('pot','pg',500,'块','blanch'),a('pot','hsy',25),h(2,240),a('pot','lj',15),a('pot','jiang',8),h(3,15),
 a('pot','ls',15),a('pot','lc',3),a('pot','bt',40),a('pot','xc',30),a('pot','rs',400),h(3,120),h(1,2400,1),a('pot','xc',10),h(3,420),a('pot','zm',4)]},
{id:'szy',name:'水煮鱼',cz:'川菜',eat:'drain',fin:'C',desc:'豆瓣炒香熬汤，鱼片上浆氽熟，最后泼滚油激出辣椒花椒香。',steps:[
 a('A','yu',400,'片'),a('A','salt',3),a('A','lj',10),a('A','jdq',15),a('A','dian',8),r(900),
 a('pot','cy',40),h(2,30),a('pot','db',35),h(1,90),a('pot','jiang',10),a('pot','suan',10),a('pot','gla',4),h(1,20),a('pot','gt',800),h(3,240),
 a('pot','qcai',200),h(3,60),p('A'),h(3,60),a('pot','salt',3),p('pot','C'),
 a('C','ljm',8),a('C','hjm',2),a('C','suan',12),a('C','gla',8),a('C','hj',4),a('pot','cy',80),h(3,60),p('pot','C')]},
{id:'lzj',name:'辣子鸡',cz:'川渝',eat:'all',fin:'pot',desc:'鸡丁炸干，大量干辣椒花椒炒出煳辣香，在辣椒里找鸡。',steps:[
 a('A','jt',400,'丁'),a('A','salt',3),a('A','lj',10),a('A','ls',5),a('A','jiang',5),r(900),
 a('pot','cy',600),h(3,120),p('A'),h(3,240),dr('pot','oil',50),h(2,10),a('pot','gla',40),a('pot','hj',10),a('pot','jiang',8),a('pot','suan',12),h(2,60),
 a('pot','bt',3),a('pot','jj',2),a('pot','zm',6),a('pot','cong',10),h(3,15)]},
{id:'fqcd',name:'番茄炒蛋',cz:'家常',eat:'all',fin:'pot',desc:'蛋先炒至凝固盛出，番茄炒出汁，糖盐调和回锅。',steps:[
 a('A','jd',200,'液'),a('A','salt',1),a('pot','hsy',35),h(3,30),p('A'),h(3,35),p('pot','C','foods'),
 a('pot','hsy',10),h(3,10),a('pot','fq',300,'块'),h(3,140),a('pot','bt',8),a('pot','salt',2.5),p('C'),h(2,30),a('pot','cong',8)]},
{id:'qzly',name:'清蒸鲈鱼',cz:'粤菜',eat:'all',fin:'C',desc:'姜葱料酒腌后大火蒸 8 分钟，倒掉蒸汁，淋豉油泼热油。',steps:[
 a('pot','yu',500,'整条'),a('pot','jiang',12),a('pot','cong',15,'段'),a('pot','lj',10),r(300),h(3,480,0,'steam'),dr('pot','water',0),
 p('pot','C'),a('C','ls',20),a('C','bt',3),a('C','cong',15),a('pot','hsy',25),h(3,60),p('pot','C')]},
{id:'cbyr',name:'葱爆羊肉',cz:'鲁/京',eat:'all',fin:'pot',desc:'大火、热油、葱多，十几秒一个阶段，烹醋压膻。',steps:[
 a('A','yr',300,'片'),a('A','ls',10),a('A','lj',8),a('A','bhj',1),a('A','dian',4),r(600),
 a('pot','hsy',35),h(3,45),p('A'),h(3,40),a('pot','cong',150,'段'),h(3,35),a('pot','xc',4),a('pot','salt',1),h(3,8),a('pot','xyou',4)]},
{id:'zrrp',name:'孜然羊肉',cz:'西北',eat:'all',fin:'pot',desc:'羊肉煸干出焦香，孜然辣椒面遇热油爆香。',steps:[
 a('A','yr',300,'片'),a('A','salt',2),a('A','lj',8),a('A','dian',4),r(600),
 a('pot','hsy',40),h(3,45),p('A'),h(3,120),a('pot','yc',100),h(3,40),a('pot','zr',8),a('pot','ljm',4),a('pot','salt',1.5),h(2,20),a('pot','xcai',15)]},
{id:'slts',name:'酸辣土豆丝',cz:'家常',eat:'all',fin:'pot',desc:'干辣椒花椒炝锅，大火快炒保持爽脆，沿锅边烹醋。',steps:[
 a('pot','cy',30),h(3,35),a('pot','gla',8),a('pot','hj',1.5),h(2,15),a('pot','td',400,'丝'),h(3,110),
 a('pot','bc',15),a('pot','salt',4),h(3,15),a('pot','jj',1.5),a('pot','cong',10)]},
{id:'klk',name:'可乐鸡翅',cz:'家常',eat:'all',fin:'pot',desc:'鸡翅煎至两面金黄，可乐代糖焖煮，收汁至黏稠。',steps:[
 a('pot','jc',500,'整','blanch'),a('pot','hsy',15),h(2,240),a('pot','jiang',8),a('pot','lj',10),h(3,15),
 a('pot','ls',20),a('pot','lc',5),a('pot','kl',330),h(3,90),h(2,900,1),h(3,330)]},
{id:'lnr',name:'五香卤牛肉',cz:'北方',eat:'drain',fin:'pot',desc:'牛腱焯水，十余种香料卤水小火两小时，再浸泡入味。',steps:[
 a('pot','nn',800,'大块','blanch'),a('pot','qs',2000),a('pot','ls',45),a('pot','lc',15),a('pot','bingt',20),a('pot','salt',15),a('pot','huj',30),
 a('pot','bj',6),a('pot','gp',5),a('pot','xy',1),a('pot','cg',4),a('pot','hj',3),a('pot','gla',4),a('pot','xhx',3),a('pot','dx',.4),a('pot','cp',3),a('pot','jiang',20),a('pot','cong',30,'段'),
 h(3,300),h(1,6600,1),r(3600,1)]},
{id:'gbdj',name:'干煸四季豆',cz:'川菜',eat:'all',fin:'pot',desc:'中火把四季豆煸到起虎皮、彻底熟透，再下肉末芽菜干辣椒。',steps:[
 a('pot','cy',35),h(3,30),a('pot','dou',400,'段'),h(2,420),a('pot','rm',60,'末'),h(3,60),a('pot','gla',6),a('pot','hj',2),a('pot','suan',10),h(2,25),
 a('pot','salt',3),a('pot','ls',5),a('pot','bt',2),h(3,15)]},
{id:'yxqz',name:'鱼香茄子',cz:'川菜',eat:'all',fin:'pot',desc:'茄子先煎软（会吸油），再与泡椒鱼香汁烧入味。',steps:[
 a('B','bt',15),a('B','xc',15),a('B','ls',12),a('B','dian',4),a('B','qs',60),
 a('pot','cy',50),h(3,40),a('pot','qz',400,'条'),h(2,240),p('pot','C','foods'),a('pot','cy',20),h(2,20),a('pot','pj',20),a('pot','db',8),h(1,40),a('pot','jiang',6),a('pot','suan',15),h(2,20),p('C'),p('B'),h(3,60),a('pot','cong',15)]},
{id:'jjrs',name:'京酱肉丝',cz:'京菜',eat:'all',fin:'pot',desc:'甜面酱小火炒香，肉丝滑熟裹酱，配葱丝。',steps:[
 a('A','lji',250,'丝'),a('A','salt',1),a('A','lj',5),a('A','jdq',15),a('A','dian',5),r(600),
 a('pot','hsy',40),h(3,30),p('A'),h(3,45),p('pot','C','foods'),a('pot','tmj',25),a('pot','bt',6),a('pot','qs',20),h(1,60),
 p('C'),h(2,25),a('pot','xyou',3),a('pot','cong',40)]},
{id:'scy',name:'酸菜鱼',cz:'川菜',eat:'drain',fin:'C',desc:'酸菜炒香煮出酸汤，鱼片滑入，泼油激香。',steps:[
 a('A','yu',400,'片'),a('A','salt',3),a('A','lj',10),a('A','jdq',15),a('A','dian',8),r(900),
 a('pot','zy',30),h(2,30),a('pot','jiang',10),a('pot','suan',10),a('pot','pj',20),h(2,20),a('pot','scai',200),h(3,90),a('pot','qs',800),h(3,420),
 p('A'),h(3,70),a('pot','salt',2),a('pot','bhj',1),a('pot','bc',8),
 p('pot','C'),a('C','gla',6),a('C','hj',3),a('C','suan',8),a('C','cong',10),a('pot','cy',40),h(3,70),p('pot','C')]},
];
if(typeof module!=='undefined')module.exports={DISHES};
