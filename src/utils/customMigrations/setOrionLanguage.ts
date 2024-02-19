import { createLogger } from '@subsquid/logger'
import { IsNull } from 'typeorm'
import { Video } from '../../model'
import { globalEm } from '../globalEm'
import { predictLanguage } from '../language'

const logger = createLogger('setOrionLanguage')

async function setOrionLanguage() {
  const em = await globalEm

  const batchSize = 10000
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const videos = await em.find(Video, {
      where: { orionLanguage: IsNull() },
      order: { id: 'ASC' },
      take: batchSize,
      skip: offset,
    })

    if (videos.length === 0) {
      hasMore = false
    } else {
      const updates = videos.map((video) => {
        const languageText = [video.title ?? '', video.description ?? ''].join(' ')
        video.orionLanguage = predictLanguage(languageText)
        return video
      })

      // Save all updates in a single transaction
      await em.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(updates)
      })

      logger.info(`Updated ${updates.length} videos.`)

      offset += videos.length // Prepare the offset for the next batch
    }
  }
}

setOrionLanguage()
  .then(() => logger.info('Update process completed.'))
  .catch(() => {
    logger.error('process failed')
    process.exit(1)
  })
