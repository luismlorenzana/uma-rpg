// What a job makes, for display: an item shows its own icon; a dish shows its star ingredient's (no dish art yet,
// owner's lean-assets call); gear (S7) shows its main material's.
import { dishById, gearById, itemById, mainFamily, familyById } from '@rpg/domain'

export function outputView(id: string): { name: string; icon: string; grade: number } {
  const item = itemById(id)
  if (item) return { name: item.name, icon: item.id, grade: item.grade }
  const dish = dishById(id)
  if (dish) return { name: dish.name, icon: Object.keys(dish.inputs)[0] ?? '', grade: dish.grade }
  const piece = gearById(id)
  if (piece) return { name: piece.name, icon: familyById(mainFamily(piece.type))?.refined[piece.grade - 1]?.id ?? '', grade: piece.grade }
  return { name: id, icon: '', grade: 0 }
}
