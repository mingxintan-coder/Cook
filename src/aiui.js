// ===== AI 设计菜 =====
{
const $=id=>document.getElementById(id);
let spec={foods:[],style:'鱼香',method:'自动',meat:'',veg:'',cons:{}};let fcat='肉';let res=null;let sampleFn=null;
try{const s=JSON.parse(localStorage.getItem('tw.aispec')||'null');if(s&&Array.isArray(s.foods))spec=Object.assign(spec,s)}catch(e){}
if(!spec.foods.length)spec.foods=[{id:'qz',g:400},{id:'rm',g:100}];
const saveSpec=()=>{try{localStorage.setItem('tw.aispec',JSON.stringify(spec))}catch(e){}};
const AC=[['lowSalt','少盐'],['lowOil','少油'],['lowSugar','控糖'],['noSpicy','不吃辣'],['noAlcohol','不用酒'],['noMSG','不用味精']];
function render(){
  $('afcats').innerHTML=FCATS.map(c=>`<button data-c="${c}" aria-pressed="${c===fcat}">${c}</button>`).join('');
  $('afgrid').innerHTML=Object.values(FD).filter(d=>d.cat===fcat).map(d=>`<button data-f="${d.id}" aria-pressed="${spec.foods.some(f=>f.id===d.id)}">${esc(d.name)}</button>`).join('');
  $('afsel').innerHTML=spec.foods.map((f,i)=>`<div class="afrow" data-i="${i}"><b>${esc(FD[f.id].name)}</b><input type="number" min="20" step="50" value="${f.g}" aria-label="克数"><span class="unit">g</span><select aria-label="切法">${Object.keys(CUTS).map(c=>`<option${c===(f.cut||FD[f.id].cut)?' selected':''}>${c}</option>`).join('')}</select><button class="x" aria-label="移除">✕</button></div>`).join('')||'<p class="note">从上面选 1–3 样主料。</p>';
  $('astyle').innerHTML=Object.keys(STYLES).map(k=>`<button class="chip" data-s="${k}" aria-pressed="${spec.style===k}">${k}</button>`).join('');
  $('amethod').innerHTML=METHODS_D.map(m=>`<button data-m="${m}" aria-pressed="${spec.method===m}">${m}</button>`).join('');
  $('atex').innerHTML=`<span class="unit">肉</span><span class="seg" data-t="meat">${[['','随菜'],['嫩','嫩'],['烂','软烂']].map(([v,n])=>`<button data-v="${v}" aria-pressed="${spec.meat===v}">${n}</button>`).join('')}</span><span class="unit">菜</span><span class="seg" data-t="veg">${[['','随菜'],['脆','脆'],['软','软']].map(([v,n])=>`<button data-v="${v}" aria-pressed="${spec.veg===v}">${n}</button>`).join('')}</span>`;
  $('acons').innerHTML=AC.map(([k,n])=>`<button class="chip" data-c="${k}" aria-pressed="${!!spec.cons[k]}">${n}</button>`).join('');
  $('ago').disabled=!spec.foods.length}
$('v-ai').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.c&&b.closest('#afcats')){fcat=b.dataset.c}
  else if(b.dataset.f){const i=spec.foods.findIndex(f=>f.id===b.dataset.f);if(i>=0)spec.foods.splice(i,1);else if(spec.foods.length<3)spec.foods.push({id:b.dataset.f,g:spec.foods.length?150:400})}
  else if(b.classList.contains('x')&&b.closest('.afrow')){spec.foods.splice(+b.closest('.afrow').dataset.i,1)}
  else if(b.dataset.s)spec.style=b.dataset.s;else if(b.dataset.m)spec.method=b.dataset.m;
  else if(b.closest('.seg')&&b.closest('.seg').dataset.t)spec[b.closest('.seg').dataset.t]=b.dataset.v;
  else if(b.dataset.c&&b.closest('#acons'))spec.cons[b.dataset.c]=!spec.cons[b.dataset.c];
  else return;saveSpec();render()});
