// ===== AI 设计菜：模板 + 模拟器寻优 =====
// 味型：参照经典菜的味道作目标；调料包按每 500g 食材
const STYLES={
 '咸鲜':{ref:null,D:{salt:5.4,umami:6,wok:3.5,sweet:1.5,fresh:2,ferment:2.5},kit:[['salt',3,'finish'],['ls',8,'sauce'],['hy',8,'sauce'],['cong',15,'aroma'],['jiang',6,'aroma'],['suan',8,'aroma'],['lj',8,'mar']],pre:'清炒'},
 '鱼香':{ref:'yxrs',kit:[['pj',25,'paste'],['jiang',8,'aroma'],['suan',14,'aroma'],['cong',20,'finish'],['bt',15,'sauce'],['xc',16,'sauce'],['ls',10,'sauce'],['dian',3,'sauce'],['qs',30,'sauce'],['lj',5,'mar']],pre:'鱼香'},
 '宫保':{ref:'gbjd',kit:[['gla',8,'chili'],['hj',2,'chili'],['cong',30,'aroma'],['jiang',6,'aroma'],['suan',10,'aroma'],['bt',14,'sauce'],['xc',15,'sauce'],['ls',10,'sauce'],['salt',.5,'sauce'],['dian',4,'sauce'],['qs',30,'sauce'],['hs',40,'finish'],['lj',5,'mar']],pre:'宫保'},
 '麻辣':{ref:'mpdf',kit:[['db',22,'paste'],['ljm',4,'paste'],['ds',5,'paste'],['jiang',6,'aroma'],['suan',10,'aroma'],['ls',5,'sauce'],['bt',2,'sauce'],['hjm',2.5,'finish'],['cong',10,'finish']],pre:'麻辣'},
 '家常':{ref:'hgr',kit:[['db',15,'paste'],['tmj',8,'paste'],['ds',4,'paste'],['bt',3,'sauce'],['ls',4,'sauce'],['suan',8,'aroma'],['sm',60,'finish']],pre:'家常'},
 '红烧':{ref:'hsr',kit:[['bingt',22,'caramel'],['lj',18,'wine'],['ls',18,'liquid'],['lc',7,'liquid'],['jiang',10,'liquid'],['cong',18,'liquid'],['bj',4,'spice'],['gp',3,'spice'],['xy',.6,'spice']],pre:'红烧'},
 '糖醋':{ref:'tcpg',kit:[['bt',35,'sauce'],['xc',28,'sauce'],['ls',14,'sauce'],['fqj',10,'sauce'],['dian',4,'sauce'],['qs',40,'sauce'],['jiang',6,'aroma'],['lj',10,'mar'],['zm',4,'finish']],pre:'糖醋'},
 '酸辣':{ref:'slts',kit:[['gla',8,'chili'],['hj',1.5,'chili'],['bc',15,'vinegar'],['salt',3.5,'finish'],['suan',8,'aroma'],['cong',10,'finish'],['jj',1.5,'finish']],pre:'酸辣'},
 '孜然':{ref:'zrrp',kit:[['zr',8,'paste'],['ljm',4,'paste'],['salt',3,'finish'],['yc',80,'veg'],['xcai',12,'finish'],['lj',8,'mar']],pre:'孜然'},
 '葱爆':{ref:'cbyr',kit:[['cong',150,'veg'],['ls',10,'mar'],['lj',8,'mar'],['xc',4,'vinegar'],['salt',1,'finish'],['xyou',4,'finish'],['bhj',1,'mar']],pre:'葱爆'},
 '茄汁':{ref:'fqcd',kit:[['bt',10,'finish'],['salt',3,'finish'],['cong',8,'finish']],pre:'茄汁'},
 '汤':{ref:null,D:{salt:4.3,umami:6,rich:2.5,fresh:2,pungent:.6,wok:.5,sweet:1},kit:[['salt',4,'finish'],['jiang',8,'aroma'],['cong',10,'finish'],['bhj',.8,'finish'],['xyou',3,'finish'],['lj',8,'wine']],pre:''},
 '蒜香':{ref:null,D:{salt:5.2,umami:5.5,wok:7,pungent:3,sweet:1.2,fresh:2,ferment:1.5,roast:1},kit:[['suan',35,'aroma'],['salt',3,'finish'],['hy',8,'sauce'],['ls',5,'sauce'],['cong',10,'finish']],pre:'蒜香'},
 '五香卤':{ref:'lnr',kit:[['ls',30,'liquid'],['lc',10,'liquid'],['bingt',12,'liquid'],['salt',8,'liquid'],['huj',20,'liquid'],['bj',4,'spice'],['gp',3,'spice'],['xy',.8,'spice'],['cg',3,'spice'],['hj',2,'spice'],['xhx',2,'spice'],['jiang',12,'liquid'],['cong',20,'liquid']],pre:'五香卤'},
};
const METHODS_D=['自动','快炒','红烧','炖','蒸','干煸','凉拌','汤'];
const isMeat=id=>['肉','禽','水产'].includes(FD[id].cat);
function autoMethod(foods,style){const main=foods[0];const d=FD[main.id];
  if(style==='汤')return'汤';if(style==='红烧')return'红烧';if(style==='五香卤')return'炖';
  if(d.coll>=40&&(CUTS[main.cut||d.cut]||1)>=1)return style==='咸鲜'?'炖':'红烧';
  if(d.fish&&(main.cut||d.cut).startsWith('整')&&style==='咸鲜'&&foods.length===1)return'蒸';
  if(d.bean)return'干煸';if(main.id==='hg')return'凉拌';return'快炒'}
