import {execFileSync} from 'node:child_process';
import {mkdir,cp,mkdtemp,stat} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const git=(args,cwd=root)=>execFileSync('git',args,{cwd,stdio:['ignore','pipe','pipe'],encoding:'utf8'}).trim();
await stat(resolve(root,'public/index.html'));
const pending=git(['status','--porcelain','--untracked-files=no']);
if(pending)throw Error('Commit the source changes before publishing.');
const sourceCommit=git(['rev-parse','HEAD']);
git(['fetch','origin','main']);
const expected=git(['rev-parse','FETCH_HEAD']);
const publishRoot=resolve(root,'.publish');
await mkdir(publishRoot,{recursive:true});
const checkout=await mkdtemp(resolve(publishRoot,'pages-'));
if(!checkout.startsWith(publishRoot+sep))throw Error('Invalid publishing path');
git(['worktree','add','--detach',checkout,expected]);
try{
 git(['rm','-r','--ignore-unmatch','--','.'],checkout);
 await cp(resolve(root,'public'),checkout,{recursive:true});
 git(['add','--all'],checkout);
 if(!git(['status','--porcelain'],checkout)){console.log('Published files already match main.');}
 else{
  git(['commit','-m',`Publish website from ${sourceCommit.slice(0,12)}`],checkout);
  const now=git(['ls-remote','origin','refs/heads/main']).split(/\s/)[0];
  if(now!==expected)throw Error('Remote main changed during build. Re-run after reviewing the new commit.');
  git(['push','origin','HEAD:refs/heads/main'],checkout);
  console.log(`Published ${git(['rev-parse','HEAD'],checkout)} from source ${sourceCommit}.`);
 }
 git(['worktree','remove',checkout]);
}catch(error){console.error(`Publishing worktree retained at ${checkout}`);throw error;}