$('afsel').addEventListener('change',e=>{const row=e.target.closest('.afrow');if(!row)return;const f=spec.foods[+row.dataset.i];if(e.target.tagName==='SELECT')f.cut=e.target.value;else f.g=Math.max(20,+e.target.value||100);saveSpec()});
$('ago').onclick=()=>{$('ago').disabled=true;$('astat').textContent='正在试做几十个版本…';
  setTimeout(()=>{try{const r=design(spec,3500);show(r,'程序设计')}catch(err){console.error(err);$('astat').textContent='设计失败'}$('ago').disabled=false},30)};
function show(r,who){res=r;$('ares').hidden=false;$('astat').textContent=r.ms?`${who} · 试算 ${(r.ms/1000).toFixed(1)} 秒`:who;
  $('aname').textContent=r.name;$('ascore').innerHTML=`${r.score}<small> 分 完美度</small>`;
  const ft=flavorTypes(r.r.ev.D,r.r.ev.flags);$('atypes').innerHTML=ft.map((t,i)=>`<span class="tag${i?'':' main'}">${esc(t[0])}</span>`).join('')+`<span class="tag">${esc(r.spec.method)}</span><span class="tag">${r.r.ev.color.name}</span>`;
  radarSVG($('aradar').querySelector('svg'),DIMS,r.r.ev.D,r.T);
  $('anotes').innerHTML=(r.notes||[]).map(n=>`<li>${esc(n)}</li>`).join('');
  const card=recipeCard(r.steps);$('acard').innerHTML=cardHTML(card);
  const w=r.r.W.filter(x=>x[0]>=1).map(x=>x[1]);$('awarn').textContent=w.length?'提醒：'+w.slice(0,3).join(' '):'';
  $('ares').scrollIntoView({behavior:'smooth',block:'start'})}
$('aopen').onclick=()=>{if(!res)return;window.openInEditor({dish:'',steps:JSON.parse(JSON.stringify(res.steps)),fin:res.fin,eat:res.eat,custom:res.name});location.hash='remix'};
$('asave').onclick=()=>{if(!res)return;bookSave({name:res.name,steps:res.steps,fin:res.fin,eat:res.eat,base:'',note:'AI 设计 · '+res.spec.style+' · '+res.spec.method});$('astat').textContent='已存进“我的菜谱”'};
$('acardbtn').onclick=()=>{if(res)openCard(res.name,res.steps,res.fin,res.eat,'AI 设计 · '+res.spec.style)};
$('aalt').onclick=()=>{$('aalt').disabled=true;$('aalts').textContent='正在比较各种做法…';
  setTimeout(()=>{const L=[];for(const m of METHODS_D.slice(1)){try{const r=design(Object.assign({},spec,{method:m}),900);L.push(r)}catch(e){}}L.sort((a,b)=>b.score-a.score);
    $('aalts').innerHTML=L.map((r,i)=>`<button class="chip" data-k="${i}">${esc(r.name)} · ${r.spec.method} ${r.score}</button>`).join('');$('aalt').disabled=false;
    $('aalts').onclick=e=>{const b=e.target.closest('button');if(b)show(L[+b.dataset.k],'程序设计')}},30)};

