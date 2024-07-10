import { EntityManager } from 'typeorm'
import {
  detectVideoLanguageWithProvider,
  updateVideoLanguages,
  VIDEO_ORION_LANGUAGE_CURSOR_NAME,
} from './customMigrations/setOrionLanguageProvider'
import { globalEm } from './globalEm'

export class OrionVideoLanguageManager {
  private videoToDetect: Set<string> = new Set()

  async init(intervalMs: number): Promise<void> {
    if (!VIDEO_ORION_LANGUAGE_CURSOR_NAME) {
      return
    }

    this.updateLoop(intervalMs)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  scheduleVideoForDetection(id: string | null | undefined) {
    if (id) {
      this.videoToDetect.add(id)
    }
  }

  async updateScheduledVideoLanguage(em: EntityManager) {
    if (!this.videoToDetect.size) {
      return
    }

    const videos = await em.query(`
    SELECT id, title, description
    FROM admin.video
    WHERE id in (${[...this.videoToDetect.values()].map((id) => `'${id}'`).join(',')})
    `)

    await updateVideoLanguages(em, videos)
    this.videoToDetect.clear()
  }

  async updateOrionVideoLanguage() {
    return detectVideoLanguageWithProvider()
  }

  private async updateLoop(intervalMs: number): Promise<void> {
    const em = await globalEm
    while (true) {
      await this.updateScheduledVideoLanguage(em).catch((e) => {
        console.log(`Updating scheduled videos Orion language with provider failed`, e)
      })
      await this.updateOrionVideoLanguage().catch((e) => {
        console.log(`Updating Orion language with provider failed`, e)
      })
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}
