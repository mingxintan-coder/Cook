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
function show(r,who){res=r;$('ares').hidden=false;$('astat').textContent=`${who} · 试算 ${(r.ms/1000).toFixed(1)} 秒`;
  $('aname').textContent=r.name;$('ascore').innerHTML=`${r.score}<small> 分 完美度</small>`;
  const ft=flavorTypes(r.r.ev.D,r.r.ev.flags);$('atypes').innerHTML=ft.map((t,i)=>`<span class="tag${i?'':' main'}">${esc(t[0])}</span>`).join('')+`<span class="tag">${esc(r.spec.method)}</span><span class="tag">${r.r.ev.color.name}</span>`;
  radarSVG($('aradar').querySelector('svg'),DIMS,r.r.ev.D,r.T);
  $('anotes').innerHTML=(r.notes||[]).map(n=>`<li>${esc(n)}</li>`).join('');
  const card=recipeCard(r.steps);$('acard').innerHTML=card.ing.map(g=>`<p><b>${g.t}</b>：${g.rows.map(x=>esc(x.name)+' '+x.g+'g'+(x.m?`<span class="note">（${x.m}）</span>`:'')).join('，')}</p>`).join('')+`<ol class="csteps">${card.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="note">约 ${fmtT(card.total)}</p>`;
  const w=r.r.W.filter(x=>x[0]>=1).map(x=>x[1]);$('awarn').textContent=w.length?'提醒：'+w.slice(0,3).join(' '):'';
  $('ares').scrollIntoView({behavior:'smooth',block:'start'})}
$('aopen').onclick=()=>{if(!res)return;window.openInEditor({dish:'',steps:JSON.parse(JSON.stringify(res.steps)),fin:res.fin,eat:res.eat,custom:res.name});location.hash='remix'};
$('asave').onclick=()=>{if(!res)return;bookSave({name:res.name,steps:res.steps,fin:res.fin,eat:res.eat,base:'',note:'AI 设计 · '+res.spec.style+' · '+res.spec.method});$('astat').textContent='已存进“我的菜谱”'};
$('acardbtn').onclick=()=>{if(res)openCard(res.name,res.steps,res.fin,res.eat,'AI 设计 · '+res.spec.style)};
$('aalt').onclick=()=>{$('aalt').disabled=true;$('aalts').textContent='正在比较各种做法…';
  setTimeout(()=>{const L=[];for(const m of METHODS_D.slice(1)){try{const r=design(Object.assign({},spec,{method:m}),900);L.push(r)}catch(e){}}L.sort((a,b)=>b.score-a.score);
    $('aalts').innerHTML=L.map((r,i)=>`<button class="chip" data-k="${i}">${esc(r.name)} · ${r.spec.method} ${r.score}</button>`).join('');$('aalt').disabled=false;
    $('aalts').onclick=e=>{const b=e.target.closest('button');if(b)show(L[+b.dataset.k],'程序设计')}},30)};

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
window.aiShow=()=>{render();if(res){radarSVG($('aradar').querySelector('svg'),DIMS,res.r.ev.D,res.T)}};
}
