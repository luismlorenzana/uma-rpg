import { BadRequestException, Body, ConflictException, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common'
import { parseSavePut, SaveParseError, type SaveEnvelope } from '@rpg/domain'
import { AuthGuard, CurrentUid } from '../auth/auth.guard'
import { RevisionConflict, SAVE_REPOSITORY, type SaveRepository } from './save.repository'

@UseGuards(AuthGuard)
@Controller('save')
export class SaveController {
  constructor(@Inject(SAVE_REPOSITORY) private readonly saves: SaveRepository) {}

  @Get()
  load(@CurrentUid() uid: string): Promise<SaveEnvelope> {
    return this.saves.load(uid)
  }

  /** 409 carries the stored envelope so the client can merge and retry (D32). */
  @Put()
  async put(@CurrentUid() uid: string, @Body() body: unknown): Promise<SaveEnvelope> {
    let request
    try {
      request = parseSavePut(body)
    } catch (err) {
      if (err instanceof SaveParseError) throw new BadRequestException(err.message)
      throw err
    }
    try {
      return await this.saves.put(uid, request.baseRevision, request.save, request.sentSchemaVersion)
    } catch (err) {
      if (err instanceof RevisionConflict) throw new ConflictException({ message: 'revision conflict', current: err.current })
      throw err
    }
  }
}
