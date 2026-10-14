// Pure source-pixel geometry, shared by the browser and local persistence validation.
export const CROP_ROLES = {vertical:{label:'Full body',ratio:2/3,maxWidth:640,maxHeight:960},splash:{label:'Splash',ratio:16/9,maxWidth:1280,maxHeight:720}}
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
export function fitRect(image, role, {cx=.5,cy=.5,coverage=.96}={}) {
  const ratio=CROP_ROLES[role].ratio
  const width=Math.min(image.width,image.height*ratio)*clamp(coverage,.1,1),height=width/ratio
  return {x:clamp(cx*image.width-width/2,0,image.width-width),y:clamp(cy*image.height-height/2,0,image.height-height),width,height}
}
export function moveRect(rect,image,dx,dy) {
  return {...rect,x:clamp(rect.x+dx,0,image.width-rect.width),y:clamp(rect.y+dy,0,image.height-rect.height)}
}
export function resizeRect(rect,image,role,width,center=true) {
  const ratio=CROP_ROLES[role].ratio,cx=rect.x+rect.width/2,cy=rect.y+rect.height/2
  const limit=center?Math.min(image.width,image.height*ratio):Math.min(image.width-rect.x,(image.height-rect.y)*ratio)
  width=clamp(width,Math.min(16,limit),limit)
  return {x:center?clamp(cx-width/2,0,image.width-width):rect.x,y:center?clamp(cy-width/ratio/2,0,image.height-width/ratio):rect.y,width,height:width/ratio}
}
export function validRect(rect,image,role) {
  return !!CROP_ROLES[role] && rect && ['x','y','width','height'].every(k=>Number.isFinite(rect[k])) &&
    rect.x>=0 && rect.y>=0 && rect.width>=1 && rect.height>=1 && rect.x+rect.width<=image.width+.001 &&
    rect.y+rect.height<=image.height+.001 && Math.abs(rect.width/rect.height-CROP_ROLES[role].ratio)<.001
}
export function outputSize(rect,role) {
  const [w,h]=role==='vertical'?[2,3]:[16,9],spec=CROP_ROLES[role]
  const units=Math.max(0,Math.floor(Math.min(rect.width/w,rect.height/h,spec.maxWidth/w,spec.maxHeight/h)))
  return {width:units*w,height:units*h}
}
