// Synthetic-only crop QA setup. No actual names, sources, votes or portraits.
import { readFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { reviewFixture } from './review-fixture.mjs'
import { atomicJson, packPath } from './ratings.mjs'
import { digest } from './authoring-import.mjs'
import { startCropCalibration } from './crop-authoring.mjs'
export async function cropFixture(content,{counts=[10,10]}={}) {
  const originals=await reviewFixture(join(content,'generated'),{counts})
  const root=join(content,'authoring'),release=join(root,'datasets','synthetic'),file=join(root,'rounds','tiers','ratings.json'),catalogues={},ratings={}
  for(const franchise of ['priconne','azurlane']) {
    const pack=JSON.parse(await readFile(packPath(originals.release,franchise)));ratings[franchise]={}
    for(const [index,member] of pack.members.entries()) {
      const image=member.art,from=join(originals.release,image.path),to=join(release,image.path)
      await mkdir(dirname(to),{recursive:true});await copyFile(from,to)
      image.sha256=digest(await readFile(from));member.face={...image}
      ratings[franchise][member.id]=index%4+1
    }
    await atomicJson(packPath(release,franchise),pack);catalogues[franchise]=digest(await readFile(packPath(release,franchise)))
  }
  await atomicJson(join(release,'dataset.json'),{schemaVersion:1,id:'synthetic',complete:true})
  await atomicJson(file,{schemaVersion:2,mode:'tiers',roundId:'tiers',datasetId:'synthetic',revision:12,ratings})
  await atomicJson(join(dirname(file),'round.json'),{schemaVersion:1,id:'tiers',datasetId:'synthetic',label:'Enemy tiers',votesMode:'tiers',catalogues})
  const project=join(root,'project.json');await atomicJson(project,{schemaVersion:1,datasetId:'synthetic',roundId:'tiers'})
  const baseline=await readFile(file),calibration=await startCropCalibration(content,'calibration')
  return {content,release,file,project,baseline,calibration}
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(await cropFixture(resolve(process.argv[2])))