function styleTarget(style){const s=STYLES[style];if(s.ref){const T=dishTarget(DISHES.find(d=>d.id===s.ref));return Object.assign({},T.D)}const D={};for(const [k] of DIMS.concat(NEG))D[k]=0;return Object.assign(D,s.D)}
// 按模板生成步骤
function buildSteps(spec,amt,P){const S=[];const foods=spec.foods;const mf=foods.reduce((a,f)=>a+f.g,0);const k=mf/500;
  const have=id=>!spec.missing||!spec.missing.includes(id)||['salt','hsy','cy','qs','rs'].includes(id);
  const kit=[];for(const x of STYLES[spec.style].kit){if((spec.cons&&spec.cons.noAlcohol&&ALC_IDS.includes(x[0]))||(spec.cons&&spec.cons.noSpicy&&SPICY_IDS.includes(x[0]))||(spec.cons&&spec.cons.noMSG&&MSG_IDS.includes(x[0])))continue;
    if(have(x[0])){kit.push(x);continue}const sub=(SUBS[x[0]]||[]).find(([s])=>have(s)&&!FD[s]);if(sub)kit.push([sub[0],x[1]*sub[1],x[2]])}
  const g=(id,base)=>Math.max(.3,Math.round(base*k*(amt[id]||1)*10)/10);
  const ph=p=>kit.filter(x=>x[2]===p);const add=(c,x)=>S.push({t:'add',c,id:x[0],g:g(x[0],x[1])});
  const meats=foods.filter(f=>isMeat(f.id)),vegs0=foods.filter(f=>!isMeat(f.id));let vegs=vegs0;
  const fadd=(c,f,prep)=>{let cut=f.cut||FD[f.id].cut;if(['红烧','炖','汤'].includes(spec.method)&&!f.cut&&['丝','末','液'].includes(cut)&&f.id!=='jd'&&FD[f.id].base!=='jd'&&!['rm'].includes(f.id))cut=isMeat(f.id)?'块':(FD[f.id].leaf?'段':'块');const s={t:'add',c,id:f.id,g:f.g,cut};if(prep)s.prep=prep;S.push(s)};
  const oilId=spec.cons&&spec.cons.lowOil?'hsy':(spec.style==='麻辣'||spec.style==='家常'||spec.style==='宫保'?'cy':'hsy');
  const oil=(base)=>S.push({t:'add',c:'pot',id:oilId,g:Math.round(base*Math.max(.6,Math.min(1.6,k))*(spec.cons&&spec.cons.lowOil?.6:1)*(amt._oil||1))});
  const m=spec.method;const tm=amt._t||1;if(m==='快炒'&&foods.length>1&&foods.some(f=>f.id==='jd'))vegs=vegs0.filter(f=>f.id!=='jd');
  const eggFirst=m==='快炒'&&foods.length>1&&foods.some(f=>f.id==='jd');
  if(eggFirst){const e=foods.find(f=>f.id==='jd');S.push({t:'add',c:'pot',id:oilId,g:Math.round(25*Math.max(.6,Math.min(1.4,e.g/150)))},{t:'heat',f:3,s:120,u:'temp',v:170});fadd('pot',e);S.push({t:'add',c:'pot',id:'salt',g:Math.round(e.g*.006*10)/10},{t:'heat',f:3,s:35},{t:'pour',from:'pot',to:'C',what:'foods'})}
  if(m==='快炒'||m==='干煸'){
    const lean=meats.filter(f=>FD[f.id].lean||FD[f.id].coll<40||(CUTS[f.cut||FD[f.id].cut]||1)<1);
    if(m==='快炒'&&lean.length){for(const f of lean)fadd('A',f);S.push({t:'add',c:'A',id:'salt',g:Math.round(lean.reduce((a,f)=>a+f.g,0)*.003*10)/10});for(const x of ph('mar'))add('A',x);if(have('dian'))S.push({t:'add',c:'A',id:'dian',g:Math.round(lean.reduce((a,f)=>a+f.g,0)*.02)});S.push({t:'rest',s:600})}
    const bowl=ph('sauce').some(x=>x[0]==='dian');if(bowl){for(const x of ph('sauce'))add('B',x)}
    oil(m==='干煸'?45:38);S.push({t:'heat',f:3,s:120,u:'temp',v:amt._T||(ph('chili').length?150:170)});
    if(ph('chili').length){for(const x of ph('chili'))add('pot',x);S.push({t:'heat',f:1,s:Math.round(25*tm)})}
    const others=meats.filter(f=>!lean.includes(f));
    if(m==='干煸'){for(const f of foods.filter(f=>!lean.includes(f)||m==='干煸'))if(!S.some(s=>s.t==='add'&&s.id===f.id))fadd('pot',f,FD[f.id].coll>=40?'preboil':'');S.push({t:'heat',f:2,s:Math.round(240*tm*(foods.some(f=>FD[f.id].bean)?1.6:1))})}
    else{if(lean.length){S.push({t:'pour',from:'A',to:'pot',what:'all'},{t:'heat',f:3,s:Math.round(60*tm)})}for(const f of others)fadd('pot',f,'preboil');if(others.length)S.push({t:'heat',f:2,s:Math.round(90*tm)})}
    if(ph('paste').length){for(const x of ph('paste'))add('pot',x);S.push({t:'heat',f:1,s:Math.round(40*(amt._p||1))})}
    if(ph('aroma').length){for(const x of ph('aroma'))add('pot',x);S.push({t:'heat',f:2,s:20})}
    if(m==='快炒'){for(const x of ph('veg'))add('pot',x);for(const f of vegs)fadd('pot',f);const vc=Math.max(30,...vegs.map(f=>FD[f.id].cook*60*Math.pow(CUTS[f.cut||FD[f.id].cut]||1,1.3)));if(vegs.length||ph('veg').length)S.push({t:'heat',f:3,s:Math.round(vc*.9*(amt._v||1))})}
    else for(const x of ph('veg'))add('pot',x);
    if(eggFirst)S.push({t:'pour',from:'C',to:'pot',what:'all'});
    if(bowl)S.push({t:'pour',from:'B',to:'pot',what:'all'});else for(const x of ph('sauce'))add('pot',x);
    for(const x of ph('vinegar'))add('pot',x);
    S.push({t:'heat',f:3,s:20});for(const x of ph('finish'))add('pot',x);if(ph('finish').some(x=>!['xcai','hjm','cong','zm','hs','xyou'].includes(x[0])))S.push({t:'heat',f:3,s:8})}
  else if(m==='红烧'||m==='炖'){
    for(const f of meats)fadd('C',f,'blanch');
    oil(m==='红烧'?12:20);
    if(m==='红烧'&&ph('caramel').length){for(const x of ph('caramel'))add('pot',x);S.push({t:'heat',f:1,s:210})}
    else S.push({t:'heat',f:2,s:40});
    if(meats.length)S.push({t:'pour',from:'C',to:'pot',what:'all'},{t:'heat',f:2,s:90});
    for(const x of ph('wine'))add('pot',x);if(ph('wine').length)S.push({t:'heat',f:3,s:20});
    for(const x of ph('paste'))add('pot',x);if(ph('paste').length)S.push({t:'heat',f:1,s:40});
    for(const x of ph('liquid').concat(ph('aroma')))add('pot',x);for(const x of ph('spice'))add('pot',x);
    S.push({t:'add',c:'pot',id:'rs',g:Math.round(mf*(m==='炖'?2.2:.9)*(amt._w||1))},{t:'heat',f:3,s:900,u:'boil'});
    const coll=Math.max(0,...foods.map(f=>FD[f.id].coll||0));const bt=Math.round((coll?coll*Math.sqrt(CUTS[foods[0].cut||FD[foods[0].id].cut]||1)*60*1.05:900)*tm);
    const btt=Math.min(7200,bt);const rm=ph('spice').filter(x=>['xy','gp'].includes(x[0]));
    if(rm.length&&btt>2700){S.push({t:'heat',f:1,s:2700,lid:1});for(const x of rm)S.push({t:'remove',c:'pot',id:x[0]});S.push({t:'heat',f:1,s:btt-2700,lid:1})}
    else{S.push({t:'heat',f:1,s:btt,lid:1});if(ph('spice').some(x=>x[0]==='xy'))S.push({t:'remove',c:'pot',id:'xy'})}
    for(const f of vegs){fadd('pot',f);S.push({t:'heat',f:1,s:Math.round(FD[f.id].cook*60*1.5),lid:1})}
    for(const x of ph('sauce'))add('pot',x);
    if(m==='红烧')S.push({t:'heat',f:3,s:900,u:'reduce'});else{S.push({t:'heat',f:2,s:120})}
    for(const x of ph('finish'))add('pot',x)}
  else if(m==='汤'){const tough=meats.filter(f=>FD[f.id].coll>=30);
    if(tough.length){for(const f of tough)fadd('C',f,'blanch');oil(8);for(const x of ph('aroma'))add('pot',x);S.push({t:'heat',f:2,s:20},{t:'pour',from:'C',to:'pot',what:'all'});for(const x of ph('wine'))add('pot',x);S.push({t:'heat',f:3,s:15});
      S.push({t:'add',c:'pot',id:'rs',g:Math.round(Math.max(800,mf*3)*(amt._w||1))},{t:'heat',f:3,s:1200,u:'boil'});const coll=Math.max(...tough.map(f=>FD[f.id].coll));S.push({t:'heat',f:1,s:Math.min(5400,Math.round(coll*60*1.1*tm)),lid:1});
      const rest=foods.filter(f=>!tough.includes(f));for(const f of rest.filter(f=>f.id!=='jd'))fadd('pot',f);if(rest.length)S.push({t:'heat',f:2,s:Math.round(Math.max(...rest.map(f=>FD[f.id].cook*60*Math.pow(CUTS[f.cut||FD[f.id].cut]||1,1.3)))*1.3),lid:1})}
    else{oil(10);for(const x of ph('aroma'))add('pot',x);S.push({t:'heat',f:2,s:20});const tom=foods.filter(f=>['fq','xhs'].includes(f.id)||FD[f.id].base==='fq');for(const f of tom)fadd('pot',f);if(tom.length)S.push({t:'heat',f:3,s:90});
      S.push({t:'add',c:'pot',id:'qs',g:Math.round(Math.max(600,mf*2.5)*(amt._w||1))},{t:'heat',f:3,s:900,u:'boil'});
      const rest=foods.filter(f=>!tom.includes(f)&&f.id!=='jd'&&FD[f.id].base!=='jd');const ord=rest.slice().sort((a,b)=>FD[b.id].cook-FD[a.id].cook);
      for(const f of ord){fadd('pot',f,isMeat(f.id)&&FD[f.id].off>=.005?'blanch':'');S.push({t:'heat',f:2,s:Math.round(Math.max(40,FD[f.id].cook*60*Math.pow(CUTS[f.cut||FD[f.id].cut]||1,1.3)*1.2*tm))})}
      for(const f of foods.filter(f=>f.id==='jd'||FD[f.id].base==='jd'))fadd('pot',Object.assign({},f,{cut:'液'}));if(foods.some(f=>f.id==='jd'||FD[f.id].base==='jd'))S.push({t:'heat',f:2,s:30})}
    for(const x of ph('finish'))add('pot',x);S.push({t:'heat',f:2,s:30})}
  else if(m==='蒸'){for(const f of foods)fadd('pot',f);if(have('jiang'))S.push({t:'add',c:'pot',id:'jiang',g:Math.round(10*k)});if(!(spec.cons&&spec.cons.noAlcohol)&&have('lj'))S.push({t:'add',c:'pot',id:'lj',g:Math.round(10*k)});S.push({t:'rest',s:300});
    const ct=Math.max(...foods.map(f=>FD[f.id].cook*60*Math.pow(CUTS[f.cut||FD[f.id].cut]||1,1.3)));S.push({t:'heat',f:3,s:Math.round(ct*1.1*tm),m:'steam'},{t:'drain',c:'pot',kind:'water',keep:0},{t:'pour',from:'pot',to:'C',what:'all'});
    const sk=kit.filter(x=>!['mar','aroma','paste','chili'].includes(x[2]));if(spec.style==='咸鲜'){S.push({t:'add',c:'C',id:have('zyc')?'zyc':'ls',g:g('zyc',22)});for(const x of sk.filter(x=>!['salt','ls','hy'].includes(x[0])))add('C',x)}else for(const x of sk)add('C',x);if(have('cong'))S.push({t:'add',c:'C',id:'cong',g:Math.round(15*k)});S.push({t:'add',c:'pot',id:oilId,g:Math.round(25*Math.min(1.4,k))});S.push({t:'heat',f:3,s:60},{t:'pour',from:'pot',to:'C',what:'all'})}
  else if(m==='凉拌'){for(const f of foods)fadd('pot',f,FD[f.id].mustCook||isMeat(f.id)?(isMeat(f.id)?'preboil':'blanch'):'');S.push({t:'pour',from:'pot',to:'B',what:'all'});
    for(const x of kit.filter(x=>x[2]!=='mar'))add('B',x);
    if(kit.some(x=>['chili','paste'].includes(x[2]))){oil(25);S.push({t:'heat',f:3,s:90,u:'temp',v:190},{t:'pour',from:'pot',to:'B',what:'all'})}else if(have('xyou'))S.push({t:'add',c:'B',id:'xyou',g:Math.round(5*k)});
    S.push({t:'rest',s:300})}
  return S}
