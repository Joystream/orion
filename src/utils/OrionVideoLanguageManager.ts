import {
  detectVideoLanguageWithProvider,
  VIDEO_ORION_LANGUAGE_CURSOR_NAME,
} from './customMigrations/setOrionLanguageProvider'

export class OrionVideoLanguageManager {
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

  async updateOrionVideoLanguage() {
    return detectVideoLanguageWithProvider()
  }

  private async updateLoop(intervalMs: number): Promise<void> {
    while (true) {
      await this.updateOrionVideoLanguage().catch((e) => {
        console.log(`Updating Orion language with provider failed`, e)
      })
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}
