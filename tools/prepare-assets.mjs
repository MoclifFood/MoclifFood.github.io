import {mkdir,copyFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'themes/mocliffood/source');
await mkdir(resolve(output,'images'),{recursive:true});
for(const name of await readdir(resolve(root,'assets'))){if(/\.jpg$/.test(name))await copyFile(resolve(root,'assets',name),resolve(output,'images',name));}
await mkdir(resolve(output,'fonts'),{recursive:true});
async function downloadFont(cssUrl,filename,match){
 const css=await fetch(cssUrl,{headers:{'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}}).then(r=>{if(!r.ok)throw Error(`Font CSS ${r.status}`);return r.text();});
 const urls=[...css.matchAll(/url\(['"]?([^)'"\s]+\.woff2[^)'"\s]*)['"]?\)/g)].map(m=>m[1]);
 const selected=match?urls.find(u=>u.includes(match)):filename.startsWith('zodiak')?urls[0]:urls.at(-1);
 const url=selected?new URL(selected,cssUrl).href:null;
 if(!url)throw Error(`No font in ${cssUrl}`);
 const buffer=await fetch(url).then(r=>{if(!r.ok)throw Error(`Font download ${r.status}`);return r.arrayBuffer();});
 await writeFile(resolve(output,'fonts',filename),Buffer.from(buffer));
 await writeFile(resolve(output,'fonts',filename+'.source.txt'),`Source: ${cssUrl}\nFile: ${url}\n\n${css}`);
 console.log(`Saved ${filename}: ${buffer.byteLength} bytes`);
}
await downloadFont('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@100..900&display=swap','hanken-grotesk.woff2');
await downloadFont('https://api.fontshare.com/v2/css?f[]=zodiak@300&display=swap','zodiak-light.woff2');
const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/hankengrotesk/OFL.txt').then(r=>{if(!r.ok)throw Error(`Font license ${r.status}`);return r.text();});
await writeFile(resolve(output,'fonts','Hanken-OFL.txt'),license);
