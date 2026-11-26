// ===== 菜谱库：经典菜 + 村驴/隋坡等菜单 =====
let MENU=null;const MENUMAP={};let menuP=null;
function recipeById(id){if(!id)return null;id=String(id);if(id.startsWith('m:')){const r=MENUMAP[id.slice(2)];return r&&r.sim?{id,name:r.name,desc:`${r.chef} · ${(r.tag||'').replace(/\{\{([^}]+)\}\}/g,'$1')}`,steps:r.sim.steps,fin:r.sim.fin,eat:r.sim.eat,menu:r}:null}return DISHES.find(d=>d.id===id)||null}
function loadLibrary(){if(menuP)return menuP;menuP=fetch('recipes.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(L=>{MENU=L;for(const r of L)MENUMAP[r.id]=r;return L}).catch(e=>{menuP=null;throw e});return menuP}
{
const $=id=>document.getElementById(id);
const CHEFS=['全部','经典','村驴','隋坡','老东北美食','鞑厨高寒'];let chef='全部',onlyOk=true;const FO={'高':0,'中':1,'低':2};
const clean=s=>String(s||'').replace(/\{\{([^}]+)\}\}/g,'$1');
function openLib(){$('lib').classList.add('on');$('lq').value='';render();$('lstat').textContent=MENU?'':'正在载入菜单…';
  loadLibrary().then(()=>{$('lstat').textContent='';render()}).catch(()=>{$('lstat').textContent='菜单数据载入失败（需要通过网址打开，本地直接打开文件时无法读取）。经典菜仍可用。';render()});setTimeout(()=>$('lq').focus(),30)}
window.openLib=openLib;
function render(){const q=$('lq').value.trim();
  $('lchefs').innerHTML=CHEFS.map(c=>`<button data-c="${c}" aria-pressed="${c===chef}">${c==='老东北美食'?'老东北':c}</button>`).join('')+`<label class="unit" style="margin-left:6px;white-space:nowrap"><input type="checkbox" id="lok"${onlyOk?' checked':''}> 只看能做的</label>`;
  $('lok').onchange=e=>{onlyOk=e.target.checked;render()};
  let rows=[];
  if(chef==='全部'||chef==='经典')for(const d of DISHES)rows.push({id:d.id,name:d.name,chef:'经典 · '+d.cz,tag:d.desc,ok:true,cov:100});
  if(MENU&&chef!=='经典')for(const r of MENU){if(chef!=='全部'&&r.chef!==chef)continue;rows.push({id:'m:'+r.id,name:r.name,chef:r.chef,tag:clean(r.tag),ok:!!r.sim,cov:r.cov,why:r.why,feas:r.sim?r.sim.feas:''})}
  rows.sort((a,b)=>(a.feas?FO[a.feas]:-1)-(b.feas?FO[b.feas]:-1));
  if(q)rows=rows.filter(r=>r.name.includes(q)||r.tag.includes(q)||(MENUMAP[String(r.id).slice(2)]&&JSON.stringify(MENUMAP[String(r.id).slice(2)].groups).includes(q)));
  if(onlyOk)rows=rows.filter(r=>r.ok);
  const n=rows.length;rows=rows.slice(0,150);
  $('llist').innerHTML=rows.map(r=>`<button data-id="${esc(r.id)}"${r.ok?'':' disabled'}><b>${esc(r.name)}</b><span class="lc">${esc(r.chef)}${r.feas?`<span class="feas f${r.feas}">可行性${r.feas}</span>`:''}${r.ok?'':' · '+esc(r.why||'不能模拟')}</span><span>${esc(r.tag.slice(0,70))}</span></button>`).join('')||'<p class="note">没有找到</p>';
  $('lcount').textContent=`共 ${n} 道${n>150?'，显示前 150 道，可搜索缩小':''}`}
$('lchefs').onclick=e=>{const b=e.target.closest('button');if(b){chef=b.dataset.c;render()}};
$('lq').oninput=render;$('lclose').onclick=()=>$('lib').classList.remove('on');$('lib').onclick=e=>{if(e.target.id==='lib')$('lib').classList.remove('on')};
$('llist').onclick=e=>{const b=e.target.closest('button[data-id]');if(!b||b.disabled)return;$('lib').classList.remove('on');if(location.hash&&location.hash!=='#remix')location.hash='remix';window.wsLoad(b.dataset.id)};
// 原文配方面板
window.origPanel=(d)=>{const box=$('orig');if(!d||!d.menu){box.hidden=true;return}const r=d.menu;box.hidden=false;
  const src=(r.src||[]).map(s=>`<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ');
  $('origsum').textContent=`原文配方 · ${r.chef} · 可行性${r.sim.feas||''}（自动转换，用料识别 ${r.cov}%${r.sim.fix?`，火候已自动校正 ${r.sim.fix} 处`:''}）`;
  $('origbody').innerHTML=`<p class="note">文字配方由程序自动转成模拟步骤，空着的用量按常见比例估计（菜谱里标“估”的就是），难免与视频有出入。${r.sim.feas==='低'?'<b>这道菜自动转换的可行性低，做之前请对照原文。</b>':''}${r.unm.length?'未识别的用料：'+esc(r.unm.slice(0,12).join('、')):''}</p>
   ${(r.groups||[]).map(g=>`<p><b>${esc(g[0])}</b>：${g[1].map(it=>esc(it[0])+(it[1]!=null?' '+(Array.isArray(it[1])?it[1].join('–'):it[1])+(it[2]||''):'')+(it[3]?'<span class="note">（'+esc(it[3])+'）</span>':'')).join('，')}</p>`).join('')}
   <ol>${(r.steps||[]).map(s=>`<li>${esc(clean(s))}</li>`).join('')}</ol>${(r.tips||[]).length?`<p class="note">${r.tips.map(esc).join(' ')}</p>`:''}<p class="note">来源：${src}</p>`};
}
