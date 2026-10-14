// Original synthetic geometry for local UI QA/screenshots. Never real-game portraits or votes.
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'
import { atomicJson, snapshotRatings, packPath } from './ratings.mjs'
import { digest } from './authoring-import.mjs'

function portrait(tone) {
  const width=240,height=320,raw=Buffer.alloc((width*4+1)*height)
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const p=y*(width*4+1)+1+x*4
    const head=(x-120)**2+(y-90)**2<38**2
    const body=y>130 && y<270 && Math.abs(x-120)<(270-y)/3+20
    const eye=y>=86 && y<94 && ((x>=102 && x<110)||(x>=132 && x<140))
    const rgb=eye?[32,38,56]:head?[235,196,159]:body?tone:[28,38,54]
    raw[p]=rgb[0];raw[p+1]=rgb[1];raw[p+2]=rgb[2];raw[p+3]=255
  }
  const crc=bytes=>{let value=0xffffffff;for(const byte of bytes){value^=byte;for(let i=0;i<8;i++)value=(value>>>1)^((value&1)?0xedb88320:0)}return(value^0xffffffff)>>>0}
  const chunk=(type,bytes)=>{const t=Buffer.from(type),out=Buffer.alloc(bytes.length+12);out.writeUInt32BE(bytes.length);t.copy(out,4);bytes.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([t,bytes])),out.length-4);return out}
  const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=6
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))])
}
export async function reviewFixture(root,{counts=[4,6]}={}) {
  const release=join(root,'dataset'),file=join(root,'round/ratings.json'),catalogues={}
  for(const [franchise,count] of [['priconne',counts[0]],['azurlane',counts[1]]]) {
    const prefix=franchise==='priconne'?'':franchise+'/',members=[]
    await mkdir(join(release,prefix,'cast'),{recursive:true})
    for(let i=0;i<count;i++) {
      const bytes=portrait([[74,128,169],[154,106,144],[115,157,116]][i%3]),hash=digest(bytes)
      const path=prefix+'cast/synthetic-'+i+'.'+hash.slice(0,8)+'.png'
      await writeFile(join(release,path),bytes)
      members.push({id:'synthetic-'+i,name:'Synthetic '+(i+1)+(i===1?' (Variant)':''),art:{path,width:240,height:320},face:{path,width:240,height:320}})
    }
    const pack={schemaVersion:1,members},path=packPath(release,franchise)
    await atomicJson(path,pack);catalogues[franchise]=digest(await readFile(path))
  }
  const data={schemaVersion:1,revision:0,roundId:'synthetic-round',datasetId:'synthetic-dataset',ratings:{}}
  await atomicJson(join(root,'round/round.json'),{schemaVersion:1,id:data.roundId,datasetId:data.datasetId,label:'Ranking · synthetic round',catalogues,previousRatings:{priconne:{'synthetic-0':2}}})
  await atomicJson(file,data);await snapshotRatings(file,data)
  return {release,file}
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(await reviewFixture(resolve(process.argv[2])))