// ---- 冰箱模式 ----
let F={foods:[],pref:{spicy:'中辣',sweet:'',sour:'',numb:'',heavy:''},time:0,pantryOnly:false,pantry:PANTRY.slice(),cons:{}};let ffcat='肉';let fres=[];
try{const s=JSON.parse(localStorage.getItem('tw.fridge')||'null');if(s&&Array.isArray(s.foods))F=Object.assign(F,s)}catch(e){}
const saveF=()=>{try{localStorage.setItem('tw.fridge',JSON.stringify(F))}catch(e){}};
let amode='fridge';try{amode=localStorage.getItem('tw.aimode')||'fridge'}catch(e){}
function setMode(m){amode=m;$('pfridge').hidden=m!=='fridge';$('pspec').hidden=m!=='spec';$('aimode').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===m));try{localStorage.setItem('tw.aimode',m)}catch(e){}}
$('aimode').onclick=e=>{const b=e.target.closest('button');if(b)setMode(b.dataset.v)};
const PREFS=[['spicy','辣',['不辣','微辣','中辣','重辣']],['sweet','甜',['不爱甜','','爱甜']],['sour','酸',['','爱酸']],['numb','麻',['怕麻','','爱麻']],['heavy','口味',['清淡','','重口']]];
function frender(){
  $('ffcats').innerHTML=FCATS.map(c=>`<button data-fc="${c}" aria-pressed="${c===ffcat}">${c}</button>`).join('');
  $('ffgrid').innerHTML=Object.values(FD).filter(d=>d.cat===ffcat).map(d=>`<button data-ff="${d.id}" aria-pressed="${F.foods.some(f=>f.id===d.id)}">${esc(d.name)}</button>`).join('');
  $('ffsel').innerHTML=F.foods.length?F.foods.map((f,i)=>`<div class="afrow" data-i="${i}"><b>${esc(FD[f.id].name)}</b><input type="number" min="20" step="50" value="${f.g}" aria-label="克数"><span class="unit">g</span><span></span><button class="x" aria-label="移除">✕</button></div>`).join(''):'<p class="note">还没有食材。</p>';
  $('fpref').innerHTML=PREFS.map(([k,n,opts])=>`<div class="prow"><span>${n}</span><span class="seg" data-p="${k}">${opts.map(o=>`<button data-v="${o}" aria-pressed="${(F.pref[k]||'')===o}">${o||'随意'}</button>`).join('')}</span></div>`).join('');
  $('ftime').innerHTML=[[0,'不限'],[1800,'30 分钟内'],[900,'15 分钟内']].map(([v,n])=>`<button data-t="${v}" aria-pressed="${+F.time===v}">${n}</button>`).join('');
  $('fpo').checked=!!F.pantryOnly;$('fpan').hidden=!F.pantryOnly;
  $('fpan').innerHTML=PANTRY.filter(id=>IT[id]).map(id=>`<button class="chip" data-pa="${id}" aria-pressed="${F.pantry.includes(id)}">${esc(IT[id].name)}</button>`).join('');
  $('fcons').innerHTML=AC.filter(([k])=>k!=='noSpicy').map(([k,n])=>`<button class="chip" data-fco="${k}" aria-pressed="${!!F.cons[k]}">${n}</button>`).join('');
  $('fgo').disabled=!F.foods.length}
$('pfridge').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.fc)ffcat=b.dataset.fc;
  else if(b.dataset.ff){const i=F.foods.findIndex(f=>f.id===b.dataset.ff);if(i>=0)F.foods.splice(i,1);else if(F.foods.length<10)F.foods.push({id:b.dataset.ff,g:defaultG(b.dataset.ff,[b.dataset.ff])})}
  else if(b.classList.contains('x')&&b.closest('#ffsel'))F.foods.splice(+b.closest('.afrow').dataset.i,1);
  else if(b.closest('.seg')&&b.closest('.seg').dataset.p)F.pref[b.closest('.seg').dataset.p]=b.dataset.v;
  else if(b.dataset.t!=null&&b.closest('#ftime'))F.time=+b.dataset.t;
  else if(b.dataset.pa){const i=F.pantry.indexOf(b.dataset.pa);if(i>=0)F.pantry.splice(i,1);else F.pantry.push(b.dataset.pa)}
  else if(b.dataset.fco)F.cons[b.dataset.fco]=!F.cons[b.dataset.fco];
  else return;saveF();frender()});
