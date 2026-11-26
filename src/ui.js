{
const $=id=>document.getElementById(id);
const CN={pot:'锅',A:'A 碗',B:'B 碗',C:'C 盘'};
const nameOf=id=>(IT[id]||FD[id]||{name:'?'}).name;
let st={dish:DISHES[0].id,steps:[],fin:'pot',eat:'all',custom:null};let sel=-1;const undo=[];let last=null;

function loadDish(id,keep){const d=DISHES.find(x=>x.id===id);st={dish:id,steps:JSON.parse(JSON.stringify(d.steps)),fin:d.fin,eat:d.eat,custom:null};sel=-1;if(!keep)undo.length=0;full()}
function target(){return dishTarget(DISHES.find(x=>x.id===st.dish))}
function push(){undo.push(JSON.stringify(st));if(undo.length>60)undo.shift();$('undo').disabled=false}

// 菜单
function renderDishes(){$('dishes').innerHTML=DISHES.map(d=>`<button data-d="${d.id}" aria-pressed="${st.dish===d.id&&!st.custom}">${d.name}<small>${d.cz}</small></button>`).join('')}
$('dishes').onclick=e=>{const b=e.target.closest('button');if(b){loadDish(b.dataset.d)}};

// 步骤
function stepHTML(s,i){
  const ops=`<div class="ops"><button data-op="up" aria-label="上移">↑</button><button data-op="dn" aria-label="下移">↓</button><button data-op="dup" aria-label="复制">⧉</button><button data-op="del" aria-label="删除">✕</button></div>`;
  const cSel=(k,v,opt)=>`<select data-k="${k}">${(opt||['pot','A','B','C']).map(o=>`<option value="${o}"${o===v?' selected':''}>${CN[o]}</option>`).join('')}</select>`;
  let body='';
  if(s.t==='add'){const f=FD[s.id];const d=IT[s.id]||f;
    body=`<span class="unit">往</span>${cSel('c',s.c||'pot')}<span class="unit">下</span><button class="nm" data-pick="1">${esc(nameOf(s.id))}</button><input type="number" inputmode="decimal" min="0" step="${s.g<5?.5:5}" value="${s.g}" data-k="g" aria-label="用量"><span class="unit">g</span>`;
    if(f){body+=`<select data-k="cut">${Object.keys(CUTS).map(c=>`<option${c===(s.cut||f.cut)?' selected':''}>${c}</option>`).join('')}</select><select data-k="prep"><option value=""${!s.prep?' selected':''}>直接用</option><option value="blanch"${s.prep==='blanch'?' selected':''}>先焯水</option><option value="preboil"${s.prep==='preboil'?' selected':''}>先煮熟</option></select>`}
    if(d&&d.note)body+=`<span class="note sn">${esc(d.note)}</span>`}
  else if(s.t==='heat'){body=`<span class="unit">锅</span><span class="seg" data-k="f">${[1,2,3].map(f=>`<button data-v="${f}" aria-pressed="${+s.f===f}">${['','小火','中火','大火'][f]}</button>`).join('')}</span><input type="number" min="1" step="5" value="${s.s}" data-k="s" aria-label="秒"><span class="unit">秒 · ${fmtT(s.s)}</span><select data-k="m"><option value="wok"${(s.m||'wok')==='wok'?' selected':''}>锅中</option><option value="steam"${s.m==='steam'?' selected':''}>隔水蒸</option><option value="bake"${s.m==='bake'?' selected':''}>烤</option></select><label><input type="checkbox" data-k="lid"${s.lid?' checked':''}>盖盖</label>`}
  else if(s.t==='rest'){body=`<span class="unit">关火静置/腌制</span><input type="number" min="1" step="30" value="${s.s}" data-k="s"><span class="unit">秒 · ${fmtT(s.s)}</span><label><input type="checkbox" data-k="lid"${s.lid?' checked':''}>盖盖</label>`}
  else if(s.t==='pour'){body=`<span class="unit">把</span>${cSel('from',s.from)}<span class="unit">的</span><select data-k="what"><option value="all"${s.what!=='foods'?' selected':''}>全部</option><option value="foods"${s.what==='foods'?' selected':''}>食材(盛出，汁留下)</option></select><span class="unit">倒进</span>${cSel('to',s.to||'pot')}`}
  else if(s.t==='drain'){body=`${cSel('c',s.c||'pot')}<select data-k="kind"><option value="oil"${s.kind!=='water'?' selected':''}>沥油</option><option value="water"${s.kind==='water'?' selected':''}>倒掉汤汁</option></select><span class="unit">只留</span><input type="number" min="0" step="5" value="${s.keep}" data-k="keep"><span class="unit">g</span>`}
  return `<li class="st k-${s.t}${i===sel?' sel':''}" data-i="${i}"><button class="when" data-op="sel" style="border:0;background:none" aria-label="在此后插入"><b>${i+1}</b><span class="tm"></span></button><div class="fl">${body}</div>${ops}</li>`}
function renderSteps(){$('steps').innerHTML=st.steps.length?st.steps.map(stepHTML).join(''):'<li class="note" style="padding:14px">锅是空的。点“＋ 下料”开始，比如先倒油、再加热。</li>';
  $('insHint').textContent=sel>=0?`已选中第 ${sel+1} 步，新步骤会插在它后面（再点一次序号取消）。`:'点某步左边的序号选中它：可看说明、移动、删除，新步骤会插在它后面。A/B 碗用来腌制、调碗汁，C 盘用来暂放或装盘。'}
$('steps').addEventListener('click',e=>{const li=e.target.closest('.st');if(!li)return;const i=+li.dataset.i;
  const op=e.target.closest('[data-op]');const seg=e.target.closest('.seg button');const pk=e.target.closest('[data-pick]');
  if(seg){push();st.steps[i].f=+seg.dataset.v;full();return}
  if(pk){openPick(i);return}
  if(!op)return;const o=op.dataset.op;
  if(o==='sel'){sel=sel===i?-1:i;renderSteps();paintTimes();return}
  push();const S=st.steps;
  if(o==='del'){S.splice(i,1);if(sel>=S.length)sel=S.length-1}
  if(o==='dup')S.splice(i+1,0,JSON.parse(JSON.stringify(S[i])));
  if(o==='up'&&i>0)[S[i-1],S[i]]=[S[i],S[i-1]];
  if(o==='dn'&&i<S.length-1)[S[i+1],S[i]]=[S[i],S[i+1]];
  full()});
$('steps').addEventListener('focusin',e=>{if(e.target.matches('input,select'))pendingPush=true});
let pendingPush=false;
const onEdit=(e,final)=>{const el=e.target;if(!el.dataset.k)return;const li=el.closest('.st');const s=st.steps[+li.dataset.i];
  if(pendingPush){push();pendingPush=false}
  const k=el.dataset.k;let v=el.type==='checkbox'?(el.checked?1:0):el.value;
  if(['g','s','keep'].includes(k))v=Math.max(0,+v||0);
  if(k==='prep'&&!v)delete s.prep;else s[k]=v;
  if(final&&(el.tagName==='SELECT'||el.type==='checkbox'))full();else{schedule();if(k==='s'){const u=el.nextElementSibling;if(u)u.textContent='秒 · '+fmtT(v)}}};
$('steps').addEventListener('input',e=>onEdit(e,false));
$('steps').addEventListener('change',e=>{onEdit(e,true);pendingPush=true});

function newStep(t){let s;
  if(t==='heat')s={t,f:2,s:60};else if(t==='rest')s={t,s:300};else if(t==='pour')s={t,from:'A',to:'pot',what:'all'};else if(t==='drain')s={t,c:'pot',kind:'oil',keep:30};
  if(t==='add'){openPick(-1);return}
  push();insert(s);full()}
function insert(s){if(sel>=0){st.steps.splice(sel+1,0,s);sel++}else st.steps.push(s)}
document.querySelector('.bar').addEventListener('click',e=>{const b=e.target.closest('[data-new]');if(b)newStep(b.dataset.new)});
$('undo').onclick=()=>{if(!undo.length)return;st=JSON.parse(undo.pop());full();$('undo').disabled=!undo.length};
$('reset').onclick=()=>{const d=DISHES.find(x=>x.id===st.dish)||DISHES[0];push();loadDish(d.id,1)};
$('clear').onclick=()=>{push();st.steps=[];st.fin='pot';st.eat='all';sel=-1;full()};
$('fin').onchange=e=>{push();st.fin=e.target.value;compute()};$('eat').onchange=e=>{push();st.eat=e.target.value;compute()};

// 选料弹窗
let pickFor=-1,pcat='全部';
const PC=['全部','常用'].concat(FCATS.map(c=>'食材·'+c),CATS);
const COMMON=['cy','salt','ls','lc','bt','xc','lj','cong','jiang','suan','gla','hj','db','dian','qs','hy','xyou'];
function openPick(i){pickFor=i;$('mask').classList.add('on');$('q').value='';pcat=i>=0&&FD[st.steps[i].id]?'食材·'+FD[st.steps[i].id].cat:'常用';renderPick();setTimeout(()=>$('q').focus(),30)}
function renderPick(){$('mcats').innerHTML=PC.map(c=>`<button data-c="${c}" aria-pressed="${c===pcat}">${c.replace('·','：')}</button>`).join('');
  const q=$('q').value.trim();let L=[...Object.values(FD),...Object.values(IT)];
  if(q)L=L.filter(d=>d.name.includes(q)||(d.note||'').includes(q));else if(pcat==='常用')L=COMMON.map(i=>IT[i]);else if(pcat.startsWith('食材·'))L=Object.values(FD).filter(d=>d.cat===pcat.slice(3));else if(pcat!=='全部')L=Object.values(IT).filter(d=>d.cat===pcat);
  $('mpick').innerHTML=L.map(d=>`<button data-id="${d.id}"><b>${esc(d.name)}</b><span>${esc(d.kind==='f'?('食材 · '+d.cat+' · 默认切'+d.cut):(d.note||d.cat))}</span></button>`).join('')||'<p class="note">没有找到</p>'}
$('mcats').onclick=e=>{const b=e.target.closest('button');if(b){pcat=b.dataset.c;$('q').value='';renderPick()}};
$('q').oninput=renderPick;
const closePick=()=>$('mask').classList.remove('on');
$('mclose').onclick=closePick;$('mask').onclick=e=>{if(e.target.id==='mask')closePick()};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePick()});
$('mpick').onclick=e=>{const b=e.target.closest('button[data-id]');if(!b)return;const id=b.dataset.id;push();
  if(pickFor>=0){const s=st.steps[pickFor];s.id=id;if(FD[id]){s.cut=FD[id].cut;if(!s.g||s.g<50)s.g=300}else{delete s.cut;delete s.prep;s.g=IT[id].def}}
  else{const s={t:'add',c:'pot',id,g:FD[id]?300:IT[id].def};if(FD[id])s.cut=FD[id].cut;insert(s)}
  closePick();full()};

