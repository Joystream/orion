import { EntityManager } from 'typeorm'
import { OrionOffchainCursor } from '../../model'
import { globalEm } from '../globalEm'
import { predictLanguageForArray } from '../language'

const batchSize = 5 // Adjust the batch size based on your database and network performance

let rowAffected = 0

const VIDEO_ORION_LANGUAGE_CURSOR_NAME = 'video_orion_language'

async function detectVideoLanguageWithProvider() {
  const em: EntityManager = await globalEm
  const cursorEntity: { value: string }[] = await em.query(
    `SELECT value FROM orion_offchain_cursor WHERE cursor_name='${VIDEO_ORION_LANGUAGE_CURSOR_NAME}'`
  )
  const cursor = +(cursorEntity[0]?.value ?? 0)

  const videos: { id: string; title: string; description: string }[] = await em.query(`
    SELECT id, title, description
    FROM admin.video
    ORDER BY id::INTEGER ASC
    OFFSET ${cursor}
    LIMIT ${batchSize}
  `)

  if (!videos.length) {
    console.log('No more videos!')
    return
  }

  const mappedVideos = videos.map((video) => `${video.title} ${video.description}`)

  const predictionForVideos = await predictLanguageForArray(mappedVideos)

  const videosWithDetections = videos.map((video, index) => ({
    ...video,
    detectedLanguage: predictionForVideos[index],
  }))

  const query = `
      UPDATE admin.video AS v SET
        orion_language = c.orion_language
      FROM (VALUES ${videosWithDetections
        .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
        .join(',')}) AS c(orion_language, id)
      WHERE c.id = v.id;
    `

  const queryParams = videosWithDetections.flatMap((update) => [update.detectedLanguage, update.id])

  // Execute batch update
  await em.query(query, queryParams)
  const newCursor = new OrionOffchainCursor({
    cursorName: VIDEO_ORION_LANGUAGE_CURSOR_NAME,
    value: cursor + Math.min(batchSize, videos.length),
  })
  await em.save(newCursor)
  console.log(
    `Updated languages for videos in range ${cursor}-${cursor + Math.min(batchSize, videos.length)}`
  )

  rowAffected += videos.length

  await detectVideoLanguageWithProvider()
}

detectVideoLanguageWithProvider()
  .then(() => console.log(`Update process completed. Rows affected ${rowAffected}`))
  .catch((e) => {
    console.error('process failed', e)
    process.exit(1)
  })
