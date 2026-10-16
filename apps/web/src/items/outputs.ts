// What a job makes, for display: its name, grade and icon id (items, gear and Star Gems, P38, D144).
import { gearById, gemById, itemById } from '@rpg/domain'

export function outputView(id: string): { name: string; icon: string; grade: number } {
  const item = itemById(id)
  if (item) return { name: item.name, icon: item.id, grade: item.grade }
  const gem = gemById(id)
  if (gem) return { name: gem.name, icon: gem.id, grade: gem.grade }
  const piece = gearById(id)
  if (piece) return { name: piece.name, icon: piece.id, grade: piece.grade }
  return { name: id, icon: '', grade: 0 }
}