// 计算与绘制
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(compute,120)}
function full(){renderDishes();renderSteps();const d=DISHES.find(x=>x.id===st.dish);
  $('dname').textContent=(st.custom||(d?d.name:'自由调配'))+' · 步骤';$('ddesc').textContent=d?d.desc:'';
  $('fin').value=st.fin;$('eat').value=st.eat;$('undo').disabled=!undo.length;compute()}
function paintTimes(){if(!last)return;const {sim}=last;document.querySelectorAll('#steps .st').forEach((li,i)=>{const m=sim.marks[i];const p=sim.potLog[Math.max(0,m.t-1)];li.querySelector('.tm').textContent=clock(m.t)+(m.t>0&&p?` ${Math.round(p.T)}°`:'')})}
function level(k,v){if(k==='salt')return v<1?'无':v<2.5?'淡':v<4?'偏淡':v<6.6?'适中':v<8?'偏咸':'齁咸';
  if(NEG.some(n=>n[0]===k))return v<1?'无':v<2?'轻微':v<3.5?'可察觉':v<5?'明显':'严重';
  return v<.6?'无':v<2?'微':v<4?'轻':v<6?'中':v<8?'重':'极重'}

function compute(){
  let sim,ev;try{sim=simulate(st.steps);ev=evaluate(sim,st.fin,st.eat)}catch(err){console.error(err);return}
  const T=target();const W=warnings(sim,ev);const types=flavorTypes(ev.D,ev.flags);const meth=detectMethods(sim);
  last={sim,ev,T};
  const cmp=T?compare(ev.D,T.D):null;
  $('score').innerHTML=cmp?`${cmp.score}<small> 分 相似度</small>`:'—<small> 自由调配</small>';
  $('lgT').style.display=T?'':'none';
  $('types').innerHTML=types.map((t,i)=>`<span class="tag${i?'':' main'}" title="${esc(t[1])}">${esc(t[0])}</span>`).join('');
  $('method').textContent=meth.length?'工艺：'+meth.map(m=>m.l).join(' → '):'工艺：未加热（凉拌/生腌）';
  const minutes=sim.t/60;
  $('facts').innerHTML=[
   ['成菜色泽',`<span class="sw" style="background:${ev.color.hex}"></span>${ev.color.name}`],
   ['汤汁状态',ev.sauce],['总用时',fmtT(sim.t)],
   ['锅里最高温',Math.round(sim.cs.pot.maxT)+'°C'],['剩余水分 / 油',`${Math.round(ev.water)} g / ${Math.round(ev.oil)} g`],
   ['平均入味',Math.round(ev.absAvg*100)+'%']].map(f=>`<div><b>${f[0]}</b>${f[1]}</div>`).join('');
  let hints=[];if(cmp){for(const [k,d] of cmp.diffs){const f=FIX[k];hints.push(`<li><b>${DN[k]}${d>0?'偏重':'不足'} ${d>0?'+':''}${d.toFixed(1)}</b>：${d>0?(f?'减少'+f[1]:'减少相关调料'):(f&&f[0]?'加'+f[0]:'检查做法')}</li>`)}
    const tt=T.tex;for(const t of ev.tex){const o=tt.find(x=>x.id===t.id);if(o&&o.lab!==t.lab)hints.push(`<li><b>${esc(t.name)}</b>：标准是“${o.lab}”，你的是“${t.lab}”</li>`)}
    if(!hints.length)hints.push('<li>和标准做法几乎一致。试着改一个变量看看会发生什么。</li>')}
  $('hints').innerHTML=hints.slice(0,6).join('');
  drawRadar(ev.D,T&&T.D);drawTemp(sim);
  // 口感
  $('tex').innerHTML=ev.tex.length?`<thead><tr><th>食材</th><th>口感</th><th>表面</th><th class="n">熟度</th><th class="n">入味</th><th class="n">腥膻残留</th></tr></thead><tbody>`+ev.tex.map(t=>`<tr><td>${esc(t.name)}<span class="note"> ${t.cut}${t.coated?' · 上浆':''}</span></td><td><b>${t.lab}</b></td><td>${t.surf||'—'}</td><td class="n">${Math.round(Math.min(1,t.done)*100)}%</td><td class="n">${Math.round(t.abs*100)}%</td><td class="n">${Math.round(t.off*100)}%</td></tr>`).join('')+'</tbody>':'<tr><td class="note">成品里还没有食材。</td></tr>';
  // 拆解
  $('dims').innerHTML=DIMS.concat(NEG).map(([k,n])=>{const v=ev.D[k],t=T?T.D[k]:null;const neg=NEG.some(x=>x[0]===k);
    return `<button class="row${neg?' neg':''}" data-k="${k}" aria-expanded="false"><span>${n}</span><span class="tr"><span class="fill" style="width:${v*10}%"></span>${t!=null?`<span class="tk" style="left:calc(${t*10}% - 1px)"></span>`:''}</span><span class="v">${v.toFixed(1)}</span><span class="d">${level(k,v)}</span></button><div class="srcs" hidden data-s="${k}"></div>`}).join('');
  // 提醒
  const good=[];if(!W.some(w=>w[0]>=1))good.push([-1,'火候和调味没有明显问题。']);
  $('warns').innerHTML=W.concat(good).sort((a,b)=>b[0]-a[0]).map(w=>`<li class="${w[0]<0?'ok':'l'+w[0]}">${esc(w[1])}</li>`).join('');
  aromaPanel($('raroma'),ev.c);
  paintTimes();
  try{localStorage.setItem('tw.last',JSON.stringify(st))}catch(e){}
}
$('dims').onclick=e=>{const b=e.target.closest('.row');if(!b||!last)return;const k=b.dataset.k;const box=b.nextElementSibling;const open=box.hidden;box.hidden=!open;b.setAttribute('aria-expanded',open);
  if(open){const m={};for(const [n,v] of last.ev.src[k]){if(v>0)m[n]=(m[n]||0)+v}const L=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5);const tot=L.reduce((s,x)=>s+x[1],0)||1;
    box.textContent=L.length?'主要来自：'+L.map(([n,v])=>`${n} ${Math.round(v/tot*100)}%`).join('、'):'没有来源'}};