$('ffsel').addEventListener('change',e=>{const row=e.target.closest('.afrow');if(!row)return;F.foods[+row.dataset.i].g=Math.max(20,+e.target.value||100);saveF()});
$('fpo').onchange=e=>{F.pantryOnly=e.target.checked;saveF();frender()};
const BASES=()=>Object.values(FD).filter(d=>!d.base&&!d.custom);
let unk=[];
function addFoods(ids){for(const id of ids)if(!F.foods.some(f=>f.id===id))F.foods.push({id,g:0});for(const f of F.foods)if(!f.g)f.g=defaultG(f.id,F.foods.map(x=>x.id))}
function unkRender(){const box=$('funk');if(!unk.length){box.innerHTML='';return}
  box.innerHTML=`<p class="note" style="margin:6px 0">没认出：请选最接近的${sampleFn?'，或让 Claude 识别':''}</p>`+unk.map((w,i)=>`<div class="fl" data-u="${i}" style="margin:4px 0"><b>${esc(w)}</b><span class="unit">当作</span><select>${BASES().map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select><button class="btn sm" data-uadd="${i}">加入</button><button class="btn sm" data-udel="${i}">不要</button></div>`).join('')+(sampleFn?`<button class="btn sm" id="uai">让 Claude 识别</button>`:'')}
$('funk').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.uadd!=null){const i=+b.dataset.uadd;const base=b.parentElement.querySelector('select').value;const id=addCustomFood(unk[i],base);if(id)addFoods([id]);unk.splice(i,1);saveF();unkRender();frender()}
  else if(b.dataset.udel!=null){unk.splice(+b.dataset.udel,1);unkRender()}
  else if(b.id==='uai'&&sampleFn){b.disabled=true;b.textContent='Claude 识别中…';
    const list=BASES().map(d=>`${d.id}=${d.name}(${d.cat})`).join(' ');
    const prompt=`把下面这些食材各自归到最接近的基础食材（烹饪性质最像：熟得快慢、是否需要久炖、出水、口感）。可选基础食材 id=名称：${list}\n切法可选：${Object.keys(CUTS).join('、')}\n食材：${JSON.stringify(unk)}\n只回复 JSON 数组，每项 {"word":"原词","base":"基础食材id","cut":"常用切法","isFood":true/false}，不是食材（比如调料、饮料）就 isFood=false。`;
    try{const out=await sampleFn(prompt,{modelTier:'quick'});const m=(out.text||'').match(/\[[\s\S]*\]/);const L=m?JSON.parse(m[0]):[];const got=[];
      for(const x of L){if(!x||!unk.includes(x.word))continue;if(x.isFood===false){unk=unk.filter(w=>w!==x.word);continue}if(FD[x.base]){const id=addCustomFood(String(x.word).slice(0,12),x.base,x.cut);if(id){addFoods([id]);got.push(x.word+'（按'+FD[x.base].name+'）');unk=unk.filter(w=>w!==x.word)}}}
      $('fstat').textContent=got.length?'Claude 识别：'+got.join('、'):'Claude 也没认出来，请手动选择';saveF();frender()}
    catch(err){$('fstat').textContent=err&&err.code==='rate_limited'?'请求太频繁，稍后再试':'识别失败，请手动选择'}
    unkRender()}});
$('fparse').onclick=()=>{const t=$('ftext').value;const r=parseFoodsX(t);addFoods(r.ids);for(const id of parseSeas(t))if(!F.pantry.includes(id))F.pantry.push(id);
  const parts=[];const viaIds=new Set(r.via.map(v=>v[1]));const gs=new Set(r.guessed.map(g=>g[0]));
  for(const id of r.ids){const d=FD[id];if(d.custom&&gs.has(d.name))parts.push(`${d.name}（按${FD[d.base].name}估）`);else{const v=r.via.find(x=>x[1]===id);parts.push(v&&v[0]!==d.name?`${v[0]}（按${d.name}算）`:d.name)}}
  unk=[...new Set(unk.concat(r.unknown))];
  $('fstat').textContent=parts.length?'识别出：'+parts.join('、'):(r.unknown.length?'':'没识别出食材，可以直接点选');$('ftext').value='';saveF();frender();unkRender()};
