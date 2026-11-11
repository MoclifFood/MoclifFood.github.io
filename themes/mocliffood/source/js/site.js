(() => {
  const root=document.documentElement;
  const toggle=document.querySelector('#theme-toggle');
  const applyTheme=light=>{root.dataset.theme=light?'light':'dark';if(toggle){toggle.textContent=light?'切换深色':'切换浅色';toggle.setAttribute('aria-pressed',String(light));}};
  try{applyTheme(localStorage.getItem('workbench-theme-v2')!=='dark');}catch{applyTheme(true);}
  toggle?.addEventListener('click',()=>{const light=root.dataset.theme!=='light';applyTheme(light);try{localStorage.setItem('workbench-theme-v2',light?'light':'dark');}catch{}});

  const filterButtons=[...document.querySelectorAll('[data-filter]')];
  const rows=[...document.querySelectorAll('[data-categories]')];
  const filter=category=>{let visible=0;for(const row of rows){row.hidden=category!=='全部'&&!JSON.parse(row.dataset.categories).includes(category);if(!row.hidden)visible++;}for(const button of filterButtons)button.setAttribute('aria-pressed',String(button.dataset.filter===category));const empty=document.querySelector('#filter-empty');if(empty)empty.hidden=visible!==0;};
  filterButtons.forEach(button=>button.addEventListener('click',()=>{filter(button.dataset.filter);const url=new URL(location.href);if(button.dataset.filter==='全部')url.searchParams.delete('category');else url.searchParams.set('category',button.dataset.filter);history.replaceState(null,'',url);}));
  const initialCategory=new URLSearchParams(location.search).get('category');
  if(initialCategory&&filterButtons.some(b=>b.dataset.filter===initialCategory))filter(initialCategory);

  const form=document.querySelector('#search-form');
  if(form){const input=document.querySelector('#search-input');const results=document.querySelector('#search-results');const status=document.querySelector('#search-status');let indexPromise;let sequence=0;
    const search=async()=>{const current=++sequence;const query=input.value.trim();results.replaceChildren();if(!query){status.textContent='输入关键词开始搜索。';return;}status.textContent='正在查找…';try{indexPromise??=fetch('/search-index.json').then(r=>{if(!r.ok)throw Error('index');return r.json();});const index=await indexPromise;if(current!==sequence)return;const terms=query.toLocaleLowerCase().split(/\s+/);const matched=index.filter(p=>terms.every(term=>(p.title+' '+p.description+' '+p.content).toLocaleLowerCase().includes(term)));status.textContent=matched.length?`找到 ${matched.length} 篇记录。`:'没有找到相关文章，换一个关键词试试。';for(const post of matched){const row=document.createElement('article');row.className='post-row';const meta=document.createElement('p');meta.className='post-meta';meta.textContent=post.kind+' · '+post.date;const title=document.createElement('h2');const link=document.createElement('a');link.href=post.url;link.textContent=post.title;title.append(link);const description=document.createElement('p');description.textContent=post.description||post.content.slice(0,120);row.append(meta,title,description);results.append(row);}}catch{if(current===sequence)status.textContent='搜索暂时不可用，可以从文章归档继续阅读。';}};
    form.addEventListener('submit',event=>{event.preventDefault();const url=new URL(location.href);if(input.value.trim())url.searchParams.set('q',input.value.trim());else url.searchParams.delete('q');history.replaceState(null,'',url);search();});
    input.addEventListener('input',search);input.value=new URLSearchParams(location.search).get('q')||'';if(input.value)search();
  }
  if('IntersectionObserver' in window){
    // Keep native content visible without JavaScript; only fade opacity, never move the page.
    const elements=[...document.querySelectorAll('.reveal, .filter-panel, .site-footer > *, .page-heading > *, .article-heading > *, .article-toc, .prose > *, .empty-daily > *, .daily-page > img, #search-form')];
    const observer=new IntersectionObserver(entries=>{for(const entry of entries){
      const element=entry.target;
      element.classList.toggle('reveal-pending',!entry.isIntersecting&&!element.contains(document.activeElement));
    }}, {rootMargin:'-8% 0px -8% 0px',threshold:0});
    for(const element of elements){
      const rect=element.getBoundingClientRect();
      if(rect.top>=innerHeight||rect.bottom<=0)element.classList.add('reveal-pending');
      element.classList.add('scroll-fade');
      observer.observe(element);
    }
    document.addEventListener('focusin',event=>{
      event.target.closest('.scroll-fade')?.classList.remove('reveal-pending');
    });
  }
})();
