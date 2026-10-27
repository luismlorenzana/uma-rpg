// What a job makes, for display: its name, grade and icon id (items, gear and Star Gems, P38, D144). From R2's switch
// (H80) a material or a made item first: many material ids are also legacy ids, whose grades differ.
import { gearById, gemById, itemById, lineItem, madeIdentity, madeName, rpgRework } from '@rpg/domain'

export function outputView(id: string): { name: string; icon: string; grade: number } {
  if (rpgRework('economy')) {
    // A line item shows its grade (FL5); a made item its own.
    const line = lineItem(id)
    if (line) return { name: line.name, icon: id, grade: line.grade }
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