// 雷达
const rs=$('radar').querySelector('svg');let RD=null;
function drawRadar(D,T){RD=[D,T];paintRadar()}
function paintRadar(){if(RD)radarSVG(rs,DIMS,RD[0],RD[1])}
const ro1=new ResizeObserver(paintRadar);ro1.observe(rs);

// 锅温
const ts=$('tchart').querySelector('svg');let TD=null;
function drawTemp(sim){TD=sim;paintTemp()}
function paintTemp(){if(!TD)return;const sim=TD;const W=ts.clientWidth,H=ts.clientHeight;if(!W)return;
  const L=40,Rr=40,Tp=10,B=26,w=W-L-Rr,h=H-Tp-B;const tmax=Math.max(10,sim.t);const hist=sim.hist;const wmax=Math.max(50,...hist.map(p=>p.w));
  const X=t=>L+t/tmax*w,Y=T=>Tp+h-(Math.min(260,T)/260)*h,YW=v=>Tp+h-v/wmax*h;
  let g='';for(const T of[0,100,150,200,250]){g+=`<line x1="${L}" x2="${L+w}" y1="${Y(T)}" y2="${Y(T)}" stroke="var(--line)" ${T===100?'stroke-dasharray="4 3"':''}/><text x="${L-6}" y="${Y(T)+4}" text-anchor="end" font-size="12" fill="var(--mute)">${T}°</text>`}
  g+=`<text x="${L+w+6}" y="${Tp+10}" font-size="12" fill="var(--mute)">${Math.round(wmax)}g</text>`;
  const step=Math.max(1,Math.ceil(hist.length/600));const hs=hist.filter((p,i)=>i%step===0||i===hist.length-1);
  g+=`<path d="M${X(0)},${YW(0)} ${hs.map(p=>`L${X(p.t).toFixed(1)},${YW(p.w).toFixed(1)}`).join(' ')} L${X(tmax)},${YW(0)}Z" fill="var(--soy)" fill-opacity=".22"/>`;
  sim.marks.slice(0,-1).forEach((m,i)=>{if(W<520&&i%2)return;g+=`<line x1="${X(m.t)}" x2="${X(m.t)}" y1="${Tp}" y2="${Tp+h}" stroke="var(--mute)" stroke-opacity=".25"/>`});
  const tickN=W<520?3:6;for(let k=0;k<=tickN;k++){const t=tmax*k/tickN;g+=`<text x="${X(t)}" y="${H-8}" text-anchor="middle" font-size="12" fill="var(--mute)">${clock(t)}</text>`}
  g+=`<path d="${hs.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+','+Y(p.T).toFixed(1)).join(' ')}" fill="none" stroke="var(--red2)" stroke-width="2.2"/>`;
  g+=`<rect x="${L}" y="${Tp}" width="${w}" height="${h}" fill="transparent" id="hit"/>`;ts.innerHTML=g;
  const tip=$('tip');ts.querySelector('#hit').onpointermove=e=>{const r=ts.getBoundingClientRect();const t=(e.clientX-r.left-L)/w*tmax;let best=hist[0];for(const p of hist)if(Math.abs(p.t-t)<Math.abs(best.t-t))best=p;
    let si=0;sim.marks.forEach((m,i)=>{if(m.t<=best.t)si=i});tip.style.display='block';tip.textContent=`${clock(best.t)} · 第${Math.min(si+1,st.steps.length)}步 · ${Math.round(best.T)}°C · 水 ${Math.round(best.w)}g · 油 ${Math.round(best.o)}g`;
    tip.style.left=Math.min(W-200,Math.max(0,e.clientX-r.left-90))+'px';tip.style.top='0px'};
  ts.querySelector('#hit').onpointerleave=()=>tip.style.display='none'}
