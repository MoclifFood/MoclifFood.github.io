'use strict';

const visiblePosts = () => hexo.locals.get('posts').sort('date', -1).filter(p => !p.legacy).toArray();
hexo.extend.helper.register('workbench_posts', visiblePosts);
const postCategories = p => p.categories.toArray().map(category => category.name);
hexo.extend.helper.register('post_categories', postCategories);
hexo.extend.helper.register('workbench_categories', () => [...new Set(visiblePosts().flatMap(postCategories))]);
hexo.extend.helper.register('post_kind', p => p.kind || '学习笔记');
hexo.extend.helper.register('post_summary', p => p.description || String(p.excerpt || p.content).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 100));
hexo.extend.helper.register('read_minutes', p => Math.max(1, Math.ceil(String(p.content).replace(/<[^>]+>/g, '').length / 350)));
hexo.extend.generator.register('workbench-index', function(locals) {
  const posts = visiblePosts();
  const escapeXml = s => String(s).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
  const root = hexo.config.url.replace(/\/$/, '');
  const indexed = posts.map(p => ({title:p.title,url:'/'+p.path,kind:p.kind||'学习笔记',date:p.date.format('YYYY-MM-DD'),description:p.description||'',content:String(p.content).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}));
  const paths = [...locals.posts.toArray(), ...locals.pages.toArray()].filter(p=>!p.draft && p.published!==false).map(p=>p.path);
  const urls = [...new Set(['', 'archives/', ...paths])];
  return [
    {path:'search-index.json',data:JSON.stringify(indexed)},
    {path:'.nojekyll',data:''},
    {path:'robots.txt',data:`User-agent: *\nAllow: /\nSitemap: ${root}/sitemap.xml\n`},
    {path:'sitemap.xml',data:`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(p=>`<url><loc>${escapeXml(root+'/'+p)}</loc></url>`).join('')}</urlset>`},
    {path:'atom.xml',data:`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${escapeXml(hexo.config.title)}</title><id>${root}/</id><link href="${root}/atom.xml" rel="self"/><link href="${root}/"/><updated>${(posts[0]?.updated||new Date()).toISOString()}</updated>${posts.slice(0,20).map(p=>`<entry><title>${escapeXml(p.title)}</title><id>${escapeXml(root+'/'+p.path)}</id><link href="${escapeXml(root+'/'+p.path)}"/><updated>${p.updated.toISOString()}</updated><summary>${escapeXml(p.description||'')}</summary></entry>`).join('')}</feed>`}
  ];
});
