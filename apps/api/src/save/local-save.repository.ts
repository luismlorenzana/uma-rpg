import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { parseSave, schemaVersionOf, type Save, type SaveEnvelope } from '@rpg/domain'
import { EMPTY_ENVELOPE, RevisionConflict, type SaveRepository } from './save.repository'

type FileShape = Record<string, { revision: number; save: unknown }>

// Local dev persistence: one JSON file written atomically (tmp + rename), with calls serialized in-process.
export class LocalSaveRepository implements SaveRepository {
  private queue: Promise<unknown> = Promise.resolve()

  constructor(private readonly file: string) {}

  private serialize<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn)
    this.queue = run.catch(() => undefined)
    return run
  }

  private async read(): Promise<FileShape> {
    try {
      return JSON.parse(await readFile(this.file, 'utf8')) as FileShape
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {}
      throw err
    }
  }

  private async write(data: FileShape): Promise<void> {
    await mkdir(dirname(this.file), { recursive: true })
    const tmp = `${this.file}.tmp`
    await writeFile(tmp, JSON.stringify(data, null, 2))
    await rename(tmp, this.file)
  }

  load(uid: string): Promise<SaveEnvelope> {
    return this.serialize(async () => {
      const row = (await this.read())[uid]
      return row ? { revision: row.revision, save: parseSave(row.save) } : EMPTY_ENVELOPE
    })
  }

  put(uid: string, baseRevision: number, save: Save, sentSchemaVersion: number): Promise<SaveEnvelope> {
    return this.serialize(async () => {
      const data = await this.read()
      const row = data[uid]
      const current: SaveEnvelope = row ? { revision: row.revision, save: parseSave(row.save) } : EMPTY_ENVELOPE
      if (current.revision !== baseRevision || sentSchemaVersion < schemaVersionOf(row?.save)) throw new RevisionConflict(current)
      const next = { revision: baseRevision + 1, save }
      data[uid] = next
      await this.write(data)
      return next
    })
  }
}