$('ftext').addEventListener('keydown',e=>{if(e.key==='Enter')$('fparse').click()});
$('fgo').onclick=()=>{if(!F.foods.length)return;$('fgo').disabled=true;$('frec').innerHTML='';const input={foods:F.foods,pref:F.pref,pantryOnly:F.pantryOnly,pantry:F.pantry,cons:F.cons};
  const plan=fridgePlan(input);const jobs=plan.jobs;let i=0;$('fstat').textContent=`共 ${jobs.length} 种搭配，正在快速试做…`;
  const step1=()=>{const t0=Date.now();while(i<jobs.length&&Date.now()-t0<120){try{quickEval(jobs[i])}catch(e){jobs[i].total=-1}i++}
    $('fstat').textContent=`快速试做 ${i}/${jobs.length}…`;if(i<jobs.length)return setTimeout(step1,0);
    const lim=+F.time;const ok=jobs.filter(j=>j.total>=0&&(!lim||j.t<=lim*1.3));const top=pickTop(ok,7);if(!top.length){$('fstat').textContent=lim?'这个时间内做不出来，放宽时间试试':'没有合适的搭配';$('fgo').disabled=false;return}
    let k=0;const out=[];const step2=()=>{const j=top[k];$('fstat').textContent=`细调第 ${k+1}/${top.length} 道：${STYLES[j.spec.style].pre}…`;
      setTimeout(()=>{try{const r=design(j.spec,700);if(!lim||r.r.sim.t<=lim)out.push({r,j,total:tasty(j,r.score)})}catch(e){console.error(e)}k++;if(k<top.length)step2();else done(out)},0)};step2()};
  const done=(out)=>{out=out.filter(x=>x.total>=60).sort((a,b)=>b.total-a.total).slice(0,6);fres=out;$('fgo').disabled=false;$('fstat').textContent=out.length?`推荐 ${out.length} 道，点“看做法”展开`:'没有合适的搭配，试试放宽时间或口味';
    $('frec').innerHTML=out.map((x,n)=>`<div class="frow${n?'':' first'}"><div class="fs">${x.total}<small>好吃度</small></div><div><b>${esc(x.r.name)}</b><span class="note">${esc(x.r.spec.style)} · ${esc(x.r.spec.method)} · 约 ${Math.max(1,Math.round(x.r.r.sim.t/60))} 分钟 · 完美度 ${x.r.score}</span><span class="note">${esc(reason(x.j))}</span></div><div class="fl" style="flex-direction:column;align-items:stretch"><button class="btn sm pri" data-fv="${n}">看做法</button><button class="btn sm" data-fs="${n}">存</button></div></div>`).join('')};
  step1()};
$('frec').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.fv!=null){const x=fres[+b.dataset.fv];show(x.r,`冰箱推荐 · 好吃度 ${x.total}`)}
  if(b.dataset.fs!=null){const x=fres[+b.dataset.fs];bookSave({name:x.r.name,steps:x.r.steps,fin:x.r.fin,eat:x.r.eat,base:'',note:'冰箱推荐 · '+x.r.spec.style+' · '+x.r.spec.method});b.textContent='已存'}});
setMode(amode);

