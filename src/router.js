
{const subs={remix:'选一道经典菜作底，改调料的种类、用量、下锅顺序和火候，看锅温、出水、焦化怎样一步步改变最终味道。',stove:'从空锅开始：倒油、开火、下料，时间实时流动。看着锅温和每样东西的出香、焦化、熟度，出锅时评菜并找出最像的经典菜。',spice:'自己配香料：选方法和时长，模拟复合香气的前中后调、提取曲线和苦涩，匹配经典香型，告诉你适合做什么菜。'};
function route(){let m=(location.hash||'#remix').slice(1);if(!subs[m])m='remix';document.body.dataset.mode=m;
  for(const k in subs){document.getElementById('v-'+k).hidden=k!==m}
  document.querySelectorAll('.modes a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+m?'page':'false'));
  document.getElementById('sub').textContent=subs[m];
  if(m==='stove')window.stoveShow();else if(m==='spice')window.spiceShow();else window.remixRefresh()}
window.addEventListener('hashchange',route);route();}