function designScore(r,T,spec){const D=r.ev.D;let L=0;const W={salt:2,sweet:1.4,sour:1.4,spicy:1.4,numb:1.4,wok:.8,ferment:.9,spice:.9,fresh:.5,roast:.6,pungent:.5};
  for(const k in W){const d=(D[k]||0)-(T[k]||0);L+=W[k]*d*d}
  L+=3*Math.max(0,D.burnt-1)+2*Math.max(0,D.off-1.5)+2*Math.max(0,D.booze-1)+1.5*Math.max(0,D.bitter-2.5);
  if(D.salt<3.5)L+=4*(3.5-D.salt);if(D.salt>6.8)L+=4*(D.salt-6.8);
  const ft=flavorTypes(D,r.ev.flags).map(x=>x[0]);const want={'鱼香':'鱼香味','宫保':'煳辣荔枝味','麻辣':'麻辣味','家常':'家常味','红烧':'咸甜味(红烧)','糖醋':'糖醋味','酸辣':'酸辣味','孜然':'孜然味','五香卤':'五香/卤香味'}[spec.style];
  if(want&&!ft.slice(0,2).includes(want))L+=3;
  L+=sev(r.W)*6+r.W.filter(w=>w[0]===1).length*.6+texPen(r.ev,{meat:spec.meat,veg:spec.veg})*1.5;
  for(const t of r.ev.tex){if(t.lab==='柴老'||t.lab==='老散')L+=3;if(t.lab.startsWith('硬韧'))L+=4;if(t.lab==='偏韧')L+=2.5;
    const rawOk=spec.method==='凉拌'&&['hg','fq','qjz'].includes(t.id);if(!rawOk&&t.done<.97)L+=3*(1-t.done)*4}
  return L}
