import { Controller, Get, Inject, NotFoundException, Param, Res } from '@nestjs/common'
import type { Response } from 'express'
import { cacheControlFor, contentTypeFor, safeMasterPath, type MasterSource } from './master-source'

export const MASTER_SOURCE = Symbol('MASTER_SOURCE')

// Serves uma-platform master data releases to the signed-in owner only (architecture §2.2, P6).
@Controller('master')
export class MasterController {
  constructor(@Inject(MASTER_SOURCE) private readonly source: MasterSource) {}

  @Get('*path')
  async read(@Param('path') raw: string | string[], @Res() res: Response): Promise<void> {
    const path = safeMasterPath(Array.isArray(raw) ? raw.join('/') : raw)
    if (!path) throw new NotFoundException('not found')
    const bytes = await this.source.read(path)
    if (!bytes) throw new NotFoundException('not found')
    res.setHeader('Content-Type', contentTypeFor(path))
    res.setHeader('Cache-Control', cacheControlFor(path))
    res.setHeader('Content-Length', String(bytes.byteLength))
    res.end(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength))
  }
}
