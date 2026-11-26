// ===== 火候校正 + 口味改良 =====
const clone=o=>JSON.parse(JSON.stringify(o));
function runEval(steps,fin,eat){const sim=simulate(steps);const ev=evaluate(sim,fin,eat);return{sim,ev,W:warnings(sim,ev)}}
// 逐步追踪：每步之后各料的焦化、食材熟度
function trace(steps){const L=liveNew();const out=[];const seen=new Map();
  steps.forEach((s,i)=>{const snap=new Map();for(const k in L.cs)for(const e of L.cs[k].items)snap.set(e,[e.burn,e.car]);const fs=new Map();for(const k in L.cs)for(const f of L.cs[k].foods)fs.set(f,[f.burnt,f.done]);
    liveApply(L,s,false);let burn=0,who=null,fb=0;
    for(const k in L.cs)for(const e of L.cs[k].items){const p=snap.get(e)||[0,0];const d=IT[e.id];const inc=(e.burn-p[0])*e.g*(d.bBurnt+d.bBit)+(d.sugar?Math.max(0,Math.min(e.car,1.7)-Math.max(1,p[1]))*e.g*d.sugar:0);if(inc>burn){burn=inc;who=d.name}}
    for(const k in L.cs)for(const f of L.cs[k].foods){const p=fs.get(f)||[0,0];fb=Math.max(fb,(f.burnt-p[0])*f.g*.04)}
    out.push({i,burn,who,fb})});
  return{L,out}}
const sev=W=>W.filter(w=>w[0]>=2).length;
function fixCooking(steps,fin,eat,max){max=max||10;let S=clone(steps);const log=[];let cur=runEval(S,fin,eat);
  for(let pass=0;pass<max;pass++){const W=cur.W.filter(w=>w[0]>=2);if(!W.length)break;let changed=false;
    // 1 焦糊：找焦化最多的加热步
    if(W.some(w=>/糊|焦化过度/.test(w[1]))){const tr=trace(S).out;let best=null;for(const o of tr){const s=S[o.i];if(s.t!=='heat'||s.m==='steam')continue;const v=o.burn+o.fb;if(v>.05&&(!best||v>best.v))best={o,v}}
      if(best){const s=S[best.o.i];
        if(s.u==='temp'){s.v=Math.max(120,(+s.v||165)-25);log.push(['火候',`第 ${best.o.i+1} 步油温降到约 ${s.v}°C，避免${best.o.who||'食材'}焦糊`])}
        else if(+s.f>1){s.f=+s.f-1;log.push(['火候',`第 ${best.o.i+1} 步火力调为${['','小火','中火','大火'][s.f]}，避免${best.o.who||'食材'}焦糊`])}
        else{const id=NAME2ID[best.o.who];let ai=-1;for(let j=best.o.i-1;j>=0;j--){if(S[j].t==='add'&&S[j].id===id&&(!S[j].c||S[j].c==='pot')){ai=j;break}}
          if(ai>=0&&IT[id]&&!IT[id].oil&&!s._mv){const [st]=S.splice(ai,1);S.splice(best.o.i,0,st);S[best.o.i-1]._mv=1;log.push(['顺序',`${best.o.who}改到这段小火之后再下，避免焦糊`])}
          else{const n=Math.max(10,Math.round(s.s*.6));log.push(['火候',`第 ${best.o.i+1} 步时间 ${s.s}秒 → ${n}秒，避免${best.o.who||'食材'}焦糊`]);s.s=n}}
        changed=true}}
    // 2 没熟：延长食材下锅后的最后一次加热
    if(!changed){const raw=cur.ev.tex.filter(t=>t.must&&t.done<.97);if(raw.length){const t=raw[0];
      let idx=-1;for(let i=S.length-1;i>=0;i--){if(S[i].t==='heat'&&S[i].m!=='steam'){idx=i;break}}
      const addIdx=S.findIndex(s=>s.t==='add'&&s.id===t.id);
      if(idx>addIdx&&idx>=0){const s=S[idx];if(s.u){delete s.u;delete s.v;s.s=Math.max(s.s,120)}const n=Math.min(5400,Math.round(s.s*1.6+60));log.push(['火候',`第 ${idx+1} 步加热 ${s.s}秒 → ${n}秒，让${t.name}熟透`]);s.s=n;changed=true}
      else{S.push({t:'heat',f:2,s:180});log.push(['火候',`最后加一段中火 3 分钟，让${t.name}熟透`]);changed=true}}}
    // 3 腥膻：焯水
    if(!changed&&W.some(w=>/腥膻/.test(w[1]))){const f=S.find(s=>s.t==='add'&&FD[s.id]&&FD[s.id].off>=.005&&!s.prep);if(f){f.prep='blanch';log.push(['做法',`${FD[f.id].name}先焯水去腥`]);changed=true}}
    if(!changed)break;const nx=runEval(S,fin,eat);if(sev(nx.W)>sev(cur.W)+1)break;cur=nx}
  S=tidy(S);cur=runEval(S,fin,eat);return{steps:S,log,cur}}