function design(spec,budgetMs){const t0=Date.now();budgetMs=budgetMs||3500;spec=Object.assign({},spec);
  if(!spec.method||spec.method==='自动')spec.method=autoMethod(spec.foods,spec.style);
  const T=designTarget(spec);
  const fin=spec.method==='蒸'?'C':spec.method==='凉拌'?'B':'pot';const eat=spec.style==='五香卤'?'drain':'all';
  let amt={};const ev=a=>{let S=buildSteps(spec,a);const r=runEval(S,fin,eat);return{S,r,L:designScore(r,T,spec)}};
  return designSearch(spec,T,fin,eat,amt,ev,t0,budgetMs)}
function designTarget(spec){const T=styleTarget(spec.style);if(spec.method==='凉拌'){if(spec.style==='蒜香'){T.pungent=5;T.wok=0;T.roast=1.5}T.wok=Math.min(T.wok,1);T.roast=Math.min(T.roast,2)}if(spec.method==='蒸')T.wok=Math.min(T.wok,1.5);if(spec.cons&&spec.cons.lowSalt)T.salt=Math.max(3.8,T.salt-1.2);if(spec.cons&&spec.cons.lowSugar)T.sweet=Math.max(0,T.sweet-2);if(spec.cons&&spec.cons.noSpicy){T.spicy=0}if(spec.pref&&typeof prefTarget==='function')prefTarget(T,spec.pref,spec.style);return T}
function designSearch(spec,T,fin,eat,amt,ev,t0,budgetMs){
  let best=ev(amt);let iter=0;const ids=[...new Set(STYLES[spec.style].kit.map(x=>x[0]).concat(['zyc']))];
  const knobs=['_t','_v','_oil','_T','_p','_w'];
  while(Date.now()-t0<budgetMs&&iter<30){iter++;let imp=null;
    const D=best.r.ev.D;const errs=['salt','sweet','sour','spicy','numb','spice','wok','ferment','pungent','fresh','roast'].map(k=>[k,(D[k]||0)-(T[k]||0)]).filter(x=>Math.abs(x[1])>.4).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
    const cand=[];for(const [k,e] of errs.slice(0,3)){const contrib={};for(const [n,v] of best.r.ev.src[k]||[]){const id=NAME2ID[n.replace(/\(.*\)$/,'')];if(id&&ids.includes(id))contrib[id]=(contrib[id]||0)+v}
      for(const id of Object.keys(contrib).sort((a,b)=>contrib[b]-contrib[a]).slice(0,2))for(const f of e<0?[1.3,1.7]:[.75,.5])cand.push(Object.assign({},amt,{[id]:Math.max(.2,Math.min(3,(amt[id]||1)*f))}))}
    for(const kk of knobs)for(const f of [.75,1.3]){const v=(amt[kk]||(kk==='_T'?0:1));if(kk==='_T'){const base=amt._T||150;cand.push(Object.assign({},amt,{_T:Math.max(130,Math.min(200,base+(f>1?15:-15)))}))}else cand.push(Object.assign({},amt,{[kk]:Math.max(.4,Math.min(2.5,v*f))}))}
    for(const a of cand){if(Date.now()-t0>budgetMs)break;const r=ev(a);if(r.L<(imp?imp.L:best.L*.99))imp=Object.assign(r,{a})}
    if(!imp)break;best=imp;amt=imp.a}
  const fx=fixCooking(best.S,fin,eat,8);const steps=fx.steps;const r=runEval(steps,fin,eat);const L=designScore(r,T,spec);
  return{spec,steps,fin,eat,r,T,L,score:Math.max(0,Math.round(100-L*3)),name:dishName(spec),notes:designNotes(spec,steps,r),ms:Date.now()-t0}}