// ---- Claude 主厨 ----
const clamp2=(x,a,b)=>Math.max(a,Math.min(b,x));
function sanitize(steps){if(!Array.isArray(steps))return[];const out=[];const C=['pot','A','B','C'];
  for(const s of steps.slice(0,80)){if(!s||typeof s!=='object')continue;
    if(s.t==='add'&&(IT[s.id]||FD[s.id])){const o={t:'add',c:C.includes(s.c)?s.c:'pot',id:s.id,g:clamp2(+s.g||0,.1,3000)};if(FD[s.id]){o.cut=CUTS[s.cut]?s.cut:FD[s.id].cut;if(s.prep==='blanch'||s.prep==='preboil')o.prep=s.prep}out.push(o)}
    else if(s.t==='heat'){const o={t:'heat',f:[1,2,3].includes(+s.f)?+s.f:2,s:Math.round(clamp2(+s.s||60,1,10800))};if(s.lid)o.lid=1;if(s.m==='steam'||s.m==='bake')o.m=s.m;if(['boil','temp','reduce'].includes(s.u)){o.u=s.u;if(s.u==='temp')o.v=clamp2(+s.v||160,80,260)}out.push(o)}
    else if(s.t==='rest')out.push({t:'rest',s:Math.round(clamp2(+s.s||60,1,7200))});
    else if(s.t==='pour'&&C.includes(s.from))out.push({t:'pour',from:s.from,to:C.includes(s.to)?s.to:'pot',what:s.what==='foods'?'foods':'all'});
    else if(s.t==='drain')out.push({t:'drain',c:C.includes(s.c)?s.c:'pot',kind:s.kind==='water'?'water':'oil',keep:clamp2(+s.keep||0,0,500)});
    else if(s.t==='remove'&&IT[s.id])out.push({t:'remove',c:C.includes(s.c)?s.c:'pot',id:s.id})}
  return out}
