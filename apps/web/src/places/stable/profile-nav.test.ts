// The profile's stepper and list (H124): label and name, wrap at both ends, hidden for one Uma or an id outside the list, the
// roster's owned ids in order, and a profile route's parts.
import { describe, expect, it } from 'vitest'
import { profileRoute, rosterList, stepper } from './profile-nav'

describe('the profile\'s stepper (H124)', () => {
  it('says where she is, and who each arrow goes to', () => {
    expect(stepper(['a', 'b', 'c'], 'b')).toEqual({ label: '2/3', name: 'Uma 2 of 3', previous: 'a', next: 'c' })
  })

  it('wraps at both ends', () => {
    expect(stepper(['a', 'b', 'c'], 'a')).toMatchObject({ previous: 'c', next: 'b' })
    expect(stepper(['a', 'b', 'c'], 'c')).toMatchObject({ previous: 'b', next: 'a' })
  })

  it('hides for one Uma and for an id outside the list', () => {
    expect(stepper(['a'], 'a')).toBeNull()
    expect(stepper(['a', 'b'], 'z')).toBeNull()
    expect(stepper([], 'a')).toBeNull()
  })

  it('lists the roster\'s owned Umas in the view\'s order, locked ones left out', () => {
    expect(rosterList([{ id: 'b', uma: {} }, { id: 'x', uma: null }, { id: 'a', uma: {} }])).toEqual(['b', 'a'])
  })

  it('reads a profile route, and nothing on the roster', () => {
    expect(profileRoute('/town/stable/outfit/81001/gear')).toEqual({ id: '81001', tab: 'gear' })
    expect(profileRoute('/town/stable/outfit/81001')).toEqual({ id: '81001', tab: null })
    expect(profileRoute('/town/stable')).toBeNull()
  })
})
