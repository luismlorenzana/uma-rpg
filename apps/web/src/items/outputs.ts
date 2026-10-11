// What a job makes, for display: its name, grade and icon id (items, dishes and gear each have their own art, P38).
import { dishById, gearById, itemById, tokenById } from '@rpg/domain'

export function outputView(id: string): { name: string; icon: string; grade: number } {
  const item = itemById(id)
  if (item) return { name: item.name, icon: item.id, grade: item.grade }
  const dish = dishById(id)
  if (dish) return { name: dish.name, icon: dish.id, grade: dish.grade }
  const piece = gearById(id)
  if (piece) return { name: piece.name, icon: piece.id, grade: piece.grade }
  const token = tokenById(id)
  if (token) return { name: token.name, icon: token.id, grade: 2 * token.band }
  return { name: id, icon: '', grade: 0 }
}