const NAMES={'fq+jd|汤':'番茄蛋花汤','gzc+jd|汤':'紫菜蛋花汤','dfu+qcai|汤':'青菜豆腐汤','jd+qcai|汤':'青菜蛋花汤','lb+pg|汤':'萝卜排骨汤','dg+pg|汤':'冬瓜排骨汤','fq+jd|茄汁':'番茄炒蛋','jd+qjz|咸鲜':'青椒炒蛋','jc2+jd|咸鲜':'韭菜炒蛋','jd+mr|咸鲜':'木耳炒蛋','hg+jd|咸鲜':'黄瓜炒蛋','jd+xia|咸鲜':'虾仁炒蛋','lji+qjz|咸鲜':'青椒肉丝','qz+rm|鱼香':'鱼香肉末茄子','lji+mr|鱼香':'鱼香肉丝','jd+xhs|茄汁':'番茄炒蛋','dfu+rm|麻辣':'麻婆豆腐','nr+td|红烧':'土豆烧牛肉','nn+td|红烧':'土豆烧牛腩','pg|糖醋':'糖醋排骨','wh|红烧':'红烧肉','td|酸辣':'酸辣土豆丝','yr|孜然':'孜然羊肉','yr|葱爆':'葱爆羊肉','jt|宫保':'宫保鸡丁','jx|宫保':'宫保鸡丁','xia|宫保':'宫保虾球','baic|酸辣':'酸辣白菜','xlh|蒜香':'蒜蓉西兰花','qz|鱼香':'鱼香茄子','dou|家常':'干煸四季豆','dou|麻辣':'干煸四季豆'};
function dishName(spec){if(spec.style==='汤'){const key=spec.foods.map(f=>f.id).sort().join('+')+'|汤';if(NAMES[key])return NAMES[key];const fs=spec.foods.slice().sort((a,b)=>(isMeat(a.id)?1:0)-(isMeat(b.id)?1:0));return fs.map(f=>FD[f.id].name.replace(/\(.*\)|（.*）/g,'').split('/')[0]).join('')+'汤'}const key=spec.foods.map(f=>f.id).sort().join('+')+'|'+spec.style;if(NAMES[key])return NAMES[key];const rk=spec.foods.map(f=>{let x=f.id;while(FD[x].base&&FD[FD[x].base])x=FD[x].base;return x}).sort().join('+')+'|'+spec.style;if(NAMES[rk]&&spec.foods.every(f=>!FD[f.id].base))return NAMES[rk];const st=STYLES[spec.style];const fn=spec.foods.map(f=>FD[f.id].name.replace(/\(.*\)|（.*）/g,'').split('/')[0]);
  let pre=st.pre;if(spec.style==='咸鲜')pre={'快炒':'清炒','红烧':'红烧','炖':'清炖','蒸':'清蒸','干煸':'干煸','凉拌':'凉拌'}[spec.method]||'清炒';
  if(spec.method==='干煸'&&spec.style!=='咸鲜')pre='干煸';if(spec.method==='凉拌'&&spec.style!=='咸鲜')pre=pre+'拌';
  return pre+fn.join('')}
