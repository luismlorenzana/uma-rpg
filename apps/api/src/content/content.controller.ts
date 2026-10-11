import { Controller, Get, Inject, NotFoundException, Param, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { contentTypeFor, type MasterSource } from '../master/master-source'
import { contentCacheControl, safeContentPath } from './content-source'

export const CONTENT_SOURCE = Symbol('CONTENT_SOURCE')

// Serves uma-rpg's private content (the PriConne cast, D50) to the signed-in owner only.
@UseGuards(AuthGuard)
@Controller('content')
export class ContentController {
  constructor(@Inject(CONTENT_SOURCE) private readonly source: MasterSource) {}

  @Get('*path')
  async read(@Param('path') raw: string | string[], @Res() res: Response): Promise<void> {
    const path = safeContentPath(Array.isArray(raw) ? raw.join('/') : raw)
    if (!path) throw new NotFoundException('not found')
    const bytes = await this.source.read(path)
    if (!bytes) throw new NotFoundException('not found')
    res.setHeader('Content-Type', contentTypeFor(path))
    res.setHeader('Cache-Control', contentCacheControl(path))
    res.setHeader('Content-Length', String(bytes.byteLength))
    res.end(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength))
  }
}