// 合并连续同条件加热、去掉过短加热、整理用量
function tidy(S){const out=[];for(const s0 of S){const s=Object.assign({},s0);delete s._mv;delete s._ran;delete s._carry;
    if(s.t==='add'){s.g=s.g>=20?Math.round(s.g):s.g>=5?Math.round(s.g*2)/2:Math.round(s.g*10)/10;if(!(s.g>0))continue}
    const p=out[out.length-1];
    if(s.t==='heat'&&!s.u&&p&&p.t==='heat'&&!p.u&&+p.f===+s.f&&!!p.lid===!!s.lid&&(p.m||'wok')===(s.m||'wok')){p.s+=s.s;continue}
    if(s.t==='heat'&&!s.u&&s.s<4)continue;out.push(s)}return out}

// ---------- 口味改良 ----------
const NAME2ID={};for(const id in IT)NAME2ID[IT[id].name]=id;for(const id in FD)NAME2ID[FD[id].name]=id;
const SPICY_IDS=['gla','xmj','ljm','hyou','pj','dj','hslj','hgdl','db'];
const ALC_IDS=['lj','huj','baij','pij','lz','ml','qj'];
const MSG_IDS=['wj','jj','nrf'];
const FLAVOR_OILS=['xyou','hjy','tjy','hyou','cyou','lyou'];
const SUBS={xc:[['cc',.8],['bc',.9],['mc',.5]],cc:[['xc',1.2],['bc',1]],bc:[['mc',.6],['xc',1.1]],mc:[['bc',1.7],['xc',2]],ls:[['lxl',1],['zyc',1.2]],lc:[['ls',1]],lj:[['huj',1],['baij',.25]],huj:[['lj',1]],
  cy:[['hsy',1],['zy',1]],hsy:[['cy',1],['zy',1]],zy:[['hsy',1]],bingt:[['bt',1.1]],bt:[['bingt',.9],['fm',1.1]],db:[['dj',1],['hslj',1]],hj:[['hjm',.7],['qhj',1]],hjm:[['hj',1.4]],gla:[['ljm',.6],['xmj',.8]],ljm:[['gla',1.5]],
  bj:[['wxf',.5],['ssx',.5]],gp:[['wxf',.6]],wj:[['jj',1.8],['hy',4]],jj:[['wj',.6],['hy',2.5]],hy:[['lxl',.8],['ls',.8]],dian:[['mf',1.3]],tmj:[['hdj',.9]],hdj:[['tmj',1],['db',.7]],xcai:[['cong',1]],cong:[['yc',1.5],['xcai',.5]],suan:[['yc',1]],jiang:[['cjs',5]],gt:[['qs',1]],pj:[['dj',1],['xmj',.5]],dj:[['pj',1],['xmj',.5]],xmj:[['gla',.8],['ljm',.5]],qhj:[['hj',1]],fqj:[['fq',4]],zmj:[['hsj',1]]};
const BOOST={salt:['salt',.004,'late'],sweet:['bt',.012,'late'],sour:['xc',.02,'late'],umami:['hy',.015,'late'],spicy:['gla',.012,'afterOil'],numb:['hjm',.003,'end'],wok:['suan',.02,'afterOil'],spice:['bj',.006,'withLiquid'],fresh:['cong',.03,'end'],roast:['zm',.01,'end'],rich:['xyou',.006,'end'],pungent:['bhj',.002,'end'],ferment:['ls',.02,'late']};
const LV=1.2;
function mfOf(steps){let m=0;for(const s of steps)if(s.t==='add'&&FD[s.id])m+=+s.g;return Math.max(150,m)}
function insertAt(S,where,step){
  const pot=(s)=>!s.c||s.c==='pot';let i=S.length;
  if(where==='afterOil'){const oi=S.findIndex(s=>s.t==='add'&&pot(s)&&IT[s.id]&&IT[s.id].oil);if(oi>=0){let j=oi+1;while(j<S.length&&S[j].t==='heat'&&j<oi+2)j++;i=j}else where='late'}
  if(where==='withLiquid'){const wi=S.findIndex(s=>s.t==='add'&&pot(s)&&IT[s.id]&&IT[s.id].water);if(wi>=0)i=wi+1;else where='late'}
  if(where==='late'){let li=-1;for(let k=S.length-1;k>=0;k--)if(S[k].t==='heat'){li=k;break}i=li>=0?li:S.length}
  S.splice(i,0,step);return i}
