// Persist the local crop executor outside disposable worktrees; never copy any actual content.
import { readFile, copyFile, mkdir, realpath } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { atomicJson } from './ratings.mjs'
const source=dirname(fileURLToPath(import.meta.url))
export async function installExporter(content,from=source) {
  content=await realpath(content)
  const target=join(content,'tools/cast-export');await mkdir(target,{recursive:true})
  for(const file of ['export-crops.mjs','ratings.mjs','authoring-round.mjs','crop-authoring.mjs','authoring-import.mjs','crop-geometry.mjs','pack.mjs'])await copyFile(join(from,file),join(target,file))
  const rootPackage=JSON.parse(await readFile(join(from,'../../package.json')))
  await atomicJson(join(target,'package.json'),{name:'uma-private-crop-export',private:true,type:'module',engines:{node:'>=22'},dependencies:{'@napi-rs/canvas':rootPackage.devDependencies['@napi-rs/canvas']}})
  // JSON is valid YAML. Isolate this private tool so pnpm never installs into the active game's workspace.
  await atomicJson(join(target,'pnpm-workspace.yaml'),{packages:['.']})
  return target
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [content]=process.argv.slice(2);if(!content)throw new Error('Usage: node scripts/cast/install-export.mjs <private-content-folder>')
  console.log(await installExporter(content))
}