const ro2=new ResizeObserver(paintTemp);ro2.observe(ts);

// 保存
function mine(){try{return JSON.parse(localStorage.getItem('tw.mine')||'[]')}catch(e){return[]}}
function renderMine(){const M=mine();$('mineList').innerHTML=M.map((m,i)=>`<button class="btn sm" data-m="${i}">${esc(m.name)}</button><button class="btn sm" data-x="${i}" aria-label="删除 ${esc(m.name)}">✕</button>`).join('')}
$('save').onclick=()=>{const n=$('saveName').value.trim()||('我的'+(DISHES.find(d=>d.id===st.dish)||{name:'配方'}).name);const M=mine();M.push({name:n,st:JSON.parse(JSON.stringify(st))});try{localStorage.setItem('tw.mine',JSON.stringify(M));$('saveName').value='';renderMine()}catch(e){$('saveName').value='本机存储不可用'}};
$('mineList').onclick=e=>{const b=e.target.closest('button');if(!b)return;const M=mine();if(b.dataset.m){push();st=JSON.parse(JSON.stringify(M[+b.dataset.m].st));st.custom=M[+b.dataset.m].name;sel=-1;full()}else if(b.dataset.x){M.splice(+b.dataset.x,1);try{localStorage.setItem('tw.mine',JSON.stringify(M))}catch(e){}renderMine()}};
$('copyJ').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(st));$('copyMsg').textContent='已复制'}catch(e){$('imp').value=JSON.stringify(st);$('copyMsg').textContent='复制被拦截，已放进下面的文本框'}};
$('doImp').onclick=()=>{try{const o=JSON.parse($('imp').value);if(!Array.isArray(o.steps))throw 0;
  const ok=o.steps.filter(s=>['add','heat','rest','pour','drain'].includes(s.t)&&(s.t!=='add'||IT[s.id]||FD[s.id]));push();st={dish:DISHES.some(d=>d.id===o.dish)?o.dish:'',steps:ok,fin:CN[o.fin]?o.fin:'pot',eat:o.eat==='drain'?'drain':'all',custom:'导入的配方'};sel=-1;full()}catch(e){$('copyMsg').textContent='无法识别这段配方'}};

$('raroma').innerHTML=AROMA_HTML;
// 供其他模式调用
window.openInEditor=(o)=>{push();st=o;sel=-1;full()};
window.remixRefresh=()=>{paintRadar();paintTemp();const b=$('raroma');if(b._draw)b._draw()};
// 启动
let init=null;try{init=JSON.parse(localStorage.getItem('tw.last')||'null')}catch(e){}
if(init&&Array.isArray(init.steps)&&init.steps.every(s=>s.t!=='add'||IT[s.id]||FD[s.id])){st=init;full()}else loadDish(DISHES[0].id);
renderMine();
}
