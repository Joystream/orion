import { EntityManager } from 'typeorm'
import { OrionOffchainCursor } from '../../model'
import { globalEm } from '../globalEm'
import { predictLanguageWithProvider } from '../language'

const batchSize = 5_000 // Adjust the batch size based on your database and network performance

type VideoUpdateType = {
  id: string
  title: string
  description: string
}

export const VIDEO_ORION_LANGUAGE_CURSOR_NAME = 'video_orion_language'

export async function updateVideoLanguages(em: EntityManager, videos: VideoUpdateType[]) {
  const mappedVideos = videos.map((video) => `${video.title} ${video.description}`)

  const predictionForVideos = await predictLanguageWithProvider(mappedVideos)

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
}

export async function detectVideoLanguageWithProvider() {
  const em: EntityManager = await globalEm
  let cursorEntity: { value: number }[] = await em.query(
    `SELECT value FROM admin.orion_offchain_cursor WHERE cursor_name='${VIDEO_ORION_LANGUAGE_CURSOR_NAME}'`
  )
  while (true) {
    const cursor = +(cursorEntity[0]?.value ?? 0)

    const videos: VideoUpdateType[] = await em.query(`
    SELECT id, title, description
    FROM admin.video
    ORDER BY id::INTEGER ASC
    OFFSET ${cursor}
    LIMIT ${batchSize}
     `)

    if (!videos.length) {
      console.log('No more videos!')
      break
    }

    await updateVideoLanguages(em, videos)
    const newCursor = new OrionOffchainCursor({
      cursorName: VIDEO_ORION_LANGUAGE_CURSOR_NAME,
      value: cursor + Math.min(batchSize, videos.length),
    })
    await em.save(newCursor)
    cursorEntity = [newCursor]
    console.log(
      `Updated languages for videos in range ${cursor}-${
        cursor + Math.min(batchSize, videos.length)
      }`
    )
  }
}
