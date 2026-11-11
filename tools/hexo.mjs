import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
// Unqualified post dates must resolve identically on Windows and UTC CI runners.
execFileSync(process.execPath,[require.resolve('hexo-cli/bin/hexo'),...process.argv.slice(2)],{cwd:root,stdio:'inherit',env:{...process.env,TZ:'Asia/Shanghai'}});
