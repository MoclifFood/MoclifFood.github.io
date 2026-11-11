import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','public');
if(process.env.GITHUB_ACTIONS){process.on('uncaughtException',error=>{console.error('::error::'+String(error.message).replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A'));process.exitCode=1;});}
const files=[];
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,item.name);if(item.isDirectory())await walk(path);else files.push(path);}}
await walk(root);
const failures=[];
for(const file of files.filter(f=>extname(f)==='.html')){
 const html=await readFile(file,'utf8');
 const headings=[...html.matchAll(/<h1\b/g)];
 if(headings.length!==1)failures.push(`${file}: expected one h1, got ${headings.length}`);
 for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=raw.replaceAll('&amp;','&');
  if(!value||/^(?:https?:|mailto:|tel:|data:|#)/.test(value))continue;
  const path=decodeURIComponent(value.split(/[?#]/)[0]);
  if(!path)continue;
  const target=path.startsWith('/')?resolve(root,'.'+path):resolve(dirname(file),path);
  if(!target.startsWith(root)) {failures.push(`Escaped build root: ${value}`);continue;}
  try{const info=await stat(target);if(info.isDirectory())await stat(resolve(target,'index.html'));}catch{failures.push(`${file}: missing ${value}`);}
 }
}
const index=await readFile(resolve(root,'index.html'),'utf8');
assert(!index.includes('example.com'),'Unconfigured site URL');
assert(!index.includes('CS2 Utility'),'Unfinished draft leaked onto homepage');
const search=JSON.parse(await readFile(resolve(root,'search-index.json'),'utf8'));
assert(search.length>=2,'Search must index the real published articles');
assert(search.every(p=>p.url.startsWith('/')&&p.title&&p.content),'Incomplete search entries');
assert(!search.some(p=>p.title==='CS2 Utility'||p.title==='Hello World'),'Draft or legacy post leaked into search');
for(const path of ['.nojekyll','404.html','archives/index.html','projects/index.html','daily/index.html','about/index.html','search/index.html','credits/index.html','atom.xml','sitemap.xml','fonts/hanken-grotesk.woff2','fonts/zodiak-light.woff2'])await stat(resolve(root,path));
if(failures.length){for(const failure of failures)console.error((process.env.GITHUB_ACTIONS?'::error::':'')+failure);process.exitCode=1;}else console.log(`PASS: ${files.filter(f=>f.endsWith('.html')).length} HTML pages, internal assets and links, ${search.length} search entries, draft isolation and publishing outputs.`);
