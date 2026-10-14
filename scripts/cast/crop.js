import { CROP_ROLES, clamp, fitRect, moveRect, resizeRect, outputSize } from '/crop-geometry.mjs'
const $=id=>document.getElementById(id)
const labels={1:'Regular',2:'KeyEnemy',3:'MiniBoss',4:'FinalBoss'},packLabels={priconne:'PriConne',azurlane:'Azur Lane'}
const state={data:null,pack:'priconne',filter:'pending',role:'all',key:'',image:null,busy:false,dirty:false,before:null,undo:[],timer:null,drag:null,transform:null}
const entry=()=>state.data?.entries.find(e=>e.key===state.key)
const member=()=>state.data?.manifest.members.find(m=>m.id===entry()?.id && m.franchise===entry()?.franchise)
const list=()=>state.data?.entries.filter(e=>e.franchise===state.pack && (state.role==='all'||e.role===state.role) &&
  (state.filter==='all'||(state.filter==='pending'?e.status!=='approved':e.status===state.filter)))??[]
const storageKey=()=> 'uma-crop-position-'+state.data?.sessionId
const remember=()=>{try{localStorage.setItem(storageKey(),state.key)}catch{/* Disk holds all actual work. */}}
const fail=error=>{$('error').hidden=false;$('error').querySelector('span').textContent=error.message;$('status').textContent='Not saved'}
const clearError=()=>{$('error').hidden=true}
function enable() {
  for(const element of document.querySelectorAll('button,select,input'))element.disabled=state.busy
  for(const id of ['approve','flag','fit','x','y','width','zoom'])$(id).disabled=state.busy||!entry()||!state.image
  $('undo').disabled=state.busy||!state.undo.length
  $('previous').disabled=state.busy||list().findIndex(e=>e.key===state.key)<=0
  $('next').disabled=state.busy||!list().length
}
function canvasSize(canvas,width,height) {
  const dpr=devicePixelRatio||1
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)
  canvas.style.width=width+'px';canvas.style.height=height+'px'
  const context=canvas.getContext('2d');context.setTransform(dpr,0,0,dpr,0,0);return context
}
function draw() {
  const e=entry(),m=member(),img=state.image
  if(!e||!m||!img)return
  const width=$('source').parentElement.clientWidth-20,height=Math.min(480,width*m.art.height/m.art.width)
  const scale=Math.min(width/m.art.width,height/m.art.height),left=(width-m.art.width*scale)/2,top=(height-m.art.height*scale)/2
  state.transform={scale,left,top}
  const ctx=canvasSize($('source'),width,height),r=e.rect,x=left+r.x*scale,y=top+r.y*scale,w=r.width*scale,h=r.height*scale
  ctx.drawImage(img,left,top,m.art.width*scale,m.art.height*scale)
  ctx.fillStyle='#0009';ctx.fillRect(0,0,width,y);ctx.fillRect(0,y,x,h);ctx.fillRect(x+w,y,width-x-w,h);ctx.fillRect(0,y+h,width,height-y-h)
  ctx.strokeStyle='#f0c15b';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h)
  ctx.strokeStyle='#ffffff66';ctx.lineWidth=1
  for(const part of [1/3,2/3]){ctx.beginPath();ctx.moveTo(x+w*part,y);ctx.lineTo(x+w*part,y+h);ctx.moveTo(x,y+h*part);ctx.lineTo(x+w,y+h*part);ctx.stroke()}
  ctx.fillStyle='#f0c15b';ctx.fillRect(x+w-8,y+h-8,16,16)
  const ratio=CROP_ROLES[e.role].ratio,pw=Math.min($('preview').parentElement.clientWidth-2,360,(innerWidth<=650?270:440)*ratio),ph=pw/ratio
  const preview=canvasSize($('preview'),pw,ph);preview.drawImage(img,r.x,r.y,r.width,r.height,0,0,pw,ph)
  for(const [id,value] of [['x',r.x],['y',r.y],['width',r.width]])if(document.activeElement!==$(id))$(id).value=String(Math.round(value))
  $('x').max=String(Math.floor(m.art.width-r.width));$('y').max=String(Math.floor(m.art.height-r.height))
  $('width').max=String(Math.floor(Math.min(m.art.width,m.art.height*ratio)))
  $('zoom').value=String(clamp(Math.min(m.art.width,m.art.height*ratio)/r.width,1,8))
  const output=outputSize(r,e.role)
  $('output-size').textContent=output.width+' × '+output.height+' px · '+Math.round(r.width)+' × '+Math.round(r.height)+' source px'
  $('approval').textContent=e.status==='approved'?'Approved':e.status==='flagged'?'Needs adjustment':'To review'
}
function beginEdit() {
  if(!state.dirty)state.before={key:entry().key,rect:{...entry().rect},status:entry().status}
  if(['approved','flagged'].includes(state.filter)){state.filter='all';$('filter').value='all'}
  state.dirty=true;entry().status='pending';$('status').textContent='Unsaved';clearError()
}
function changed(rect,autosave=true) {
  beginEdit();entry().rect=rect;draw()
  clearTimeout(state.timer);if(autosave)state.timer=setTimeout(()=>void save(),500)
}
async function save(status=entry()?.status,{recordUndo=true}={}) {
  clearTimeout(state.timer);state.timer=null
  if(state.busy||!entry())return false
  if(!state.dirty&&entry().status===status)return true
  const e=entry(),old=state.before??{key:e.key,rect:{...e.rect},status:e.status}
  state.busy=true;$('status').textContent='Saving';enable()
  try {
    const response=await fetch('/api/crops',{method:'POST',headers:{'Content-Type':'application/json','X-Review-Token':state.data.token},
      body:JSON.stringify({sessionId:state.data.sessionId,revision:state.data.revision,updates:[{key:e.key,rect:e.rect,status}]})})
    const value=await response.json();if(!response.ok)throw new Error(value.error||'Save failed')
    state.data.entries=value.entries;state.data.revision=value.revision
    if(recordUndo){state.undo.push(old);if(state.undo.length>100)state.undo.shift()}
    state.before=null;state.dirty=false;$('status').textContent='Saved';clearError();return true
  }catch(error){fail(error);return false}
  finally{state.busy=false;render()}
}
async function settle(){return !state.busy&&(!state.dirty||await save())}
async function choose(key) {
  if(!await settle())return
  state.key=key;state.image=null;remember();render()
  const m=member();if(!m)return
  const img=new Image(),chosen=key
  img.onload=()=>{if(state.key!==chosen)return;state.image=img;draw();enable()}
  img.onerror=()=>{if(state.key===chosen)fail(new Error('Image unavailable. Reload to retry.'))}
  img.src='/art/'+m.art.path
}
function render() {
  const queue=list(),e=entry(),m=member()
  const options=queue.map(item=>{const unit=state.data.manifest.members.find(u=>u.franchise===item.franchise&&u.id===item.id),option=document.createElement('option');option.value=item.key;option.textContent=unit.name+' · '+CROP_ROLES[item.role].label;return option})
  $('task').replaceChildren(...options);$('task').value=state.key
  const all=state.data.entries.filter(item=>item.franchise===state.pack),approved=all.filter(item=>item.status==='approved').length,flagged=all.filter(item=>item.status==='flagged').length
  const units=state.data.manifest.members.filter(u=>u.franchise===state.pack).length
  const phase=state.data.manifest.phase==='calibration'?'Calibration':'Full roster'
  $('counts').textContent=phase+' · '+units+' units · '+approved+'/'+all.length+' approved'+(flagged?' · '+flagged+' need adjustment':'')
  $('empty').hidden=queue.length>0;$('editor').hidden=!e||!queue.length
  if(!queue.length){$('empty').textContent=state.filter==='pending'?'All crops approved for this franchise':'No matching crops';enable();return}
  $('name').textContent=m.name;$('tier').textContent=labels[m.rating];$('position').textContent=(queue.findIndex(item=>item.key===state.key)+1)+'/'+queue.length
  $('preview-title').textContent=CROP_ROLES[e.role].label+' · '+(e.role==='vertical'?'2:3':'16:9')
  $('source-size').textContent=m.art.width+' × '+m.art.height+' px';$('note').textContent=e.note??''
  $('original').href='/art/'+m.art.path;$('original').setAttribute('aria-label','Open original for '+m.name)
  draw();enable()
}
async function advance(status) {
  if(state.busy||!entry()||!state.image)return
  const before=list(),index=before.findIndex(e=>e.key===state.key),key=state.key
  if(!await save(status))return
  const after=list(),next=after.some(e=>e.key===key)?after[index+1]??after[index]:after[index]??after.at(-1)
  await choose(next?.key??'')
}
async function undo() {
  if(!await settle()||!state.undo.length)return
  const old=state.undo.at(-1);state.filter='all';$('filter').value='all';state.role='all';$('role').value='all'
  state.pack=old.key.split('/')[0];$('pack').value=state.pack
  await choose(old.key);state.before={key:old.key,rect:{...entry().rect},status:entry().status};state.dirty=true;entry().rect={...old.rect}
  if(await save(old.status,{recordUndo:false}))state.undo.pop()
  render()
}
async function load() {
  if(state.dirty&&!confirm('Discard unsaved crop edits and reload?'))return
  try {
    const response=await fetch('/api/crops'),data=await response.json();if(!response.ok)throw new Error(data.error)
    state.data=data;state.dirty=false;state.before=null;state.undo=[];state.busy=false;clearError();$('status').textContent='Saved'
    const packs=[...new Set(data.manifest.members.map(m=>m.franchise))]
    $('pack').replaceChildren(...packs.map(pack=>{const option=document.createElement('option');option.value=pack;option.textContent=packLabels[pack]+' · '+data.manifest.members.filter(m=>m.franchise===pack).length;return option}))
    let cursor;try{cursor=localStorage.getItem(storageKey())}catch{/* Position is optional. */}
    const remembered=data.entries.find(e=>e.key===cursor && e.status!=='approved')
    state.pack=remembered?.franchise??packs.find(pack=>data.entries.some(e=>e.franchise===pack && e.status!=='approved'))??packs[0]
    $('pack').value=state.pack;state.key=''
    await choose(remembered?.key??list()[0]?.key??'')
  }catch(error){fail(error);enable()}
}
function point(event) {
  const box=$('source').getBoundingClientRect(),t=state.transform
  return {x:(event.clientX-box.left-t.left)/t.scale,y:(event.clientY-box.top-t.top)/t.scale}
}
$('source').addEventListener('pointerdown',event=>{
  if(state.busy||!state.image||!entry())return
  event.preventDefault();clearTimeout(state.timer);$('source').focus({preventScroll:true});$('source').setPointerCapture(event.pointerId)
  const p=point(event),r={...entry().rect},threshold=22/state.transform.scale
  const resize=Math.abs(p.x-r.x-r.width)<threshold&&Math.abs(p.y-r.y-r.height)<threshold
  state.drag={start:p,rect:r,resize,pointer:event.pointerId}
  if(!resize&&(p.x<r.x||p.x>r.x+r.width||p.y<r.y||p.y>r.y+r.height)){changed(moveRect(r,member().art,p.x-r.x-r.width/2,p.y-r.y-r.height/2),false);state.drag.rect={...entry().rect}}
})
$('source').addEventListener('pointermove',event=>{
  if(!state.drag||state.busy||state.drag.pointer!==event.pointerId)return
  const p=point(event),drag=state.drag,dx=p.x-drag.start.x,dy=p.y-drag.start.y,ratio=CROP_ROLES[entry().role].ratio
  const rect=drag.resize?resizeRect(drag.rect,member().art,entry().role,drag.rect.width+(dx+dy/ratio)/(1+1/ratio**2),false):moveRect(drag.rect,member().art,dx,dy)
  changed(rect,false)
})
const finishDrag=()=>{state.drag=null;if(state.dirty)void save()}
$('source').addEventListener('pointerup',finishDrag);$('source').addEventListener('pointercancel',finishDrag)
$('zoom').addEventListener('input',()=>{if(!entry())return;const m=member(),max=Math.min(m.art.width,m.art.height*CROP_ROLES[entry().role].ratio);changed(resizeRect(entry().rect,m.art,entry().role,max/Number($('zoom').value)))})
for(const id of ['x','y','width'])$(id).addEventListener('input',()=>{
  if(state.busy)return
  const value=Number($(id).value);if(!Number.isFinite(value)||!entry())return
  const r=entry().rect,m=member();changed(id==='width'?resizeRect(r,m.art,entry().role,value):moveRect(r,m.art,id==='x'?value-r.x:0,id==='y'?value-r.y:0))
})
$('fit').addEventListener('click',()=>changed(fitRect(member().art,entry().role,{coverage:1})))
for(const id of ['pack','filter','role'])$(id).addEventListener('change',async()=>{
  const value=$(id).value;if(!await settle()){ $(id).value=state[id];return }
  state[id]=value;await choose(list()[0]?.key??'')
})
$('task').addEventListener('change',()=>void choose($('task').value))
for(const [id,direction] of [['previous',-1],['next',1]])$(id).addEventListener('click',()=>{const queue=list(),i=queue.findIndex(e=>e.key===state.key);void choose(queue[clamp(i+direction,0,queue.length-1)]?.key??'')})
$('approve').addEventListener('click',()=>void advance('approved'));$('flag').addEventListener('click',()=>void advance('flagged'));$('undo').addEventListener('click',()=>void undo());$('reload').addEventListener('click',()=>void load())
$('export').addEventListener('click',async()=>{
  if(!await settle())return
  try{const response=await fetch('/api/crops/export');if(!response.ok)throw new Error('Export failed');const url=URL.createObjectURL(new Blob([JSON.stringify(await response.json(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=state.data.sessionId+'-crops.json';a.click();URL.revokeObjectURL(url)}catch(error){fail(error)}
})
document.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||/^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)||state.busy||!entry()||!state.image)return
  if(event.key==='Enter'&&event.target.tagName!=='BUTTON'){event.preventDefault();void advance('approved')}
  else if(event.key.toLowerCase()==='z'){event.preventDefault();void undo()}
  else if(event.target===$('source')){
    const r=entry().rect,step=(event.shiftKey?10:1)/state.transform.scale
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();changed(moveRect(r,member().art,event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0,event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0))}
    else if(['+','=','-'].includes(event.key)){event.preventDefault();changed(resizeRect(r,member().art,entry().role,r.width*(event.key==='-'?1.05:.95)))}
  }
})
window.addEventListener('resize',draw)
window.addEventListener('beforeunload',event=>{if(state.dirty||state.busy){event.preventDefault();event.returnValue=''}})
await load()
