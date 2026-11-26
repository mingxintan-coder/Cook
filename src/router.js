
{const subs={remix:'从经典菜或村驴、隋坡等 1000 多道家常菜起步，拆开每一步看锅温、出香和焦化；按你的口味自动改良，生成自己的菜谱。',stove:'从空锅开始：倒油、开火、下料，时间实时流动。看着锅温和每样东西的出香、焦化、熟度，出锅时评菜并找出最像的经典菜。',book:'你保存的菜谱：改良版、自己设计的配方都在这里，可以重新打开、看菜谱卡或导出。',spice:'自己配香料：选方法和时长，模拟复合香气的前中后调、提取曲线和苦涩，匹配经典香型，告诉你适合做什么菜。'};
function route(){let m=(location.hash||'#remix').slice(1);if(!subs[m])m='remix';document.body.dataset.mode=m;
  for(const k in subs){document.getElementById('v-'+k).hidden=k!==m}
  document.querySelectorAll('.modes a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+m?'page':'false'));
  document.getElementById('sub').textContent=subs[m];
  if(m==='stove')window.stoveShow();else if(m==='book')window.bookShow();else if(m==='spice')window.spiceShow();else window.remixRefresh()}
window.addEventListener('hashchange',route);route();}
