import { beforeHoneycomb } from './pre-honeycomb.fixture'
// H162: the live switch and a removed v36 capital stage, kept entirely on synthetic data.
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft, replayBattle } from '../rpg/battle/engine'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { rpgBattleExp } from '../rpg/campaign/rewards'
import { capitalChapter, capitalStageIds } from '../world/legacy-capital.fixture'
import { stageExpPay, worldContinent } from '../world/world'
import { actInFight, startFight } from './battle'
import { capitalRunsLive } from './collections'
import { OUTFITS, riftWorldSave, ROSTER, T } from './rift-rules.fixture'
import { newSave, parseSave, parseSaveAsync, SAVE_SCHEMA_VERSION } from './save'
import { emptyWindow, stepDay, withSteps } from './window-record'

describe('capital runs live (H162)', () => {
  it('constructs a current save with empty runs, and no champion masks', async () => {
    expect(SAVE_SCHEMA_VERSION).toBe(38)
    expect(capitalRunsLive()).toBe(true)
    const save = newSave('Capital switch', T(0))
    expect(save.tierWorlds['1']).toMatchObject({ capitalRuns: [], capitals: {} })
    expect(emptyWindow()).not.toHaveProperty('champions')
    expect(parseSave(save)).toEqual(save)
    expect(await parseSaveAsync(save)).toEqual(save)
  })

  it('migrates an open v36 capital fight unchanged, then settles it as a removed regular stage', async () => {
    const continent = worldContinent({ name: 'Synthetic continent', order: 1 })
    const legacy = capitalChapter(continent, ROSTER)
    const id = capitalStageIds('w1', 1).vanguard
    const ready = riftWorldSave(5, 10)
    Object.values(ready.tierWorlds['1']!.umas).forEach((u) => { u.classId = null; u.ranks = { classes: {} } })
    const raw = JSON.parse(JSON.stringify(startFight(ready, legacy, id, OUTFITS, T(1))))
    beforeHoneycomb(raw)
    raw.schemaVersion = 36
    delete raw.tierWorlds['1'].capitalRuns; delete raw.tierWorlds['1'].capitals
    raw.account.windows = { '101': { '1': { ...withSteps(emptyWindow(), ['world-2', 'craft-1'], T(0)), champions: 7 } } }
    raw.tierWorlds['1'].world.run.battle.input.enemies.forEach((e: { stats: { hp: number } }) => { e.stats.hp = 1 })
    const before = structuredClone(raw)
    let save = await parseSaveAsync(raw)
    expect(save).toEqual({ ...before, schemaVersion: 38, account: { ...before.account, windows: { '101': { '1': { steps: before.account.windows['101']['1'].steps } } } },
      tierWorlds: { '1': { ...before.tierWorlds['1'], capitalRuns: [], capitals: {}, regionTeams: {}, parties: [...before.tierWorlds['1'].parties, ...newSave('Empty', T(0)).tierWorlds['1']!.parties.slice(20)] } } })
    expect(save.account.updatedAt).toBe(before.account.updatedAt)
    expect(save.tierWorlds['1']!.world.run.battle).toEqual(before.tierWorlds['1'].world.run.battle)
    const removed: RpgCampaignChapter = { id: legacy.id, title: 'Synthetic capital', tier: 1, order: 1, levelStart: 10, rows: 0, nodes: [] }
    expect(stageExpPay({ waves: undefined })).toBe(1)
    for (let n = 0; n < 100; n++) {
      const battle = save.tierWorlds['1']!.world.run.battle!
      const state = replayBattle(battle.input, battle.actions).state
      const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
      const acted = actInFight(save, removed, autoAction(state, actor.id), T(2))
      save = acted.save
      if (acted.result) {
        expect(acted.result).toMatchObject({ outcome: 'victory', nodeId: id, laurels: 30 })
        expect(acted.result).not.toHaveProperty('capital')
        expect(acted.result.members.every((m) => m.exp === rpgBattleExp('fight', 10, 10))).toBe(true)
        expect(stepDay(save.account.windows!['101']!['1']!, 'world-2')).toBe(T(0).slice(0, 10))
        expect(parseSave(save)).toEqual(save)
        return
      }
    }
    throw new Error('The migrated capital fight did not settle')
  })
})