function texPen(ev,prefs){let p=0;for(const t of ev.tex){const d=FD[t.id];const meat=['肉','禽','水产'].includes(d.cat);
    if(meat&&prefs.meat==='嫩'&&!['滑嫩','刚好','软糯','酥烂脱骨'].includes(t.lab))p+=3;
    if(meat&&prefs.meat==='烂'&&!['软糯','酥烂脱骨','软烂','软烂入味'].includes(t.lab))p+=2;
    if(!meat&&prefs.veg==='脆'&&!['爽脆','脆嫩','断生','生脆'].includes(t.lab))p+=1.5;
    if(!meat&&prefs.veg==='软'&&!['软','软烂','软烂入味','软糯起沙','黄软','皱皮软香'].includes(t.lab))p+=1.5;
    if(t.must&&t.done<.97)p+=4}return p}
function lossOf(r,T,wt,prefs){let L=0;for(const k in T){const d=(r.ev.D[k]||0)-T[k];L+=wt[k]*d*d}return L+3*sev(r.W)+texPen(r.ev,prefs)}
function improve(steps0,fin,eat,prefs,budgetMs){
  const t0=Date.now();budgetMs=budgetMs||2500;let S=clone(steps0);const log=[];const touched=new Set();const P=prefs||{};const cons=P.cons||{};
  const base=runEval(steps0,fin,eat);const mf=mfOf(S);
  const del=Object.assign({},P.delta||{});
  // ---- 硬约束：替换/删除 ----
  const removeIds=(ids,why,repl)=>{for(let i=S.length-1;i>=0;i--){const s=S[i];if(s.t==='add'&&ids.includes(s.id)){touched.add(s.id);const r=repl&&repl(s);const old=IT[s.id].name;
    if(r&&r.length){S.splice(i,1,...r);log.push(['替换',`${old} ${s.g}g → ${r.map(x=>IT[x.id].name+' '+x.g+'g').join(' + ')}（${why}）`])}else{S.splice(i,1);log.push(['删除',`去掉${old} ${s.g}g（${why}）`])}}}};
  const mk=(s,id,f)=>({t:'add',c:s.c||'pot',id,g:Math.round(s.g*f*10)/10});
  if(cons.noSpicy){removeIds(SPICY_IDS,'不吃辣',s=>s.id==='db'?[mk(s,'hdj',.8),mk(s,'fqj',.3)]:s.id==='hyou'?[mk(s,'hsy',1)]:s.id==='pj'?[mk(s,'fqj',.5),mk(s,'bc',.15)]:s.id==='hgdl'?[mk(s,'ny',.5),mk(s,'lbao',.1),mk(s,'salt',.06)]:s.id==='dj'?[mk(s,'salt',.08)]:null);del.spicy=Math.min(del.spicy||0,-3)}
  if(cons.noAlcohol){let had=false;removeIds(ALC_IDS,'不用酒',s=>{had=true;return s.id==='pij'?[mk(s,'qs',1)]:s.id==='lz'?[mk(s,'bt',.08)]:s.id==='ml'?[mk(s,'bt',.2)]:null});
    if(had){if(!S.some(s=>s.t==='add'&&s.id==='jiang')){insertAt(S,'afterOil',{t:'add',c:'pot',id:'jiang',g:Math.round(mf*.02)});log.push(['新增',`加姜 ${Math.round(mf*.02)}g，代替料酒去腥`])}
      for(const s of S)if(s.t==='add'&&FD[s.id]&&FD[s.id].off>=.006&&!s.prep){s.prep='blanch';log.push(['做法',`${FD[s.id].name}先焯水，代替料酒去腥`])}}}
  if(cons.noMSG)removeIds(MSG_IDS,'不用味精鸡精',s=>[mk(s,'hy',s.id==='wj'?4:2)]);
  if(cons.lowOil){for(const s of S)if(s.t==='add'&&IT[s.id]&&IT[s.id].oil&&!FLAVOR_OILS.includes(s.id)){touched.add(s.id);const o=s.g;s.g=o>200?60:Math.max(10,Math.round(o*.6));if(s.g!==o)log.push(['用量',`${IT[s.id].name} ${o}g → ${s.g}g（少油${o>200?'，炸改半煎':''}）`])}
    for(let i=S.length-1;i>=0;i--)if(S[i].t==='drain'&&S[i].kind==='oil')S.splice(i,1);del.rich=Math.min(del.rich||0,-1)}
  if(cons.lowSalt){del.salt=Math.min(del.salt||0,-1.5);del.sour=Math.max(del.sour||0,.3);del.wok=Math.max(del.wok||0,.5)}
  if(cons.lowSugar)del.sweet=Math.min(del.sweet||0,-2);
  for(const id of P.missing||[]){const subs=(SUBS[id]||[]).filter(([sid])=>!(P.missing||[]).includes(sid)&&!(cons.noAlcohol&&ALC_IDS.includes(sid))&&!(cons.noSpicy&&SPICY_IDS.includes(sid)));
    removeIds([id],'家里没有',s=>subs.length?[(()=>{const [sid,f]=subs[0];return FD[sid]?Object.assign(mk(s,sid,f),{cut:FD[sid].cut}):mk(s,sid,f)})()]:null)}
  // ---- 目标 ----
  let cur=runEval(S,fin,eat);const T={},wt={};
  for(const [k] of DIMS){if(del[k]){T[k]=Math.max(0,Math.min(9.5,base.ev.D[k]+del[k]*LV));wt[k]=4}else{T[k]=base.ev.D[k];wt[k]=k==='salt'?1.5:.6}}
  for(const [k] of NEG){T[k]=Math.min(base.ev.D[k],1.2);wt[k]=2}
  // ---- 口感结构性改动 ----
  if(P.meat==='嫩'){for(let i=0;i<S.length;i++){const s=S[i];if(s.t!=='add'||!FD[s.id])continue;const d=FD[s.id];if(!(d.lean||(d.coll&&d.coll<30)))continue;
      const c=s.c||'pot';const hasStarch=S.some(x=>x.t==='add'&&(x.c||'pot')===c&&IT[x.id]&&IT[x.id].starch);
      if(c!=='pot'&&!hasStarch){S.splice(i+1,0,{t:'add',c,id:'dian',g:Math.round(s.g*.03)});log.push(['做法',`${d.name}加淀粉 ${Math.round(s.g*.03)}g 上浆护嫩`]);break}
      if(c==='pot'&&!s.prep&&!S.some(x=>x.c==='A')){const g=s.g;S.splice(i,1,{t:'pour',from:'A',to:'pot',what:'all'});S.unshift({t:'add',c:'A',id:s.id,g,cut:s.cut},{t:'add',c:'A',id:'salt',g:Math.round(g*.003*10)/10},{t:'add',c:'A',id:'lj',g:cons.noAlcohol?0:Math.round(g*.02)},{t:'add',c:'A',id:'dian',g:Math.round(g*.03)},{t:'rest',s:600});
        if(cons.noAlcohol)S.splice(2,1);log.push(['做法',`${d.name}先用盐、${cons.noAlcohol?'':'料酒、'}淀粉腌 10 分钟上浆，再下锅`]);break}}
    cur=runEval(S,fin,eat)}
  // ---- 搜索 ----
  const vars=()=>{const m=new Map();S.forEach((s,i)=>{if(s.t==='add'&&IT[s.id]&&!IT[s.id].water){if(!m.has(s.id))m.set(s.id,[]);m.get(s.id).push(i)}});return m};
  const heatAfter=(pred)=>{const idx=[];let on=false;const inC={};S.forEach((s,i)=>{
      if(s.t==='add'&&pred(s)){if(!s.c||s.c==='pot')on=true;else inC[s.c]=1}
      if(s.t==='pour'&&inC[s.from]&&(s.to||'pot')==='pot')on=true;
      if(on&&s.t==='heat'&&!s.u)idx.push(i)});return idx};
  let L0=lossOf(cur,T,wt,P);let iter=0;
  while(Date.now()-t0<budgetMs&&iter<40){iter++;const cand=[];const V=vars();
    // 误差大的维度
    const errs=Object.keys(T).map(k=>[k,(cur.ev.D[k]||0)-T[k]]).filter(([k,e])=>(Math.abs(e)>.35&&wt[k]>=2)||Math.abs(e)>1.2).sort((a,b)=>Math.abs(b[1])*wt[b[0]]-Math.abs(a[1])*wt[a[0]]).slice(0,3);
    for(const [k,e] of errs){const contrib={};for(const [n,v] of cur.ev.src[k]||[]){const id=NAME2ID[n.replace(/\(.*\)$/,'')];if(id&&V.has(id))contrib[id]=(contrib[id]||0)+v}
      const ids=Object.entries(contrib).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
      for(const id of ids)for(const f of e<0?[1.4,2]:[.7,.45])cand.push({type:'scale',id,f,k});
      if(e<0&&(!ids.length||contrib[ids[0]]<.5)&&BOOST[k]){const [bid,per,where]=BOOST[k];if(!(cons.noSpicy&&SPICY_IDS.includes(bid))&&!(P.missing||[]).includes(bid)&&!(cons.noMSG&&MSG_IDS.includes(bid)))cand.push({type:'add',id:bid,g:Math.max(.5,Math.round(mf*per*10)/10),where,k})}}
    if(P.veg||P.meat){const vegIdx=heatAfter(s=>FD[s.id]&&!['肉','禽','水产'].includes(FD[s.id].cat));const meatIdx=heatAfter(s=>FD[s.id]&&['肉','禽','水产'].includes(FD[s.id].cat));
      if(P.veg==='脆')cand.push({type:'heat',idx:vegIdx,f:.7});if(P.veg==='软')cand.push({type:'heat',idx:vegIdx,f:1.4});
      if(P.meat==='嫩'){cand.push({type:'heat',idx:meatIdx,f:.8});cand.push({type:'heat',idx:meatIdx,f:.6})}
      if(P.meat==='烂'){const lids=S.map((s,i)=>[s,i]).filter(([s])=>s.t==='heat'&&s.lid).sort((a,b)=>b[0].s-a[0].s);if(lids.length)cand.push({type:'heat',idx:[lids[0][1]],f:1.4})}}
    if(!cand.length)break;let best=null;
    for(const c of cand){if(Date.now()-t0>budgetMs)break;const S2=clone(S);
      if(c.type==='scale'){for(const i of V.get(c.id))S2[i].g=Math.round(S2[i].g*c.f*10)/10}
      else if(c.type==='add')insertAt(S2,c.where,{t:'add',c:'pot',id:c.id,g:c.g});
      else if(c.type==='heat'){if(!c.idx.length)continue;for(const i of c.idx)S2[i].s=Math.max(5,Math.round(S2[i].s*c.f))}
      const r=runEval(S2,fin,eat);const L=lossOf(r,T,wt,P);if(!best||L<best.L)best={L,S2,r,c}}
    if(!best||best.L>L0*.985)break;
    S=best.S2;cur=best.r;L0=best.L;const c=best.c;
    if(c.type==='add')log.push(['新增',`加${IT[c.id].name} ${c.g}g（${DN[c.k]}${({late:'，最后一段加热前下',afterOil:'，热油后下',withLiquid:'，随汤汁下',end:'，出锅时加'})[c.where]||''}）`]);
    if(c.type==='heat')log.push(['火候',`相关加热时间 ×${c.f}（${c.f<1?'缩短':'延长'}，为了口感）`])}
  // ---- 顺手修正 ----
  if(P.fix!==false){const fx=fixCooking(S,fin,eat,6);S=fx.steps;cur=fx.cur;log.push(...fx.log)}
  // ---- 用量变化汇总 ----
  const sum=st=>{const m={};for(const s of st)if(s.t==='add'&&IT[s.id])m[s.id]=(m[s.id]||0)+(+s.g);return m};const a=sum(steps0),b=sum(S);
  for(const id in a)if(!touched.has(id)&&b[id]!=null&&Math.abs(b[id]-a[id])>Math.max(.3,a[id]*.08))log.push(['用量',`${IT[id].name} ${+a[id].toFixed(1)}g → ${+b[id].toFixed(1)}g`]);
  const seen=new Set();const L=log.filter(x=>{const k=x.join('|');if(seen.has(k))return false;seen.add(k);return true});
  S=tidy(S);cur=runEval(S,fin,eat);return{steps:S,log:L,before:base,after:cur,target:T,ms:Date.now()-t0}}
if(typeof module!=='undefined')module.exports={fixCooking,improve,trace,runEval,tidy};