function catalog(){const it=Object.values(IT).filter(d=>!d.mix).map(d=>`${d.id}=${d.name}`).join(' ');const fd=Object.values(FD).map(d=>`${d.id}=${d.name}(默认切${d.cut})`).join(' ');return{it,fd}}
async function chef(){if(!sampleFn)return;const T=designTarget(Object.assign({},spec,{method:spec.method==='自动'?'快炒':spec.method}));const fin0=spec.method==='蒸'?'C':spec.method==='凉拌'?'B':'pot';
  let tries=0;$('achef').disabled=true;$('astat').textContent='Claude 主厨正在构思…';const ctl=new AbortController();$('astop').hidden=false;$('astop').onclick=()=>ctl.abort();
  const cat=catalog();
  const sim=(input)=>{tries++;$('astat').textContent=`Claude 主厨正在试做第 ${tries} 版…`;const steps=sanitize(input.steps);if(!steps.length)throw new Error('steps 为空或格式不对');
    const fin=['pot','A','B','C'].includes(input.fin)?input.fin:fin0;const eat=input.eat==='drain'?'drain':'all';const r=runEval(steps,fin,eat);const D=r.ev.D;
    return{完美度:Math.max(0,Math.round(100-designScore(r,T,Object.assign({},spec,{method:spec.method==='自动'?'快炒':spec.method}))*3)),味型:flavorTypes(D,r.ev.flags).map(x=>x[0]),味道:Object.fromEntries(DIMS.concat(NEG).map(([k,n])=>[n,+D[k].toFixed(1)])),目标:Object.fromEntries(DIMS.map(([k,n])=>[n,+(T[k]||0).toFixed(1)])),口感:r.ev.tex.map(t=>`${t.name}:${t.lab}${t.surf?'/'+t.surf:''}`),提醒:r.W.slice(0,6).map(w=>w[1]),总时长秒:r.sim.t}};
  const goal={主料:spec.foods.map(f=>`${FD[f.id].name}(${f.id}) ${f.g}g 切${f.cut||FD[f.id].cut}`),味型:spec.style,做法:spec.method,口感:{肉:spec.meat||'随菜',菜:spec.veg||'随菜'},限制:AC.filter(([k])=>spec.cons[k]).map(x=>x[1])};
  const prompt=`你是经验丰富的中餐主厨，同时懂烹饪科学。请为下面的要求设计一道“完美”的菜，并用模拟器验证。
要求：${JSON.stringify(goal)}
可用调料（id=名称）：${cat.it}
可用食材：${cat.fd}
切法可选：${Object.keys(CUTS).join('、')}
步骤格式（JSON 数组，按顺序执行，容器 pot=炒锅 A/B=小碗 C=盘子，只有 pot 能加热）：
{"t":"add","c":"pot|A|B|C","id":"调料或食材id","g":克数,"cut":"切法(仅食材)","prep":"blanch(焯水)|preboil(先煮熟)(可选)"}
{"t":"heat","f":1|2|3(小中大火),"s":最长秒数,"u":"boil|temp|reduce(可选：烧开为止/油温到v为止/收汁到浓为止)","v":目标油温,"lid":1(盖盖,可选),"m":"steam(隔水蒸,可选)"}
{"t":"rest","s":秒}（关火静置/腌制）  {"t":"pour","from":"A","to":"pot","what":"all|foods"}  {"t":"drain","c":"pot","kind":"oil|water","keep":留下克数}  {"t":"remove","c":"pot","id":"香料id"}（捞出）
做法要点：瘦肉丁丝片先在 A 碗用盐、料酒、淀粉上浆；碗汁在 B 碗调好最后倒入；干辣椒花椒在 140–160°C 油温下锅；豆瓣酱小火炒出红油；炖肉要焯水、加盖小火足够时间；醋和香油宜最后放；盐的总量控制在成菜约 1%。
请先设计一版，调用 simulate 工具试做，根据返回的味道、口感和提醒修改，最多试做 5 次，追求完美度最高、没有提醒。
最后只回复一个 JSON（放在 \`\`\`json 代码块里）：{"name":"菜名","fin":"成品所在容器","eat":"all或drain","steps":[...],"notes":["3–6 条设计思路，每条一句话"]}`;
  try{const out=await sampleFn(prompt,{modelTier:'complex',signal:ctl.signal,tools:[{name:'simulate',description:'在烹饪模拟器里按步骤做一遍，返回完美度、味型、14 维味道（0–10）与目标、口感、提醒。',inputSchema:{type:'object',properties:{steps:{type:'array',items:{type:'object'}},fin:{type:'string'},eat:{type:'string'}},required:['steps']},execute:sim}]});
    const txt=out.text||'';const m=txt.match(/```json\s*([\s\S]*?)```/)||txt.match(/(\{[\s\S]*\})/);if(!m)throw new Error('没有拿到菜谱');
    const o=JSON.parse(m[1]);let steps=sanitize(o.steps);if(!steps.length)throw new Error('菜谱为空');
    const fin=['pot','A','B','C'].includes(o.fin)?o.fin:fin0;const eat=o.eat==='drain'?'drain':'all';
    const fx=fixCooking(steps,fin,eat,6);steps=fx.steps;const r=runEval(steps,fin,eat);const sp=Object.assign({},spec,{method:spec.method==='自动'?'主厨自选':spec.method});
    const L=designScore(r,T,Object.assign({},spec,{method:spec.method==='自动'?'快炒':spec.method}));
    show({spec:sp,steps,fin,eat,r,T,L,score:Math.max(0,Math.round(100-L*3)),name:String(o.name||'主厨特制').slice(0,30),notes:(Array.isArray(o.notes)?o.notes:[]).map(x=>String(x).slice(0,120)).slice(0,6).concat(fx.log.length?['程序又校正了 '+fx.log.length+' 处火候。']:[]),ms:0},`Claude 主厨 · 试做 ${tries} 次`)}
  catch(err){if(err&&err.code==='not_granted'){$('achef').hidden=true;$('astat').textContent='没有授权，可以用左边的“设计”按钮'}else if(err&&err.code==='rate_limited'){$('astat').textContent='请求太频繁，稍后再试'}else $('astat').textContent='主厨这次没做成：'+((err&&err.message)||'').slice(0,60)}
  finally{$('achef').disabled=false;$('astop').hidden=true}}
$('achef').onclick=chef;
(function hook(n){if(window.claude&&typeof window.claude.use==='function'){window.claude.use('sample').then(fn=>{if(fn){sampleFn=fn;$('achef').hidden=false;$('achefnote').hidden=false}}).catch(()=>{});return}if(n<20)setTimeout(()=>hook(n+1),250)})(0);
window.aiShow=()=>{render();frender();if(res){radarSVG($('aradar').querySelector('svg'),DIMS,res.r.ev.D,res.T)}};
}
