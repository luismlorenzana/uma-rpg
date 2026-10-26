import { describe, expect, it } from 'vitest'
import { accessoryChoicesV3 } from './accessory-v3'

describe('R2 accessory picker', () => {
  it('puts her signature first, offers ten Orb kinds and her three Bell kinds', () => {
    const choices = accessoryChoicesV3('bell', ['greatsword', 'axe', 'lance'], 'brawler')
    expect(choices.map((choice) => choice.family)).toEqual(['bell', 'pendant', 'orb', 'insignia'])
    expect(choices[0]!.signature).toBe(true)
    expect(choices[0]!.kinds.map((row) => row.label)).toEqual(['Greatsword', 'Axe', 'Lance'])
    expect(choices.find((choice) => choice.family === 'orb')!.kinds).toHaveLength(10)
  })
})
