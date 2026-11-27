// ===== 更多食材：在基础食材上改参数 =====
function V(id,name,base,o){const b=FD[base];const c=Object.assign({},b);delete c.al;Object.assign(c,{base,lean:b.lean,coll:b.coll},o||{});F(id,name,c.cat||b.cat,c)}
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
V('gxc','香肠','huot',{fat:.3,salt:.03,sweet:.01,al:['腊肠','广式香肠']});
V('ghdou','红豆','td',{cook:14,note:'按泡发后的豆子算',cut:'整',al:['赤小豆','红小豆']});
V('glmp','冷面片','mt',{mustCook:0,cook:1,al:['烤冷面片','冷面皮']});
V('ghtc','火腿肠','huot',{fat:.15,salt:.012,sweet:.01,mustCook:0,cut:'段',al:['淀粉肠','台湾烤肠','烤肠','玉米肠']});
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
V('gmd','毛肚','fc',{coll:0,lean:1,cook:.15,fat:.02,off:.008,cut:'片',al:['牛百叶','百叶']});V('ghz','海蜇','gmd',{cat:'水产',off:.002,umami:.004,cook:.05,mustCook:0,cut:'片',al:['海蜇头','蜇头','海蜇皮','蜇皮']});
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
V('ghtg','猴头菇','xg',{cook:3});V('gyer','银耳','mr',{cook:20,mustCook:0,al:['白木耳']});V('gzs','竹荪','mr',{cook:3});V('gxg2','干香菇','xg',{umami:.04,cook:3,al:['花菇','冬菇']});
// 主食
V('gwd2','乌冬面','mt',{});V('gym2','意面','mt',{cook:8,al:['意大利面','通心粉']});V('gmx','米线','mt',{cook:1.5,al:['米粉','河粉','粿条']});
V('gkf','宽粉','ms',{cook:4,cut:'段',al:['粉条','红薯粉','土豆粉','苕粉']});V('gmt2','馒头','mfan',{mustCook:0,al:['花卷','包子']});V('gjz3','饺子','mt',{cook:5,al:['水饺','馄饨','云吞']});
V('gfbm','方便面','mt',{cook:2,al:['泡面','拉面']});V('gnt','年糕','mt',{cook:3,al:['年糕条','炒年糕']});
// 果子与其他
V('glz','栗子','td',{sweet:.015,cook:10,cut:'整',al:['板栗']});V('gpg3','苹果','fq',{sour:.003,sweet:.02,mustCook:0,al:['梨','菠萝','凤梨']});
V('gls','芦笋','qc',{cook:1,fresh:.01,al:['露笋']});V('gxch','香椿','bcai',{fresh:.03,cook:.3,al:['香椿芽']});V('gjc3','蕨菜','gbs',{cook:2,al:['蕨根']});
V('ghhc','黄花菜','gbs',{cook:3,al:['金针菜']});V('gbh','百合','ou',{sweet:.006,cook:1,al:['鲜百合']});V('glzi','莲子','ou',{cook:15,cut:'整'});
V('gxyc','西洋菜','bcai',{al:['豆瓣菜']});V('gmec','木耳菜','bcai',{al:['落葵','软浆叶']});V('gjcai','芥菜','bcai',{fresh:.012,al:['雪里蕻','雪菜']});
V('gmlh','马兰头','bcai',{fresh:.015,al:['马兰']});V('gdj','豆角丝','dou',{al:['豆角']});
V('gyg','腰果','huot',{cat:'其他',salt:0,fat:.45,umami:.004,cook:.5,cut:'整',al:['核桃','杏仁','坚果']});