function designNotes(spec,steps,r){const N=[];const has=id=>steps.some(s=>s.t==='add'&&s.id===id);const cA=steps.some(s=>s.c==='A'&&s.t==='add'&&IT[s.id]&&IT[s.id].starch);
  if(cA)N.push('瘦肉先用盐和淀粉上浆，下锅后表面凝固锁水，口感滑嫩。');
  const tStep=steps.find(s=>s.u==='temp');if(tStep&&(has('gla')||has('hj')))N.push(`油烧到约 ${tStep.v}°C 就下干辣椒花椒，转小火炸出煳辣香，超过 170°C 容易发黑发苦。`);
  if(steps.some(s=>s.prep==='blanch'))N.push('肉先焯水，去掉血沫和腥味。');
  if(has('bingt')&&spec.method==='红烧')N.push('冰糖小火炒出糖色再下肉，颜色红亮且带焦糖香。');
  const lid=steps.filter(s=>s.t==='heat'&&s.lid).reduce((a,s)=>a+s.s,0);if(lid>600)N.push(`加盖小火炖约 ${Math.round(lid/60)} 分钟，让胶原软化到软糯。`);
  if(steps.some(s=>s.u==='reduce'))N.push('最后开盖大火收汁，汤汁变浓才挂得住。');
  if(steps.some(s=>s.c==='B'&&s.t==='add'&&s.id==='dian'))N.push('碗汁里预先调好糖醋酱油和淀粉，出锅前一次倒入，几秒钟就能裹匀，不会把菜炒老。');
  if(steps.some(s=>s.t==='remove'&&s.id==='xy'))N.push('香叶炖到一定时间就捞出，避免久煮发苦。');
  if(has('db'))N.push('豆瓣酱小火慢炒，炒出红油和酱香再加别的料。');
  if(spec.method==='蒸')N.push('蒸好倒掉腥味重的蒸汁，再淋豉油、泼热油激出葱香。');
  const t=r.ev.tex.map(x=>x.name+x.lab).join('、');if(t)N.push(`成品口感：${t}。`);
  return N}
if(typeof module!=='undefined')module.exports={designTarget,designScore,design,STYLES,METHODS_D,buildSteps};
