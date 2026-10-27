// What a job makes, for display: its name, grade and icon id (items, gear and Star Gems, P38, D144). From R2's switch
// (H80) a material or a made item first: 36 material ids are also legacy ids, whose grades differ.
import { farmByLine, gearById, gemById, itemById, lineItem, madeIdentity, madeName, materialById, rpgRework } from '@rpg/domain'

export function outputView(id: string): { name: string; icon: string; grade: number } {
  if (farmByLine()) {
    // The farm by line (FL5): a line item shows its grade; made items as R2's (`madeName` says Arms Gem).
    const line = lineItem(id)
    if (line) return { name: line.name, icon: id, grade: line.grade }
  }
  if (rpgRework('economy')) {
    const material = materialById(id)
    if (material) return { name: material.name, icon: id, grade: 0 }
    const made = madeIdentity(id)
    if (made) return { name: madeName(id)!, icon: id, grade: made.grade }
  }
  const item = itemById(id)
  if (item) return { name: item.name, icon: item.id, grade: item.grade }
  const gem = gemById(id)
  if (gem) return { name: gem.name, icon: gem.id, grade: gem.grade }
  const piece = gearById(id)
  if (piece) return { name: piece.name, icon: piece.id, grade: piece.grade }
  return { name: id, icon: '', grade: 0 }
}
