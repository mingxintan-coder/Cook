// ===== 调香料 =====
{
const $=id=>document.getElementById(id);
let B={items:[],m:{method:'water',kg:1,min:60,lid:1,oilT:130,sec:60,form:'whole'},name:''};let pc='主香';
try{const s=JSON.parse(localStorage.getItem('tw.blend')||'null');if(s&&Array.isArray(s.items))B=s}catch(e){}
if(!B.items.length)loadBlend('hs');
function loadBlend(id){const b=BLENDS.find(x=>x.id===id);B={items:Object.entries(b.it).map(([id,g])=>({id,g})),m:Object.assign({kg:1,min:60,lid:1,oilT:130,sec:60,form:'whole'},b.m),name:b.name,from:id}}
$('xpre').innerHTML=BLENDS.map(b=>`<button data-b="${b.id}">${b.name}</button>`).join('');
$('xpre').onclick=e=>{const b=e.target.closest('button');if(!b)return;loadBlend(b.dataset.b);render()};
$('xclear').onclick=()=>{B.items=[];B.name='';B.from=null;render()};
function params(){const m=B.m;let h=`<label>方法 <select data-m="method">${Object.entries(METHODS).map(([k,v])=>`<option value="${k}"${m.method===k?' selected':''}>${v}</option>`).join('')}</select></label>
  <label>用于主料 <input type="number" min="0.1" step="0.5" value="${m.kg}" data-m="kg"> kg</label>`;
  if(m.method==='oil')h+=`<label>油温 <input type="number" min="80" max="260" step="5" value="${m.oilT}" data-m="oilT"> °C</label><label>炸 <input type="number" min="0" step="10" value="${m.sec}" data-m="sec"> 秒</label>`;
  if(m.method==='water')h+=`<label>煮 <input type="number" min="0" step="5" value="${m.min}" data-m="min"> 分钟</label><label><input type="checkbox" data-m="lid"${m.lid?' checked':''}> 加盖</label>`;
  if(m.method==='oil'||m.method==='water')h+=`<label>形态 <select data-m="form"><option value="whole"${m.form!=='powder'?' selected':''}>整粒</option><option value="powder"${m.form==='powder'?' selected':''}>粉末</option></select></label>`;
  $('xparams').innerHTML=h}
$('xparams').addEventListener('change',e=>{const k=e.target.dataset.m;if(!k)return;B.m[k]=e.target.type==='checkbox'?(e.target.checked?1:0):(e.target.tagName==='SELECT'?e.target.value:+e.target.value);if(k==='method'||k==='form')render();else calc()});
$('xparams').addEventListener('input',e=>{const k=e.target.dataset.m;if(!k||e.target.tagName==='SELECT'||e.target.type==='checkbox')return;B.m[k]=+e.target.value;calc()});
function list(){$('xlist').innerHTML=B.items.length?B.items.map((it,i)=>{const d=SPX[it.id];const mx=Math.max(d.max*2,it.g/Math.max(.1,B.m.kg)*1.2)*Math.max(.1,B.m.kg);
  return `<li data-i="${i}"><span class="xn"><b>${d.name}</b><span class="role">${d.role}</span></span><input type="range" min="0" max="${+mx.toFixed(1)}" step="${d.max<2?.1:.5}" value="${it.g}" data-k="r" aria-label="${d.name}用量"><input type="number" min="0" step="${d.max<2?.1:.5}" value="${it.g}" data-k="n" aria-label="${d.name}克数"><span class="unit">g</span><button class="x" data-k="del" aria-label="移除${d.name}">✕</button><span class="note xt">${d.tip}</span></li>`}).join(''):'<li class="note">还没有香料。从下面挑。</li>'}
$('xlist').addEventListener('input',e=>{const li=e.target.closest('li[data-i]');if(!li)return;const i=+li.dataset.i;const v=Math.max(0,+e.target.value||0);B.items[i].g=v;
  li.querySelector(e.target.dataset.k==='r'?'[data-k=n]':'[data-k=r]').value=v;B.from=null;calc()});
$('xlist').addEventListener('click',e=>{const b=e.target.closest('[data-k=del]');if(!b)return;B.items.splice(+b.closest('li').dataset.i,1);B.from=null;render()});
function shelf(){$('xcats').innerHTML=Object.keys(SCATS).map(c=>`<button data-c="${c}" aria-pressed="${c===pc}">${c}</button>`).join('');
  const have=new Set(B.items.map(i=>i.id));$('xshelf').innerHTML=SCATS[pc].map(id=>{const d=SPX[id];return `<button data-id="${id}"${have.has(id)?' aria-pressed="true"':''}><b>${d.name}</b><span>${esc(d.tip)}</span></button>`}).join('')}
$('xcats').onclick=e=>{const b=e.target.closest('button');if(b){pc=b.dataset.c;shelf()}};
$('xshelf').onclick=e=>{const b=e.target.closest('button[data-id]');if(!b)return;const id=b.dataset.id;const ex=B.items.find(i=>i.id===id);
  if(ex)ex.g=+(ex.g+SPX[id].max*.3*B.m.kg).toFixed(1);else B.items.push({id,g:+(SPX[id].max*.5*Math.max(.1,B.m.kg)).toFixed(1)});B.from=null;render()};
function render(){params();list();shelf();calc()}

let curve=null,info=null;
function calc(){info=blendInfo(B.items,B.m);
  radarSVG($('xradar').querySelector('svg'),NOTES,info.D,B.from?blendProfile(BLENDS.find(b=>b.id===B.from)).D:null,{color:'var(--soy)'});
  $('xdesc').textContent=describe(info);
  $('xlayers').innerHTML=Object.entries(info.layers).map(([k,v])=>`<div><b>${k}</b>${v.length?v.map(x=>`${x[0]} <span class="note">${x[1].toFixed(1)}</span>`).join('<br>'):'<span class="note">—</span>'}</div>`).join('');
  const cols=['#9b4a1c','#c8321e','#d9a321','#4c7a3c','#6a4a8a','#2f6f8a','#8a6a3a','#b86a8a'];
  $('xshare').innerHTML=info.share.filter(s=>s[1]>.005).map(([id,v],i)=>`<div class="srow"><span>${SPX[id].name}</span><span class="tr"><span class="fill" style="width:${v*100}%;background:${cols[i%cols.length]}"></span></span><span class="v">${Math.round(v*100)}%</span></div>`).join('')||'<p class="note">—</p>';
  curve=blendCurve(B.items,B.m);$('xcurvebox').hidden=!curve;if(curve)paintCurve();
  const near=matchBlends(info).slice(0,3);
  $('xmatch').innerHTML=near.map((n,i)=>`<div class="ncard${i?'':' first'}"><b>${n.b.name}</b><span class="big2">${n.score}</span><span class="note">${n.b.use}</span></div>`).join('');
  const kgTot=B.items.reduce((a,i)=>a+i.g,0)/Math.max(.1,B.m.kg);
  const dishes=[];const seen=new Set();for(const n of near)if(n.score>=60)for(const d of n.b.dishes)if(!seen.has(d)){seen.add(d);dishes.push([d,n.b.name])}
  $('xdish').innerHTML=(dishes.slice(0,8).map(([d,b])=>`<span class="tag" title="来自 ${esc(b)} 风格">${esc(d)}</span>`).join('')||'<span class="note">和经典香型差别较大，参考下面的方向。</span>');
  $('xrules').innerHTML=dishRules(info).map(r=>`<li><b>${r[0]}</b>：${r[1]}</li>`).join('')+`<li><b>用量</b>：按当前比例，每 1kg 主料约用 ${kgTot.toFixed(1)}g 这包料${B.m.method==='water'?'（配 2–3L 水）':''}。</li>`;
  const W=blendWarnings(B.items,B.m,info);
  if(info.col.red>2)W.push([-1,'带红色素（辣椒/紫草），成菜偏红亮。']);if(info.col.yellow>2)W.push([-1,'带黄色素（姜黄/栀子），成菜偏黄。']);
  $('xwarn').innerHTML=W.sort((a,b)=>b[0]-a[0]).map(w=>`<li class="${w[0]<0?'ok':'l'+w[0]}">${esc(w[1])}</li>`).join('')||'<li class="ok">配比合理，没有明显问题。</li>';
  $('xname').placeholder=B.name?B.name+'（我的版本）':'给这包料起个名';
  try{localStorage.setItem('tw.blend',JSON.stringify(B))}catch(e){}}
function paintCurve(){const s=$('xcurve').querySelector('svg');const W=s.clientWidth,H=s.clientHeight;if(!W||!curve)return;
  const P=curve.pts;const L=36,R=12,T=10,Bm=24,w=W-L-R,h=H-T-Bm;const tmax=P[P.length-1][0]||1;const amax=Math.max(10,...P.map(p=>p[1]));
  const X=t=>L+t/tmax*w,Ya=v=>T+h-v/amax*h,Yb=v=>T+h-v/10*h;const best=bestTime(curve);const now=B.m.method==='water'?(+B.m.min||0):(+B.m.sec||0);
  let g='';for(const v of[0,.5,1])g+=`<line x1="${L}" x2="${L+w}" y1="${T+h*(1-v)}" y2="${T+h*(1-v)}" stroke="var(--line)"/>`;
  g+=`<path d="${P.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+','+Ya(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="var(--soy)" stroke-width="2.5"/>`;
  g+=`<path d="${P.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+','+Yb(p[2]).toFixed(1)).join(' ')}" fill="none" stroke="var(--warn)" stroke-width="2" stroke-dasharray="5 3"/>`;
  g+=`<line x1="${X(best)}" x2="${X(best)}" y1="${T}" y2="${T+h}" stroke="var(--ok)" stroke-width="2"/><text x="${Math.min(X(best)+4,W-90)}" y="${T+14}" font-size="12" fill="var(--ok)">建议 ${best}${curve.unit}</text>`;
  if(now<=tmax)g+=`<circle cx="${X(now)}" cy="${Ya(P.reduce((a,p)=>Math.abs(p[0]-now)<Math.abs(a[0]-now)?p:a)[1])}" r="5" fill="var(--red2)"/>`;
  for(let k=0;k<4;k++){const t=tmax*k/4;g+=`<text x="${X(t)}" y="${H-6}" text-anchor="middle" font-size="12" fill="var(--mute)">${Math.round(t)}</text>`}
  g+=`<text x="${L+w}" y="${H-6}" text-anchor="end" font-size="12" fill="var(--mute)">${curve.unit}</text>`;s.innerHTML=g;
  $('xbest').textContent=`香气（实线）在约 ${best}${curve.unit}时最平衡，之后苦涩（虚线）上升快于香气。红点是你当前设定。`}
const ro=new ResizeObserver(()=>{if(info){radarSVG($('xradar').querySelector('svg'),NOTES,info.D,B.from?blendProfile(BLENDS.find(b=>b.id===B.from)).D:null,{color:'var(--soy)'});paintCurve()}});ro.observe($('xradar'));ro.observe($('xcurve'));
$('xsend').onclick=()=>{if(!B.items.length)return;const nm=($('xname').value.trim()||(B.name?B.name+'(自配)':'自配香料')).slice(0,16);
  const spec=blendToSeasoning(nm,B.items,B.m,info);if(!spec)return;const id='mx'+Date.now().toString(36);registerMix(id,spec);MIXES.push({id,spec});saveMixes();
  $('xsent').textContent=`已加入调料架：“自配·${nm}”，在另两个模式的“香料”分类里可以找到，建议每 500g 主料约 ${spec.def}g。`;$('xname').value=''};
window.spiceShow=render;
}
